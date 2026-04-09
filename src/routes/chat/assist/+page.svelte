<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { t } from '$lib/i18n.svelte';
	import { addClaim } from '$lib/claims.svelte';
	import { getAgent } from '$lib/agents';
	import {
		startVoiceSession,
		stopVoiceSession,
		toggleMic,
		type TranscriptEntry,
		type ConnectionStatus
	} from '$lib/voice';

	const agentKey = page.url.searchParams.get('agent');
	const agent = getAgent(agentKey);

	let connectionStatus: ConnectionStatus = $state('idle');
	let messages: TranscriptEntry[] = $state([]);
	let isMicEnabled = $state(true);
	let botSpeaking = $state(false);
	let userSpeaking = $state(false);
	let isProcessing = $state(false);
	let errorMessage = $state('');
	let messagesEl: HTMLDivElement | undefined = $state();
	let callData: Record<string, unknown> | null = $state(null);
	let currentBotMsgIdx = -1; // tracks the active bot LLM streaming message
	let currentUserMsgIdx = -1; // tracks the active user interim message
	let lastFinalUserMsgIdx = -1; // tracks the last finalized user msg in current turn (for appending)

	function formatMarkdown(text: string): string {
		return text
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
			.replace(/\*(.+?)\*/g, '<em>$1</em>')
			.replace(/\n/g, '<br/>');
	}

	function scrollToBottom() {
		if (messagesEl) {
			requestAnimationFrame(() => {
				messagesEl!.scrollTop = messagesEl!.scrollHeight;
			});
		}
	}

	async function connect() {
		await startVoiceSession({
			onStatusChange: (status) => {
				const wasConnected = connectionStatus === 'connected';
				connectionStatus = status;
				if (status === 'connected') {
					isProcessing = false;
				}
				// Bot ended the call (disconnected after being connected) → save claim & route to success
				if (status === 'disconnected' && wasConnected) {
					stopVoiceSession();
					const recordId = agent.idPrefix + Math.floor(100000 + Math.random() * 900000);
					// Build title from first two card fields
					const parts = agent.cardFields
						.slice(0, 2)
						.map(f => callData?.[f.key] as string)
						.filter(Boolean);
					const title = parts.join(' — ') || `${agent.name} session`;
					// Format amount if there's a currency field
					const currencyField = agent.cardFields.find(f => f.format === 'currency');
					const amount = currencyField && callData?.[currencyField.key]
						? `₹${Number(callData[currencyField.key]).toLocaleString('en-IN')}`
						: '';
					addClaim({
						id: recordId,
						title,
						amount,
						status: 'new',
						date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
						hospital_name: callData?.hospital_name as string | undefined,
						incident: callData?.incident as string | undefined
					});
					setTimeout(() => goto(`/chat/success?agent=${agent.key}`), 1500);
				}
			},
			onTranscript: (entry) => {
				if (entry.role === 'assistant') {
					if (entry.final) {
						// Finalize: update existing streaming entry or append
						if (currentBotMsgIdx >= 0 && currentBotMsgIdx < messages.length) {
							messages[currentBotMsgIdx] = entry;
							messages = messages;
						} else {
							messages = [...messages, entry];
						}
						currentBotMsgIdx = -1;
					} else {
						// Streaming: update in-place or create new
						if (currentBotMsgIdx >= 0 && currentBotMsgIdx < messages.length) {
							messages[currentBotMsgIdx] = entry;
							messages = messages;
						} else {
							messages = [...messages, entry];
							currentBotMsgIdx = messages.length - 1;
						}
					}
				} else {
					// User transcript — append to same turn until bot speaks
					if (entry.final) {
						// Append to previous finalized user msg in this turn
						if (lastFinalUserMsgIdx >= 0 && lastFinalUserMsgIdx < messages.length) {
							const prev = messages[lastFinalUserMsgIdx];
							const merged = { ...entry, text: prev.text + ' ' + entry.text };
							if (currentUserMsgIdx >= 0 && currentUserMsgIdx < messages.length) {
								// Replace interim with merged
								messages[currentUserMsgIdx] = merged;
							} else {
								messages[lastFinalUserMsgIdx] = merged;
							}
							lastFinalUserMsgIdx = currentUserMsgIdx >= 0 ? currentUserMsgIdx : lastFinalUserMsgIdx;
							messages = messages;
						} else if (currentUserMsgIdx >= 0 && currentUserMsgIdx < messages.length) {
							messages[currentUserMsgIdx] = entry;
							lastFinalUserMsgIdx = currentUserMsgIdx;
							messages = messages;
						} else {
							messages = [...messages, entry];
							lastFinalUserMsgIdx = messages.length - 1;
						}
						currentUserMsgIdx = -1;
					} else {
						if (currentUserMsgIdx >= 0 && currentUserMsgIdx < messages.length) {
							// Update interim in-place, prepend previous final text
							const prefix = lastFinalUserMsgIdx >= 0 && lastFinalUserMsgIdx < messages.length
								? messages[lastFinalUserMsgIdx].text + ' '
								: '';
							messages[currentUserMsgIdx] = { ...entry, text: prefix + entry.text };
							messages = messages;
						} else {
							// New interim entry
							const prefix = lastFinalUserMsgIdx >= 0 && lastFinalUserMsgIdx < messages.length
								? messages[lastFinalUserMsgIdx].text + ' '
								: '';
							messages = [...messages, { ...entry, text: prefix + entry.text }];
							currentUserMsgIdx = messages.length - 1;
						}
					}
				}
				isProcessing = false;
				scrollToBottom();
			},
			onBotReady: () => {
				isProcessing = false;
			},
			onBotStartedSpeaking: () => {
				botSpeaking = true;
				isProcessing = false;
				// Bot turn started — reset user turn merging
				lastFinalUserMsgIdx = -1;
				currentUserMsgIdx = -1;
			},
			onBotStoppedSpeaking: () => {
				botSpeaking = false;
			},
			onUserStartedSpeaking: () => {
				userSpeaking = true;
				// New user turn — next bot response should be a fresh entry
				currentBotMsgIdx = -1;
			},
			onUserStoppedSpeaking: () => {
				userSpeaking = false;
				isProcessing = true; // waiting for bot response after user spoke
			},
			onFunctionCall: (data) => {
				console.log('[FunctionCall]', data.functionName, JSON.stringify(data.args, null, 2));
				if (data.functionName === agent.functionCallName && Object.keys(data.args).length > 0) {
					callData = data.args;
					scrollToBottom();
				}
			},
			onServerMessage: (message) => {
				console.log('[ServerMessage]', message.type, JSON.stringify(message, null, 2));
			},
			onError: (err) => {
				errorMessage = err;
			}
		}, agent.key);
	}

	function handleToggleMic() {
		isMicEnabled = !isMicEnabled;
		toggleMic(isMicEnabled);
	}

	async function handleEndCall() {
		await stopVoiceSession();
		connectionStatus = 'disconnected';
		window.location.href = '/chat';
	}

	onMount(() => {
		connect();
	});

	onDestroy(() => {
		stopVoiceSession();
	});
</script>

<svelte:head>
	<title>Aarokya - Live AI Assistance</title>
</svelte:head>

<style>
	/* ── Page shell ── */
	.page {
		background: #f4f7f7;
		font-family: 'Inter', sans-serif;
		color: #191c1d;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	/* ── Top bar ── */
	.topbar {
		position: sticky;
		top: 0;
		z-index: 50;
		background: rgba(255,255,255,0.7);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		border-bottom: 1px solid rgba(189,201,200,0.2);
	}
	.topbar-inner {
		max-width: 28rem;
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 8px 24px;
	}
	.topbar-left {
		display: flex;
		align-items: center;
		gap: 12px;
	}
	.pulse-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: #006565;
		animation: pulse 2s cubic-bezier(0.4,0,0.6,1) infinite;
	}
	.topbar-title {
		font-family: 'Manrope', sans-serif;
		font-weight: 700;
		font-size: 12px;
		letter-spacing: -0.01em;
		color: #191c1d;
	}
	.secure-badge {
		display: flex;
		align-items: center;
		gap: 6px;
		background: #edeeef;
		padding: 4px 10px;
		border-radius: 9999px;
	}
	.secure-badge .material-symbols-outlined {
		font-size: 14px;
		color: #006565;
		font-weight: 700;
	}
	.secure-badge span:last-child {
		font-size: 9px;
		font-weight: 900;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: #3e4949;
	}

	/* ── Main ── */
	.main {
		max-width: 28rem;
		margin: 0 auto;
		width: 100%;
		display: flex;
		flex-direction: column;
		flex-grow: 1;
		height: calc(100vh - 56px);
		overflow: hidden;
	}

	/* ── Participants ── */
	.participants {
		padding: 8px 16px;
		display: flex;
		gap: 8px;
		justify-content: center;
	}
	.participant-card {
		background: #fff;
		padding: 6px 10px;
		border-radius: 12px;
		box-shadow: 0 1px 2px rgba(0,0,0,0.05);
		border: 1px solid #fff;
		display: flex;
		align-items: center;
		gap: 8px;
		position: relative;
		overflow: hidden;
		flex: 1;
		max-width: 150px;
	}
	.participant-card.ai::before {
		content: '';
		position: absolute;
		inset: 0;
		background: rgba(0,101,101,0.05);
		opacity: 0.5;
	}
	.avatar-wrap {
		position: relative;
		flex-shrink: 0;
	}
	.avatar {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		object-fit: cover;
	}
	.avatar-ai {
		border: 2px solid rgba(0,101,101,0.2);
		animation: pulse-ring 2s cubic-bezier(0.4,0,0.6,1) infinite;
	}
	.avatar-text {
		display: flex;
		align-items: center;
		justify-content: center;
		background: #006565;
		color: #fff;
		font-family: 'Manrope', sans-serif;
		font-weight: 800;
		font-size: 14px;
	}
	.avatar-user {
		border: 2px solid #e1e3e4;
		filter: grayscale(1);
	}
	.waveform-badge {
		position: absolute;
		bottom: -2px;
		right: -2px;
		background: #66dd8b;
		padding: 2px;
		border-radius: 6px;
		border: 1px solid #fff;
		box-shadow: 0 0 15px rgba(102,221,139,0.5);
	}
	.waveform-bars {
		display: flex;
		gap: 1px;
		align-items: flex-end;
		height: 8px;
		width: 12px;
	}
	.waveform-bar {
		width: 2px;
		background: #006833;
		border-radius: 1px;
		animation: waveform 1.2s ease-in-out infinite;
	}
	.participant-name {
		font-family: 'Manrope', sans-serif;
		font-weight: 700;
		font-size: 10px;
		color: #191c1d;
		line-height: 1.2;
	}
	.participant-status {
		font-size: 7px;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.025em;
	}
	.status-speaking { color: #006565; }
	.status-listening { color: #3e4949; }

	/* ── Transcript ── */
	.transcript {
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		padding: 4px 16px 16px;
		min-height: 0;
		overflow: hidden;
	}
	.transcript-divider {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-bottom: 10px;
	}
	.transcript-divider hr {
		flex-grow: 1;
		border: none;
		height: 1px;
		background: rgba(189,201,200,0.4);
	}
	.transcript-divider span {
		font-size: 9px;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: #6e7979;
		white-space: nowrap;
	}
	.messages {
		display: flex;
		flex-direction: column;
		gap: 12px;
		flex-grow: 1;
		min-height: 0;
		overflow-y: auto;
		padding-bottom: 30vh;
		scrollbar-width: none;
		-ms-overflow-style: none;
		transition: padding-bottom 0.3s ease;
	}
	.messages.has-incident {
		padding-bottom: 55vh;
	}
	.messages::-webkit-scrollbar {
		display: none;
	}
	.msg { display: flex; flex-direction: column; gap: 4px; }
	.msg-ai { align-items: flex-start; max-width: 85%; }
	.msg-user { align-items: flex-end; margin-left: auto; max-width: 85%; }
	.msg-bubble {
		padding: 10px 14px;
		border-radius: 14px;
		font-size: 13px;
		line-height: 1.5;
	}
	.msg-bubble-ai {
		background: #fff;
		border-top-left-radius: 0;
		box-shadow: 0 1px 2px rgba(0,0,0,0.05);
		border: 1px solid rgba(255,255,255,0.5);
		color: #3e4949;
		font-weight: 500;
	}
	.msg-bubble-user {
		background: #006565;
		border-top-right-radius: 0;
		box-shadow: 0 4px 6px rgba(0,101,101,0.1);
		color: #fff;
		font-weight: 600;
	}
	.msg-meta {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 0 4px;
	}
	.msg-meta-name {
		font-size: 8px;
		font-weight: 900;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: #006565;
	}
	.msg-meta-name-user {
		color: #3e4949;
	}
	.msg-meta-time {
		font-size: 8px;
		font-weight: 500;
		color: #6e7979;
	}
	.processing {
		display: flex;
		align-items: flex-start;
		gap: 12px;
		padding-top: 4px;
	}
	.processing-pill {
		background: #e7e8e9;
		padding: 8px 12px;
		border-radius: 12px;
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.processing-dots {
		display: flex;
		gap: 2px;
	}
	.processing-dot {
		width: 4px;
		height: 4px;
		border-radius: 50%;
		background: #006565;
		animation: bounce 1s ease-in-out infinite;
	}
	.processing-text {
		font-size: 10px;
		font-weight: 700;
		color: #3e4949;
		letter-spacing: 0.025em;
		font-style: italic;
	}

	/* ── Incident card ── */
	.incident-card {
		background: #fff;
		border-radius: 24px;
		padding: 16px;
		box-shadow: 0 20px 40px -12px rgba(0,0,0,0.1);
		border: 1px solid #fff;
	}
	.incident-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 16px;
	}
	.incident-title {
		font-family: 'Manrope', sans-serif;
		font-weight: 800;
		font-size: 14px;
		color: #191c1d;
		letter-spacing: -0.01em;
	}
	.incident-id {
		color: #6e7979;
		font-size: 11px;
		font-weight: 400;
		margin-left: 4px;
	}
	.incident-sync {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-top: 2px;
	}
	.incident-sync-text {
		font-size: 9px;
		color: #3e4949;
		font-weight: 500;
		white-space: nowrap;
	}
	.progress-bar-wrap {
		display: flex;
		align-items: center;
		gap: 6px;
	}
	.progress-bar {
		width: 64px;
		height: 4px;
		background: #edeeef;
		border-radius: 9999px;
		overflow: hidden;
	}
	.progress-bar-fill {
		height: 100%;
		width: 50%;
		background: #006565;
		border-radius: 9999px;
	}
	.progress-pct {
		font-size: 9px;
		font-weight: 700;
		color: #006565;
	}
	.live-badge {
		background: rgba(102,221,139,0.2);
		color: #006833;
		padding: 2px 8px;
		border-radius: 9999px;
		font-size: 8px;
		font-weight: 900;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		display: flex;
		align-items: center;
		gap: 4px;
		flex-shrink: 0;
	}
	.live-badge-dot {
		width: 4px;
		height: 4px;
		border-radius: 50%;
		background: #006833;
		animation: pulse 2s cubic-bezier(0.4,0,0.6,1) infinite;
	}
	.incident-fields {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.field-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 8px;
		background: #fff;
		border-radius: 12px;
		border: 1px solid rgba(189,201,200,0.1);
	}
	.field-row-left {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.field-icon {
		width: 32px;
		height: 32px;
		border-radius: 8px;
		background: rgba(0,101,101,0.1);
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.field-icon .material-symbols-outlined {
		font-size: 16px;
		color: #006565;
	}
	.field-label {
		font-size: 8px;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: #6e7979;
	}
	.field-value {
		font-family: 'Manrope', sans-serif;
		font-weight: 700;
		font-size: 12px;
		color: #191c1d;
	}
	.field-check {
		font-size: 16px;
		color: #006833;
	}
	.field-grid {
		display: flex;
		gap: 8px;
	}
	.field-grid-item {
		flex: 1;
		min-width: 0;
		padding: 8px;
		border-radius: 12px;
		border: 1px solid rgba(189,201,200,0.1);
	}
	.field-grid-issue {
		background: #fff;
	}
	.field-grid-hospital {
		background: rgba(0,101,101,0.05);
		border-color: rgba(0,101,101,0.2);
		animation: pulse 2s cubic-bezier(0.4,0,0.6,1) infinite;
	}
	.field-grid-hospital .field-label { color: #006565; }
	.field-grid-hospital-inner {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.field-grid-hospital-inner .material-symbols-outlined {
		font-size: 14px;
		color: #006565;
		font-weight: 700;
		flex-shrink: 0;
	}

	/* ── Bottom bar ── */
	.bottom-area {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 50;
		pointer-events: none;
	}
	.bottom-area-inner {
		max-width: 28rem;
		margin: 0 auto;
		pointer-events: auto;
		display: flex;
		flex-direction: column;
		gap: 12px;
		padding: 0 16px 16px;
	}
	.bottom-incident {
		padding: 0;
	}
	.bottom-incident .incident-card {
		border-radius: 20px;
	}
	.bottom-bar-pill {
		background: rgba(255,255,255,0.8);
		backdrop-filter: blur(40px);
		-webkit-backdrop-filter: blur(40px);
		padding: 12px 16px;
		border-radius: 9999px;
		box-shadow: 0 25px 50px -12px rgba(0,0,0,0.2);
		border: 1px solid rgba(255,255,255,0.4);
		display: flex;
		align-items: center;
		justify-content: space-around;
	}
	.bar-btn {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		flex: 1;
		min-width: 0;
		background: none;
		border: none;
		cursor: pointer;
		-webkit-tap-highlight-color: transparent;
	}
	.bar-btn:active .bar-btn-icon { transform: scale(0.9); }
	.bar-btn-icon {
		width: 44px;
		height: 44px;
		border-radius: 50%;
		background: #edeeef;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.15s;
	}
	.bar-btn-icon .material-symbols-outlined {
		font-size: 20px;
		color: #3e4949;
	}
	.bar-btn-icon-end {
		background: #ba1a1a;
		box-shadow: 0 4px 6px rgba(186,26,26,0.2);
	}
	.bar-btn-icon-end .material-symbols-outlined {
		color: #fff;
		font-weight: 700;
	}
	.bar-btn-label {
		font-size: 8px;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: #3e4949;
	}
	.bar-btn-label-end { color: #ba1a1a; }
	.bar-btn-icon-muted {
		background: #3e4949;
	}
	.bar-btn-icon-muted .material-symbols-outlined {
		color: #fff;
	}
	.msg-interim {
		opacity: 0.6;
	}

	/* ── Animations ── */
	@keyframes waveform {
		0%, 100% { height: 4px; }
		50% { height: 16px; }
	}
	@keyframes pulse-ring {
		0% { box-shadow: 0 0 0 0 rgba(0,106,106,0.4); }
		70% { box-shadow: 0 0 0 8px rgba(0,106,106,0); }
		100% { box-shadow: 0 0 0 0 rgba(0,106,106,0); }
	}
	@keyframes pulse {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.5; }
	}
	@keyframes bounce {
		0%, 100% { transform: translateY(0); }
		50% { transform: translateY(-4px); }
	}
</style>

<div class="page">
	<!-- Top Status Bar -->
	<header class="topbar">
		<div class="topbar-inner">
			<div class="topbar-left">
				{#if connectionStatus === 'connected'}
					<div class="pulse-dot"></div>
				{:else if connectionStatus === 'connecting'}
					<div class="pulse-dot" style="background: #f59e0b;"></div>
				{:else}
					<div class="pulse-dot" style="background: #6e7979; animation: none;"></div>
				{/if}
				<h1 class="topbar-title">
					{#if connectionStatus === 'connecting'}{t('assist.status.connecting')}
					{:else if connectionStatus === 'error'}{t('assist.status.error')}
					{:else if connectionStatus === 'disconnected'}{t('assist.status.ended')}
					{:else}{t(agent.key === 'priya' ? 'priya.assist.status' : 'assist.status.progress')}
					{/if}
				</h1>
			</div>
			<div class="secure-badge">
				<span class="material-symbols-outlined">verified_user</span>
				<span>Secure</span>
			</div>
		</div>
	</header>

	<main class="main">
		<!-- Participants -->
		<section class="participants">
			<!-- AI Agent -->
			<div class="participant-card ai">
				<div class="avatar-wrap">
					<div class="avatar avatar-ai avatar-text" style="background: {agent.accentColor};">{agent.avatarLetter}</div>
				</div>
				<div>
					<div class="participant-name">{agent.name}</div>
					<div class="participant-status {botSpeaking ? 'status-speaking' : 'status-listening'}">
						{botSpeaking ? t('assist.speaking') : t('assist.listening')}
					</div>
				</div>
			</div>
			<!-- Chirag -->
			<div class="participant-card">
				<div class="avatar-wrap">
					<img alt="User" class="avatar avatar-user" src="/images/avatar-chirag.png" />
				</div>
				<div>
					<div class="participant-name">Chirag</div>
					<div class="participant-status {userSpeaking ? 'status-speaking' : 'status-listening'}">
						{userSpeaking ? t('assist.speaking') : t('assist.listening')}
					</div>
				</div>
			</div>
		</section>

		<!-- Live Transcript -->
		<section class="transcript">
			<div class="transcript-divider">
				<hr />
				<span>{t('assist.transcript')}</span>
				<hr />
			</div>
			<div class="messages" class:has-incident={callData} bind:this={messagesEl}>
				{#if connectionStatus === 'connecting'}
					<div class="processing">
						<div class="processing-pill">
							<div class="processing-dots">
								<div class="processing-dot" style="animation-delay: 0s"></div>
								<div class="processing-dot" style="animation-delay: 0.1s"></div>
								<div class="processing-dot" style="animation-delay: 0.2s"></div>
							</div>
							<span class="processing-text">{t('assist.connecting.bot')}</span>
						</div>
					</div>
				{/if}

				{#if errorMessage}
					<div class="msg msg-ai">
						<div class="msg-bubble msg-bubble-ai" style="border-left: 2px solid #ba1a1a;">
							{errorMessage}
						</div>
					</div>
				{/if}

				{#each messages as msg}
					{#if msg.role === 'assistant'}
						<div class="msg msg-ai">
							<div class="msg-bubble msg-bubble-ai" class:msg-interim={!msg.final}>
								{@html formatMarkdown(msg.text)}
							</div>
							<div class="msg-meta">
								<span class="msg-meta-time">{msg.timestamp}</span>
							</div>
						</div>
					{:else}
						<div class="msg msg-user">
							<div class="msg-bubble msg-bubble-user" class:msg-interim={!msg.final}>
								{msg.text}
							</div>
							<div class="msg-meta">
								<span class="msg-meta-time">{msg.timestamp}</span>
							</div>
						</div>
					{/if}
				{/each}

				{#if isProcessing && connectionStatus === 'connected'}
					<div class="processing">
						<div class="processing-pill">
							<div class="processing-dots">
								<div class="processing-dot" style="animation-delay: 0s"></div>
								<div class="processing-dot" style="animation-delay: 0.1s"></div>
								<div class="processing-dot" style="animation-delay: 0.2s"></div>
							</div>
							<span class="processing-text">{t('assist.thinking')}</span>
						</div>
					</div>
				{/if}
			</div>
		</section>

	</main>

	<!-- Bottom: Incident Card + Control Bar -->
	<div class="bottom-area">
		<div class="bottom-area-inner">
			<!-- Incident Details (shown when function call data arrives) -->
			{#if callData}
			<div class="bottom-incident">
				<div class="incident-card">
					<div class="incident-header">
						<div>
							<div class="incident-title">
								{t(agent.key === 'priya' ? 'priya.assist.incident' : 'assist.incident')}
							</div>
							<div class="incident-sync">
								<span class="incident-sync-text">{t('assist.syncing')}</span>
								<div class="progress-bar-wrap">
									<div class="progress-bar">
										<div class="progress-bar-fill" style="width: 100%"></div>
									</div>
									<span class="progress-pct">100%</span>
								</div>
							</div>
						</div>
						<div class="live-badge">
							<div class="live-badge-dot"></div>
							Live
						</div>
					</div>
					<div class="incident-fields">
						<div class="field-row">
							<div class="field-row-left">
								<div class="field-icon">
									<span class="material-symbols-outlined">person</span>
								</div>
								<div>
									<div class="field-label">{t('assist.fullname')}</div>
									<div class="field-value">Chirag</div>
								</div>
							</div>
							<span class="material-symbols-outlined field-check">check_circle</span>
						</div>
						{#each agent.cardFields as field}
						<div class="field-row">
							<div class="field-row-left">
								<div class="field-icon" style={agent.key === 'priya' ? 'background: rgba(91,62,150,0.1);' : ''}>
									<span class="material-symbols-outlined" style={agent.key === 'priya' ? `color: ${agent.accentColor};` : ''}>{field.icon}</span>
								</div>
								<div>
									<div class="field-label">{field.label}</div>
									<div class="field-value">
										{#if field.format === 'currency' && callData[field.key]}
											₹{Number(callData[field.key]).toLocaleString('en-IN')}
										{:else}
											{callData[field.key] ?? '—'}
										{/if}
									</div>
								</div>
							</div>
							<span class="material-symbols-outlined field-check">check_circle</span>
						</div>
						{/each}
					</div>
				</div>
			</div>
			{/if}
			<!-- Control Bar -->
			<div class="bottom-bar-pill">
				<button class="bar-btn" onclick={handleToggleMic}>
					<div class="bar-btn-icon" class:bar-btn-icon-muted={!isMicEnabled}>
						<span class="material-symbols-outlined">{isMicEnabled ? 'mic' : 'mic_off'}</span>
					</div>
					<span class="bar-btn-label">{t(isMicEnabled ? 'assist.mute' : 'assist.unmute')}</span>
				</button>
				<button class="bar-btn">
					<div class="bar-btn-icon">
						<span class="material-symbols-outlined">upload_file</span>
					</div>
					<span class="bar-btn-label">{t('assist.upload')}</span>
				</button>
				<button class="bar-btn" onclick={handleEndCall}>
					<div class="bar-btn-icon bar-btn-icon-end">
						<span class="material-symbols-outlined">call_end</span>
					</div>
					<span class="bar-btn-label bar-btn-label-end">{t('assist.endcall')}</span>
				</button>
				<button class="bar-btn">
					<div class="bar-btn-icon">
						<span class="material-symbols-outlined">keyboard</span>
					</div>
					<span class="bar-btn-label">{t('assist.type')}</span>
				</button>
				<button class="bar-btn">
					<div class="bar-btn-icon">
						<span class="material-symbols-outlined">more_horiz</span>
					</div>
					<span class="bar-btn-label">{t('assist.more')}</span>
				</button>
			</div>
		</div>
	</div>
</div>

