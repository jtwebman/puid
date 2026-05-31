<script>
	import '../app.css';
	import { page } from '$app/state';
	import ThemeToggle from '$lib/ThemeToggle.svelte';
	import LanguageSwitcher from '$lib/LanguageSwitcher.svelte';
	let { data, children } = $props();

	// Localized URL of the CURRENT page (English = canonical, no query param).
	const altUrl = (code) =>
		page.url.origin + page.url.pathname + (code === 'en' ? '' : '?lang=' + code);
	const canonical = $derived(altUrl(data.locale));
	const codes = $derived(Object.keys(data.locales));
</script>

<svelte:head>
	<link rel="canonical" href={canonical} />
	{#each codes as code (code)}
		<link rel="alternate" hreflang={code} href={altUrl(code)} />
	{/each}
	<link rel="alternate" hreflang="x-default" href={altUrl('en')} />
</svelte:head>

<div class="min-h-screen">
	<header
		class="sticky top-0 z-50 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b border-zinc-200 bg-white/80 px-5 py-3 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80"
	>
		<a href="/" class="flex items-center gap-2 font-bold text-zinc-900 dark:text-zinc-100">
			<span class="inline-block h-2.5 w-2.5 rounded-full bg-indigo-600 dark:bg-indigo-400"></span> PUID
		</a>
		<nav class="flex flex-wrap items-center gap-1.5">
			<a href="/docs" class="rounded-lg px-2.5 py-1.5 text-sm text-zinc-600 hover:bg-zinc-200/60 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-100">{data.m.nav_docs}</a>
			<a href="/dashboard" class="rounded-lg px-2.5 py-1.5 text-sm text-zinc-600 hover:bg-zinc-200/60 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-100">{data.m.nav_dashboard}</a>
			<ThemeToggle m={data.m} />
			<LanguageSwitcher locales={data.locales} current={data.locale} />
		</nav>
	</header>

	{@render children()}

	<footer class="mt-16 border-t border-zinc-200 px-5 py-8 dark:border-zinc-800">
		<div class="mx-auto flex max-w-3xl flex-col items-center gap-3 text-sm text-zinc-500 sm:flex-row sm:justify-between dark:text-zinc-400">
			<p>© {new Date().getFullYear()} PUID · {data.m.foot_rights}</p>
			<nav class="flex flex-wrap items-center gap-4">
				<a href="/why" class="hover:text-zinc-900 dark:hover:text-zinc-100">{data.m.foot_why}</a>
				<a href="/terms" class="hover:text-zinc-900 dark:hover:text-zinc-100">{data.m.foot_terms}</a>
				<a href="/privacy" class="hover:text-zinc-900 dark:hover:text-zinc-100">{data.m.foot_privacy}</a>
			</nav>
		</div>
	</footer>
</div>
