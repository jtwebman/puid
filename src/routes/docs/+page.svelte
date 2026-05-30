<script>
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	const m = $derived(page.data.m);

	onMount(async () => {
		await new Promise((resolve, reject) => {
			const link = document.createElement('link');
			link.rel = 'stylesheet';
			link.href = 'https://unpkg.com/swagger-ui-dist@5/swagger-ui.css';
			document.head.appendChild(link);
			const s = document.createElement('script');
			s.src = 'https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js';
			s.onload = resolve;
			s.onerror = reject;
			document.head.appendChild(s);
		});
		// eslint-disable-next-line no-undef
		window.SwaggerUIBundle({ url: '/api/openapi.json', dom_id: '#swagger', tryItOutEnabled: true });
	});
</script>

<main class="mx-auto max-w-3xl px-5">
	<section class="py-8">
		<h1 class="text-3xl font-bold tracking-tight">{m.nav_docs}</h1>
		<p class="mt-2 text-zinc-500 dark:text-zinc-400">
			Click <b>Authorize</b>, paste a <code>puid_live_…</code> key (mint one in the
			<a class="text-indigo-600 dark:text-indigo-400" href="/dashboard">dashboard</a>), then try <code>GET /v1/ids</code>.
		</p>
	</section>
	<div id="swagger" class="mb-12 overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800"></div>
</main>
