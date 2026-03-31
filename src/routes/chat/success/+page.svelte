<script lang="ts">
	import { t, toggleLang } from '$lib/i18n.svelte';
	import { page } from '$app/state';
	import { getClaims } from '$lib/claims.svelte';
	import { getAgent } from '$lib/agents';

	const agentKey = page.url.searchParams.get('agent');
	const agent = getAgent(agentKey);
	const latestClaim = getClaims()[0];
</script>

<svelte:head>
	<title>{agent.key === 'priya' ? 'Consultation Recorded' : 'Claim Generated'} - Aarokya</title>
</svelte:head>

<style>
	.page {
		background: #f8f9fa;
		font-family: 'Inter', sans-serif;
		color: #191c1d;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	/* ── Header ── */
	.header {
		width: 100%;
		position: sticky;
		top: 0;
		z-index: 40;
		background: #f8f9fa;
	}
	.header-inner {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 16px 24px;
		max-width: 56rem;
		margin: 0 auto;
	}
	.header-left {
		display: flex;
		align-items: center;
		gap: 12px;
	}
	.header-avatar {
		width: 40px;
		height: 40px;
		border-radius: 8px;
		overflow: hidden;
		border: 1px solid rgba(189,201,200,0.2);
	}
	.header-avatar img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.header-brand {
		color: #006565;
		font-family: 'Manrope', sans-serif;
		font-weight: 800;
		font-size: 20px;
		letter-spacing: -0.05em;
	}
	.header-actions {
		display: flex;
		align-items: center;
		gap: 4px;
	}
	.header-btn {
		padding: 8px;
		border-radius: 50%;
		border: none;
		background: none;
		cursor: pointer;
		color: #3e4949;
		transition: background 0.15s;
	}
	.header-btn:hover {
		background: #f3f4f5;
	}

	/* ── Main ── */
	.main {
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 32px 24px 128px;
		max-width: 42rem;
		margin: 0 auto;
		width: 100%;
	}

	/* ── Success Icon ── */
	.success-icon-wrap {
		position: relative;
		margin-bottom: 40px;
	}
	.success-icon-glow {
		position: absolute;
		inset: 0;
		background: rgba(0,101,101,0.1);
		border-radius: 50%;
		filter: blur(48px);
		transform: scale(1.5);
	}
	.success-icon {
		position: relative;
		width: 96px;
		height: 96px;
		background: linear-gradient(135deg, #006565, #008080);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 20px 25px -5px rgba(0,101,101,0.2);
	}
	.success-icon .material-symbols-outlined {
		font-size: 48px;
		color: #fff;
		font-variation-settings: 'FILL' 1;
	}

	/* ── Success Text ── */
	.success-text {
		text-align: center;
		margin-bottom: 40px;
	}
	.success-title {
		font-family: 'Manrope', sans-serif;
		font-size: 28px;
		font-weight: 800;
		color: #191c1d;
		letter-spacing: -0.02em;
		margin-bottom: 12px;
	}
	.success-desc {
		color: #3e4949;
		max-width: 320px;
		margin: 0 auto;
		line-height: 1.6;
		font-size: 15px;
	}

	/* ── Reference Card ── */
	.ref-card {
		width: 100%;
		background: #fff;
		border-radius: 24px;
		padding: 24px;
		box-shadow: 0 4px 24px rgba(0,0,0,0.04);
		border: 1px solid rgba(189,201,200,0.1);
		margin-bottom: 16px;
	}
	.ref-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 16px;
	}
	.ref-label {
		font-size: 11px;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: rgba(62,73,73,0.6);
	}
	.ref-badge {
		padding: 4px 12px;
		background: rgba(0,101,101,0.1);
		color: #006565;
		font-size: 11px;
		font-weight: 700;
		border-radius: 9999px;
	}
	.ref-id {
		font-family: 'Manrope', sans-serif;
		font-size: 24px;
		font-weight: 700;
		color: #006565;
		letter-spacing: -0.02em;
	}
	.ref-details {
		margin-top: 16px;
		padding-top: 16px;
		border-top: 1px solid rgba(189,201,200,0.1);
		display: flex;
		align-items: center;
		gap: 12px;
	}
	.ref-icon {
		width: 40px;
		height: 40px;
		border-radius: 12px;
		background: #edeeef;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.ref-icon .material-symbols-outlined {
		font-size: 20px;
		color: #006565;
	}
	.ref-claim-title {
		font-size: 14px;
		font-weight: 600;
		color: #191c1d;
	}
	.ref-claim-amount {
		font-size: 18px;
		font-weight: 700;
		color: #191c1d;
	}

	/* ── Timeline Card ── */
	.timeline-card {
		width: 100%;
		background: #f3f4f5;
		border-radius: 24px;
		padding: 24px;
		margin-bottom: 32px;
	}
	.timeline-title {
		font-size: 14px;
		font-weight: 700;
		color: #191c1d;
		margin-bottom: 24px;
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.timeline-title .material-symbols-outlined {
		font-size: 14px;
		color: #006565;
	}
	.timeline-steps {
		position: relative;
		display: flex;
		flex-direction: column;
	}
	.timeline-line {
		position: absolute;
		left: 11px;
		top: 8px;
		bottom: 8px;
		width: 2px;
		background: rgba(189,201,200,0.3);
	}
	.timeline-step {
		position: relative;
		padding-left: 40px;
		padding-bottom: 32px;
	}
	.timeline-step:last-child {
		padding-bottom: 0;
	}
	.timeline-dot {
		position: absolute;
		left: 0;
		top: 4px;
		width: 24px;
		height: 24px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1;
	}
	.timeline-dot-active {
		background: #006565;
	}
	.timeline-dot-active .material-symbols-outlined {
		font-size: 14px;
		color: #fff;
		font-variation-settings: 'FILL' 1;
	}
	.timeline-dot-pending {
		background: #e1e3e4;
		border: 2px solid #f3f4f5;
	}
	.timeline-dot-pending-inner {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: #bdc9c8;
	}
	.timeline-step-title {
		font-size: 14px;
		font-weight: 700;
	}
	.timeline-step-title-active {
		color: #191c1d;
	}
	.timeline-step-title-pending {
		color: #3e4949;
	}
	.timeline-step-sub {
		font-size: 12px;
		margin-top: 2px;
	}
	.timeline-step-sub-active {
		color: #006565;
		font-weight: 500;
	}
	.timeline-step-sub-pending {
		color: rgba(62,73,73,0.6);
	}

	/* ── Action Buttons ── */
	.actions {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 16px;
	}
	.btn-track {
		width: 100%;
		padding: 16px;
		background: linear-gradient(to right, #006565, #008080);
		color: #fff;
		text-decoration: none;
		font-weight: 700;
		font-size: 16px;
		border: none;
		border-radius: 16px;
		box-shadow: 0 10px 15px -3px rgba(0,101,101,0.2);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		transition: transform 0.15s;
	}
	.btn-track:active {
		transform: scale(0.95);
	}
	.btn-track .material-symbols-outlined {
		font-size: 14px;
	}
	.btn-home {
		width: 100%;
		padding: 16px;
		background: transparent;
		color: #3e4949;
		font-weight: 700;
		font-size: 16px;
		border: 2px solid rgba(189,201,200,0.2);
		border-radius: 16px;
		cursor: pointer;
		transition: background 0.15s, transform 0.15s;
		text-decoration: none;
		text-align: center;
		display: block;
	}
	.btn-home:hover {
		background: #edeeef;
	}
	.btn-home:active {
		transform: scale(0.95);
	}

	/* ── Bottom Nav ── */
	.bottom-nav {
		position: fixed;
		bottom: 0;
		width: 100%;
		z-index: 50;
		border-top-left-radius: 24px;
		border-top-right-radius: 24px;
		background: rgba(255,255,255,0.8);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		box-shadow: 0 -4px 32px rgba(25,28,29,0.06);
		border-top: 1px solid rgba(25,28,29,0.1);
	}
	.bottom-nav-inner {
		display: flex;
		justify-content: space-around;
		align-items: center;
		padding: 12px 16px 16px;
	}
	.nav-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 8px 20px;
		text-decoration: none;
		transition: all 0.3s ease-out;
		border-radius: 16px;
	}
	.nav-item:active {
		transform: scale(0.9);
	}
	.nav-item-active {
		background: rgba(0,128,128,0.1);
		color: #006565;
	}
	.nav-item-inactive {
		color: #3e4949;
	}
	.nav-item-inactive:hover {
		color: #006565;
	}
	.nav-label {
		font-family: 'Inter', sans-serif;
		font-size: 11px;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin-top: 4px;
	}

	/* ── Background Decoration ── */
	.bg-deco-1 {
		position: fixed;
		top: 0;
		right: 0;
		z-index: -1;
		width: 500px;
		height: 500px;
		background: rgba(0,101,101,0.05);
		filter: blur(120px);
		border-radius: 50%;
		pointer-events: none;
	}
	.bg-deco-2 {
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: -1;
		width: 400px;
		height: 400px;
		background: rgba(0,90,183,0.05);
		filter: blur(100px);
		border-radius: 50%;
		pointer-events: none;
	}
</style>

<div class="page">
	<header class="header">
		<div class="header-inner">
			<div class="header-left">
				<img alt="Narayana Health" src="https://www.narayanahealth.org/assets/images/logo-25.svg" style="height: 20px; object-fit: contain;" />
				<span style="width: 1px; height: 20px; background: rgba(0,0,0,0.12);"></span>
				<span class="header-brand">Aarokya</span>
			</div>
			<div class="header-actions">
				<button class="header-btn">
					<span class="material-symbols-outlined">notifications</span>
				</button>
				<button class="header-btn" onclick={toggleLang} title="Switch language">
					<span class="material-symbols-outlined">translate</span>
				</button>
			</div>
		</div>
	</header>

	<main class="main">
		<!-- Success Icon -->
		<div class="success-icon-wrap">
			<div class="success-icon-glow"></div>
			<div class="success-icon">
				<span class="material-symbols-outlined">check_circle</span>
			</div>
		</div>

		<!-- Success Message -->
		<div class="success-text">
			<h1 class="success-title">{t(agent.successTitleKey)}</h1>
			<p class="success-desc">{t(agent.successDescKey)}</p>
		</div>

		<!-- Reference Card -->
		<div class="ref-card">
			<div class="ref-header">
				<span class="ref-label">{t('success.ref')}</span>
				<span class="ref-badge">{t('success.new')}</span>
			</div>
			<p class="ref-id">{latestClaim?.id ?? 'AR-CLM-000000'}</p>
			<div class="ref-details">
				<div class="ref-icon">
					<span class="material-symbols-outlined">medical_services</span>
				</div>
				<div>
					<p class="ref-claim-title">{latestClaim?.title ?? t(agent.key === 'priya' ? 'priya.success.claim_title' : 'success.claim_title')}</p>
					<p class="ref-claim-amount">{latestClaim?.amount ?? '₹0'}</p>
				</div>
			</div>
		</div>

		<!-- Timeline Card -->
		<div class="timeline-card">
			<h3 class="timeline-title">
				<span class="material-symbols-outlined">schedule</span>
				{t('success.progress')}
			</h3>
			<div class="timeline-steps">
				<div class="timeline-line"></div>
				<!-- Step 1: Active -->
				<div class="timeline-step">
					<div class="timeline-dot timeline-dot-active">
						<span class="material-symbols-outlined">check</span>
					</div>
					<p class="timeline-step-title timeline-step-title-active">{t(agent.key === 'priya' ? 'priya.success.step1' : 'success.step1')}</p>
					<p class="timeline-step-sub timeline-step-sub-active">{t('success.step1_sub')}</p>
				</div>
				<!-- Step 2: Pending -->
				<div class="timeline-step">
					<div class="timeline-dot timeline-dot-pending">
						<div class="timeline-dot-pending-inner"></div>
					</div>
					<p class="timeline-step-title timeline-step-title-pending">{t(agent.key === 'priya' ? 'priya.success.step2' : 'success.step2')}</p>
					<p class="timeline-step-sub timeline-step-sub-pending">{t('success.step2_sub')}</p>
				</div>
				<!-- Step 3: Pending -->
				<div class="timeline-step">
					<div class="timeline-dot timeline-dot-pending">
						<div class="timeline-dot-pending-inner"></div>
					</div>
					<p class="timeline-step-title timeline-step-title-pending">{t(agent.key === 'priya' ? 'priya.success.step3' : 'success.step3')}</p>
					<p class="timeline-step-sub timeline-step-sub-pending">{t(agent.key === 'priya' ? 'priya.success.step3_sub' : 'success.step3_sub')}</p>
				</div>
			</div>
		</div>

		<!-- Actions -->
		<div class="actions">
			<a href="/claims" class="btn-track">
				<span>{t(agent.key === 'priya' ? 'priya.success.track' : 'success.track')}</span>
				<span class="material-symbols-outlined">arrow_forward</span>
			</a>
			<a href="/" class="btn-home">{t('success.home')}</a>
		</div>
	</main>

	<!-- Bottom Nav -->
	<nav class="bottom-nav">
		<div class="bottom-nav-inner">
			<a href="/" class="nav-item nav-item-active">
				<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">home</span>
				<span class="nav-label">{t('nav.home')}</span>
			</a>
			<a href="/claims" class="nav-item nav-item-inactive">
				<span class="material-symbols-outlined">description</span>
				<span class="nav-label">{t('nav.claims')}</span>
			</a>
			<a href="/chat" class="nav-item nav-item-inactive">
				<span class="material-symbols-outlined">support_agent</span>
				<span class="nav-label">{t('nav.support')}</span>
			</a>
			<a href="/profile" class="nav-item nav-item-inactive">
				<span class="material-symbols-outlined">person</span>
				<span class="nav-label">{t('nav.profile')}</span>
			</a>
		</div>
	</nav>

	<!-- Background Decorations -->
	<div class="bg-deco-1"></div>
	<div class="bg-deco-2"></div>
</div>
