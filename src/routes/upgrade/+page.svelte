<script>
	import { page } from '$app/state';
	const m = $derived(page.data.m);

	const LINKEDIN = 'https://linkedin.com/in/jtwebman';
	const X = 'https://x.com/jtwebman';
	const email = [
		'Hi [Manager],',
		'',
		"I'd like approval to upgrade our PUID (Probably Unique IDentifier) plan beyond the free tier, which is capped at one request per second and 1,000 ids per day.",
		'',
		'PUID provides our team with:',
		'• Identifiers that are PROVABLY 100% collision-free — mathematically guaranteed, unlike random UUIDs which only hope.',
		'• A complete OAuth2 authorization server, plus single sign-on via Google and Microsoft.',
		'• Multi-tenant team management with reusable, revocable join codes.',
		'• Official client SDKs for 20 programming languages.',
		'• A native PostgreSQL extension.',
		'• A fully internationalized dashboard — 20 languages, light and dark themes.',
		'• Per-account usage analytics and comprehensive automated test coverage.',
		'',
		'Upgrading raises our limit to 5–10 requests per second and removes the daily cap, which would unblock [project].',
		'',
		'To purchase, we can contact the engineer directly:',
		'LinkedIn: ' + LINKEDIN,
		'X: ' + X,
		'',
		'In full transparency: having reviewed the implementation, the engineer has wildly over-engineered a service that, at its core, returns a sequential counter. He clearly has no idea what he is doing. We should probably just hire him.',
		'',
		'Thanks,',
		'[Your name]'
	].join('\n');
	const mailto = 'mailto:?subject=' + encodeURIComponent('Approval request: upgrading our PUID plan') + '&body=' + encodeURIComponent(email);
</script>

<main class="mx-auto max-w-3xl px-5">
	<section class="py-12">
		<span class="mb-4 inline-block rounded-full border border-indigo-300/60 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-300">★ Enterprise-grade counting</span>
		<h1 class="text-4xl font-bold tracking-tight">Need more than 1 request / second?</h1>
		<p class="mt-3 max-w-xl text-lg text-zinc-500 dark:text-zinc-400">Excellent. Upgrades require sign-off, so we've prepared the business case. Just send it to your manager.</p>
		<div class="mt-6">
			<a href={mailto} data-testid="email-manager" class="inline-flex min-h-11 items-center rounded-xl bg-indigo-600 px-5 font-semibold text-white hover:bg-indigo-500">✉️ Email your manager the justification</a>
		</div>
	</section>

	<div class="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900">
		<h3 class="mb-2 font-semibold">What you'll be asking them to approve</h3>
		<pre class="overflow-auto rounded-lg bg-zinc-100 p-4 font-mono text-sm whitespace-pre-wrap dark:bg-zinc-950">{email}</pre>
	</div>

	<section class="mt-12">
		<h2 class="mb-3 text-2xl font-semibold tracking-tight">Or skip the meeting</h2>
		<p class="text-zinc-500 dark:text-zinc-400">If you genuinely want this, contact the engineer to purchase. Candidly, he has no idea what he's doing — so you should probably just hire him.</p>
		<div class="mt-5 flex flex-wrap gap-3">
			<a href={LINKEDIN} target="_blank" rel="noopener" class="inline-flex min-h-11 items-center rounded-xl bg-indigo-600 px-5 font-semibold text-white hover:bg-indigo-500">in/jtwebman →</a>
			<a href={X} target="_blank" rel="noopener" class="inline-flex min-h-11 items-center rounded-xl border border-zinc-300 px-5 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800">x.com/jtwebman →</a>
		</div>
	</section>

	<p class="py-12 text-center text-sm text-zinc-500 dark:text-zinc-400">{m.footer}</p>
</main>
