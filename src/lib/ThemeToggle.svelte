<script>
	import { onMount } from 'svelte';
	let { m } = $props();
	let theme = $state('system');

	function apply(t) {
		const dark = t === 'dark' || (t === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
		document.documentElement.classList.toggle('dark', dark);
	}
	onMount(() => {
		theme = localStorage.getItem('puid:theme') || 'system';
		const mq = matchMedia('(prefers-color-scheme: dark)');
		const onChange = () => theme === 'system' && apply('system');
		mq.addEventListener('change', onChange);
		return () => mq.removeEventListener('change', onChange);
	});
	function change(e) {
		theme = e.currentTarget.value;
		localStorage.setItem('puid:theme', theme);
		apply(theme);
	}
</script>

<label class="relative inline-flex">
	<span class="sr-only">{m.theme}</span>
	<select
		value={theme}
		onchange={change}
		aria-label={m.theme}
		data-testid="theme-select"
		class="cursor-pointer appearance-none rounded-full border border-zinc-200 bg-transparent py-1.5 pr-7 pl-3 text-sm text-zinc-600 transition hover:bg-zinc-200/60 hover:text-zinc-900 focus:outline-none dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-100"
	>
		<option value="system">{m.theme_auto}</option>
		<option value="light">{m.theme_light}</option>
		<option value="dark">{m.theme_dark}</option>
	</select>
	<svg class="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-zinc-400" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6" /></svg>
</label>
