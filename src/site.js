// site.js — marketing site + web UI for puid.dev. Hand-written HTML/CSS (the
// Worker has no Tailwind build step) but styled to match the sibling sites
// slowbreath/onyourfeet: zinc palette, rounded controls, class-based `.dark`
// theme with a no-FOUC head script, mobile-first responsive layout.
//
// Top-right has two dropdowns: theme (System/Light/Dark) and language. Language
// is detected server-side from Accept-Language; theme defaults to the browser's
// prefers-color-scheme (applied before paint), both overridable by the dropdowns.
//
// Functions return HTML STRINGS; index.js wraps them in a Response (and may set
// the lang cookie). Leans hard into the bit: the most over-engineered way to count.

import { LOCALES, t } from "./i18n.js";

const STYLE = `
*,*::before,*::after{box-sizing:border-box}
:root{
  --bg:#ffffff; --fg:#18181b; --muted:#71717a; --card:#fafafa; --card2:#f4f4f5;
  --border:#e4e4e7; --hover:rgba(228,228,231,.6); --accent:#4f46e5; --accent-fg:#fff;
  --code:#f4f4f5; --shadow:0 1px 2px rgba(0,0,0,.04),0 8px 24px rgba(0,0,0,.04);
}
html.dark{
  --bg:#09090b; --fg:#f4f4f5; --muted:#a1a1aa; --card:#18181b; --card2:#1f1f23;
  --border:#27272a; --hover:rgba(39,39,42,.6); --accent:#818cf8; --accent-fg:#0b0b0f;
  --code:#18181b; --shadow:0 1px 2px rgba(0,0,0,.3),0 12px 32px rgba(0,0,0,.35);
}
html{color-scheme:light dark}
body{margin:0;background:var(--bg);color:var(--fg);line-height:1.6;
  font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
  -webkit-font-smoothing:antialiased;transition:background .2s,color .2s}
a{color:var(--accent);text-decoration:none}a:hover{text-decoration:underline}
.mono{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}
.muted{color:var(--muted)}
.wrap{max-width:60rem;margin:0 auto;padding:1.25rem}

/* top bar */
.topbar{position:sticky;top:0;z-index:50;display:flex;flex-wrap:wrap;gap:.5rem .75rem;
  align-items:center;justify-content:space-between;padding:.75rem 1.25rem;
  background:color-mix(in srgb,var(--bg) 86%,transparent);backdrop-filter:blur(8px);
  border-bottom:1px solid var(--border)}
.brand{font-weight:700;font-size:1.05rem;color:var(--fg);display:flex;align-items:center;gap:.5rem}
.brand .dot{width:.6rem;height:.6rem;border-radius:50%;background:var(--accent)}
.controls{display:flex;align-items:center;gap:.4rem;flex-wrap:wrap}
.controls a{color:var(--muted);padding:.35rem .5rem;border-radius:.5rem;font-size:.9rem}
.controls a:hover{background:var(--hover);color:var(--fg);text-decoration:none}
.ctl{appearance:none;-webkit-appearance:none;cursor:pointer;background:transparent;color:var(--muted);
  border:1px solid var(--border);border-radius:999px;padding:.4rem 1.8rem .4rem .8rem;font-size:.85rem;
  background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23a1a1aa' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><path d='m6 9 6 6 6-6'/></svg>");
  background-repeat:no-repeat;background-position:right .6rem center}
.ctl:hover{background-color:var(--hover);color:var(--fg)}
.ctl option{background:var(--bg);color:var(--fg)}

/* hero */
.hero{padding:3rem 0 1.5rem}
.badge{display:inline-block;font-size:.75rem;font-weight:600;letter-spacing:.02em;
  color:var(--accent);background:color-mix(in srgb,var(--accent) 12%,transparent);
  border:1px solid color-mix(in srgb,var(--accent) 30%,transparent);
  padding:.3rem .7rem;border-radius:999px;margin-bottom:1rem}
h1{font-size:clamp(2.4rem,8vw,3.6rem);line-height:1.05;margin:.2rem 0;letter-spacing:-.02em}
.lede{font-size:clamp(1.05rem,3vw,1.35rem);color:var(--muted);max-width:38rem}
.sample{margin:1.25rem 0;font-size:clamp(.8rem,2.6vw,1rem);word-break:break-all;color:var(--muted)}
.sample b{color:var(--fg)}

/* buttons */
.btn{display:inline-flex;align-items:center;justify-content:center;gap:.5rem;min-height:2.75rem;
  padding:.6rem 1.1rem;border-radius:.7rem;border:1px solid var(--border);background:var(--card);
  color:var(--fg);font-size:1rem;cursor:pointer;transition:transform .05s,background .15s;text-decoration:none}
.btn:hover{background:var(--card2);text-decoration:none}
.btn:active{transform:translateY(1px)}
.btn.primary{background:var(--accent);border-color:var(--accent);color:var(--accent-fg);font-weight:600}
.btn.primary:hover{filter:brightness(1.05);background:var(--accent)}
.cta{display:flex;gap:.75rem;flex-wrap:wrap;margin-top:1.5rem}

/* cards */
.grid{display:grid;grid-template-columns:1fr;gap:1rem;margin:2rem 0}
@media(min-width:680px){.grid{grid-template-columns:repeat(3,1fr)}}
.card{background:var(--card);border:1px solid var(--border);border-radius:1rem;padding:1.25rem 1.4rem;box-shadow:var(--shadow)}
.card h3{margin:.1rem 0 .5rem;font-size:1.05rem}
.card p{margin:0;color:var(--muted);font-size:.94rem}
section h2{font-size:1.5rem;letter-spacing:-.01em;margin:2.5rem 0 1rem}

/* over-engineering list */
.feat{list-style:none;padding:0;margin:0;display:grid;gap:.55rem}
.feat li{display:flex;gap:.6rem;align-items:flex-start;background:var(--card);border:1px solid var(--border);
  border-radius:.75rem;padding:.7rem .9rem}
.feat .ck{color:var(--accent);flex:0 0 auto;margin-top:.15rem}

pre{background:var(--code);border:1px solid var(--border);border-radius:.75rem;padding:1rem;overflow:auto;font-size:.85rem}
table{width:100%;border-collapse:collapse;font-size:.94rem}
th,td{text-align:start;padding:.55rem .6rem;border-bottom:1px solid var(--border)}
th{color:var(--muted);font-weight:600}
input,select.field{background:var(--bg);color:var(--fg);border:1px solid var(--border);border-radius:.6rem;
  padding:.55rem .7rem;font-size:1rem;min-height:2.75rem;max-width:100%}
.row{display:flex;gap:.6rem;align-items:center;flex-wrap:wrap}
.foot{text-align:center;color:var(--muted);font-size:.9rem;padding:2.5rem 0 1rem}
[hidden]{display:none!important}
`;

const HEAD_SCRIPT = `
(function(){try{var t=localStorage.getItem('puid:theme')||'system';
var d=t==='dark'||(t==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);
if(d)document.documentElement.classList.add('dark');}catch(e){}})();`;

const WIRE_SCRIPT = `
(function(){
  var sel=document.getElementById('themeSel');
  if(sel){sel.value=localStorage.getItem('puid:theme')||'system';
    function apply(t){var d=t==='dark'||(t==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);
      document.documentElement.classList.toggle('dark',d);}
    sel.addEventListener('change',function(){localStorage.setItem('puid:theme',sel.value);apply(sel.value);});
    matchMedia('(prefers-color-scheme: dark)').addEventListener('change',function(){if(sel.value==='system')apply('system');});}
  var lang=document.getElementById('langSel');
  if(lang){lang.addEventListener('change',function(){var u=new URL(location.href);u.searchParams.set('lang',lang.value);location.href=u.toString();});}
})();`;

function controls(locale) {
  const langOpts = Object.entries(LOCALES)
    .map(([code, l]) => `<option value="${code}"${code === locale ? " selected" : ""}>${l.name}</option>`).join("");
  return `<nav class="controls">
    <a href="/docs">${t(locale, "nav_docs")}</a>
    <a href="/dashboard">${t(locale, "nav_dashboard")}</a>
    <select id="themeSel" class="ctl" aria-label="${t(locale, "theme")}" data-testid="theme-select">
      <option value="system">${t(locale, "theme_auto")}</option>
      <option value="light">${t(locale, "theme_light")}</option>
      <option value="dark">${t(locale, "theme_dark")}</option>
    </select>
    <select id="langSel" class="ctl" aria-label="${t(locale, "language")}" data-testid="language-select">${langOpts}</select>
  </nav>`;
}

function shell(locale, { title, body, extraHead = "", bodyEnd = "" }) {
  const dir = LOCALES[locale]?.dir || "ltr";
  return `<!doctype html><html lang="${locale}" dir="${dir}"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light dark"><title>${title}</title>
<script>${HEAD_SCRIPT}</script><style>${STYLE}</style>${extraHead}</head><body>
<header class="topbar"><a class="brand" href="/"><span class="dot"></span> PUID</a>${controls(locale)}</header>
${body}
<script>${WIRE_SCRIPT}</script>${bodyEnd}</body></html>`;
}

export function landingPage(locale) {
  const T = (k) => t(locale, k);
  const body = `<main class="wrap">
  <section class="hero">
    <span class="badge">★ ${T("oe_badge") || "The most over-engineered way to count"}</span>
    <h1>PUID</h1>
    <p class="lede">${T("tagline")}</p>
    <p class="sample mono">#1 → <b>64qAN39GjJh5kbi4HROOxh</b> &nbsp;·&nbsp; #2 → <b>7U17bzw0MO3mzwuFKO7cc0</b></p>
    <div class="cta">
      <a class="btn primary" href="/dashboard">${T("get_key") && (T("nav_dashboard"))}: ${T("cta_get_key") || "Get an API key"}</a>
      <a class="btn" href="/docs">${T("nav_docs")}</a>
    </div>
  </section>

  <div class="grid">
    <div class="card"><h3>${T("guarantee_title")}</h3><p>${T("guarantee_body")}</p></div>
    <div class="card"><h3>${T("random_title")}</h3><p>${T("random_body")}</p></div>
    <div class="card"><h3>${T("ratelimit_title")}</h3><p>${T("ratelimit_body")}</p></div>
  </div>

  <section>
    <h2>${T("oe_title") || "How over-engineered is it?"}</h2>
    <ul class="feat">
      ${[
        "A 128-bit Feistel cipher, just to disguise <code>i++</code> as something random.",
        "A complete OAuth2 authorization server — so third-party apps can be formally granted permission to receive a number.",
        "Sign in with Google or Microsoft. SSO. For a counter.",
        "Multi-tenant teams: many accounts per user, reusable revocable join codes.",
        "20 client SDKs, generated from an OpenAPI spec.",
        "A PostgreSQL extension that turns every <code>INSERT</code> into a rate-limited network call.",
        "This marketing site, in 20 languages, with light & dark themes.",
        "Unit, full-system, and real-browser test suites — to prove a counter counts.",
      ].map((x) => `<li><span class="ck">✓</span><span>${x}</span></li>`).join("")}
    </ul>
  </section>

  <section>
    <h2>${T("quickstart")}</h2>
    <pre class="mono">curl -H "X-API-Key: $PUID_API_KEY" "https://puid.dev/api/v1/ids?n=3"
# { "ids": ["64qAN39Gj...","7U17bzw0M...","30VPBF31V..."], "count": 3 }</pre>
    <p class="muted">${T("get_key")}</p>
  </section>

  <section>
    <h2>${T("pricing")}</h2>
    <table>
      <tr><th>${T("plan")}</th><th>${T("price")}</th><th>${T("quota")}</th><th>${T("rate")}</th></tr>
      <tr><td>${T("plan_free")}</td><td>$0</td><td>1,000 / day</td><td>1 / sec</td></tr>
      <tr><td>${T("plan_hobby")}</td><td>$5/mo</td><td>10,000 / day</td><td>5 / sec</td></tr>
      <tr><td>${T("plan_enterprise")}</td><td>—</td><td>∞</td><td>10 / sec</td></tr>
    </table>
    <p class="muted">${T("pricing_joke")}</p>
  </section>

  <p class="foot">${T("footer")}</p>
</main>`;
  return shell(locale, { title: "PUID — Probably Unique IDentifier", body });
}

export function upgradePage(locale) {
  // The "paywall": to exceed 1 request/second you must justify it to your
  // manager. We pre-write the email. It earnestly lists everything PUID does,
  // then — near the bottom — concedes the engineer has no idea what he's doing
  // and your company should simply hire him. Links go to the author's profiles.
  const LINKEDIN = "https://linkedin.com/in/jtwebman";
  const X = "https://x.com/jtwebman";
  const email = [
    "Hi [Manager],",
    "",
    "I'd like approval to upgrade our PUID (Probably Unique IDentifier) plan beyond the free tier, which is capped at one request per second and 1,000 ids per day.",
    "",
    "PUID provides our team with:",
    "• Identifiers that are PROVABLY 100% collision-free — mathematically guaranteed, unlike random UUIDs which only hope.",
    "• A complete OAuth2 authorization server, plus single sign-on via Google and Microsoft.",
    "• Multi-tenant team management with reusable, revocable join codes.",
    "• Official client SDKs for 20 programming languages.",
    "• A native PostgreSQL extension.",
    "• A fully internationalized dashboard — 20 languages, light and dark themes.",
    "• Per-account usage analytics and comprehensive automated test coverage.",
    "",
    "Upgrading raises our limit to 5–10 requests per second and removes the daily cap, which would unblock [project].",
    "",
    "To purchase, we can contact the engineer directly:",
    "LinkedIn: " + LINKEDIN,
    "X: " + X,
    "",
    "In full transparency: having reviewed the implementation, the engineer has wildly over-engineered a service that, at its core, returns a sequential counter. He clearly has no idea what he is doing. We should probably just hire him.",
    "",
    "Thanks,",
    "[Your name]",
  ].join("\n");
  const mailto = "mailto:?subject=" + encodeURIComponent("Approval request: upgrading our PUID plan") + "&body=" + encodeURIComponent(email);
  const body = `<main class="wrap">
  <section class="hero" style="padding:2.5rem 0 1rem">
    <span class="badge">★ Enterprise-grade counting</span>
    <h1 style="font-size:clamp(2rem,6vw,2.8rem)">Need more than 1 request / second?</h1>
    <p class="lede">Excellent. Upgrades require sign-off, so we've prepared the business case. Just send it to your manager.</p>
    <div class="cta">
      <a class="btn primary" href="${mailto}">✉️ Email your manager the justification</a>
    </div>
  </section>

  <div class="card">
    <h3>What you'll be asking them to approve</h3>
    <pre class="mono" style="white-space:pre-wrap">${email.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]))}</pre>
  </div>

  <section>
    <h2>Or skip the meeting</h2>
    <p class="muted">If you genuinely want this, contact the engineer to purchase. Candidly, he has no idea what he's doing — so you should probably just hire him.</p>
    <div class="cta">
      <a class="btn primary" href="${LINKEDIN}" target="_blank" rel="noopener">in/ jtwebman →</a>
      <a class="btn" href="${X}" target="_blank" rel="noopener">x.com/jtwebman →</a>
    </div>
  </section>

  <p class="foot">${t(locale, "footer")}</p>
</main>`;
  return shell(locale, { title: "Upgrade PUID", body });
}

export function docsPage(locale) {
  const body = `<main class="wrap">
  <section class="hero" style="padding-bottom:.5rem"><h1 style="font-size:2rem">${t(locale, "nav_docs")}</h1>
  <p class="muted">${t(locale, "get_key")}</p></section>
  <div id="swagger" style="background:#fff;border-radius:1rem;overflow:hidden;border:1px solid var(--border)"></div></main>`;
  const extraHead = `<link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css">`;
  const bodyEnd = `<script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
<script>window.addEventListener('load',function(){SwaggerUIBundle({url:'/api/openapi.json',dom_id:'#swagger',tryItOutEnabled:true});});</script>`;
  return shell(locale, { title: "PUID API Docs", body, extraHead, bodyEnd });
}

export function dashboardPage(locale) {
  const T = (k) => t(locale, k);
  const body = `<main class="wrap">
  <section class="hero" style="padding:1.5rem 0 1rem"><h1 style="font-size:2rem">${T("nav_dashboard")}</h1></section>

  <div id="anon" hidden>
    <div class="card"><p>${T("signin_prompt")}</p>
      <div class="cta">
        <a class="btn primary" href="/auth/login/google?next=/dashboard">${T("signin_google")}</a>
        <a class="btn" href="/auth/login/microsoft?next=/dashboard">${T("signin_microsoft")}</a>
      </div>
      <p class="muted" style="margin-top:.75rem">${T("no_password")}</p>
    </div>
  </div>

  <div id="app" hidden>
    <div class="card row" style="justify-content:space-between">
      <div>${T("nav_dashboard")}: <b id="email"></b></div>
      <div class="row">${T("account")}:
        <select id="accountSel" class="field"></select>
        <button class="btn" onclick="createAccount()">${T("new_account")}</button>
      </div>
    </div>

    <div class="card" style="margin-top:1rem">
      <h3>${T("api_key")}</h3>
      <div class="row"><button class="btn primary" onclick="mintKey()">${T("mint_key")}</button>
        <span class="muted">${T("shown_once")}</span></div>
      <pre id="keyOut" class="mono" hidden></pre>
    </div>

    <div class="card" style="margin-top:1rem">
      <h3>${T("generate_ids")} <span class="muted">${T("one_per_sec")}</span></h3>
      <div class="row">${T("how_many")} <input id="n" type="number" min="1" max="10" value="3" style="width:5rem">
        <button class="btn primary" onclick="gen()" data-testid="gen-btn">${T("generate")}</button></div>
      <pre id="idsOut" class="mono" hidden></pre>
      <div id="ordinals"></div>
    </div>

    <div class="card" style="margin-top:1rem">
      <h3>${T("team")}</h3>
      <div id="ownerTeam" hidden>
        <p class="muted">${T("join_intro")}</p>
        <div id="hasCode" hidden>
          <pre id="joinOut" class="mono" data-testid="join-link"></pre>
          <div class="row">
            <a id="joinMail" class="btn primary" data-testid="join-mailto">${T("share_email")}</a>
            <button class="btn" onclick="rotateCode()" data-testid="rotate-btn">${T("rotate")}</button>
            <button class="btn" onclick="revokeCode()" data-testid="revoke-btn">${T("revoke")}</button>
          </div>
        </div>
        <div id="noCode" hidden>
          <p class="muted">${T("joining_disabled")}</p>
          <button class="btn primary" onclick="rotateCode()" data-testid="generate-btn">${T("generate_code")}</button>
        </div>
      </div>
      <div id="memberTeam" hidden class="muted">${T("owners_only")}</div>
      <h4 class="muted">${T("members")}</h4>
      <table><tbody id="members"></tbody></table>
    </div>
  </div>
</main>`;
  const bodyEnd = `<script>${DASH_JS}</script>`;
  return shell(locale, { title: "PUID Dashboard", body, bodyEnd });
}

// Dashboard client logic (unchanged behavior; just lives here as a string).
const DASH_JS = `
let KEY=null;
const $=(id)=>document.getElementById(id);
async function api(p,o){return fetch('/api'+p,{credentials:'same-origin',...o});}
async function load(){
  const me=await api('/me'); if(me.status!==200){$('anon').hidden=false;return;}
  const u=await me.json(); $('app').hidden=false; $('email').textContent=u.email||u.user_id;
  const accs=await (await api('/accounts')).json(); const sel=$('accountSel'); sel.innerHTML='';
  for(const a of accs.accounts){const o=document.createElement('option');o.value=a.id;o.textContent=a.name+' ('+a.role+')';if(a.id===accs.active_account_id)o.selected=true;sel.appendChild(o);}
  sel.onchange=async()=>{await api('/account/switch',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({account_id:sel.value})});KEY=null;$('keyOut').hidden=true;loadMembers();loadTeam();};
  loadMembers();loadTeam();
}
async function loadMembers(){const r=await (await api('/team/members')).json();
  $('members').innerHTML=(r.members||[]).map(m=>'<tr><td>'+(m.email||m.user_id)+'</td><td class=muted>'+m.role+'</td></tr>').join('');}
async function loadTeam(){const r=await (await api('/team/settings')).json();const owner=r.role==='owner';
  $('ownerTeam').hidden=!owner;$('memberTeam').hidden=owner;if(owner)renderJoinCode(r.join_code);}
function renderJoinCode(code){const has=!!code;$('hasCode').hidden=!has;$('noCode').hidden=has;if(!has)return;
  const link=location.origin+'/join/'+code;
  $('joinOut').textContent='Join code: '+code+'\\nJoin link: '+link+'\\n\\nAnyone with this works until you rotate or revoke it.';
  const subject=encodeURIComponent('Join my PUID team');
  const bodyt=encodeURIComponent('Join my team on PUID. Sign in with Google or Microsoft, then you are in:\\n'+link);
  $('joinMail').href='mailto:?subject='+subject+'&body='+bodyt;}
async function rotateCode(){const r=await (await api('/team/join-code/rotate',{method:'POST'})).json();renderJoinCode(r.join_code);}
async function revokeCode(){await api('/team/join-code/revoke',{method:'POST'});renderJoinCode(null);}
async function createAccount(){const name=prompt('New account name?');if(!name)return;
  await api('/account/create',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({name})});load();}
async function mintKey(){const r=await (await api('/team/keys',{method:'POST',headers:{'content-type':'application/json'},body:'{}'})).json();
  KEY=r.api_key;$('keyOut').hidden=false;$('keyOut').textContent=r.api_key+'\\n\\nSave it — we hash it and cannot show it again.';}
async function gen(){if(!KEY){alert('Mint an API key first.');return;}const n=$('n').value;
  const res=await api('/v1/ids?n='+n,{headers:{'X-API-Key':KEY}});const body=await res.json();$('idsOut').hidden=false;
  if(res.status!==200){$('idsOut').textContent=JSON.stringify(body,null,2);return;}
  $('idsOut').textContent=body.ids.join('\\n');const box=$('ordinals');box.innerHTML='<p class=muted>Decoding…</p>';
  box.innerHTML='';for(const id of body.ids){const o=await (await api('/v1/ordinal/'+id,{headers:{'X-API-Key':KEY}})).json();
    const p=document.createElement('div');p.className='mono';p.textContent=id+'  →  #'+o.ordinal;box.appendChild(p);}}
load();`;
