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
  oe_1: string; oe_2: string; oe_3: string; oe_4: string;
  oe_5: string; oe_6: string; oe_7: string; oe_8: string;
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
  generate_ids: string;
  one_per_sec: string;
  how_many: string;
  join_intro: string;
  rotate: string;
  revoke: string;
  share_email: string;
  joining_disabled: string;
  owners_only: string;
}

export type Messages = Chrome & Content;

const M: Record<Locale, Chrome & Partial<Content>> = {
  en: {
    hero_sub: "The Provably Unique ID the world is missing!",
    hero_desc:
      "UUIDs gamble on uniqueness — there's always a nonzero chance two collide. PUID harnesses a proprietary, patent-pending uniqueness engine to deliver deterministic, collision-free identifiers at web scale. Cloud-native, enterprise-grade, and provably unique by design. The how is our secret sauce.",
    get_api_key: "Get an API key",
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
    hobby_features: "1,000 ids per day\n1 request per second\nAll 20 SDKs and the API\nCommunity support",
    pro_features: "Everything in Hobby\n100,000 ids per day\n10 requests per second\nUsage analytics\n48-hour email support",
    ent_features: "Everything in Professional\nYour own private, self-hosted PUID\nCustom domain name\nUnlimited ids and rate\nSSO / SAML and audit logs\n24-hour email & phone support, with an SLA",
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
    generate_ids: "Generate ids",
    one_per_sec: "(1 request / second)",
    how_many: "how many:",
    generate: "Generate",
    team: "Team",
    members: "Members",
    join_intro: "One reusable join code. Anyone who has it can join this account. Rotate it any time — the old code stops working. Or revoke it to turn joining off.",
    generate_code: "Generate join code",
    rotate: "Rotate",
    revoke: "Revoke (disable joining)",
    share_email: "✉️ Share via email",
    joining_disabled: "Joining is currently disabled — there is no active code.",
    owners_only: "Only account owners can manage the join code.",
    language: "Language",
    theme: "Theme",
    theme_light: "Light",
    theme_dark: "Dark",
    theme_auto: "Auto",
  },

  es: { hero_sub: "¡La id única que le faltaba al mundo!", hero_desc: "Los UUID apuestan por la unicidad: siempre hay una probabilidad distinta de cero de que dos colisionen. PUID aprovecha un motor de unicidad propietario y con patente en trámite para ofrecer identificadores deterministas y sin colisiones a escala web. Nativo en la nube, de nivel empresarial y demostrablemente único por diseño. El cómo es nuestra salsa secreta.", get_api_key: "Obtener una clave API", nav_docs: "Documentación", nav_dashboard: "Panel", nav_metrics: "Métricas", guarantee_title: "Sin colisiones, demostrablemente al 100 %", guarantee_body: "La unicidad nunca se deja al azar. Cada identificador es distinto por demostración matemática, no por probabilidad. Cero colisiones, hoy y siempre.", random_title: "Parece completamente aleatorio", random_body: "Identificadores opacos, de alta entropía y seguros para URL que no revelan nada: ni tus datos, ni tu escala, ni entre sí. Hermosos e imposibles de adivinar.", ratelimit_title: "Con límite de velocidad estricto", ratelimit_body: "La protección de uso justo integrada evita que un solo usuario monopolice el servicio, para que todos los clientes obtengan acceso rápido y fiable a los ids que necesitan.", oe_title: "¿Qué tan sobre-ingeniada está?", oe_1: "Un cifrado Feistel de 128 bits.", oe_2: "Un servidor de autorización OAuth2 completo, para que las apps reciban formalmente permiso para obtener un número.", oe_3: "Inicia sesión con Google o Microsoft: SSO de los proveedores de identidad empresarial más seguros.", oe_4: "Equipos multiinquilino: muchas cuentas por usuario, con códigos de invitación reutilizables y revocables.", oe_5: "20 SDKs de cliente, generados a partir de una especificación OpenAPI.", oe_6: "Una extensión de PostgreSQL que te permite autogenerar estos como ids de tabla.", oe_7: "Este sitio de marketing, en 20 idiomas, con temas claro y oscuro.", oe_8: "Pruebas unitarias, de sistema completo y de navegador real, para que cada despliegue siempre funcione.", quickstart: "Inicio rápido", pricing: "Precios", enterprise_note: "Un sistema de ids autoalojado e ilimitado.", hobby_features: "1.000 ids al día\n1 solicitud por segundo\nLos 20 SDKs y la API\nSoporte de la comunidad", pro_features: "Todo lo de Hobby\n100.000 ids al día\n10 solicitudes por segundo\nAnálisis de uso\nSoporte por correo en 48 horas", ent_features: "Todo lo de Professional\nTu propio PUID privado y autoalojado\nNombre de dominio personalizado\nIds y velocidad ilimitados\nSSO / SAML y registros de auditoría\nSoporte por correo y teléfono en 24 horas, con SLA", popular: "Popular", get_started: "Empezar", upgrade_cta: "Mejorar", generate: "Generar", account: "Cuenta", members: "Miembros", signin_google: "Iniciar sesión con Google", signin_microsoft: "Iniciar sesión con Microsoft", signin_prompt: "Inicia sesión para crear una clave y generar ids.", footer: "Una broma. Demostrablemente único. No lo uses.", foot_rights: "Todos los derechos reservados.", foot_why: "¿Por qué?", foot_terms: "Términos", foot_privacy: "Privacidad", language: "Idioma", theme: "Tema", theme_auto: "Automático", theme_light: "Claro", theme_dark: "Oscuro", new_account: "+ Nueva cuenta", mint_key: "Crear clave", team: "Equipo", generate_code: "Generar código de invitación" },

  fr: { hero_sub: "L'identifiant unique qui manquait au monde !", hero_desc: "Les UUID parient sur l'unicité : il subsiste toujours une probabilité non nulle de collision. PUID exploite un moteur d'unicité propriétaire et breveté pour fournir des identifiants déterministes et sans collision à l'échelle du web. Cloud-native, de niveau entreprise et prouvé unique par conception. Le comment, c'est notre recette secrète.", get_api_key: "Obtenir une clé API", nav_docs: "Documentation", nav_dashboard: "Tableau de bord", nav_metrics: "Métriques", guarantee_title: "Sans collision, prouvé à 100 %", guarantee_body: "L'unicité n'est jamais laissée au hasard. Chaque identifiant est distinct par preuve mathématique, pas par probabilité. Zéro collision, aujourd'hui et pour toujours.", random_title: "Semble totalement aléatoire", random_body: "Des identifiants opaques, à haute entropie et compatibles URL qui ne révèlent rien : ni vos données, ni votre échelle, ni les uns les autres. Élégants et imprévisibles.", ratelimit_title: "Débit fortement limité", ratelimit_body: "Une protection d'usage équitable intégrée empêche un seul utilisateur de monopoliser le service, afin que chaque client bénéficie d'un accès rapide et fiable aux identifiants dont il a besoin.", oe_title: "À quel point est-ce sur-conçu ?", oe_1: "Un chiffrement de Feistel 128 bits.", oe_2: "Un serveur d'autorisation OAuth2 complet — pour que des applications obtiennent officiellement la permission de recevoir un nombre.", oe_3: "Connexion avec Google ou Microsoft : le SSO des fournisseurs d'identité d'entreprise les plus sûrs.", oe_4: "Équipes multi-locataires : plusieurs comptes par utilisateur, avec des codes d'invitation réutilisables et révocables.", oe_5: "20 SDK clients, générés à partir d'une spécification OpenAPI.", oe_6: "Une extension PostgreSQL qui permet de générer automatiquement ces identifiants comme ids de table.", oe_7: "Ce site marketing, en 20 langues, avec thèmes clair et sombre.", oe_8: "Des tests unitaires, système complet et navigateur réel, pour que chaque déploiement fonctionne toujours.", quickstart: "Démarrage rapide", pricing: "Tarifs", enterprise_note: "Un système d'identifiants auto-hébergé et illimité.", hobby_features: "1 000 ids par jour\n1 requête par seconde\nLes 20 SDK et l'API\nSupport communautaire", pro_features: "Tout ce qui est dans Hobby\n100 000 ids par jour\n10 requêtes par seconde\nAnalyses d'utilisation\nSupport e-mail sous 48 heures", ent_features: "Tout ce qui est dans Professional\nVotre propre PUID privé auto-hébergé\nNom de domaine personnalisé\nIds et débit illimités\nSSO / SAML et journaux d'audit\nSupport e-mail et téléphone sous 24 heures, avec SLA", popular: "Populaire", get_started: "Commencer", upgrade_cta: "Améliorer", generate: "Générer", account: "Compte", members: "Membres", signin_google: "Se connecter avec Google", signin_microsoft: "Se connecter avec Microsoft", signin_prompt: "Connectez-vous pour créer une clé et générer des ids.", footer: "Une blague. Prouvé unique. Ne l'utilisez pas.", foot_rights: "Tous droits réservés.", foot_why: "Pourquoi ?", foot_terms: "Conditions", foot_privacy: "Confidentialité", language: "Langue", theme: "Thème", theme_auto: "Auto", theme_light: "Clair", theme_dark: "Sombre", new_account: "+ Nouveau compte", mint_key: "Créer une clé", team: "Équipe", generate_code: "Générer un code d'invitation" },

  de: { hero_sub: "Die eindeutige ID, die der Welt gefehlt hat!", hero_desc: "UUIDs setzen auf Wahrscheinlichkeit – es bleibt immer eine von null verschiedene Kollisionschance. PUID nutzt eine proprietäre, zum Patent angemeldete Eindeutigkeits-Engine für deterministische, kollisionsfreie Bezeichner in Web-Skalierung. Cloud-nativ, unternehmenstauglich und beweisbar eindeutig per Design. Das Wie ist unser Geheimrezept.", get_api_key: "API-Schlüssel holen", nav_docs: "API-Doku", nav_dashboard: "Dashboard", nav_metrics: "Metriken", guarantee_title: "Beweisbar 100 % kollisionsfrei", guarantee_body: "Eindeutigkeit wird nie dem Zufall überlassen. Jeder Bezeichner ist durch mathematischen Beweis eindeutig – nicht durch Wahrscheinlichkeit. Null Kollisionen, heute und für immer.", random_title: "Sieht völlig zufällig aus", random_body: "Undurchsichtige, hochentropische, URL-sichere Bezeichner, die nichts verraten – weder Ihre Daten noch Ihre Größe noch sich gegenseitig. Schön und nicht erratbar.", ratelimit_title: "Streng ratenbegrenzt", ratelimit_body: "Ein integrierter Fair-Use-Schutz verhindert, dass ein einzelner Nutzer den Dienst monopolisiert – damit jeder Kunde schnellen, zuverlässigen Zugriff auf die benötigten IDs erhält.", oe_title: "Wie over-engineered ist das?", oe_1: "Eine 128-Bit-Feistel-Chiffre.", oe_2: "Ein vollständiger OAuth2-Autorisierungsserver – damit Apps formal die Erlaubnis erhalten, eine Zahl zu bekommen.", oe_3: "Anmeldung mit Google oder Microsoft – SSO der sichersten Unternehmens-Identitätsanbieter.", oe_4: "Mandantenfähige Teams: viele Konten pro Nutzer, mit wiederverwendbaren, widerrufbaren Beitrittscodes.", oe_5: "20 Client-SDKs, generiert aus einer OpenAPI-Spezifikation.", oe_6: "Eine PostgreSQL-Erweiterung, mit der du diese automatisch als Tabellen-IDs erzeugst.", oe_7: "Diese Marketing-Website, in 20 Sprachen, mit hellem und dunklem Design.", oe_8: "Unit-, Vollsystem- und echte Browser-Tests, damit jedes Deployment immer funktioniert.", quickstart: "Schnellstart", pricing: "Preise", enterprise_note: "Ein selbstgehostetes, unbegrenztes ID-System.", hobby_features: "1.000 IDs pro Tag\n1 Anfrage pro Sekunde\nAlle 20 SDKs und die API\nCommunity-Support", pro_features: "Alles aus Hobby\n100.000 IDs pro Tag\n10 Anfragen pro Sekunde\nNutzungsanalysen\nE-Mail-Support innerhalb von 48 Stunden", ent_features: "Alles aus Professional\nIhr eigenes privates, selbstgehostetes PUID\nEigener Domainname\nUnbegrenzte IDs und Rate\nSSO / SAML und Audit-Logs\nE-Mail- und Telefon-Support innerhalb von 24 Stunden, mit SLA", popular: "Beliebt", get_started: "Loslegen", upgrade_cta: "Upgraden", generate: "Generieren", account: "Konto", members: "Mitglieder", signin_google: "Mit Google anmelden", signin_microsoft: "Mit Microsoft anmelden", signin_prompt: "Melde dich an, um einen Schlüssel zu erstellen und IDs zu generieren.", footer: "Ein Scherz. Beweisbar einzigartig. Nicht verwenden.", foot_rights: "Alle Rechte vorbehalten.", foot_why: "Warum?", foot_terms: "AGB", foot_privacy: "Datenschutz", language: "Sprache", theme: "Design", theme_auto: "Auto", theme_light: "Hell", theme_dark: "Dunkel", new_account: "+ Neues Konto", mint_key: "Schlüssel erstellen", team: "Team", generate_code: "Einladungscode erstellen" },

  pt: { hero_sub: "A id única que faltava ao mundo!", hero_desc: "Os UUIDs apostam na unicidade: há sempre uma probabilidade diferente de zero de dois colidirem. O PUID utiliza um motor de unicidade proprietário e com patente pendente para entregar identificadores determinísticos e sem colisões à escala da web. Nativo na nuvem, de nível empresarial e comprovadamente único por design. O como é o nosso segredo.", get_api_key: "Obter uma chave de API", nav_docs: "Documentação", nav_dashboard: "Painel", nav_metrics: "Métricas", guarantee_title: "Comprovadamente 100 % sem colisões", guarantee_body: "A unicidade nunca é deixada ao acaso. Cada identificador é distinto por prova matemática, não por probabilidade. Zero colisões, hoje e sempre.", random_title: "Parece totalmente aleatório", random_body: "Identificadores opacos, de alta entropia e seguros para URL que não revelam nada: nem seus dados, nem sua escala, nem uns aos outros. Bonitos e impossíveis de adivinhar.", ratelimit_title: "Com limite de taxa rígido", ratelimit_body: "A proteção de uso justo integrada impede que um único usuário monopolize o serviço, para que todos os clientes tenham acesso rápido e confiável aos ids de que precisam.", oe_title: "Quão sobre-engenhada ela é?", oe_1: "Uma cifra de Feistel de 128 bits.", oe_2: "Um servidor de autorização OAuth2 completo — para que apps recebam permissão formal para obter um número.", oe_3: "Entre com Google ou Microsoft: SSO dos provedores de identidade empresarial mais seguros.", oe_4: "Equipes multitenant: várias contas por usuário, com códigos de convite reutilizáveis e revogáveis.", oe_5: "20 SDKs de cliente, gerados a partir de uma especificação OpenAPI.", oe_6: "Uma extensão do PostgreSQL que permite gerar automaticamente esses ids de tabela.", oe_7: "Este site de marketing, em 20 idiomas, com temas claro e escuro.", oe_8: "Testes unitários, de sistema completo e de navegador real, para que cada implantação sempre funcione.", quickstart: "Início rápido", pricing: "Preços", enterprise_note: "Um sistema de ids auto-hospedado e ilimitado.", hobby_features: "1.000 ids por dia\n1 solicitação por segundo\nTodos os 20 SDKs e a API\nSuporte da comunidade", pro_features: "Tudo do Hobby\n100.000 ids por dia\n10 solicitações por segundo\nAnálise de uso\nSuporte por e-mail em 48 horas", ent_features: "Tudo do Professional\nSeu próprio PUID privado e auto-hospedado\nNome de domínio personalizado\nIds e taxa ilimitados\nSSO / SAML e logs de auditoria\nSuporte por e-mail e telefone em 24 horas, com SLA", popular: "Popular", get_started: "Começar", upgrade_cta: "Atualizar", generate: "Gerar", account: "Conta", members: "Membros", signin_google: "Entrar com o Google", signin_microsoft: "Entrar com a Microsoft", signin_prompt: "Entre para criar uma chave e gerar ids.", footer: "Uma piada. Comprovadamente único. Não use isto.", foot_rights: "Todos os direitos reservados.", foot_why: "Por quê?", foot_terms: "Termos", foot_privacy: "Privacidade", language: "Idioma", theme: "Tema", theme_auto: "Automático", theme_light: "Claro", theme_dark: "Escuro", new_account: "+ Nova conta", mint_key: "Criar chave", team: "Equipe", generate_code: "Gerar código de convite" },

  it: { hero_sub: "L'id unico che mancava al mondo!", hero_desc: "Gli UUID scommettono sull'unicità: esiste sempre una probabilità diversa da zero di collisione. PUID sfrutta un motore di unicità proprietario e in attesa di brevetto per fornire identificatori deterministici e senza collisioni su scala web. Cloud-native, di livello enterprise e dimostrabilmente unico per progettazione. Il come è la nostra ricetta segreta.", get_api_key: "Ottieni una chiave API", nav_docs: "Documentazione", nav_dashboard: "Dashboard", nav_metrics: "Metriche", guarantee_title: "Senza collisioni, dimostrabilmente al 100%", guarantee_body: "L'unicità non è mai lasciata al caso. Ogni identificatore è distinto per dimostrazione matematica, non per probabilità. Zero collisioni, oggi e per sempre.", random_title: "Sembra del tutto casuale", random_body: "Identificatori opachi, ad alta entropia e sicuri per URL che non rivelano nulla: né i tuoi dati, né la tua scala, né l'uno con l'altro. Eleganti e imprevedibili.", ratelimit_title: "Fortemente limitato", ratelimit_body: "La protezione fair-use integrata impedisce a un singolo utente di monopolizzare il servizio, così ogni cliente ottiene accesso rapido e affidabile agli id di cui ha bisogno.", oe_title: "Quanto è sovra-ingegnerizzata?", oe_1: "Un cifrario di Feistel a 128 bit.", oe_2: "Un server di autorizzazione OAuth2 completo, perché le app ottengano il permesso formale di ricevere un numero.", oe_3: "Accedi con Google o Microsoft: SSO dai provider di identità aziendale più sicuri.", oe_4: "Team multi-tenant: molti account per utente, con codici d'invito riutilizzabili e revocabili.", oe_5: "20 SDK client, generati da una specifica OpenAPI.", oe_6: "Un'estensione PostgreSQL che ti permette di generarli automaticamente come id di tabella.", oe_7: "Questo sito di marketing, in 20 lingue, con temi chiaro e scuro.", oe_8: "Test unitari, di sistema completo e su browser reale, così ogni deploy funziona sempre.", quickstart: "Avvio rapido", pricing: "Prezzi", enterprise_note: "Un sistema di id self-hosted e illimitato.", hobby_features: "1.000 id al giorno\n1 richiesta al secondo\nTutti i 20 SDK e l'API\nSupporto della community", pro_features: "Tutto di Hobby\n100.000 id al giorno\n10 richieste al secondo\nAnalisi di utilizzo\nSupporto email entro 48 ore", ent_features: "Tutto di Professional\nIl tuo PUID privato e self-hosted\nNome di dominio personalizzato\nId e frequenza illimitati\nSSO / SAML e log di audit\nSupporto email e telefono entro 24 ore, con SLA", popular: "Popolare", get_started: "Inizia", upgrade_cta: "Aggiorna", generate: "Genera", account: "Account", members: "Membri", signin_google: "Accedi con Google", signin_microsoft: "Accedi con Microsoft", signin_prompt: "Accedi per creare una chiave e generare id.", footer: "Uno scherzo. Dimostrabilmente unico. Non usarlo.", foot_rights: "Tutti i diritti riservati.", foot_why: "Perché?", foot_terms: "Termini", foot_privacy: "Privacy", language: "Lingua", theme: "Tema", theme_auto: "Auto", theme_light: "Chiaro", theme_dark: "Scuro", new_account: "+ Nuovo account", mint_key: "Crea chiave", team: "Team", generate_code: "Genera codice d'invito" },

  nl: { nav_docs: "API-docs", nav_dashboard: "Dashboard", nav_metrics: "Statistieken", guarantee_title: "Aantoonbaar 100% botsingvrij", random_title: "Ziet er volledig willekeurig uit", ratelimit_title: "Streng gelimiteerd", pricing: "Prijzen", generate: "Genereren", account: "Account", members: "Leden", signin_google: "Inloggen met Google", signin_microsoft: "Inloggen met Microsoft", signin_prompt: "Log in om een sleutel te maken en ids te genereren.", footer: "Een grap. Aantoonbaar uniek. Niet gebruiken.", foot_rights: "Alle rechten voorbehouden.", foot_why: "Waarom?", foot_terms: "Voorwaarden", foot_privacy: "Privacy", language: "Taal", theme: "Thema", theme_auto: "Auto", theme_light: "Licht", theme_dark: "Donker", new_account: "+ Nieuw account", mint_key: "Sleutel maken", team: "Team", generate_code: "Uitnodigingscode genereren" },
  pl: { nav_docs: "Dokumentacja", nav_dashboard: "Panel", nav_metrics: "Metryki", guarantee_title: "Dowodnie w 100% bez kolizji", random_title: "Wygląda całkowicie losowo", ratelimit_title: "Silnie ograniczony", pricing: "Cennik", generate: "Generuj", account: "Konto", members: "Członkowie", signin_google: "Zaloguj się przez Google", signin_microsoft: "Zaloguj się przez Microsoft", signin_prompt: "Zaloguj się, aby utworzyć klucz i generować id.", footer: "Żart. Dowodnie unikalne. Nie używaj tego.", foot_rights: "Wszelkie prawa zastrzeżone.", foot_why: "Dlaczego?", foot_terms: "Regulamin", foot_privacy: "Prywatność", language: "Język", theme: "Motyw", theme_auto: "Auto", theme_light: "Jasny", theme_dark: "Ciemny", new_account: "+ Nowe konto", mint_key: "Utwórz klucz", team: "Zespół", generate_code: "Wygeneruj kod zaproszenia" },
  ru: { nav_docs: "Документация", nav_dashboard: "Панель", nav_metrics: "Метрики", guarantee_title: "Доказуемо без коллизий на 100%", random_title: "Выглядит полностью случайным", ratelimit_title: "Строгое ограничение частоты", pricing: "Цены", generate: "Сгенерировать", account: "Аккаунт", members: "Участники", signin_google: "Войти через Google", signin_microsoft: "Войти через Microsoft", signin_prompt: "Войдите, чтобы создать ключ и генерировать id.", footer: "Шутка. Доказуемо уникально. Не используйте.", foot_rights: "Все права защищены.", foot_why: "Почему?", foot_terms: "Условия", foot_privacy: "Конфиденциальность", language: "Язык", theme: "Тема", theme_auto: "Авто", theme_light: "Светлая", theme_dark: "Тёмная", new_account: "+ Новый аккаунт", mint_key: "Создать ключ", team: "Команда", generate_code: "Создать код приглашения" },
  uk: { nav_docs: "Документація", nav_dashboard: "Панель", nav_metrics: "Метрики", guarantee_title: "Доказово на 100% без колізій", random_title: "Виглядає цілком випадково", ratelimit_title: "Суворе обмеження частоти", pricing: "Ціни", generate: "Згенерувати", account: "Обліковий запис", members: "Учасники", signin_google: "Увійти через Google", signin_microsoft: "Увійти через Microsoft", signin_prompt: "Увійдіть, щоб створити ключ і генерувати id.", footer: "Жарт. Доказово унікально. Не використовуйте.", foot_rights: "Усі права захищено.", foot_why: "Чому?", foot_terms: "Умови", foot_privacy: "Конфіденційність", language: "Мова", theme: "Тема", theme_auto: "Авто", theme_light: "Світла", theme_dark: "Темна", new_account: "+ Новий запис", mint_key: "Створити ключ", team: "Команда", generate_code: "Створити код запрошення" },
  tr: { nav_docs: "API Belgeleri", nav_dashboard: "Panel", nav_metrics: "Metrikler", guarantee_title: "Kanıtlanabilir %100 çakışmasız", random_title: "Tamamen rastgele görünür", ratelimit_title: "Sıkı hız sınırı", pricing: "Fiyatlandırma", generate: "Oluştur", account: "Hesap", members: "Üyeler", signin_google: "Google ile giriş yap", signin_microsoft: "Microsoft ile giriş yap", signin_prompt: "Anahtar oluşturmak ve id üretmek için giriş yapın.", footer: "Bir şaka. Kanıtlanabilir benzersiz. Bunu kullanmayın.", foot_rights: "Tüm hakları saklıdır.", foot_why: "Neden?", foot_terms: "Koşullar", foot_privacy: "Gizlilik", language: "Dil", theme: "Tema", theme_auto: "Otomatik", theme_light: "Açık", theme_dark: "Koyu", new_account: "+ Yeni hesap", mint_key: "Anahtar oluştur", team: "Takım", generate_code: "Davet kodu oluştur" },
  ar: { nav_docs: "وثائق الواجهة", nav_dashboard: "لوحة التحكم", nav_metrics: "المقاييس", guarantee_title: "خالٍ من التصادم 100% وبشكل مُثبَت", random_title: "يبدو عشوائيًا تمامًا", ratelimit_title: "محدود المعدّل بصرامة", pricing: "التسعير", generate: "توليد", account: "الحساب", members: "الأعضاء", signin_google: "تسجيل الدخول عبر Google", signin_microsoft: "تسجيل الدخول عبر Microsoft", signin_prompt: "سجّل الدخول لإنشاء مفتاح وتوليد المعرفات.", footer: "مزحة. فريد بشكل مُثبَت. لا تستخدمه.", foot_rights: "جميع الحقوق محفوظة.", foot_why: "لماذا؟", foot_terms: "الشروط", foot_privacy: "الخصوصية", language: "اللغة", theme: "السمة", theme_auto: "تلقائي", theme_light: "فاتح", theme_dark: "داكن", new_account: "+ حساب جديد", mint_key: "إنشاء مفتاح", team: "الفريق", generate_code: "إنشاء رمز دعوة" },
  he: { nav_docs: "תיעוד API", nav_dashboard: "לוח בקרה", nav_metrics: "מדדים", guarantee_title: "ללא התנגשויות, מוכח ב-100%", random_title: "נראה אקראי לחלוטין", ratelimit_title: "מוגבל קצב בקפדנות", pricing: "תמחור", generate: "צור", account: "חשבון", members: "חברים", signin_google: "התחבר עם Google", signin_microsoft: "התחבר עם Microsoft", signin_prompt: "התחבר כדי ליצור מפתח ולהפיק מזהים.", footer: "בדיחה. מוכח כייחודי. אל תשתמשו בזה.", foot_rights: "כל הזכויות שמורות.", foot_why: "למה?", foot_terms: "תנאים", foot_privacy: "פרטיות", language: "שפה", theme: "ערכת נושא", theme_auto: "אוטומטי", theme_light: "בהיר", theme_dark: "כהה", new_account: "+ חשבון חדש", mint_key: "צור מפתח", team: "צוות", generate_code: "צור קוד הזמנה" },
  hi: { nav_docs: "API दस्तावेज़", nav_dashboard: "डैशबोर्ड", nav_metrics: "मेट्रिक्स", guarantee_title: "प्रमाणित रूप से 100% टकराव-रहित", random_title: "पूरी तरह यादृच्छिक दिखता है", ratelimit_title: "कठोर दर-सीमा", pricing: "मूल्य", generate: "बनाएँ", account: "खाता", members: "सदस्य", signin_google: "Google से साइन इन करें", signin_microsoft: "Microsoft से साइन इन करें", signin_prompt: "कुंजी बनाने और id जनरेट करने के लिए साइन इन करें।", footer: "एक मज़ाक। प्रमाणित रूप से अद्वितीय। इसका उपयोग न करें।", foot_rights: "सर्वाधिकार सुरक्षित।", foot_why: "क्यों?", foot_terms: "शर्तें", foot_privacy: "गोपनीयता", language: "भाषा", theme: "थीम", theme_auto: "स्वतः", theme_light: "लाइट", theme_dark: "डार्क", new_account: "+ नया खाता", mint_key: "कुंजी बनाएँ", team: "टीम", generate_code: "आमंत्रण कोड बनाएँ" },
  zh: { nav_docs: "API 文档", nav_dashboard: "控制台", nav_metrics: "指标", guarantee_title: "可证明 100% 无冲突", random_title: "看起来完全随机", ratelimit_title: "严格限速", pricing: "价格", generate: "生成", account: "账户", members: "成员", signin_google: "使用 Google 登录", signin_microsoft: "使用 Microsoft 登录", signin_prompt: "登录以创建密钥并生成 ID。", footer: "一个玩笑。可证明唯一。请勿使用。", foot_rights: "版权所有。", foot_why: "为什么？", foot_terms: "条款", foot_privacy: "隐私", language: "语言", theme: "主题", theme_auto: "自动", theme_light: "浅色", theme_dark: "深色", new_account: "+ 新建账户", mint_key: "创建密钥", team: "团队", generate_code: "生成邀请码" },
  ja: { nav_docs: "API ドキュメント", nav_dashboard: "ダッシュボード", nav_metrics: "メトリクス", guarantee_title: "証明可能な 100% 衝突なし", random_title: "完全にランダムに見える", ratelimit_title: "厳しいレート制限", pricing: "料金", generate: "生成", account: "アカウント", members: "メンバー", signin_google: "Google でログイン", signin_microsoft: "Microsoft でログイン", signin_prompt: "ログインしてキーを作成し ID を生成します。", footer: "冗談です。証明可能に一意。使用しないでください。", foot_rights: "無断転載禁止。", foot_why: "なぜ？", foot_terms: "利用規約", foot_privacy: "プライバシー", language: "言語", theme: "テーマ", theme_auto: "自動", theme_light: "ライト", theme_dark: "ダーク", new_account: "+ 新規アカウント", mint_key: "キーを作成", team: "チーム", generate_code: "招待コードを生成" },
  ko: { nav_docs: "API 문서", nav_dashboard: "대시보드", nav_metrics: "지표", guarantee_title: "증명 가능한 100% 충돌 없음", random_title: "완전히 무작위처럼 보임", ratelimit_title: "엄격한 속도 제한", pricing: "요금", generate: "생성", account: "계정", members: "구성원", signin_google: "Google로 로그인", signin_microsoft: "Microsoft로 로그인", signin_prompt: "로그인하여 키를 만들고 ID를 생성하세요.", footer: "농담입니다. 증명 가능하게 고유함. 사용하지 마세요.", foot_rights: "모든 권리 보유.", foot_why: "왜?", foot_terms: "약관", foot_privacy: "개인정보", language: "언어", theme: "테마", theme_auto: "자동", theme_light: "라이트", theme_dark: "다크", new_account: "+ 새 계정", mint_key: "키 생성", team: "팀", generate_code: "초대 코드 생성" },
  vi: { nav_docs: "Tài liệu API", nav_dashboard: "Bảng điều khiển", nav_metrics: "Số liệu", guarantee_title: "Chứng minh được không trùng 100%", random_title: "Trông hoàn toàn ngẫu nhiên", ratelimit_title: "Giới hạn tốc độ nghiêm ngặt", pricing: "Giá", generate: "Tạo", account: "Tài khoản", members: "Thành viên", signin_google: "Đăng nhập bằng Google", signin_microsoft: "Đăng nhập bằng Microsoft", signin_prompt: "Đăng nhập để tạo khóa và sinh id.", footer: "Một trò đùa. Chứng minh được là duy nhất. Đừng dùng.", foot_rights: "Bảo lưu mọi quyền.", foot_why: "Tại sao?", foot_terms: "Điều khoản", foot_privacy: "Quyền riêng tư", language: "Ngôn ngữ", theme: "Giao diện", theme_auto: "Tự động", theme_light: "Sáng", theme_dark: "Tối", new_account: "+ Tài khoản mới", mint_key: "Tạo khóa", team: "Nhóm", generate_code: "Tạo mã mời" },
  id: { nav_docs: "Dokumentasi API", nav_dashboard: "Dasbor", nav_metrics: "Metrik", guarantee_title: "Terbukti 100% bebas tabrakan", random_title: "Terlihat sepenuhnya acak", ratelimit_title: "Dibatasi laju ketat", pricing: "Harga", generate: "Hasilkan", account: "Akun", members: "Anggota", signin_google: "Masuk dengan Google", signin_microsoft: "Masuk dengan Microsoft", signin_prompt: "Masuk untuk membuat kunci dan menghasilkan id.", footer: "Lelucon. Terbukti unik. Jangan gunakan ini.", foot_rights: "Hak cipta dilindungi.", foot_why: "Mengapa?", foot_terms: "Ketentuan", foot_privacy: "Privasi", language: "Bahasa", theme: "Tema", theme_auto: "Otomatis", theme_light: "Terang", theme_dark: "Gelap", new_account: "+ Akun baru", mint_key: "Buat kunci", team: "Tim", generate_code: "Buat kode undangan" },
  th: { nav_docs: "เอกสาร API", nav_dashboard: "แดชบอร์ด", nav_metrics: "เมตริก", guarantee_title: "พิสูจน์ได้ว่าไม่ชนกัน 100%", random_title: "ดูสุ่มอย่างสมบูรณ์", ratelimit_title: "จำกัดอัตราอย่างเข้มงวด", pricing: "ราคา", generate: "สร้าง", account: "บัญชี", members: "สมาชิก", signin_google: "เข้าสู่ระบบด้วย Google", signin_microsoft: "เข้าสู่ระบบด้วย Microsoft", signin_prompt: "เข้าสู่ระบบเพื่อสร้างคีย์และสร้าง id", footer: "เรื่องตลก พิสูจน์ได้ว่าไม่ซ้ำ อย่าใช้สิ่งนี้", foot_rights: "สงวนลิขสิทธิ์", foot_why: "ทำไม?", foot_terms: "ข้อกำหนด", foot_privacy: "ความเป็นส่วนตัว", language: "ภาษา", theme: "ธีม", theme_auto: "อัตโนมัติ", theme_light: "สว่าง", theme_dark: "มืด", new_account: "+ บัญชีใหม่", mint_key: "สร้างคีย์", team: "ทีม", generate_code: "สร้างรหัสเชิญ" },
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
