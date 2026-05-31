<script>
	import { page } from '$app/state';
	const m = $derived(page.data.m);
	const card = 'rounded-2xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900';
	const h = 'mb-2 text-xl font-semibold text-zinc-900 dark:text-zinc-100';
</script>

<main class="mx-auto max-w-3xl px-5">
	<section class="py-12">
		<h1 class="text-4xl font-bold tracking-tight">{m.why_title}</h1>
		<p class="mt-3 text-lg text-zinc-500 dark:text-zinc-400">{m.why_lead}</p>
	</section>

	<div class="space-y-6 text-zinc-700 dark:text-zinc-300">
		<div class={card}>
			<h2 class={h}>{m.why_h1}</h2>
			<p>{m.why_b1}</p>
			<p class="mt-3">{m.why_b1b}</p>
		</div>

		<div class={card}>
			<h2 class={h}>{m.why_h2}</h2>
			<p>{m.why_b2}</p>
			<p class="mt-3 font-mono text-sm break-all text-zinc-500 dark:text-zinc-400">{m.why_sample}</p>
		</div>

		<div class={card}>
			<h2 class={h}>{m.why_h3}</h2>
			<p>{@html m.why_b3}</p>
		</div>

		<div class={card}>
			<h2 class={h}>{m.why_h4}</h2>
			<p>{@html m.why_b4}</p>
		</div>
	</div>

	<p class="py-12 text-center text-sm text-zinc-500 dark:text-zinc-400">{m.footer}</p>
</main>
