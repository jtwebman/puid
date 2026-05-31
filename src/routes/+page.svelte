<script>
	import { page } from '$app/state';
	const m = $derived(page.data.m);

	const features = $derived([
		{ t: m.feat_unique_t, b: m.feat_unique_b, icon: '🛡️' },
		{ t: m.feat_random_t, b: m.feat_random_b, icon: '🔐' },
		{ t: m.feat_edge_t, b: m.feat_edge_b, icon: '🌐' },
		{ t: m.feat_oauth_t, b: m.feat_oauth_b, icon: '🔑' },
		{ t: m.feat_sdk_t, b: m.feat_sdk_b, icon: '📦' },
		{ t: m.feat_team_t, b: m.feat_team_b, icon: '👥' }
	]);
	const stats = $derived([
		{ n: m.stat_collisions_n, l: m.stat_collisions_l },
		{ n: m.stat_keyspace_n, l: m.stat_keyspace_l },
		{ n: m.stat_uptime_n, l: m.stat_uptime_l },
		{ n: m.stat_sdks_n, l: m.stat_sdks_l }
	]);
	const steps = $derived([
		{ t: m.step1_t, b: m.step1_b },
		{ t: m.step2_t, b: m.step2_b },
		{ t: m.step3_t, b: m.step3_b }
	]);
	const quotes = $derived([
		{ q: m.quote1, n: m.name1, r: m.role1 },
		{ q: m.quote2, n: m.name2, r: m.role2 },
		{ q: m.quote3, n: m.name3, r: m.role3 }
	]);

	const card = 'rounded-2xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900';
</script>

<main>
	<!-- Hero -->
	<section class="relative overflow-hidden">
		<div class="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-indigo-50/80 to-transparent dark:from-indigo-950/30"></div>
		<div class="mx-auto max-w-3xl px-5 py-16 sm:py-24 text-center">
			<span class="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950/50 dark:text-indigo-300">
				<span class="inline-block h-1.5 w-1.5 rounded-full bg-indigo-500"></span> 100% collision-free, guaranteed
			</span>
			<h1 class="mt-5 text-5xl font-bold tracking-tight sm:text-6xl">{m.hero_sub}</h1>
			<p class="mx-auto mt-5 max-w-xl text-lg text-zinc-600 dark:text-zinc-300">{m.hero_desc}</p>
			<div class="mt-8 flex flex-wrap justify-center gap-3">
				<a href="/dashboard" class="inline-flex min-h-11 items-center rounded-xl bg-indigo-600 px-6 font-semibold text-white shadow-sm transition hover:bg-indigo-500">{m.get_api_key}</a>
				<a href="/docs" class="inline-flex min-h-11 items-center rounded-xl border border-zinc-300 px-6 font-medium transition hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800">{m.nav_docs}</a>
			</div>
			<p class="mt-4 text-xs text-zinc-500 dark:text-zinc-400">{m.hero_note}</p>
			<div class="mx-auto mt-10 max-w-md rounded-xl border border-zinc-200 bg-white/70 px-4 py-3 font-mono text-sm break-all text-zinc-500 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/70 dark:text-zinc-400">
				#1 → <b class="text-zinc-900 dark:text-zinc-100">64qAN39GjJh5kbi4HROOxh</b><br />
				#2 → <b class="text-zinc-900 dark:text-zinc-100">7U17bzw0MO3mzwuFKO7cc0</b>
			</div>
		</div>
	</section>

	<!-- Stats -->
	<section class="border-y border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
		<div class="mx-auto grid max-w-3xl grid-cols-2 gap-6 px-5 py-10 sm:grid-cols-4">
			{#each stats as s}
				<div class="text-center">
					<p class="text-3xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400">{s.n}</p>
					<p class="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{s.l}</p>
				</div>
			{/each}
		</div>
	</section>

	<!-- Features -->
	<section class="mx-auto max-w-3xl px-5 py-16">
		<div class="text-center">
			<h2 class="text-3xl font-semibold tracking-tight">{m.features_title}</h2>
			<p class="mx-auto mt-3 max-w-xl text-zinc-600 dark:text-zinc-300">{m.features_sub}</p>
		</div>
		<div class="mt-10 grid gap-4 sm:grid-cols-2">
			{#each features as f}
				<div class={card}>
					<div class="text-2xl">{f.icon}</div>
					<h3 class="mt-3 font-semibold">{f.t}</h3>
					<p class="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">{f.b}</p>
				</div>
			{/each}
		</div>
	</section>

	<!-- How it works -->
	<section class="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
		<div class="mx-auto max-w-3xl px-5 py-16">
			<div class="text-center">
				<h2 class="text-3xl font-semibold tracking-tight">{m.how_title}</h2>
				<p class="mt-3 text-zinc-600 dark:text-zinc-300">{m.how_sub}</p>
			</div>
			<ol class="mt-10 grid gap-6 sm:grid-cols-3">
				{#each steps as s, i}
					<li class="relative">
						<span class="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 font-semibold text-white">{i + 1}</span>
						<h3 class="mt-4 font-semibold">{s.t}</h3>
						<p class="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">{s.b}</p>
					</li>
				{/each}
			</ol>
			<pre class="mt-10 overflow-auto rounded-xl border border-zinc-200 bg-white p-4 font-mono text-sm dark:border-zinc-800 dark:bg-zinc-950">curl -H "X-API-Key: $PUID_API_KEY" "https://puid.dev/api/v1/ids?n=3"
# {`{`} "ids": ["64qAN39Gj...","7U17bzw0M...","30VPBF31V..."], "count": 3 {`}`}</pre>
		</div>
	</section>

	<!-- Testimonials -->
	<section class="mx-auto max-w-3xl px-5 py-16">
		<h2 class="text-center text-3xl font-semibold tracking-tight">{m.loved_title}</h2>
		<div class="mt-10 grid gap-4 sm:grid-cols-3">
			{#each quotes as c}
				<figure class={card}>
					<blockquote class="text-sm text-zinc-700 dark:text-zinc-200">“{c.q}”</blockquote>
					<figcaption class="mt-4 text-sm">
						<span class="font-semibold">{c.n}</span>
						<span class="block text-zinc-500 dark:text-zinc-400">{c.r}</span>
					</figcaption>
				</figure>
			{/each}
		</div>
	</section>

	<!-- Pricing -->
	<section class="mx-auto max-w-3xl px-5 pb-16">
		<h2 class="mb-8 text-center text-3xl font-semibold tracking-tight">{m.pricing}</h2>
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
				<a href="/upgrade?plan=professional" class="mt-6 inline-flex min-h-10 items-center justify-center rounded-lg bg-indigo-600 text-sm font-semibold text-white hover:bg-indigo-500">{m.upgrade_cta}</a>
			</div>
			<!-- Enterprise (self-hosted, unlimited) -->
			<div class="flex flex-col rounded-2xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
				<h3 class="font-semibold">{m.plan_enterprise}</h3>
				<p class="mt-2 text-3xl font-bold">$1,000<span class="text-base font-normal text-zinc-500 dark:text-zinc-400">/mo</span></p>
				<p class="mt-1 text-sm text-zinc-600 dark:text-zinc-300">{m.enterprise_note}</p>
				<ul class="mt-4 grow space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
					{#each m.ent_features.split('\n') as f}<li class="flex gap-2"><span class="text-indigo-600 dark:text-indigo-400">✓</span>{f}</li>{/each}
				</ul>
				<a href="/upgrade?plan=enterprise" class="mt-6 inline-flex min-h-10 items-center justify-center rounded-lg border border-zinc-300 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800">{m.upgrade_cta}</a>
			</div>
		</div>
	</section>

	<!-- Closing CTA -->
	<section class="border-t border-zinc-200 dark:border-zinc-800">
		<div class="mx-auto max-w-3xl px-5 py-16 text-center">
			<h2 class="text-3xl font-bold tracking-tight">{m.cta_title}</h2>
			<p class="mx-auto mt-3 max-w-lg text-zinc-600 dark:text-zinc-300">{m.cta_sub}</p>
			<a href="/dashboard" class="mt-8 inline-flex min-h-11 items-center rounded-xl bg-indigo-600 px-6 font-semibold text-white shadow-sm transition hover:bg-indigo-500">{m.get_api_key}</a>
		</div>
	</section>
</main>
