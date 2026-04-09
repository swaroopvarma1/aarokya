<script lang="ts">
	import { t, toggleLang, getLang } from '$lib/i18n.svelte';
	import { getClaims } from '$lib/claims.svelte';
</script>

<svelte:head>
	<title>Aarokya - Premium Gig Worker Insurance</title>
</svelte:head>

<div class="bg-background font-body text-on-surface selection:bg-primary-container selection:text-on-primary-container min-h-screen">
	<!-- TopAppBar -->
	<header class="w-full top-0 sticky bg-background z-50">
		<div class="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
			<div class="flex items-center gap-3">
				<img
					alt="Narayana Health"
					class="h-5 object-contain"
					src="https://www.narayanahealth.org/assets/images/logo-25.svg"
				/>
				<span class="w-px h-5 bg-on-surface/15"></span>
				<span class="text-primary font-extrabold tracking-tighter font-headline text-xl"
					>Aarokya</span
				>
			</div>
			<div class="flex items-center gap-1">
				<a
					href="/claims"
					class="p-2 rounded-full text-on-surface-variant hover:bg-surface-container-low transition-colors active:scale-95 duration-200"
				>
					<span class="material-symbols-outlined">notifications</span>
				</a>
				<button
					type="button"
					onclick={toggleLang}
					class="p-2 rounded-full text-on-surface-variant hover:bg-surface-container-low transition-colors active:scale-95 duration-200 cursor-pointer"
					title="Switch language"
				>
					<span class="material-symbols-outlined">translate</span>
				</button>
			</div>
		</div>
	</header>

	<main class="max-w-7xl mx-auto px-6 pb-32 pt-4">
		<!-- Greeting Section -->
		<section class="mb-8">
			<h1 class="font-headline font-bold text-3xl tracking-tight text-on-surface mb-2">
				{t('home.greeting')}
				</h1>
			<p class="text-on-surface-variant text-lg max-w-md tracking-tight">
				{t('home.subtitle')}
			</p>
		</section>

		<!-- Primary CTA: Talk to Akshaya -->
		<section
			class="mb-10 group cursor-pointer relative overflow-hidden rounded-4xl bg-gradient-to-br from-primary to-primary-container p-8 shadow-xl shadow-primary/10 transition-transform active:scale-[0.98]"
		>
			<div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
				<div class="max-w-sm">
					<span
						class="inline-block px-3 py-1 rounded-full bg-on-primary/20 text-on-primary text-xs font-bold tracking-widest uppercase mb-4"
						>{t('home.cta.badge')}</span
					>
					<h2
						class="text-on-primary font-headline font-extrabold text-4xl mb-3 tracking-tight leading-tight"
					>
						{t('home.cta.title')}
						</h2>
					<p class="text-on-primary/80 text-lg">
						{t('home.cta.desc')}
					</p>
					<a
						href="/chat"
						class="mt-8 mx-auto md:mx-0 bg-surface-container-lowest text-primary px-8 py-3 rounded-full font-bold shadow-lg shadow-black/5 hover:bg-surface transition-colors flex items-center gap-2 w-fit"
					>
						{t('home.cta.button')}
							<span class="material-symbols-outlined text-lg">arrow_forward</span>
					</a>
				</div>
				<div class="relative hidden md:block">
					<div
						class="w-48 h-48 rounded-2xl bg-on-primary/10 backdrop-blur-md flex items-center justify-center border border-on-primary/20"
					>
						<span
							class="material-symbols-outlined text-[80px] text-on-primary/40"
							style="font-variation-settings: 'FILL' 1;">chat_bubble</span
						>
					</div>
				</div>
			</div>
			<!-- Decorative circle -->
			<div class="absolute -right-20 -bottom-20 w-64 h-64 bg-on-primary/5 rounded-full blur-3xl">
			</div>
		</section>

		<!-- Secondary CTA: Talk to Priya -->
		<section
			class="mb-10 group cursor-pointer relative overflow-hidden rounded-4xl p-8 shadow-xl transition-transform active:scale-[0.98]"
			style="background: linear-gradient(135deg, #5B3E96, #7B5BB5); box-shadow: 0 20px 25px -5px rgba(91,62,150,0.1);"
		>
			<div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
				<div class="max-w-sm">
					<span
						class="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold tracking-widest uppercase mb-4"
						>{t('priya.cta.badge')}</span
					>
					<h2
						class="text-white font-headline font-extrabold text-4xl mb-3 tracking-tight leading-tight"
					>
						{t('priya.cta.title')}
					</h2>
					<p class="text-white/80 text-lg">
						{t('priya.cta.desc')}
					</p>
					<a
						href="/chat#priya"
						class="mt-8 mx-auto md:mx-0 bg-white px-8 py-3 rounded-full font-bold shadow-lg shadow-black/5 hover:bg-gray-50 transition-colors flex items-center gap-2 w-fit no-underline"
						style="color: #5B3E96;"
					>
						{t('priya.cta.button')}
						<span class="material-symbols-outlined text-lg">arrow_forward</span>
					</a>
				</div>
				<div class="relative hidden md:block">
					<div
						class="w-48 h-48 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20"
					>
						<span
							class="material-symbols-outlined text-[80px] text-white/40"
							style="font-variation-settings: 'FILL' 1;">stethoscope</span
						>
					</div>
				</div>
			</div>
			<div class="absolute -right-20 -bottom-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
		</section>

		<!-- Bento Grid Layout -->
		<div class="grid grid-cols-1 md:grid-cols-12 gap-6">
			<!-- Active Policy Card -->
			<div
				class="md:col-span-8 bg-surface-container-lowest rounded-3xl p-6 shadow-sm flex flex-col justify-between"
			>
				<div class="flex justify-between items-start mb-6">
					<div>
						<h3 class="text-on-surface-variant font-semibold text-sm uppercase tracking-wider mb-1">
							{t('home.policy.label')}
							</h3>
						<p class="font-headline font-bold text-2xl">{t('home.policy.name')}</p>
					</div>
					<span class="bg-tertiary/10 text-tertiary px-3 py-1 rounded-full text-xs font-bold"
						>ACTIVE</span
					>
				</div>
				<div class="flex items-center gap-4 mb-5">
					<div
						class="w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center"
					>
						<span class="material-symbols-outlined text-primary">verified_user</span>
					</div>
					<div>
						<p class="text-xs text-on-surface-variant">{t('home.policy.expiry')}</p>
						<p class="font-bold">24 Sep 2026</p>
					</div>
				</div>
				<a
					href="/claims"
					class="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-primary/20 bg-primary/5 text-primary font-bold text-sm hover:bg-primary/10 transition-colors active:scale-[0.98] no-underline"
				>
					{t('home.policy.view')}
						<span class="material-symbols-outlined text-base">arrow_forward</span>
				</a>
			</div>

			<!-- Quick Help -->
			<div class="md:col-span-4 bg-surface-container-lowest rounded-3xl p-6 shadow-sm">
				<h3 class="text-on-surface-variant font-semibold text-sm uppercase tracking-wider mb-4">
					{t('home.quickhelp')}
					</h3>
				<div class="space-y-3">
					<a
						href="tel:108"
						class="w-full flex items-center justify-between p-4 bg-error-container/30 rounded-xl group hover:bg-error-container/50 transition-colors no-underline"
					>
						<div class="flex items-center gap-3">
							<span
								class="material-symbols-outlined text-error"
								style="font-variation-settings: 'FILL' 1;">emergency</span
							>
							<span class="font-bold text-on-error-container">{t('home.emergency')}</span>
						</div>
						<span
							class="material-symbols-outlined text-on-error-container group-hover:translate-x-1 transition-transform"
							>chevron_right</span
						>
					</a>
					<a
						href="/claims"
						class="w-full flex items-center justify-between p-4 bg-surface-container-low rounded-xl group hover:bg-surface-container transition-colors no-underline text-inherit"
					>
						<div class="flex items-center gap-3">
							<span class="material-symbols-outlined text-primary">receipt_long</span>
							<span class="font-bold">{t('home.claimstatus')}</span>
						</div>
						<span
							class="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform"
							>chevron_right</span
						>
					</a>
				</div>
			</div>

			<!-- Recent Claims -->
			<div class="md:col-span-8 bg-surface-container-lowest rounded-3xl p-6 shadow-sm">
				<div class="flex justify-between items-center mb-6">
					<h3 class="text-on-surface-variant font-semibold text-sm uppercase tracking-wider">
						{t('home.recent')}
						</h3>
					<a href="/claims" class="text-xs font-bold text-primary uppercase tracking-widest no-underline">{t('home.seeall')}</a>
				</div>
				{#each getClaims().slice(0, 2) as claim}
				<a href="/claims" class="p-4 bg-surface-container-low/50 rounded-2xl flex items-center justify-between mb-2 no-underline text-inherit hover:bg-surface-container-low transition-colors">
					<div class="flex items-center gap-4">
						<div
							class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center"
						>
							<span class="material-symbols-outlined text-primary">medical_services</span>
						</div>
						<div>
							<p class="font-bold">{claim.title}</p>
							<p class="text-sm text-on-surface-variant">New &bull; {claim.amount}</p>
						</div>
					</div>
					<span class="material-symbols-outlined text-on-surface-variant">chevron_right</span>
				</a>
				{/each}
				<a href="/claims" class="p-4 bg-surface-container-low/50 rounded-2xl flex items-center justify-between no-underline text-inherit hover:bg-surface-container-low transition-colors">
					<div class="flex items-center gap-4">
						<div
							class="w-12 h-12 rounded-full bg-tertiary-container/10 flex items-center justify-center"
						>
							<span class="material-symbols-outlined text-tertiary">check_circle</span>
						</div>
						<div>
							<p class="font-bold">{t('home.opd')}</p>
							<p class="text-sm text-on-surface-variant">Processed &bull; &#8377;1,250</p>
						</div>
					</div>
					<span class="material-symbols-outlined text-on-surface-variant">chevron_right</span>
				</a>
			</div>

			<!-- Profile Snapshot -->
			<div
				class="md:col-span-4 bg-surface-container-lowest rounded-3xl p-6 shadow-sm"
			>
				<h3 class="text-on-surface-variant font-semibold text-sm uppercase tracking-wider mb-4">
					{t('home.profile.title')}
					</h3>
				<div class="flex flex-col items-center text-center">
					<div class="w-16 h-16 rounded-full overflow-hidden bg-surface-container-low mb-3">
						<img
							alt="Chirag"
							class="w-full h-full object-cover"
							src="/images/avatar-chirag.png"
						/>
					</div>
					<p class="font-bold text-lg">Chirag</p>
					<p class="text-on-surface-variant text-sm mb-4">{t('home.profile.role')}</p>
					<div class="w-full h-1 bg-surface-container-low rounded-full overflow-hidden">
						<div class="w-3/4 h-full bg-primary"></div>
					</div>
					<p class="text-[10px] text-on-surface-variant mt-2 uppercase font-bold">
						{t('home.profile.complete')}
						</p>
				</div>
			</div>
		</div>

		<!-- Trust Markers -->
		<section class="mt-10 grid grid-cols-3 gap-3">
			<div class="flex flex-col items-center text-center bg-surface-container-lowest rounded-2xl px-3 py-5 shadow-sm">
				<div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
					<span
						class="material-symbols-outlined text-primary text-xl"
						style="font-variation-settings: 'FILL' 1;">verified</span
					>
				</div>
				<span class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant leading-tight">{t('home.trust.verified')}</span>
			</div>
			<div class="flex flex-col items-center text-center bg-surface-container-lowest rounded-2xl px-3 py-5 shadow-sm">
				<div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
					<span
						class="material-symbols-outlined text-primary text-xl"
						style="font-variation-settings: 'FILL' 1;">timer</span
					>
				</div>
				<span class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant leading-tight">{t('home.trust.response')}</span>
			</div>
			<div class="flex flex-col items-center text-center bg-surface-container-lowest rounded-2xl px-3 py-5 shadow-sm">
				<div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
					<span
						class="material-symbols-outlined text-primary text-xl"
						style="font-variation-settings: 'FILL' 1;">lock</span
					>
				</div>
				<span class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant leading-tight">{@html t('home.trust.secure').replace('\n', '<br/>')}</span>
			</div>
		</section>
	</main>

	<!-- BottomNavBar -->
	<nav
		class="fixed bottom-0 w-full z-50 rounded-t-3xl bg-white/80 backdrop-blur-xl border-t border-on-surface/10 shadow-[0_-4px_32px_rgba(25,28,29,0.06)]"
	>
		<div class="flex justify-around items-center px-4 pt-3 pb-4 w-full">
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<span
				class="flex flex-col items-center justify-center bg-primary-container/10 text-primary rounded-2xl px-5 py-2 active:scale-90 duration-300 ease-out cursor-pointer"
				role="button"
				tabindex="0"
			>
				<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;"
					>home</span
				>
				<span class="font-label text-[11px] font-semibold uppercase tracking-wider mt-1">{t('nav.home')}</span>
			</span>
			<a
				href="/claims"
				class="flex flex-col items-center justify-center text-on-surface-variant px-5 py-2 hover:text-primary transition-all active:scale-90 duration-300 ease-out"
			>
				<span class="material-symbols-outlined">description</span>
				<span class="font-label text-[11px] font-semibold uppercase tracking-wider mt-1"
					>{t('nav.claims')}</span
				>
			</a>
			<a
				href="/chat"
				class="flex flex-col items-center justify-center text-on-surface-variant px-5 py-2 hover:text-primary transition-all active:scale-90 duration-300 ease-out"
			>
				<span class="material-symbols-outlined">support_agent</span>
				<span class="font-label text-[11px] font-semibold uppercase tracking-wider mt-1"
					>{t('nav.support')}</span
					>
			</a>
			<a
				href="/profile"
				class="flex flex-col items-center justify-center text-on-surface-variant px-5 py-2 hover:text-primary transition-all active:scale-90 duration-300 ease-out"
			>
				<span class="material-symbols-outlined">person</span>
				<span class="font-label text-[11px] font-semibold uppercase tracking-wider mt-1"
					>{t('nav.profile')}</span
					>
			</a>
		</div>
	</nav>
</div>
