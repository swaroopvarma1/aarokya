<script lang="ts">
	import { t, toggleLang } from '$lib/i18n.svelte';
</script>

<svelte:head>
	<title>Profile - Aarokya</title>
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

	.profile-hero {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		padding: 32px 0 24px;
	}
	.profile-avatar {
		width: 80px;
		height: 80px;
		border-radius: 50%;
		overflow: hidden;
		border: 3px solid #006565;
		margin-bottom: 16px;
	}
	.profile-avatar img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.profile-name {
		font-family: 'Manrope', sans-serif;
		font-size: 24px;
		font-weight: 800;
		letter-spacing: -0.02em;
		margin-bottom: 4px;
	}
	.profile-role {
		color: #3e4949;
		font-size: 14px;
		margin-bottom: 16px;
	}
	.profile-badge {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		background: rgba(0,101,101,0.1);
		color: #006565;
		padding: 6px 14px;
		border-radius: 9999px;
		font-size: 12px;
		font-weight: 700;
	}

	.section-title {
		font-family: 'Manrope', sans-serif;
		font-size: 12px;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: #6e7979;
		margin-bottom: 12px;
		padding: 0 4px;
	}

	.info-card {
		background: #fff;
		border-radius: 20px;
		padding: 4px 0;
		box-shadow: 0 2px 12px rgba(0,0,0,0.04);
		border: 1px solid rgba(189,201,200,0.1);
		margin-bottom: 24px;
	}
	.info-row {
		display: flex;
		align-items: center;
		gap: 14px;
		padding: 14px 20px;
	}
	.info-row + .info-row {
		border-top: 1px solid rgba(189,201,200,0.1);
	}
	.info-icon {
		width: 36px;
		height: 36px;
		border-radius: 10px;
		background: rgba(0,101,101,0.08);
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}
	.info-icon .material-symbols-outlined {
		font-size: 18px;
		color: #006565;
	}
	.info-label {
		font-size: 11px;
		color: #6e7979;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.03em;
	}
	.info-value {
		font-size: 14px;
		font-weight: 600;
		color: #191c1d;
	}

	.menu-card {
		background: #fff;
		border-radius: 20px;
		padding: 4px 0;
		box-shadow: 0 2px 12px rgba(0,0,0,0.04);
		border: 1px solid rgba(189,201,200,0.1);
		margin-bottom: 24px;
	}
	.menu-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 14px 20px;
		text-decoration: none;
		color: inherit;
		transition: background 0.15s;
	}
	.menu-row:hover {
		background: rgba(0,0,0,0.02);
	}
	.menu-row + .menu-row {
		border-top: 1px solid rgba(189,201,200,0.1);
	}
	.menu-row-left {
		display: flex;
		align-items: center;
		gap: 14px;
	}
	.menu-row .material-symbols-outlined.chevron {
		font-size: 20px;
		color: #bdc9c8;
	}

	.version {
		text-align: center;
		font-size: 11px;
		color: #bdc9c8;
		padding: 16px 0;
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
				<button class="header-btn" onclick={toggleLang} title="Switch language">
					<span class="material-symbols-outlined">translate</span>
				</button>
			</div>
		</div>
	</header>

	<main class="main">
		<div class="profile-hero">
			<div class="profile-avatar">
				<img alt="Chirag" src="/images/avatar-chirag.png" />
			</div>
			<div class="profile-name">Chirag</div>
			<div class="profile-role">{t('home.profile.role')}</div>
			<div class="profile-badge">
				<span class="material-symbols-outlined" style="font-size: 14px;">verified</span>
				Verified Member
			</div>
		</div>

		<div class="section-title">Personal Info</div>
		<div class="info-card">
			<div class="info-row">
				<div class="info-icon">
					<span class="material-symbols-outlined">person</span>
				</div>
				<div>
					<div class="info-label">Full Name</div>
					<div class="info-value">Chirag</div>
				</div>
			</div>
			<div class="info-row">
				<div class="info-icon">
					<span class="material-symbols-outlined">phone</span>
				</div>
				<div>
					<div class="info-label">Mobile</div>
					<div class="info-value">+91 99999 99999</div>
				</div>
			</div>
			<div class="info-row">
				<div class="info-icon">
					<span class="material-symbols-outlined">location_on</span>
				</div>
				<div>
					<div class="info-label">City</div>
					<div class="info-value">Bangalore, Karnataka</div>
				</div>
			</div>
			<div class="info-row">
				<div class="info-icon">
					<span class="material-symbols-outlined">work</span>
				</div>
				<div>
					<div class="info-label">Occupation</div>
					<div class="info-value">{t('home.profile.role')}</div>
				</div>
			</div>
		</div>

		<div class="section-title">Insurance</div>
		<div class="info-card">
			<div class="info-row">
				<div class="info-icon">
					<span class="material-symbols-outlined">verified_user</span>
				</div>
				<div>
					<div class="info-label">Policy</div>
					<div class="info-value">{t('home.policy.name')}</div>
				</div>
			</div>
			<div class="info-row">
				<div class="info-icon">
					<span class="material-symbols-outlined">event</span>
				</div>
				<div>
					<div class="info-label">Valid Until</div>
					<div class="info-value">24 Sep 2026</div>
				</div>
			</div>
			<div class="info-row">
				<div class="info-icon">
					<span class="material-symbols-outlined">payments</span>
				</div>
				<div>
					<div class="info-label">Coverage</div>
					<div class="info-value">&#8377;5,00,000</div>
				</div>
			</div>
		</div>

		<div class="section-title">Quick Links</div>
		<div class="menu-card">
			<a href="/claims" class="menu-row">
				<div class="menu-row-left">
					<div class="info-icon">
						<span class="material-symbols-outlined">description</span>
					</div>
					<span class="info-value">My Claims</span>
				</div>
				<span class="material-symbols-outlined chevron">chevron_right</span>
			</a>
			<a href="/chat" class="menu-row">
				<div class="menu-row-left">
					<div class="info-icon">
						<span class="material-symbols-outlined">support_agent</span>
					</div>
					<span class="info-value">Talk to Akshaya</span>
				</div>
				<span class="material-symbols-outlined chevron">chevron_right</span>
			</a>
			<a href="tel:108" class="menu-row">
				<div class="menu-row-left">
					<div class="info-icon">
						<span class="material-symbols-outlined">emergency</span>
					</div>
					<span class="info-value">Emergency Helpline</span>
				</div>
				<span class="material-symbols-outlined chevron">chevron_right</span>
			</a>
		</div>

		<div class="version">Aarokya v1.0</div>
	</main>

	<nav class="bottom-nav">
		<div class="bottom-nav-inner">
			<a href="/" class="nav-item nav-item-inactive">
				<span class="material-symbols-outlined">home</span>
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
			<a href="/profile" class="nav-item nav-item-active">
				<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">person</span>
				<span class="nav-label">{t('nav.profile')}</span>
			</a>
		</div>
	</nav>
</div>
