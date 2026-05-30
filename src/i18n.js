// i18n.js — internationalization for the PUID site.
//
// 20 languages (incl. 2 RTL). Translations cover the high-visibility UI strings;
// anything not translated for a locale falls back to English via t(), so adding a
// language = add a row, and partial translations degrade gracefully. The "support
// every language on Earth" dream is left as an exercise — there are ~7,000, and
// machine-fabricated translations would be worse than an honest English fallback.

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
};

// English is the complete base. Other locales override the core keys; missing
// keys fall back to English. Buttons used by the e2e suite keep their exact
// English text in `en` so selectors stay stable.
const M = {
  en: {
    tagline: "Like a UUID — but it's secretly just a counter.",
    nav_docs: "API Docs",
    nav_dashboard: "Dashboard",
    nav_metrics: "Metrics",
    guarantee_title: "Provably 100% collision-free",
    guarantee_body: "Not “astronomically unlikely” like a random UUID — provably. Each id is a counter run through a bijective permutation, so two ids can never collide.",
    random_title: "Looks completely random",
    random_body: "Id #1 is 64qAN39GjJh5kbi4HROOxh. Nobody can tell it's a counter… until they ask /ordinal, which decodes it right back to #1.",
    ratelimit_title: "Aggressively rate limited",
    ratelimit_body: "One request per second, 1–10 ids each. This is not a limitation. It is the entire value proposition.",
    quickstart: "Quickstart",
    get_key: "Get a key in the dashboard. SDKs for 20 languages, generated from our OpenAPI spec.",
    pricing: "Pricing",
    plan: "Plan",
    price: "Price",
    quota: "Quota",
    rate: "Rate",
    plan_free: "Free",
    plan_hobby: "Hobby",
    plan_enterprise: "Enterprise",
    pricing_joke: "Yes, we charge money to make a counter count faster.",
    footer: "A joke. Provably unique. Do not use this.",
    signin_prompt: "Sign in to mint an API key and generate ids.",
    signin_google: "Sign in with Google",
    signin_microsoft: "Sign in with Microsoft",
    no_password: "No passwords, no email from us — your provider already verified you.",
    account: "Account",
    new_account: "+ New account",
    api_key: "API key",
    mint_key: "Mint a key",
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
    join_meta: "anyone with the link can join until you rotate or revoke",
    joining_disabled: "Joining is currently disabled — there is no active code.",
    owners_only: "Only account owners can manage the join code.",
    language: "Language",
    theme: "Theme",
    theme_light: "Light",
    theme_dark: "Dark",
    theme_auto: "Auto",
  },
  es: { tagline: "Como un UUID, pero en secreto es solo un contador.", nav_docs: "Documentación", nav_dashboard: "Panel", nav_metrics: "Métricas", guarantee_title: "Sin colisiones, demostrablemente al 100 %", random_title: "Parece completamente aleatorio", ratelimit_title: "Con límite de velocidad estricto", pricing: "Precios", plan_free: "Gratis", generate: "Generar", account: "Cuenta", members: "Miembros", signin_google: "Iniciar sesión con Google", signin_microsoft: "Iniciar sesión con Microsoft", signin_prompt: "Inicia sesión para crear una clave y generar ids.", footer: "Una broma. Demostrablemente único. No lo uses.", language: "Idioma", theme: "Tema", new_account: "+ Nueva cuenta", mint_key: "Crear clave", team: "Equipo", generate_code: "Generar código de invitación" },
  fr: { tagline: "Comme un UUID, mais en secret juste un compteur.", nav_docs: "Documentation", nav_dashboard: "Tableau de bord", nav_metrics: "Métriques", guarantee_title: "Sans collision, prouvé à 100 %", random_title: "Semble totalement aléatoire", ratelimit_title: "Débit fortement limité", pricing: "Tarifs", plan_free: "Gratuit", generate: "Générer", account: "Compte", members: "Membres", signin_google: "Se connecter avec Google", signin_microsoft: "Se connecter avec Microsoft", signin_prompt: "Connectez-vous pour créer une clé et générer des ids.", footer: "Une blague. Prouvé unique. Ne l’utilisez pas.", language: "Langue", theme: "Thème", new_account: "+ Nouveau compte", mint_key: "Créer une clé", team: "Équipe", generate_code: "Générer un code d’invitation" },
  de: { tagline: "Wie eine UUID – heimlich aber nur ein Zähler.", nav_docs: "API-Doku", nav_dashboard: "Dashboard", nav_metrics: "Metriken", guarantee_title: "Beweisbar 100 % kollisionsfrei", random_title: "Sieht völlig zufällig aus", ratelimit_title: "Streng ratenbegrenzt", pricing: "Preise", plan_free: "Kostenlos", generate: "Generieren", account: "Konto", members: "Mitglieder", signin_google: "Mit Google anmelden", signin_microsoft: "Mit Microsoft anmelden", signin_prompt: "Melde dich an, um einen Schlüssel zu erstellen und IDs zu generieren.", footer: "Ein Scherz. Beweisbar einzigartig. Nicht verwenden.", language: "Sprache", theme: "Design", new_account: "+ Neues Konto", mint_key: "Schlüssel erstellen", team: "Team", generate_code: "Einladungscode erstellen" },
  pt: { tagline: "Como um UUID, mas no fundo é só um contador.", nav_docs: "Documentação", nav_dashboard: "Painel", nav_metrics: "Métricas", guarantee_title: "Comprovadamente 100 % sem colisões", random_title: "Parece totalmente aleatório", ratelimit_title: "Com limite de taxa rígido", pricing: "Preços", plan_free: "Grátis", generate: "Gerar", account: "Conta", members: "Membros", signin_google: "Entrar com o Google", signin_microsoft: "Entrar com a Microsoft", signin_prompt: "Entre para criar uma chave e gerar ids.", footer: "Uma piada. Comprovadamente único. Não use isto.", language: "Idioma", theme: "Tema", new_account: "+ Nova conta", mint_key: "Criar chave", team: "Equipe", generate_code: "Gerar código de convite" },
  it: { tagline: "Come un UUID, ma in segreto è solo un contatore.", nav_docs: "Documentazione", nav_dashboard: "Dashboard", nav_metrics: "Metriche", guarantee_title: "Senza collisioni, dimostrabilmente al 100%", random_title: "Sembra del tutto casuale", ratelimit_title: "Fortemente limitato", pricing: "Prezzi", plan_free: "Gratis", generate: "Genera", account: "Account", members: "Membri", signin_google: "Accedi con Google", signin_microsoft: "Accedi con Microsoft", signin_prompt: "Accedi per creare una chiave e generare id.", footer: "Uno scherzo. Dimostrabilmente unico. Non usarlo.", language: "Lingua", theme: "Tema", new_account: "+ Nuovo account", mint_key: "Crea chiave", team: "Team", generate_code: "Genera codice d’invito" },
  nl: { tagline: "Als een UUID, maar stiekem gewoon een teller.", nav_docs: "API-docs", nav_dashboard: "Dashboard", nav_metrics: "Statistieken", guarantee_title: "Aantoonbaar 100% botsingvrij", random_title: "Ziet er volledig willekeurig uit", ratelimit_title: "Streng gelimiteerd", pricing: "Prijzen", plan_free: "Gratis", generate: "Genereren", account: "Account", members: "Leden", signin_google: "Inloggen met Google", signin_microsoft: "Inloggen met Microsoft", signin_prompt: "Log in om een sleutel te maken en ids te genereren.", footer: "Een grap. Aantoonbaar uniek. Niet gebruiken.", language: "Taal", theme: "Thema", new_account: "+ Nieuw account", mint_key: "Sleutel maken", team: "Team", generate_code: "Uitnodigingscode genereren" },
  pl: { tagline: "Jak UUID, ale w sekrecie to tylko licznik.", nav_docs: "Dokumentacja", nav_dashboard: "Panel", nav_metrics: "Metryki", guarantee_title: "Dowodnie w 100% bez kolizji", random_title: "Wygląda całkowicie losowo", ratelimit_title: "Silnie ograniczony", pricing: "Cennik", plan_free: "Darmowy", generate: "Generuj", account: "Konto", members: "Członkowie", signin_google: "Zaloguj się przez Google", signin_microsoft: "Zaloguj się przez Microsoft", signin_prompt: "Zaloguj się, aby utworzyć klucz i generować id.", footer: "Żart. Dowodnie unikalne. Nie używaj tego.", language: "Język", theme: "Motyw", new_account: "+ Nowe konto", mint_key: "Utwórz klucz", team: "Zespół", generate_code: "Wygeneruj kod zaproszenia" },
  ru: { tagline: "Как UUID, но втайне это просто счётчик.", nav_docs: "Документация", nav_dashboard: "Панель", nav_metrics: "Метрики", guarantee_title: "Доказуемо без коллизий на 100%", random_title: "Выглядит полностью случайным", ratelimit_title: "Строгое ограничение частоты", pricing: "Цены", plan_free: "Бесплатно", generate: "Сгенерировать", account: "Аккаунт", members: "Участники", signin_google: "Войти через Google", signin_microsoft: "Войти через Microsoft", signin_prompt: "Войдите, чтобы создать ключ и генерировать id.", footer: "Шутка. Доказуемо уникально. Не используйте.", language: "Язык", theme: "Тема", new_account: "+ Новый аккаунт", mint_key: "Создать ключ", team: "Команда", generate_code: "Создать код приглашения" },
  uk: { tagline: "Як UUID, але насправді це просто лічильник.", nav_docs: "Документація", nav_dashboard: "Панель", nav_metrics: "Метрики", guarantee_title: "Доказово на 100% без колізій", random_title: "Виглядає цілком випадково", ratelimit_title: "Суворе обмеження частоти", pricing: "Ціни", plan_free: "Безкоштовно", generate: "Згенерувати", account: "Обліковий запис", members: "Учасники", signin_google: "Увійти через Google", signin_microsoft: "Увійти через Microsoft", signin_prompt: "Увійдіть, щоб створити ключ і генерувати id.", footer: "Жарт. Доказово унікально. Не використовуйте.", language: "Мова", theme: "Тема", new_account: "+ Новий запис", mint_key: "Створити ключ", team: "Команда", generate_code: "Створити код запрошення" },
  tr: { tagline: "UUID gibi ama aslında sadece bir sayaç.", nav_docs: "API Belgeleri", nav_dashboard: "Panel", nav_metrics: "Metrikler", guarantee_title: "Kanıtlanabilir %100 çakışmasız", random_title: "Tamamen rastgele görünür", ratelimit_title: "Sıkı hız sınırı", pricing: "Fiyatlandırma", plan_free: "Ücretsiz", generate: "Oluştur", account: "Hesap", members: "Üyeler", signin_google: "Google ile giriş yap", signin_microsoft: "Microsoft ile giriş yap", signin_prompt: "Anahtar oluşturmak ve id üretmek için giriş yapın.", footer: "Bir şaka. Kanıtlanabilir benzersiz. Bunu kullanmayın.", language: "Dil", theme: "Tema", new_account: "+ Yeni hesap", mint_key: "Anahtar oluştur", team: "Takım", generate_code: "Davet kodu oluştur" },
  ar: { tagline: "مثل UUID، لكنه في الحقيقة مجرد عدّاد.", nav_docs: "وثائق الواجهة", nav_dashboard: "لوحة التحكم", nav_metrics: "المقاييس", guarantee_title: "خالٍ من التصادم 100% وبشكل مُثبَت", random_title: "يبدو عشوائيًا تمامًا", ratelimit_title: "محدود المعدّل بصرامة", pricing: "التسعير", plan_free: "مجاني", generate: "توليد", account: "الحساب", members: "الأعضاء", signin_google: "تسجيل الدخول عبر Google", signin_microsoft: "تسجيل الدخول عبر Microsoft", signin_prompt: "سجّل الدخول لإنشاء مفتاح وتوليد المعرفات.", footer: "مزحة. فريد بشكل مُثبَت. لا تستخدمه.", language: "اللغة", theme: "السمة", new_account: "+ حساب جديد", mint_key: "إنشاء مفتاح", team: "الفريق", generate_code: "إنشاء رمز دعوة" },
  he: { tagline: "כמו UUID, אבל בסוד זה רק מונה.", nav_docs: "תיעוד API", nav_dashboard: "לוח בקרה", nav_metrics: "מדדים", guarantee_title: "ללא התנגשויות, מוכח ב-100%", random_title: "נראה אקראי לחלוטין", ratelimit_title: "מוגבל קצב בקפדנות", pricing: "תמחור", plan_free: "חינם", generate: "צור", account: "חשבון", members: "חברים", signin_google: "התחבר עם Google", signin_microsoft: "התחבר עם Microsoft", signin_prompt: "התחבר כדי ליצור מפתח ולהפיק מזהים.", footer: "בדיחה. מוכח כייחודי. אל תשתמשו בזה.", language: "שפה", theme: "ערכת נושא", new_account: "+ חשבון חדש", mint_key: "צור מפתח", team: "צוות", generate_code: "צור קוד הזמנה" },
  hi: { tagline: "UUID जैसा, पर असल में बस एक काउंटर।", nav_docs: "API दस्तावेज़", nav_dashboard: "डैशबोर्ड", nav_metrics: "मेट्रिक्स", guarantee_title: "प्रमाणित रूप से 100% टकराव-रहित", random_title: "पूरी तरह यादृच्छिक दिखता है", ratelimit_title: "कठोर दर-सीमा", pricing: "मूल्य", plan_free: "मुफ़्त", generate: "बनाएँ", account: "खाता", members: "सदस्य", signin_google: "Google से साइन इन करें", signin_microsoft: "Microsoft से साइन इन करें", signin_prompt: "कुंजी बनाने और id जनरेट करने के लिए साइन इन करें।", footer: "एक मज़ाक। प्रमाणित रूप से अद्वितीय। इसका उपयोग न करें।", language: "भाषा", theme: "थीम", new_account: "+ नया खाता", mint_key: "कुंजी बनाएँ", team: "टीम", generate_code: "आमंत्रण कोड बनाएँ" },
  zh: { tagline: "像 UUID，其实只是个计数器。", nav_docs: "API 文档", nav_dashboard: "控制台", nav_metrics: "指标", guarantee_title: "可证明 100% 无冲突", random_title: "看起来完全随机", ratelimit_title: "严格限速", pricing: "价格", plan_free: "免费", generate: "生成", account: "账户", members: "成员", signin_google: "使用 Google 登录", signin_microsoft: "使用 Microsoft 登录", signin_prompt: "登录以创建密钥并生成 ID。", footer: "一个玩笑。可证明唯一。请勿使用。", language: "语言", theme: "主题", new_account: "+ 新建账户", mint_key: "创建密钥", team: "团队", generate_code: "生成邀请码" },
  ja: { tagline: "UUID のようで、実はただのカウンター。", nav_docs: "API ドキュメント", nav_dashboard: "ダッシュボード", nav_metrics: "メトリクス", guarantee_title: "証明可能な 100% 衝突なし", random_title: "完全にランダムに見える", ratelimit_title: "厳しいレート制限", pricing: "料金", plan_free: "無料", generate: "生成", account: "アカウント", members: "メンバー", signin_google: "Google でログイン", signin_microsoft: "Microsoft でログイン", signin_prompt: "ログインしてキーを作成し ID を生成します。", footer: "冗談です。証明可能に一意。使用しないでください。", language: "言語", theme: "テーマ", new_account: "+ 新規アカウント", mint_key: "キーを作成", team: "チーム", generate_code: "招待コードを生成" },
  ko: { tagline: "UUID 같지만, 사실은 그냥 카운터.", nav_docs: "API 문서", nav_dashboard: "대시보드", nav_metrics: "지표", guarantee_title: "증명 가능한 100% 충돌 없음", random_title: "완전히 무작위처럼 보임", ratelimit_title: "엄격한 속도 제한", pricing: "요금", plan_free: "무료", generate: "생성", account: "계정", members: "구성원", signin_google: "Google로 로그인", signin_microsoft: "Microsoft로 로그인", signin_prompt: "로그인하여 키를 만들고 ID를 생성하세요.", footer: "농담입니다. 증명 가능하게 고유함. 사용하지 마세요.", language: "언어", theme: "테마", new_account: "+ 새 계정", mint_key: "키 생성", team: "팀", generate_code: "초대 코드 생성" },
  vi: { tagline: "Giống UUID, nhưng thật ra chỉ là bộ đếm.", nav_docs: "Tài liệu API", nav_dashboard: "Bảng điều khiển", nav_metrics: "Số liệu", guarantee_title: "Chứng minh được không trùng 100%", random_title: "Trông hoàn toàn ngẫu nhiên", ratelimit_title: "Giới hạn tốc độ nghiêm ngặt", pricing: "Giá", plan_free: "Miễn phí", generate: "Tạo", account: "Tài khoản", members: "Thành viên", signin_google: "Đăng nhập bằng Google", signin_microsoft: "Đăng nhập bằng Microsoft", signin_prompt: "Đăng nhập để tạo khóa và sinh id.", footer: "Một trò đùa. Chứng minh được là duy nhất. Đừng dùng.", language: "Ngôn ngữ", theme: "Giao diện", new_account: "+ Tài khoản mới", mint_key: "Tạo khóa", team: "Nhóm", generate_code: "Tạo mã mời" },
  id: { tagline: "Seperti UUID, tapi diam-diam hanya penghitung.", nav_docs: "Dokumentasi API", nav_dashboard: "Dasbor", nav_metrics: "Metrik", guarantee_title: "Terbukti 100% bebas tabrakan", random_title: "Terlihat sepenuhnya acak", ratelimit_title: "Dibatasi laju ketat", pricing: "Harga", plan_free: "Gratis", generate: "Hasilkan", account: "Akun", members: "Anggota", signin_google: "Masuk dengan Google", signin_microsoft: "Masuk dengan Microsoft", signin_prompt: "Masuk untuk membuat kunci dan menghasilkan id.", footer: "Lelucon. Terbukti unik. Jangan gunakan ini.", language: "Bahasa", theme: "Tema", new_account: "+ Akun baru", mint_key: "Buat kunci", team: "Tim", generate_code: "Buat kode undangan" },
  th: { tagline: "เหมือน UUID แต่จริง ๆ แค่ตัวนับ", nav_docs: "เอกสาร API", nav_dashboard: "แดชบอร์ด", nav_metrics: "เมตริก", guarantee_title: "พิสูจน์ได้ว่าไม่ชนกัน 100%", random_title: "ดูสุ่มอย่างสมบูรณ์", ratelimit_title: "จำกัดอัตราอย่างเข้มงวด", pricing: "ราคา", plan_free: "ฟรี", generate: "สร้าง", account: "บัญชี", members: "สมาชิก", signin_google: "เข้าสู่ระบบด้วย Google", signin_microsoft: "เข้าสู่ระบบด้วย Microsoft", signin_prompt: "เข้าสู่ระบบเพื่อสร้างคีย์และสร้าง id", footer: "เรื่องตลก พิสูจน์ได้ว่าไม่ซ้ำ อย่าใช้สิ่งนี้", language: "ภาษา", theme: "ธีม", new_account: "+ บัญชีใหม่", mint_key: "สร้างคีย์", team: "ทีม", generate_code: "สร้างรหัสเชิญ" },
};

export function pickLocale(request, url) {
  const q = url.searchParams.get("lang");
  if (q && LOCALES[q]) return { locale: q, persist: true };
  const cookie = (request.headers.get("cookie") || "").match(/(?:^|;\s*)lang=([a-z-]+)/);
  if (cookie && LOCALES[cookie[1]]) return { locale: cookie[1], persist: false };
  const al = request.headers.get("accept-language") || "";
  for (const part of al.split(",")) {
    const code = part.split(";")[0].trim().slice(0, 2).toLowerCase();
    if (LOCALES[code]) return { locale: code, persist: false };
  }
  return { locale: "en", persist: false };
}

export function t(locale, key) {
  return (M[locale] && M[locale][key]) ?? M.en[key] ?? key;
}
