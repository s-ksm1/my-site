const authView = document.getElementById("auth-view");
const appView = document.getElementById("app-view");
const authError = document.getElementById("auth-error");
const meLabel = document.getElementById("me");
const syncStatus = document.getElementById("sync-status");
const authThemeSeg = document.getElementById("auth-theme-seg");
const authLangSeg = document.getElementById("auth-lang-seg");
const appThemeSeg = document.getElementById("app-theme-seg");
const appLangSeg = document.getElementById("app-lang-seg");
const authThemeLabel = document.getElementById("auth-theme-label");
const authLangLabel = document.getElementById("auth-lang-label");
const authPitchTitle = document.getElementById("auth-pitch-title");
const authPitchBody = document.getElementById("auth-pitch-body");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const registerBtn = document.getElementById("register-btn");
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");

const noteCategory = document.getElementById("note-category");
const noteCreateTitle = document.getElementById("note-create-title");
const noteCreateBody = document.getElementById("note-create-body");
const createNoteBtn = document.getElementById("create-note-btn");
const toolbarNewNote = document.getElementById("toolbar-new-note");
const notesWrap = document.getElementById("notes");
const searchInput = document.getElementById("search");
const activeFolderLabel = document.getElementById("active-folder-label");
const clearFolderBtn = document.getElementById("clear-folder-btn");

const issueText = document.getElementById("issue-text");
const issueBtn = document.getElementById("send-issue-btn");
const avatarEmojiInput = document.getElementById("avatar-emoji");
const displayNameInput = document.getElementById("display-name");
const appTitleInput = document.getElementById("app-title");
const accentColorInput = document.getElementById("accent-color");
const fontFamilyInput = document.getElementById("font-family");
const bgPatternInput = document.getElementById("bg-pattern");
const densityModeInput = document.getElementById("density-mode");
const motionModeInput = document.getElementById("motion-mode");
const sidebarWidthInput = document.getElementById("sidebar-width");
const profileLinkInput = document.getElementById("profile-link");
const prettyLink = document.getElementById("pretty-link");
const publicSiteLinkInput = document.getElementById("public-site-link");
const refreshPublicLinkBtn = document.getElementById("refresh-public-link-btn");
const copyPublicLinkBtn = document.getElementById("copy-public-link-btn");
const exportSettingsBtn = document.getElementById("export-settings-btn");
const importSettingsBtn = document.getElementById("import-settings-btn");
const importSettingsFile = document.getElementById("import-settings-file");
const authTitle = document.getElementById("auth-title");
const authSubtitle = document.getElementById("auth-subtitle");
const createNoteHeading = document.getElementById("create-note-heading");
const reportIssueHeading = document.getElementById("report-issue-heading");
const customizationHeading = document.getElementById("customization-heading");
const shareWebsiteHeading = document.getElementById("share-website-heading");
const sidebarTreeHint = document.getElementById("sidebar-tree-hint");
const settingsSectionProfileTitle = document.getElementById("settings-section-profile-title");
const settingsSectionAppearanceTitle = document.getElementById("settings-section-appearance-title");
const settingsSectionLinksTitle = document.getElementById("settings-section-links-title");
const settingsSectionDataTitle = document.getElementById("settings-section-data-title");
const settingsSectionSupportTitle = document.getElementById("settings-section-support-title");
const settingsDrawer = document.getElementById("settings-drawer");
const createPanel = document.getElementById("create-panel");
const notesToolbar = document.getElementById("notes-toolbar");
const notesMain = document.getElementById("notes-main");
const asidePanel = document.getElementById("aside-panel");
const folderTreeEl = document.getElementById("folder-tree");
const sidebarTreeSection = document.getElementById("sidebar-tree-section");
const sidebarFoldersHeading = document.getElementById("sidebar-folders-heading");
const mobileNav = document.getElementById("mobile-nav");
const mobileNavNotes = document.getElementById("mobile-nav-notes");
const mobileNavCreate = document.getElementById("mobile-nav-create");
const mobileNavSettings = document.getElementById("mobile-nav-settings");
const notesPanel = document.querySelector("section.grow");
const authSide = document.getElementById("auth-side");
const headerAppTitleEl = document.getElementById("header-app-title");
const metaDescriptionEl = document.getElementById("meta-description");
const creatorSignatureEl = document.getElementById("creator-signature");
const appFooterAuthorEl = document.getElementById("app-footer-author");
const settingsSectionAccountTitle = document.getElementById("settings-section-account-title");
const deleteAccountWarningEl = document.getElementById("delete-account-warning");
const deleteAccountPassword = document.getElementById("delete-account-password");
const deleteAccountBtn = document.getElementById("delete-account-btn");

const API_ERROR_MAP = {
  "No token": "apiErrorNoToken",
  "Invalid token": "apiErrorInvalidToken",
  "Wrong token type": "apiErrorWrongTokenType",
  "Invalid email or password too short": "apiErrorInvalidEmailOrPassword",
  "Email already exists": "apiErrorEmailExists",
  "Invalid credentials": "apiErrorInvalidCredentials",
  "Note not found": "apiErrorNoteNotFound",
  "Empty message": "apiErrorEmptyMessage",
  "Too many attempts, try later": "apiErrorRateLimit",
  "Not found": "apiErrorNotFound",
  "Server error": "apiErrorServer",
  "Password required for account deletion": "apiErrorPasswordRequiredDeletion",
  "User not found": "apiErrorUserNotFound"
};

let token = localStorage.getItem("token") || "";
let user = JSON.parse(localStorage.getItem("user") || "null");
let notes = [];
let syncTimer = null;
let lastSync = 0;
let eventsConnection = null;
let publicLinkTimer = null;
let currentLang = localStorage.getItem("lang") || "ru";
let mobilePanel = "notes";
let searchQuery = "";
let renderSignature = "";
let syncInFlight = false;
let activeFolder = "";
const noteAutosaveTimers = new Map();
const noteLastSavedSnap = new Map();

const I18N = {
  ru: {
    authSubtitle: "PARA: Проекты / Области / Ресурсы / Архивы",
    register: "Регистрация",
    login: "Войти",
    logout: "Выйти",
    createNote: "Создать заметку",
    reportIssue: "Сообщить о проблеме",
    customization: "Настройки",
    settingsProfile: "Профиль",
    settingsAppearance: "Оформление",
    settingsLinks: "Ссылки",
    settingsData: "Данные и резерв",
    settingsSupport: "Обратная связь",
    sidebarTreeHint: "PARA · нажмите папку, чтобы открыть заметки",
    sidebarOptComfort: "Боковая панель: шире",
    sidebarOptNarrow: "Боковая панель: компактнее",
    shareWebsite: "Публичная ссылка",
    navNotes: "Заметки",
    navCreate: "Создать",
    navSettings: "Настройки",
    themeLabel: "Тема",
    languageLabel: "Язык",
    themeAuto: "Авто",
    themeLight: "Светлая",
    themeDark: "Тёмная",
    themeSegAuto: "Авто",
    themeSegLight: "Свет",
    themeSegDark: "Тёмн.",
    authPitchTitle: "My Second Brain — блокнот PARA в браузере",
    authPitchBody:
      "Папки Projects · Areas · Resources · Archives, поиск, синхронизация. Один список задач — меньше хаоса в голове. Сделано для тех, кто думает письменно.",
    langRu: "RU",
    langEn: "EN",
    langUz: "UZ",
    create: "Создать",
    sendIssue: "Отправить разработчику",
    refreshLink: "Обновить ссылку",
    copyLink: "Копировать ссылку",
    exportSettings: "Экспорт настроек",
    importSettings: "Импорт настроек",
    searchPlaceholder: "Поиск заметок...",
    searchFocusShortcut: "Быстрый фокус: Ctrl+K или /",
    noteTitlePlaceholder: "Заголовок",
    noteBodyPlaceholder: "Текст заметки…",
    toolbarNewNote: "＋ Новая заметка в «{folder}»",
    toolbarNewNoteGeneric: "＋ Создать заметку",
    aboutAppSummary: "Зачем этот сервис",
    aboutAppDetail:
      "Это личный PARA-блокнот в браузере: проекты, области, ресурсы и архив в одном месте, с поиском и синхронизацией между устройствами.\n\nВместо хаоса вкладок вы складываете мысли по смыслу: в «Проектах» — то, над чем работаете сейчас; в «Областях» — зоны ответственности без жёсткого дедлайна; в «Ресурсах» — справки, ссылки, идеи; в «Архиве» — завершённое и неактуальное, чтобы не мешало фокусу.\n\nМинимум отвлечений: быстрый ввод, папки PARA, резерв настроек и live-синхронизация при работе онлайн. Данные привязаны к вашему аккаунту.\n\nЕсли вам важны ясность и спокойный ритм вместо шума — это инструмент под ваш «второй мозг».",
    authUserCount: "Уже зарегистрировано пользователей: {n}",
    emptyNoteCombined: "Введите заголовок или текст заметки.",
    untitledNote: "Без названия",
    issuePlaceholder: "Опишите проблему",
    displayNamePlaceholder: "Отображаемое имя",
    appTitlePlaceholder: "Название приложения",
    profileLinkPlaceholder: "Ваша ссылка (https://...)",
    publicLinkPlaceholder: "Запустите go-online.cmd для ссылки",
    noNotes: "Пока нет заметок.",
    chooseFolder: "Выберите папку в боковой панели слева.",
    emptyFolder: "В этой папке нет заметок.",
    sidebarFolders: "Папки",
    allFolders: "Все папки",
    save: "Сохранить",
    del: "Удалить",
    copied: "Публичная ссылка скопирована.",
    noLink: "Сначала запустите go-online.cmd.",
    imported: "Настройки импортированы.",
    importError: "Не удалось импортировать JSON настроек.",
    issueSent: "Отправлено.",
    invalidEmail: "Введите корректный email.",
    undo: "Отменить",
    toastNoteDeleted: "Заметка удалена",
    toastRestored: "Заметка восстановлена",
    toastOffline: "Нет подключения к сети",
    toastOnline: "Подключение восстановлено",
    sessionExpired: "Сессия недействительна. Войдите снова.",
    skipToContent: "К основному содержимому",
    syncing: "Синхронизация...",
    syncError: "Ошибка синхронизации",
    liveConnected: "Live-синхронизация подключена",
    liveReconnect: "Live-синхронизация переподключается...",
    liveParseError: "Ошибка Live-синхронизации",
    openLink: "🔗 Открыть ссылку",
    category: { projects: "📁 Проекты", areas: "🎯 Области", resources: "📚 Ресурсы", archives: "🗄️ Архивы" },
    categoryPlain: { projects: "Проекты", areas: "Области", resources: "Ресурсы", archives: "Архивы" },
    settingsAccount: "Аккаунт",
    deleteAccountWarning:
      "Удаление необратимо: все заметки и данные профиля будут безвозвратно удалены с сервера. Введите пароль и подтвердите.",
    deleteAccountPasswordPlaceholder: "Текущий пароль",
    deleteAccountBtn: "Удалить аккаунт навсегда",
    deleteAccountConfirm: "Удалить аккаунт и все заметки? Это нельзя отменить.",
    toastAccountDeleted: "Аккаунт удалён",
    creatorSignature: "Создатель: Сергей Курбанов",
    footerAuthor: "Сергей Курбанов",
    placeholderEmail: "Email",
    placeholderPasswordAuth: "Пароль (мин. 6 символов)",
    appearanceAuthAria: "Оформление экрана входа",
    avatarPlaceholder: "Эмодзи аватара (например 🚀)",
    metaDescription:
      "PARA-блокнот в браузере: проекты, области, ресурсы, архивы, поиск и синхронизация между устройствами.",
    defaultAppTitle: "My Second Brain",
    syncedPrefix: "Синхронизировано",
    liveSyncedPrefix: "Live",
    accentBlue: "Акцент: синий",
    accentPurple: "Акцент: фиолетовый",
    accentGreen: "Акцент: зелёный",
    accentOrange: "Акцент: оранжевый",
    fontSans: "Шрифт: без засечек",
    fontSerif: "Шрифт: с засечками",
    fontMono: "Шрифт: моноширинный",
    bgNone: "Фон: без узора",
    bgDots: "Фон: точки",
    bgGrid: "Фон: сетка",
    densityCozy: "Плотность: просторно",
    densityCompact: "Плотность: компактно",
    motionSmooth: "Анимация: обычная",
    motionReduced: "Анимация: уменьшенная",
    accentAria: "Цвет акцента",
    fontAria: "Шрифт",
    bgAria: "Узор фона",
    densityAria: "Плотность интерфейса",
    motionAria: "Анимация",
    sidebarAria: "Ширина боковой панели",
    foldersAria: "Папки PARA",
    apiErrorNoToken: "Нет токена авторизации",
    apiErrorInvalidToken: "Недействительный токен",
    apiErrorWrongTokenType: "Неверный тип токена",
    apiErrorInvalidEmailOrPassword: "Некорректный email или слишком короткий пароль",
    apiErrorEmailExists: "Этот email уже зарегистрирован",
    apiErrorInvalidCredentials: "Неверный email или пароль",
    apiErrorNoteNotFound: "Заметка не найдена",
    apiErrorEmptyMessage: "Пустое сообщение",
    apiErrorRateLimit: "Слишком много попыток, попробуйте позже",
    apiErrorNotFound: "Не найдено",
    apiErrorServer: "Ошибка сервера",
    apiErrorPasswordRequiredDeletion: "Для удаления аккаунта укажите пароль",
    apiErrorUserNotFound: "Пользователь не найден",
    apiErrorGeneric: "Запрос не выполнен",
    apiErrorEventsToken: "Не удалось подключить live-синхронизацию",
    importSettingsFileInvalid: "Неверный файл настроек"
  },
  en: {
    authSubtitle: "PARA: Projects / Areas / Resources / Archives",
    register: "Register",
    login: "Login",
    logout: "Logout",
    createNote: "Create note",
    reportIssue: "Report issue",
    customization: "Settings",
    settingsProfile: "Profile",
    settingsAppearance: "Appearance",
    settingsLinks: "Links",
    settingsData: "Data & backup",
    settingsSupport: "Feedback",
    sidebarTreeHint: "PARA · click a folder to open notes",
    sidebarOptComfort: "Sidebar: comfortable",
    sidebarOptNarrow: "Sidebar: compact",
    shareWebsite: "Public link",
    navNotes: "Notes",
    navCreate: "Create",
    navSettings: "Settings",
    themeLabel: "Theme",
    languageLabel: "Language",
    themeAuto: "Auto",
    themeLight: "Light",
    themeDark: "Dark",
    themeSegAuto: "Auto",
    themeSegLight: "Light",
    themeSegDark: "Dark",
    authPitchTitle: "My Second Brain — PARA notebook in your browser",
    authPitchBody:
      "Projects, Areas, Resources, Archives — search and sync across devices. Fewer tabs, more clarity. Built for people who think in notes.",
    langRu: "RU",
    langEn: "EN",
    langUz: "UZ",
    create: "Create",
    sendIssue: "Send to developer",
    refreshLink: "Refresh link",
    copyLink: "Copy link",
    exportSettings: "Export settings",
    importSettings: "Import settings",
    searchPlaceholder: "Search notes...",
    searchFocusShortcut: "Focus search: Ctrl+K or /",
    noteTitlePlaceholder: "Title",
    noteBodyPlaceholder: "Note body…",
    toolbarNewNote: "＋ New note in “{folder}”",
    toolbarNewNoteGeneric: "＋ Create note",
    aboutAppSummary: "What this app is for",
    aboutAppDetail:
      "A personal PARA notebook in the browser — Projects, Areas, Resources, and Archives in one place, with search and sync across your devices.\n\nInstead of a mess of tabs, you file thoughts by meaning: Projects for active work, Areas for ongoing responsibilities, Resources for references and ideas, and Archives for finished or inactive items so they do not steal focus.\n\nLow-friction capture, PARA folders, settings export, and live sync when you are online. Your data belongs to your account.\n\nIf you value clarity and a calm pace over noise, this is built as a second brain you actually use.",
    authUserCount: "People registered so far: {n}",
    emptyNoteCombined: "Add a title or some note text.",
    untitledNote: "Untitled",
    issuePlaceholder: "Describe the issue",
    displayNamePlaceholder: "Display name",
    appTitlePlaceholder: "App title",
    profileLinkPlaceholder: "Your link (https://...)",
    publicLinkPlaceholder: "Run go-online.cmd to get link",
    noNotes: "No notes yet.",
    chooseFolder: "Pick a folder in the left sidebar.",
    emptyFolder: "No notes in this folder.",
    sidebarFolders: "Folders",
    allFolders: "All folders",
    save: "Save",
    del: "Delete",
    copied: "Public link copied.",
    noLink: "No public link yet. Run go-online.cmd first.",
    imported: "Settings imported.",
    importError: "Could not import settings JSON.",
    issueSent: "Issue sent.",
    invalidEmail: "Enter a valid email address.",
    undo: "Undo",
    toastNoteDeleted: "Note deleted",
    toastRestored: "Note restored",
    toastOffline: "You are offline",
    toastOnline: "Back online",
    sessionExpired: "Session expired. Please sign in again.",
    skipToContent: "Skip to content",
    syncing: "Syncing...",
    syncError: "Sync error",
    liveConnected: "Live sync connected",
    liveReconnect: "Live sync reconnecting...",
    liveParseError: "Live sync parse error",
    openLink: "🔗 Open link",
    category: { projects: "📁 Projects", areas: "🎯 Areas", resources: "📚 Resources", archives: "🗄️ Archives" },
    categoryPlain: { projects: "Projects", areas: "Areas", resources: "Resources", archives: "Archives" },
    settingsAccount: "Account",
    deleteAccountWarning:
      "This cannot be undone. All notes and your profile will be permanently removed from the server. Enter your password to confirm.",
    deleteAccountPasswordPlaceholder: "Current password",
    deleteAccountBtn: "Delete account permanently",
    deleteAccountConfirm: "Delete your account and all notes? This cannot be undone.",
    toastAccountDeleted: "Account deleted",
    creatorSignature: "Creator: Sergey Kurbanov",
    footerAuthor: "Sergey Kurbanov",
    placeholderEmail: "Email",
    placeholderPasswordAuth: "Password (min 6 characters)",
    appearanceAuthAria: "Sign-in appearance",
    avatarPlaceholder: "Avatar emoji (e.g. 🚀)",
    metaDescription:
      "PARA notebook in the browser — projects, areas, resources, archives, sync, and search across devices.",
    defaultAppTitle: "My Second Brain",
    syncedPrefix: "Synced",
    liveSyncedPrefix: "Live",
    accentBlue: "Accent: Blue",
    accentPurple: "Accent: Purple",
    accentGreen: "Accent: Green",
    accentOrange: "Accent: Orange",
    fontSans: "Font: Sans",
    fontSerif: "Font: Serif",
    fontMono: "Font: Mono",
    bgNone: "Background: None",
    bgDots: "Background: Dots",
    bgGrid: "Background: Grid",
    densityCozy: "Density: Cozy",
    densityCompact: "Density: Compact",
    motionSmooth: "Motion: Smooth",
    motionReduced: "Motion: Reduced",
    accentAria: "Accent color",
    fontAria: "Font family",
    bgAria: "Background pattern",
    densityAria: "Density",
    motionAria: "Motion",
    sidebarAria: "Sidebar width",
    foldersAria: "PARA folders",
    apiErrorNoToken: "No authorization token",
    apiErrorInvalidToken: "Invalid token",
    apiErrorWrongTokenType: "Wrong token type",
    apiErrorInvalidEmailOrPassword: "Invalid email or password too short",
    apiErrorEmailExists: "Email already registered",
    apiErrorInvalidCredentials: "Invalid email or password",
    apiErrorNoteNotFound: "Note not found",
    apiErrorEmptyMessage: "Empty message",
    apiErrorRateLimit: "Too many attempts, try again later",
    apiErrorNotFound: "Not found",
    apiErrorServer: "Server error",
    apiErrorPasswordRequiredDeletion: "Password required to delete account",
    apiErrorUserNotFound: "User not found",
    apiErrorGeneric: "Request failed",
    apiErrorEventsToken: "Could not connect live sync",
    importSettingsFileInvalid: "Invalid settings file"
  },
  uz: {
    authSubtitle: "PARA: Loyihalar / Sohalar / Resurslar / Arxivlar",
    register: "Ro'yxatdan o'tish",
    login: "Kirish",
    logout: "Chiqish",
    createNote: "Eslatma yaratish",
    reportIssue: "Muammo haqida yuborish",
    customization: "Sozlamalar",
    settingsProfile: "Profil",
    settingsAppearance: "Ko‘rinish",
    settingsLinks: "Havolalar",
    settingsData: "Ma’lumot va nusxa",
    settingsSupport: "Fikr-mulohaza",
    sidebarTreeHint: "PARA · eslatmalar uchun papkani bosing",
    sidebarOptComfort: "Yon panel: keng",
    sidebarOptNarrow: "Yon panel: ixcham",
    shareWebsite: "Ommaviy havola",
    navNotes: "Eslatmalar",
    navCreate: "Yaratish",
    navSettings: "Sozlamalar",
    themeLabel: "Mavzu",
    languageLabel: "Til",
    themeAuto: "Avto",
    themeLight: "Yorug‘",
    themeDark: "Qorong‘i",
    themeSegAuto: "Avto",
    themeSegLight: "Yoru",
    themeSegDark: "Qora",
    authPitchTitle: "My Second Brain — brauzerda PARA daftarchasi",
    authPitchBody:
      "Loyihalar, sohalar, resurslar, arxiv — qidiruv va qurilmalar orasida sinxron. Kamroq xaos, ko‘proq tartib. Yozishni yurak bilan qiladiganlar uchun.",
    langRu: "RU",
    langEn: "EN",
    langUz: "UZ",
    create: "Yaratish",
    sendIssue: "Dasturchiga yuborish",
    refreshLink: "Havolani yangilash",
    copyLink: "Havolani nusxalash",
    exportSettings: "Sozlamalarni eksport",
    importSettings: "Sozlamalarni import",
    searchPlaceholder: "Eslatmalarni qidirish...",
    searchFocusShortcut: "Ctrl+K yoki / — qidiruv",
    noteTitlePlaceholder: "Sarlavha",
    noteBodyPlaceholder: "Eslatma matni…",
    toolbarNewNote: "＋ «{folder}» da yangi eslatma",
    toolbarNewNoteGeneric: "＋ Eslatma yaratish",
    aboutAppSummary: "Bu servis nima uchun",
    aboutAppDetail:
      "Bu shaxsiy PARA daftarchasi: loyihalar, sohalar, resurslar va arxiv bir joyda, qidiruv va qurilmalar orasida sinxronlash bilan.\n\nCheksiz varaqlar o‘rniga fikrlarni mazmun bo‘yicha joylaysiz: «Loyihalar» — hozir ishlayotganingiz; «Sohalar» — mas’uliyat zonasi; «Resurslar» — ma’lumot va g‘oyalar; «Arxiv» — tugagan yoki hozircha keraksiz.\n\nTez yozish, PARA papkalari, sozlamalarni eksport va onlaynda live-sinxron. Ma’lumotlar hisobingizga bog‘langan.\n\nAniqlik va tinch ritm muhim bo‘lsa — bu ikkinchi miya uchun vosita.",
    authUserCount: "Hozircha ro‘yxatdan o‘tganlar: {n}",
    emptyNoteCombined: "Sarlavha yoki matn kiriting.",
    untitledNote: "Nomsiz",
    issuePlaceholder: "Muammoni yozing",
    displayNamePlaceholder: "Ko'rinadigan ism",
    appTitlePlaceholder: "Ilova nomi",
    profileLinkPlaceholder: "Sizning havolangiz (https://...)",
    publicLinkPlaceholder: "Havola uchun go-online.cmd ni ishga tushiring",
    noNotes: "Hozircha eslatmalar yo'q.",
    chooseFolder: "Chap paneldan papkani tanlang.",
    emptyFolder: "Bu papkada eslatma yo'q.",
    sidebarFolders: "Papkalar",
    allFolders: "Barcha papkalar",
    save: "Saqlash",
    del: "O'chirish",
    copied: "Public havola nusxalandi.",
    noLink: "Avval go-online.cmd ni ishga tushiring.",
    imported: "Sozlamalar import qilindi.",
    importError: "Sozlamalar JSON import bo'lmadi.",
    issueSent: "Yuborildi.",
    invalidEmail: "To'g'ri email kiriting.",
    undo: "Bekor qilish",
    toastNoteDeleted: "Eslatma o'chirildi",
    toastRestored: "Eslatma tiklandi",
    toastOffline: "Tarmoq yo'q",
    toastOnline: "Yana onlayn",
    sessionExpired: "Sessiya tugadi. Qayta kiring.",
    skipToContent: "Asosiy qismga",
    syncing: "Sinxronlash...",
    syncError: "Sinxronlash xatosi",
    liveConnected: "Live sinxronlash ulandi",
    liveReconnect: "Live sinxronlash qayta ulanmoqda...",
    liveParseError: "Live sinxronlash xatosi",
    openLink: "🔗 Havolani ochish",
    category: { projects: "📁 Loyihalar", areas: "🎯 Sohalar", resources: "📚 Resurslar", archives: "🗄️ Arxivlar" },
    categoryPlain: { projects: "Loyihalar", areas: "Sohalar", resources: "Resurslar", archives: "Arxivlar" },
    settingsAccount: "Hisob",
    deleteAccountWarning:
      "Bu qaytarib bo‘lmaydi: barcha eslatmalar va profil ma’lumotlari serverdan butunlay o‘chiriladi. Parolni kiriting va tasdiqlang.",
    deleteAccountPasswordPlaceholder: "Joriy parol",
    deleteAccountBtn: "Hisobni butunlay o‘chirish",
    deleteAccountConfirm: "Hisob va barcha eslatmalarni o‘chirish? Bu bekor qilinmaydi.",
    toastAccountDeleted: "Hisob o‘chirildi",
    creatorSignature: "Muallif: Sergey Kurbanov",
    footerAuthor: "Sergey Kurbanov",
    placeholderEmail: "Email",
    placeholderPasswordAuth: "Parol (kamida 6 belgi)",
    appearanceAuthAria: "Kirish ekrani ko‘rinishi",
    avatarPlaceholder: "Avatar emoji (masalan 🚀)",
    metaDescription:
      "Brauzerda PARA daftarchasi: loyihalar, sohalar, resurslar, arxivlar, qidiruv va qurilmalararo sinxron.",
    defaultAppTitle: "My Second Brain",
    syncedPrefix: "Sinxron",
    liveSyncedPrefix: "Live",
    accentBlue: "Aksent: ko‘k",
    accentPurple: "Aksent: binafsha",
    accentGreen: "Aksent: yashil",
    accentOrange: "Aksent: to‘q sariq",
    fontSans: "Shrift: sans",
    fontSerif: "Shrift: serif",
    fontMono: "Shrift: mono",
    bgNone: "Fon: yo‘q",
    bgDots: "Fon: nuqtalar",
    bgGrid: "Fon: panjara",
    densityCozy: "Zichlik: keng",
    densityCompact: "Zichlik: ixcham",
    motionSmooth: "Animatsiya: oddiy",
    motionReduced: "Animatsiya: kamaytirilgan",
    accentAria: "Aksent rangi",
    fontAria: "Shrift oilasi",
    bgAria: "Fon naqshi",
    densityAria: "Interfeys zichligi",
    motionAria: "Animatsiya",
    sidebarAria: "Yon panel kengligi",
    foldersAria: "PARA papkalari",
    apiErrorNoToken: "Avtorizatsiya tokeni yo‘q",
    apiErrorInvalidToken: "Token yaroqsiz",
    apiErrorWrongTokenType: "Token turi noto‘g‘ri",
    apiErrorInvalidEmailOrPassword: "Email noto‘g‘ri yoki parol juda qisqa",
    apiErrorEmailExists: "Bu email allaqachon ro‘yxatdan o‘tgan",
    apiErrorInvalidCredentials: "Email yoki parol noto‘g‘ri",
    apiErrorNoteNotFound: "Eslatma topilmadi",
    apiErrorEmptyMessage: "Xabar bo‘sh",
    apiErrorRateLimit: "Juda ko‘p urinish, keyinroq qayting",
    apiErrorNotFound: "Topilmadi",
    apiErrorServer: "Server xatosi",
    apiErrorPasswordRequiredDeletion: "Hisobni o‘chirish uchun parol kerak",
    apiErrorUserNotFound: "Foydalanuvchi topilmadi",
    apiErrorGeneric: "So‘rov bajarilmadi",
    apiErrorEventsToken: "Live sinxronlashni ulab bo‘lmadi",
    importSettingsFileInvalid: "Sozlamalar fayli noto‘g‘ri"
  }
};

function t(key) {
  return I18N[currentLang]?.[key] || I18N.en[key] || key;
}

function translateApiError(raw) {
  const s = raw != null ? String(raw) : "";
  const mapped = API_ERROR_MAP[s];
  if (mapped) return t(mapped);
  if (!s) return t("apiErrorGeneric");
  return s;
}

function translateClientError(msg) {
  const s = msg != null ? String(msg) : "";
  if (s === "events-token") return t("apiErrorEventsToken");
  if (s === "IMPORT_SETTINGS_INVALID") return t("importSettingsFileInvalid");
  return s;
}

function formatLocaleTag() {
  if (currentLang === "uz") return "uz-UZ";
  if (currentLang === "ru") return "ru-RU";
  return "en-US";
}

function updateAppearanceSelectLabels() {
  const accentKeys = { blue: "accentBlue", purple: "accentPurple", green: "accentGreen", orange: "accentOrange" };
  if (accentColorInput) {
    accentColorInput.setAttribute("aria-label", t("accentAria"));
    Object.entries(accentKeys).forEach(([val, key]) => {
      const opt = accentColorInput.querySelector(`option[value="${val}"]`);
      if (opt) opt.textContent = t(key);
    });
  }
  const fontKeys = { sans: "fontSans", serif: "fontSerif", mono: "fontMono" };
  if (fontFamilyInput) {
    fontFamilyInput.setAttribute("aria-label", t("fontAria"));
    Object.entries(fontKeys).forEach(([val, key]) => {
      const opt = fontFamilyInput.querySelector(`option[value="${val}"]`);
      if (opt) opt.textContent = t(key);
    });
  }
  const bgKeys = { none: "bgNone", dots: "bgDots", grid: "bgGrid" };
  if (bgPatternInput) {
    bgPatternInput.setAttribute("aria-label", t("bgAria"));
    Object.entries(bgKeys).forEach(([val, key]) => {
      const opt = bgPatternInput.querySelector(`option[value="${val}"]`);
      if (opt) opt.textContent = t(key);
    });
  }
  const densityKeys = { cozy: "densityCozy", compact: "densityCompact" };
  if (densityModeInput) {
    densityModeInput.setAttribute("aria-label", t("densityAria"));
    Object.entries(densityKeys).forEach(([val, key]) => {
      const opt = densityModeInput.querySelector(`option[value="${val}"]`);
      if (opt) opt.textContent = t(key);
    });
  }
  const motionKeys = { smooth: "motionSmooth", reduced: "motionReduced" };
  if (motionModeInput) {
    motionModeInput.setAttribute("aria-label", t("motionAria"));
    Object.entries(motionKeys).forEach(([val, key]) => {
      const opt = motionModeInput.querySelector(`option[value="${val}"]`);
      if (opt) opt.textContent = t(key);
    });
  }
  if (sidebarWidthInput) {
    sidebarWidthInput.setAttribute("aria-label", t("sidebarAria"));
    const opts = sidebarWidthInput.options;
    if (opts[0]) opts[0].textContent = t("sidebarOptComfort");
    if (opts[1]) opts[1].textContent = t("sidebarOptNarrow");
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderAboutBody() {
  const bodyEl = document.getElementById("about-app-body");
  const summaryEl = document.getElementById("about-app-summary");
  if (summaryEl) summaryEl.textContent = t("aboutAppSummary");
  if (!bodyEl) return;
  bodyEl.textContent = "";
  const raw = t("aboutAppDetail");
  raw.split(/\n\n+/).forEach((para) => {
    const trimmed = para.trim();
    if (!trimmed) return;
    const p = document.createElement("p");
    p.textContent = trimmed;
    bodyEl.appendChild(p);
  });
}

async function loadAuthStats() {
  const el = document.getElementById("auth-user-stats");
  if (!el) return;
  el.dataset.loading = "1";
  try {
    const res = await fetch("/api/stats");
    const data = await res.json().catch(() => ({}));
    const n = Number(data.userCount);
    el.textContent = Number.isFinite(n) ? t("authUserCount").replace(/\{n\}/g, String(n)) : "";
  } catch {
    el.textContent = "";
  } finally {
    delete el.dataset.loading;
  }
}

let toastHideTimer = null;

function showToast(message, options = {}) {
  const host = document.getElementById("toast-host");
  if (!host || !message) return;
  const { variant = "default", duration = 4200, actionLabel, onAction } = options;
  host.innerHTML = "";
  const wrap = document.createElement("div");
  wrap.className = `toast toast--${variant}`;
  wrap.setAttribute("role", "status");
  const msg = document.createElement("p");
  msg.className = "toast__msg";
  msg.textContent = message;
  wrap.appendChild(msg);
  if (actionLabel && typeof onAction === "function") {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "toast__action";
    btn.textContent = actionLabel;
    btn.addEventListener("click", () => {
      if (toastHideTimer) clearTimeout(toastHideTimer);
      toastHideTimer = null;
      onAction();
      host.innerHTML = "";
    });
    wrap.appendChild(btn);
  }
  host.appendChild(wrap);
  if (toastHideTimer) clearTimeout(toastHideTimer);
  toastHideTimer = setTimeout(() => {
    host.innerHTML = "";
    toastHideTimer = null;
  }, duration);
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
}

function updateMetaThemeColor() {
  let meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("name", "theme-color");
    document.head.appendChild(meta);
  }
  const resolved = document.documentElement.getAttribute("data-theme") === "dark" ? "#030712" : "#f3f4f6";
  meta.setAttribute("content", resolved);
}

function debounce(fn, delayMs) {
  let timer = null;
  return (...args) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delayMs);
  };
}

const THEME_OPTIONS = [
  { value: "auto", labelKey: "themeAuto", segmentKey: "themeSegAuto" },
  { value: "light", labelKey: "themeLight", segmentKey: "themeSegLight" },
  { value: "dark", labelKey: "themeDark", segmentKey: "themeSegDark" }
];

const LANG_OPTIONS = [
  { value: "ru", labelKey: "langRu" },
  { value: "en", labelKey: "langEn" },
  { value: "uz", labelKey: "langUz" }
];

function renderThemeSegmentHTML() {
  return THEME_OPTIONS.map((opt) => {
    const full = t(opt.labelKey);
    const shortLabel = t(opt.segmentKey);
    const safeVal = escapeHtml(opt.value);
    return `<button type="button" class="segment-btn" data-value="${safeVal}" aria-pressed="false" aria-label="${escapeHtml(
      full
    )}" title="${escapeHtml(full)}">${escapeHtml(shortLabel)}</button>`;
  }).join("");
}

function renderLangSegmentHTML() {
  return LANG_OPTIONS.map(
    (opt) =>
      `<button type="button" class="segment-btn" data-value="${opt.value}" aria-pressed="false">${escapeHtml(
        t(opt.labelKey)
      )}</button>`
  ).join("");
}

function syncThemeSegmentsVisual(storedMode) {
  [authThemeSeg, appThemeSeg].forEach((container) => {
    if (!container) return;
    const idx = Math.max(
      0,
      THEME_OPTIONS.findIndex((o) => o.value === storedMode)
    );
    container.style.setProperty("--segment-index", String(idx));
    container.querySelectorAll(".segment-btn").forEach((btn) => {
      const on = btn.dataset.value === storedMode;
      btn.classList.toggle("is-active", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });
  });
}

function syncLangSegmentsVisual() {
  [authLangSeg, appLangSeg].forEach((container) => {
    if (!container) return;
    const idx = Math.max(0, LANG_OPTIONS.findIndex((o) => o.value === currentLang));
    container.style.setProperty("--segment-index", String(idx));
    container.querySelectorAll(".segment-btn").forEach((btn) => {
      const on = btn.dataset.value === currentLang;
      btn.classList.toggle("is-active", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });
  });
}

function refreshSegmentToggleLabels() {
  [authThemeSeg, appThemeSeg].forEach((el) => {
    if (!el) return;
    el.innerHTML = `<div class="segment-toggle__track">${renderThemeSegmentHTML()}</div>`;
  });
  [authLangSeg, appLangSeg].forEach((el) => {
    if (!el) return;
    el.innerHTML = `<div class="segment-toggle__track">${renderLangSegmentHTML()}</div>`;
  });
  syncThemeSegmentsVisual(getThemeMode());
  syncLangSegmentsVisual();
}

let segmentListenersBound = false;

function bindSegmentListenersOnce() {
  if (segmentListenersBound) return;
  segmentListenersBound = true;
  document.body.addEventListener("click", (event) => {
    const btn = event.target.closest(".segment-toggle .segment-btn");
    if (!btn) return;
    const container = btn.closest(".segment-toggle");
    if (!container) return;
    const setting = container.dataset.setting;
    const value = btn.dataset.value;
    if (setting === "theme") {
      localStorage.setItem("theme-mode", value);
      applyTheme(value);
      syncThemeSegmentsVisual(value);
    }
    if (setting === "lang") {
      currentLang = value;
      applyLanguage();
      renderSignature = "";
      renderNotes();
      syncLangSegmentsVisual();
    }
  });
}

function getAvatarEmoji() {
  return localStorage.getItem("avatar-emoji") || "";
}

function getDisplayName() {
  return localStorage.getItem("display-name") || "";
}

function getAppTitle() {
  return localStorage.getItem("app-title") || "";
}

function getAccentColor() {
  return localStorage.getItem("accent-color") || "blue";
}

function getProfileLink() {
  return localStorage.getItem("profile-link") || "";
}

function getFontFamily() {
  return localStorage.getItem("font-family") || "sans";
}

function getBgPattern() {
  return localStorage.getItem("bg-pattern") || "none";
}

function getDensityMode() {
  return localStorage.getItem("density-mode") || "cozy";
}

function getMotionMode() {
  return localStorage.getItem("motion-mode") || "smooth";
}

function getSidebarWidth() {
  return localStorage.getItem("sidebar-width") || "comfortable";
}

function applySidebarWidth(mode) {
  const next = mode === "narrow" ? "narrow" : "comfortable";
  document.documentElement.setAttribute("data-sidebar-width", next);
  if (sidebarWidthInput) {
    sidebarWidthInput.value = next;
  }
}

function getSettings() {
  return {
    lang: currentLang,
    avatarEmoji: getAvatarEmoji(),
    displayName: getDisplayName(),
    appTitle: getAppTitle(),
    accentColor: getAccentColor(),
    fontFamily: getFontFamily(),
    bgPattern: getBgPattern(),
    densityMode: getDensityMode(),
    motionMode: getMotionMode(),
    sidebarWidth: getSidebarWidth(),
    profileLink: getProfileLink()
  };
}

function categoryLabel(value) {
  const map = t("category");
  return map[value] || value;
}

function categorySidebarLabel(value) {
  const pack = I18N[currentLang]?.categoryPlain;
  if (pack && pack[value]) return pack[value];
  return categoryLabel(value);
}

function normalizeLink(value) {
  const trimmed = String(value || "").trim();
  if (!trimmed) return "";
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function formatPrettyLink(url) {
  try {
    const parsed = new URL(url);
    return `🔗 ${parsed.hostname.replace(/^www\./i, "")}`;
  } catch (error) {
    return t("openLink");
  }
}

function applyLanguage() {
  localStorage.setItem("lang", currentLang);
  const htmlLang = currentLang === "en" ? "en" : currentLang === "uz" ? "uz" : "ru";
  document.documentElement.setAttribute("lang", htmlLang);
  if (authThemeLabel) authThemeLabel.textContent = t("themeLabel");
  if (authLangLabel) authLangLabel.textContent = t("languageLabel");
  if (authPitchTitle) authPitchTitle.textContent = t("authPitchTitle");
  if (authPitchBody) authPitchBody.textContent = t("authPitchBody");
  if (sidebarFoldersHeading) sidebarFoldersHeading.textContent = t("sidebarFolders");
  if (sidebarTreeHint) sidebarTreeHint.textContent = t("sidebarTreeHint");
  if (settingsSectionProfileTitle) settingsSectionProfileTitle.textContent = t("settingsProfile");
  if (settingsSectionAppearanceTitle) settingsSectionAppearanceTitle.textContent = t("settingsAppearance");
  if (settingsSectionLinksTitle) settingsSectionLinksTitle.textContent = t("settingsLinks");
  if (settingsSectionDataTitle) settingsSectionDataTitle.textContent = t("settingsData");
  if (settingsSectionSupportTitle) settingsSectionSupportTitle.textContent = t("settingsSupport");
  if (settingsSectionAccountTitle) settingsSectionAccountTitle.textContent = t("settingsAccount");
  if (deleteAccountWarningEl) deleteAccountWarningEl.textContent = t("deleteAccountWarning");
  if (deleteAccountBtn) deleteAccountBtn.textContent = t("deleteAccountBtn");
  if (deleteAccountPassword) deleteAccountPassword.placeholder = t("deleteAccountPasswordPlaceholder");
  if (metaDescriptionEl) metaDescriptionEl.setAttribute("content", t("metaDescription"));
  if (authSide) authSide.setAttribute("aria-label", t("appearanceAuthAria"));
  if (appThemeSeg) appThemeSeg.setAttribute("aria-label", t("themeLabel"));
  if (appLangSeg) appLangSeg.setAttribute("aria-label", t("languageLabel"));
  if (folderTreeEl) folderTreeEl.setAttribute("aria-label", t("foldersAria"));
  if (emailInput) emailInput.placeholder = t("placeholderEmail");
  if (passwordInput) passwordInput.placeholder = t("placeholderPasswordAuth");
  if (creatorSignatureEl) creatorSignatureEl.textContent = t("creatorSignature");
  if (appFooterAuthorEl) appFooterAuthorEl.textContent = t("footerAuthor");
  if (authTitle) authTitle.textContent = t("defaultAppTitle");
  if (avatarEmojiInput) avatarEmojiInput.placeholder = t("avatarPlaceholder");
  if (authSubtitle) authSubtitle.textContent = t("authSubtitle");
  const skipLink = document.getElementById("skip-to-content");
  if (skipLink) skipLink.textContent = t("skipToContent");
  if (registerBtn) registerBtn.textContent = t("register");
  if (loginBtn) loginBtn.textContent = t("login");
  if (logoutBtn) logoutBtn.textContent = t("logout");
  if (createNoteHeading) createNoteHeading.textContent = t("createNote");
  if (reportIssueHeading) reportIssueHeading.textContent = t("reportIssue");
  if (customizationHeading) customizationHeading.textContent = t("customization");
  if (shareWebsiteHeading) shareWebsiteHeading.textContent = t("shareWebsite");
  if (createNoteBtn) createNoteBtn.textContent = t("create");
  if (issueBtn) issueBtn.textContent = t("sendIssue");
  if (refreshPublicLinkBtn) refreshPublicLinkBtn.textContent = t("refreshLink");
  if (copyPublicLinkBtn) copyPublicLinkBtn.textContent = t("copyLink");
  if (exportSettingsBtn) exportSettingsBtn.textContent = t("exportSettings");
  if (importSettingsBtn) importSettingsBtn.textContent = t("importSettings");
  if (clearFolderBtn) clearFolderBtn.textContent = t("allFolders");
  if (mobileNavNotes) mobileNavNotes.textContent = t("navNotes");
  if (mobileNavCreate) mobileNavCreate.textContent = t("navCreate");
  if (mobileNavSettings) mobileNavSettings.textContent = t("navSettings");
  if (searchInput) {
    searchInput.placeholder = t("searchPlaceholder");
    searchInput.title = t("searchFocusShortcut");
  }
  if (noteCreateTitle) noteCreateTitle.placeholder = t("noteTitlePlaceholder");
  if (noteCreateBody) noteCreateBody.placeholder = t("noteBodyPlaceholder");
  if (issueText) issueText.placeholder = t("issuePlaceholder");
  if (displayNameInput) displayNameInput.placeholder = t("displayNamePlaceholder");
  if (appTitleInput) appTitleInput.placeholder = t("appTitlePlaceholder");
  if (profileLinkInput) profileLinkInput.placeholder = t("profileLinkPlaceholder");
  if (publicSiteLinkInput) {
    publicSiteLinkInput.placeholder = t("publicLinkPlaceholder");
  }
  if (noteCategory) {
    Array.from(noteCategory.options).forEach((opt) => {
      opt.textContent = categoryLabel(opt.value);
    });
  }
  updateAppearanceSelectLabels();
  renderPrettyLink();
  refreshSegmentToggleLabels();
  renderAboutBody();
  loadAuthStats();
  const offlineBanner = document.getElementById("offline-banner");
  if (offlineBanner && !offlineBanner.classList.contains("hidden")) {
    offlineBanner.textContent = t("toastOffline");
  }
}

function setMobilePanel(nextPanel) {
  mobilePanel = nextPanel;
  const compact = window.matchMedia("(max-width: 900px)").matches;
  if (!compact || !asidePanel || !notesPanel || !mobileNav) return;

  mobileNav.classList.remove("hidden");
  const settingsBlock = asidePanel.querySelector('[data-mobile-panel="settings"]');

  if (nextPanel === "settings") {
    if (sidebarTreeSection) sidebarTreeSection.classList.add("hidden");
    if (settingsBlock) settingsBlock.classList.remove("hidden");
    asidePanel.classList.remove("hidden");
    notesPanel.classList.add("hidden");
  } else if (nextPanel === "create") {
    asidePanel.classList.add("hidden");
    notesPanel.classList.remove("hidden");
    if (createPanel) createPanel.classList.remove("hidden");
    if (notesToolbar) notesToolbar.classList.add("hidden");
    if (notesMain) notesMain.classList.add("hidden");
  } else {
    asidePanel.classList.remove("hidden");
    notesPanel.classList.remove("hidden");
    if (sidebarTreeSection) sidebarTreeSection.classList.remove("hidden");
    if (settingsBlock) settingsBlock.classList.add("hidden");
    if (createPanel) createPanel.classList.add("hidden");
    if (notesToolbar) notesToolbar.classList.remove("hidden");
    if (notesMain) notesMain.classList.remove("hidden");
  }

  [mobileNavNotes, mobileNavCreate, mobileNavSettings].forEach((btn) => {
    if (!btn) return;
    btn.classList.toggle("active", btn.dataset.mobileTarget === nextPanel);
  });
}

async function focusNewNoteComposer() {
  const category = activeFolder || "resources";
  
  const newNote = {
    title: "",
    content: "[]", // Empty block array
    category: category
  };
  
  try {
    const data = await api("/api/notes", {
      method: "POST",
      body: JSON.stringify(newNote)
    });
    const createdNote = data.note;
    notes.unshift(createdNote);
    renderSignature = "";
    renderNotes();
    
    // Switch to notes view on mobile if needed
    const compact = window.matchMedia("(max-width: 900px)").matches;
    if (compact) {
      setMobilePanel("notes");
    }

    // Open Notion-style editor instead of focusing inline
    openNotionEditor(createdNote.id);
  } catch (err) {
    showToast(`${t("syncError")}: ${err.message}`, { variant: "error" });
  }

}


function syncDesktopPanels() {
  if (!asidePanel || !notesPanel || !mobileNav) return;
  const compact = window.matchMedia("(max-width: 900px)").matches;
  const asideBlocks = Array.from(asidePanel.querySelectorAll("[data-mobile-panel]"));
  if (!compact) {
    asidePanel.classList.remove("hidden");
    notesPanel.classList.remove("hidden");
    mobileNav.classList.add("hidden");
    asideBlocks.forEach((block) => block.classList.remove("hidden"));
    if (sidebarTreeSection) sidebarTreeSection.classList.remove("hidden");
    if (createPanel) createPanel.classList.remove("hidden");
    if (notesToolbar) notesToolbar.classList.remove("hidden");
    if (notesMain) notesMain.classList.remove("hidden");
    if (settingsDrawer) settingsDrawer.open = false;
    return;
  }
  setMobilePanel(mobilePanel);
  if (settingsDrawer) settingsDrawer.open = true;
}

function renderPrettyLink() {
  const url = normalizeLink(profileLinkInput?.value || "");
  if (!prettyLink) return;
  if (!url) {
    prettyLink.classList.add("hidden");
    prettyLink.removeAttribute("href");
    prettyLink.textContent = "";
    return;
  }
  prettyLink.classList.remove("hidden");
  prettyLink.href = url;
  prettyLink.textContent = formatPrettyLink(url);
}

function applyAccentColor(color) {
  document.documentElement.setAttribute("data-accent", color);
  if (accentColorInput) {
    accentColorInput.value = color;
  }
}

function applyFontFamily(font) {
  document.documentElement.setAttribute("data-font", font);
  if (fontFamilyInput) {
    fontFamilyInput.value = font;
  }
}

function applyBgPattern(pattern) {
  document.documentElement.setAttribute("data-pattern", pattern);
  if (bgPatternInput) {
    bgPatternInput.value = pattern;
  }
}

function applyDensityMode(mode) {
  document.documentElement.setAttribute("data-density", mode);
  if (densityModeInput) {
    densityModeInput.value = mode;
  }
}

function applyMotionMode(mode) {
  document.documentElement.setAttribute("data-motion", mode);
  if (motionModeInput) {
    motionModeInput.value = mode;
  }
}

function applyAppTitle(title) {
  const nextTitle = (title || "").trim() || t("defaultAppTitle");
  if (headerAppTitleEl) {
    headerAppTitleEl.textContent = nextTitle;
  } else {
    const heading = document.querySelector("header h2");
    if (heading) heading.textContent = nextTitle;
  }
  document.title = nextTitle;
  if (appTitleInput) {
    appTitleInput.value = nextTitle;
  }
}

function applyCustomization() {
  if (avatarEmojiInput) {
    avatarEmojiInput.value = getAvatarEmoji();
  }
  if (displayNameInput) {
    displayNameInput.value = getDisplayName();
  }
  applyAppTitle(getAppTitle());
  if (profileLinkInput) {
    profileLinkInput.value = getProfileLink();
  }
  applyAccentColor(getAccentColor());
  applyFontFamily(getFontFamily());
  applyBgPattern(getBgPattern());
  applyDensityMode(getDensityMode());
  applyMotionMode(getMotionMode());
  applySidebarWidth(getSidebarWidth());
  renderPrettyLink();
}

function exportSettings() {
  const payload = {
    version: 1,
    app: "my-second-brain",
    settings: getSettings(),
    exportedAt: new Date().toISOString()
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `my-second-brain-settings-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function applyImportedSettings(next) {
  const settings = next && typeof next === "object" ? next.settings || next : null;
  if (!settings || typeof settings !== "object") {
    throw new Error("IMPORT_SETTINGS_INVALID");
  }
  if (typeof settings.displayName === "string") {
    localStorage.setItem("display-name", settings.displayName.trim());
  }
  if (typeof settings.avatarEmoji === "string") {
    localStorage.setItem("avatar-emoji", settings.avatarEmoji.trim());
  }
  if (typeof settings.appTitle === "string") {
    localStorage.setItem("app-title", settings.appTitle.trim());
  }
  if (typeof settings.accentColor === "string") {
    localStorage.setItem("accent-color", settings.accentColor);
  }
  if (typeof settings.fontFamily === "string") {
    localStorage.setItem("font-family", settings.fontFamily);
  }
  if (typeof settings.bgPattern === "string") {
    localStorage.setItem("bg-pattern", settings.bgPattern);
  }
  if (typeof settings.densityMode === "string") {
    localStorage.setItem("density-mode", settings.densityMode);
  }
  if (typeof settings.motionMode === "string") {
    localStorage.setItem("motion-mode", settings.motionMode);
  }
  if (typeof settings.sidebarWidth === "string") {
    localStorage.setItem("sidebar-width", settings.sidebarWidth);
  }
  if (typeof settings.profileLink === "string") {
    localStorage.setItem("profile-link", settings.profileLink.trim());
  }
  if (typeof settings.lang === "string" && I18N[settings.lang]) {
    currentLang = settings.lang;
  }
  applyLanguage();
  applyCustomization();
  setView();
}

async function loadPublicSiteLink() {
  if (!publicSiteLinkInput) return;
  try {
    const res = await fetch("/api/public-link", {
      headers: { "Content-Type": "application/json" }
    });
    const data = await res.json().catch(() => ({}));
    const url = String(data.url || "").trim();
    if (!url) {
      publicSiteLinkInput.value = "";
      publicSiteLinkInput.placeholder = t("publicLinkPlaceholder");
      return;
    }
    publicSiteLinkInput.value = url;
  } catch (error) {
    publicSiteLinkInput.value = "";
    publicSiteLinkInput.placeholder = t("publicLinkPlaceholder");
  }
}

async function copyPublicLink() {
  if (!publicSiteLinkInput) return;
  const value = publicSiteLinkInput.value.trim();
  if (!value) {
    showToast(t("noLink"), { variant: "error", duration: 5000 });
    return;
  }
  try {
    await navigator.clipboard.writeText(value);
    showToast(t("copied"), { variant: "success", duration: 3200 });
  } catch (error) {
    publicSiteLinkInput.select();
    document.execCommand("copy");
    showToast(t("copied"), { variant: "success", duration: 3200 });
  }
}

function saveAuth(nextToken, nextUser) {
  token = nextToken;
  user = nextUser;
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
}

function clearAuth() {
  token = "";
  user = null;
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

function getThemeMode() {
  return localStorage.getItem("theme-mode") || "auto";
}

function applyTheme(mode) {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const nextTheme = mode === "auto" ? (prefersDark ? "dark" : "light") : mode;
  document.documentElement.setAttribute("data-theme", nextTheme);
  document.documentElement.setAttribute("data-theme-storage", mode);
  syncThemeSegmentsVisual(mode);
  updateMetaThemeColor();
}

async function api(path, options = {}) {
  const res = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const raw = data.error != null ? String(data.error) : "";
    throw new Error(translateApiError(raw));
  }
  return data;
}

function setView() {
  const authed = Boolean(token && user);
  authView.classList.toggle("hidden", authed);
  appView.classList.toggle("hidden", !authed);
  const skipLink = document.getElementById("skip-to-content");
  if (skipLink) {
    skipLink.setAttribute("href", authed ? "#main-content" : "#auth-view");
  }
  if (authed) {
    const avatar = getAvatarEmoji();
    const displayName = getDisplayName();
    const mainText = displayName ? `${displayName} - ${user.email}` : user.email;
    meLabel.textContent = avatar ? `${avatar} ${mainText}` : mainText;
  }
}

function formatTime(d = new Date()) {
  return d.toLocaleTimeString(formatLocaleTag(), { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function formatDate(ms) {
  return new Date(ms).toLocaleString(formatLocaleTag());
}

function matchSearch(n, text) {
  if (!text) return true;
  const hay = `${n.title} ${n.content} ${n.category}`.toLowerCase();
  return hay.includes(text.toLowerCase());
}

function resetNotesHtml(html) {
  noteAutosaveTimers.forEach((tid) => clearTimeout(tid));
  noteAutosaveTimers.clear();
  noteLastSavedSnap.clear();
  notesWrap.innerHTML = html;
}

function snapshotFromPayload(p) {
  return JSON.stringify({ title: p.title, content: p.content, category: p.category });
}

function buildPayloadFromArticle(article) {
  const titleEl = article.querySelector('[data-role="title"]');
  const contentEl = article.querySelector('[data-role="content"]');
  const catEl = article.querySelector('[data-role="category"]');
  const title = (titleEl?.value || "").trim().slice(0, 150) || t("untitledNote");
  return {
    title,
    content: String(contentEl?.value ?? ""),
    category: catEl?.value || "resources"
  };
}

async function persistNoteFromArticle(article) {
  const id = article.dataset.id;
  if (!id) return;
  const p = buildPayloadFromArticle(article);
  const data = await api(`/api/notes/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      title: p.title,
      content: p.content,
      category: p.category
    })
  });
  notes = notes.map((n) => (n.id === id ? data.note : n));
  const titleEl = article.querySelector('[data-role="title"]');
  const contentEl = article.querySelector('[data-role="content"]');
  const catEl = article.querySelector('[data-role="category"]');
  if (titleEl) titleEl.value = data.note.title;
  if (contentEl) contentEl.value = data.note.content;
  if (catEl) catEl.value = data.note.category;
  const meta = article.querySelector(".meta");
  if (meta) meta.textContent = `${categoryLabel(data.note.category)} — ${formatDate(data.note.updatedAt)}`;
  noteLastSavedSnap.set(
    id,
    snapshotFromPayload({
      title: data.note.title,
      content: data.note.content,
      category: data.note.category
    })
  );
  renderSignature = "";
}

function scheduleNoteAutosave(article) {
  const id = article.dataset.id;
  if (!id) return;
  const prev = noteAutosaveTimers.get(id);
  if (prev) clearTimeout(prev);
  const tid = setTimeout(() => {
    noteAutosaveTimers.delete(id);
    flushNoteAutosave(article);
  }, 850);
  noteAutosaveTimers.set(id, tid);
}

async function flushNoteAutosave(article, options = {}) {
  const { force = false } = options;
  const id = article.dataset.id;
  if (!id) return;
  const pending = noteAutosaveTimers.get(id);
  if (pending) {
    clearTimeout(pending);
    noteAutosaveTimers.delete(id);
  }
  const p = buildPayloadFromArticle(article);
  const snap = snapshotFromPayload(p);
  if (!force && noteLastSavedSnap.get(id) === snap) return;
  try {
    await persistNoteFromArticle(article);
  } catch (error) {
    showToast(translateClientError(error.message), { variant: "error", duration: 5000 });
  }
}

function noteArticleHtml(n) {
  // Simple preview parsing
  let previewText = "";
  try {
    const blocks = JSON.parse(n.content);
    if (Array.isArray(blocks)) {
      previewText = blocks.map(b => b.content.replace(/<[^>]*>/g, '')).join(" ").slice(0, 100);
    }
  } catch (e) {
    previewText = String(n.content || "").slice(0, 100);
  }

  return `
    <article class="note" data-id="${n.id}" draggable="true">
      <div class="note-preview-header">
        <span class="note-preview-icon">${n.icon || "📄"}</span>
        <h4 class="note-preview-title">${escapeHtml(n.title)}</h4>
      </div>
      <div class="note-preview-content">${escapeHtml(previewText)}</div>
      <div class="meta">${formatDate(n.updatedAt)}</div>
      <div class="note-actions">
        <button type="button" class="danger" data-role="delete" title="Delete">✕</button>
      </div>
    </article>
  `;
}


function renderNotes() {
  const q = searchQuery.trim();
  const filtered = notes.filter((n) => !n.deletedAt).filter((n) => matchSearch(n, q));
  const signature = JSON.stringify({
    q,
    lang: currentLang,
    activeFolder,
    items: filtered.map((n) => [n.id, n.updatedAt, n.category])
  });
  if (signature === renderSignature) return;
  renderSignature = signature;

  const categories = ["projects", "areas", "resources", "archives"];
  const groups = categories.map((category) => ({
    category,
    notes: filtered.filter((n) => n.category === category)
  }));

  if (activeFolderLabel) {
    activeFolderLabel.textContent = activeFolder ? categoryLabel(activeFolder) : "";
  }
  if (clearFolderBtn) {
    clearFolderBtn.classList.toggle("hidden", !activeFolder);
  }
  if (toolbarNewNote) {
    // Show button always when logged in
    toolbarNewNote.classList.remove("hidden");
    if (activeFolder) {
      const folderLabel = categorySidebarLabel(activeFolder);
      toolbarNewNote.textContent = t("toolbarNewNote").replace(/\{folder\}/g, folderLabel);
    } else {
      toolbarNewNote.textContent = t("toolbarNewNoteGeneric");
    }
  }

  if (folderTreeEl) {
    folderTreeEl.innerHTML = groups
      .map(
        (g) => `
      <button type="button" class="folder-tree-item ${activeFolder === g.category ? "is-active" : ""}" data-role="open-folder" data-folder="${g.category}" aria-pressed="${activeFolder === g.category ? "true" : "false"}" title="${escapeHtml(categoryLabel(g.category))}">
        <span class="folder-tree-row">
          <span class="folder-tree-bullet" aria-hidden="true"></span>
          <span class="folder-tree-label">${escapeHtml(categorySidebarLabel(g.category))}</span>
        </span>
        <span class="folder-tree-count">${g.notes.length}</span>
      </button>
    `
      )
      .join("");
  }

  if (!filtered.length) {
    resetNotesHtml(`<p>${escapeHtml(t("noNotes"))}</p>`);
    return;
  }

  if (!activeFolder) {
    notesWrap.classList.add("kanban-board");
    const boardHtml = groups.map(g => `
      <div class="kanban-column" data-category="${g.category}">
        <h3 class="kanban-column-header" data-role="open-folder" data-folder="${g.category}" style="cursor:pointer">
          <span class="kanban-title">${escapeHtml(categoryLabel(g.category))}</span>
          <span class="kanban-count">${g.notes.length}</span>
        </h3>

        <div class="kanban-cards">
          ${g.notes.map(n => noteArticleHtml(n)).join("")}
        </div>
      </div>
    `).join("");
    resetNotesHtml(boardHtml);
    filtered.forEach((n) => {
      noteLastSavedSnap.set(
        n.id,
        snapshotFromPayload({ title: n.title, content: n.content, category: n.category })
      );
    });
    return;
  } else {
    notesWrap.classList.remove("kanban-board");
  }

  const inFolder = filtered.filter((n) => n.category === activeFolder);
  if (!inFolder.length) {
    resetNotesHtml(`<p class="folder-hint">${escapeHtml(t("emptyFolder"))}</p>`);
    return;
  }

  resetNotesHtml(inFolder.map((n) => noteArticleHtml(n)).join(""));
  inFolder.forEach((n) => {
    noteLastSavedSnap.set(
      n.id,
      snapshotFromPayload({ title: n.title, content: n.content, category: n.category })
    );
  });
}

async function refreshNotes() {
  const data = await api("/api/notes");
  notes = data.notes;
  lastSync = Date.now();
  renderSignature = "";
  renderNotes();
}

async function sync() {
  if (!token || syncInFlight || document.hidden) return;
  syncInFlight = true;
  try {
    const data = await api(`/api/sync?since=${lastSync}`);
    if (Array.isArray(data.notes) && data.notes.length) {
      const byId = new Map(notes.map((n) => [n.id, n]));
      data.notes.forEach((n) => byId.set(n.id, n));
      notes = Array.from(byId.values()).sort((a, b) => b.updatedAt - a.updatedAt);
      renderSignature = "";
      renderNotes();
    }
    lastSync = data.serverTime || Date.now();
    if (syncStatus) syncStatus.textContent = `${t("syncedPrefix")} ${formatTime()}`;
  } catch (error) {
    if (syncStatus) syncStatus.textContent = t("syncError");
  } finally {
    syncInFlight = false;
  }
}

function startSyncLoop() {
  if (syncTimer) clearInterval(syncTimer);
  syncTimer = setInterval(sync, 9000);
}

function stopLiveEvents() {
  if (eventsConnection) {
    eventsConnection.close();
    eventsConnection = null;
  }
}

async function startLiveEvents() {
  stopLiveEvents();
  if (!token) return;
  let esToken;
  try {
    const res = await fetch("/api/events-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error("events-token");
    const body = await res.json().catch(() => ({}));
    esToken = String(body.token || "").trim();
    if (!esToken) throw new Error("events-token");
  } catch (error) {
    if (syncStatus) syncStatus.textContent = t("liveReconnect");
    setTimeout(() => {
      startLiveEvents();
    }, 4000);
    return;
  }

  const es = new EventSource(`/api/events?token=${encodeURIComponent(esToken)}`);
  eventsConnection = es;

  es.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data || "{}");
      if (data.event === "connected") {
        if (syncStatus) syncStatus.textContent = t("liveConnected");
        return;
      }

      if (data.event === "note_changed" && data.payload) {
        const byId = new Map(notes.map((n) => [n.id, n]));
        byId.set(data.payload.id, data.payload);
        notes = Array.from(byId.values()).sort((a, b) => b.updatedAt - a.updatedAt);
        renderSignature = "";
        renderNotes();
      }

      if (data.event === "note_deleted" && data.payload) {
        notes = notes.filter((n) => n.id !== data.payload.id);
        renderSignature = "";
        renderNotes();
      }

      if (data.serverTime) {
        lastSync = data.serverTime;
      }
      if (syncStatus) syncStatus.textContent = `${t("liveSyncedPrefix")} ${formatTime()}`;
    } catch (error) {
      if (syncStatus) syncStatus.textContent = t("liveParseError");
    }
  };

  es.onerror = () => {
    if (syncStatus) syncStatus.textContent = t("liveReconnect");
    stopLiveEvents();
    setTimeout(startLiveEvents, 2000);
  };
}

async function doAuth(mode) {
  authError.textContent = "";
  const email = emailInput.value.trim();
  if (!isValidEmail(email)) {
    authError.textContent = t("invalidEmail");
    return;
  }
  try {
    const payload = {
      email,
      password: passwordInput.value
    };
    const data = await api(`/api/auth/${mode}`, {
      method: "POST",
      body: JSON.stringify(payload)
    });
    saveAuth(data.token, data.user);
    setView();
    await refreshNotes();
    startSyncLoop();
    startLiveEvents();
  } catch (error) {
    authError.textContent = translateClientError(error.message);
  }
}

async function createNote() {
  try {
    const titleRaw = (noteCreateTitle && noteCreateTitle.value) || "";
    const bodyRaw = (noteCreateBody && noteCreateBody.value) || "";
    if (!titleRaw.trim() && !bodyRaw.trim()) {
      showToast(t("emptyNoteCombined"), { variant: "error", duration: 4000 });
      return;
    }
    const title = titleRaw.trim().slice(0, 150) || t("untitledNote");
    const payload = {
      title,
      category: noteCategory.value,
      content: bodyRaw
    };
    const data = await api("/api/notes", {
      method: "POST",
      body: JSON.stringify(payload)
    });
    const newNote = data.note;
    notes.unshift(newNote);
    activeFolder = newNote.category;
    renderSignature = "";
    renderNotes();
    if (noteCreateTitle) noteCreateTitle.value = "";
    if (noteCreateBody) noteCreateBody.value = "";
    requestAnimationFrame(() => {
      const el = notesWrap.querySelector(`article.note[data-id="${newNote.id}"]`);
      if (el) {
        el.classList.add("note--new");
        el.scrollIntoView({ block: "center", behavior: "smooth" });
        setTimeout(() => el.classList.remove("note--new"), 1400);
      }
    });
  } catch (error) {
    showToast(translateClientError(error.message), { variant: "error", duration: 5000 });
  }
}

async function removeOne(id) {
  const pending = noteAutosaveTimers.get(id);
  if (pending) clearTimeout(pending);
  noteAutosaveTimers.delete(id);
  noteLastSavedSnap.delete(id);
  await api(`/api/notes/${id}`, { method: "DELETE" });
  notes = notes.filter((n) => n.id !== id);
  renderSignature = "";
  renderNotes();
}

async function restoreNote(id) {
  const data = await api(`/api/notes/${id}/restore`, { method: "POST" });
  notes = [data.note, ...notes.filter((n) => n.id !== id)];
  renderSignature = "";
  renderNotes();
}

async function deleteNoteWithUndo(id) {
  try {
    await removeOne(id);
    showToast(t("toastNoteDeleted"), {
      variant: "default",
      duration: 9000,
      actionLabel: t("undo"),
      onAction: async () => {
        try {
          await restoreNote(id);
          showToast(t("toastRestored"), { variant: "success", duration: 3200 });
        } catch (error) {
          showToast(translateClientError(error.message), { variant: "error", duration: 5000 });
        }
      }
    });
  } catch (error) {
    showToast(translateClientError(error.message), { variant: "error", duration: 5000 });
  }
}

async function sendIssue() {
  const message = issueText.value.trim();
  if (!message) return;
  try {
    await api("/api/feedback", {
      method: "POST",
      body: JSON.stringify({ message })
    });
    issueText.value = "";
    showToast(t("issueSent"), { variant: "success", duration: 4000 });
  } catch (error) {
    showToast(translateClientError(error.message), { variant: "error", duration: 5000 });
  }
}

async function deleteAccount() {
  const pwd = (deleteAccountPassword && deleteAccountPassword.value) || "";
  if (!pwd.trim()) {
    showToast(t("apiErrorPasswordRequiredDeletion"), { variant: "error", duration: 5000 });
    return;
  }
  try {
    await api("/api/account/delete", {
      method: "POST",
      body: JSON.stringify({ password: pwd })
    });
    if (deleteAccountPassword) deleteAccountPassword.value = "";
    clearAuth();
    notes = [];
    if (syncTimer) clearInterval(syncTimer);
    syncTimer = null;
    stopLiveEvents();
    setView();
    renderSignature = "";
    renderNotes();
    showToast(t("toastAccountDeleted"), { variant: "success", duration: 5000 });
  } catch (error) {
    showToast(translateClientError(error.message), { variant: "error", duration: 5000 });
  }
}

if (registerBtn) registerBtn.addEventListener("click", () => doAuth("register"));
if (loginBtn) loginBtn.addEventListener("click", () => doAuth("login"));
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    clearAuth();
    notes = [];
    setView();
    renderNotes();
    if (syncTimer) clearInterval(syncTimer);
    stopLiveEvents();
    loadAuthStats();
  });
}
if (deleteAccountBtn) deleteAccountBtn.addEventListener("click", deleteAccount);
if (createNoteBtn) createNoteBtn.addEventListener("click", createNote);
if (toolbarNewNote) toolbarNewNote.addEventListener("click", () => focusNewNoteComposer());
const onSearchInput = debounce(() => {
  searchQuery = searchInput.value;
  renderNotes();
}, 180);
if (searchInput) {
  searchQuery = searchInput.value || "";
  searchInput.addEventListener("input", onSearchInput);
}
if (clearFolderBtn) {
  clearFolderBtn.addEventListener("click", () => {
    activeFolder = "";
    renderSignature = "";
    renderNotes();
  });
}
if (issueBtn) issueBtn.addEventListener("click", sendIssue);
if (avatarEmojiInput) {
  avatarEmojiInput.addEventListener("input", () => {
    localStorage.setItem("avatar-emoji", avatarEmojiInput.value.trim().slice(0, 3));
    setView();
  });
}
if (displayNameInput) {
  displayNameInput.addEventListener("input", () => {
    localStorage.setItem("display-name", displayNameInput.value.trim());
    setView();
  });
}
if (appTitleInput) {
  appTitleInput.addEventListener("input", () => {
    localStorage.setItem("app-title", appTitleInput.value.trim());
    applyAppTitle(appTitleInput.value);
  });
}
if (accentColorInput) {
  accentColorInput.addEventListener("change", () => {
    localStorage.setItem("accent-color", accentColorInput.value);
    applyAccentColor(accentColorInput.value);
  });
}
if (fontFamilyInput) {
  fontFamilyInput.addEventListener("change", () => {
    localStorage.setItem("font-family", fontFamilyInput.value);
    applyFontFamily(fontFamilyInput.value);
  });
}
if (bgPatternInput) {
  bgPatternInput.addEventListener("change", () => {
    localStorage.setItem("bg-pattern", bgPatternInput.value);
    applyBgPattern(bgPatternInput.value);
  });
}
if (densityModeInput) {
  densityModeInput.addEventListener("change", () => {
    localStorage.setItem("density-mode", densityModeInput.value);
    applyDensityMode(densityModeInput.value);
  });
}
if (motionModeInput) {
  motionModeInput.addEventListener("change", () => {
    localStorage.setItem("motion-mode", motionModeInput.value);
    applyMotionMode(motionModeInput.value);
  });
}
if (sidebarWidthInput) {
  sidebarWidthInput.addEventListener("change", () => {
    localStorage.setItem("sidebar-width", sidebarWidthInput.value);
    applySidebarWidth(sidebarWidthInput.value);
  });
}
if (mobileNav) {
  mobileNav.addEventListener("click", (event) => {
    const target = event.target.closest("[data-mobile-target]");
    if (!target) return;
    setMobilePanel(target.dataset.mobileTarget);
  });
}
if (profileLinkInput) {
  profileLinkInput.addEventListener("input", () => {
    localStorage.setItem("profile-link", profileLinkInput.value.trim());
    renderPrettyLink();
  });
}
if (exportSettingsBtn) exportSettingsBtn.addEventListener("click", exportSettings);
if (importSettingsBtn && importSettingsFile) {
  importSettingsBtn.addEventListener("click", () => importSettingsFile.click());
}
if (refreshPublicLinkBtn) refreshPublicLinkBtn.addEventListener("click", loadPublicSiteLink);
if (copyPublicLinkBtn) copyPublicLinkBtn.addEventListener("click", copyPublicLink);
if (importSettingsFile) {
  importSettingsFile.addEventListener("change", async () => {
    const [file] = importSettingsFile.files || [];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      applyImportedSettings(parsed);
      showToast(t("imported"), { variant: "success", duration: 4000 });
    } catch (error) {
      const msg =
        error && error.message === "IMPORT_SETTINGS_INVALID"
          ? t("importSettingsFileInvalid")
          : t("importError");
      showToast(msg, { variant: "error", duration: 5000 });
    } finally {
      importSettingsFile.value = "";
    }
  });
}

if (createPanel) {
  createPanel.addEventListener("focusin", () => {
    document.body.classList.add("create-focus-mode");
  });
  createPanel.addEventListener("focusout", () => {
    setTimeout(() => {
      const active = document.activeElement;
      const stillInside = active && createPanel.contains(active);
      if (!stillInside) {
        document.body.classList.remove("create-focus-mode");
      }
    }, 0);
  });
}

function onFolderPick(event) {
  const folderTrigger = event.target.closest('[data-role="open-folder"]');
  if (!folderTrigger) return false;
  const folder = folderTrigger.dataset.folder;
  if (!folder) return false;
  
  event.preventDefault();
  event.stopPropagation();
  
  activeFolder = (activeFolder === folder) ? "" : folder;
  renderSignature = "";
  renderNotes();
  return true;
}


if (folderTreeEl) {
  folderTreeEl.addEventListener("click", (event) => {
    onFolderPick(event);
  });
}

notesWrap.addEventListener("input", (event) => {
  const article = event.target.closest(".note");
  if (!article) return;
  if (event.target.matches('[data-role="title"], [data-role="content"]')) {
    scheduleNoteAutosave(article);
  }
});

notesWrap.addEventListener("change", (event) => {
  const article = event.target.closest(".note");
  if (!article) return;
  if (event.target.matches('[data-role="category"]')) {
    scheduleNoteAutosave(article);
  }
});

notesWrap.addEventListener("focusout", (event) => {
  const article = event.target.closest(".note");
  if (!article) return;
  if (!event.target.matches('[data-role="title"], [data-role="content"], [data-role="category"]')) return;
  const next = event.relatedTarget;
  if (next && article.contains(next)) return;
  flushNoteAutosave(article);
});

notesWrap.addEventListener("dragstart", (event) => {
  const article = event.target.closest(".note");
  if (!article) return;
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/plain", article.dataset.id);
  article.classList.add("dragging");
});

notesWrap.addEventListener("dragend", (event) => {
  const article = event.target.closest(".note");
  if (article) article.classList.remove("dragging");
  notesWrap.querySelectorAll(".kanban-column").forEach(col => col.classList.remove("drag-over"));
});

notesWrap.addEventListener("dragover", (event) => {
  const col = event.target.closest(".kanban-column");
  if (!col) return;
  event.preventDefault(); // allow drop
  col.classList.add("drag-over");
});

notesWrap.addEventListener("dragleave", (event) => {
  const col = event.target.closest(".kanban-column");
  if (!col) return;
  if (!col.contains(event.relatedTarget)) {
    col.classList.remove("drag-over");
  }
});

notesWrap.addEventListener("drop", async (event) => {
  const col = event.target.closest(".kanban-column");
  if (!col) return;
  event.preventDefault();
  col.classList.remove("drag-over");
  const noteId = event.dataTransfer.getData("text/plain");
  const newCat = col.dataset.category;
  if (!noteId || !newCat) return;

  const noteToUpdate = notes.find(n => n.id === noteId);
  if (!noteToUpdate || noteToUpdate.category === newCat) return;

  // Optimistic update
  noteToUpdate.category = newCat;
  renderSignature = "";
  renderNotes();

  // Save to backend
  try {
    const data = await api(`/api/notes/${noteId}`, {
      method: "PUT",
      body: JSON.stringify({
        title: noteToUpdate.title,
        content: noteToUpdate.content,
        category: newCat
      })
    });
    // Update frontend object with server timestamps
    const idx = notes.findIndex(n => n.id === noteId);
    if (idx !== -1) notes[idx] = data.note;
    
    noteLastSavedSnap.set(noteId, snapshotFromPayload({
      title: data.note.title,
      content: data.note.content,
      category: newCat
    }));
  } catch (error) {
    showToast(translateClientError(error.message), { variant: "error", duration: 5000 });
  }
});

notesWrap.addEventListener("click", async (event) => {
  const target = event.target;
  if (onFolderPick(event)) return;
  const article = target.closest(".note");
  if (!article) return;

  const id = article.dataset.id;

  if (target.dataset.role === "save") {
    event.stopPropagation();
    try {
      await flushNoteAutosave(article, { force: true });
    } catch (error) {
      showToast(translateClientError(error.message), { variant: "error", duration: 5000 });
    }
    return;
  }
  
  if (target.dataset.role === "delete") {
    event.stopPropagation();
    await deleteNoteWithUndo(id);
    return;
  }

  // If we clicked the article but not a specific button, open Notion editor
  if (id) {
    openNotionEditor(id);
  }
});



// --- Notion-style Editor Logic ---
let currentEditingNoteId = null;
let slashMenuVisible = false;
let selectedSlashIndex = 0;
let lastSlashRange = null;

const NOTION_BLOCK_TYPES = [
  { type: 'text', label: 'Text', desc: 'Just start writing with plain text.', icon: '📄' },
  { type: 'h1', label: 'Heading 1', desc: 'Big section heading.', icon: 'H1' },
  { type: 'h2', label: 'Heading 2', desc: 'Medium section heading.', icon: 'H2' },
  { type: 'h3', label: 'Heading 3', desc: 'Small section heading.', icon: 'H3' },
  { type: 'bullet', label: 'Bulleted list', desc: 'Create a simple bulleted list.', icon: '•' }
];

const notionOverlay = document.getElementById("notion-editor-overlay");
const notionTitle = document.getElementById("notion-title");
const notionBlocks = document.getElementById("notion-blocks");
const notionStatus = document.getElementById("notion-status");
const slashMenu = document.getElementById("slash-menu");
const slashMenuList = document.getElementById("slash-menu-list");
const notionCloseBtn = document.getElementById("notion-close-btn");
const notionBackBtn = document.getElementById("notion-back-btn");
const notionBackdrop = document.getElementById("notion-editor-backdrop");

async function openNotionEditor(noteId) {
  if (notionOverlay && !notionOverlay.classList.contains("hidden")) return;
  
  const note = notes.find(n => n.id === noteId);
  if (!note) return;

  try {
    currentEditingNoteId = noteId;
    notionTitle.value = note.title === t("untitledNote") ? "" : note.title;
    
    // Set Icon
    const emojiEl = document.getElementById("notion-emoji");
    if (emojiEl) emojiEl.textContent = note.icon || "📄";

    // Set Cover
    const coverArea = document.getElementById("notion-cover-area");
    if (coverArea) {
      if (note.cover) {
        coverArea.style.backgroundImage = `url(${note.cover})`;
      } else {
        coverArea.style.backgroundImage = '';
      }
    }

    // Render Blocks
    notionBlocks.innerHTML = "";
    const content = note.content || "";
    
    let blocksData = [];
    try {
      blocksData = JSON.parse(content);
      if (!Array.isArray(blocksData)) throw new Error();
    } catch (e) {
      blocksData = String(content).split('\n').map(line => ({
        type: 'text',
        content: line
      }));
    }

    if (blocksData.length === 0) {
      blocksData = [{ type: 'text', content: '' }];
    }

    blocksData.forEach(data => {
      addBlock(data.type, data.content);
    });

    notionOverlay.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    notionStatus.textContent = "Saved";
  } catch (err) {
    console.error("Failed to open Notion editor:", err);
    showToast("Error opening editor", { variant: "error" });
    closeNotionEditor();
  }
}


function closeNotionEditor() {
  if (!currentEditingNoteId) return;
  saveCurrentNote();
  notionOverlay.classList.add("hidden");
  document.body.style.overflow = "";
  currentEditingNoteId = null;
  hideSlashMenu();
  renderNotes();
}

function addBlock(type = 'text', content = '', afterEl = null) {
  const block = document.createElement("div");
  block.className = "notion-block";
  block.contentEditable = "true";
  block.dataset.type = type;
  block.dataset.placeholder = type === 'text' ? "Type '/' for commands..." : "Heading";
  block.innerHTML = content;

  if (afterEl && afterEl.nextSibling) {
    notionBlocks.insertBefore(block, afterEl.nextSibling);
  } else {
    notionBlocks.appendChild(block);
  }

  block.addEventListener("keydown", handleBlockKeyDown);
  block.addEventListener("input", handleBlockInput);
  
  return block;
}

function handleBlockKeyDown(e) {
  const block = e.currentTarget;

  if (e.key === "Enter") {
    if (slashMenuVisible) {
      e.preventDefault();
      applySelectedSlashCommand();
      return;
    }
    e.preventDefault();
    const newBlock = addBlock('text', '', block);
    newBlock.focus();
  }

  if (e.key === "Backspace" && block.textContent === "" && notionBlocks.children.length > 1) {
    e.preventDefault();
    const prev = block.previousElementSibling;
    block.remove();
    if (prev) {
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(prev);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
      prev.focus();
    }
  }

  if (e.key === "ArrowUp") {
    if (slashMenuVisible) {
      e.preventDefault();
      selectedSlashIndex = (selectedSlashIndex - 1 + NOTION_BLOCK_TYPES.length) % NOTION_BLOCK_TYPES.length;
      renderSlashMenu();
      return;
    }
    const prev = block.previousElementSibling;
    if (prev) {
        e.preventDefault();
        prev.focus();
    }
  }

  if (e.key === "ArrowDown") {
    if (slashMenuVisible) {
      e.preventDefault();
      selectedSlashIndex = (selectedSlashIndex + 1) % NOTION_BLOCK_TYPES.length;
      renderSlashMenu();
      return;
    }
    const next = block.nextElementSibling;
    if (next) {
        e.preventDefault();
        next.focus();
    }
  }

  if (e.key === "Escape") {
    if (slashMenuVisible) {
      hideSlashMenu();
    }
  }
}

function handleBlockInput(e) {
  const block = e.currentTarget;
  const text = block.textContent;
  
  if (text.startsWith("/")) {
    showSlashMenu(block);
  } else {
    hideSlashMenu();
  }
  
  saveCurrentNoteDebounced();
}

function showSlashMenu(block) {
  const selection = window.getSelection();
  if (!selection || !selection.rangeCount) return;
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  
  // Safety check for invalid rects
  if (rect.width === 0 && rect.height === 0) {
    hideSlashMenu();
    return;
  }

  lastSlashRange = range.cloneRange();
  
  slashMenu.style.top = `${rect.bottom + window.scrollY + 5}px`;
  slashMenu.style.left = `${rect.left + window.scrollX}px`;
  slashMenu.classList.remove("hidden");
  slashMenuVisible = true;
  selectedSlashIndex = 0;
  renderSlashMenu();
}

function hideSlashMenu() {
  slashMenu.classList.add("hidden");
  slashMenuVisible = false;
}

function renderSlashMenu() {
  slashMenuList.innerHTML = NOTION_BLOCK_TYPES.map((opt, i) => `
    <div class="slash-menu-item ${i === selectedSlashIndex ? 'selected' : ''}" data-index="${i}">
      <div class="slash-icon">${opt.icon}</div>
      <div class="slash-info">
        <div class="slash-label">${opt.label}</div>
        <div class="slash-desc">${opt.desc}</div>
      </div>
    </div>
  `).join("");

  slashMenuList.querySelectorAll(".slash-menu-item").forEach(item => {
    item.onclick = () => {
      selectedSlashIndex = parseInt(item.dataset.index);
      applySelectedSlashCommand();
    };
  });
}

function applySelectedSlashCommand() {
  const opt = NOTION_BLOCK_TYPES[selectedSlashIndex];
  const selection = window.getSelection();
  if (!selection || !selection.anchorNode) return;
  
  const block = selection.anchorNode.parentElement ? selection.anchorNode.parentElement.closest(".notion-block") : null;
  
  if (block) {
    block.dataset.type = opt.type;
    block.dataset.placeholder = opt.label;
    block.innerHTML = ""; // Use innerHTML for consistency
    block.focus();
  }
  
  hideSlashMenu();
}

function serializeBlocks() {
  const blocks = Array.from(notionBlocks.children).map(block => ({
    type: block.dataset.type,
    content: block.innerHTML
  }));
  return JSON.stringify(blocks);
}

const saveCurrentNoteDebounced = debounce(() => {
  saveCurrentNote();
}, 1000);

async function saveCurrentNote() {
  if (!currentEditingNoteId) return;
  
  notionStatus.textContent = "Saving...";
  
  const title = notionTitle.value.trim() || t("untitledNote");
  const content = serializeBlocks();
  
  try {
    const data = await api(`/api/notes/${currentEditingNoteId}`, {
      method: "PUT",
      body: JSON.stringify({
        title,
        content,
        category: notes.find(n => n.id === currentEditingNoteId)?.category || "resources"
      })
    });
    
    const idx = notes.findIndex(n => n.id === currentEditingNoteId);
    if (idx !== -1) notes[idx] = data.note;
    
    notionStatus.textContent = "Saved";
  } catch (err) {
    notionStatus.textContent = "Error saving";
  }
}

notionTitle.addEventListener("input", saveCurrentNoteDebounced);
notionCloseBtn.onclick = closeNotionEditor;
notionBackBtn.onclick = closeNotionEditor;
notionBackdrop.onclick = closeNotionEditor;

async function boot() {

  bindSegmentListenersOnce();
  if (!I18N[currentLang]) currentLang = "ru";
  applyLanguage();
  applyTheme(getThemeMode());
  applyCustomization();
  if (settingsDrawer && window.matchMedia("(min-width: 901px)").matches) {
    settingsDrawer.open = false;
  }
  syncDesktopPanels();
  window.addEventListener("resize", syncDesktopPanels);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      loadPublicSiteLink();
      sync();
    }
  });
  await loadPublicSiteLink();
  if (publicLinkTimer) clearInterval(publicLinkTimer);
  publicLinkTimer = setInterval(() => {
    if (document.hidden) return;
    loadPublicSiteLink();
  }, 30000);
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    if (getThemeMode() === "auto") {
      applyTheme("auto");
    }
  });
  setView();
  if (!token || !user) return;
  try {
    await refreshNotes();
    startSyncLoop();
    startLiveEvents();
    sync();
    setTimeout(startTutorialIfNeeded, 1000);
  } catch (error) {
    showToast(t("sessionExpired"), { variant: "error", duration: 6000 });
    clearAuth();
    setView();
  }
}

function bindGlobalUx() {
  document.addEventListener("keydown", (event) => {
    if (!searchInput || !appView || appView.classList.contains("hidden")) return;
    const el = event.target;
    const tag = el && el.tagName;
    const inTextArea = tag === "TEXTAREA";
    const inSelect = tag === "SELECT";
    const inContentEditable = el && el.isContentEditable;
    const inInput = tag === "INPUT";
    const inSearch = inInput && el.id === "search";

    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      searchInput.focus();
      return;
    }

    if (event.key === "/" && !event.ctrlKey && !event.metaKey && !event.altKey) {
      if (inTextArea || inSelect || inContentEditable) return;
      if (inInput && !inSearch) return;
      event.preventDefault();
      searchInput.focus();
      searchInput.select();
    }
  });

  const offlineBanner = document.getElementById("offline-banner");
  const setOnline = () => {
    if (!offlineBanner) return;
    offlineBanner.classList.add("hidden");
    offlineBanner.textContent = "";
  };
  const setOffline = () => {
    if (!offlineBanner) return;
    offlineBanner.textContent = t("toastOffline");
    offlineBanner.classList.remove("hidden");
  };
  window.addEventListener("online", () => {
    setOnline();
    showToast(t("toastOnline"), { variant: "success", duration: 3000 });
    if (token) sync();
  });
  window.addEventListener("offline", setOffline);
  if (!navigator.onLine) setOffline();
}

bindGlobalUx();
boot();

// --- Tutorial / Onboarding Logic ---
function startTutorialIfNeeded() {
  if (localStorage.getItem("tutorialCompleted") === "true") return;

  const overlay = document.getElementById("tutorial-overlay");
  const title = document.getElementById("tutorial-title");
  const text = document.getElementById("tutorial-text");
  const skipBtn = document.getElementById("tutorial-skip");
  const nextBtn = document.getElementById("tutorial-next");

  if (!overlay) return;

  const steps = [
    {
      target: document.getElementById("note-create-title"),
      title: "Создание заметок",
      text: "Быстро записывайте свои идеи. Они сохраняются автоматически."
    },
    {
      target: document.querySelector(".sidebar-rail"),
      title: "Организация по системе PARA",
      text: "Сортируйте заметки по папкам: Проекты, Области, Ресурсы или Архивы."
    },
    {
      target: document.getElementById("notes-main"),
      title: "Канбан-доска",
      text: "Сбросьте фильтр папки, чтобы увидеть заметки в виде Канбан-доски. Перетаскивайте их между колонками!"
    },
    {
      target: document.querySelector(".sidebar-settings"),
      title: "Кастомизация",
      text: "Здесь вы можете изменить шрифты, цвета и масштаб интерфейса под себя."
    }
  ];

  let currentStep = 0;
  let activeHighlight = null;

  function showStep(index) {
    if (activeHighlight) {
      activeHighlight.classList.remove("tutorial-highlight");
    }
    
    if (index >= steps.length) {
      endTutorial();
      return;
    }

    const step = steps[index];
    title.textContent = step.title;
    text.textContent = step.text;

    if (step.target) {
      step.target.classList.add("tutorial-highlight");
      activeHighlight = step.target;
      step.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    if (index === steps.length - 1) {
      nextBtn.textContent = "Готово!";
    } else {
      nextBtn.textContent = "Далее";
    }
  }

  function endTutorial() {
    if (activeHighlight) {
      activeHighlight.classList.remove("tutorial-highlight");
    }
    overlay.classList.add("hidden");
    localStorage.setItem("tutorialCompleted", "true");
  }

  skipBtn.onclick = endTutorial;
  nextBtn.onclick = () => {
    currentStep++;
    showStep(currentStep);
  };

  overlay.classList.remove("hidden");
  showStep(0);
}


