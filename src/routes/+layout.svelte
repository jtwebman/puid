<script>
	import '../app.css';
	import ThemeToggle from '$lib/ThemeToggle.svelte';
	import LanguageSwitcher from '$lib/LanguageSwitcher.svelte';
	let { data, children } = $props();
</script>

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
</div>
