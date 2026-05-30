<script>
	let { locales, current } = $props();
	function change(e) {
		const u = new URL(location.href);
		u.searchParams.set('lang', e.currentTarget.value);
		location.href = u.toString();
	}
</script>

<label class="relative inline-flex">
	<span class="sr-only">Language</span>
	<select
		value={current}
		onchange={change}
		data-testid="language-select"
		class="cursor-pointer appearance-none rounded-full border border-zinc-200 bg-transparent py-1.5 pr-7 pl-3 text-sm text-zinc-600 transition hover:bg-zinc-200/60 hover:text-zinc-900 focus:outline-none dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-100"
	>
		{#each Object.entries(locales) as [code, l] (code)}
			<option value={code} class="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">{l.name}</option>
		{/each}
	</select>
	<svg class="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-zinc-400" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6" /></svg>
</label>
