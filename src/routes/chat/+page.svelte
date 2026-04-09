<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { t, toggleLang, getLang } from '$lib/i18n.svelte';

	let loading = $state<string | null>(null);

	async function handleStart(agentKey: string) {
		loading = agentKey;
		await new Promise((r) => setTimeout(r, 1500));
		goto(`/chat/assist?agent=${agentKey}`);
	}

	onMount(() => {
		if (window.location.hash === '#priya') {
			setTimeout(() => {
				document.getElementById('priya')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
			}, 300);
		}
	});
</script>

<svelte:head>
	<title>Akshaya Assistant - Aarokya</title>
</svelte:head>

<div
	class="bg-background font-body text-on-surface min-h-screen flex flex-col selection:bg-primary-container selection:text-on-primary-container"
>
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

	<main class="flex-grow max-w-2xl mx-auto w-full px-6 pt-4 pb-32">
		<!-- Greeting Section -->
		<section class="mb-8">
			<h1 class="font-headline font-bold text-3xl tracking-tight text-on-surface mb-2">
				{t('chat.greeting')}
			</h1>
			<p class="text-on-surface-variant text-lg max-w-md tracking-tight">
				{t('chat.subtitle')}
			</p>
		</section>

		<!-- Agent Cards -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
			<!-- Akshaya — Claims Assistant -->
			<div class="bg-surface-container-low rounded-[2rem] p-6 overflow-hidden relative">
				<div class="absolute -top-12 -right-12 w-36 h-36 bg-primary/5 rounded-full blur-3xl"></div>
				<div class="flex flex-col items-start gap-4 relative z-10">
					<div class="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
						<span class="material-symbols-outlined text-on-primary !text-2xl" style="font-variation-settings: 'FILL' 1;">support_agent</span>
					</div>
					<div class="space-y-2">
						<h2 class="font-headline text-xl font-extrabold text-on-surface tracking-tight">{t('chat.hero.title')}</h2>
						<p class="text-on-surface-variant text-sm leading-relaxed">{t('chat.hero.desc')}</p>
					</div>
					<button
						onclick={() => handleStart('akshaya')}
						disabled={loading !== null}
						class="group w-full bg-primary text-on-primary px-6 py-3 rounded-full font-semibold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-all active:scale-95 duration-200 disabled:opacity-70 text-sm"
					>
						{#if loading === 'akshaya'}
							<span class="material-symbols-outlined animate-spin text-base">progress_activity</span>
							<span>{t('chat.hero.connecting')}</span>
						{:else}
							<span>{t('chat.hero.button')}</span>
							<span class="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
						{/if}
					</button>
				</div>
			</div>

			<!-- Priya — Health Advisor -->
			<div id="priya" class="bg-surface-container-low rounded-[2rem] p-6 overflow-hidden relative">
				<div class="absolute -top-12 -right-12 w-36 h-36 rounded-full blur-3xl" style="background: rgba(91,62,150,0.05);"></div>
				<div class="flex flex-col items-start gap-4 relative z-10">
					<div class="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg" style="background: #5B3E96; box-shadow: 0 10px 15px -3px rgba(91,62,150,0.2);">
						<span class="material-symbols-outlined text-white !text-2xl" style="font-variation-settings: 'FILL' 1;">stethoscope</span>
					</div>
					<div class="space-y-2">
						<h2 class="font-headline text-xl font-extrabold text-on-surface tracking-tight">{t('priya.hero.title')}</h2>
						<p class="text-on-surface-variant text-sm leading-relaxed">{t('priya.hero.desc')}</p>
					</div>
					<button
						onclick={() => handleStart('priya')}
						disabled={loading !== null}
						class="group w-full text-white px-6 py-3 rounded-full font-semibold flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 duration-200 disabled:opacity-70 text-sm"
						style="background: #5B3E96; box-shadow: 0 10px 15px -3px rgba(91,62,150,0.2);"
					>
						{#if loading === 'priya'}
							<span class="material-symbols-outlined animate-spin text-base">progress_activity</span>
							<span>{t('chat.hero.connecting')}</span>
						{:else}
							<span>{t('priya.cta.button')}</span>
							<span class="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
						{/if}
					</button>
				</div>
			</div>
		</div>

		<!-- Quick Actions / Chips -->
		<section class="mb-12">
			<h2
				class="font-headline text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-6 px-2"
			>
				{t('chat.actions.title')}
			</h2>
			<div class="flex flex-wrap gap-3">
				<a
					href="/chat/assist"
					class="bg-surface-container-lowest border border-outline-variant/30 text-on-surface px-6 py-3 rounded-full font-medium flex items-center gap-2 hover:bg-surface-container transition-all active:scale-95 duration-200 no-underline"
				>
					<span class="material-symbols-outlined text-primary !text-[20px]">add_task</span>
					<span>{t('chat.actions.start')}</span>
				</a>
				<a
					href="/claims"
					class="bg-surface-container-lowest border border-outline-variant/30 text-on-surface px-6 py-3 rounded-full font-medium flex items-center gap-2 hover:bg-surface-container transition-all active:scale-95 duration-200 no-underline"
				>
					<span class="material-symbols-outlined text-primary !text-[20px]">query_stats</span>
					<span>{t('chat.actions.status')}</span>
				</a>
				<a
					href="/chat/assist"
					class="bg-surface-container-lowest border border-outline-variant/30 text-on-surface px-6 py-3 rounded-full font-medium flex items-center gap-2 hover:bg-surface-container transition-all active:scale-95 duration-200 no-underline"
				>
					<span class="material-symbols-outlined text-primary !text-[20px]">edit_note</span>
					<span>{t('chat.actions.update')}</span>
				</a>
				<a
					href="/chat/assist"
					class="bg-surface-container-lowest border border-outline-variant/30 text-on-surface px-6 py-3 rounded-full font-medium flex items-center gap-2 hover:bg-surface-container transition-all active:scale-95 duration-200 no-underline"
				>
					<span class="material-symbols-outlined text-primary !text-[20px]">support_agent</span>
					<span>{t('chat.actions.support')}</span>
				</a>
			</div>
		</section>

		<div class="h-2"></div>

		<!-- Bento Trust Area -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<div class="p-6 bg-surface-container-low rounded-3xl flex items-start gap-4">
				<div class="bg-secondary-container/10 p-2 rounded-xl">
					<span
						class="material-symbols-outlined text-secondary"
						style="font-variation-settings: 'FILL' 1;">verified_user</span
					>
				</div>
				<div>
					<p class="text-sm font-bold text-on-surface mb-1">{t('chat.trust.encrypted.title')}</p>
					<p class="text-xs text-on-surface-variant leading-relaxed">
						{t('chat.trust.encrypted.desc')}
					</p>
				</div>
			</div>
			<div class="p-6 bg-surface-container-low rounded-3xl flex items-start gap-4">
				<div class="bg-tertiary-container/10 p-2 rounded-xl">
					<span
						class="material-symbols-outlined text-tertiary"
						style="font-variation-settings: 'FILL' 1;">speed</span
					>
				</div>
				<div>
					<p class="text-sm font-bold text-on-surface mb-1">{t('chat.trust.instant.title')}</p>
					<p class="text-xs text-on-surface-variant leading-relaxed">
						{t('chat.trust.instant.desc')}
					</p>
				</div>
			</div>
		</div>

		<!-- Trust Banner -->
		<div
			class="mt-12 py-6 px-8 rounded-2xl bg-surface-container-high/30 flex items-center justify-center gap-3 border border-outline-variant/10"
		>
			<span class="material-symbols-outlined text-on-surface-variant !text-sm">lock</span>
			<p class="text-center text-xs text-on-surface-variant font-medium tracking-wide">
				{t('chat.trust.banner')}
			</p>
		</div>
	</main>

	<!-- BottomNavBar -->
	<nav
		class="fixed bottom-0 w-full z-50 rounded-t-3xl bg-white/80 backdrop-blur-xl border-t border-on-surface/10 shadow-[0_-4px_32px_rgba(25,28,29,0.06)]"
	>
		<div class="flex justify-around items-center px-4 pt-3 pb-4 w-full">
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<a
				href="/"
				class="flex flex-col items-center justify-center text-on-surface-variant px-5 py-2 transition-all active:scale-90 duration-300 ease-out hover:text-primary"
			>
				<span class="material-symbols-outlined">home</span>
				<span class="font-label text-[11px] font-semibold uppercase tracking-wider mt-1">{t('nav.home')}</span>
			</a>
			<a
				href="/claims"
				class="flex flex-col items-center justify-center text-on-surface-variant px-5 py-2 hover:text-primary transition-all active:scale-90 duration-300 ease-out"
			>
				<span class="material-symbols-outlined">description</span>
				<span class="font-label text-[11px] font-semibold uppercase tracking-wider mt-1">{t('nav.claims')}</span>
			</a>
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<span
				class="flex flex-col items-center justify-center bg-primary-container/10 text-primary rounded-2xl px-5 py-2 active:scale-90 duration-300 ease-out cursor-pointer"
				role="button"
				tabindex="0"
			>
				<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;"
					>support_agent</span
				>
				<span class="font-label text-[11px] font-semibold uppercase tracking-wider mt-1">{t('nav.support')}</span>
			</span>
			<a
				href="/profile"
				class="flex flex-col items-center justify-center text-on-surface-variant px-5 py-2 hover:text-primary transition-all active:scale-90 duration-300 ease-out"
			>
				<span class="material-symbols-outlined">person</span>
				<span class="font-label text-[11px] font-semibold uppercase tracking-wider mt-1">{t('nav.profile')}</span>
			</a>
		</div>
	</nav>
</div>
