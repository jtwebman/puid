<script>
	import { page } from '$app/state';
	const m = $derived(page.data.m);

	const overEngineered = $derived([m.oe_1, m.oe_2, m.oe_3, m.oe_4, m.oe_5, m.oe_6, m.oe_7, m.oe_8]);
	const card = 'rounded-2xl border border-zinc-200 bg-zinc-50 p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900';
</script>

<main class="mx-auto max-w-3xl px-5">
	<section class="py-12">
		<h1 class="text-5xl font-bold tracking-tight sm:text-6xl">PUID</h1>
		<p class="mt-3 max-w-xl text-lg text-zinc-500 sm:text-xl dark:text-zinc-400">{m.hero_sub}</p>
		<p class="mt-4 max-w-xl text-zinc-600 dark:text-zinc-300">{m.hero_desc}</p>
		<p class="mt-4 font-mono text-sm break-all text-zinc-500 dark:text-zinc-400">
			#1 → <b class="text-zinc-900 dark:text-zinc-100">64qAN39GjJh5kbi4HROOxh</b> ·
			#2 → <b class="text-zinc-900 dark:text-zinc-100">7U17bzw0MO3mzwuFKO7cc0</b>
		</p>
		<div class="mt-6 flex flex-wrap gap-3">
			<a href="/dashboard" class="inline-flex min-h-11 items-center rounded-xl bg-indigo-600 px-5 font-semibold text-white hover:bg-indigo-500">{m.get_api_key}</a>
			<a href="/docs" class="inline-flex min-h-11 items-center rounded-xl border border-zinc-300 px-5 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800">{m.nav_docs}</a>
		</div>
	</section>

	<section class="grid grid-cols-1 gap-4 sm:grid-cols-3">
		<div class={card}><h3 class="mb-1 font-semibold">{m.guarantee_title}</h3><p class="text-sm text-zinc-500 dark:text-zinc-400">{m.guarantee_body}</p></div>
		<div class={card}><h3 class="mb-1 font-semibold">{m.random_title}</h3><p class="text-sm text-zinc-500 dark:text-zinc-400">{m.random_body}</p></div>
		<div class={card}><h3 class="mb-1 font-semibold">{m.ratelimit_title}</h3><p class="text-sm text-zinc-500 dark:text-zinc-400">{m.ratelimit_body}</p></div>
	</section>

	<section class="mt-12">
		<h2 class="mb-4 text-2xl font-semibold tracking-tight">{m.oe_title}</h2>
		<ul class="grid gap-2.5">
			{#each overEngineered as item}
				<li class="flex items-start gap-2.5 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
					<span class="mt-0.5 shrink-0 text-indigo-600 dark:text-indigo-400">✓</span>
					<span class="text-sm">{@html item}</span>
				</li>
			{/each}
		</ul>
	</section>

	<section class="mt-12">
		<h2 class="mb-4 text-2xl font-semibold tracking-tight">{m.quickstart}</h2>
		<pre class="overflow-auto rounded-xl border border-zinc-200 bg-zinc-100 p-4 font-mono text-sm dark:border-zinc-800 dark:bg-zinc-900">curl -H "X-API-Key: $PUID_API_KEY" "https://puid.dev/api/v1/ids?n=3"
# {`{`} "ids": ["64qAN39Gj...","7U17bzw0M...","30VPBF31V..."], "count": 3 {`}`}</pre>
	</section>

	<section class="mt-12">
		<h2 class="mb-6 text-2xl font-semibold tracking-tight">{m.pricing}</h2>
		<div class="grid items-start gap-4 sm:grid-cols-3">
			<!-- Hobby (free) -->
			<div class="flex flex-col rounded-2xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
				<h3 class="font-semibold">{m.plan_hobby}</h3>
				<p class="mt-2 text-3xl font-bold">$0</p>
				<ul class="mt-4 grow space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
					{#each m.hobby_features.split('\n') as f}<li class="flex gap-2"><span class="text-indigo-600 dark:text-indigo-400">✓</span>{f}</li>{/each}
				</ul>
				<a href="/dashboard" class="mt-6 inline-flex min-h-10 items-center justify-center rounded-lg border border-zinc-300 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800">{m.get_started}</a>
			</div>
			<!-- Professional (highlighted) -->
			<div class="relative flex flex-col rounded-2xl border-2 border-indigo-500 bg-white p-6 shadow-lg dark:bg-zinc-900">
				<span class="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-3 py-0.5 text-xs font-semibold text-white">{m.popular}</span>
				<h3 class="font-semibold">{m.plan_pro}</h3>
				<p class="mt-2 text-3xl font-bold">$5<span class="text-base font-normal text-zinc-500 dark:text-zinc-400">/mo</span></p>
				<ul class="mt-4 grow space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
					{#each m.pro_features.split('\n') as f}<li class="flex gap-2"><span class="text-indigo-600 dark:text-indigo-400">✓</span>{f}</li>{/each}
				</ul>
				<a href="/upgrade" class="mt-6 inline-flex min-h-10 items-center justify-center rounded-lg bg-indigo-600 text-sm font-semibold text-white hover:bg-indigo-500">{m.upgrade_cta}</a>
			</div>
			<!-- Enterprise (self-hosted, unlimited) -->
			<div class="flex flex-col rounded-2xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
				<h3 class="font-semibold">{m.plan_enterprise}</h3>
				<p class="mt-2 text-3xl font-bold">$1,000<span class="text-base font-normal text-zinc-500 dark:text-zinc-400">/mo</span></p>
				<p class="mt-1 text-sm text-zinc-600 dark:text-zinc-300">{m.enterprise_note}</p>
				<ul class="mt-4 grow space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
					{#each m.ent_features.split('\n') as f}<li class="flex gap-2"><span class="text-indigo-600 dark:text-indigo-400">✓</span>{f}</li>{/each}
				</ul>
			</div>
		</div>
	</section>

	<p class="py-12 text-center text-sm text-zinc-500 dark:text-zinc-400">{m.footer}</p>
</main>
