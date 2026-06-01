// i18n.ts — internationalization for the PUID site, typed.
//
// `Chrome` = keys every locale MUST provide (nav, theme/language dropdowns,
// footer, auth, account chrome). Typing the dictionary as `Chrome & ...` means a
// missing chrome key — e.g. forgetting to translate the theme dropdown — is a
// COMPILE ERROR (run `npm run check`). `Content` = long-form marketing/dashboard
// copy, optional per locale (English fallback). The English base must be complete
// (enforced by `BASE: Messages = M.en`). Flagship locales (es/fr/de/pt/it)
// translate the full landing; the rest translate chrome and fall back for prose.

export const LOCALES = {
  en: { name: "English", dir: "ltr" },
  es: { name: "Español", dir: "ltr" },
  fr: { name: "Français", dir: "ltr" },
  de: { name: "Deutsch", dir: "ltr" },
  pt: { name: "Português", dir: "ltr" },
  it: { name: "Italiano", dir: "ltr" },
  nl: { name: "Nederlands", dir: "ltr" },
  pl: { name: "Polski", dir: "ltr" },
  ru: { name: "Русский", dir: "ltr" },
  uk: { name: "Українська", dir: "ltr" },
  tr: { name: "Türkçe", dir: "ltr" },
  ar: { name: "العربية", dir: "rtl" },
  he: { name: "עברית", dir: "rtl" },
  hi: { name: "हिन्दी", dir: "ltr" },
  zh: { name: "中文", dir: "ltr" },
  ja: { name: "日本語", dir: "ltr" },
  ko: { name: "한국어", dir: "ltr" },
  vi: { name: "Tiếng Việt", dir: "ltr" },
  id: { name: "Bahasa Indonesia", dir: "ltr" },
  th: { name: "ไทย", dir: "ltr" },
} as const;

export type Locale = keyof typeof LOCALES;

// Required in every locale. Missing one => compile error.
export interface Chrome {
  nav_docs: string;
  nav_dashboard: string;
  nav_metrics: string;
  guarantee_title: string;
  random_title: string;
  ratelimit_title: string;
  pricing: string;
  generate: string;
  account: string;
  members: string;
  signin_google: string;
  signin_microsoft: string;
  signin_prompt: string;
  footer: string;
  foot_rights: string;
  foot_why: string;
  foot_terms: string;
  foot_privacy: string;
  language: string;
  theme: string;
  theme_auto: string;
  theme_light: string;
  theme_dark: string;
  new_account: string;
  mint_key: string;
  team: string;
  generate_code: string;
}

// Optional per locale (English fallback). Long-form marketing + dashboard copy.
export interface Content {
  hero_sub: string;
  hero_desc: string;
  get_api_key: string;
  guarantee_body: string;
  random_body: string;
  ratelimit_body: string;
  oe_title: string;
  oe_1: string;
  oe_2: string;
  oe_3: string;
  oe_4: string;
  oe_5: string;
  oe_6: string;
  oe_7: string;
  oe_8: string;
  quickstart: string;
  get_key: string;
  plan_hobby: string;
  plan_pro: string;
  plan_enterprise: string;
  enterprise_note: string;
  hobby_features: string; // newline-separated bullet list
  pro_features: string;
  ent_features: string;
  popular: string;
  get_started: string;
  upgrade_cta: string;
  no_password: string;
  api_key: string;
  shown_once: string;
  join_intro: string;
  rotate: string;
  revoke: string;
  share_email: string;
  joining_disabled: string;
  owners_only: string;
  // dashboard chrome
  key_saved: string;
  revoke_action: string;
  authorized_apps: string;
  apps_desc: string;
  no_apps: string;
  usage_title: string;
  usage_total: string;
  bucket_minute: string;
  bucket_hour: string;
  bucket_day: string;
  no_usage: string;
  join_code_label: string;
  join_link_label: string;
  // /why page
  why_title: string;
  why_lead: string;
  why_h1: string;
  why_b1: string;
  why_b1b: string;
  why_h2: string;
  why_b2: string;
  why_sample: string;
  why_h3: string;
  why_b3: string; // contains HTML (rendered via {@html})
  why_h4: string;
  why_b4: string; // contains HTML
  // landing marketing — straight-faced; the joke lives only on /why and /upgrade.
  // English-only is fine: these fall back to English for locales that omit them.
  hero_note: string;
  stat_collisions_n: string;
  stat_collisions_l: string;
  stat_keyspace_n: string;
  stat_keyspace_l: string;
  stat_uptime_n: string;
  stat_uptime_l: string;
  stat_sdks_n: string;
  stat_sdks_l: string;
  features_title: string;
  features_sub: string;
  feat_unique_t: string;
  feat_unique_b: string;
  feat_random_t: string;
  feat_random_b: string;
  feat_edge_t: string;
  feat_edge_b: string;
  feat_oauth_t: string;
  feat_oauth_b: string;
  feat_sdk_t: string;
  feat_sdk_b: string;
  feat_team_t: string;
  feat_team_b: string;
  how_title: string;
  how_sub: string;
  step1_t: string;
  step1_b: string;
  step2_t: string;
  step2_b: string;
  step3_t: string;
  step3_b: string;
  loved_title: string;
  quote1: string;
  name1: string;
  role1: string;
  quote2: string;
  name2: string;
  role2: string;
  quote3: string;
  name3: string;
  role3: string;
  cta_title: string;
  cta_sub: string;
}

export type Messages = Chrome & Content;

const M: Record<Locale, Chrome & Partial<Content>> = {
  en: {
    hero_sub: "The Provably Unique ID the world is missing!",
    hero_desc:
      "UUIDs gamble on uniqueness — there's always a nonzero chance two collide. PUID harnesses a proprietary, patent-pending uniqueness engine to deliver deterministic, collision-free identifiers at web scale. Cloud-native, enterprise-grade, and provably unique by design. The how is our secret sauce.",
    get_api_key: "Sign up free",
    nav_docs: "API Docs",
    nav_dashboard: "Dashboard",
    nav_metrics: "Metrics",
    guarantee_title: "Provably 100% collision-free",
    guarantee_body:
      "Uniqueness is never left to chance. Every identifier is guaranteed distinct by mathematical proof — not probability. Zero collisions, today and forever.",
    random_title: "Looks completely random",
    random_body:
      "Opaque, high-entropy, URL-safe identifiers that give nothing away — not your data, not your scale, not each other. Beautiful and unguessable.",
    ratelimit_title: "Aggressively rate limited",
    ratelimit_body:
      "Built-in fair-use protection keeps any single user from monopolizing the service, so every customer gets fast, reliable access to the ids they need.",
    oe_title: "How over-engineered is it?",
    oe_1: "A 128-bit Feistel cipher.",
    oe_2: "A complete OAuth2 authorization server — so apps can be formally granted permission to receive a number.",
    oe_3: "Sign in with Google or Microsoft — SSO from the most secure enterprise identity providers.",
    oe_4: "Multi-tenant teams: many accounts per user, reusable revocable join codes.",
    oe_5: "20 client SDKs, generated from an OpenAPI spec.",
    oe_6: "A PostgreSQL extension that lets you autogenerate these as table ids.",
    oe_7: "This marketing site, in 20 languages, with light &amp; dark themes.",
    oe_8: "Unit, full-system, and real-browser test suites, so every deploy always works.",
    quickstart: "Quickstart",
    get_key: "Get a key in the dashboard. SDKs for 20 languages, generated from our OpenAPI spec.",
    pricing: "Pricing",
    plan_hobby: "Hobby",
    plan_pro: "Professional",
    plan_enterprise: "Enterprise",
    enterprise_note: "A self-hosted, unlimited id system.",
    hobby_features:
      "1,000 ids per day\n1 request per second\nAll 20 SDKs and the API\nCommunity support",
    pro_features:
      "Everything in Hobby\n100,000 ids per day\n10 requests per second\nUsage analytics\n48-hour email support",
    ent_features:
      "Everything in Professional\nYour own private, self-hosted PUID\nCustom domain name\nUnlimited ids and rate\nSSO / SAML and audit logs\n24-hour email & phone support, with an SLA",
    popular: "Popular",
    get_started: "Get started",
    upgrade_cta: "Upgrade",
    footer: "A joke. Provably unique. Do not use this.",
    foot_rights: "All rights reserved.",
    foot_why: "Why?",
    foot_terms: "Terms",
    foot_privacy: "Privacy",
    signin_prompt: "Sign in to mint an API key and generate ids.",
    signin_google: "Sign in with Google",
    signin_microsoft: "Sign in with Microsoft",
    no_password: "No passwords, no email from us — your provider already verified you.",
    account: "Account",
    new_account: "+ New account",
    mint_key: "Mint a key",
    api_key: "API key",
    shown_once: "shown once",
    generate: "Generate",
    team: "Team",
    members: "Members",
    join_intro:
      "One reusable join code. Anyone who has it can join this account. Rotate it any time — the old code stops working. Or revoke it to turn joining off.",
    generate_code: "Generate join code",
    rotate: "Rotate",
    revoke: "Revoke (disable joining)",
    share_email: "✉️ Share via email",
    joining_disabled: "Joining is currently disabled — there is no active code.",
    owners_only: "Only account owners can manage the join code.",
    key_saved: "Save it — we hash it and cannot show it again.",
    revoke_action: "Revoke",
    authorized_apps: "Authorized apps",
    apps_desc:
      "Apps you've granted permission to generate ids on this account's behalf (via OAuth). Revoke any time.",
    no_apps: "No apps authorized.",
    usage_title: "Usage",
    usage_total: "total",
    bucket_minute: "Per minute",
    bucket_hour: "Per hour",
    bucket_day: "Per day",
    no_usage: "No ids generated yet.",
    join_code_label: "Join code:",
    join_link_label: "Join link:",
    why_title: "Okay, it's a joke.",
    why_lead:
      'PUID is a very over-built way to hand out a number. But the "provably unique" part is real. Here is how it actually works.',
    why_h1: "It's just a counter",
    why_b1:
      "Under the hood, PUID just counts. 1, 2, 3, and so on. A UUIDv4 is random instead, so it is only probably unique. If you make enough of them, two can come out the same.",
    why_b1b:
      "To be fair, that almost never happens. A random UUID is fine for 99.999999% of apps. You would have to generate billions of them before a collision is even worth worrying about. So in real life UUIDs are great. A counter is just simpler to reason about, because it never repeats. The only problem is that the number 3 makes a pretty boring id.",
    why_h2: "So I hide the counter",
    why_b2:
      "I take the counter and run it through a small cipher (a 128-bit Feistel permutation), then encode it with base62. A permutation just shuffles the numbers around. Every input maps to a different output, and no two inputs ever land on the same output. So the ids can never collide, and they still look random. Same uniqueness as a plain counter, but now it looks like a real id.",
    why_sample: "#1 turns into 64qAN39GjJh5kbi4HROOxh. #2 turns into 7U17bzw0MO3mzwuFKO7cc0.",
    why_h3: "It can decode itself",
    why_b3:
      "The cipher also runs backwards. So <code>GET /api/v1/ordinal/&lt;id&gt;</code> turns any PUID back into its counter value. That proves the id <code>64qAN39Gj...</code> was really just #1. It also means anyone can decode an id and read its number, and that number is how many ids we had handed out when it was made. So no, do not use this in production.",
    why_h4: "Why build all this for a counter?",
    why_b4:
      'Mostly for fun, and to see how far the joke would go. There is a full OAuth2 server, sign in with Google and Microsoft, teams, 20 SDKs, a Postgres extension, 20 languages, and three test suites. All of it just to return <code>i++</code> in a nicer wrapper. If you like this kind of thing, <a class="text-indigo-600 dark:text-indigo-400" href="https://bio.jtwebman.com" target="_blank" rel="noopener">follow me on my socials</a>.',
    hero_note: "Free forever tier · No credit card required · 20 official SDKs",
    stat_collisions_n: "0",
    stat_collisions_l: "collisions, ever",
    stat_keyspace_n: "2¹²⁸",
    stat_keyspace_l: "identifier keyspace",
    stat_uptime_n: "99.99%",
    stat_uptime_l: "uptime SLA",
    stat_sdks_n: "20",
    stat_sdks_l: "official SDKs",
    features_title: "Everything you need to never collide again",
    features_sub:
      "A complete identifier platform — from the math at the core to the SDKs, teams, and analytics around it.",
    feat_unique_t: "Provably collision-free",
    feat_unique_b:
      "Not “astronomically unlikely.” Mathematically impossible. Every id is guaranteed distinct by proof, not probability.",
    feat_random_t: "Opaque & URL-safe",
    feat_random_b:
      "High-entropy, base62 identifiers that give nothing away — not your data, not your scale, not each other.",
    feat_edge_t: "Served from the edge",
    feat_edge_b:
      "Running on Cloudflare’s global network, close to your users in hundreds of cities. Fast everywhere, by default.",
    feat_oauth_t: "OAuth2 & SSO built in",
    feat_oauth_b:
      "A full authorization server. Sign in with Google, delegate scoped access to apps, and revoke it any time.",
    feat_sdk_t: "20 official SDKs",
    feat_sdk_b:
      "Generated from our OpenAPI spec and versioned with the API — plus a native PostgreSQL extension for table ids.",
    feat_team_t: "Built for teams",
    feat_team_b:
      "Multi-tenant accounts, usage analytics, rotatable API keys, and reusable revocable join codes.",
    how_title: "Up and running in 60 seconds",
    how_sub: "No procurement, no sales call. Sign in and ship.",
    step1_t: "Create your account",
    step1_b: "Sign in with Google. No passwords to manage, no credit card to enter.",
    step2_t: "Mint an API key",
    step2_b: "Generate a key in the dashboard. Rotate or revoke it whenever you like.",
    step3_t: "Call the API",
    step3_b: "One request returns up to 10 ids. Drop in an SDK for your language and you’re done.",
    loved_title: "Engineers who care about correctness",
    quote1: "We swapped out UUIDv4 and haven’t seen a single collision since. Not one.",
    name1: "Dana R.",
    role1: "Staff Engineer",
    quote2:
      "Finally, identifiers I can prove are unique in a code review instead of hand-waving at probability.",
    name2: "Marcus L.",
    role2: "Backend Lead",
    quote3: "The Postgres extension dropped into our schema in an afternoon. It just works.",
    name3: "Priya N.",
    role3: "Platform Engineer",
    cta_title: "Stop gambling on uniqueness.",
    cta_sub: "Join the teams generating provably-unique identifiers today.",
    language: "Language",
    theme: "Theme",
    theme_light: "Light",
    theme_dark: "Dark",
    theme_auto: "Auto",
  },

  es: {
    hero_note: "Plan gratuito para siempre · Sin tarjeta de crédito · 20 SDKs oficiales",
    stat_collisions_n: "0",
    stat_collisions_l: "colisiones, jamás",
    stat_keyspace_n: "2¹²⁸",
    stat_keyspace_l: "espacio de claves de identificadores",
    stat_uptime_n: "99.99%",
    stat_uptime_l: "SLA de disponibilidad",
    stat_sdks_n: "20",
    stat_sdks_l: "SDKs oficiales",
    features_title: "Todo lo que necesitas para no volver a colisionar",
    features_sub:
      "Una plataforma de identificadores completa: desde la matemática del núcleo hasta los SDKs, equipos y analíticas que la rodean.",
    feat_unique_t: "Libre de colisiones, demostrado",
    feat_unique_b:
      "No es astronómicamente improbable. Es matemáticamente imposible. Cada id es único garantizado por demostración, no por probabilidad.",
    feat_random_t: "Opaco y seguro para URL",
    feat_random_b:
      "Identificadores base62 de alta entropía que no revelan nada: ni tus datos, ni tu escala, ni se delatan entre sí.",
    feat_edge_t: "Servido desde el edge",
    feat_edge_b:
      "Funciona sobre la red global de Cloudflare, cerca de tus usuarios en cientos de ciudades. Rápido en todas partes, por defecto.",
    feat_oauth_t: "OAuth2 y SSO integrados",
    feat_oauth_b:
      "Un servidor de autorización completo. Inicia sesión con Google, delega acceso con alcance a las apps y revócalo cuando quieras.",
    feat_sdk_t: "20 SDKs oficiales",
    feat_sdk_b:
      "Generados a partir de nuestra especificación OpenAPI y versionados junto con la API, más una extensión nativa de PostgreSQL para los ids de tablas.",
    feat_team_t: "Pensado para equipos",
    feat_team_b:
      "Cuentas multiinquilino, analíticas de uso, claves de API rotables y códigos de invitación reutilizables y revocables.",
    how_title: "En marcha en 60 segundos",
    how_sub: "Sin trámites de compra ni llamadas de ventas. Inicia sesión y publica.",
    step1_t: "Crea tu cuenta",
    step1_b: "Inicia sesión con Google. Sin contraseñas que gestionar ni tarjetas que introducir.",
    step2_t: "Genera una clave de API",
    step2_b: "Crea una clave en el panel. Rótala o revócala cuando quieras.",
    step3_t: "Llama a la API",
    step3_b: "Una sola petición devuelve hasta 10 ids. Añade un SDK para tu lenguaje y listo.",
    loved_title: "Ingenieros a quienes les importa la corrección",
    quote1: "Reemplazamos UUIDv4 y no hemos visto ni una sola colisión desde entonces. Ni una.",
    name1: "Dana R.",
    role1: "Ingeniera de Staff",
    quote2:
      "Por fin, identificadores que puedo demostrar que son únicos en una revisión de código, en vez de apelar a la probabilidad.",
    name2: "Marcus L.",
    role2: "Líder de Backend",
    quote3:
      "La extensión de Postgres se integró en nuestro esquema en una tarde. Simplemente funciona.",
    name3: "Priya N.",
    role3: "Ingeniera de Plataforma",
    cta_title: "Deja de jugártela con la unicidad.",
    cta_sub: "Únete hoy a los equipos que generan identificadores demostrablemente únicos.",
    hero_sub: "¡La id única que le faltaba al mundo!",
    hero_desc:
      "Los UUID apuestan por la unicidad: siempre hay una probabilidad distinta de cero de que dos colisionen. PUID aprovecha un motor de unicidad propietario y con patente en trámite para ofrecer identificadores deterministas y sin colisiones a escala web. Nativo en la nube, de nivel empresarial y demostrablemente único por diseño. El cómo es nuestra salsa secreta.",
    get_api_key: "Obtener una clave API",
    nav_docs: "Documentación",
    nav_dashboard: "Panel",
    nav_metrics: "Métricas",
    guarantee_title: "Sin colisiones, demostrablemente al 100 %",
    guarantee_body:
      "La unicidad nunca se deja al azar. Cada identificador es distinto por demostración matemática, no por probabilidad. Cero colisiones, hoy y siempre.",
    random_title: "Parece completamente aleatorio",
    random_body:
      "Identificadores opacos, de alta entropía y seguros para URL que no revelan nada: ni tus datos, ni tu escala, ni entre sí. Hermosos e imposibles de adivinar.",
    ratelimit_title: "Con límite de velocidad estricto",
    ratelimit_body:
      "La protección de uso justo integrada evita que un solo usuario monopolice el servicio, para que todos los clientes obtengan acceso rápido y fiable a los ids que necesitan.",
    oe_title: "¿Qué tan sobre-ingeniada está?",
    oe_1: "Un cifrado Feistel de 128 bits.",
    oe_2: "Un servidor de autorización OAuth2 completo, para que las apps reciban formalmente permiso para obtener un número.",
    oe_3: "Inicia sesión con Google o Microsoft: SSO de los proveedores de identidad empresarial más seguros.",
    oe_4: "Equipos multiinquilino: muchas cuentas por usuario, con códigos de invitación reutilizables y revocables.",
    oe_5: "20 SDKs de cliente, generados a partir de una especificación OpenAPI.",
    oe_6: "Una extensión de PostgreSQL que te permite autogenerar estos como ids de tabla.",
    oe_7: "Este sitio de marketing, en 20 idiomas, con temas claro y oscuro.",
    oe_8: "Pruebas unitarias, de sistema completo y de navegador real, para que cada despliegue siempre funcione.",
    quickstart: "Inicio rápido",
    pricing: "Precios",
    enterprise_note: "Un sistema de ids autoalojado e ilimitado.",
    hobby_features:
      "1.000 ids al día\n1 solicitud por segundo\nLos 20 SDKs y la API\nSoporte de la comunidad",
    pro_features:
      "Todo lo de Hobby\n100.000 ids al día\n10 solicitudes por segundo\nAnálisis de uso\nSoporte por correo en 48 horas",
    ent_features:
      "Todo lo de Professional\nTu propio PUID privado y autoalojado\nNombre de dominio personalizado\nIds y velocidad ilimitados\nSSO / SAML y registros de auditoría\nSoporte por correo y teléfono en 24 horas, con SLA",
    popular: "Popular",
    get_started: "Empezar",
    upgrade_cta: "Mejorar",
    generate: "Generar",
    account: "Cuenta",
    members: "Miembros",
    signin_google: "Iniciar sesión con Google",
    signin_microsoft: "Iniciar sesión con Microsoft",
    signin_prompt: "Inicia sesión para crear una clave y generar ids.",
    footer: "Una broma. Demostrablemente único. No lo uses.",
    foot_rights: "Todos los derechos reservados.",
    foot_why: "¿Por qué?",
    foot_terms: "Términos",
    foot_privacy: "Privacidad",
    language: "Idioma",
    theme: "Tema",
    theme_auto: "Automático",
    theme_light: "Claro",
    theme_dark: "Oscuro",
    new_account: "+ Nueva cuenta",
    mint_key: "Crear clave",
    team: "Equipo",
    generate_code: "Generar código de invitación",
    no_password: "Sin contraseñas y sin correos de nuestra parte: tu proveedor ya te verificó.",
    api_key: "Clave API",
    shown_once: "se muestra una vez",
    join_intro:
      "Un único código de unión reutilizable. Cualquiera que lo tenga puede unirse a esta cuenta. Rótalo cuando quieras: el código antiguo deja de funcionar. O revócalo para desactivar la unión.",
    rotate: "Rotar",
    revoke: "Revocar (desactivar la unión)",
    share_email: "✉️ Compartir por correo",
    joining_disabled: "La unión está desactivada: no hay código activo.",
    owners_only: "Solo los propietarios de la cuenta pueden gestionar el código de unión.",
    key_saved: "Guárdala: la ciframos y no podemos volver a mostrarla.",
    revoke_action: "Revocar",
    authorized_apps: "Apps autorizadas",
    apps_desc:
      "Apps a las que diste permiso para generar ids en nombre de esta cuenta (vía OAuth). Revócalas cuando quieras.",
    no_apps: "Ninguna app autorizada.",
    usage_title: "Uso",
    usage_total: "total",
    bucket_minute: "Por minuto",
    bucket_hour: "Por hora",
    bucket_day: "Por día",
    no_usage: "Aún no se han generado ids.",
    join_code_label: "Código de unión:",
    join_link_label: "Enlace de unión:",
    why_title: "Vale, es una broma.",
    why_lead:
      "PUID es una forma exageradamente complicada de repartir un número. Pero lo de «demostrablemente único» es real. Así funciona de verdad.",
    why_h1: "Solo es un contador",
    why_b1:
      "Por dentro, PUID solo cuenta. 1, 2, 3, y así. Un UUIDv4 es aleatorio, así que solo es probablemente único. Si generas suficientes, dos pueden salir iguales.",
    why_b1b:
      "Para ser justos, eso casi nunca pasa. Un UUID aleatorio sirve para el 99,999999 % de las apps. Tendrías que generar miles de millones antes de que una colisión merezca preocupación. En la vida real los UUID son geniales. Un contador es solo más fácil de razonar, porque nunca se repite. El único problema es que el número 3 es un id bastante aburrido.",
    why_h2: "Así que escondo el contador",
    why_b2:
      "Tomo el contador y lo paso por un pequeño cifrado (una permutación de Feistel de 128 bits), y luego lo codifico en base62. Una permutación solo baraja los números. Cada entrada da una salida distinta y no hay dos entradas que caigan en la misma salida. Así que los ids nunca pueden colisionar, y aun así parecen aleatorios. La misma unicidad que un contador, pero ahora parece un id de verdad.",
    why_sample:
      "El n.º 1 se convierte en 64qAN39GjJh5kbi4HROOxh. El n.º 2 se convierte en 7U17bzw0MO3mzwuFKO7cc0.",
    why_h3: "Puede decodificarse a sí mismo",
    why_b3:
      "El cifrado también funciona al revés. Así que <code>GET /api/v1/ordinal/&lt;id&gt;</code> convierte cualquier PUID de vuelta en su valor de contador. Eso demuestra que el id <code>64qAN39Gj...</code> era en realidad el n.º 1. También significa que cualquiera puede decodificar un id y leer su número, y ese número es cuántos ids habíamos repartido cuando se creó. Así que no, no uses esto en producción.",
    why_h4: "¿Por qué construir todo esto para un contador?",
    why_b4:
      'Sobre todo por diversión, y para ver hasta dónde llegaba la broma. Hay un servidor OAuth2 completo, inicio de sesión con Google y Microsoft, equipos, 20 SDKs, una extensión de Postgres, 20 idiomas y tres suites de pruebas. Todo para devolver <code>i++</code> con un envoltorio más bonito. Si te gusta este tipo de cosas, <a class="text-indigo-600 dark:text-indigo-400" href="https://bio.jtwebman.com" target="_blank" rel="noopener">sígueme en mis redes</a>.',
  },

  fr: {
    hero_note: "Offre gratuite à vie · Sans carte bancaire · 20 SDKs officiels",
    stat_collisions_n: "0",
    stat_collisions_l: "collisions, jamais",
    stat_keyspace_n: "2¹²⁸",
    stat_keyspace_l: "espace d’identifiants",
    stat_uptime_n: "99.99%",
    stat_uptime_l: "SLA de disponibilité",
    stat_sdks_n: "20",
    stat_sdks_l: "SDKs officiels",
    features_title: "Tout ce qu’il vous faut pour ne plus jamais entrer en collision",
    features_sub:
      "Une plateforme d’identifiants complète : des mathématiques au cœur du système jusqu’aux SDKs, aux équipes et aux analyses qui l’entourent.",
    feat_unique_t: "Sans collision, c’est prouvé",
    feat_unique_b:
      "Pas astronomiquement improbable. Mathématiquement impossible. Chaque id est garanti unique par démonstration, pas par probabilité.",
    feat_random_t: "Opaque et compatible URL",
    feat_random_b:
      "Des identifiants base62 à haute entropie qui ne révèlent rien : ni vos données, ni votre échelle, ni les uns sur les autres.",
    feat_edge_t: "Servi depuis l’edge",
    feat_edge_b:
      "Exécuté sur le réseau mondial de Cloudflare, au plus près de vos utilisateurs dans des centaines de villes. Rapide partout, par défaut.",
    feat_oauth_t: "OAuth2 et SSO intégrés",
    feat_oauth_b:
      "Un serveur d’autorisation complet. Connectez-vous avec Google, déléguez un accès cadré aux applications et révoquez-le à tout moment.",
    feat_sdk_t: "20 SDKs officiels",
    feat_sdk_b:
      "Générés à partir de notre spécification OpenAPI et versionnés avec l’API, ainsi qu’une extension PostgreSQL native pour les ids de tables.",
    feat_team_t: "Conçu pour les équipes",
    feat_team_b:
      "Comptes multi-locataires, analyses d’usage, clés d’API rotatives et codes d’invitation réutilisables et révocables.",
    how_title: "Opérationnel en 60 secondes",
    how_sub: "Pas d’achat à valider, pas d’appel commercial. Connectez-vous et déployez.",
    step1_t: "Créez votre compte",
    step1_b:
      "Connectez-vous avec Google. Aucun mot de passe à gérer, aucune carte bancaire à saisir.",
    step2_t: "Générez une clé d’API",
    step2_b:
      "Créez une clé dans le tableau de bord. Faites-la tourner ou révoquez-la quand vous voulez.",
    step3_t: "Appelez l’API",
    step3_b:
      "Une seule requête renvoie jusqu’à 10 ids. Ajoutez un SDK pour votre langage et c’est terminé.",
    loved_title: "Des ingénieurs soucieux de l’exactitude",
    quote1:
      "Nous avons abandonné UUIDv4 et nous n’avons pas vu une seule collision depuis. Pas une.",
    name1: "Dana R.",
    role1: "Ingénieure Staff",
    quote2:
      "Enfin des identifiants dont je peux prouver l’unicité en revue de code, au lieu d’agiter des probabilités.",
    name2: "Marcus L.",
    role2: "Lead Backend",
    quote3:
      "L’extension Postgres s’est intégrée à notre schéma en une après-midi. Ça marche, tout simplement.",
    name3: "Priya N.",
    role3: "Ingénieur Plateforme",
    cta_title: "Arrêtez de parier sur l’unicité.",
    cta_sub:
      "Rejoignez dès aujourd’hui les équipes qui génèrent des identifiants uniques et prouvés.",
    hero_sub: "L'identifiant unique qui manquait au monde !",
    hero_desc:
      "Les UUID parient sur l'unicité : il subsiste toujours une probabilité non nulle de collision. PUID exploite un moteur d'unicité propriétaire et breveté pour fournir des identifiants déterministes et sans collision à l'échelle du web. Cloud-native, de niveau entreprise et prouvé unique par conception. Le comment, c'est notre recette secrète.",
    get_api_key: "Obtenir une clé API",
    nav_docs: "Documentation",
    nav_dashboard: "Tableau de bord",
    nav_metrics: "Métriques",
    guarantee_title: "Sans collision, prouvé à 100 %",
    guarantee_body:
      "L'unicité n'est jamais laissée au hasard. Chaque identifiant est distinct par preuve mathématique, pas par probabilité. Zéro collision, aujourd'hui et pour toujours.",
    random_title: "Semble totalement aléatoire",
    random_body:
      "Des identifiants opaques, à haute entropie et compatibles URL qui ne révèlent rien : ni vos données, ni votre échelle, ni les uns les autres. Élégants et imprévisibles.",
    ratelimit_title: "Débit fortement limité",
    ratelimit_body:
      "Une protection d'usage équitable intégrée empêche un seul utilisateur de monopoliser le service, afin que chaque client bénéficie d'un accès rapide et fiable aux identifiants dont il a besoin.",
    oe_title: "À quel point est-ce sur-conçu ?",
    oe_1: "Un chiffrement de Feistel 128 bits.",
    oe_2: "Un serveur d'autorisation OAuth2 complet — pour que des applications obtiennent officiellement la permission de recevoir un nombre.",
    oe_3: "Connexion avec Google ou Microsoft : le SSO des fournisseurs d'identité d'entreprise les plus sûrs.",
    oe_4: "Équipes multi-locataires : plusieurs comptes par utilisateur, avec des codes d'invitation réutilisables et révocables.",
    oe_5: "20 SDK clients, générés à partir d'une spécification OpenAPI.",
    oe_6: "Une extension PostgreSQL qui permet de générer automatiquement ces identifiants comme ids de table.",
    oe_7: "Ce site marketing, en 20 langues, avec thèmes clair et sombre.",
    oe_8: "Des tests unitaires, système complet et navigateur réel, pour que chaque déploiement fonctionne toujours.",
    quickstart: "Démarrage rapide",
    pricing: "Tarifs",
    enterprise_note: "Un système d'identifiants auto-hébergé et illimité.",
    hobby_features:
      "1 000 ids par jour\n1 requête par seconde\nLes 20 SDK et l'API\nSupport communautaire",
    pro_features:
      "Tout ce qui est dans Hobby\n100 000 ids par jour\n10 requêtes par seconde\nAnalyses d'utilisation\nSupport e-mail sous 48 heures",
    ent_features:
      "Tout ce qui est dans Professional\nVotre propre PUID privé auto-hébergé\nNom de domaine personnalisé\nIds et débit illimités\nSSO / SAML et journaux d'audit\nSupport e-mail et téléphone sous 24 heures, avec SLA",
    popular: "Populaire",
    get_started: "Commencer",
    upgrade_cta: "Améliorer",
    generate: "Générer",
    account: "Compte",
    members: "Membres",
    signin_google: "Se connecter avec Google",
    signin_microsoft: "Se connecter avec Microsoft",
    signin_prompt: "Connectez-vous pour créer une clé et générer des ids.",
    footer: "Une blague. Prouvé unique. Ne l'utilisez pas.",
    foot_rights: "Tous droits réservés.",
    foot_why: "Pourquoi ?",
    foot_terms: "Conditions",
    foot_privacy: "Confidentialité",
    language: "Langue",
    theme: "Thème",
    theme_auto: "Auto",
    theme_light: "Clair",
    theme_dark: "Sombre",
    new_account: "+ Nouveau compte",
    mint_key: "Créer une clé",
    team: "Équipe",
    generate_code: "Générer un code d'invitation",
    no_password:
      "Pas de mots de passe, pas d'e-mail de notre part : votre fournisseur vous a déjà vérifié.",
    api_key: "Clé API",
    shown_once: "affichée une seule fois",
    join_intro:
      "Un seul code d'adhésion réutilisable. Quiconque le possède peut rejoindre ce compte. Faites-le tourner quand vous voulez : l'ancien code cesse de fonctionner. Ou révoquez-le pour désactiver l'adhésion.",
    rotate: "Renouveler",
    revoke: "Révoquer (désactiver l'adhésion)",
    share_email: "✉️ Partager par e-mail",
    joining_disabled: "L'adhésion est désactivée : aucun code actif.",
    owners_only: "Seuls les propriétaires du compte peuvent gérer le code d'adhésion.",
    key_saved: "Conservez-la : nous la hachons et ne pouvons pas la réafficher.",
    revoke_action: "Révoquer",
    authorized_apps: "Applications autorisées",
    apps_desc:
      "Applications auxquelles vous avez donné la permission de générer des ids au nom de ce compte (via OAuth). Révoquez-les quand vous voulez.",
    no_apps: "Aucune application autorisée.",
    usage_title: "Utilisation",
    usage_total: "total",
    bucket_minute: "Par minute",
    bucket_hour: "Par heure",
    bucket_day: "Par jour",
    no_usage: "Aucun id généré pour l'instant.",
    join_code_label: "Code d'adhésion :",
    join_link_label: "Lien d'adhésion :",
    why_title: "D'accord, c'est une blague.",
    why_lead:
      "PUID est une façon extrêmement compliquée de distribuer un nombre. Mais le « prouvé unique » est réel. Voici comment ça marche vraiment.",
    why_h1: "Ce n'est qu'un compteur",
    why_b1:
      "En interne, PUID se contente de compter. 1, 2, 3, et ainsi de suite. Un UUIDv4 est aléatoire, il n'est donc que probablement unique. Si vous en générez assez, deux peuvent sortir identiques.",
    why_b1b:
      "Pour être honnête, cela n'arrive presque jamais. Un UUID aléatoire convient à 99,999999 % des applications. Il faudrait en générer des milliards avant qu'une collision vaille la peine d'être considérée. Dans la vraie vie, les UUID sont parfaits. Un compteur est juste plus simple à raisonner, parce qu'il ne se répète jamais. Le seul problème, c'est que le nombre 3 fait un id plutôt ennuyeux.",
    why_h2: "Alors je cache le compteur",
    why_b2:
      "Je prends le compteur et le passe dans un petit chiffrement (une permutation de Feistel 128 bits), puis je l'encode en base62. Une permutation ne fait que mélanger les nombres. Chaque entrée donne une sortie différente, et jamais deux entrées ne tombent sur la même sortie. Les ids ne peuvent donc jamais entrer en collision, et ils ont quand même l'air aléatoires. La même unicité qu'un compteur, mais ça ressemble maintenant à un vrai id.",
    why_sample: "Le n° 1 devient 64qAN39GjJh5kbi4HROOxh. Le n° 2 devient 7U17bzw0MO3mzwuFKO7cc0.",
    why_h3: "Il peut se décoder lui-même",
    why_b3:
      "Le chiffrement fonctionne aussi à l'envers. Donc <code>GET /api/v1/ordinal/&lt;id&gt;</code> retransforme n'importe quel PUID en sa valeur de compteur. Cela prouve que l'id <code>64qAN39Gj...</code> n'était en réalité que le n° 1. Cela signifie aussi que n'importe qui peut décoder un id et lire son numéro, et ce numéro correspond au nombre d'ids que nous avions distribués au moment de sa création. Alors non, n'utilisez pas ça en production.",
    why_h4: "Pourquoi construire tout ça pour un compteur ?",
    why_b4:
      'Surtout pour le plaisir, et pour voir jusqu\'où la blague irait. Il y a un serveur OAuth2 complet, la connexion avec Google et Microsoft, des équipes, 20 SDK, une extension Postgres, 20 langues et trois suites de tests. Tout ça pour renvoyer <code>i++</code> dans un plus joli emballage. Si vous aimez ce genre de choses, <a class="text-indigo-600 dark:text-indigo-400" href="https://bio.jtwebman.com" target="_blank" rel="noopener">suivez-moi sur mes réseaux</a>.',
  },

  de: {
    hero_note: "Für immer kostenloses Kontingent · Keine Kreditkarte nötig · 20 offizielle SDKs",
    stat_collisions_n: "0",
    stat_collisions_l: "Kollisionen, niemals",
    stat_keyspace_n: "2¹²⁸",
    stat_keyspace_l: "Schlüsselraum für Identifier",
    stat_uptime_n: "99.99%",
    stat_uptime_l: "Verfügbarkeits-SLA",
    stat_sdks_n: "20",
    stat_sdks_l: "offizielle SDKs",
    features_title: "Alles, was du brauchst, um nie wieder zu kollidieren",
    features_sub:
      "Eine vollständige Identifier-Plattform – von der Mathematik im Kern bis zu den SDKs, Teams und Analysen drumherum.",
    feat_unique_t: "Beweisbar kollisionsfrei",
    feat_unique_b:
      "Nicht astronomisch unwahrscheinlich. Mathematisch unmöglich. Jede id ist per Beweis garantiert eindeutig, nicht per Wahrscheinlichkeit.",
    feat_random_t: "Undurchsichtig und URL-sicher",
    feat_random_b:
      "base62-Identifier mit hoher Entropie, die nichts verraten – weder deine Daten noch deine Größenordnung noch sich gegenseitig.",
    feat_edge_t: "Vom edge ausgeliefert",
    feat_edge_b:
      "Läuft im globalen Netzwerk von Cloudflare, nah an deinen Nutzern in Hunderten von Städten. Überall schnell, standardmäßig.",
    feat_oauth_t: "OAuth2 und SSO integriert",
    feat_oauth_b:
      "Ein vollständiger Autorisierungsserver. Melde dich mit Google an, delege Apps einen abgegrenzten Zugriff und widerrufe ihn jederzeit.",
    feat_sdk_t: "20 offizielle SDKs",
    feat_sdk_b:
      "Generiert aus unserer OpenAPI-Spezifikation und mit der API versioniert – plus eine native PostgreSQL-Erweiterung für Tabellen-ids.",
    feat_team_t: "Für Teams gebaut",
    feat_team_b:
      "Mandantenfähige Konten, Nutzungsanalysen, rotierbare API-Schlüssel und wiederverwendbare, widerrufbare Einladungscodes.",
    how_title: "In 60 Sekunden einsatzbereit",
    how_sub: "Keine Beschaffung, kein Vertriebsgespräch. Anmelden und loslegen.",
    step1_t: "Erstelle dein Konto",
    step1_b:
      "Melde dich mit Google an. Keine Passwörter zu verwalten, keine Kreditkarte einzugeben.",
    step2_t: "Erzeuge einen API-Schlüssel",
    step2_b:
      "Generiere einen Schlüssel im Dashboard. Rotiere oder widerrufe ihn, wann immer du willst.",
    step3_t: "Rufe die API auf",
    step3_b: "Eine Anfrage liefert bis zu 10 ids. Binde ein SDK für deine Sprache ein, und fertig.",
    loved_title: "Ingenieure, denen Korrektheit am Herzen liegt",
    quote1:
      "Wir haben UUIDv4 ausgetauscht und seitdem keine einzige Kollision mehr gesehen. Nicht eine.",
    name1: "Dana R.",
    role1: "Staff Engineer",
    quote2:
      "Endlich Identifier, deren Eindeutigkeit ich im Code-Review beweisen kann, statt mit Wahrscheinlichkeiten zu wedeln.",
    name2: "Marcus L.",
    role2: "Backend-Lead",
    quote3:
      "Die Postgres-Erweiterung war an einem Nachmittag in unserem Schema. Sie funktioniert einfach.",
    name3: "Priya N.",
    role3: "Plattform-Ingenieur",
    cta_title: "Hör auf, auf Eindeutigkeit zu wetten.",
    cta_sub: "Schließe dich noch heute den Teams an, die beweisbar eindeutige Identifier erzeugen.",
    hero_sub: "Die eindeutige ID, die der Welt gefehlt hat!",
    hero_desc:
      "UUIDs setzen auf Wahrscheinlichkeit – es bleibt immer eine von null verschiedene Kollisionschance. PUID nutzt eine proprietäre, zum Patent angemeldete Eindeutigkeits-Engine für deterministische, kollisionsfreie Bezeichner in Web-Skalierung. Cloud-nativ, unternehmenstauglich und beweisbar eindeutig per Design. Das Wie ist unser Geheimrezept.",
    get_api_key: "API-Schlüssel holen",
    nav_docs: "API-Doku",
    nav_dashboard: "Dashboard",
    nav_metrics: "Metriken",
    guarantee_title: "Beweisbar 100 % kollisionsfrei",
    guarantee_body:
      "Eindeutigkeit wird nie dem Zufall überlassen. Jeder Bezeichner ist durch mathematischen Beweis eindeutig – nicht durch Wahrscheinlichkeit. Null Kollisionen, heute und für immer.",
    random_title: "Sieht völlig zufällig aus",
    random_body:
      "Undurchsichtige, hochentropische, URL-sichere Bezeichner, die nichts verraten – weder Ihre Daten noch Ihre Größe noch sich gegenseitig. Schön und nicht erratbar.",
    ratelimit_title: "Streng ratenbegrenzt",
    ratelimit_body:
      "Ein integrierter Fair-Use-Schutz verhindert, dass ein einzelner Nutzer den Dienst monopolisiert – damit jeder Kunde schnellen, zuverlässigen Zugriff auf die benötigten IDs erhält.",
    oe_title: "Wie over-engineered ist das?",
    oe_1: "Eine 128-Bit-Feistel-Chiffre.",
    oe_2: "Ein vollständiger OAuth2-Autorisierungsserver – damit Apps formal die Erlaubnis erhalten, eine Zahl zu bekommen.",
    oe_3: "Anmeldung mit Google oder Microsoft – SSO der sichersten Unternehmens-Identitätsanbieter.",
    oe_4: "Mandantenfähige Teams: viele Konten pro Nutzer, mit wiederverwendbaren, widerrufbaren Beitrittscodes.",
    oe_5: "20 Client-SDKs, generiert aus einer OpenAPI-Spezifikation.",
    oe_6: "Eine PostgreSQL-Erweiterung, mit der du diese automatisch als Tabellen-IDs erzeugst.",
    oe_7: "Diese Marketing-Website, in 20 Sprachen, mit hellem und dunklem Design.",
    oe_8: "Unit-, Vollsystem- und echte Browser-Tests, damit jedes Deployment immer funktioniert.",
    quickstart: "Schnellstart",
    pricing: "Preise",
    enterprise_note: "Ein selbstgehostetes, unbegrenztes ID-System.",
    hobby_features:
      "1.000 IDs pro Tag\n1 Anfrage pro Sekunde\nAlle 20 SDKs und die API\nCommunity-Support",
    pro_features:
      "Alles aus Hobby\n100.000 IDs pro Tag\n10 Anfragen pro Sekunde\nNutzungsanalysen\nE-Mail-Support innerhalb von 48 Stunden",
    ent_features:
      "Alles aus Professional\nIhr eigenes privates, selbstgehostetes PUID\nEigener Domainname\nUnbegrenzte IDs und Rate\nSSO / SAML und Audit-Logs\nE-Mail- und Telefon-Support innerhalb von 24 Stunden, mit SLA",
    popular: "Beliebt",
    get_started: "Loslegen",
    upgrade_cta: "Upgraden",
    generate: "Generieren",
    account: "Konto",
    members: "Mitglieder",
    signin_google: "Mit Google anmelden",
    signin_microsoft: "Mit Microsoft anmelden",
    signin_prompt: "Melde dich an, um einen Schlüssel zu erstellen und IDs zu generieren.",
    footer: "Ein Scherz. Beweisbar einzigartig. Nicht verwenden.",
    foot_rights: "Alle Rechte vorbehalten.",
    foot_why: "Warum?",
    foot_terms: "AGB",
    foot_privacy: "Datenschutz",
    language: "Sprache",
    theme: "Design",
    theme_auto: "Auto",
    theme_light: "Hell",
    theme_dark: "Dunkel",
    new_account: "+ Neues Konto",
    mint_key: "Schlüssel erstellen",
    team: "Team",
    generate_code: "Einladungscode erstellen",
    no_password:
      "Keine Passwörter, keine E-Mails von uns – dein Anbieter hat dich bereits verifiziert.",
    api_key: "API-Schlüssel",
    shown_once: "wird einmal angezeigt",
    join_intro:
      "Ein wiederverwendbarer Beitrittscode. Wer ihn hat, kann diesem Konto beitreten. Erneuere ihn jederzeit – der alte Code funktioniert dann nicht mehr. Oder widerrufe ihn, um den Beitritt zu deaktivieren.",
    rotate: "Erneuern",
    revoke: "Widerrufen (Beitritt deaktivieren)",
    share_email: "✉️ Per E-Mail teilen",
    joining_disabled: "Der Beitritt ist deaktiviert – es gibt keinen aktiven Code.",
    owners_only: "Nur Konto-Eigentümer können den Beitrittscode verwalten.",
    key_saved: "Speichere ihn – wir hashen ihn und können ihn nicht erneut anzeigen.",
    revoke_action: "Widerrufen",
    authorized_apps: "Autorisierte Apps",
    apps_desc:
      "Apps, denen du erlaubt hast, im Namen dieses Kontos IDs zu erzeugen (via OAuth). Jederzeit widerrufbar.",
    no_apps: "Keine Apps autorisiert.",
    usage_title: "Nutzung",
    usage_total: "gesamt",
    bucket_minute: "Pro Minute",
    bucket_hour: "Pro Stunde",
    bucket_day: "Pro Tag",
    no_usage: "Noch keine IDs erzeugt.",
    join_code_label: "Beitrittscode:",
    join_link_label: "Beitritts-Link:",
    why_title: "Okay, es ist ein Scherz.",
    why_lead:
      'PUID ist eine maßlos überbaute Art, eine Zahl auszugeben. Aber das „beweisbar eindeutig" stimmt wirklich. So funktioniert es tatsächlich.',
    why_h1: "Es ist nur ein Zähler",
    why_b1:
      "Unter der Haube zählt PUID einfach. 1, 2, 3, und so weiter. Eine UUIDv4 ist dagegen zufällig, also nur wahrscheinlich eindeutig. Erzeugt man genug davon, können zwei gleich herauskommen.",
    why_b1b:
      "Fairerweise passiert das fast nie. Eine zufällige UUID reicht für 99,999999 % der Apps. Man müsste Milliarden erzeugen, bevor eine Kollision überhaupt erwähnenswert wäre. Im echten Leben sind UUIDs großartig. Ein Zähler ist nur einfacher zu durchschauen, weil er sich nie wiederholt. Das einzige Problem ist, dass die Zahl 3 eine ziemlich langweilige ID ergibt.",
    why_h2: "Also verstecke ich den Zähler",
    why_b2:
      "Ich nehme den Zähler und schicke ihn durch eine kleine Chiffre (eine 128-Bit-Feistel-Permutation) und kodiere ihn dann mit base62. Eine Permutation mischt die Zahlen nur durch. Jede Eingabe ergibt eine andere Ausgabe, und nie landen zwei Eingaben auf derselben Ausgabe. Die IDs können also niemals kollidieren und sehen trotzdem zufällig aus. Dieselbe Eindeutigkeit wie ein Zähler, aber jetzt sieht es wie eine echte ID aus.",
    why_sample: "Aus #1 wird 64qAN39GjJh5kbi4HROOxh. Aus #2 wird 7U17bzw0MO3mzwuFKO7cc0.",
    why_h3: "Es kann sich selbst entschlüsseln",
    why_b3:
      "Die Chiffre läuft auch rückwärts. <code>GET /api/v1/ordinal/&lt;id&gt;</code> verwandelt also jede PUID zurück in ihren Zählerwert. Das beweist, dass die ID <code>64qAN39Gj...</code> in Wirklichkeit nur #1 war. Es bedeutet auch, dass jeder eine ID dekodieren und ihre Zahl lesen kann, und diese Zahl ist, wie viele IDs wir bei ihrer Erstellung ausgegeben hatten. Also nein, verwende das nicht in der Produktion.",
    why_h4: "Warum das alles für einen Zähler bauen?",
    why_b4:
      'Hauptsächlich zum Spaß, und um zu sehen, wie weit der Scherz gehen würde. Es gibt einen vollständigen OAuth2-Server, Anmeldung mit Google und Microsoft, Teams, 20 SDKs, eine Postgres-Erweiterung, 20 Sprachen und drei Test-Suites. Alles nur, um <code>i++</code> in hübscherer Verpackung zurückzugeben. Wenn dir so etwas gefällt, <a class="text-indigo-600 dark:text-indigo-400" href="https://bio.jtwebman.com" target="_blank" rel="noopener">folge mir in meinen sozialen Netzwerken</a>.',
  },

  pt: {
    hero_note: "Plano gratuito para sempre · Sem cartão de crédito · 20 SDKs oficiais",
    stat_collisions_n: "0",
    stat_collisions_l: "colisões, nunca",
    stat_keyspace_n: "2¹²⁸",
    stat_keyspace_l: "espaço de chaves de identificadores",
    stat_uptime_n: "99.99%",
    stat_uptime_l: "SLA de disponibilidade",
    stat_sdks_n: "20",
    stat_sdks_l: "SDKs oficiais",
    features_title: "Tudo o que você precisa para nunca mais colidir",
    features_sub:
      "Uma plataforma de identificadores completa — da matemática no núcleo até os SDKs, equipes e análises ao seu redor.",
    feat_unique_t: "Comprovadamente livre de colisões",
    feat_unique_b:
      "Não é astronomicamente improvável. É matematicamente impossível. Cada id tem unicidade garantida por demonstração, não por probabilidade.",
    feat_random_t: "Opaco e seguro para URL",
    feat_random_b:
      "Identificadores base62 de alta entropia que não revelam nada: nem seus dados, nem sua escala, nem uns aos outros.",
    feat_edge_t: "Servido a partir do edge",
    feat_edge_b:
      "Roda na rede global da Cloudflare, perto dos seus usuários em centenas de cidades. Rápido em todo lugar, por padrão.",
    feat_oauth_t: "OAuth2 e SSO integrados",
    feat_oauth_b:
      "Um servidor de autorização completo. Faça login com Google, delegue acesso com escopo aos aplicativos e revogue-o a qualquer momento.",
    feat_sdk_t: "20 SDKs oficiais",
    feat_sdk_b:
      "Gerados a partir da nossa especificação OpenAPI e versionados junto com a API — além de uma extensão nativa do PostgreSQL para ids de tabelas.",
    feat_team_t: "Feito para equipes",
    feat_team_b:
      "Contas multilocatário, análises de uso, chaves de API rotacionáveis e códigos de convite reutilizáveis e revogáveis.",
    how_title: "No ar em 60 segundos",
    how_sub: "Sem compras a aprovar, sem ligação de vendas. Faça login e publique.",
    step1_t: "Crie sua conta",
    step1_b:
      "Faça login com Google. Sem senhas para gerenciar, sem cartão de crédito para inserir.",
    step2_t: "Crie uma chave de API",
    step2_b: "Gere uma chave no painel. Rotacione ou revogue quando quiser.",
    step3_t: "Chame a API",
    step3_b:
      "Uma única requisição retorna até 10 ids. Adicione um SDK para a sua linguagem e pronto.",
    loved_title: "Engenheiros que se importam com correção",
    quote1: "Trocamos o UUIDv4 e não vimos uma única colisão desde então. Nenhuma.",
    name1: "Dana R.",
    role1: "Engenheira Staff",
    quote2:
      "Finalmente, identificadores cuja unicidade eu posso provar em uma revisão de código, em vez de apelar para probabilidade.",
    name2: "Marcus L.",
    role2: "Líder de Backend",
    quote3: "A extensão do Postgres entrou no nosso esquema em uma tarde. Simplesmente funciona.",
    name3: "Priya N.",
    role3: "Engenheiro de Plataforma",
    cta_title: "Pare de apostar na unicidade.",
    cta_sub: "Junte-se hoje às equipes que geram identificadores comprovadamente únicos.",
    hero_sub: "A id única que faltava ao mundo!",
    hero_desc:
      "Os UUIDs apostam na unicidade: há sempre uma probabilidade diferente de zero de dois colidirem. O PUID utiliza um motor de unicidade proprietário e com patente pendente para entregar identificadores determinísticos e sem colisões à escala da web. Nativo na nuvem, de nível empresarial e comprovadamente único por design. O como é o nosso segredo.",
    get_api_key: "Obter uma chave de API",
    nav_docs: "Documentação",
    nav_dashboard: "Painel",
    nav_metrics: "Métricas",
    guarantee_title: "Comprovadamente 100 % sem colisões",
    guarantee_body:
      "A unicidade nunca é deixada ao acaso. Cada identificador é distinto por prova matemática, não por probabilidade. Zero colisões, hoje e sempre.",
    random_title: "Parece totalmente aleatório",
    random_body:
      "Identificadores opacos, de alta entropia e seguros para URL que não revelam nada: nem seus dados, nem sua escala, nem uns aos outros. Bonitos e impossíveis de adivinhar.",
    ratelimit_title: "Com limite de taxa rígido",
    ratelimit_body:
      "A proteção de uso justo integrada impede que um único usuário monopolize o serviço, para que todos os clientes tenham acesso rápido e confiável aos ids de que precisam.",
    oe_title: "Quão sobre-engenhada ela é?",
    oe_1: "Uma cifra de Feistel de 128 bits.",
    oe_2: "Um servidor de autorização OAuth2 completo — para que apps recebam permissão formal para obter um número.",
    oe_3: "Entre com Google ou Microsoft: SSO dos provedores de identidade empresarial mais seguros.",
    oe_4: "Equipes multitenant: várias contas por usuário, com códigos de convite reutilizáveis e revogáveis.",
    oe_5: "20 SDKs de cliente, gerados a partir de uma especificação OpenAPI.",
    oe_6: "Uma extensão do PostgreSQL que permite gerar automaticamente esses ids de tabela.",
    oe_7: "Este site de marketing, em 20 idiomas, com temas claro e escuro.",
    oe_8: "Testes unitários, de sistema completo e de navegador real, para que cada implantação sempre funcione.",
    quickstart: "Início rápido",
    pricing: "Preços",
    enterprise_note: "Um sistema de ids auto-hospedado e ilimitado.",
    hobby_features:
      "1.000 ids por dia\n1 solicitação por segundo\nTodos os 20 SDKs e a API\nSuporte da comunidade",
    pro_features:
      "Tudo do Hobby\n100.000 ids por dia\n10 solicitações por segundo\nAnálise de uso\nSuporte por e-mail em 48 horas",
    ent_features:
      "Tudo do Professional\nSeu próprio PUID privado e auto-hospedado\nNome de domínio personalizado\nIds e taxa ilimitados\nSSO / SAML e logs de auditoria\nSuporte por e-mail e telefone em 24 horas, com SLA",
    popular: "Popular",
    get_started: "Começar",
    upgrade_cta: "Atualizar",
    generate: "Gerar",
    account: "Conta",
    members: "Membros",
    signin_google: "Entrar com o Google",
    signin_microsoft: "Entrar com a Microsoft",
    signin_prompt: "Entre para criar uma chave e gerar ids.",
    footer: "Uma piada. Comprovadamente único. Não use isto.",
    foot_rights: "Todos os direitos reservados.",
    foot_why: "Por quê?",
    foot_terms: "Termos",
    foot_privacy: "Privacidade",
    language: "Idioma",
    theme: "Tema",
    theme_auto: "Automático",
    theme_light: "Claro",
    theme_dark: "Escuro",
    new_account: "+ Nova conta",
    mint_key: "Criar chave",
    team: "Equipe",
    generate_code: "Gerar código de convite",
    no_password: "Sem senhas e sem e-mails da nossa parte: seu provedor já verificou você.",
    api_key: "Chave de API",
    shown_once: "mostrada uma vez",
    join_intro:
      "Um único código de entrada reutilizável. Qualquer pessoa com ele pode entrar nesta conta. Gire-o quando quiser: o código antigo para de funcionar. Ou revogue-o para desativar a entrada.",
    rotate: "Girar",
    revoke: "Revogar (desativar entrada)",
    share_email: "✉️ Compartilhar por e-mail",
    joining_disabled: "A entrada está desativada: não há código ativo.",
    owners_only: "Apenas os proprietários da conta podem gerenciar o código de entrada.",
    key_saved: "Guarde-a: nós a aplicamos hash e não podemos mostrá-la de novo.",
    revoke_action: "Revogar",
    authorized_apps: "Apps autorizados",
    apps_desc:
      "Apps aos quais você deu permissão para gerar ids em nome desta conta (via OAuth). Revogue quando quiser.",
    no_apps: "Nenhum app autorizado.",
    usage_title: "Uso",
    usage_total: "total",
    bucket_minute: "Por minuto",
    bucket_hour: "Por hora",
    bucket_day: "Por dia",
    no_usage: "Nenhum id gerado ainda.",
    join_code_label: "Código de entrada:",
    join_link_label: "Link de entrada:",
    why_title: "Ok, é uma piada.",
    why_lead:
      'O PUID é uma forma absurdamente complicada de distribuir um número. Mas a parte "comprovadamente único" é real. Veja como funciona de verdade.',
    why_h1: "É só um contador",
    why_b1:
      "Por baixo dos panos, o PUID apenas conta. 1, 2, 3, e assim por diante. Já um UUIDv4 é aleatório, então é apenas provavelmente único. Se você gerar o suficiente, dois podem sair iguais.",
    why_b1b:
      "Para ser justo, isso quase nunca acontece. Um UUID aleatório serve para 99,999999 % dos apps. Você teria que gerar bilhões antes de uma colisão valer a preocupação. Na vida real, os UUIDs são ótimos. Um contador é só mais fácil de raciocinar, porque nunca se repete. O único problema é que o número 3 é um id bem chato.",
    why_h2: "Então eu escondo o contador",
    why_b2:
      "Eu pego o contador e o passo por uma pequena cifra (uma permutação de Feistel de 128 bits), e então codifico em base62. Uma permutação só embaralha os números. Cada entrada gera uma saída diferente, e nunca duas entradas caem na mesma saída. Assim os ids nunca podem colidir, e ainda parecem aleatórios. A mesma unicidade de um contador, mas agora parece um id de verdade.",
    why_sample: "O nº 1 vira 64qAN39GjJh5kbi4HROOxh. O nº 2 vira 7U17bzw0MO3mzwuFKO7cc0.",
    why_h3: "Ele pode se decodificar",
    why_b3:
      "A cifra também funciona ao contrário. Então <code>GET /api/v1/ordinal/&lt;id&gt;</code> transforma qualquer PUID de volta no seu valor de contador. Isso prova que o id <code>64qAN39Gj...</code> era na verdade o nº 1. Também significa que qualquer um pode decodificar um id e ler seu número, e esse número é quantos ids tínhamos distribuído quando ele foi criado. Então não, não use isto em produção.",
    why_h4: "Por que construir tudo isso para um contador?",
    why_b4:
      'Principalmente por diversão, e para ver até onde a piada iria. Há um servidor OAuth2 completo, login com Google e Microsoft, equipes, 20 SDKs, uma extensão do Postgres, 20 idiomas e três suítes de testes. Tudo para retornar <code>i++</code> num embrulho mais bonito. Se você curte esse tipo de coisa, <a class="text-indigo-600 dark:text-indigo-400" href="https://bio.jtwebman.com" target="_blank" rel="noopener">me siga nas minhas redes</a>.',
  },

  it: {
    hero_note: "Piano gratuito per sempre · Nessuna carta di credito · 20 SDK ufficiali",
    stat_collisions_n: "0",
    stat_collisions_l: "collisioni, mai",
    stat_keyspace_n: "2¹²⁸",
    stat_keyspace_l: "spazio di chiavi degli identificatori",
    stat_uptime_n: "99.99%",
    stat_uptime_l: "SLA di disponibilità",
    stat_sdks_n: "20",
    stat_sdks_l: "SDK ufficiali",
    features_title: "Tutto ciò che ti serve per non collidere mai più",
    features_sub:
      "Una piattaforma di identificatori completa: dalla matematica al centro fino agli SDK, ai team e alle analisi che la circondano.",
    feat_unique_t: "Senza collisioni, dimostrato",
    feat_unique_b:
      "Non astronomicamente improbabile. Matematicamente impossibile. Ogni id è garantito distinto per dimostrazione, non per probabilità.",
    feat_random_t: "Opaco e sicuro per gli URL",
    feat_random_b:
      "Identificatori base62 ad alta entropia che non rivelano nulla: né i tuoi dati, né la tua scala, né l’uno sull’altro.",
    feat_edge_t: "Distribuito dall’edge",
    feat_edge_b:
      "Funziona sulla rete globale di Cloudflare, vicino ai tuoi utenti in centinaia di città. Veloce ovunque, per impostazione predefinita.",
    feat_oauth_t: "OAuth2 e SSO integrati",
    feat_oauth_b:
      "Un server di autorizzazione completo. Accedi con Google, delega alle app un accesso con ambito definito e revocalo in qualsiasi momento.",
    feat_sdk_t: "20 SDK ufficiali",
    feat_sdk_b:
      "Generati dalla nostra specifica OpenAPI e versionati insieme all’API, più un’estensione nativa di PostgreSQL per gli id delle tabelle.",
    feat_team_t: "Pensato per i team",
    feat_team_b:
      "Account multi-tenant, analisi d’uso, chiavi API ruotabili e codici di invito riutilizzabili e revocabili.",
    how_title: "Operativo in 60 secondi",
    how_sub: "Niente iter d’acquisto, niente chiamate commerciali. Accedi e pubblica.",
    step1_t: "Crea il tuo account",
    step1_b:
      "Accedi con Google. Nessuna password da gestire, nessuna carta di credito da inserire.",
    step2_t: "Genera una chiave API",
    step2_b: "Crea una chiave nella dashboard. Ruotala o revocala quando vuoi.",
    step3_t: "Chiama l’API",
    step3_b:
      "Una sola richiesta restituisce fino a 10 id. Aggiungi un SDK per il tuo linguaggio e il gioco è fatto.",
    loved_title: "Ingegneri a cui sta a cuore la correttezza",
    quote1:
      "Abbiamo sostituito UUIDv4 e da allora non abbiamo visto una sola collisione. Nemmeno una.",
    name1: "Dana R.",
    role1: "Staff Engineer",
    quote2:
      "Finalmente identificatori di cui posso dimostrare l’unicità in una code review, invece di appellarmi alla probabilità.",
    name2: "Marcus L.",
    role2: "Backend Lead",
    quote3: "L’estensione Postgres è entrata nel nostro schema in un pomeriggio. Funziona e basta.",
    name3: "Priya N.",
    role3: "Ingegnere di Piattaforma",
    cta_title: "Smetti di scommettere sull’unicità.",
    cta_sub: "Unisciti oggi ai team che generano identificatori dimostrabilmente unici.",
    hero_sub: "L'id unico che mancava al mondo!",
    hero_desc:
      "Gli UUID scommettono sull'unicità: esiste sempre una probabilità diversa da zero di collisione. PUID sfrutta un motore di unicità proprietario e in attesa di brevetto per fornire identificatori deterministici e senza collisioni su scala web. Cloud-native, di livello enterprise e dimostrabilmente unico per progettazione. Il come è la nostra ricetta segreta.",
    get_api_key: "Ottieni una chiave API",
    nav_docs: "Documentazione",
    nav_dashboard: "Dashboard",
    nav_metrics: "Metriche",
    guarantee_title: "Senza collisioni, dimostrabilmente al 100%",
    guarantee_body:
      "L'unicità non è mai lasciata al caso. Ogni identificatore è distinto per dimostrazione matematica, non per probabilità. Zero collisioni, oggi e per sempre.",
    random_title: "Sembra del tutto casuale",
    random_body:
      "Identificatori opachi, ad alta entropia e sicuri per URL che non rivelano nulla: né i tuoi dati, né la tua scala, né l'uno con l'altro. Eleganti e imprevedibili.",
    ratelimit_title: "Fortemente limitato",
    ratelimit_body:
      "La protezione fair-use integrata impedisce a un singolo utente di monopolizzare il servizio, così ogni cliente ottiene accesso rapido e affidabile agli id di cui ha bisogno.",
    oe_title: "Quanto è sovra-ingegnerizzata?",
    oe_1: "Un cifrario di Feistel a 128 bit.",
    oe_2: "Un server di autorizzazione OAuth2 completo, perché le app ottengano il permesso formale di ricevere un numero.",
    oe_3: "Accedi con Google o Microsoft: SSO dai provider di identità aziendale più sicuri.",
    oe_4: "Team multi-tenant: molti account per utente, con codici d'invito riutilizzabili e revocabili.",
    oe_5: "20 SDK client, generati da una specifica OpenAPI.",
    oe_6: "Un'estensione PostgreSQL che ti permette di generarli automaticamente come id di tabella.",
    oe_7: "Questo sito di marketing, in 20 lingue, con temi chiaro e scuro.",
    oe_8: "Test unitari, di sistema completo e su browser reale, così ogni deploy funziona sempre.",
    quickstart: "Avvio rapido",
    pricing: "Prezzi",
    enterprise_note: "Un sistema di id self-hosted e illimitato.",
    hobby_features:
      "1.000 id al giorno\n1 richiesta al secondo\nTutti i 20 SDK e l'API\nSupporto della community",
    pro_features:
      "Tutto di Hobby\n100.000 id al giorno\n10 richieste al secondo\nAnalisi di utilizzo\nSupporto email entro 48 ore",
    ent_features:
      "Tutto di Professional\nIl tuo PUID privato e self-hosted\nNome di dominio personalizzato\nId e frequenza illimitati\nSSO / SAML e log di audit\nSupporto email e telefono entro 24 ore, con SLA",
    popular: "Popolare",
    get_started: "Inizia",
    upgrade_cta: "Aggiorna",
    generate: "Genera",
    account: "Account",
    members: "Membri",
    signin_google: "Accedi con Google",
    signin_microsoft: "Accedi con Microsoft",
    signin_prompt: "Accedi per creare una chiave e generare id.",
    footer: "Uno scherzo. Dimostrabilmente unico. Non usarlo.",
    foot_rights: "Tutti i diritti riservati.",
    foot_why: "Perché?",
    foot_terms: "Termini",
    foot_privacy: "Privacy",
    language: "Lingua",
    theme: "Tema",
    theme_auto: "Auto",
    theme_light: "Chiaro",
    theme_dark: "Scuro",
    new_account: "+ Nuovo account",
    mint_key: "Crea chiave",
    team: "Team",
    generate_code: "Genera codice d'invito",
    no_password:
      "Niente password, nessuna email da parte nostra: il tuo provider ti ha già verificato.",
    api_key: "Chiave API",
    shown_once: "mostrata una volta",
    join_intro:
      "Un unico codice di accesso riutilizzabile. Chiunque lo abbia può unirsi a questo account. Ruotalo quando vuoi: il vecchio codice smette di funzionare. Oppure revocalo per disattivare l'accesso.",
    rotate: "Ruota",
    revoke: "Revoca (disattiva l'accesso)",
    share_email: "✉️ Condividi via email",
    joining_disabled: "L'accesso è disattivato: nessun codice attivo.",
    owners_only: "Solo i proprietari dell'account possono gestire il codice di accesso.",
    key_saved: "Salvala: ne facciamo l'hash e non possiamo mostrarla di nuovo.",
    revoke_action: "Revoca",
    authorized_apps: "App autorizzate",
    apps_desc:
      "App a cui hai dato il permesso di generare id per conto di questo account (via OAuth). Revoca quando vuoi.",
    no_apps: "Nessuna app autorizzata.",
    usage_title: "Utilizzo",
    usage_total: "totale",
    bucket_minute: "Al minuto",
    bucket_hour: "All'ora",
    bucket_day: "Al giorno",
    no_usage: "Nessun id generato ancora.",
    join_code_label: "Codice di accesso:",
    join_link_label: "Link di accesso:",
    why_title: "Ok, è uno scherzo.",
    why_lead:
      'PUID è un modo enormemente sovra-costruito di distribuire un numero. Ma la parte "dimostrabilmente unico" è reale. Ecco come funziona davvero.',
    why_h1: "È solo un contatore",
    why_b1:
      "Sotto il cofano, PUID si limita a contare. 1, 2, 3, e così via. Un UUIDv4 è invece casuale, quindi è solo probabilmente unico. Se ne generi abbastanza, due possono uscire uguali.",
    why_b1b:
      "A essere onesti, non succede quasi mai. Un UUID casuale va bene per il 99,999999 % delle app. Dovresti generarne miliardi prima che una collisione valga la pena di essere considerata. Nella vita reale gli UUID sono ottimi. Un contatore è solo più semplice da ragionare, perché non si ripete mai. L'unico problema è che il numero 3 fa un id piuttosto noioso.",
    why_h2: "Quindi nascondo il contatore",
    why_b2:
      "Prendo il contatore e lo passo attraverso un piccolo cifrario (una permutazione di Feistel a 128 bit), poi lo codifico in base62. Una permutazione si limita a rimescolare i numeri. Ogni input produce un output diverso, e mai due input finiscono sullo stesso output. Così gli id non possono mai collidere, e sembrano comunque casuali. La stessa unicità di un contatore, ma ora sembra un id vero.",
    why_sample: "Il n. 1 diventa 64qAN39GjJh5kbi4HROOxh. Il n. 2 diventa 7U17bzw0MO3mzwuFKO7cc0.",
    why_h3: "Può decodificarsi da solo",
    why_b3:
      "Il cifrario funziona anche al contrario. Quindi <code>GET /api/v1/ordinal/&lt;id&gt;</code> riporta qualsiasi PUID al suo valore di contatore. Questo dimostra che l'id <code>64qAN39Gj...</code> era in realtà solo il n. 1. Significa anche che chiunque può decodificare un id e leggerne il numero, e quel numero è quanti id avevamo distribuito quando è stato creato. Quindi no, non usarlo in produzione.",
    why_h4: "Perché costruire tutto questo per un contatore?",
    why_b4:
      'Soprattutto per divertimento, e per vedere fino a dove potesse arrivare lo scherzo. C\'è un server OAuth2 completo, accesso con Google e Microsoft, team, 20 SDK, un\'estensione Postgres, 20 lingue e tre suite di test. Tutto per restituire <code>i++</code> in una confezione più carina. Se ti piacciono queste cose, <a class="text-indigo-600 dark:text-indigo-400" href="https://bio.jtwebman.com" target="_blank" rel="noopener">seguimi sui miei social</a>.',
  },

  nl: {
    hero_note: "Voor altijd gratis · Geen creditcard nodig · 20 officiële SDKs",
    stat_collisions_n: "0",
    stat_collisions_l: "botsingen, ooit",
    stat_keyspace_n: "2¹²⁸",
    stat_keyspace_l: "identifier-keyspace",
    stat_uptime_n: "99.99%",
    stat_uptime_l: "uptime-SLA",
    stat_sdks_n: "20",
    stat_sdks_l: "officiële SDKs",
    features_title: "Alles wat je nodig hebt om nooit meer te botsen",
    features_sub:
      "Een compleet identifier-platform — van de wiskunde in de kern tot de SDKs, teams en analyses eromheen.",
    feat_unique_t: "Bewijsbaar botsingsvrij",
    feat_unique_b:
      "Niet astronomisch onwaarschijnlijk. Wiskundig onmogelijk. Elke id is gegarandeerd uniek door bewijs, niet door kans.",
    feat_random_t: "Ondoorzichtig & URL-veilig",
    feat_random_b:
      "Identifiers met hoge entropie in base62 die niets prijsgeven — niet je data, niet je schaal, niet elkaar.",
    feat_edge_t: "Geleverd vanaf de edge",
    feat_edge_b:
      "Draait op het wereldwijde netwerk van Cloudflare, dicht bij je gebruikers in honderden steden. Overal snel, standaard.",
    feat_oauth_t: "OAuth2 & SSO ingebouwd",
    feat_oauth_b:
      "Een volwaardige autorisatieserver. Log in met Google, verleen apps afgebakende toegang en trek die op elk moment weer in.",
    feat_sdk_t: "20 officiële SDKs",
    feat_sdk_b:
      "Gegenereerd uit onze OpenAPI-specificatie en geversioneerd met de API — plus een native PostgreSQL-extensie voor tabel-id's.",
    feat_team_t: "Gebouwd voor teams",
    feat_team_b:
      "Multi-tenant accounts, gebruiksanalyses, roteerbare API-sleutels en herbruikbare, intrekbare deelnamecodes.",
    how_title: "In 60 seconden klaar voor gebruik",
    how_sub: "Geen inkoopproces, geen verkoopgesprek. Log in en ga live.",
    step1_t: "Maak je account aan",
    step1_b: "Log in met Google. Geen wachtwoorden om te beheren, geen creditcard om in te voeren.",
    step2_t: "Maak een API-sleutel aan",
    step2_b: "Genereer een sleutel in het dashboard. Roteer of trek hem in wanneer je maar wilt.",
    step3_t: "Roep de API aan",
    step3_b: "Eén verzoek levert tot 10 id's op. Voeg een SDK voor je taal toe en je bent klaar.",
    loved_title: "Engineers die geven om correctheid",
    quote1: "We hebben UUIDv4 vervangen en sindsdien geen enkele botsing meer gezien. Niet één.",
    name1: "Dana R.",
    role1: "Staff Engineer",
    quote2:
      "Eindelijk identifiers waarvan ik in een code review kan bewijzen dat ze uniek zijn, in plaats van vaag te zwaaien met kansberekening.",
    name2: "Marcus L.",
    role2: "Backend Lead",
    quote3: "De Postgres-extensie zat in een middag in ons schema. Het werkt gewoon.",
    name3: "Priya N.",
    role3: "Platform Engineer",
    cta_title: "Stop met gokken op uniciteit.",
    cta_sub: "Sluit je aan bij de teams die vandaag nog bewijsbaar unieke identifiers genereren.",
    nav_docs: "API-docs",
    nav_dashboard: "Dashboard",
    nav_metrics: "Statistieken",
    guarantee_title: "Aantoonbaar 100% botsingvrij",
    random_title: "Ziet er volledig willekeurig uit",
    ratelimit_title: "Streng gelimiteerd",
    pricing: "Prijzen",
    generate: "Genereren",
    account: "Account",
    members: "Leden",
    signin_google: "Inloggen met Google",
    signin_microsoft: "Inloggen met Microsoft",
    signin_prompt: "Log in om een sleutel te maken en ids te genereren.",
    footer: "Een grap. Aantoonbaar uniek. Niet gebruiken.",
    foot_rights: "Alle rechten voorbehouden.",
    foot_why: "Waarom?",
    foot_terms: "Voorwaarden",
    foot_privacy: "Privacy",
    language: "Taal",
    theme: "Thema",
    theme_auto: "Auto",
    theme_light: "Licht",
    theme_dark: "Donker",
    new_account: "+ Nieuw account",
    mint_key: "Sleutel maken",
    team: "Team",
    generate_code: "Uitnodigingscode genereren",
    hero_sub: "De aantoonbaar unieke ID die de wereld miste!",
    hero_desc:
      "UUID's gokken op uniciteit — er is altijd een kans dat er twee botsen. PUID gebruikt een eigen, octrooi-aangevraagde uniciteitsengine voor deterministische, botsingsvrije identifiers op webschaal. Cloud-native, enterprise-grade en aantoonbaar uniek door ontwerp. Hoe? Dat is ons geheime recept.",
    get_api_key: "Een API-sleutel krijgen",
    guarantee_body:
      "Uniciteit wordt nooit aan het toeval overgelaten. Elke identifier is gegarandeerd uniek door wiskundig bewijs — niet door waarschijnlijkheid. Nul botsingen, vandaag en voor altijd.",
    random_body:
      "Ondoorzichtige, hoog-entropische, URL-veilige identifiers die niets prijsgeven — niet je data, niet je schaal, niet elkaar. Mooi en niet te raden.",
    ratelimit_body:
      "Ingebouwde fair-use-bescherming voorkomt dat één gebruiker de service monopoliseert, zodat elke klant snelle, betrouwbare toegang krijgt tot de ids die hij nodig heeft.",
    oe_title: "Hoe over-engineered is het?",
    oe_1: "Een 128-bit Feistel-cijfer.",
    oe_2: "Een volledige OAuth2-autorisatieserver — zodat apps formeel toestemming kunnen krijgen om een getal te ontvangen.",
    oe_3: "Inloggen met Google of Microsoft — SSO van de veiligste enterprise-identityproviders.",
    oe_4: "Multi-tenant teams: meerdere accounts per gebruiker, herbruikbare intrekbare toegangscodes.",
    oe_5: "20 client-SDK's, gegenereerd uit een OpenAPI-spec.",
    oe_6: "Een PostgreSQL-extensie waarmee je deze automatisch als tabel-ids genereert.",
    oe_7: "Deze marketingsite, in 20 talen, met lichte en donkere thema's.",
    oe_8: "Unit-, volledige-systeem- en echte-browsertests, zodat elke deploy altijd werkt.",
    quickstart: "Snel starten",
    get_key:
      "Krijg een sleutel in het dashboard. SDK's voor 20 talen, gegenereerd uit onze OpenAPI-spec.",
    enterprise_note: "Een zelf-gehost, onbeperkt id-systeem.",
    hobby_features:
      "1.000 ids per dag\n1 verzoek per seconde\nAlle 20 SDK's en de API\nCommunity-ondersteuning",
    pro_features:
      "Alles van Hobby\n100.000 ids per dag\n10 verzoeken per seconde\nGebruiksanalyses\nE-mailondersteuning binnen 48 uur",
    ent_features:
      "Alles van Professional\nJe eigen privé, zelf-gehoste PUID\nEigen domeinnaam\nOnbeperkte ids en snelheid\nSSO / SAML en auditlogs\nE-mail- en telefoonondersteuning binnen 24 uur, met SLA",
    popular: "Populair",
    get_started: "Aan de slag",
    upgrade_cta: "Upgraden",
    no_password: "Geen wachtwoorden, geen e-mail van ons — je provider heeft je al geverifieerd.",
    api_key: "API-sleutel",
    shown_once: "wordt één keer getoond",
    join_intro:
      "Eén herbruikbare toegangscode. Iedereen die hem heeft, kan zich bij dit account aansluiten. Roteer hem wanneer je wilt — de oude code werkt dan niet meer. Of trek hem in om aansluiten uit te schakelen.",
    rotate: "Roteren",
    revoke: "Intrekken (aansluiten uitschakelen)",
    share_email: "✉️ Delen via e-mail",
    joining_disabled: "Aansluiten is momenteel uitgeschakeld — er is geen actieve code.",
    owners_only: "Alleen accounteigenaren kunnen de toegangscode beheren.",
    key_saved: "Bewaar hem — we hashen hem en kunnen hem niet opnieuw tonen.",
    revoke_action: "Intrekken",
    authorized_apps: "Geautoriseerde apps",
    apps_desc:
      "Apps waaraan je toestemming hebt gegeven om ids te genereren namens dit account (via OAuth). Trek ze in wanneer je wilt.",
    no_apps: "Geen apps geautoriseerd.",
    usage_title: "Gebruik",
    usage_total: "totaal",
    bucket_minute: "Per minuut",
    bucket_hour: "Per uur",
    bucket_day: "Per dag",
    no_usage: "Nog geen ids gegenereerd.",
    join_code_label: "Toegangscode:",
    join_link_label: "Toegangslink:",
    why_title: "Oké, het is een grap.",
    why_lead:
      'PUID is een enorm overdreven manier om een getal uit te delen. Maar het "aantoonbaar uniek" is echt. Zo werkt het echt.',
    why_h1: "Het is gewoon een teller",
    why_b1:
      "Onder de motorkap telt PUID gewoon. 1, 2, 3, enzovoort. Een UUIDv4 is daarentegen willekeurig, dus slechts waarschijnlijk uniek. Als je er genoeg maakt, kunnen er twee hetzelfde uitkomen.",
    why_b1b:
      "Eerlijk is eerlijk, dat gebeurt bijna nooit. Een willekeurige UUID is prima voor 99,999999% van de apps. Je zou er miljarden moeten genereren voordat een botsing het overwegen waard is. In het echt zijn UUID's prima. Een teller is gewoon makkelijker te doorgronden, omdat hij zich nooit herhaalt. Het enige probleem is dat het getal 3 een nogal saaie id is.",
    why_h2: "Dus ik verberg de teller",
    why_b2:
      "Ik neem de teller en haal hem door een klein cijfer (een 128-bit Feistel-permutatie), en codeer hem dan met base62. Een permutatie schudt de getallen alleen door elkaar. Elke invoer geeft een andere uitvoer, en nooit komen twee invoeren op dezelfde uitvoer uit. Zo kunnen de ids nooit botsen, en zien ze er toch willekeurig uit. Dezelfde uniciteit als een teller, maar nu ziet het eruit als een echte id.",
    why_sample: "#1 wordt 64qAN39GjJh5kbi4HROOxh. #2 wordt 7U17bzw0MO3mzwuFKO7cc0.",
    why_h3: "Het kan zichzelf decoderen",
    why_b3:
      "Het cijfer werkt ook andersom. Dus <code>GET /api/v1/ordinal/&lt;id&gt;</code> zet elke PUID terug om in zijn tellerwaarde. Dat bewijst dat de id <code>64qAN39Gj...</code> eigenlijk gewoon #1 was. Het betekent ook dat iedereen een id kan decoderen en het getal kan lezen, en dat getal is hoeveel ids we hadden uitgedeeld toen hij werd gemaakt. Dus nee, gebruik dit niet in productie.",
    why_h4: "Waarom dit allemaal bouwen voor een teller?",
    why_b4:
      'Vooral voor de lol, en om te zien hoe ver de grap zou gaan. Er is een volledige OAuth2-server, inloggen met Google en Microsoft, teams, 20 SDK\'s, een Postgres-extensie, 20 talen en drie testsuites. Allemaal om <code>i++</code> in een mooiere verpakking terug te geven. Als je dit soort dingen leuk vindt, <a class="text-indigo-600 dark:text-indigo-400" href="https://bio.jtwebman.com" target="_blank" rel="noopener">volg me op mijn socials</a>.',
  },
  pl: {
    hero_note: "Darmowy plan na zawsze · Bez karty kredytowej · 20 oficjalnych SDKs",
    stat_collisions_n: "0",
    stat_collisions_l: "kolizji, kiedykolwiek",
    stat_keyspace_n: "2¹²⁸",
    stat_keyspace_l: "przestrzeń identyfikatorów",
    stat_uptime_n: "99.99%",
    stat_uptime_l: "SLA dostępności",
    stat_sdks_n: "20",
    stat_sdks_l: "oficjalnych SDKs",
    features_title: "Wszystko, czego potrzebujesz, by nigdy więcej nie mieć kolizji",
    features_sub:
      "Kompletna platforma identyfikatorów — od matematyki w jej rdzeniu po SDKs, zespoły i analitykę wokół niej.",
    feat_unique_t: "Dowodliwie wolne od kolizji",
    feat_unique_b:
      "Nie astronomicznie nieprawdopodobne. Matematycznie niemożliwe. Każdy id jest gwarantowanie unikalny dzięki dowodowi, a nie prawdopodobieństwu.",
    feat_random_t: "Nieprzejrzyste i bezpieczne w URL",
    feat_random_b:
      "Identyfikatory o wysokiej entropii w base62, które niczego nie zdradzają — ani twoich danych, ani twojej skali, ani siebie nawzajem.",
    feat_edge_t: "Serwowane z edge",
    feat_edge_b:
      "Działa w globalnej sieci Cloudflare, blisko twoich użytkowników w setkach miast. Szybko wszędzie, domyślnie.",
    feat_oauth_t: "Wbudowane OAuth2 i SSO",
    feat_oauth_b:
      "Pełnoprawny serwer autoryzacji. Zaloguj się przez Google, przyznawaj aplikacjom ograniczony dostęp i cofaj go w dowolnej chwili.",
    feat_sdk_t: "20 oficjalnych SDKs",
    feat_sdk_b:
      "Generowane z naszej specyfikacji OpenAPI i wersjonowane wraz z API — plus natywne rozszerzenie PostgreSQL do identyfikatorów tabel.",
    feat_team_t: "Stworzone dla zespołów",
    feat_team_b:
      "Konta wielodostępowe, analityka użycia, rotowane klucze API oraz wielokrotnego użytku, odwoływalne kody dołączania.",
    how_title: "Gotowe do działania w 60 sekund",
    how_sub: "Żadnych zakupów, żadnej rozmowy ze sprzedawcą. Zaloguj się i wdrażaj.",
    step1_t: "Załóż konto",
    step1_b:
      "Zaloguj się przez Google. Żadnych haseł do zarządzania, żadnej karty kredytowej do wpisania.",
    step2_t: "Wygeneruj klucz API",
    step2_b: "Wygeneruj klucz w panelu. Rotuj go lub cofnij, kiedy tylko chcesz.",
    step3_t: "Wywołaj API",
    step3_b: "Jedno żądanie zwraca do 10 id. Dorzuć SDK dla swojego języka i gotowe.",
    loved_title: "Inżynierowie, którym zależy na poprawności",
    quote1: "Wymieniliśmy UUIDv4 i od tamtej pory nie widzieliśmy ani jednej kolizji. Ani jednej.",
    name1: "Dana R.",
    role1: "Staff Engineer",
    quote2:
      "Wreszcie identyfikatory, których unikalność mogę udowodnić w code review, zamiast machać ręką na prawdopodobieństwo.",
    name2: "Marcus L.",
    role2: "Backend Lead",
    quote3:
      "Rozszerzenie Postgres weszło do naszego schematu w jedno popołudnie. Po prostu działa.",
    name3: "Priya N.",
    role3: "Platform Engineer",
    cta_title: "Przestań grać w ruletkę z unikalnością.",
    cta_sub: "Dołącz do zespołów, które już dziś generują dowodliwie unikalne identyfikatory.",
    nav_docs: "Dokumentacja",
    nav_dashboard: "Panel",
    nav_metrics: "Metryki",
    guarantee_title: "Dowodnie w 100% bez kolizji",
    random_title: "Wygląda całkowicie losowo",
    ratelimit_title: "Silnie ograniczony",
    pricing: "Cennik",
    generate: "Generuj",
    account: "Konto",
    members: "Członkowie",
    signin_google: "Zaloguj się przez Google",
    signin_microsoft: "Zaloguj się przez Microsoft",
    signin_prompt: "Zaloguj się, aby utworzyć klucz i generować id.",
    footer: "Żart. Dowodnie unikalne. Nie używaj tego.",
    foot_rights: "Wszelkie prawa zastrzeżone.",
    foot_why: "Dlaczego?",
    foot_terms: "Regulamin",
    foot_privacy: "Prywatność",
    language: "Język",
    theme: "Motyw",
    theme_auto: "Auto",
    theme_light: "Jasny",
    theme_dark: "Ciemny",
    new_account: "+ Nowe konto",
    mint_key: "Utwórz klucz",
    team: "Zespół",
    generate_code: "Wygeneruj kod zaproszenia",
    hero_sub: "Dowodnie unikalny identyfikator, którego brakowało światu!",
    hero_desc:
      "UUID-y stawiają na unikalność — zawsze istnieje niezerowa szansa, że dwa się zderzą. PUID wykorzystuje autorski, opatentowywany silnik unikalności, by dostarczać deterministyczne, wolne od kolizji identyfikatory w skali sieci. Cloud-native, klasy enterprise i dowodnie unikalne z założenia. Jak? To nasza tajna receptura.",
    get_api_key: "Uzyskaj klucz API",
    guarantee_body:
      "Unikalność nigdy nie jest pozostawiona przypadkowi. Każdy identyfikator jest gwarantowanie odrębny dzięki dowodowi matematycznemu — nie prawdopodobieństwu. Zero kolizji, dziś i na zawsze.",
    random_body:
      "Nieprzejrzyste, wysokoentropijne, bezpieczne dla URL identyfikatory, które niczego nie zdradzają — ani Twoich danych, ani skali, ani siebie nawzajem. Eleganckie i nie do odgadnięcia.",
    ratelimit_body:
      "Wbudowana ochrona uczciwego użycia uniemożliwia jednemu użytkownikowi zmonopolizowanie usługi, aby każdy klient miał szybki, niezawodny dostęp do potrzebnych identyfikatorów.",
    oe_title: "Jak bardzo jest przeinżynierowane?",
    oe_1: "128-bitowy szyfr Feistela.",
    oe_2: "Pełny serwer autoryzacji OAuth2 — aby aplikacje mogły formalnie otrzymać pozwolenie na otrzymanie liczby.",
    oe_3: "Logowanie przez Google lub Microsoft — SSO od najbezpieczniejszych firmowych dostawców tożsamości.",
    oe_4: "Zespoły wielodostępne: wiele kont na użytkownika, wielokrotnego użytku odwoływalne kody dołączania.",
    oe_5: "20 SDK klienckich, wygenerowanych ze specyfikacji OpenAPI.",
    oe_6: "Rozszerzenie PostgreSQL, które pozwala automatycznie generować je jako identyfikatory tabel.",
    oe_7: "Ta strona marketingowa, w 20 językach, z jasnym i ciemnym motywem.",
    oe_8: "Testy jednostkowe, pełnosystemowe i w prawdziwej przeglądarce, aby każde wdrożenie zawsze działało.",
    quickstart: "Szybki start",
    get_key:
      "Uzyskaj klucz w panelu. SDK dla 20 języków, wygenerowane z naszej specyfikacji OpenAPI.",
    enterprise_note: "Samodzielnie hostowany, nieograniczony system identyfikatorów.",
    hobby_features:
      "1000 identyfikatorów dziennie\n1 żądanie na sekundę\nWszystkie 20 SDK i API\nWsparcie społeczności",
    pro_features:
      "Wszystko z Hobby\n100 000 identyfikatorów dziennie\n10 żądań na sekundę\nAnalityka użycia\nWsparcie e-mail w 48 godzin",
    ent_features:
      "Wszystko z Professional\nWłasny prywatny, samodzielnie hostowany PUID\nWłasna nazwa domeny\nNieograniczone identyfikatory i tempo\nSSO / SAML i dzienniki audytu\nWsparcie e-mail i telefoniczne w 24 godziny, z SLA",
    popular: "Popularny",
    get_started: "Zacznij",
    upgrade_cta: "Ulepsz",
    no_password: "Bez haseł, bez e-maili od nas — Twój dostawca już Cię zweryfikował.",
    api_key: "Klucz API",
    shown_once: "pokazywany raz",
    join_intro:
      "Jeden wielokrotnego użytku kod dołączania. Każdy, kto go ma, może dołączyć do tego konta. Zmieniaj go, kiedy chcesz — stary kod przestaje działać. Albo odwołaj go, aby wyłączyć dołączanie.",
    rotate: "Zmień",
    revoke: "Odwołaj (wyłącz dołączanie)",
    share_email: "✉️ Udostępnij e-mailem",
    joining_disabled: "Dołączanie jest obecnie wyłączone — brak aktywnego kodu.",
    owners_only: "Tylko właściciele konta mogą zarządzać kodem dołączania.",
    key_saved: "Zapisz go — haszujemy go i nie możemy pokazać ponownie.",
    revoke_action: "Odwołaj",
    authorized_apps: "Autoryzowane aplikacje",
    apps_desc:
      "Aplikacje, którym dałeś pozwolenie na generowanie identyfikatorów w imieniu tego konta (przez OAuth). Odwołaj w dowolnym momencie.",
    no_apps: "Brak autoryzowanych aplikacji.",
    usage_title: "Użycie",
    usage_total: "łącznie",
    bucket_minute: "Na minutę",
    bucket_hour: "Na godzinę",
    bucket_day: "Na dzień",
    no_usage: "Nie wygenerowano jeszcze żadnych identyfikatorów.",
    join_code_label: "Kod dołączania:",
    join_link_label: "Link dołączania:",
    why_title: "Dobra, to żart.",
    why_lead:
      'PUID to przesadnie rozbudowany sposób na wydawanie liczby. Ale część "dowodnie unikalny" jest prawdziwa. Oto jak to naprawdę działa.',
    why_h1: "To tylko licznik",
    why_b1:
      "Pod maską PUID po prostu liczy. 1, 2, 3 i tak dalej. UUIDv4 jest natomiast losowy, więc tylko prawdopodobnie unikalny. Jeśli wygenerujesz ich wystarczająco dużo, dwa mogą wyjść takie same.",
    why_b1b:
      "Szczerze mówiąc, prawie nigdy się to nie zdarza. Losowy UUID wystarcza dla 99,999999% aplikacji. Musiałbyś wygenerować miliardy, zanim kolizja byłaby warta zmartwienia. W prawdziwym życiu UUID-y są świetne. Licznik jest po prostu łatwiejszy do ogarnięcia, bo nigdy się nie powtarza. Jedyny problem to taki, że liczba 3 to dość nudny identyfikator.",
    why_h2: "Więc ukrywam licznik",
    why_b2:
      "Biorę licznik i przepuszczam go przez mały szyfr (128-bitową permutację Feistela), a potem koduję go w base62. Permutacja po prostu tasuje liczby. Każde wejście daje inne wyjście i nigdy dwa wejścia nie trafiają na to samo wyjście. Dzięki temu identyfikatory nigdy nie mogą się zderzyć, a mimo to wyglądają losowo. Ta sama unikalność co licznik, ale teraz wygląda jak prawdziwy identyfikator.",
    why_sample:
      "#1 zamienia się w 64qAN39GjJh5kbi4HROOxh. #2 zamienia się w 7U17bzw0MO3mzwuFKO7cc0.",
    why_h3: "Potrafi sam się zdekodować",
    why_b3:
      "Szyfr działa też wstecz. Więc <code>GET /api/v1/ordinal/&lt;id&gt;</code> zamienia każdy PUID z powrotem na jego wartość licznika. To dowodzi, że identyfikator <code>64qAN39Gj...</code> był w rzeczywistości tylko #1. Oznacza to też, że każdy może zdekodować identyfikator i odczytać jego liczbę, a ta liczba to ile identyfikatorów wydaliśmy, gdy powstawał. Więc nie, nie używaj tego na produkcji.",
    why_h4: "Po co budować to wszystko dla licznika?",
    why_b4:
      'Głównie dla zabawy i żeby zobaczyć, jak daleko zajdzie żart. Jest pełny serwer OAuth2, logowanie przez Google i Microsoft, zespoły, 20 SDK, rozszerzenie Postgres, 20 języków i trzy zestawy testów. Wszystko po to, by zwrócić <code>i++</code> w ładniejszym opakowaniu. Jeśli lubisz takie rzeczy, <a class="text-indigo-600 dark:text-indigo-400" href="https://bio.jtwebman.com" target="_blank" rel="noopener">obserwuj mnie w moich social mediach</a>.',
  },
  ru: {
    hero_note: "Бесплатный тариф навсегда · Без карты · 20 официальных SDKs",
    stat_collisions_n: "0",
    stat_collisions_l: "коллизий, никогда",
    stat_keyspace_n: "2¹²⁸",
    stat_keyspace_l: "пространство идентификаторов",
    stat_uptime_n: "99.99%",
    stat_uptime_l: "SLA доступности",
    stat_sdks_n: "20",
    stat_sdks_l: "официальных SDKs",
    features_title: "Всё, что нужно, чтобы больше никогда не было коллизий",
    features_sub:
      "Полноценная платформа идентификаторов — от математики в её основе до SDKs, команд и аналитики вокруг неё.",
    feat_unique_t: "Доказуемо без коллизий",
    feat_unique_b:
      "Не астрономически маловероятно. Математически невозможно. Уникальность каждого id гарантирована доказательством, а не вероятностью.",
    feat_random_t: "Непрозрачные и безопасные для URL",
    feat_random_b:
      "Идентификаторы с высокой энтропией в base62, которые ничего не выдают — ни ваши данные, ни ваш масштаб, ни друг друга.",
    feat_edge_t: "Раздаются с edge",
    feat_edge_b:
      "Работает в глобальной сети Cloudflare, рядом с вашими пользователями в сотнях городов. Быстро повсюду, по умолчанию.",
    feat_oauth_t: "Встроенные OAuth2 и SSO",
    feat_oauth_b:
      "Полноценный сервер авторизации. Входите через Google, выдавайте приложениям ограниченный доступ и отзывайте его в любой момент.",
    feat_sdk_t: "20 официальных SDKs",
    feat_sdk_b:
      "Генерируются из нашей спецификации OpenAPI и версионируются вместе с API — плюс нативное расширение PostgreSQL для идентификаторов таблиц.",
    feat_team_t: "Создано для команд",
    feat_team_b:
      "Мультиарендные аккаунты, аналитика использования, сменяемые ключи API и многоразовые отзываемые коды приглашения.",
    how_title: "Запуск за 60 секунд",
    how_sub: "Никаких закупок, никаких звонков менеджеру. Войдите и запускайте.",
    step1_t: "Создайте аккаунт",
    step1_b: "Войдите через Google. Никаких паролей и никакой карты вводить не нужно.",
    step2_t: "Выпустите ключ API",
    step2_b: "Сгенерируйте ключ в панели. Меняйте или отзывайте его когда угодно.",
    step3_t: "Вызовите API",
    step3_b: "Один запрос возвращает до 10 id. Подключите SDK для своего языка — и готово.",
    loved_title: "Инженеры, которым важна корректность",
    quote1: "Мы заменили UUIDv4 и с тех пор не видели ни одной коллизии. Ни единой.",
    name1: "Dana R.",
    role1: "Staff Engineer",
    quote2:
      "Наконец-то идентификаторы, уникальность которых я могу доказать на код-ревью, а не разводить руками, ссылаясь на вероятность.",
    name2: "Marcus L.",
    role2: "Backend Lead",
    quote3: "Расширение Postgres легло в нашу схему за один вечер. Просто работает.",
    name3: "Priya N.",
    role3: "Platform Engineer",
    cta_title: "Хватит играть в рулетку с уникальностью.",
    cta_sub:
      "Присоединяйтесь к командам, которые уже сегодня генерируют доказуемо уникальные идентификаторы.",
    nav_docs: "Документация",
    nav_dashboard: "Панель",
    nav_metrics: "Метрики",
    guarantee_title: "Доказуемо без коллизий на 100%",
    random_title: "Выглядит полностью случайным",
    ratelimit_title: "Строгое ограничение частоты",
    pricing: "Цены",
    generate: "Сгенерировать",
    account: "Аккаунт",
    members: "Участники",
    signin_google: "Войти через Google",
    signin_microsoft: "Войти через Microsoft",
    signin_prompt: "Войдите, чтобы создать ключ и генерировать id.",
    footer: "Шутка. Доказуемо уникально. Не используйте.",
    foot_rights: "Все права защищены.",
    foot_why: "Почему?",
    foot_terms: "Условия",
    foot_privacy: "Конфиденциальность",
    language: "Язык",
    theme: "Тема",
    theme_auto: "Авто",
    theme_light: "Светлая",
    theme_dark: "Тёмная",
    new_account: "+ Новый аккаунт",
    mint_key: "Создать ключ",
    team: "Команда",
    generate_code: "Создать код приглашения",
    hero_sub: "Доказуемо уникальный идентификатор, которого не хватало миру!",
    hero_desc:
      "UUID полагаются на удачу — всегда есть ненулевой шанс, что два совпадут. PUID использует собственный, патентуемый движок уникальности, чтобы выдавать детерминированные, не сталкивающиеся идентификаторы веб-масштаба. Cloud-native, корпоративного уровня и доказуемо уникальные по своей конструкции. Как? Это наш секретный соус.",
    get_api_key: "Получить ключ API",
    guarantee_body:
      "Уникальность никогда не оставляется на волю случая. Каждый идентификатор гарантированно уникален благодаря математическому доказательству — а не вероятности. Ноль коллизий, сегодня и навсегда.",
    random_body:
      "Непрозрачные, высокоэнтропийные, безопасные для URL идентификаторы, которые ничего не выдают — ни ваши данные, ни масштаб, ни друг друга. Красивые и неугадываемые.",
    ratelimit_body:
      "Встроенная защита честного использования не даёт одному пользователю монополизировать сервис, чтобы каждый клиент получал быстрый, надёжный доступ к нужным идентификаторам.",
    oe_title: "Насколько это переусложнено?",
    oe_1: "128-битный шифр Фейстеля.",
    oe_2: "Полноценный сервер авторизации OAuth2 — чтобы приложениям можно было официально выдать разрешение получить число.",
    oe_3: "Вход через Google или Microsoft — SSO от самых безопасных корпоративных провайдеров идентификации.",
    oe_4: "Многопользовательские команды: много аккаунтов на пользователя, многоразовые отзываемые коды присоединения.",
    oe_5: "20 клиентских SDK, сгенерированных из спецификации OpenAPI.",
    oe_6: "Расширение PostgreSQL, позволяющее автоматически генерировать их как идентификаторы таблиц.",
    oe_7: "Этот маркетинговый сайт на 20 языках, со светлой и тёмной темами.",
    oe_8: "Модульные, полносистемные и реальные браузерные тесты, чтобы каждый деплой всегда работал.",
    quickstart: "Быстрый старт",
    get_key:
      "Получите ключ в панели. SDK для 20 языков, сгенерированные из нашей спецификации OpenAPI.",
    enterprise_note: "Самостоятельно размещаемая, безлимитная система идентификаторов.",
    hobby_features:
      "1000 идентификаторов в день\n1 запрос в секунду\nВсе 20 SDK и API\nПоддержка сообщества",
    pro_features:
      "Всё из Hobby\n100 000 идентификаторов в день\n10 запросов в секунду\nАналитика использования\nПоддержка по почте в течение 48 часов",
    ent_features:
      "Всё из Professional\nСобственный приватный, самостоятельно размещаемый PUID\nСобственное доменное имя\nБезлимитные идентификаторы и частота\nSSO / SAML и журналы аудита\nПоддержка по почте и телефону в течение 24 часов, с SLA",
    popular: "Популярный",
    get_started: "Начать",
    upgrade_cta: "Улучшить",
    no_password: "Без паролей, без писем от нас — ваш провайдер уже вас подтвердил.",
    api_key: "Ключ API",
    shown_once: "показывается один раз",
    join_intro:
      "Один многоразовый код присоединения. Любой, у кого он есть, может присоединиться к этому аккаунту. Меняйте его в любой момент — старый код перестаёт работать. Или отзовите его, чтобы отключить присоединение.",
    rotate: "Сменить",
    revoke: "Отозвать (отключить присоединение)",
    share_email: "✉️ Поделиться по почте",
    joining_disabled: "Присоединение сейчас отключено — нет активного кода.",
    owners_only: "Управлять кодом присоединения могут только владельцы аккаунта.",
    key_saved: "Сохраните его — мы храним его в виде хеша и не сможем показать снова.",
    revoke_action: "Отозвать",
    authorized_apps: "Авторизованные приложения",
    apps_desc:
      "Приложения, которым вы дали разрешение генерировать идентификаторы от имени этого аккаунта (через OAuth). Отзовите в любой момент.",
    no_apps: "Нет авторизованных приложений.",
    usage_title: "Использование",
    usage_total: "всего",
    bucket_minute: "В минуту",
    bucket_hour: "В час",
    bucket_day: "В день",
    no_usage: "Идентификаторы ещё не генерировались.",
    join_code_label: "Код присоединения:",
    join_link_label: "Ссылка присоединения:",
    why_title: "Ладно, это шутка.",
    why_lead:
      "PUID — это до абсурда переусложнённый способ выдать число. Но «доказуемо уникальный» — это правда. Вот как это работает на самом деле.",
    why_h1: "Это просто счётчик",
    why_b1:
      "Под капотом PUID просто считает. 1, 2, 3 и так далее. А UUIDv4 случайный, так что он лишь вероятно уникален. Если сгенерировать достаточно, два могут совпасть.",
    why_b1b:
      "Справедливости ради, это почти никогда не случается. Случайный UUID подходит для 99,999999 % приложений. Пришлось бы сгенерировать миллиарды, прежде чем коллизия стала бы поводом для беспокойства. В реальной жизни UUID отличны. Счётчик просто проще осмыслить, потому что он никогда не повторяется. Единственная проблема в том, что число 3 — довольно скучный идентификатор.",
    why_h2: "Поэтому я прячу счётчик",
    why_b2:
      "Я беру счётчик и пропускаю его через небольшой шифр (128-битную перестановку Фейстеля), а затем кодирую в base62. Перестановка просто перемешивает числа. Каждый вход даёт свой выход, и никогда два входа не попадают в один выход. Так идентификаторы никогда не могут столкнуться, и при этом выглядят случайными. Та же уникальность, что у счётчика, но теперь это похоже на настоящий идентификатор.",
    why_sample:
      "#1 превращается в 64qAN39GjJh5kbi4HROOxh. #2 превращается в 7U17bzw0MO3mzwuFKO7cc0.",
    why_h3: "Он может декодировать сам себя",
    why_b3:
      "Шифр работает и в обратную сторону. Так что <code>GET /api/v1/ordinal/&lt;id&gt;</code> превращает любой PUID обратно в значение счётчика. Это доказывает, что идентификатор <code>64qAN39Gj...</code> на самом деле был просто #1. Это также значит, что любой может декодировать идентификатор и прочитать его число, а это число — сколько идентификаторов мы выдали к моменту его создания. Так что нет, не используйте это в продакшене.",
    why_h4: "Зачем строить всё это ради счётчика?",
    why_b4:
      'В основном ради забавы и чтобы посмотреть, как далеко зайдёт шутка. Есть полноценный сервер OAuth2, вход через Google и Microsoft, команды, 20 SDK, расширение Postgres, 20 языков и три набора тестов. Всё это — чтобы вернуть <code>i++</code> в более красивой обёртке. Если вам нравятся такие вещи, <a class="text-indigo-600 dark:text-indigo-400" href="https://bio.jtwebman.com" target="_blank" rel="noopener">подписывайтесь на меня в соцсетях</a>.',
  },
  uk: {
    hero_note: "Безкоштовний тариф назавжди · Без картки · 20 офіційних SDKs",
    stat_collisions_n: "0",
    stat_collisions_l: "колізій, ніколи",
    stat_keyspace_n: "2¹²⁸",
    stat_keyspace_l: "простір ідентифікаторів",
    stat_uptime_n: "99.99%",
    stat_uptime_l: "SLA доступності",
    stat_sdks_n: "20",
    stat_sdks_l: "офіційних SDKs",
    features_title: "Усе, що потрібно, щоб більше ніколи не мати колізій",
    features_sub:
      "Повноцінна платформа ідентифікаторів — від математики в її основі до SDKs, команд та аналітики навколо неї.",
    feat_unique_t: "Доказово без колізій",
    feat_unique_b:
      "Не астрономічно малоймовірно. Математично неможливо. Унікальність кожного id гарантована доведенням, а не ймовірністю.",
    feat_random_t: "Непрозорі та безпечні для URL",
    feat_random_b:
      "Ідентифікатори з високою ентропією в base62, які нічого не видають — ні ваші дані, ні ваш масштаб, ні один одного.",
    feat_edge_t: "Роздаються з edge",
    feat_edge_b:
      "Працює в глобальній мережі Cloudflare, поруч із вашими користувачами в сотнях міст. Швидко всюди, за замовчуванням.",
    feat_oauth_t: "Вбудовані OAuth2 та SSO",
    feat_oauth_b:
      "Повноцінний сервер авторизації. Входьте через Google, надавайте застосункам обмежений доступ і відкликайте його будь-коли.",
    feat_sdk_t: "20 офіційних SDKs",
    feat_sdk_b:
      "Генеруються з нашої специфікації OpenAPI та версіонуються разом з API — плюс нативне розширення PostgreSQL для ідентифікаторів таблиць.",
    feat_team_t: "Створено для команд",
    feat_team_b:
      "Мультиорендні акаунти, аналітика використання, змінювані ключі API та багаторазові відкличні коди приєднання.",
    how_title: "Запуск за 60 секунд",
    how_sub: "Жодних закупівель, жодних дзвінків менеджеру. Увійдіть і запускайте.",
    step1_t: "Створіть акаунт",
    step1_b: "Увійдіть через Google. Жодних паролів і жодної картки вводити не потрібно.",
    step2_t: "Випустіть ключ API",
    step2_b: "Згенеруйте ключ у панелі. Змінюйте або відкликайте його будь-коли.",
    step3_t: "Викличте API",
    step3_b: "Один запит повертає до 10 id. Підключіть SDK для своєї мови — і готово.",
    loved_title: "Інженери, яким важлива коректність",
    quote1: "Ми замінили UUIDv4 і відтоді не бачили жодної колізії. Жоднісінької.",
    name1: "Dana R.",
    role1: "Staff Engineer",
    quote2:
      "Нарешті ідентифікатори, унікальність яких я можу довести на код-рев'ю, а не розводити руками, посилаючись на ймовірність.",
    name2: "Marcus L.",
    role2: "Backend Lead",
    quote3: "Розширення Postgres лягло в нашу схему за один вечір. Просто працює.",
    name3: "Priya N.",
    role3: "Platform Engineer",
    cta_title: "Годі грати в рулетку з унікальністю.",
    cta_sub:
      "Приєднуйтесь до команд, які вже сьогодні генерують доказово унікальні ідентифікатори.",
    nav_docs: "Документація",
    nav_dashboard: "Панель",
    nav_metrics: "Метрики",
    guarantee_title: "Доказово на 100% без колізій",
    random_title: "Виглядає цілком випадково",
    ratelimit_title: "Суворе обмеження частоти",
    pricing: "Ціни",
    generate: "Згенерувати",
    account: "Обліковий запис",
    members: "Учасники",
    signin_google: "Увійти через Google",
    signin_microsoft: "Увійти через Microsoft",
    signin_prompt: "Увійдіть, щоб створити ключ і генерувати id.",
    footer: "Жарт. Доказово унікально. Не використовуйте.",
    foot_rights: "Усі права захищено.",
    foot_why: "Чому?",
    foot_terms: "Умови",
    foot_privacy: "Конфіденційність",
    language: "Мова",
    theme: "Тема",
    theme_auto: "Авто",
    theme_light: "Світла",
    theme_dark: "Темна",
    new_account: "+ Новий запис",
    mint_key: "Створити ключ",
    team: "Команда",
    generate_code: "Створити код запрошення",
    hero_sub: "Доказово унікальний ідентифікатор, якого бракувало світу!",
    hero_desc:
      "UUID покладаються на удачу — завжди є ненульовий шанс, що два збігаються. PUID використовує власний, патентований рушій унікальності, щоб видавати детерміновані ідентифікатори без колізій вебмасштабу. Cloud-native, корпоративного рівня та доказово унікальні за задумом. Як? Це наш секретний рецепт.",
    get_api_key: "Отримати ключ API",
    guarantee_body:
      "Унікальність ніколи не залишається на волю випадку. Кожен ідентифікатор гарантовано унікальний завдяки математичному доведенню — а не ймовірності. Нуль колізій, сьогодні й назавжди.",
    random_body:
      "Непрозорі, високоентропійні, безпечні для URL ідентифікатори, які нічого не видають — ні ваші дані, ні масштаб, ні один одного. Гарні й невгадувані.",
    ratelimit_body:
      "Вбудований захист чесного використання не дає одному користувачеві монополізувати сервіс, щоб кожен клієнт мав швидкий, надійний доступ до потрібних ідентифікаторів.",
    oe_title: "Наскільки це переускладнено?",
    oe_1: "128-бітний шифр Фейстеля.",
    oe_2: "Повноцінний сервер авторизації OAuth2 — щоб застосункам можна було офіційно надати дозвіл отримати число.",
    oe_3: "Вхід через Google або Microsoft — SSO від найбезпечніших корпоративних провайдерів ідентифікації.",
    oe_4: "Багатокористувацькі команди: багато облікових записів на користувача, багаторазові відкличні коди приєднання.",
    oe_5: "20 клієнтських SDK, згенерованих зі специфікації OpenAPI.",
    oe_6: "Розширення PostgreSQL, що дозволяє автоматично генерувати їх як ідентифікатори таблиць.",
    oe_7: "Цей маркетинговий сайт 20 мовами, зі світлою та темною темами.",
    oe_8: "Модульні, повносистемні та реальні браузерні тести, щоб кожен деплой завжди працював.",
    quickstart: "Швидкий старт",
    get_key: "Отримайте ключ у панелі. SDK для 20 мов, згенеровані з нашої специфікації OpenAPI.",
    enterprise_note: "Самостійно розміщувана, безлімітна система ідентифікаторів.",
    hobby_features:
      "1000 ідентифікаторів на день\n1 запит на секунду\nУсі 20 SDK та API\nПідтримка спільноти",
    pro_features:
      "Усе з Hobby\n100 000 ідентифікаторів на день\n10 запитів на секунду\nАналітика використання\nПідтримка електронною поштою протягом 48 годин",
    ent_features:
      "Усе з Professional\nВласний приватний, самостійно розміщуваний PUID\nВласне доменне імʼя\nБезлімітні ідентифікатори та частота\nSSO / SAML і журнали аудиту\nПідтримка поштою та телефоном протягом 24 годин, з SLA",
    popular: "Популярний",
    get_started: "Почати",
    upgrade_cta: "Покращити",
    no_password: "Без паролів, без листів від нас — ваш провайдер уже вас підтвердив.",
    api_key: "Ключ API",
    shown_once: "показується один раз",
    join_intro:
      "Один багаторазовий код приєднання. Будь-хто, у кого він є, може приєднатися до цього облікового запису. Змінюйте його будь-коли — старий код перестає працювати. Або відкличте його, щоб вимкнути приєднання.",
    rotate: "Змінити",
    revoke: "Відкликати (вимкнути приєднання)",
    share_email: "✉️ Поділитися поштою",
    joining_disabled: "Приєднання зараз вимкнено — немає активного коду.",
    owners_only: "Керувати кодом приєднання можуть лише власники облікового запису.",
    key_saved: "Збережіть його — ми зберігаємо його як хеш і не зможемо показати знову.",
    revoke_action: "Відкликати",
    authorized_apps: "Авторизовані застосунки",
    apps_desc:
      "Застосунки, яким ви дали дозвіл генерувати ідентифікатори від імені цього облікового запису (через OAuth). Відкличте будь-коли.",
    no_apps: "Немає авторизованих застосунків.",
    usage_title: "Використання",
    usage_total: "усього",
    bucket_minute: "За хвилину",
    bucket_hour: "За годину",
    bucket_day: "За день",
    no_usage: "Ідентифікатори ще не генерувалися.",
    join_code_label: "Код приєднання:",
    join_link_label: "Посилання приєднання:",
    why_title: "Гаразд, це жарт.",
    why_lead:
      "PUID — це до абсурду переускладнений спосіб видати число. Але «доказово унікальний» — це правда. Ось як це працює насправді.",
    why_h1: "Це просто лічильник",
    why_b1:
      "Під капотом PUID просто рахує. 1, 2, 3 і так далі. А UUIDv4 випадковий, тож він лише ймовірно унікальний. Якщо згенерувати достатньо, два можуть збігтися.",
    why_b1b:
      "Справедливості заради, це майже ніколи не трапляється. Випадковий UUID підходить для 99,999999 % застосунків. Довелося б згенерувати мільярди, перш ніж колізія стала б приводом для хвилювання. У реальному житті UUID чудові. Лічильник просто легше осмислити, бо він ніколи не повторюється. Єдина проблема — що число 3 досить нудний ідентифікатор.",
    why_h2: "Тож я ховаю лічильник",
    why_b2:
      "Я беру лічильник і пропускаю його через невеликий шифр (128-бітну перестановку Фейстеля), а потім кодую в base62. Перестановка просто перемішує числа. Кожен вхід дає свій вихід, і ніколи два входи не потрапляють в один вихід. Тож ідентифікатори ніколи не можуть зіткнутися, і при цьому виглядають випадковими. Та сама унікальність, що в лічильника, але тепер це схоже на справжній ідентифікатор.",
    why_sample:
      "#1 перетворюється на 64qAN39GjJh5kbi4HROOxh. #2 перетворюється на 7U17bzw0MO3mzwuFKO7cc0.",
    why_h3: "Він може декодувати сам себе",
    why_b3:
      "Шифр працює і у зворотний бік. Тож <code>GET /api/v1/ordinal/&lt;id&gt;</code> перетворює будь-який PUID назад на значення лічильника. Це доводить, що ідентифікатор <code>64qAN39Gj...</code> насправді був просто #1. Це також означає, що будь-хто може декодувати ідентифікатор і прочитати його число, а це число — скільки ідентифікаторів ми видали на момент його створення. Тож ні, не використовуйте це у продакшені.",
    why_h4: "Навіщо будувати все це заради лічильника?",
    why_b4:
      'Здебільшого заради розваги і щоб побачити, як далеко зайде жарт. Є повноцінний сервер OAuth2, вхід через Google і Microsoft, команди, 20 SDK, розширення Postgres, 20 мов і три набори тестів. Усе це — щоб повернути <code>i++</code> у гарнішій обгортці. Якщо вам подобаються такі речі, <a class="text-indigo-600 dark:text-indigo-400" href="https://bio.jtwebman.com" target="_blank" rel="noopener">підписуйтеся на мене в соцмережах</a>.',
  },
  tr: {
    hero_note: "Sonsuza dek ücretsiz · Kredi kartı gerekmez · 20 resmi SDKs",
    stat_collisions_n: "0",
    stat_collisions_l: "çakışma, asla",
    stat_keyspace_n: "2¹²⁸",
    stat_keyspace_l: "tanımlayıcı anahtar uzayı",
    stat_uptime_n: "99.99%",
    stat_uptime_l: "çalışma süresi SLA",
    stat_sdks_n: "20",
    stat_sdks_l: "resmi SDKs",
    features_title: "Bir daha asla çakışmamak için ihtiyacınız olan her şey",
    features_sub:
      "Eksiksiz bir tanımlayıcı platformu — çekirdeğindeki matematikten çevresindeki SDKs, ekipler ve analizlere kadar.",
    feat_unique_t: "Kanıtlanabilir biçimde çakışmasız",
    feat_unique_b:
      "Astronomik ölçüde olanaksıza yakın değil. Matematiksel olarak imkânsız. Her id, olasılıkla değil kanıtla benzersizdir.",
    feat_random_t: "Şeffaf olmayan ve URL güvenli",
    feat_random_b:
      "Hiçbir şey ele vermeyen, yüksek entropili base62 tanımlayıcılar — ne verinizi, ne ölçeğinizi, ne de birbirlerini.",
    feat_edge_t: "Edge üzerinden sunulur",
    feat_edge_b:
      "Cloudflare'in küresel ağında, yüzlerce şehirde kullanıcılarınıza yakın çalışır. Varsayılan olarak her yerde hızlı.",
    feat_oauth_t: "Yerleşik OAuth2 ve SSO",
    feat_oauth_b:
      "Tam donanımlı bir yetkilendirme sunucusu. Google ile oturum açın, uygulamalara kapsamlı erişim verin ve istediğiniz zaman geri alın.",
    feat_sdk_t: "20 resmi SDKs",
    feat_sdk_b:
      "OpenAPI spesifikasyonumuzdan üretilir ve API ile birlikte sürümlenir — ayrıca tablo id'leri için yerel bir PostgreSQL uzantısı.",
    feat_team_t: "Ekipler için tasarlandı",
    feat_team_b:
      "Çok kiracılı hesaplar, kullanım analizleri, döndürülebilir API anahtarları ve yeniden kullanılabilir, iptal edilebilir katılım kodları.",
    how_title: "60 saniyede hazır",
    how_sub: "Satın alma süreci yok, satış görüşmesi yok. Oturum açın ve yayına alın.",
    step1_t: "Hesabınızı oluşturun",
    step1_b: "Google ile oturum açın. Yönetilecek parola yok, girilecek kredi kartı yok.",
    step2_t: "Bir API anahtarı oluşturun",
    step2_b: "Panelde bir anahtar üretin. İstediğiniz zaman döndürün veya iptal edin.",
    step3_t: "API'yi çağırın",
    step3_b: "Tek bir istek 10 id'ye kadar döndürür. Diliniz için bir SDK ekleyin ve işiniz biter.",
    loved_title: "Doğruluğu önemseyen mühendisler",
    quote1: "UUIDv4'ü değiştirdik ve o zamandan beri tek bir çakışma bile görmedik. Bir tane bile.",
    name1: "Dana R.",
    role1: "Staff Engineer",
    quote2:
      "Sonunda, olasılığa el sallamak yerine bir kod incelemesinde benzersiz olduklarını kanıtlayabileceğim tanımlayıcılar.",
    name2: "Marcus L.",
    role2: "Backend Lead",
    quote3: "Postgres uzantısı bir öğleden sonrada şemamıza yerleşti. Sorunsuz çalışıyor.",
    name3: "Priya N.",
    role3: "Platform Engineer",
    cta_title: "Benzersizliği kumara bırakmayı bırakın.",
    cta_sub: "Bugün kanıtlanabilir biçimde benzersiz tanımlayıcılar üreten ekiplere katılın.",
    nav_docs: "API Belgeleri",
    nav_dashboard: "Panel",
    nav_metrics: "Metrikler",
    guarantee_title: "Kanıtlanabilir %100 çakışmasız",
    random_title: "Tamamen rastgele görünür",
    ratelimit_title: "Sıkı hız sınırı",
    pricing: "Fiyatlandırma",
    generate: "Oluştur",
    account: "Hesap",
    members: "Üyeler",
    signin_google: "Google ile giriş yap",
    signin_microsoft: "Microsoft ile giriş yap",
    signin_prompt: "Anahtar oluşturmak ve id üretmek için giriş yapın.",
    footer: "Bir şaka. Kanıtlanabilir benzersiz. Bunu kullanmayın.",
    foot_rights: "Tüm hakları saklıdır.",
    foot_why: "Neden?",
    foot_terms: "Koşullar",
    foot_privacy: "Gizlilik",
    language: "Dil",
    theme: "Tema",
    theme_auto: "Otomatik",
    theme_light: "Açık",
    theme_dark: "Koyu",
    new_account: "+ Yeni hesap",
    mint_key: "Anahtar oluştur",
    team: "Takım",
    generate_code: "Davet kodu oluştur",
    hero_sub: "Dünyanın eksikliğini hissettiği kanıtlanabilir benzersiz kimlik!",
    hero_desc:
      "UUID'ler benzersizliği şansa bırakır — her zaman ikisinin çakışması için sıfırdan farklı bir olasılık vardır. PUID, web ölçeğinde deterministik, çakışmasız tanımlayıcılar sunmak için özel, patent başvurusu yapılmış bir benzersizlik motoru kullanır. Bulut-yerel, kurumsal düzeyde ve tasarımı gereği kanıtlanabilir biçimde benzersiz. Nasıl mı? Bu bizim gizli tarifimiz.",
    get_api_key: "API anahtarı al",
    guarantee_body:
      "Benzersizlik asla şansa bırakılmaz. Her tanımlayıcı, olasılıkla değil matematiksel kanıtla farklı olmayı garanti eder. Sıfır çakışma, bugün ve sonsuza dek.",
    random_body:
      "Hiçbir şey ele vermeyen opak, yüksek entropili, URL güvenli tanımlayıcılar — ne verinizi, ne ölçeğinizi, ne de birbirlerini. Şık ve tahmin edilemez.",
    ratelimit_body:
      "Yerleşik adil kullanım koruması, tek bir kullanıcının hizmeti tekeline almasını önler; böylece her müşteri ihtiyacı olan kimliklere hızlı, güvenilir erişim sağlar.",
    oe_title: "Ne kadar aşırı mühendislik ürünü?",
    oe_1: "128 bitlik bir Feistel şifresi.",
    oe_2: "Tam bir OAuth2 yetkilendirme sunucusu — böylece uygulamalara bir sayı alma izni resmî olarak verilebilir.",
    oe_3: "Google veya Microsoft ile giriş — en güvenli kurumsal kimlik sağlayıcılarından SSO.",
    oe_4: "Çok kiracılı takımlar: kullanıcı başına birçok hesap, yeniden kullanılabilir, iptal edilebilir katılım kodları.",
    oe_5: "Bir OpenAPI spesifikasyonundan üretilen 20 istemci SDK'sı.",
    oe_6: "Bunları tablo kimlikleri olarak otomatik üretmenizi sağlayan bir PostgreSQL uzantısı.",
    oe_7: "Bu pazarlama sitesi, 20 dilde, açık ve koyu temalarla.",
    oe_8: "Birim, tam sistem ve gerçek tarayıcı testleri, böylece her dağıtım her zaman çalışır.",
    quickstart: "Hızlı başlangıç",
    get_key: "Panodan bir anahtar alın. OpenAPI spesifikasyonumuzdan üretilen 20 dil için SDK'lar.",
    enterprise_note: "Kendi sunucunuzda barındırılan, sınırsız bir kimlik sistemi.",
    hobby_features: "Günde 1.000 kimlik\nSaniyede 1 istek\nTüm 20 SDK ve API\nTopluluk desteği",
    pro_features:
      "Hobby'deki her şey\nGünde 100.000 kimlik\nSaniyede 10 istek\nKullanım analizi\n48 saat içinde e-posta desteği",
    ent_features:
      "Professional'daki her şey\nKendi özel, kendi sunucunuzda barındırılan PUID'iniz\nÖzel alan adı\nSınırsız kimlik ve hız\nSSO / SAML ve denetim günlükleri\n24 saat içinde e-posta ve telefon desteği, SLA ile",
    popular: "Popüler",
    get_started: "Başla",
    upgrade_cta: "Yükselt",
    no_password: "Parola yok, bizden e-posta yok — sağlayıcınız sizi zaten doğruladı.",
    api_key: "API anahtarı",
    shown_once: "bir kez gösterilir",
    join_intro:
      "Tek, yeniden kullanılabilir bir katılım kodu. Ona sahip olan herkes bu hesaba katılabilir. İstediğiniz zaman döndürün — eski kod çalışmayı durdurur. Veya katılımı kapatmak için iptal edin.",
    rotate: "Döndür",
    revoke: "İptal et (katılımı kapat)",
    share_email: "✉️ E-posta ile paylaş",
    joining_disabled: "Katılım şu anda kapalı — etkin kod yok.",
    owners_only: "Katılım kodunu yalnızca hesap sahipleri yönetebilir.",
    key_saved: "Kaydedin — onu hashliyoruz ve tekrar gösteremeyiz.",
    revoke_action: "İptal et",
    authorized_apps: "Yetkili uygulamalar",
    apps_desc:
      "Bu hesap adına kimlik üretme izni verdiğiniz uygulamalar (OAuth ile). İstediğiniz zaman iptal edin.",
    no_apps: "Yetkili uygulama yok.",
    usage_title: "Kullanım",
    usage_total: "toplam",
    bucket_minute: "Dakikada",
    bucket_hour: "Saatte",
    bucket_day: "Günde",
    no_usage: "Henüz kimlik üretilmedi.",
    join_code_label: "Katılım kodu:",
    join_link_label: "Katılım bağlantısı:",
    why_title: "Tamam, bu bir şaka.",
    why_lead:
      'PUID, bir sayı dağıtmanın aşırı derecede karmaşık bir yolu. Ama "kanıtlanabilir benzersiz" kısmı gerçek. İşte gerçekten nasıl çalıştığı.',
    why_h1: "Sadece bir sayaç",
    why_b1:
      "Kaputun altında PUID sadece sayar. 1, 2, 3 ve böyle devam eder. UUIDv4 ise rastgeledir, bu yüzden yalnızca muhtemelen benzersizdir. Yeterince üretirseniz ikisi aynı çıkabilir.",
    why_b1b:
      "Adil olmak gerekirse, bu neredeyse hiç olmaz. Rastgele bir UUID, uygulamaların %99,999999'u için yeterlidir. Bir çakışmanın endişe etmeye değer olması için milyarlarca üretmeniz gerekirdi. Gerçek hayatta UUID'ler harikadır. Bir sayaç sadece akıl yürütmesi daha kolaydır çünkü asla tekrar etmez. Tek sorun, 3 sayısının oldukça sıkıcı bir kimlik olması.",
    why_h2: "Bu yüzden sayacı gizliyorum",
    why_b2:
      "Sayacı alıp küçük bir şifreden (128 bitlik bir Feistel permütasyonu) geçiriyorum, ardından base62 ile kodluyorum. Bir permütasyon sadece sayıları karıştırır. Her girdi farklı bir çıktı verir ve hiçbir zaman iki girdi aynı çıktıya düşmez. Böylece kimlikler asla çakışamaz ve yine de rastgele görünür. Bir sayaçla aynı benzersizlik, ama artık gerçek bir kimlik gibi görünüyor.",
    why_sample: "#1, 64qAN39GjJh5kbi4HROOxh olur. #2, 7U17bzw0MO3mzwuFKO7cc0 olur.",
    why_h3: "Kendi kendini çözebilir",
    why_b3:
      "Şifre tersine de çalışır. Yani <code>GET /api/v1/ordinal/&lt;id&gt;</code> herhangi bir PUID'i sayaç değerine geri çevirir. Bu, <code>64qAN39Gj...</code> kimliğinin aslında sadece #1 olduğunu kanıtlar. Ayrıca herkesin bir kimliği çözüp numarasını okuyabileceği anlamına gelir; o numara, o oluşturulduğunda kaç kimlik dağıttığımızdır. Yani hayır, bunu üretimde kullanmayın.",
    why_h4: "Bir sayaç için tüm bunlar neden inşa edildi?",
    why_b4:
      'Çoğunlukla eğlence için ve şakanın nereye kadar gideceğini görmek için. Tam bir OAuth2 sunucusu, Google ve Microsoft ile giriş, takımlar, 20 SDK, bir Postgres uzantısı, 20 dil ve üç test paketi var. Hepsi <code>i++</code> değerini daha güzel bir ambalajla döndürmek için. Böyle şeyleri seviyorsanız, <a class="text-indigo-600 dark:text-indigo-400" href="https://bio.jtwebman.com" target="_blank" rel="noopener">beni sosyal medyada takip edin</a>.',
  },
  ar: {
    hero_note: "طبقة مجانية للأبد · لا حاجة لبطاقة ائتمان · 20 حزمة SDK رسمية",
    stat_collisions_n: "0",
    stat_collisions_l: "تصادمات، على الإطلاق",
    stat_keyspace_n: "2¹²⁸",
    stat_keyspace_l: "فضاء مفاتيح المعرّفات",
    stat_uptime_n: "99.99%",
    stat_uptime_l: "اتفاقية SLA لزمن التشغيل",
    stat_sdks_n: "20",
    stat_sdks_l: "حزم SDK رسمية",
    features_title: "كل ما تحتاجه لتتجنب التصادم إلى الأبد",
    features_sub:
      "منصة معرّفات متكاملة — من الرياضيات في صميمها إلى الـ SDKs والفرق والتحليلات من حولها.",
    feat_unique_t: "خالية من التصادم بإثبات قاطع",
    feat_unique_b:
      "ليس أمرًا مستبعدًا فلكيًا، بل مستحيل رياضيًا. كل معرّف مضمون التفرّد بالبرهان لا بالاحتمال.",
    feat_random_t: "غامضة وآمنة للروابط",
    feat_random_b:
      "معرّفات base62 عالية العشوائية لا تكشف شيئًا — لا بياناتك، ولا حجم نشاطك، ولا بعضها البعض.",
    feat_edge_t: "تُقدَّم من الـ edge",
    feat_edge_b:
      "تعمل على شبكة Cloudflare العالمية، قريبة من مستخدميك في مئات المدن. سريعة في كل مكان، تلقائيًا.",
    feat_oauth_t: "OAuth2 وSSO مدمجان",
    feat_oauth_b:
      "خادم تفويض متكامل. سجّل الدخول عبر Google، وامنح التطبيقات وصولًا محدد النطاق، واسحبه في أي وقت.",
    feat_sdk_t: "20 حزمة SDK رسمية",
    feat_sdk_b:
      "مُولّدة من مواصفات OpenAPI الخاصة بنا ومُصدَّرة مع الـ API — إضافةً إلى امتداد PostgreSQL أصلي لمعرّفات الجداول.",
    feat_team_t: "مصممة للفرق",
    feat_team_b:
      "حسابات متعددة المستأجرين، وتحليلات للاستخدام، ومفاتيح API قابلة للتدوير، ورموز انضمام قابلة لإعادة الاستخدام والإبطال.",
    how_title: "جاهزة للعمل خلال 60 ثانية",
    how_sub: "لا إجراءات شراء، ولا مكالمات مبيعات. سجّل الدخول وابدأ الإطلاق.",
    step1_t: "أنشئ حسابك",
    step1_b: "سجّل الدخول عبر Google. لا كلمات مرور لإدارتها، ولا بطاقة ائتمان لإدخالها.",
    step2_t: "أنشئ مفتاح API",
    step2_b: "أنشئ مفتاحًا من لوحة التحكم. دوّره أو أبطله متى شئت.",
    step3_t: "استدعِ الـ API",
    step3_b: "طلب واحد يُرجع حتى 10 معرّفات. أضف حزمة SDK للغتك وتكون قد انتهيت.",
    loved_title: "مهندسون يهتمون بالدقة",
    quote1: "استبدلنا UUIDv4 ولم نشهد ولو تصادمًا واحدًا منذ ذلك الحين. ولا واحد.",
    name1: "Dana R.",
    role1: "مهندس أول",
    quote2: "أخيرًا، معرّفات يمكنني إثبات تفرّدها في مراجعة الكود بدلًا من التلويح بالاحتمالات.",
    name2: "Marcus L.",
    role2: "قائد فريق الواجهة الخلفية",
    quote3: "اندمج امتداد Postgres في مخطط بياناتنا خلال فترة بعد ظهر واحدة. إنه يعمل ببساطة.",
    name3: "Priya N.",
    role3: "مهندس منصات",
    cta_title: "توقف عن المقامرة على التفرّد.",
    cta_sub: "انضم إلى الفرق التي تُنشئ اليوم معرّفات مثبتة التفرّد.",
    nav_docs: "وثائق الواجهة",
    nav_dashboard: "لوحة التحكم",
    nav_metrics: "المقاييس",
    guarantee_title: "خالٍ من التصادم 100% وبشكل مُثبَت",
    random_title: "يبدو عشوائيًا تمامًا",
    ratelimit_title: "محدود المعدّل بصرامة",
    pricing: "التسعير",
    generate: "توليد",
    account: "الحساب",
    members: "الأعضاء",
    signin_google: "تسجيل الدخول عبر Google",
    signin_microsoft: "تسجيل الدخول عبر Microsoft",
    signin_prompt: "سجّل الدخول لإنشاء مفتاح وتوليد المعرفات.",
    footer: "مزحة. فريد بشكل مُثبَت. لا تستخدمه.",
    foot_rights: "جميع الحقوق محفوظة.",
    foot_why: "لماذا؟",
    foot_terms: "الشروط",
    foot_privacy: "الخصوصية",
    language: "اللغة",
    theme: "السمة",
    theme_auto: "تلقائي",
    theme_light: "فاتح",
    theme_dark: "داكن",
    new_account: "+ حساب جديد",
    mint_key: "إنشاء مفتاح",
    team: "الفريق",
    generate_code: "إنشاء رمز دعوة",
    hero_sub: "المُعرّف الفريد المُثبَت الذي كان العالم يفتقده!",
    hero_desc:
      "تراهن UUID على التفرّد — هناك دائمًا احتمال غير صفري لتصادم اثنين. يسخّر PUID محرّك تفرّد خاصًّا ومسجّل براءة اختراع لتقديم معرّفات حتمية وخالية من التصادم على نطاق الويب. سحابي المنشأ، بمستوى المؤسسات، وفريد بشكل مُثبَت بحكم التصميم. كيف؟ هذه وصفتنا السرّية.",
    get_api_key: "احصل على مفتاح API",
    guarantee_body:
      "لا يُترك التفرّد للصدفة أبدًا. كل معرّف مضمون التميّز بإثبات رياضي — لا بالاحتمال. صفر تصادمات، اليوم وإلى الأبد.",
    random_body:
      "معرّفات مبهمة وعالية الإنتروبيا وآمنة للروابط لا تكشف شيئًا — لا بياناتك ولا حجمك ولا بعضها البعض. أنيقة ولا يمكن تخمينها.",
    ratelimit_body:
      "حماية الاستخدام العادل المدمجة تمنع أي مستخدم واحد من احتكار الخدمة، لكي يحصل كل عميل على وصول سريع وموثوق إلى المعرّفات التي يحتاجها.",
    oe_title: "ما مدى المبالغة في هندسته؟",
    oe_1: "تشفير Feistel بطول 128 بت.",
    oe_2: "خادم تفويض OAuth2 كامل — حتى يُمنح التطبيقات رسميًا إذنًا لاستلام رقم.",
    oe_3: "سجّل الدخول عبر Google أو Microsoft — تسجيل دخول موحّد من أكثر مزوّدي الهوية المؤسسية أمانًا.",
    oe_4: "فرق متعددة المستأجرين: حسابات كثيرة لكل مستخدم، ورموز انضمام قابلة لإعادة الاستخدام وللإلغاء.",
    oe_5: "20 حزمة SDK للعملاء، مُولّدة من مواصفة OpenAPI.",
    oe_6: "امتداد PostgreSQL يتيح لك توليدها تلقائيًا كمعرّفات للجداول.",
    oe_7: "موقع التسويق هذا، بعشرين لغة، مع سمتين فاتحة وداكنة.",
    oe_8: "اختبارات وحدة ونظام كامل ومتصفّح حقيقي، حتى ينجح كل نشر دائمًا.",
    quickstart: "بداية سريعة",
    get_key:
      "احصل على مفتاح من لوحة التحكم. حزم SDK لعشرين لغة، مُولّدة من مواصفة OpenAPI الخاصة بنا.",
    enterprise_note: "نظام معرّفات ذاتي الاستضافة وغير محدود.",
    hobby_features:
      "1000 معرّف يوميًا\nطلب واحد في الثانية\nجميع حزم SDK العشرين وواجهة API\nدعم المجتمع",
    pro_features:
      "كل ما في Hobby\n100000 معرّف يوميًا\n10 طلبات في الثانية\nتحليلات الاستخدام\nدعم بالبريد خلال 48 ساعة",
    ent_features:
      "كل ما في Professional\nنظام PUID خاص بك ذاتي الاستضافة\nاسم نطاق مخصص\nمعرّفات ومعدّل غير محدودين\nSSO / SAML وسجلات تدقيق\nدعم بالبريد والهاتف خلال 24 ساعة، مع اتفاقية مستوى خدمة",
    popular: "شائع",
    get_started: "ابدأ",
    upgrade_cta: "ترقية",
    no_password: "لا كلمات مرور، ولا رسائل بريد منّا — مزوّدك قد تحقّق منك بالفعل.",
    api_key: "مفتاح API",
    shown_once: "يُعرَض مرة واحدة",
    join_intro:
      "رمز انضمام واحد قابل لإعادة الاستخدام. أي شخص يملكه يمكنه الانضمام إلى هذا الحساب. غيّره متى شئت — يتوقف الرمز القديم عن العمل. أو ألغِه لتعطيل الانضمام.",
    rotate: "تدوير",
    revoke: "إلغاء (تعطيل الانضمام)",
    share_email: "✉️ مشاركة عبر البريد",
    joining_disabled: "الانضمام معطّل حاليًا — لا يوجد رمز نشط.",
    owners_only: "يمكن لمالكي الحساب فقط إدارة رمز الانضمام.",
    key_saved: "احفظه — نقوم بتجزئته ولا يمكننا عرضه مرة أخرى.",
    revoke_action: "إلغاء",
    authorized_apps: "التطبيقات المُصرّح لها",
    apps_desc:
      "التطبيقات التي منحتها إذنًا لتوليد معرّفات نيابة عن هذا الحساب (عبر OAuth). ألغِها متى شئت.",
    no_apps: "لا توجد تطبيقات مُصرّح لها.",
    usage_title: "الاستخدام",
    usage_total: "الإجمالي",
    bucket_minute: "في الدقيقة",
    bucket_hour: "في الساعة",
    bucket_day: "في اليوم",
    no_usage: "لم تُولَّد أي معرّفات بعد.",
    join_code_label: "رمز الانضمام:",
    join_link_label: "رابط الانضمام:",
    why_title: "حسنًا، إنها مزحة.",
    why_lead:
      "PUID طريقة مبالغ في تعقيدها لتوزيع رقم. لكن جزء «الفريد المُثبَت» حقيقي. إليك كيف يعمل فعليًا.",
    why_h1: "إنه مجرّد عدّاد",
    why_b1:
      "في الخفاء، يكتفي PUID بالعدّ. 1، 2، 3، وهكذا. أما UUIDv4 فعشوائي، لذا فهو فريد على الأرجح فقط. إذا ولّدت ما يكفي منها، قد يخرج اثنان متطابقان.",
    why_b1b:
      "إنصافًا، هذا لا يحدث تقريبًا أبدًا. يكفي UUID عشوائي لـ 99.999999% من التطبيقات. ستحتاج إلى توليد المليارات قبل أن يستحق التصادم القلق. في الواقع، UUID رائعة. العدّاد فقط أسهل في الفهم لأنه لا يتكرّر أبدًا. المشكلة الوحيدة أن الرقم 3 معرّف ممل نوعًا ما.",
    why_h2: "لذا أُخفي العدّاد",
    why_b2:
      "آخذ العدّاد وأمرّره عبر تشفير صغير (تبديلة Feistel بطول 128 بت)، ثم أرمّزه بـ base62. التبديلة تخلط الأرقام فقط. كل مُدخل يُعطي مُخرجًا مختلفًا، ولا يقع مُدخلان أبدًا على المُخرج نفسه. لذا لا يمكن للمعرّفات أن تتصادم أبدًا، وتظل تبدو عشوائية. نفس تفرّد العدّاد، لكنه الآن يبدو كمعرّف حقيقي.",
    why_sample:
      "يتحوّل الرقم 1 إلى 64qAN39GjJh5kbi4HROOxh. ويتحوّل الرقم 2 إلى 7U17bzw0MO3mzwuFKO7cc0.",
    why_h3: "يمكنه فكّ ترميز نفسه",
    why_b3:
      "يعمل التشفير عكسيًا أيضًا. لذا فإن <code>GET /api/v1/ordinal/&lt;id&gt;</code> يحوّل أي PUID إلى قيمة عدّاده. هذا يُثبت أن المعرّف <code>64qAN39Gj...</code> كان في الحقيقة الرقم 1 فقط. ويعني أيضًا أن بإمكان أي شخص فكّ ترميز معرّف وقراءة رقمه، وذلك الرقم هو عدد المعرّفات التي وزّعناها عند إنشائه. لذا لا، لا تستخدم هذا في الإنتاج.",
    why_h4: "لماذا بناء كل هذا من أجل عدّاد؟",
    why_b4:
      'غالبًا للمتعة، ولرؤية إلى أي مدى ستصل المزحة. هناك خادم OAuth2 كامل، وتسجيل دخول عبر Google وMicrosoft، وفرق، و20 حزمة SDK، وامتداد Postgres، و20 لغة، وثلاث مجموعات اختبار. كل ذلك لإرجاع <code>i++</code> بغلاف أجمل. إذا كنت تحب هذا النوع من الأشياء، <a class="text-indigo-600 dark:text-indigo-400" href="https://bio.jtwebman.com" target="_blank" rel="noopener">تابعني على شبكاتي الاجتماعية</a>.',
  },
  he: {
    hero_note: "שכבת חינם לתמיד · ללא צורך בכרטיס אשראי · 20 ערכות SDK רשמיות",
    stat_collisions_n: "0",
    stat_collisions_l: "התנגשויות, אי פעם",
    stat_keyspace_n: "2¹²⁸",
    stat_keyspace_l: "מרחב מפתחות של מזהים",
    stat_uptime_n: "99.99%",
    stat_uptime_l: "התחייבות SLA לזמינות",
    stat_sdks_n: "20",
    stat_sdks_l: "ערכות SDK רשמיות",
    features_title: "כל מה שצריך כדי לעולם לא להתנגש שוב",
    features_sub: "פלטפורמת מזהים מלאה — מהמתמטיקה שבליבה ועד ה‑SDKs, הצוותים והאנליטיקה שסביבה.",
    feat_unique_t: "נטולת התנגשויות בהוכחה",
    feat_unique_b:
      "לא בלתי סביר אסטרונומית. בלתי אפשרי מתמטית. כל מזהה מובטח כייחודי בהוכחה, לא בהסתברות.",
    feat_random_t: "אטומה ובטוחה לכתובות URL",
    feat_random_b:
      "מזהי base62 בעלי אנטרופיה גבוהה שאינם חושפים דבר — לא את הנתונים שלך, לא את היקף הפעילות שלך, ולא זה את זה.",
    feat_edge_t: "מוגשת מה‑edge",
    feat_edge_b:
      "פועלת על הרשת הגלובלית של Cloudflare, קרוב למשתמשים שלך במאות ערים. מהירה בכל מקום, כברירת מחדל.",
    feat_oauth_t: "OAuth2 ו‑SSO מובנים",
    feat_oauth_b: "שרת הרשאות מלא. התחבר עם Google, הענק לאפליקציות גישה מתוחמת, ובטל אותה בכל עת.",
    feat_sdk_t: "20 ערכות SDK רשמיות",
    feat_sdk_b:
      "נוצרות ממפרט ה‑OpenAPI שלנו וגרסאותיהן תואמות ל‑API — בנוסף להרחבת PostgreSQL מקורית למזהי טבלאות.",
    feat_team_t: "בנויה לצוותים",
    feat_team_b:
      "חשבונות מרובי‑דיירים, אנליטיקת שימוש, מפתחות API הניתנים לסבב, וקודי הצטרפות לשימוש חוזר הניתנים לביטול.",
    how_title: "מוכן לפעולה תוך 60 שניות",
    how_sub: "ללא רכש, ללא שיחת מכירות. התחבר ושגר.",
    step1_t: "צור את החשבון שלך",
    step1_b: "התחבר עם Google. אין סיסמאות לנהל, אין כרטיס אשראי להזין.",
    step2_t: "הנפק מפתח API",
    step2_b: "צור מפתח בלוח הבקרה. סובב או בטל אותו מתי שתרצה.",
    step3_t: "קרא ל‑API",
    step3_b: "בקשה אחת מחזירה עד 10 מזהים. שלב ערכת SDK לשפה שלך וסיימת.",
    loved_title: "מהנדסים שאכפת להם מנכונות",
    quote1: "החלפנו את UUIDv4 ולא ראינו ולו התנגשות אחת מאז. אף לא אחת.",
    name1: "Dana R.",
    role1: "מהנדס בכיר",
    quote2: "סוף סוף, מזהים שאני יכול להוכיח שהם ייחודיים בסקירת קוד במקום לנפנף בהסתברות.",
    name2: "Marcus L.",
    role2: "מוביל צד‑שרת",
    quote3: "הרחבת ה‑Postgres השתלבה בסכימה שלנו תוך אחר צהריים אחד. זה פשוט עובד.",
    name3: "Priya N.",
    role3: "מהנדס פלטפורמה",
    cta_title: "די להמר על ייחודיות.",
    cta_sub: "הצטרף לצוותים שמייצרים כבר היום מזהים מוכחי‑ייחודיות.",
    nav_docs: "תיעוד API",
    nav_dashboard: "לוח בקרה",
    nav_metrics: "מדדים",
    guarantee_title: "ללא התנגשויות, מוכח ב-100%",
    random_title: "נראה אקראי לחלוטין",
    ratelimit_title: "מוגבל קצב בקפדנות",
    pricing: "תמחור",
    generate: "צור",
    account: "חשבון",
    members: "חברים",
    signin_google: "התחבר עם Google",
    signin_microsoft: "התחבר עם Microsoft",
    signin_prompt: "התחבר כדי ליצור מפתח ולהפיק מזהים.",
    footer: "בדיחה. מוכח כייחודי. אל תשתמשו בזה.",
    foot_rights: "כל הזכויות שמורות.",
    foot_why: "למה?",
    foot_terms: "תנאים",
    foot_privacy: "פרטיות",
    language: "שפה",
    theme: "ערכת נושא",
    theme_auto: "אוטומטי",
    theme_light: "בהיר",
    theme_dark: "כהה",
    new_account: "+ חשבון חדש",
    mint_key: "צור מפתח",
    team: "צוות",
    generate_code: "צור קוד הזמנה",
    hero_sub: "המזהה הייחודי המוכח שחסר לעולם!",
    hero_desc:
      "UUID מהמרים על ייחודיות — תמיד יש סיכוי שאינו אפס ששניים יתנגשו. PUID רותם מנוע ייחודיות קנייני ובהמתנה לפטנט כדי לספק מזהים דטרמיניסטיים וללא התנגשויות בקנה מידה רשתי. ענן-נייטיב, ברמת ארגון, ומוכח כייחודי בעיצובו. איך? זה הרוטב הסודי שלנו.",
    get_api_key: "קבלת מפתח API",
    guarantee_body:
      "הייחודיות לעולם אינה מושארת ליד המקרה. כל מזהה מובטח כשונה בזכות הוכחה מתמטית — לא הסתברות. אפס התנגשויות, היום ולתמיד.",
    random_body:
      "מזהים אטומים, בעלי אנטרופיה גבוהה ובטוחים לכתובות, שאינם מסגירים דבר — לא את הנתונים שלך, לא את קנה המידה ולא זה את זה. יפים ובלתי ניתנים לניחוש.",
    ratelimit_body:
      "הגנת שימוש הוגן מובנית מונעת ממשתמש יחיד להשתלט על השירות, כך שכל לקוח מקבל גישה מהירה ואמינה למזהים שהוא צריך.",
    oe_title: "עד כמה זה מהונדס יתר על המידה?",
    oe_1: "צופן Feistel של 128 סיביות.",
    oe_2: "שרת הרשאות OAuth2 מלא — כדי שאפליקציות יקבלו רשמית הרשאה לקבל מספר.",
    oe_3: "התחברות עם Google או Microsoft — SSO מספקי הזהות הארגוניים המאובטחים ביותר.",
    oe_4: "צוותים מרובי-דיירים: חשבונות רבים לכל משתמש, קודי הצטרפות לשימוש חוזר וניתנים לביטול.",
    oe_5: "20 ערכות SDK ללקוח, שנוצרו ממפרט OpenAPI.",
    oe_6: "תוסף PostgreSQL שמאפשר לך לייצר אותם אוטומטית כמזהי טבלה.",
    oe_7: "אתר השיווק הזה, ב-20 שפות, עם ערכות נושא בהירה וכהה.",
    oe_8: "בדיקות יחידה, מערכת מלאה ודפדפן אמיתי, כך שכל פריסה תמיד עובדת.",
    quickstart: "התחלה מהירה",
    get_key: "קבל מפתח בלוח הבקרה. ערכות SDK ל-20 שפות, שנוצרו ממפרט ה-OpenAPI שלנו.",
    enterprise_note: "מערכת מזהים באירוח עצמי וללא הגבלה.",
    hobby_features: "1,000 מזהים ביום\nבקשה אחת בשנייה\nכל 20 ערכות ה-SDK וה-API\nתמיכת קהילה",
    pro_features:
      "כל מה שב-Hobby\n100,000 מזהים ביום\n10 בקשות בשנייה\nניתוח שימוש\nתמיכת אימייל תוך 48 שעות",
    ent_features:
      "כל מה שב-Professional\nPUID פרטי משלך באירוח עצמי\nשם דומיין מותאם אישית\nמזהים וקצב ללא הגבלה\nSSO / SAML ויומני ביקורת\nתמיכת אימייל וטלפון תוך 24 שעות, עם SLA",
    popular: "פופולרי",
    get_started: "התחל",
    upgrade_cta: "שדרג",
    no_password: "בלי סיסמאות, בלי אימיילים מאיתנו — הספק שלך כבר אימת אותך.",
    api_key: "מפתח API",
    shown_once: "מוצג פעם אחת",
    join_intro:
      "קוד הצטרפות אחד לשימוש חוזר. כל מי שיש לו אותו יכול להצטרף לחשבון הזה. סובב אותו מתי שתרצה — הקוד הישן מפסיק לעבוד. או בטל אותו כדי לכבות את ההצטרפות.",
    rotate: "סובב",
    revoke: "בטל (כבה הצטרפות)",
    share_email: "✉️ שתף באימייל",
    joining_disabled: "ההצטרפות מושבתת כעת — אין קוד פעיל.",
    owners_only: "רק בעלי החשבון יכולים לנהל את קוד ההצטרפות.",
    key_saved: "שמור אותו — אנחנו עושים לו האש ולא נוכל להציג אותו שוב.",
    revoke_action: "בטל",
    authorized_apps: "אפליקציות מורשות",
    apps_desc: "אפליקציות שנתת להן הרשאה לייצר מזהים בשם החשבון הזה (דרך OAuth). בטל מתי שתרצה.",
    no_apps: "אין אפליקציות מורשות.",
    usage_title: "שימוש",
    usage_total: "סך הכול",
    bucket_minute: "לדקה",
    bucket_hour: "לשעה",
    bucket_day: "ליום",
    no_usage: "עדיין לא נוצרו מזהים.",
    join_code_label: "קוד הצטרפות:",
    join_link_label: "קישור הצטרפות:",
    why_title: "טוב, זו בדיחה.",
    why_lead:
      "PUID היא דרך מוגזמת בהרבה לחלק מספר. אבל החלק של «מוכח כייחודי» אמיתי. הנה איך זה באמת עובד.",
    why_h1: "זה רק מונה",
    why_b1:
      "מתחת למכסה המנוע, PUID פשוט סופר. 1, 2, 3 וכן הלאה. לעומת זאת UUIDv4 אקראי, ולכן הוא רק כנראה ייחודי. אם תייצר מספיק, שניים יכולים לצאת זהים.",
    why_b1b:
      "למען ההגינות, זה כמעט אף פעם לא קורה. UUID אקראי מתאים ל-99.999999% מהאפליקציות. תצטרך לייצר מיליארדים לפני שהתנגשות בכלל שווה דאגה. בחיים האמיתיים UUID נהדרים. מונה פשוט קל יותר להבנה כי הוא לעולם לא חוזר על עצמו. הבעיה היחידה היא שהמספר 3 הוא מזהה די משעמם.",
    why_h2: "אז אני מסתיר את המונה",
    why_b2:
      "אני לוקח את המונה ומעביר אותו דרך צופן קטן (תמורת Feistel של 128 סיביות), ואז מקודד אותו ב-base62. תמורה רק מערבבת את המספרים. כל קלט נותן פלט שונה, ואף פעם שני קלטים לא נופלים על אותו פלט. כך המזהים לעולם לא יכולים להתנגש, והם עדיין נראים אקראיים. אותה ייחודיות כמו מונה, אבל עכשיו זה נראה כמו מזהה אמיתי.",
    why_sample: "מס' 1 הופך ל-64qAN39GjJh5kbi4HROOxh. מס' 2 הופך ל-7U17bzw0MO3mzwuFKO7cc0.",
    why_h3: "הוא יכול לפענח את עצמו",
    why_b3:
      "הצופן עובד גם הפוך. כך ש-<code>GET /api/v1/ordinal/&lt;id&gt;</code> הופך כל PUID בחזרה לערך המונה שלו. זה מוכיח שהמזהה <code>64qAN39Gj...</code> היה באמת רק מס' 1. זה גם אומר שכל אחד יכול לפענח מזהה ולקרוא את מספרו, והמספר הזה הוא כמה מזהים חילקנו כשהוא נוצר. אז לא, אל תשתמשו בזה בייצור.",
    why_h4: "למה לבנות את כל זה בשביל מונה?",
    why_b4:
      'בעיקר בשביל הכיף, וכדי לראות עד לאן הבדיחה תגיע. יש שרת OAuth2 מלא, התחברות עם Google ו-Microsoft, צוותים, 20 ערכות SDK, תוסף Postgres, 20 שפות ושלוש חבילות בדיקות. הכול כדי להחזיר <code>i++</code> באריזה יפה יותר. אם אתם אוהבים דברים כאלה, <a class="text-indigo-600 dark:text-indigo-400" href="https://bio.jtwebman.com" target="_blank" rel="noopener">עקבו אחריי ברשתות שלי</a>.',
  },
  hi: {
    hero_note: "हमेशा के लिए मुफ़्त टियर · क्रेडिट कार्ड की ज़रूरत नहीं · 20 आधिकारिक SDKs",
    stat_collisions_n: "0",
    stat_collisions_l: "टकराव, कभी भी",
    stat_keyspace_n: "2¹²⁸",
    stat_keyspace_l: "आइडेंटिफ़ायर कीस्पेस",
    stat_uptime_n: "99.99%",
    stat_uptime_l: "अपटाइम SLA",
    stat_sdks_n: "20",
    stat_sdks_l: "आधिकारिक SDKs",
    features_title: "वह सब कुछ जो आपको दोबारा कभी न टकराने के लिए चाहिए",
    features_sub:
      "एक संपूर्ण आइडेंटिफ़ायर प्लेटफ़ॉर्म — इसके मूल के गणित से लेकर इसके आसपास के SDKs, टीमों और एनालिटिक्स तक.",
    feat_unique_t: "प्रमाणित रूप से टकराव-मुक्त",
    feat_unique_b:
      "खगोलीय रूप से असंभावित नहीं. गणितीय रूप से असंभव. हर id प्रमाण से अलग होने की गारंटी देती है, संभावना से नहीं.",
    feat_random_t: "अपारदर्शी और URL-सुरक्षित",
    feat_random_b:
      "उच्च-एन्ट्रॉपी वाले base62 आइडेंटिफ़ायर जो कुछ भी उजागर नहीं करते — न आपका डेटा, न आपका पैमाना, न एक-दूसरे को.",
    feat_edge_t: "edge से सर्व किया गया",
    feat_edge_b:
      "Cloudflare के वैश्विक नेटवर्क पर चलता है, सैकड़ों शहरों में आपके उपयोगकर्ताओं के पास. हर जगह तेज़, डिफ़ॉल्ट रूप से.",
    feat_oauth_t: "OAuth2 और SSO अंतर्निहित",
    feat_oauth_b:
      "एक पूर्ण ऑथराइज़ेशन सर्वर. Google से साइन इन करें, ऐप्स को सीमित पहुँच सौंपें, और इसे कभी भी रद्द करें.",
    feat_sdk_t: "20 आधिकारिक SDKs",
    feat_sdk_b:
      "हमारे OpenAPI स्पेक से जेनरेट किए गए और API के साथ वर्ज़न किए गए — साथ ही टेबल ids के लिए एक नेटिव PostgreSQL एक्सटेंशन.",
    feat_team_t: "टीमों के लिए बनाया गया",
    feat_team_b:
      "मल्टी-टेनेंट अकाउंट, उपयोग एनालिटिक्स, घुमाए जा सकने वाली API कुंजियाँ, और पुन: प्रयोज्य व रद्द करने योग्य जॉइन कोड.",
    how_title: "60 सेकंड में चालू और तैयार",
    how_sub: "न खरीद प्रक्रिया, न सेल्स कॉल. साइन इन करें और शिप करें.",
    step1_t: "अपना अकाउंट बनाएँ",
    step1_b: "Google से साइन इन करें. न कोई पासवर्ड संभालना, न कोई क्रेडिट कार्ड दर्ज करना.",
    step2_t: "एक API कुंजी बनाएँ",
    step2_b: "डैशबोर्ड में एक कुंजी जेनरेट करें. जब चाहें इसे घुमाएँ या रद्द करें.",
    step3_t: "API को कॉल करें",
    step3_b: "एक अनुरोध 10 तक ids लौटाता है. अपनी भाषा के लिए एक SDK जोड़ें और बस हो गया.",
    loved_title: "वे इंजीनियर जिन्हें शुद्धता की परवाह है",
    quote1: "हमने UUIDv4 को हटा दिया और तब से एक भी टकराव नहीं देखा. एक भी नहीं.",
    name1: "Dana R.",
    role1: "स्टाफ़ इंजीनियर",
    quote2:
      "आख़िरकार, ऐसे आइडेंटिफ़ायर जिन्हें मैं कोड रिव्यू में अद्वितीय साबित कर सकता हूँ, संभावना का हवाला देने के बजाय.",
    name2: "Marcus L.",
    role2: "बैकएंड लीड",
    quote3: "Postgres एक्सटेंशन एक दोपहर में हमारी स्कीमा में जुड़ गया. यह बस काम करता है.",
    name3: "Priya N.",
    role3: "प्लेटफ़ॉर्म इंजीनियर",
    cta_title: "अद्वितीयता पर जुआ खेलना बंद करें.",
    cta_sub: "आज ही प्रमाणित रूप से अद्वितीय आइडेंटिफ़ायर बनाने वाली टीमों में शामिल हों.",
    nav_docs: "API दस्तावेज़",
    nav_dashboard: "डैशबोर्ड",
    nav_metrics: "मेट्रिक्स",
    guarantee_title: "प्रमाणित रूप से 100% टकराव-रहित",
    random_title: "पूरी तरह यादृच्छिक दिखता है",
    ratelimit_title: "कठोर दर-सीमा",
    pricing: "मूल्य",
    generate: "बनाएँ",
    account: "खाता",
    members: "सदस्य",
    signin_google: "Google से साइन इन करें",
    signin_microsoft: "Microsoft से साइन इन करें",
    signin_prompt: "कुंजी बनाने और id जनरेट करने के लिए साइन इन करें।",
    footer: "एक मज़ाक। प्रमाणित रूप से अद्वितीय। इसका उपयोग न करें।",
    foot_rights: "सर्वाधिकार सुरक्षित।",
    foot_why: "क्यों?",
    foot_terms: "शर्तें",
    foot_privacy: "गोपनीयता",
    language: "भाषा",
    theme: "थीम",
    theme_auto: "स्वतः",
    theme_light: "लाइट",
    theme_dark: "डार्क",
    new_account: "+ नया खाता",
    mint_key: "कुंजी बनाएँ",
    team: "टीम",
    generate_code: "आमंत्रण कोड बनाएँ",
    hero_sub: "वह प्रमाणित अद्वितीय आईडी जो दुनिया को चाहिए थी!",
    hero_desc:
      "UUID अद्वितीयता पर दांव लगाते हैं — दो के टकराने की हमेशा एक गैर-शून्य संभावना रहती है। PUID एक स्वामित्व वाले, पेटेंट-लंबित अद्वितीयता इंजन का उपयोग करके वेब-स्केल पर नियतात्मक, टकराव-मुक्त पहचानकर्ता देता है। क्लाउड-नेटिव, एंटरप्राइज़-ग्रेड, और डिज़ाइन से प्रमाणित रूप से अद्वितीय। कैसे? यह हमारा गुप्त नुस्खा है।",
    get_api_key: "API कुंजी प्राप्त करें",
    guarantee_body:
      "अद्वितीयता को कभी संयोग पर नहीं छोड़ा जाता। हर पहचानकर्ता गणितीय प्रमाण से अलग होने की गारंटी देता है — संभावना से नहीं। शून्य टकराव, आज और हमेशा के लिए।",
    random_body:
      "अपारदर्शी, उच्च-एन्ट्रॉपी, URL-सुरक्षित पहचानकर्ता जो कुछ भी नहीं बताते — न आपका डेटा, न आपका पैमाना, न एक-दूसरे को। सुंदर और अनुमान-रहित।",
    ratelimit_body:
      "अंतर्निहित उचित-उपयोग सुरक्षा किसी एक उपयोगकर्ता को सेवा पर एकाधिकार करने से रोकती है, ताकि हर ग्राहक को ज़रूरत के आईडी तक तेज़, भरोसेमंद पहुँच मिले।",
    oe_title: "यह कितना ओवर-इंजीनियर्ड है?",
    oe_1: "एक 128-बिट Feistel सिफर।",
    oe_2: "एक पूर्ण OAuth2 प्राधिकरण सर्वर — ताकि ऐप्स को औपचारिक रूप से एक संख्या प्राप्त करने की अनुमति दी जा सके।",
    oe_3: "Google या Microsoft से साइन इन — सबसे सुरक्षित एंटरप्राइज़ पहचान प्रदाताओं से SSO।",
    oe_4: "मल्टी-टेनेंट टीमें: प्रति उपयोगकर्ता कई खाते, पुन: उपयोग योग्य और रद्द करने योग्य जॉइन कोड।",
    oe_5: "एक OpenAPI स्पेक से जनरेट किए गए 20 क्लाइंट SDK।",
    oe_6: "एक PostgreSQL एक्सटेंशन जो आपको इन्हें टेबल आईडी के रूप में स्वतः जनरेट करने देता है।",
    oe_7: "यह मार्केटिंग साइट, 20 भाषाओं में, लाइट और डार्क थीम के साथ।",
    oe_8: "यूनिट, फुल-सिस्टम और रियल-ब्राउज़र टेस्ट, ताकि हर डिप्लॉय हमेशा काम करे।",
    quickstart: "त्वरित शुरुआत",
    get_key: "डैशबोर्ड में एक कुंजी प्राप्त करें। हमारे OpenAPI स्पेक से जनरेट किए गए 20 भाषाओं के SDK।",
    enterprise_note: "एक स्व-होस्टेड, असीमित आईडी सिस्टम।",
    hobby_features: "प्रति दिन 1,000 आईडी\nप्रति सेकंड 1 अनुरोध\nसभी 20 SDK और API\nसामुदायिक सहायता",
    pro_features:
      "Hobby की सभी सुविधाएँ\nप्रति दिन 100,000 आईडी\nप्रति सेकंड 10 अनुरोध\nउपयोग विश्लेषण\n48 घंटे में ईमेल सहायता",
    ent_features:
      "Professional की सभी सुविधाएँ\nआपका अपना निजी, स्व-होस्टेड PUID\nकस्टम डोमेन नाम\nअसीमित आईडी और दर\nSSO / SAML और ऑडिट लॉग\n24 घंटे में ईमेल और फ़ोन सहायता, SLA के साथ",
    popular: "लोकप्रिय",
    get_started: "शुरू करें",
    upgrade_cta: "अपग्रेड",
    no_password:
      "कोई पासवर्ड नहीं, हमारी ओर से कोई ईमेल नहीं — आपके प्रदाता ने आपको पहले ही सत्यापित कर दिया है।",
    api_key: "API कुंजी",
    shown_once: "एक बार दिखाई जाती है",
    join_intro:
      "एक पुन: उपयोग योग्य जॉइन कोड। जिसके पास भी यह है वह इस खाते में शामिल हो सकता है। इसे कभी भी बदलें — पुराना कोड काम करना बंद कर देता है। या इसे रद्द करके शामिल होना बंद कर दें।",
    rotate: "बदलें",
    revoke: "रद्द करें (शामिल होना बंद करें)",
    share_email: "✉️ ईमेल से साझा करें",
    joining_disabled: "शामिल होना अभी बंद है — कोई सक्रिय कोड नहीं है।",
    owners_only: "केवल खाता स्वामी ही जॉइन कोड प्रबंधित कर सकते हैं।",
    key_saved: "इसे सहेजें — हम इसे हैश करते हैं और दोबारा नहीं दिखा सकते।",
    revoke_action: "रद्द करें",
    authorized_apps: "अधिकृत ऐप्स",
    apps_desc:
      "वे ऐप्स जिन्हें आपने इस खाते की ओर से आईडी जनरेट करने की अनुमति दी है (OAuth के माध्यम से)। कभी भी रद्द करें।",
    no_apps: "कोई ऐप अधिकृत नहीं।",
    usage_title: "उपयोग",
    usage_total: "कुल",
    bucket_minute: "प्रति मिनट",
    bucket_hour: "प्रति घंटा",
    bucket_day: "प्रति दिन",
    no_usage: "अभी तक कोई आईडी जनरेट नहीं हुई।",
    join_code_label: "जॉइन कोड:",
    join_link_label: "जॉइन लिंक:",
    why_title: "ठीक है, यह एक मज़ाक है।",
    why_lead:
      'PUID एक संख्या बाँटने का बेहद ज़्यादा बनाया गया तरीका है। लेकिन "प्रमाणित रूप से अद्वितीय" वाला हिस्सा सच है। यह वास्तव में ऐसे काम करता है।',
    why_h1: "यह बस एक काउंटर है",
    why_b1:
      "अंदर से, PUID बस गिनता है। 1, 2, 3, और ऐसे ही। दूसरी ओर UUIDv4 यादृच्छिक है, इसलिए यह केवल संभवतः अद्वितीय है। अगर आप पर्याप्त बनाएँ, तो दो एक जैसे निकल सकते हैं।",
    why_b1b:
      "सच कहें तो ऐसा लगभग कभी नहीं होता। एक यादृच्छिक UUID 99.999999% ऐप्स के लिए ठीक है। टकराव की चिंता करने लायक होने से पहले आपको अरबों बनाने होंगे। असल ज़िंदगी में UUID शानदार हैं। काउंटर बस समझने में आसान है क्योंकि यह कभी दोहराता नहीं। एकमात्र समस्या यह है कि संख्या 3 एक काफ़ी उबाऊ आईडी है।",
    why_h2: "इसलिए मैं काउंटर छिपा देता हूँ",
    why_b2:
      "मैं काउंटर लेता हूँ और इसे एक छोटे सिफर (128-बिट Feistel परम्यूटेशन) से गुज़ारता हूँ, फिर इसे base62 में एनकोड करता हूँ। एक परम्यूटेशन बस संख्याओं को फेंटता है। हर इनपुट एक अलग आउटपुट देता है, और कभी भी दो इनपुट एक ही आउटपुट पर नहीं गिरते। तो आईडी कभी टकरा नहीं सकते, और फिर भी यादृच्छिक दिखते हैं। काउंटर जैसी ही अद्वितीयता, पर अब यह एक असली आईडी जैसा दिखता है।",
    why_sample: "#1 बन जाता है 64qAN39GjJh5kbi4HROOxh। #2 बन जाता है 7U17bzw0MO3mzwuFKO7cc0।",
    why_h3: "यह खुद को डिकोड कर सकता है",
    why_b3:
      "सिफर उल्टा भी चलता है। तो <code>GET /api/v1/ordinal/&lt;id&gt;</code> किसी भी PUID को वापस उसके काउंटर मान में बदल देता है। यह साबित करता है कि आईडी <code>64qAN39Gj...</code> असल में बस #1 था। इसका यह भी मतलब है कि कोई भी एक आईडी डिकोड करके उसकी संख्या पढ़ सकता है, और वह संख्या यह है कि बनने के समय तक हमने कितने आईडी बाँटे थे। तो नहीं, इसे प्रोडक्शन में इस्तेमाल न करें।",
    why_h4: "एक काउंटर के लिए यह सब क्यों बनाया?",
    why_b4:
      'ज़्यादातर मज़े के लिए, और यह देखने के लिए कि मज़ाक कहाँ तक जाएगा। एक पूरा OAuth2 सर्वर, Google और Microsoft से साइन इन, टीमें, 20 SDK, एक Postgres एक्सटेंशन, 20 भाषाएँ और तीन टेस्ट सूट हैं। यह सब <code>i++</code> को एक बेहतर पैकेज में लौटाने के लिए। अगर आपको ऐसी चीज़ें पसंद हैं, <a class="text-indigo-600 dark:text-indigo-400" href="https://bio.jtwebman.com" target="_blank" rel="noopener">मुझे मेरे सोशल पर फ़ॉलो करें</a>।',
  },
  zh: {
    hero_note: "永久免费套餐 · 无需信用卡 · 20 个官方 SDK",
    stat_collisions_n: "0",
    stat_collisions_l: "次碰撞，永不发生",
    stat_keyspace_n: "2¹²⁸",
    stat_keyspace_l: "标识符密钥空间",
    stat_uptime_n: "99.99%",
    stat_uptime_l: "正常运行时间 SLA",
    stat_sdks_n: "20",
    stat_sdks_l: "个官方 SDK",
    features_title: "你所需要的一切，从此告别碰撞",
    features_sub:
      "一个完整的标识符平台——从核心的数学原理，到围绕它构建的 SDK、团队协作与分析功能。",
    feat_unique_t: "可证明无碰撞",
    feat_unique_b: "不是概率上微乎其微，而是数学上绝无可能。每个 id 都由证明保证唯一，而非靠概率。",
    feat_random_t: "不透明且 URL 安全",
    feat_random_b:
      "高熵的 base62 标识符，不泄露任何信息——不暴露你的数据、你的规模，彼此之间也毫无关联。",
    feat_edge_t: "由 edge 提供服务",
    feat_edge_b: "运行在 Cloudflare 全球网络上，遍布数百个城市，贴近你的用户。默认全球加速。",
    feat_oauth_t: "内置 OAuth2 与 SSO",
    feat_oauth_b: "完整的授权服务器。使用 Google 登录，向应用授予限定范围的访问权限，并随时撤销。",
    feat_sdk_t: "20 个官方 SDK",
    feat_sdk_b:
      "由我们的 OpenAPI 规范生成，并与 API 同步版本管理——另附用于表 id 的原生 PostgreSQL 扩展。",
    feat_team_t: "为团队而生",
    feat_team_b: "多租户账户、用量分析、可轮换的 API 密钥，以及可复用、可撤销的加入码。",
    how_title: "60 秒即可上手运行",
    how_sub: "无需采购流程，无需销售洽谈。登录即可发布。",
    step1_t: "创建你的账户",
    step1_b: "使用 Google 登录。无需管理密码，无需输入信用卡。",
    step2_t: "生成 API 密钥",
    step2_b: "在控制台中生成密钥，随时轮换或撤销。",
    step3_t: "调用 API",
    step3_b: "一次请求最多返回 10 个 id。接入适配你语言的 SDK，即可大功告成。",
    loved_title: "在意正确性的工程师之选",
    quote1: "我们替换掉了 UUIDv4，从那以后再没出现过一次碰撞。一次都没有。",
    name1: "Dana R.",
    role1: "资深工程师",
    quote2: "终于，我可以在代码评审中证明标识符是唯一的，而不必含糊地拿概率搪塞。",
    name2: "Marcus L.",
    role2: "后端负责人",
    quote3: "这个 Postgres 扩展一个下午就接入了我们的架构。它就是好用。",
    name3: "Priya N.",
    role3: "平台工程师",
    cta_title: "别再拿唯一性来碰运气。",
    cta_sub: "立即加入这些团队，生成可证明唯一的标识符。",
    nav_docs: "API 文档",
    nav_dashboard: "控制台",
    nav_metrics: "指标",
    guarantee_title: "可证明 100% 无冲突",
    random_title: "看起来完全随机",
    ratelimit_title: "严格限速",
    pricing: "价格",
    generate: "生成",
    account: "账户",
    members: "成员",
    signin_google: "使用 Google 登录",
    signin_microsoft: "使用 Microsoft 登录",
    signin_prompt: "登录以创建密钥并生成 ID。",
    footer: "一个玩笑。可证明唯一。请勿使用。",
    foot_rights: "版权所有。",
    foot_why: "为什么？",
    foot_terms: "条款",
    foot_privacy: "隐私",
    language: "语言",
    theme: "主题",
    theme_auto: "自动",
    theme_light: "浅色",
    theme_dark: "深色",
    new_account: "+ 新建账户",
    mint_key: "创建密钥",
    team: "团队",
    generate_code: "生成邀请码",
    hero_sub: "世界缺失的可证明唯一 ID！",
    hero_desc:
      "UUID 把唯一性交给运气——两个相撞的概率始终非零。PUID 借助专有的、专利申请中的唯一性引擎，以网络规模提供确定性、无冲突的标识符。云原生、企业级，且设计上可证明唯一。怎么做到的？这是我们的独门秘方。",
    get_api_key: "获取 API 密钥",
    guarantee_body:
      "唯一性从不交给运气。每个标识符都由数学证明保证彼此不同——而非概率。零冲突，今天乃至永远。",
    random_body:
      "不透明、高熵、URL 安全的标识符，什么都不泄露——不泄露你的数据、规模，也彼此不泄露。优雅且无法猜测。",
    ratelimit_body:
      "内置的公平使用保护可防止任何单个用户独占服务，让每位客户都能快速、可靠地获取所需的 ID。",
    oe_title: "它到底有多过度工程？",
    oe_1: "一个 128 位的 Feistel 密码。",
    oe_2: "一个完整的 OAuth2 授权服务器——这样应用就能被正式授予接收一个数字的权限。",
    oe_3: "使用 Google 或 Microsoft 登录——来自最安全的企业身份提供商的 SSO。",
    oe_4: "多租户团队：每个用户多个账户，可重复使用、可撤销的加入码。",
    oe_5: "20 个客户端 SDK，由 OpenAPI 规范生成。",
    oe_6: "一个 PostgreSQL 扩展，让你把它们自动生成为表 ID。",
    oe_7: "这个营销站点，支持 20 种语言，带浅色和深色主题。",
    oe_8: "单元测试、全系统测试和真实浏览器测试，让每次部署都始终可用。",
    quickstart: "快速开始",
    get_key: "在控制台获取密钥。20 种语言的 SDK，由我们的 OpenAPI 规范生成。",
    enterprise_note: "一个自托管、无限制的 ID 系统。",
    hobby_features: "每天 1,000 个 ID\n每秒 1 次请求\n全部 20 个 SDK 和 API\n社区支持",
    pro_features:
      "包含 Hobby 的全部\n每天 100,000 个 ID\n每秒 10 次请求\n使用分析\n48 小时邮件支持",
    ent_features:
      "包含 Professional 的全部\n你自己的私有、自托管 PUID\n自定义域名\n无限 ID 和速率\nSSO / SAML 和审计日志\n24 小时邮件和电话支持，含 SLA",
    popular: "热门",
    get_started: "开始使用",
    upgrade_cta: "升级",
    no_password: "没有密码，我们也不发邮件——你的提供商已经验证了你。",
    api_key: "API 密钥",
    shown_once: "仅显示一次",
    join_intro:
      "一个可重复使用的加入码。任何持有它的人都能加入此账户。随时轮换它——旧码会停止工作。或撤销它以关闭加入。",
    rotate: "轮换",
    revoke: "撤销（关闭加入）",
    share_email: "✉️ 通过邮件分享",
    joining_disabled: "加入当前已关闭——没有有效的码。",
    owners_only: "只有账户所有者才能管理加入码。",
    key_saved: "保存好它——我们做了哈希，无法再次显示。",
    revoke_action: "撤销",
    authorized_apps: "已授权的应用",
    apps_desc: "你已授权其代表此账户生成 ID 的应用（通过 OAuth）。随时撤销。",
    no_apps: "没有已授权的应用。",
    usage_title: "用量",
    usage_total: "总计",
    bucket_minute: "每分钟",
    bucket_hour: "每小时",
    bucket_day: "每天",
    no_usage: "尚未生成任何 ID。",
    join_code_label: "加入码：",
    join_link_label: "加入链接：",
    why_title: "好吧，这是个玩笑。",
    why_lead:
      "PUID 是一种极其过度构建的发放数字的方式。但「可证明唯一」这部分是真的。下面是它实际的工作原理。",
    why_h1: "它只是个计数器",
    why_b1:
      "在底层，PUID 只是计数。1、2、3，依此类推。而 UUIDv4 是随机的，所以只是大概率唯一。如果你生成得足够多，两个可能会一样。",
    why_b1b:
      "平心而论，这几乎从不发生。随机 UUID 适用于 99.999999% 的应用。你得生成数十亿个，碰撞才值得担心。在现实中 UUID 很棒。计数器只是更容易推理，因为它从不重复。唯一的问题是数字 3 是个相当无聊的 ID。",
    why_h2: "所以我把计数器藏起来",
    why_b2:
      "我拿到计数器，让它经过一个小密码（128 位的 Feistel 置换），然后用 base62 编码。置换只是把数字打乱。每个输入都得到不同的输出，且绝不会有两个输入落到同一个输出。因此 ID 永远不会冲突，而且看起来仍然随机。和计数器一样的唯一性，但现在看起来像真正的 ID。",
    why_sample: "#1 变成 64qAN39GjJh5kbi4HROOxh。#2 变成 7U17bzw0MO3mzwuFKO7cc0。",
    why_h3: "它能自我解码",
    why_b3:
      "这个密码也能反向运行。所以 <code>GET /api/v1/ordinal/&lt;id&gt;</code> 能把任何 PUID 变回它的计数器值。这证明 ID <code>64qAN39Gj...</code> 其实就是 #1。这也意味着任何人都能解码一个 ID 并读出它的数字，而这个数字就是它被创建时我们已发放的 ID 数量。所以不，请不要在生产中使用它。",
    why_h4: "为什么为一个计数器构建这一切？",
    why_b4:
      '主要是为了好玩，也想看看这个玩笑能走多远。这里有一个完整的 OAuth2 服务器、用 Google 和 Microsoft 登录、团队、20 个 SDK、一个 Postgres 扩展、20 种语言，以及三套测试。这一切都只是为了用更漂亮的包装返回 <code>i++</code>。如果你喜欢这类东西，<a class="text-indigo-600 dark:text-indigo-400" href="https://bio.jtwebman.com" target="_blank" rel="noopener">在我的社交媒体上关注我</a>。',
  },
  ja: {
    hero_note: "永久無料プラン · クレジットカード不要 · 公式 SDK 20 種",
    stat_collisions_n: "0",
    stat_collisions_l: "件の衝突、未来永劫",
    stat_keyspace_n: "2¹²⁸",
    stat_keyspace_l: "識別子のキースペース",
    stat_uptime_n: "99.99%",
    stat_uptime_l: "稼働率 SLA",
    stat_sdks_n: "20",
    stat_sdks_l: "種の公式 SDK",
    features_title: "もう二度と衝突しないための、すべてがここに",
    features_sub:
      "完結した識別子プラットフォーム——中核の数学から、それを取り巻く SDK、チーム機能、分析まで。",
    feat_unique_t: "衝突しないことを証明済み",
    feat_unique_b:
      "天文学的に低い確率ではありません。数学的に不可能なのです。すべての id は確率ではなく証明によって一意であることが保証されます。",
    feat_random_t: "不透明で URL セーフ",
    feat_random_b:
      "高エントロピーの base62 識別子は、何も漏らしません——あなたのデータも、規模も、識別子どうしの関係も。",
    feat_edge_t: "edge から配信",
    feat_edge_b:
      "Cloudflare のグローバルネットワーク上で稼働し、世界数百都市でユーザーのすぐそばに。どこでも、はじめから高速です。",
    feat_oauth_t: "OAuth2 と SSO を標準搭載",
    feat_oauth_b:
      "本格的な認可サーバー。Google でサインインし、アプリにスコープを絞ったアクセスを委譲し、いつでも取り消せます。",
    feat_sdk_t: "公式 SDK 20 種",
    feat_sdk_b:
      "OpenAPI 仕様から生成され、API とともにバージョン管理されます——さらにテーブル id 用のネイティブ PostgreSQL 拡張も。",
    feat_team_t: "チームのために",
    feat_team_b:
      "マルチテナントのアカウント、利用状況分析、ローテーション可能な API キー、再利用・取り消し可能な参加コード。",
    how_title: "60 秒で立ち上げて稼働",
    how_sub: "調達手続きも商談も不要。サインインして、すぐにリリース。",
    step1_t: "アカウントを作成",
    step1_b: "Google でサインイン。管理するパスワードも、入力するクレジットカードもありません。",
    step2_t: "API キーを発行",
    step2_b: "ダッシュボードでキーを生成。いつでもローテーションや取り消しができます。",
    step3_t: "API を呼び出す",
    step3_b:
      "1 回のリクエストで最大 10 個の id が返ります。お使いの言語の SDK を組み込めば、それで完了です。",
    loved_title: "正しさにこだわるエンジニアたちへ",
    quote1: "UUIDv4 を置き換えて以来、衝突は一度も見ていません。ただの一度も。",
    name1: "Dana R.",
    role1: "スタッフエンジニア",
    quote2:
      "ようやく、確率でごまかすのではなく、コードレビューで一意性を証明できる識別子に出会えました。",
    name2: "Marcus L.",
    role2: "バックエンドリード",
    quote3: "Postgres 拡張は午後のうちにスキーマへ組み込めました。本当にそのまま動きます。",
    name3: "Priya N.",
    role3: "プラットフォームエンジニア",
    cta_title: "一意性を運任せにするのは、もうやめましょう。",
    cta_sub: "証明できる一意の識別子を生成するチームに、今すぐ参加を。",
    nav_docs: "API ドキュメント",
    nav_dashboard: "ダッシュボード",
    nav_metrics: "メトリクス",
    guarantee_title: "証明可能な 100% 衝突なし",
    random_title: "完全にランダムに見える",
    ratelimit_title: "厳しいレート制限",
    pricing: "料金",
    generate: "生成",
    account: "アカウント",
    members: "メンバー",
    signin_google: "Google でログイン",
    signin_microsoft: "Microsoft でログイン",
    signin_prompt: "ログインしてキーを作成し ID を生成します。",
    footer: "冗談です。証明可能に一意。使用しないでください。",
    foot_rights: "無断転載禁止。",
    foot_why: "なぜ？",
    foot_terms: "利用規約",
    foot_privacy: "プライバシー",
    language: "言語",
    theme: "テーマ",
    theme_auto: "自動",
    theme_light: "ライト",
    theme_dark: "ダーク",
    new_account: "+ 新規アカウント",
    mint_key: "キーを作成",
    team: "チーム",
    generate_code: "招待コードを生成",
    hero_sub: "世界に欠けていた、証明可能に一意なID！",
    hero_desc:
      "UUIDは一意性を運任せにします——2つが衝突する確率は常にゼロではありません。PUIDは独自の特許出願中の一意性エンジンを活用し、ウェブスケールで決定論的かつ衝突のない識別子を提供します。クラウドネイティブ、エンタープライズグレード、そして設計上、証明可能に一意です。どうやって？それは企業秘密です。",
    get_api_key: "APIキーを取得",
    guarantee_body:
      "一意性が運に委ねられることは決してありません。各識別子は確率ではなく数学的証明によって区別が保証されます。衝突ゼロ、今日も、そして永遠に。",
    random_body:
      "不透明で高エントロピー、URLセーフな識別子は何も明かしません——あなたのデータも、規模も、互いのことも。美しく、推測不可能です。",
    ratelimit_body:
      "組み込みのフェアユース保護により、単一のユーザーがサービスを独占できないようにし、すべての顧客が必要なIDに高速かつ確実にアクセスできます。",
    oe_title: "どれだけ過剰設計か？",
    oe_1: "128ビットのFeistel暗号。",
    oe_2: "完全なOAuth2認可サーバー——アプリが数字を受け取る許可を正式に付与されるように。",
    oe_3: "GoogleまたはMicrosoftでサインイン——最も安全なエンタープライズIDプロバイダーからのSSO。",
    oe_4: "マルチテナントのチーム：ユーザーごとに複数のアカウント、再利用可能で取り消し可能な参加コード。",
    oe_5: "OpenAPI仕様から生成された20のクライアントSDK。",
    oe_6: "これらをテーブルIDとして自動生成できるPostgreSQL拡張。",
    oe_7: "このマーケティングサイト、20言語、ライトとダークのテーマ付き。",
    oe_8: "ユニット、フルシステム、実ブラウザのテストスイート。だからどのデプロイも常に動きます。",
    quickstart: "クイックスタート",
    get_key: "ダッシュボードでキーを取得。OpenAPI仕様から生成された20言語のSDK。",
    enterprise_note: "セルフホスト型の無制限IDシステム。",
    hobby_features: "1日1,000 ID\n1秒あたり1リクエスト\n20すべてのSDKとAPI\nコミュニティサポート",
    pro_features:
      "Hobbyのすべて\n1日100,000 ID\n1秒あたり10リクエスト\n利用状況の分析\n48時間以内のメールサポート",
    ent_features:
      "Professionalのすべて\nあなた専用のプライベートなセルフホスト型PUID\nカスタムドメイン名\n無制限のIDとレート\nSSO / SAMLと監査ログ\n24時間以内のメールと電話のサポート、SLA付き",
    popular: "人気",
    get_started: "始める",
    upgrade_cta: "アップグレード",
    no_password:
      "パスワードなし、当社からのメールもなし——プロバイダーがすでにあなたを確認済みです。",
    api_key: "APIキー",
    shown_once: "一度だけ表示",
    join_intro:
      "再利用可能な参加コードが1つ。持っている人は誰でもこのアカウントに参加できます。いつでもローテーションを——古いコードは動かなくなります。または取り消して参加を無効にします。",
    rotate: "ローテーション",
    revoke: "取り消す（参加を無効化）",
    share_email: "✉️ メールで共有",
    joining_disabled: "現在、参加は無効です——有効なコードがありません。",
    owners_only: "参加コードを管理できるのはアカウント所有者のみです。",
    key_saved: "保存してください——ハッシュ化しているため再表示できません。",
    revoke_action: "取り消す",
    authorized_apps: "認可済みアプリ",
    apps_desc:
      "このアカウントに代わってIDを生成する許可を与えたアプリ（OAuth経由）。いつでも取り消せます。",
    no_apps: "認可済みのアプリはありません。",
    usage_title: "使用状況",
    usage_total: "合計",
    bucket_minute: "1分あたり",
    bucket_hour: "1時間あたり",
    bucket_day: "1日あたり",
    no_usage: "まだIDは生成されていません。",
    join_code_label: "参加コード：",
    join_link_label: "参加リンク：",
    why_title: "はい、これはジョークです。",
    why_lead:
      "PUIDは、数字を配るための極端に作り込まれた方法です。でも「証明可能に一意」は本当です。実際の仕組みはこうです。",
    why_h1: "ただのカウンターです",
    why_b1:
      "内部では、PUIDはただ数えています。1、2、3、と続きます。一方UUIDv4はランダムなので、おそらく一意なだけです。十分に生成すれば、2つが同じになることがあります。",
    why_b1b:
      "公平に言うと、それはほとんど起きません。ランダムなUUIDはアプリの99.999999%に十分です。衝突を心配する価値が出るまでには数十億個を生成する必要があります。実際にはUUIDは素晴らしいです。カウンターは決して繰り返さないので、単に考えやすいだけです。唯一の問題は、数字の3がかなり退屈なIDだということです。",
    why_h2: "そこでカウンターを隠します",
    why_b2:
      "カウンターを取り出し、小さな暗号（128ビットのFeistel置換）に通してから、base62でエンコードします。置換は数字をかき混ぜるだけです。各入力は異なる出力になり、2つの入力が同じ出力に落ちることは決してありません。だからIDは決して衝突せず、それでもランダムに見えます。カウンターと同じ一意性ですが、今や本物のIDのように見えます。",
    why_sample: "#1は64qAN39GjJh5kbi4HROOxhになります。#2は7U17bzw0MO3mzwuFKO7cc0になります。",
    why_h3: "自分自身をデコードできます",
    why_b3:
      "暗号は逆向きにも動きます。だから <code>GET /api/v1/ordinal/&lt;id&gt;</code> はどのPUIDもそのカウンター値に戻します。これはID <code>64qAN39Gj...</code> が実は #1 にすぎなかったことを証明します。つまり誰でもIDをデコードしてその数字を読め、その数字は作成時点で配ったIDの数です。だから、いいえ、これを本番で使わないでください。",
    why_h4: "なぜカウンターのためにこれ全部を作るのか？",
    why_b4:
      '主に楽しみのため、そしてジョークがどこまで行けるか見るためです。完全なOAuth2サーバー、GoogleとMicrosoftでのサインイン、チーム、20のSDK、Postgres拡張、20言語、3つのテストスイートがあります。すべては <code>i++</code> をもっと素敵な包みで返すためです。こういうのが好きなら、<a class="text-indigo-600 dark:text-indigo-400" href="https://bio.jtwebman.com" target="_blank" rel="noopener">私のSNSをフォローしてください</a>。',
  },
  ko: {
    hero_note: "평생 무료 요금제 · 신용카드 불필요 · 공식 SDK 20종",
    stat_collisions_n: "0",
    stat_collisions_l: "건의 충돌, 영원히",
    stat_keyspace_n: "2¹²⁸",
    stat_keyspace_l: "식별자 키스페이스",
    stat_uptime_n: "99.99%",
    stat_uptime_l: "가동 시간 SLA",
    stat_sdks_n: "20",
    stat_sdks_l: "종의 공식 SDK",
    features_title: "다시는 충돌하지 않기 위한 모든 것",
    features_sub: "완결된 식별자 플랫폼——핵심의 수학에서부터 그것을 둘러싼 SDK, 팀 기능, 분석까지.",
    feat_unique_t: "충돌하지 않음을 증명",
    feat_unique_b:
      "천문학적으로 희박한 게 아닙니다. 수학적으로 불가능합니다. 모든 id는 확률이 아니라 증명으로 고유함이 보장됩니다.",
    feat_random_t: "불투명하고 URL 안전",
    feat_random_b:
      "엔트로피가 높은 base62 식별자는 아무것도 드러내지 않습니다——당신의 데이터도, 규모도, 식별자 간의 관계도.",
    feat_edge_t: "edge에서 제공",
    feat_edge_b:
      "Cloudflare의 글로벌 네트워크에서 수백 개 도시에 걸쳐 사용자 가까이에서 실행됩니다. 어디서나, 기본적으로 빠릅니다.",
    feat_oauth_t: "OAuth2와 SSO 기본 내장",
    feat_oauth_b:
      "완전한 인가 서버. Google로 로그인하고, 앱에 범위가 제한된 액세스를 위임하며, 언제든 취소할 수 있습니다.",
    feat_sdk_t: "공식 SDK 20종",
    feat_sdk_b:
      "OpenAPI 명세에서 생성되어 API와 함께 버전이 관리됩니다——여기에 테이블 id용 네이티브 PostgreSQL 확장까지.",
    feat_team_t: "팀을 위한 설계",
    feat_team_b:
      "멀티 테넌트 계정, 사용량 분석, 교체 가능한 API 키, 재사용 및 취소 가능한 참여 코드.",
    how_title: "60초 만에 바로 시작",
    how_sub: "구매 절차도, 영업 상담도 없습니다. 로그인하고 바로 배포하세요.",
    step1_t: "계정 만들기",
    step1_b: "Google로 로그인하세요. 관리할 비밀번호도, 입력할 신용카드도 없습니다.",
    step2_t: "API 키 발급",
    step2_b: "대시보드에서 키를 생성하세요. 원할 때 언제든 교체하거나 취소할 수 있습니다.",
    step3_t: "API 호출",
    step3_b: "한 번의 요청으로 최대 10개의 id가 반환됩니다. 사용하는 언어의 SDK를 넣으면 끝입니다.",
    loved_title: "정확성을 중시하는 엔지니어들의 선택",
    quote1: "UUIDv4를 교체한 뒤로 충돌을 단 한 번도 보지 못했습니다. 단 한 번도요.",
    name1: "Dana R.",
    role1: "스태프 엔지니어",
    quote2:
      "마침내 확률에 기대 얼버무리는 대신, 코드 리뷰에서 고유함을 증명할 수 있는 식별자를 얻었습니다.",
    name2: "Marcus L.",
    role2: "백엔드 리드",
    quote3: "Postgres 확장은 오후 한나절 만에 우리 스키마에 들어왔습니다. 그냥 잘 작동합니다.",
    name3: "Priya N.",
    role3: "플랫폼 엔지니어",
    cta_title: "고유성을 운에 맡기는 일은 그만두세요.",
    cta_sub: "증명 가능한 고유 식별자를 생성하는 팀에 지금 합류하세요.",
    nav_docs: "API 문서",
    nav_dashboard: "대시보드",
    nav_metrics: "지표",
    guarantee_title: "증명 가능한 100% 충돌 없음",
    random_title: "완전히 무작위처럼 보임",
    ratelimit_title: "엄격한 속도 제한",
    pricing: "요금",
    generate: "생성",
    account: "계정",
    members: "구성원",
    signin_google: "Google로 로그인",
    signin_microsoft: "Microsoft로 로그인",
    signin_prompt: "로그인하여 키를 만들고 ID를 생성하세요.",
    footer: "농담입니다. 증명 가능하게 고유함. 사용하지 마세요.",
    foot_rights: "모든 권리 보유.",
    foot_why: "왜?",
    foot_terms: "약관",
    foot_privacy: "개인정보",
    language: "언어",
    theme: "테마",
    theme_auto: "자동",
    theme_light: "라이트",
    theme_dark: "다크",
    new_account: "+ 새 계정",
    mint_key: "키 생성",
    team: "팀",
    generate_code: "초대 코드 생성",
    hero_sub: "세상에 없던, 증명 가능하게 고유한 ID!",
    hero_desc:
      "UUID는 고유성을 운에 맡깁니다 — 둘이 충돌할 확률이 항상 0은 아닙니다. PUID는 독자적인 특허 출원 중 고유성 엔진을 활용해 웹 스케일에서 결정론적이고 충돌 없는 식별자를 제공합니다. 클라우드 네이티브, 엔터프라이즈급, 그리고 설계상 증명 가능하게 고유합니다. 어떻게요? 그건 우리의 비밀 소스입니다.",
    get_api_key: "API 키 받기",
    guarantee_body:
      "고유성은 결코 운에 맡기지 않습니다. 모든 식별자는 확률이 아니라 수학적 증명으로 서로 다름이 보장됩니다. 충돌 0, 오늘도 그리고 영원히.",
    random_body:
      "불투명하고 높은 엔트로피의 URL 안전 식별자로, 아무것도 드러내지 않습니다 — 당신의 데이터도, 규모도, 서로도. 아름답고 추측할 수 없습니다.",
    ratelimit_body:
      "내장된 공정 사용 보호는 단일 사용자가 서비스를 독점하지 못하게 하여, 모든 고객이 필요한 ID에 빠르고 안정적으로 접근할 수 있게 합니다.",
    oe_title: "얼마나 과도하게 설계되었나?",
    oe_1: "128비트 Feistel 암호.",
    oe_2: "완전한 OAuth2 인가 서버 — 그래서 앱이 숫자를 받을 권한을 공식적으로 부여받을 수 있습니다.",
    oe_3: "Google 또는 Microsoft로 로그인 — 가장 안전한 엔터프라이즈 ID 제공업체의 SSO.",
    oe_4: "멀티테넌트 팀: 사용자당 여러 계정, 재사용 가능하고 철회 가능한 가입 코드.",
    oe_5: "OpenAPI 명세에서 생성된 20개의 클라이언트 SDK.",
    oe_6: "이것들을 테이블 ID로 자동 생성하게 해주는 PostgreSQL 확장.",
    oe_7: "이 마케팅 사이트, 20개 언어, 라이트와 다크 테마 포함.",
    oe_8: "유닛, 풀 시스템, 실제 브라우저 테스트 스위트. 그래서 모든 배포가 항상 작동합니다.",
    quickstart: "빠른 시작",
    get_key: "대시보드에서 키를 받으세요. OpenAPI 명세에서 생성된 20개 언어의 SDK.",
    enterprise_note: "자체 호스팅, 무제한 ID 시스템.",
    hobby_features: "하루 1,000개 ID\n초당 1회 요청\n20개 SDK 전부와 API\n커뮤니티 지원",
    pro_features:
      "Hobby의 모든 것\n하루 100,000개 ID\n초당 10회 요청\n사용 분석\n48시간 이메일 지원",
    ent_features:
      "Professional의 모든 것\n당신만의 비공개 자체 호스팅 PUID\n맞춤 도메인 이름\n무제한 ID와 속도\nSSO / SAML 및 감사 로그\n24시간 이메일 및 전화 지원, SLA 포함",
    popular: "인기",
    get_started: "시작하기",
    upgrade_cta: "업그레이드",
    no_password:
      "비밀번호 없음, 저희가 보내는 이메일도 없음 — 제공업체가 이미 당신을 확인했습니다.",
    api_key: "API 키",
    shown_once: "한 번만 표시됨",
    join_intro:
      "재사용 가능한 가입 코드 하나. 가진 사람은 누구나 이 계정에 가입할 수 있습니다. 언제든 교체하세요 — 이전 코드는 작동을 멈춥니다. 또는 철회해 가입을 끕니다.",
    rotate: "교체",
    revoke: "철회 (가입 끄기)",
    share_email: "✉️ 이메일로 공유",
    joining_disabled: "현재 가입이 비활성화됨 — 활성 코드가 없습니다.",
    owners_only: "가입 코드는 계정 소유자만 관리할 수 있습니다.",
    key_saved: "저장하세요 — 해시 처리하므로 다시 보여줄 수 없습니다.",
    revoke_action: "철회",
    authorized_apps: "승인된 앱",
    apps_desc: "이 계정을 대신해 ID를 생성하도록 권한을 부여한 앱(OAuth 통해). 언제든 철회하세요.",
    no_apps: "승인된 앱이 없습니다.",
    usage_title: "사용량",
    usage_total: "총계",
    bucket_minute: "분당",
    bucket_hour: "시간당",
    bucket_day: "일당",
    no_usage: "아직 생성된 ID가 없습니다.",
    join_code_label: "가입 코드:",
    join_link_label: "가입 링크:",
    why_title: "네, 농담입니다.",
    why_lead:
      'PUID는 숫자를 나눠주는 지나치게 과하게 만든 방법입니다. 하지만 "증명 가능하게 고유"하다는 부분은 진짜입니다. 실제로 어떻게 작동하는지 보겠습니다.',
    why_h1: "그냥 카운터입니다",
    why_b1:
      "내부적으로 PUID는 그냥 셉니다. 1, 2, 3, 이런 식으로요. 반면 UUIDv4는 무작위라서 아마도 고유할 뿐입니다. 충분히 많이 생성하면 둘이 같게 나올 수 있습니다.",
    why_b1b:
      "솔직히 말하면 그런 일은 거의 없습니다. 무작위 UUID는 앱의 99.999999%에 충분합니다. 충돌이 걱정할 가치가 생기려면 수십억 개를 생성해야 합니다. 현실에서 UUID는 훌륭합니다. 카운터는 절대 반복되지 않아서 그냥 추론하기 더 쉬울 뿐입니다. 유일한 문제는 숫자 3이 꽤 지루한 ID라는 것입니다.",
    why_h2: "그래서 카운터를 숨깁니다",
    why_b2:
      "카운터를 가져와 작은 암호(128비트 Feistel 순열)에 통과시킨 다음 base62로 인코딩합니다. 순열은 그저 숫자를 뒤섞습니다. 모든 입력은 서로 다른 출력을 내고, 두 입력이 같은 출력에 떨어지는 일은 결코 없습니다. 그래서 ID는 절대 충돌하지 않으면서도 여전히 무작위로 보입니다. 카운터와 같은 고유성이지만 이제 진짜 ID처럼 보입니다.",
    why_sample: "#1은 64qAN39GjJh5kbi4HROOxh가 됩니다. #2는 7U17bzw0MO3mzwuFKO7cc0가 됩니다.",
    why_h3: "스스로 디코딩할 수 있습니다",
    why_b3:
      "암호는 역방향으로도 작동합니다. 그래서 <code>GET /api/v1/ordinal/&lt;id&gt;</code> 는 어떤 PUID든 그 카운터 값으로 되돌립니다. 이는 ID <code>64qAN39Gj...</code> 가 사실 그냥 #1이었음을 증명합니다. 또한 누구나 ID를 디코딩해 그 숫자를 읽을 수 있고, 그 숫자는 그것이 만들어졌을 때 우리가 나눠준 ID 개수라는 뜻입니다. 그러니 아니요, 이것을 프로덕션에서 쓰지 마세요.",
    why_h4: "카운터 하나를 위해 왜 이걸 다 만들었나?",
    why_b4:
      '대부분 재미로, 그리고 이 농담이 어디까지 갈 수 있는지 보려고요. 완전한 OAuth2 서버, Google과 Microsoft 로그인, 팀, 20개 SDK, Postgres 확장, 20개 언어, 그리고 세 개의 테스트 스위트가 있습니다. 이 모든 게 <code>i++</code> 를 더 예쁜 포장으로 돌려주기 위한 것입니다. 이런 걸 좋아하신다면, <a class="text-indigo-600 dark:text-indigo-400" href="https://bio.jtwebman.com" target="_blank" rel="noopener">제 소셜을 팔로우하세요</a>.',
  },
  vi: {
    hero_note: "Gói miễn phí trọn đời · Không cần thẻ tín dụng · 20 SDK chính thức",
    stat_collisions_n: "0",
    stat_collisions_l: "lần trùng lặp, mãi mãi",
    stat_keyspace_n: "2¹²⁸",
    stat_keyspace_l: "không gian khóa định danh",
    stat_uptime_n: "99.99%",
    stat_uptime_l: "SLA thời gian hoạt động",
    stat_sdks_n: "20",
    stat_sdks_l: "SDK chính thức",
    features_title: "Mọi thứ bạn cần để không bao giờ trùng lặp nữa",
    features_sub:
      "Một nền tảng định danh hoàn chỉnh — từ phần toán học ở lõi đến các SDK, đội nhóm và phân tích xoay quanh nó.",
    feat_unique_t: "Chứng minh được là không trùng lặp",
    feat_unique_b:
      "Không phải khó xảy ra đến mức thiên văn. Mà là bất khả thi về mặt toán học. Mỗi id được đảm bảo khác biệt bằng chứng minh, không phải bằng xác suất.",
    feat_random_t: "Mờ đục và an toàn cho URL",
    feat_random_b:
      "Các định danh base62 có entropy cao, không tiết lộ điều gì — không phải dữ liệu của bạn, không phải quy mô của bạn, cũng không phải lẫn nhau.",
    feat_edge_t: "Phục vụ từ edge",
    feat_edge_b:
      "Chạy trên mạng lưới toàn cầu của Cloudflare, gần với người dùng của bạn tại hàng trăm thành phố. Nhanh ở mọi nơi, theo mặc định.",
    feat_oauth_t: "Tích hợp sẵn OAuth2 và SSO",
    feat_oauth_b:
      "Một máy chủ ủy quyền đầy đủ. Đăng nhập bằng Google, cấp quyền truy cập giới hạn cho ứng dụng, và thu hồi bất cứ lúc nào.",
    feat_sdk_t: "20 SDK chính thức",
    feat_sdk_b:
      "Được tạo từ đặc tả OpenAPI của chúng tôi và đánh phiên bản cùng với API — kèm theo một tiện ích mở rộng PostgreSQL gốc cho id của bảng.",
    feat_team_t: "Xây dựng cho đội nhóm",
    feat_team_b:
      "Tài khoản đa người thuê, phân tích mức sử dụng, khóa API có thể luân chuyển, và mã tham gia tái sử dụng được có thể thu hồi.",
    how_title: "Khởi chạy trong 60 giây",
    how_sub: "Không thủ tục mua sắm, không cuộc gọi bán hàng. Đăng nhập và triển khai.",
    step1_t: "Tạo tài khoản của bạn",
    step1_b: "Đăng nhập bằng Google. Không có mật khẩu để quản lý, không có thẻ tín dụng để nhập.",
    step2_t: "Tạo một khóa API",
    step2_b:
      "Tạo một khóa trong bảng điều khiển. Luân chuyển hoặc thu hồi nó bất cứ khi nào bạn muốn.",
    step3_t: "Gọi API",
    step3_b: "Một yêu cầu trả về tối đa 10 id. Thêm một SDK cho ngôn ngữ của bạn và thế là xong.",
    loved_title: "Những kỹ sư coi trọng tính đúng đắn",
    quote1:
      "Chúng tôi đã thay thế UUIDv4 và kể từ đó không thấy một lần trùng lặp nào. Không một lần nào.",
    name1: "Dana R.",
    role1: "Kỹ sư cấp cao",
    quote2:
      "Cuối cùng cũng có những định danh mà tôi có thể chứng minh là duy nhất trong buổi review code thay vì chỉ viện dẫn xác suất.",
    name2: "Marcus L.",
    role2: "Trưởng nhóm Backend",
    quote3:
      "Tiện ích mở rộng Postgres đã được tích hợp vào schema của chúng tôi chỉ trong một buổi chiều. Nó cứ thế hoạt động.",
    name3: "Priya N.",
    role3: "Kỹ sư nền tảng",
    cta_title: "Đừng đánh cược vào tính duy nhất nữa.",
    cta_sub:
      "Hãy gia nhập các đội nhóm đang tạo ra những định danh duy nhất có thể chứng minh ngay hôm nay.",
    nav_docs: "Tài liệu API",
    nav_dashboard: "Bảng điều khiển",
    nav_metrics: "Số liệu",
    guarantee_title: "Chứng minh được không trùng 100%",
    random_title: "Trông hoàn toàn ngẫu nhiên",
    ratelimit_title: "Giới hạn tốc độ nghiêm ngặt",
    pricing: "Giá",
    generate: "Tạo",
    account: "Tài khoản",
    members: "Thành viên",
    signin_google: "Đăng nhập bằng Google",
    signin_microsoft: "Đăng nhập bằng Microsoft",
    signin_prompt: "Đăng nhập để tạo khóa và sinh id.",
    footer: "Một trò đùa. Chứng minh được là duy nhất. Đừng dùng.",
    foot_rights: "Bảo lưu mọi quyền.",
    foot_why: "Tại sao?",
    foot_terms: "Điều khoản",
    foot_privacy: "Quyền riêng tư",
    language: "Ngôn ngữ",
    theme: "Giao diện",
    theme_auto: "Tự động",
    theme_light: "Sáng",
    theme_dark: "Tối",
    new_account: "+ Tài khoản mới",
    mint_key: "Tạo khóa",
    team: "Nhóm",
    generate_code: "Tạo mã mời",
    hero_sub: "ID độc nhất có thể chứng minh mà thế giới còn thiếu!",
    hero_desc:
      "UUID đánh cược vào tính độc nhất — luôn có một xác suất khác không rằng hai cái trùng nhau. PUID khai thác một công cụ độc nhất độc quyền, đang chờ cấp bằng sáng chế, để cung cấp các định danh tất định, không va chạm ở quy mô web. Cloud-native, cấp doanh nghiệp, và độc nhất có thể chứng minh theo thiết kế. Bằng cách nào ư? Đó là bí quyết của chúng tôi.",
    get_api_key: "Lấy khóa API",
    guarantee_body:
      "Tính độc nhất không bao giờ phó mặc cho may rủi. Mỗi định danh được đảm bảo khác biệt bằng chứng minh toán học — không phải xác suất. Không va chạm, hôm nay và mãi mãi.",
    random_body:
      "Các định danh mờ đục, entropy cao, an toàn với URL không tiết lộ gì — không phải dữ liệu, không phải quy mô, cũng không phải lẫn nhau. Đẹp và không thể đoán.",
    ratelimit_body:
      "Bảo vệ sử dụng hợp lý tích hợp ngăn một người dùng độc chiếm dịch vụ, để mọi khách hàng đều có quyền truy cập nhanh, đáng tin cậy vào các id họ cần.",
    oe_title: "Nó được làm quá kỹ đến mức nào?",
    oe_1: "Một mật mã Feistel 128 bit.",
    oe_2: "Một máy chủ ủy quyền OAuth2 đầy đủ — để các ứng dụng có thể chính thức được cấp quyền nhận một con số.",
    oe_3: "Đăng nhập bằng Google hoặc Microsoft — SSO từ các nhà cung cấp danh tính doanh nghiệp an toàn nhất.",
    oe_4: "Nhóm đa thuê bao: nhiều tài khoản mỗi người dùng, mã tham gia tái sử dụng và có thể thu hồi.",
    oe_5: "20 SDK khách, được tạo từ một đặc tả OpenAPI.",
    oe_6: "Một tiện ích mở rộng PostgreSQL cho phép bạn tự động tạo chúng làm id bảng.",
    oe_7: "Trang tiếp thị này, bằng 20 ngôn ngữ, với giao diện sáng và tối.",
    oe_8: "Các bộ kiểm thử đơn vị, toàn hệ thống và trình duyệt thật, để mỗi lần triển khai luôn hoạt động.",
    quickstart: "Bắt đầu nhanh",
    get_key:
      "Lấy khóa trong bảng điều khiển. SDK cho 20 ngôn ngữ, được tạo từ đặc tả OpenAPI của chúng tôi.",
    enterprise_note: "Một hệ thống id tự lưu trữ, không giới hạn.",
    hobby_features: "1.000 id mỗi ngày\n1 yêu cầu mỗi giây\nTất cả 20 SDK và API\nHỗ trợ cộng đồng",
    pro_features:
      "Mọi thứ trong Hobby\n100.000 id mỗi ngày\n10 yêu cầu mỗi giây\nPhân tích sử dụng\nHỗ trợ email trong 48 giờ",
    ent_features:
      "Mọi thứ trong Professional\nPUID riêng tư, tự lưu trữ của riêng bạn\nTên miền tùy chỉnh\nId và tốc độ không giới hạn\nSSO / SAML và nhật ký kiểm toán\nHỗ trợ email và điện thoại trong 24 giờ, kèm SLA",
    popular: "Phổ biến",
    get_started: "Bắt đầu",
    upgrade_cta: "Nâng cấp",
    no_password:
      "Không mật khẩu, không email từ chúng tôi — nhà cung cấp của bạn đã xác minh bạn rồi.",
    api_key: "Khóa API",
    shown_once: "chỉ hiển thị một lần",
    join_intro:
      "Một mã tham gia tái sử dụng. Bất kỳ ai có nó đều có thể tham gia tài khoản này. Xoay nó bất cứ lúc nào — mã cũ ngừng hoạt động. Hoặc thu hồi để tắt việc tham gia.",
    rotate: "Xoay",
    revoke: "Thu hồi (tắt tham gia)",
    share_email: "✉️ Chia sẻ qua email",
    joining_disabled: "Việc tham gia hiện đang tắt — không có mã hoạt động.",
    owners_only: "Chỉ chủ tài khoản mới có thể quản lý mã tham gia.",
    key_saved: "Hãy lưu lại — chúng tôi băm nó và không thể hiển thị lại.",
    revoke_action: "Thu hồi",
    authorized_apps: "Ứng dụng được ủy quyền",
    apps_desc:
      "Các ứng dụng bạn đã cấp quyền tạo id thay mặt tài khoản này (qua OAuth). Thu hồi bất cứ lúc nào.",
    no_apps: "Không có ứng dụng nào được ủy quyền.",
    usage_title: "Mức sử dụng",
    usage_total: "tổng",
    bucket_minute: "Mỗi phút",
    bucket_hour: "Mỗi giờ",
    bucket_day: "Mỗi ngày",
    no_usage: "Chưa tạo id nào.",
    join_code_label: "Mã tham gia:",
    join_link_label: "Liên kết tham gia:",
    why_title: "Được rồi, đây là một trò đùa.",
    why_lead:
      'PUID là một cách cực kỳ phức tạp để phát ra một con số. Nhưng phần "độc nhất có thể chứng minh" là thật. Đây là cách nó thực sự hoạt động.',
    why_h1: "Nó chỉ là một bộ đếm",
    why_b1:
      "Bên dưới, PUID chỉ đếm. 1, 2, 3, và cứ thế. Ngược lại UUIDv4 là ngẫu nhiên, nên chỉ có lẽ là độc nhất. Nếu bạn tạo đủ nhiều, hai cái có thể trùng nhau.",
    why_b1b:
      "Công bằng mà nói, điều đó gần như không bao giờ xảy ra. Một UUID ngẫu nhiên là ổn cho 99,999999% ứng dụng. Bạn sẽ phải tạo hàng tỷ cái trước khi một va chạm đáng để lo. Trong thực tế UUID rất tuyệt. Bộ đếm chỉ đơn giản là dễ suy luận hơn, vì nó không bao giờ lặp lại. Vấn đề duy nhất là số 3 là một id khá nhàm chán.",
    why_h2: "Vì vậy tôi giấu bộ đếm đi",
    why_b2:
      "Tôi lấy bộ đếm và cho nó qua một mật mã nhỏ (một hoán vị Feistel 128 bit), rồi mã hóa bằng base62. Một hoán vị chỉ xáo trộn các con số. Mỗi đầu vào cho một đầu ra khác nhau, và không bao giờ có hai đầu vào rơi vào cùng một đầu ra. Vì vậy các id không bao giờ có thể va chạm, mà vẫn trông ngẫu nhiên. Cùng tính độc nhất như một bộ đếm, nhưng giờ trông như một id thật.",
    why_sample: "#1 trở thành 64qAN39GjJh5kbi4HROOxh. #2 trở thành 7U17bzw0MO3mzwuFKO7cc0.",
    why_h3: "Nó có thể tự giải mã",
    why_b3:
      "Mật mã cũng chạy ngược. Vì vậy <code>GET /api/v1/ordinal/&lt;id&gt;</code> biến bất kỳ PUID nào trở lại giá trị bộ đếm của nó. Điều đó chứng minh id <code>64qAN39Gj...</code> thực ra chỉ là #1. Nó cũng có nghĩa là bất kỳ ai cũng có thể giải mã một id và đọc con số của nó, và con số đó là số id chúng tôi đã phát khi nó được tạo. Vì vậy không, đừng dùng cái này trong sản xuất.",
    why_h4: "Tại sao xây dựng tất cả những thứ này cho một bộ đếm?",
    why_b4:
      'Chủ yếu để cho vui, và để xem trò đùa này đi xa đến đâu. Có một máy chủ OAuth2 đầy đủ, đăng nhập bằng Google và Microsoft, nhóm, 20 SDK, một tiện ích Postgres, 20 ngôn ngữ và ba bộ kiểm thử. Tất cả chỉ để trả về <code>i++</code> trong một lớp bọc đẹp hơn. Nếu bạn thích kiểu này, <a class="text-indigo-600 dark:text-indigo-400" href="https://bio.jtwebman.com" target="_blank" rel="noopener">theo dõi tôi trên mạng xã hội của tôi</a>.',
  },
  id: {
    hero_note: "Paket gratis selamanya · Tanpa perlu kartu kredit · 20 SDK resmi",
    stat_collisions_n: "0",
    stat_collisions_l: "tabrakan, selamanya",
    stat_keyspace_n: "2¹²⁸",
    stat_keyspace_l: "ruang kunci pengidentifikasi",
    stat_uptime_n: "99.99%",
    stat_uptime_l: "SLA waktu aktif",
    stat_sdks_n: "20",
    stat_sdks_l: "SDK resmi",
    features_title: "Semua yang Anda butuhkan agar tidak pernah bertabrakan lagi",
    features_sub:
      "Platform pengidentifikasi yang lengkap — dari matematika di intinya hingga SDK, tim, dan analitik di sekelilingnya.",
    feat_unique_t: "Terbukti bebas tabrakan",
    feat_unique_b:
      "Bukan sekadar mustahil secara astronomis. Tapi mustahil secara matematis. Setiap id dijamin unik berdasarkan bukti, bukan probabilitas.",
    feat_random_t: "Tertutup dan aman untuk URL",
    feat_random_b:
      "Pengidentifikasi base62 dengan entropi tinggi yang tidak membocorkan apa pun — bukan data Anda, bukan skala Anda, bukan pula satu sama lain.",
    feat_edge_t: "Disajikan dari edge",
    feat_edge_b:
      "Berjalan di jaringan global Cloudflare, dekat dengan pengguna Anda di ratusan kota. Cepat di mana saja, secara bawaan.",
    feat_oauth_t: "OAuth2 dan SSO bawaan",
    feat_oauth_b:
      "Server otorisasi yang lengkap. Masuk dengan Google, delegasikan akses bercakupan ke aplikasi, dan cabut kapan saja.",
    feat_sdk_t: "20 SDK resmi",
    feat_sdk_b:
      "Dihasilkan dari spesifikasi OpenAPI kami dan diberi versi seiring API — plus ekstensi PostgreSQL native untuk id tabel.",
    feat_team_t: "Dibuat untuk tim",
    feat_team_b:
      "Akun multi-tenant, analitik penggunaan, kunci API yang dapat dirotasi, dan kode gabung yang dapat digunakan ulang serta dicabut.",
    how_title: "Siap berjalan dalam 60 detik",
    how_sub: "Tanpa pengadaan, tanpa panggilan penjualan. Masuk dan luncurkan.",
    step1_t: "Buat akun Anda",
    step1_b:
      "Masuk dengan Google. Tidak ada kata sandi untuk dikelola, tidak ada kartu kredit untuk dimasukkan.",
    step2_t: "Buat kunci API",
    step2_b: "Hasilkan kunci di dasbor. Rotasi atau cabut kapan pun Anda mau.",
    step3_t: "Panggil API",
    step3_b:
      "Satu permintaan mengembalikan hingga 10 id. Tambahkan SDK untuk bahasa Anda dan selesai.",
    loved_title: "Para insinyur yang peduli pada ketepatan",
    quote1: "Kami mengganti UUIDv4 dan sejak itu tidak melihat satu pun tabrakan. Tidak satu pun.",
    name1: "Dana R.",
    role1: "Staff Engineer",
    quote2:
      "Akhirnya, pengidentifikasi yang bisa saya buktikan unik dalam tinjauan kode alih-alih sekadar mengandalkan probabilitas.",
    name2: "Marcus L.",
    role2: "Backend Lead",
    quote3: "Ekstensi Postgres terpasang ke skema kami hanya dalam satu sore. Langsung berfungsi.",
    name3: "Priya N.",
    role3: "Platform Engineer",
    cta_title: "Berhenti berjudi pada keunikan.",
    cta_sub:
      "Bergabunglah dengan tim-tim yang menghasilkan pengidentifikasi unik yang terbukti hari ini.",
    nav_docs: "Dokumentasi API",
    nav_dashboard: "Dasbor",
    nav_metrics: "Metrik",
    guarantee_title: "Terbukti 100% bebas tabrakan",
    random_title: "Terlihat sepenuhnya acak",
    ratelimit_title: "Dibatasi laju ketat",
    pricing: "Harga",
    generate: "Hasilkan",
    account: "Akun",
    members: "Anggota",
    signin_google: "Masuk dengan Google",
    signin_microsoft: "Masuk dengan Microsoft",
    signin_prompt: "Masuk untuk membuat kunci dan menghasilkan id.",
    footer: "Lelucon. Terbukti unik. Jangan gunakan ini.",
    foot_rights: "Hak cipta dilindungi.",
    foot_why: "Mengapa?",
    foot_terms: "Ketentuan",
    foot_privacy: "Privasi",
    language: "Bahasa",
    theme: "Tema",
    theme_auto: "Otomatis",
    theme_light: "Terang",
    theme_dark: "Gelap",
    new_account: "+ Akun baru",
    mint_key: "Buat kunci",
    team: "Tim",
    generate_code: "Buat kode undangan",
    hero_sub: "ID unik yang terbukti, yang dunia lewatkan!",
    hero_desc:
      "UUID bertaruh pada keunikan — selalu ada peluang bukan nol bahwa dua bertabrakan. PUID memanfaatkan mesin keunikan milik sendiri yang sedang menunggu paten untuk memberikan pengidentifikasi deterministik dan bebas tabrakan dalam skala web. Cloud-native, kelas enterprise, dan terbukti unik secara desain. Bagaimana? Itu resep rahasia kami.",
    get_api_key: "Dapatkan kunci API",
    guarantee_body:
      "Keunikan tidak pernah diserahkan pada keberuntungan. Setiap pengidentifikasi dijamin berbeda melalui bukti matematis — bukan probabilitas. Nol tabrakan, hari ini dan selamanya.",
    random_body:
      "Pengidentifikasi yang buram, ber-entropi tinggi, dan aman untuk URL yang tidak mengungkapkan apa pun — bukan data Anda, bukan skala Anda, bukan satu sama lain. Indah dan tidak bisa ditebak.",
    ratelimit_body:
      "Perlindungan penggunaan wajar bawaan mencegah satu pengguna memonopoli layanan, sehingga setiap pelanggan mendapat akses cepat dan andal ke id yang mereka butuhkan.",
    oe_title: "Seberapa over-engineered ini?",
    oe_1: "Sebuah sandi Feistel 128-bit.",
    oe_2: "Server otorisasi OAuth2 lengkap — agar aplikasi dapat secara resmi diberi izin menerima sebuah angka.",
    oe_3: "Masuk dengan Google atau Microsoft — SSO dari penyedia identitas enterprise paling aman.",
    oe_4: "Tim multi-tenant: banyak akun per pengguna, kode gabung yang dapat digunakan ulang dan dicabut.",
    oe_5: "20 SDK klien, dibuat dari spesifikasi OpenAPI.",
    oe_6: "Ekstensi PostgreSQL yang memungkinkan Anda membuatnya otomatis sebagai id tabel.",
    oe_7: "Situs pemasaran ini, dalam 20 bahasa, dengan tema terang dan gelap.",
    oe_8: "Pengujian unit, sistem penuh, dan browser nyata, agar setiap penerapan selalu berhasil.",
    quickstart: "Mulai cepat",
    get_key: "Dapatkan kunci di dasbor. SDK untuk 20 bahasa, dibuat dari spesifikasi OpenAPI kami.",
    enterprise_note: "Sistem id swakelola tanpa batas.",
    hobby_features:
      "1.000 id per hari\n1 permintaan per detik\nSemua 20 SDK dan API\nDukungan komunitas",
    pro_features:
      "Semua di Hobby\n100.000 id per hari\n10 permintaan per detik\nAnalitik penggunaan\nDukungan email dalam 48 jam",
    ent_features:
      "Semua di Professional\nPUID pribadi swakelola Anda sendiri\nNama domain kustom\nId dan laju tanpa batas\nSSO / SAML dan log audit\nDukungan email dan telepon dalam 24 jam, dengan SLA",
    popular: "Populer",
    get_started: "Mulai",
    upgrade_cta: "Tingkatkan",
    no_password:
      "Tanpa kata sandi, tanpa email dari kami — penyedia Anda sudah memverifikasi Anda.",
    api_key: "Kunci API",
    shown_once: "ditampilkan sekali",
    join_intro:
      "Satu kode gabung yang dapat digunakan ulang. Siapa pun yang memilikinya dapat bergabung ke akun ini. Putar kapan saja — kode lama berhenti bekerja. Atau cabut untuk menonaktifkan bergabung.",
    rotate: "Putar",
    revoke: "Cabut (nonaktifkan bergabung)",
    share_email: "✉️ Bagikan via email",
    joining_disabled: "Bergabung saat ini dinonaktifkan — tidak ada kode aktif.",
    owners_only: "Hanya pemilik akun yang dapat mengelola kode gabung.",
    key_saved: "Simpan — kami melakukan hash dan tidak dapat menampilkannya lagi.",
    revoke_action: "Cabut",
    authorized_apps: "Aplikasi yang diotorisasi",
    apps_desc:
      "Aplikasi yang Anda beri izin untuk membuat id atas nama akun ini (melalui OAuth). Cabut kapan saja.",
    no_apps: "Tidak ada aplikasi yang diotorisasi.",
    usage_title: "Penggunaan",
    usage_total: "total",
    bucket_minute: "Per menit",
    bucket_hour: "Per jam",
    bucket_day: "Per hari",
    no_usage: "Belum ada id yang dibuat.",
    join_code_label: "Kode gabung:",
    join_link_label: "Tautan gabung:",
    why_title: "Oke, ini lelucon.",
    why_lead:
      'PUID adalah cara yang sangat berlebihan untuk membagikan sebuah angka. Tapi bagian "terbukti unik" itu nyata. Begini cara kerjanya yang sebenarnya.',
    why_h1: "Ini hanya penghitung",
    why_b1:
      "Di balik layar, PUID hanya menghitung. 1, 2, 3, dan seterusnya. Sebaliknya UUIDv4 acak, jadi hanya mungkin unik. Jika Anda membuat cukup banyak, dua bisa keluar sama.",
    why_b1b:
      "Sejujurnya, itu hampir tidak pernah terjadi. UUID acak cukup untuk 99,999999% aplikasi. Anda harus membuat miliaran sebelum tabrakan layak dikhawatirkan. Di kehidupan nyata UUID hebat. Penghitung hanya lebih mudah dipahami karena tidak pernah berulang. Satu-satunya masalah adalah angka 3 adalah id yang cukup membosankan.",
    why_h2: "Jadi saya sembunyikan penghitungnya",
    why_b2:
      "Saya ambil penghitung dan melewatkannya melalui sandi kecil (permutasi Feistel 128-bit), lalu mengodekannya dengan base62. Permutasi hanya mengacak angka. Setiap input menghasilkan output berbeda, dan tidak pernah dua input jatuh ke output yang sama. Jadi id tidak pernah bisa bertabrakan, dan tetap terlihat acak. Keunikan yang sama seperti penghitung, tapi sekarang terlihat seperti id sungguhan.",
    why_sample: "#1 menjadi 64qAN39GjJh5kbi4HROOxh. #2 menjadi 7U17bzw0MO3mzwuFKO7cc0.",
    why_h3: "Ia dapat mendekode dirinya sendiri",
    why_b3:
      "Sandi juga berjalan mundur. Jadi <code>GET /api/v1/ordinal/&lt;id&gt;</code> mengubah PUID apa pun kembali ke nilai penghitungnya. Itu membuktikan id <code>64qAN39Gj...</code> sebenarnya hanya #1. Itu juga berarti siapa pun dapat mendekode id dan membaca angkanya, dan angka itu adalah berapa banyak id yang telah kami bagikan saat ia dibuat. Jadi tidak, jangan gunakan ini di produksi.",
    why_h4: "Mengapa membangun semua ini untuk sebuah penghitung?",
    why_b4:
      'Kebanyakan untuk bersenang-senang, dan untuk melihat seberapa jauh leluconnya. Ada server OAuth2 lengkap, masuk dengan Google dan Microsoft, tim, 20 SDK, ekstensi Postgres, 20 bahasa, dan tiga rangkaian pengujian. Semuanya hanya untuk mengembalikan <code>i++</code> dalam kemasan yang lebih cantik. Jika Anda suka hal seperti ini, <a class="text-indigo-600 dark:text-indigo-400" href="https://bio.jtwebman.com" target="_blank" rel="noopener">ikuti saya di media sosial saya</a>.',
  },
  th: {
    hero_note: "แพ็กเกจฟรีตลอดกาล · ไม่ต้องใช้บัตรเครดิต · SDK ทางการ 20 ตัว",
    stat_collisions_n: "0",
    stat_collisions_l: "การชนกัน ตลอดกาล",
    stat_keyspace_n: "2¹²⁸",
    stat_keyspace_l: "คีย์สเปซของตัวระบุ",
    stat_uptime_n: "99.99%",
    stat_uptime_l: "SLA เวลาให้บริการ",
    stat_sdks_n: "20",
    stat_sdks_l: "SDK ทางการ",
    features_title: "ทุกสิ่งที่คุณต้องมี เพื่อไม่ให้ชนกันอีกต่อไป",
    features_sub:
      "แพลตฟอร์มตัวระบุที่ครบครัน——ตั้งแต่คณิตศาสตร์ที่เป็นแกนกลาง ไปจนถึง SDK ทีมงาน และการวิเคราะห์ที่อยู่รายรอบ",
    feat_unique_t: "พิสูจน์ได้ว่าไม่ชนกัน",
    feat_unique_b:
      "ไม่ใช่แค่โอกาสน้อยจนแทบเป็นไปไม่ได้ แต่เป็นไปไม่ได้ในเชิงคณิตศาสตร์ ทุก id รับประกันว่าไม่ซ้ำกันด้วยการพิสูจน์ ไม่ใช่ด้วยความน่าจะเป็น",
    feat_random_t: "ทึบและปลอดภัยสำหรับ URL",
    feat_random_b:
      "ตัวระบุแบบ base62 ที่มีเอนโทรปีสูง ไม่เผยข้อมูลใด ๆ ออกมา——ไม่ว่าจะเป็นข้อมูลของคุณ ขนาดของระบบ หรือความเชื่อมโยงระหว่างกัน",
    feat_edge_t: "ให้บริการจาก edge",
    feat_edge_b: "ทำงานบนเครือข่ายทั่วโลกของ Cloudflare ใกล้ชิดผู้ใช้ของคุณในหลายร้อยเมือง รวดเร็วทุกที่โดยปริยาย",
    feat_oauth_t: "มี OAuth2 และ SSO ในตัว",
    feat_oauth_b:
      "เซิร์ฟเวอร์การให้สิทธิ์แบบเต็มรูปแบบ ลงชื่อเข้าใช้ด้วย Google มอบสิทธิ์การเข้าถึงแบบจำกัดขอบเขตให้แอป และเพิกถอนได้ทุกเมื่อ",
    feat_sdk_t: "SDK ทางการ 20 ตัว",
    feat_sdk_b:
      "สร้างจากข้อกำหนด OpenAPI ของเราและจัดเวอร์ชันไปพร้อมกับ API——พร้อมส่วนขยาย PostgreSQL แบบเนทีฟสำหรับ id ของตาราง",
    feat_team_t: "สร้างมาเพื่อทีม",
    feat_team_b:
      "บัญชีแบบหลายผู้เช่า การวิเคราะห์การใช้งาน คีย์ API ที่หมุนเวียนได้ และโค้ดเข้าร่วมที่นำกลับมาใช้ซ้ำและเพิกถอนได้",
    how_title: "เริ่มใช้งานได้ใน 60 วินาที",
    how_sub: "ไม่ต้องผ่านฝ่ายจัดซื้อ ไม่ต้องนัดคุยกับฝ่ายขาย แค่ลงชื่อเข้าใช้แล้วส่งงานได้เลย",
    step1_t: "สร้างบัญชีของคุณ",
    step1_b: "ลงชื่อเข้าใช้ด้วย Google ไม่ต้องจัดการรหัสผ่าน ไม่ต้องกรอกบัตรเครดิต",
    step2_t: "สร้างคีย์ API",
    step2_b: "สร้างคีย์ในแดชบอร์ด หมุนเวียนหรือเพิกถอนได้ทุกเมื่อที่ต้องการ",
    step3_t: "เรียกใช้ API",
    step3_b: "หนึ่งคำขอคืนค่า id ได้สูงสุด 10 ตัว เพียงใส่ SDK สำหรับภาษาของคุณ ก็เสร็จเรียบร้อย",
    loved_title: "วิศวกรที่ใส่ใจในความถูกต้อง",
    quote1: "เราเปลี่ยนจาก UUIDv4 แล้วไม่เจอการชนกันอีกเลยแม้แต่ครั้งเดียว ไม่มีเลยสักครั้ง",
    name1: "Dana R.",
    role1: "Staff Engineer",
    quote2: "ในที่สุดก็ได้ตัวระบุที่ผมพิสูจน์ความไม่ซ้ำกันได้ในการรีวิวโค้ด แทนที่จะอ้างลอย ๆ ด้วยความน่าจะเป็น",
    name2: "Marcus L.",
    role2: "Backend Lead",
    quote3: "ส่วนขยาย Postgres เข้ากับสคีมาของเราได้ภายในบ่ายวันเดียว มันทำงานได้ดีจริง ๆ",
    name3: "Priya N.",
    role3: "Platform Engineer",
    cta_title: "เลิกเสี่ยงดวงกับความไม่ซ้ำกันได้แล้ว",
    cta_sub: "มาร่วมกับทีมที่กำลังสร้างตัวระบุที่พิสูจน์ได้ว่าไม่ซ้ำกันตั้งแต่วันนี้",
    nav_docs: "เอกสาร API",
    nav_dashboard: "แดชบอร์ด",
    nav_metrics: "เมตริก",
    guarantee_title: "พิสูจน์ได้ว่าไม่ชนกัน 100%",
    random_title: "ดูสุ่มอย่างสมบูรณ์",
    ratelimit_title: "จำกัดอัตราอย่างเข้มงวด",
    pricing: "ราคา",
    generate: "สร้าง",
    account: "บัญชี",
    members: "สมาชิก",
    signin_google: "เข้าสู่ระบบด้วย Google",
    signin_microsoft: "เข้าสู่ระบบด้วย Microsoft",
    signin_prompt: "เข้าสู่ระบบเพื่อสร้างคีย์และสร้าง id",
    footer: "เรื่องตลก พิสูจน์ได้ว่าไม่ซ้ำ อย่าใช้สิ่งนี้",
    foot_rights: "สงวนลิขสิทธิ์",
    foot_why: "ทำไม?",
    foot_terms: "ข้อกำหนด",
    foot_privacy: "ความเป็นส่วนตัว",
    language: "ภาษา",
    theme: "ธีม",
    theme_auto: "อัตโนมัติ",
    theme_light: "สว่าง",
    theme_dark: "มืด",
    new_account: "+ บัญชีใหม่",
    mint_key: "สร้างคีย์",
    team: "ทีม",
    generate_code: "สร้างรหัสเชิญ",
    hero_sub: "ID ที่พิสูจน์ได้ว่าไม่ซ้ำ ที่โลกยังขาด!",
    hero_desc:
      "UUID เดิมพันกับความไม่ซ้ำ — มีโอกาสที่ไม่เป็นศูนย์เสมอที่สองตัวจะชนกัน PUID ใช้เครื่องยนต์ความไม่ซ้ำที่เป็นกรรมสิทธิ์และอยู่ระหว่างยื่นจดสิทธิบัตร เพื่อมอบตัวระบุที่กำหนดได้แน่นอนและไม่ชนกันในระดับเว็บ คลาวด์-เนทีฟ ระดับองค์กร และพิสูจน์ได้ว่าไม่ซ้ำโดยการออกแบบ ทำได้อย่างไรน่ะหรือ? นั่นคือสูตรลับของเรา",
    get_api_key: "รับคีย์ API",
    guarantee_body:
      "ความไม่ซ้ำไม่เคยถูกปล่อยให้เป็นเรื่องของโชค ตัวระบุทุกตัวรับประกันว่าต่างกันด้วยการพิสูจน์ทางคณิตศาสตร์ — ไม่ใช่ความน่าจะเป็น ศูนย์การชน วันนี้และตลอดไป",
    random_body:
      "ตัวระบุที่ทึบ มีเอนโทรปีสูง และปลอดภัยสำหรับ URL ที่ไม่เปิดเผยอะไรเลย — ไม่ใช่ข้อมูลของคุณ ไม่ใช่สเกลของคุณ และไม่ใช่ของกันและกัน สวยงามและเดาไม่ได้",
    ratelimit_body:
      "การป้องกันการใช้งานอย่างเป็นธรรมในตัวช่วยป้องกันไม่ให้ผู้ใช้คนเดียวผูกขาดบริการ เพื่อให้ลูกค้าทุกคนเข้าถึง id ที่ต้องการได้อย่างรวดเร็วและเชื่อถือได้",
    oe_title: "มันถูกออกแบบเกินจำเป็นแค่ไหน?",
    oe_1: "รหัส Feistel ขนาด 128 บิต",
    oe_2: "เซิร์ฟเวอร์อนุญาต OAuth2 แบบเต็ม — เพื่อให้แอปได้รับอนุญาตอย่างเป็นทางการให้รับตัวเลขหนึ่งตัว",
    oe_3: "เข้าสู่ระบบด้วย Google หรือ Microsoft — SSO จากผู้ให้บริการตัวตนระดับองค์กรที่ปลอดภัยที่สุด",
    oe_4: "ทีมแบบหลายผู้เช่า: หลายบัญชีต่อผู้ใช้ รหัสเข้าร่วมที่ใช้ซ้ำและเพิกถอนได้",
    oe_5: "SDK ฝั่งไคลเอนต์ 20 ตัว สร้างจากสเปก OpenAPI",
    oe_6: "ส่วนขยาย PostgreSQL ที่ให้คุณสร้างสิ่งเหล่านี้เป็น id ตารางโดยอัตโนมัติ",
    oe_7: "เว็บไซต์การตลาดนี้ ใน 20 ภาษา พร้อมธีมสว่างและมืด",
    oe_8: "ชุดทดสอบหน่วย ทั้งระบบ และเบราว์เซอร์จริง เพื่อให้ทุกการดีพลอยทำงานเสมอ",
    quickstart: "เริ่มต้นอย่างรวดเร็ว",
    get_key: "รับคีย์ในแดชบอร์ด SDK สำหรับ 20 ภาษา สร้างจากสเปก OpenAPI ของเรา",
    enterprise_note: "ระบบ id แบบโฮสต์เองที่ไม่จำกัด",
    hobby_features: "1,000 id ต่อวัน\n1 คำขอต่อวินาที\nSDK ทั้ง 20 ตัวและ API\nการสนับสนุนจากชุมชน",
    pro_features:
      "ทุกอย่างใน Hobby\n100,000 id ต่อวัน\n10 คำขอต่อวินาที\nการวิเคราะห์การใช้งาน\nการสนับสนุนทางอีเมลภายใน 48 ชั่วโมง",
    ent_features:
      "ทุกอย่างใน Professional\nPUID ส่วนตัวแบบโฮสต์เองของคุณ\nชื่อโดเมนที่กำหนดเอง\nid และอัตราไม่จำกัด\nSSO / SAML และบันทึกการตรวจสอบ\nการสนับสนุนทางอีเมลและโทรศัพท์ภายใน 24 ชั่วโมง พร้อม SLA",
    popular: "ยอดนิยม",
    get_started: "เริ่มต้น",
    upgrade_cta: "อัปเกรด",
    no_password: "ไม่มีรหัสผ่าน ไม่มีอีเมลจากเรา — ผู้ให้บริการของคุณยืนยันตัวคุณแล้ว",
    api_key: "คีย์ API",
    shown_once: "แสดงครั้งเดียว",
    join_intro:
      "รหัสเข้าร่วมที่ใช้ซ้ำได้หนึ่งรหัส ใครก็ตามที่มีสามารถเข้าร่วมบัญชีนี้ได้ หมุนเมื่อใดก็ได้ — รหัสเก่าจะหยุดทำงาน หรือเพิกถอนเพื่อปิดการเข้าร่วม",
    rotate: "หมุน",
    revoke: "เพิกถอน (ปิดการเข้าร่วม)",
    share_email: "✉️ แชร์ทางอีเมล",
    joining_disabled: "การเข้าร่วมถูกปิดอยู่ — ไม่มีรหัสที่ใช้งานได้",
    owners_only: "เฉพาะเจ้าของบัญชีเท่านั้นที่จัดการรหัสเข้าร่วมได้",
    key_saved: "บันทึกไว้ — เราแฮชมันและไม่สามารถแสดงอีกครั้งได้",
    revoke_action: "เพิกถอน",
    authorized_apps: "แอปที่ได้รับอนุญาต",
    apps_desc: "แอปที่คุณให้สิทธิ์สร้าง id ในนามของบัญชีนี้ (ผ่าน OAuth) เพิกถอนเมื่อใดก็ได้",
    no_apps: "ไม่มีแอปที่ได้รับอนุญาต",
    usage_title: "การใช้งาน",
    usage_total: "รวม",
    bucket_minute: "ต่อนาที",
    bucket_hour: "ต่อชั่วโมง",
    bucket_day: "ต่อวัน",
    no_usage: "ยังไม่ได้สร้าง id ใด ๆ",
    join_code_label: "รหัสเข้าร่วม:",
    join_link_label: "ลิงก์เข้าร่วม:",
    why_title: "โอเค มันเป็นเรื่องตลก",
    why_lead:
      'PUID เป็นวิธีที่สร้างเกินจำเป็นอย่างมากในการแจกตัวเลข แต่ส่วน "พิสูจน์ได้ว่าไม่ซ้ำ" นั้นเป็นเรื่องจริง นี่คือวิธีที่มันทำงานจริง',
    why_h1: "มันก็แค่ตัวนับ",
    why_b1:
      "เบื้องหลัง PUID แค่นับ 1, 2, 3 ไปเรื่อย ๆ ส่วน UUIDv4 นั้นสุ่ม จึงเพียงแค่น่าจะไม่ซ้ำเท่านั้น ถ้าคุณสร้างมากพอ สองตัวอาจออกมาเหมือนกัน",
    why_b1b:
      "ตามจริงแล้ว แทบไม่เคยเกิดขึ้นเลย UUID แบบสุ่มใช้ได้ดีกับ 99.999999% ของแอป คุณต้องสร้างเป็นพันล้านก่อนที่การชนจะควรค่าแก่การกังวล ในชีวิตจริง UUID นั้นยอดเยี่ยม ตัวนับแค่เข้าใจง่ายกว่า เพราะมันไม่เคยซ้ำ ปัญหาเดียวคือเลข 3 เป็น id ที่ค่อนข้างน่าเบื่อ",
    why_h2: "ดังนั้นผมจึงซ่อนตัวนับ",
    why_b2:
      "ผมเอาตัวนับมาแล้วส่งผ่านรหัสเล็ก ๆ (การเรียงสับเปลี่ยน Feistel ขนาด 128 บิต) จากนั้นเข้ารหัสด้วย base62 การเรียงสับเปลี่ยนแค่สับตัวเลขไปมา ทุกอินพุตให้เอาต์พุตต่างกัน และไม่มีสองอินพุตใดตกลงที่เอาต์พุตเดียวกันเลย ดังนั้น id จึงไม่มีทางชนกัน และยังดูสุ่มอยู่ ความไม่ซ้ำเหมือนตัวนับ แต่ตอนนี้ดูเหมือน id จริง",
    why_sample: "#1 กลายเป็น 64qAN39GjJh5kbi4HROOxh #2 กลายเป็น 7U17bzw0MO3mzwuFKO7cc0",
    why_h3: "มันถอดรหัสตัวเองได้",
    why_b3:
      "รหัสทำงานย้อนกลับได้ด้วย ดังนั้น <code>GET /api/v1/ordinal/&lt;id&gt;</code> จะเปลี่ยน PUID ใด ๆ กลับเป็นค่าตัวนับของมัน นั่นพิสูจน์ว่า id <code>64qAN39Gj...</code> แท้จริงแล้วก็แค่ #1 มันยังหมายความว่าใครก็ตามสามารถถอดรหัส id และอ่านตัวเลขของมันได้ และตัวเลขนั้นคือจำนวน id ที่เราแจกไปแล้วตอนที่มันถูกสร้าง ดังนั้นไม่ อย่าใช้สิ่งนี้ในการใช้งานจริง",
    why_h4: "ทำไมต้องสร้างทั้งหมดนี้เพื่อตัวนับ?",
    why_b4:
      'ส่วนใหญ่เพื่อความสนุก และเพื่อดูว่าเรื่องตลกนี้จะไปได้ไกลแค่ไหน มีเซิร์ฟเวอร์ OAuth2 แบบเต็ม การเข้าสู่ระบบด้วย Google และ Microsoft ทีม 20 SDK ส่วนขยาย Postgres 20 ภาษา และชุดทดสอบสามชุด ทั้งหมดนี้เพื่อคืนค่า <code>i++</code> ในห่อที่สวยกว่า ถ้าคุณชอบอะไรแบบนี้ <a class="text-indigo-600 dark:text-indigo-400" href="https://bio.jtwebman.com" target="_blank" rel="noopener">ติดตามผมบนโซเชียลของผม</a>',
  },
};

// Enforces that the English base defines every key (Chrome + Content).
export const BASE: Messages = M.en as Messages;

export function pickLocale(request: Request, url: URL): { locale: Locale; persist: boolean } {
  const q = url.searchParams.get("lang");
  if (q && q in LOCALES) return { locale: q as Locale, persist: true };
  const cookie = (request.headers.get("cookie") || "").match(/(?:^|;\s*)lang=([a-z-]+)/);
  if (cookie && cookie[1] in LOCALES) return { locale: cookie[1] as Locale, persist: false };
  const al = request.headers.get("accept-language") || "";
  for (const part of al.split(",")) {
    const code = part.split(";")[0].trim().slice(0, 2).toLowerCase();
    if (code in LOCALES) return { locale: code as Locale, persist: false };
  }
  return { locale: "en", persist: false };
}

export function t(locale: Locale, key: keyof Messages): string {
  return (M[locale] as Partial<Messages>)[key] ?? BASE[key] ?? key;
}

// Full message map for a locale (overrides merged over the English base).
export function messagesFor(locale: Locale): Messages {
  return { ...BASE, ...M[locale] };
}
