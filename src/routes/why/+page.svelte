<script>
	import { page } from '$app/state';
	const m = $derived(page.data.m);
</script>

<main class="mx-auto max-w-3xl px-5">
	<section class="py-12">
		<h1 class="text-4xl font-bold tracking-tight">Okay, it's a joke.</h1>
		<p class="mt-3 text-lg text-zinc-500 dark:text-zinc-400">PUID is the most over-engineered way imaginable to hand out a number. But the "provably unique" claim is completely real — here's the trick the marketing page won't tell you.</p>
	</section>

	<div class="space-y-6 text-zinc-700 dark:text-zinc-300">
		<div class="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
			<h2 class="mb-2 text-xl font-semibold text-zinc-900 dark:text-zinc-100">It's just a counter</h2>
			<p>Under the hood, PUID increments a single integer: 1, 2, 3, … A real UUIDv4 is <em>random</em>, so its uniqueness is only <em>probable</em> — generate enough and two can collide. A counter never repeats, so it's perfectly unique. The problem? <code>3</code> is a terrible-looking id.</p>
		</div>

		<div class="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
			<h2 class="mb-2 text-xl font-semibold text-zinc-900 dark:text-zinc-100">So we disguise it with a bijection</h2>
			<p>We run the counter through a <strong>128-bit Feistel permutation</strong> (a tiny cipher) and base62-encode the result. A permutation is a <em>bijection</em>: distinct inputs always map to distinct outputs. So the disguised ids are guaranteed never to collide — <em>provably</em>, by the pigeonhole principle, not by luck — yet they look like random noise.</p>
			<p class="mt-3 font-mono text-sm break-all text-zinc-500 dark:text-zinc-400">#1 → 64qAN39GjJh5kbi4HROOxh &nbsp;·&nbsp; #2 → 7U17bzw0MO3mzwuFKO7cc0</p>
		</div>

		<div class="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
			<h2 class="mb-2 text-xl font-semibold text-zinc-900 dark:text-zinc-100">We even rat ourselves out</h2>
			<p>Because the permutation is reversible, <code>GET /api/v1/ordinal/&lt;id&gt;</code> decrypts any PUID right back to its ordinal — proving id <code>64qAN39Gj…</code> was always just <code>#1</code>. Which also means subtracting two ids reveals how many we've ever issued. Please, truly, do not use this in production.</p>
		</div>

		<div class="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
			<h2 class="mb-2 text-xl font-semibold text-zinc-900 dark:text-zinc-100">Why build all this for a counter?</h2>
			<p>For fun, and to see how far a joke could be taken: a full OAuth2 server, SSO, multi-tenant teams, 20 SDKs, a Postgres extension, 20-language i18n, and three test suites — all to return <code>i++</code> in a trench coat. If you appreciate this kind of thing, the engineer is <a class="text-indigo-600 dark:text-indigo-400" href="https://linkedin.com/in/jtwebman" target="_blank" rel="noopener">on LinkedIn</a>.</p>
		</div>
	</div>

	<p class="py-12 text-center text-sm text-zinc-500 dark:text-zinc-400">{m.footer}</p>
</main>
