<script>
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	const m = $derived(page.data.m);
	const providers = $derived(page.data.providers || {});

	let loaded = $state(false);
	let loggedIn = $state(false);
	let email = $state('');
	let accounts = $state([]);
	let activeId = $state('');
	let role = $state('member');
	let apiKey = $state(null);
	let joinCode = $state(null);
	let members = $state([]);
	let usage = $state(null);
	let usageBucket = $state('day');
	let keys = $state([]);
	let grants = $state([]);

	const api = (p, o) => fetch('/dashboard/api' + p, { credentials: 'same-origin', ...o }); // dashboard data (session)
	const post = (p, body) => api(p, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body ?? {}) });

	async function load() {
		const me = await api('/me');
		loaded = true;
		if (me.status !== 200) { loggedIn = false; return; }
		loggedIn = true;
		const u = await me.json();
		email = u.email || u.user_id;
		const a = await (await api('/accounts')).json();
		accounts = a.accounts || [];
		activeId = a.active_account_id;
		await loadTeam();
		await loadMembers();
		await loadUsage();
		await loadKeys();
		await loadGrants();
	}
	async function loadKeys() { keys = (await (await api('/keys')).json()).keys || []; }
	async function loadGrants() { grants = (await (await api('/grants')).json()).grants || []; }
	async function loadTeam() { const r = await (await api('/team/settings')).json(); role = r.role; joinCode = r.join_code; }
	async function loadMembers() { const r = await (await api('/team/members')).json(); members = r.members || []; }
	async function loadUsage() { usage = await (await api('/usage?bucket=' + usageBucket)).json(); }
	async function switchAccount(e) { await post('/account/switch', { account_id: e.currentTarget.value }); apiKey = null; await load(); }
	async function createAccount() { const name = prompt('New account name?'); if (!name) return; await post('/account/create', { name }); await load(); }
	async function mintKey() { const r = await (await post('/team/keys', {})).json(); apiKey = r.api_key; await loadKeys(); }
	async function revokeKey(id) { await post('/keys/revoke', { key_id: id }); if (keys.length === 1) apiKey = null; await loadKeys(); }
	async function revokeGrant(clientId) { await post('/grants/revoke', { client_id: clientId }); await loadGrants(); }
	async function rotateCode() { const r = await (await post('/team/join-code/rotate', {})).json(); joinCode = r.join_code; }
	async function revokeCode() { await post('/team/join-code/revoke', {}); joinCode = null; }

	const joinLink = $derived(joinCode ? location.origin + '/join/' + joinCode : '');
	const mailto = $derived(joinCode ? 'mailto:?subject=' + encodeURIComponent('Join my PUID team') + '&body=' + encodeURIComponent('Join my team on PUID. Sign in with Google or Microsoft, then you are in:\n' + joinLink) : '');
	const maxPoint = $derived(usage?.points?.length ? Math.max(...usage.points.map((p) => p.count)) : 0);

	onMount(load);

	const cardCls = 'rounded-2xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900';
	const btn = 'inline-flex min-h-11 items-center rounded-xl border border-zinc-300 px-4 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800';
	const btnPrimary = 'inline-flex min-h-11 items-center rounded-xl bg-indigo-600 px-4 font-semibold text-white hover:bg-indigo-500';
</script>

<main class="mx-auto max-w-3xl px-5">
	<h1 class="py-8 text-3xl font-bold tracking-tight">{m.nav_dashboard}</h1>

	{#if !loaded}
		<p class="text-zinc-500 dark:text-zinc-400">…</p>
	{:else if !loggedIn}
		<div class={cardCls}>
			<p>{m.signin_prompt}</p>
			<div class="mt-4 flex flex-wrap gap-3">
				{#if providers.google}<a href="/auth/login/google?next=/dashboard" class={btnPrimary}>{m.signin_google}</a>{/if}
				{#if providers.microsoft}<a href="/auth/login/microsoft?next=/dashboard" class={btn}>{m.signin_microsoft}</a>{/if}
			</div>
			<p class="mt-3 text-sm text-zinc-500 dark:text-zinc-400">{m.no_password}</p>
		</div>
	{:else}
		<div class="{cardCls} flex flex-wrap items-center justify-between gap-3">
			<div>{m.nav_dashboard}: <b data-testid="email">{email}</b></div>
			<div class="flex flex-wrap items-center gap-2">
				{m.account}:
				<select data-testid="account-select" value={activeId} onchange={switchAccount} class="rounded-lg border border-zinc-300 bg-transparent px-2 py-1.5 dark:border-zinc-700">
					{#each accounts as a (a.id)}<option value={a.id}>{a.name} ({a.role})</option>{/each}
				</select>
				<button class={btn} data-testid="new-account-btn" onclick={createAccount}>{m.new_account}</button>
			</div>
		</div>

		<div class="{cardCls} mt-4">
			<h3 class="mb-2 font-semibold">{m.api_key}</h3>
			<div class="flex flex-wrap items-center gap-3">
				<button class={btnPrimary} data-testid="mint-btn" onclick={mintKey}>{m.mint_key}</button>
				<span class="text-sm text-zinc-500 dark:text-zinc-400">{m.shown_once}</span>
			</div>
			{#if apiKey}<pre data-testid="key-out" class="mt-3 overflow-auto rounded-lg bg-zinc-100 p-3 font-mono text-sm dark:bg-zinc-950">{apiKey}

{m.key_saved}</pre>{/if}
			{#if keys.length}
				<table class="mt-4 w-full text-sm" data-testid="keys">
					<tbody>
						{#each keys as k (k.id)}
							<tr class="border-b border-zinc-200 dark:border-zinc-800">
								<td class="py-1.5">{k.label}</td>
								<td class="font-mono text-zinc-500 dark:text-zinc-400">…{k.hint}</td>
								<td class="text-right"><button class="text-sm text-red-600 hover:underline dark:text-red-400" data-testid="revoke-key" onclick={() => revokeKey(k.id)}>{m.revoke_action}</button></td>
							</tr>
						{/each}
					</tbody>
				</table>
			{/if}
		</div>

		<div class="{cardCls} mt-4">
			<h3 class="mb-2 font-semibold">{m.authorized_apps}</h3>
			<p class="text-sm text-zinc-500 dark:text-zinc-400">{m.apps_desc}</p>
			{#if grants.length}
				<table class="mt-3 w-full text-sm" data-testid="grants">
					<tbody>
						{#each grants as g (g.client_id)}
							<tr class="border-b border-zinc-200 dark:border-zinc-800">
								<td class="py-1.5">{g.name || g.client_id}</td>
								<td class="font-mono text-zinc-500 dark:text-zinc-400">{g.scope}</td>
								<td class="text-right"><button class="text-sm text-red-600 hover:underline dark:text-red-400" data-testid="revoke-grant" onclick={() => revokeGrant(g.client_id)}>{m.revoke_action}</button></td>
							</tr>
						{/each}
					</tbody>
				</table>
			{:else}<p class="mt-3 text-sm text-zinc-400 dark:text-zinc-500">{m.no_apps}</p>{/if}
		</div>


		<div class="{cardCls} mt-4">
			<div class="mb-3 flex flex-wrap items-center justify-between gap-2">
				<h3 class="font-semibold">{m.usage_title} <span class="text-sm font-normal text-zinc-500 dark:text-zinc-400">({m.usage_total} {usage?.total ?? 0})</span></h3>
				<select value={usageBucket} onchange={(e) => { usageBucket = e.currentTarget.value; loadUsage(); }} class="rounded-lg border border-zinc-300 bg-transparent px-2 py-1.5 text-sm dark:border-zinc-700">
					<option value="minute">{m.bucket_minute}</option>
					<option value="hour">{m.bucket_hour}</option>
					<option value="day">{m.bucket_day}</option>
				</select>
			</div>
			{#if usage?.points?.length}
				<div class="flex items-end gap-px" style="height:80px">
					{#each usage.points as p}
						<div class="flex-1 rounded-t bg-indigo-500/70" style="height:{maxPoint ? Math.max(3, (p.count / maxPoint) * 80) : 3}px" title={new Date(p.t).toLocaleString() + ': ' + p.count}></div>
					{/each}
				</div>
			{:else}<p class="text-sm text-zinc-500 dark:text-zinc-400">{m.no_usage}</p>{/if}
		</div>

		<div class="{cardCls} mt-4">
			<h3 class="mb-2 font-semibold">{m.team}</h3>
			{#if role === 'owner'}
				<p class="text-sm text-zinc-500 dark:text-zinc-400">{m.join_intro}</p>
				{#if joinCode}
					<pre data-testid="join-link" class="mt-3 overflow-auto rounded-lg bg-zinc-100 p-3 font-mono text-sm dark:bg-zinc-950">{m.join_code_label} {joinCode}
{m.join_link_label} {joinLink}</pre>
					<div class="mt-3 flex flex-wrap gap-2">
						<a href={mailto} data-testid="join-mailto" class={btnPrimary}>{m.share_email}</a>
						<button class={btn} data-testid="rotate-btn" onclick={rotateCode}>{m.rotate}</button>
						<button class={btn} data-testid="revoke-btn" onclick={revokeCode}>{m.revoke}</button>
					</div>
				{:else}
					<p class="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{m.joining_disabled}</p>
					<button class="{btnPrimary} mt-2" data-testid="generate-btn" onclick={rotateCode}>{m.generate_code}</button>
				{/if}
			{:else}
				<p class="text-sm text-zinc-500 dark:text-zinc-400">{m.owners_only}</p>
			{/if}
			<h4 class="mt-4 mb-1 text-sm text-zinc-500 dark:text-zinc-400">{m.members}</h4>
			<table class="w-full text-sm" data-testid="members">
				<tbody>{#each members as mem (mem.user_id)}<tr class="border-b border-zinc-200 dark:border-zinc-800"><td class="py-1.5">{mem.email || mem.user_id}</td><td class="text-zinc-500 dark:text-zinc-400">{mem.role}</td></tr>{/each}</tbody>
			</table>
		</div>
	{/if}
</main>
