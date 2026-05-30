<script>
	import { page } from '$app/state';
	const m = $derived(page.data.m);
</script>

<main class="mx-auto max-w-3xl px-5">
	<section class="py-12">
		<h1 class="text-4xl font-bold tracking-tight">Okay, it's a joke.</h1>
		<p class="mt-3 text-lg text-zinc-500 dark:text-zinc-400">PUID is a very over-built way to hand out a number. But the "provably unique" part is real. Here is how it actually works.</p>
	</section>

	<div class="space-y-6 text-zinc-700 dark:text-zinc-300">
		<div class="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
			<h2 class="mb-2 text-xl font-semibold text-zinc-900 dark:text-zinc-100">It's just a counter</h2>
			<p>Under the hood, PUID just counts. 1, 2, 3, and so on. A UUIDv4 is random instead, so it is only probably unique. If you make enough of them, two can come out the same.</p>
			<p class="mt-3">To be fair, that almost never happens. A random UUID is fine for 99.999999% of apps. You would have to generate billions of them before a collision is even worth worrying about. So in real life UUIDs are great. A counter is just simpler to reason about, because it never repeats. The only problem is that the number 3 makes a pretty boring id.</p>
		</div>

		<div class="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
			<h2 class="mb-2 text-xl font-semibold text-zinc-900 dark:text-zinc-100">So I hide the counter</h2>
			<p>I take the counter and run it through a small cipher (a 128-bit Feistel permutation), then encode it with base62. A permutation just shuffles the numbers around. Every input maps to a different output, and no two inputs ever land on the same output. So the ids can never collide, and they still look random. Same uniqueness as a plain counter, but now it looks like a real id.</p>
			<p class="mt-3 font-mono text-sm break-all text-zinc-500 dark:text-zinc-400">#1 turns into 64qAN39GjJh5kbi4HROOxh. #2 turns into 7U17bzw0MO3mzwuFKO7cc0.</p>
		</div>

		<div class="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
			<h2 class="mb-2 text-xl font-semibold text-zinc-900 dark:text-zinc-100">It can decode itself</h2>
			<p>The cipher also runs backwards. So <code>GET /api/v1/ordinal/&lt;id&gt;</code> turns any PUID back into its counter value. That proves the id <code>64qAN39Gj...</code> was really just #1. It also means that if you subtract two ids, you can tell how many we have handed out. So no, do not use this in production.</p>
		</div>

		<div class="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
			<h2 class="mb-2 text-xl font-semibold text-zinc-900 dark:text-zinc-100">Why build all this for a counter?</h2>
			<p>Mostly for fun, and to see how far the joke would go. There is a full OAuth2 server, sign in with Google and Microsoft, teams, 20 SDKs, a Postgres extension, 20 languages, and three test suites. All of it just to return <code>i++</code> in a nicer wrapper. If you like this kind of thing, I am <a class="text-indigo-600 dark:text-indigo-400" href="https://linkedin.com/in/jtwebman" target="_blank" rel="noopener">on LinkedIn</a>.</p>
		</div>
	</div>

	<p class="py-12 text-center text-sm text-zinc-500 dark:text-zinc-400">{m.footer}</p>
</main>
