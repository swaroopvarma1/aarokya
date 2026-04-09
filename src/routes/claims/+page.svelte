<script lang="ts">
	import { t, toggleLang } from '$lib/i18n.svelte';
	import { getClaims } from '$lib/claims.svelte';
</script>

<svelte:head>
	<title>Claims - Aarokya</title>
</svelte:head>

<style>
	.page {
		background: #f8f9fa;
		font-family: 'Inter', sans-serif;
		color: #191c1d;
		min-height: 100vh;
	}
	.header {
		width: 100%;
		position: sticky;
		top: 0;
		z-index: 50;
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
	.header-btn:hover { background: #f3f4f5; }

	.main {
		max-width: 42rem;
		margin: 0 auto;
		padding: 16px 24px 128px;
	}
	.page-title {
		font-family: 'Manrope', sans-serif;
		font-size: 28px;
		font-weight: 800;
		letter-spacing: -0.02em;
		margin-bottom: 8px;
	}
	.page-sub {
		color: #3e4949;
		font-size: 15px;
		margin-bottom: 32px;
	}

	.claims-list {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}
	.claim-card {
		background: #fff;
		border-radius: 20px;
		padding: 20px;
		box-shadow: 0 2px 12px rgba(0,0,0,0.04);
		border: 1px solid rgba(189,201,200,0.1);
		display: flex;
		align-items: center;
		gap: 16px;
	}
	.claim-icon {
		width: 48px;
		height: 48px;
		border-radius: 16px;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}
	.claim-icon-new {
		background: rgba(0,101,101,0.1);
	}
	.claim-icon-new .material-symbols-outlined {
		color: #006565;
		font-size: 24px;
	}
	.claim-info {
		flex: 1;
		min-width: 0;
	}
	.claim-title {
		font-weight: 600;
		font-size: 14px;
		color: #191c1d;
		margin-bottom: 2px;
	}
	.claim-meta {
		font-size: 12px;
		color: #3e4949;
	}
	.claim-right {
		text-align: right;
		flex-shrink: 0;
	}
	.claim-amount {
		font-weight: 700;
		font-size: 16px;
		color: #191c1d;
	}
	.claim-badge {
		display: inline-block;
		margin-top: 4px;
		padding: 2px 8px;
		border-radius: 9999px;
		font-size: 10px;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}
	.badge-new {
		background: rgba(0,101,101,0.1);
		color: #006565;
	}

	.empty-state {
		text-align: center;
		padding: 64px 24px;
	}
	.empty-icon {
		font-size: 48px;
		color: #bdc9c8;
		margin-bottom: 16px;
	}
	.empty-title {
		font-family: 'Manrope', sans-serif;
		font-weight: 700;
		font-size: 18px;
		color: #191c1d;
		margin-bottom: 8px;
	}
	.empty-desc {
		color: #3e4949;
		font-size: 14px;
	}

	/* ── Existing claim (hardcoded OPD) ── */
	.claim-icon-done {
		background: rgba(0,104,51,0.1);
	}
	.claim-icon-done .material-symbols-outlined {
		color: #006833;
		font-size: 24px;
	}
	.badge-done {
		background: rgba(0,104,51,0.1);
		color: #006833;
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
		padding: 8px 20px;
		text-decoration: none;
		transition: all 0.3s ease-out;
		border-radius: 16px;
	}
	.nav-item:active { transform: scale(0.9); }
	.nav-item-active {
		background: rgba(0,128,128,0.1);
		color: #006565;
	}
	.nav-item-inactive {
		color: #3e4949;
	}
	.nav-item-inactive:hover { color: #006565; }
	.nav-label {
		font-size: 11px;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin-top: 4px;
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
		<h1 class="page-title">{t('nav.claims')}</h1>
		<p class="page-sub">{t('claims.subtitle')}</p>

		<div class="claims-list">
			{#each getClaims() as claim}
				<div class="claim-card">
					<div class="claim-icon claim-icon-new">
						<span class="material-symbols-outlined">medical_services</span>
					</div>
					<div class="claim-info">
						<div class="claim-title">{claim.title}</div>
						<div class="claim-meta">{claim.id} &bull; {claim.date}</div>
					</div>
					<div class="claim-right">
						<div class="claim-amount">{claim.amount}</div>
						<span class="claim-badge badge-new">New</span>
					</div>
				</div>
			{/each}

			<!-- Hardcoded existing claim from homepage -->
			<div class="claim-card">
				<div class="claim-icon claim-icon-done">
					<span class="material-symbols-outlined">check_circle</span>
				</div>
				<div class="claim-info">
					<div class="claim-title">{t('home.opd')}</div>
					<div class="claim-meta">AR-CLM-881204 &bull; 15 Mar 2026</div>
				</div>
				<div class="claim-right">
					<div class="claim-amount">₹1,250</div>
					<span class="claim-badge badge-done">Processed</span>
				</div>
			</div>

			{#if getClaims().length === 0}
				<!-- empty state hint -->
			{/if}
		</div>
	</main>

	<nav class="bottom-nav">
		<div class="bottom-nav-inner">
			<a href="/" class="nav-item nav-item-inactive">
				<span class="material-symbols-outlined">home</span>
				<span class="nav-label">{t('nav.home')}</span>
			</a>
			<a href="/claims" class="nav-item nav-item-active">
				<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">description</span>
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
</div>
