<script>
	import { page } from '$app/state';
	const m = $derived(page.data.m);
	const updated = 'May 30, 2026';
</script>

<main class="mx-auto max-w-3xl px-5">
	<section class="py-10">
		<h1 class="text-4xl font-bold tracking-tight">Terms of Service</h1>
		<p class="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Last updated: {updated}</p>
	</section>

	<div class="space-y-6 text-zinc-700 dark:text-zinc-300 [&_h2]:mt-6 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-zinc-900 dark:[&_h2]:text-zinc-100 [&_p]:mt-2 [&_a]:text-indigo-600 dark:[&_a]:text-indigo-400">
		<p class="rounded-lg border border-amber-300/50 bg-amber-50 p-3 text-sm dark:border-amber-500/30 dark:bg-amber-500/10">
			PUID is a parody/demonstration service. This document is a good-faith template, not legal advice — have counsel review it before relying on it.
		</p>

		<h2>1. Acceptance</h2>
		<p>By accessing puid.dev or the PUID API ("the Service") you agree to these Terms and to our <a href="/privacy">Privacy Policy</a>. If you don't agree, don't use the Service.</p>

		<h2>2. The Service</h2>
		<p>The Service issues unique identifiers via an API and web dashboard. It is provided for demonstration and entertainment. Free accounts are limited to one request per second and 1,000 identifiers per day.</p>

		<h2>3. Accounts</h2>
		<p>You sign in with Google or Microsoft. You are responsible for activity under your account and for keeping API keys secret. You must be at least 16 years old (or the digital-consent age in your jurisdiction).</p>

		<h2>4. Acceptable use</h2>
		<p>Don't abuse, overload, reverse-engineer for harm, or use the Service unlawfully. We may rate-limit, suspend, or terminate accounts that do.</p>

		<h2>5. No warranty</h2>
		<p>The Service is provided "as is," without warranties of any kind. The identifiers are sequential under a thin disguise and must not be relied upon for security. Do not use this in production.</p>

		<h2>6. Limitation of liability</h2>
		<p>To the maximum extent permitted by law, PUID and its author are not liable for any indirect, incidental, or consequential damages, or for any amount exceeding what you paid us in the prior 12 months (for most users, $0).</p>

		<h2>7. Termination</h2>
		<p>You may stop using the Service and delete your account at any time. We may suspend or end the Service with reasonable notice.</p>

		<h2>8. Changes</h2>
		<p>We may update these Terms; material changes will be posted here with a new "last updated" date. Continued use means acceptance.</p>

		<h2>9. Governing law</h2>
		<p>These Terms are governed by the laws of the State of California, USA, without regard to conflict-of-laws rules, and subject to any mandatory consumer protections of your country of residence.</p>

		<h2>10. Contact</h2>
		<p>Questions: <a href="https://linkedin.com/in/jtwebman" target="_blank" rel="noopener">linkedin.com/in/jtwebman</a>.</p>
	</div>

	<p class="py-12 text-center text-sm text-zinc-500 dark:text-zinc-400">{m.footer}</p>
</main>
