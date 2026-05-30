<script>
	import { page } from '$app/state';
	const m = $derived(page.data.m);

	const overEngineered = [
		'A 128-bit Feistel cipher, just to disguise <code>i++</code> as something random.',
		'A complete OAuth2 authorization server — so apps can be formally granted permission to receive a number.',
		'Sign in with Google or Microsoft. SSO. For a counter.',
		'Multi-tenant teams: many accounts per user, reusable revocable join codes.',
		'20 client SDKs, generated from an OpenAPI spec.',
		'A PostgreSQL extension that turns every <code>INSERT</code> into a rate-limited network call.',
		'This marketing site, in 20 languages, with light &amp; dark themes.',
		'Unit, full-system, and real-browser test suites — to prove a counter counts.'
	];
	const card = 'rounded-2xl border border-zinc-200 bg-zinc-50 p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900';
</script>

<main class="mx-auto max-w-3xl px-5">
	<section class="py-12">
		<span class="mb-4 inline-block rounded-full border border-indigo-300/60 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-300">★ The most over-engineered way to count</span>
		<h1 class="text-5xl font-bold tracking-tight sm:text-6xl">PUID</h1>
		<p class="mt-3 max-w-xl text-lg text-zinc-500 sm:text-xl dark:text-zinc-400">{m.tagline}</p>
		<p class="mt-4 font-mono text-sm break-all text-zinc-500 dark:text-zinc-400">
			#1 → <b class="text-zinc-900 dark:text-zinc-100">64qAN39GjJh5kbi4HROOxh</b> ·
			#2 → <b class="text-zinc-900 dark:text-zinc-100">7U17bzw0MO3mzwuFKO7cc0</b>
		</p>
		<div class="mt-6 flex flex-wrap gap-3">
			<a href="/dashboard" class="inline-flex min-h-11 items-center rounded-xl bg-indigo-600 px-5 font-semibold text-white hover:bg-indigo-500">Get an API key</a>
			<a href="/docs" class="inline-flex min-h-11 items-center rounded-xl border border-zinc-300 px-5 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800">{m.nav_docs}</a>
		</div>
	</section>

	<section class="grid grid-cols-1 gap-4 sm:grid-cols-3">
		<div class={card}><h3 class="mb-1 font-semibold">{m.guarantee_title}</h3><p class="text-sm text-zinc-500 dark:text-zinc-400">{m.guarantee_body}</p></div>
		<div class={card}><h3 class="mb-1 font-semibold">{m.random_title}</h3><p class="text-sm text-zinc-500 dark:text-zinc-400">{m.random_body}</p></div>
		<div class={card}><h3 class="mb-1 font-semibold">{m.ratelimit_title}</h3><p class="text-sm text-zinc-500 dark:text-zinc-400">{m.ratelimit_body}</p></div>
	</section>

	<section class="mt-12">
		<h2 class="mb-4 text-2xl font-semibold tracking-tight">How over-engineered is it?</h2>
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
		<h2 class="mb-4 text-2xl font-semibold tracking-tight">{m.pricing}</h2>
		<table class="w-full text-sm">
			<thead class="text-zinc-500 dark:text-zinc-400">
				<tr class="border-b border-zinc-200 dark:border-zinc-800"><th class="py-2 text-start font-semibold">{m.plan}</th><th class="py-2 text-start font-semibold">{m.price}</th><th class="py-2 text-start font-semibold">{m.quota}</th><th class="py-2 text-start font-semibold">{m.rate}</th></tr>
			</thead>
			<tbody>
				<tr class="border-b border-zinc-200 dark:border-zinc-800"><td class="py-2">{m.plan_free}</td><td>$0</td><td>1,000 / day</td><td>1 / sec</td></tr>
				<tr class="border-b border-zinc-200 dark:border-zinc-800"><td class="py-2">{m.plan_hobby}</td><td>$5/mo</td><td>10,000 / day</td><td>5 / sec</td></tr>
				<tr><td class="py-2">{m.plan_enterprise}</td><td>—</td><td>∞</td><td>10 / sec</td></tr>
			</tbody>
		</table>
		<p class="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{m.pricing_joke}</p>
	</section>

	<p class="py-12 text-center text-sm text-zinc-500 dark:text-zinc-400">{m.footer}</p>
</main>
