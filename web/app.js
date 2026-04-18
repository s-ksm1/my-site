const authView = document.getElementById("auth-view");
const appView = document.getElementById("app-view");
const authError = document.getElementById("auth-error");
const meLabel = document.getElementById("me");
const syncStatus = document.getElementById("sync-status");
const themeMode = document.getElementById("theme-mode");
const languageMode = document.getElementById("language-mode");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const registerBtn = document.getElementById("register-btn");
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");

const noteTitle = document.getElementById("note-title");
const noteCategory = document.getElementById("note-category");
const noteContent = document.getElementById("note-content");
const createNoteBtn = document.getElementById("create-note-btn");
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
const settingsDrawer = document.getElementById("settings-drawer");
const createPanel = document.getElementById("create-panel");
const asidePanel = document.getElementById("aside-panel");
const mobileNav = document.getElementById("mobile-nav");
const mobileNavNotes = document.getElementById("mobile-nav-notes");
const mobileNavCreate = document.getElementById("mobile-nav-create");
const mobileNavSettings = document.getElementById("mobile-nav-settings");
const notesPanel = document.querySelector("section.grow");

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

const I18N = {
  ru: {
    authSubtitle: "PARA: Проекты / Области / Ресурсы / Архивы",
    register: "Регистрация",
    login: "Войти",
    logout: "Выйти",
    createNote: "Создать заметку",
    reportIssue: "Сообщить о проблеме",
    customization: "Кастомизация",
    shareWebsite: "Поделиться сайтом",
    navNotes: "Заметки",
    navCreate: "Создать",
    navSettings: "Настройки",
    create: "Создать",
    sendIssue: "Отправить разработчику",
    refreshLink: "Обновить ссылку",
    copyLink: "Копировать ссылку",
    exportSettings: "Экспорт настроек",
    importSettings: "Импорт настроек",
    searchPlaceholder: "Поиск заметок...",
    noteTitlePlaceholder: "Заголовок",
    noteContentPlaceholder: "Запишите мысль...",
    issuePlaceholder: "Опишите проблему",
    displayNamePlaceholder: "Отображаемое имя",
    appTitlePlaceholder: "Название приложения",
    profileLinkPlaceholder: "Ваша ссылка (https://...)",
    publicLinkPlaceholder: "Запустите go-online.cmd для ссылки",
    noNotes: "Пока нет заметок.",
    chooseFolder: "Выберите папку слева, чтобы открыть заметки.",
    allFolders: "Все папки",
    save: "Сохранить",
    del: "Удалить",
    copied: "Публичная ссылка скопирована.",
    noLink: "Сначала запустите go-online.cmd.",
    imported: "Настройки импортированы.",
    importError: "Не удалось импортировать JSON настроек.",
    issueSent: "Отправлено.",
    syncing: "Синхронизация...",
    syncError: "Ошибка синхронизации",
    liveConnected: "Live-синхронизация подключена",
    liveReconnect: "Live-синхронизация переподключается...",
    liveParseError: "Ошибка Live-синхронизации",
    openLink: "🔗 Открыть ссылку",
    category: { projects: "📁 Проекты", areas: "🎯 Области", resources: "📚 Ресурсы", archives: "🗄️ Архивы" }
  },
  en: {
    authSubtitle: "PARA: Projects / Areas / Resources / Archives",
    register: "Register",
    login: "Login",
    logout: "Logout",
    createNote: "Create note",
    reportIssue: "Report issue",
    customization: "Customization",
    shareWebsite: "Share website",
    navNotes: "Notes",
    navCreate: "Create",
    navSettings: "Settings",
    create: "Create",
    sendIssue: "Send to developer",
    refreshLink: "Refresh link",
    copyLink: "Copy link",
    exportSettings: "Export settings",
    importSettings: "Import settings",
    searchPlaceholder: "Search notes...",
    noteTitlePlaceholder: "Title",
    noteContentPlaceholder: "Write your thought...",
    issuePlaceholder: "Describe the issue",
    displayNamePlaceholder: "Display name",
    appTitlePlaceholder: "App title",
    profileLinkPlaceholder: "Your link (https://...)",
    publicLinkPlaceholder: "Run go-online.cmd to get link",
    noNotes: "No notes yet.",
    chooseFolder: "Choose a folder to open notes.",
    allFolders: "All folders",
    save: "Save",
    del: "Delete",
    copied: "Public link copied.",
    noLink: "No public link yet. Run go-online.cmd first.",
    imported: "Settings imported.",
    importError: "Could not import settings JSON.",
    issueSent: "Issue sent.",
    syncing: "Syncing...",
    syncError: "Sync error",
    liveConnected: "Live sync connected",
    liveReconnect: "Live sync reconnecting...",
    liveParseError: "Live sync parse error",
    openLink: "🔗 Open link",
    category: { projects: "📁 Projects", areas: "🎯 Areas", resources: "📚 Resources", archives: "🗄️ Archives" }
  },
  uz: {
    authSubtitle: "PARA: Loyihalar / Sohalar / Resurslar / Arxivlar",
    register: "Ro'yxatdan o'tish",
    login: "Kirish",
    logout: "Chiqish",
    createNote: "Eslatma yaratish",
    reportIssue: "Muammo haqida yuborish",
    customization: "Moslash",
    shareWebsite: "Sayt havolasini ulashish",
    navNotes: "Eslatmalar",
    navCreate: "Yaratish",
    navSettings: "Sozlamalar",
    create: "Yaratish",
    sendIssue: "Dasturchiga yuborish",
    refreshLink: "Havolani yangilash",
    copyLink: "Havolani nusxalash",
    exportSettings: "Sozlamalarni eksport",
    importSettings: "Sozlamalarni import",
    searchPlaceholder: "Eslatmalarni qidirish...",
    noteTitlePlaceholder: "Sarlavha",
    noteContentPlaceholder: "Fikringizni yozing...",
    issuePlaceholder: "Muammoni yozing",
    displayNamePlaceholder: "Ko'rinadigan ism",
    appTitlePlaceholder: "Ilova nomi",
    profileLinkPlaceholder: "Sizning havolangiz (https://...)",
    publicLinkPlaceholder: "Havola uchun go-online.cmd ni ishga tushiring",
    noNotes: "Hozircha eslatmalar yo'q.",
    chooseFolder: "Eslatmalarni ko'rish uchun papkani tanlang.",
    allFolders: "Barcha papkalar",
    save: "Saqlash",
    del: "O'chirish",
    copied: "Public havola nusxalandi.",
    noLink: "Avval go-online.cmd ni ishga tushiring.",
    imported: "Sozlamalar import qilindi.",
    importError: "Sozlamalar JSON import bo'lmadi.",
    issueSent: "Yuborildi.",
    syncing: "Sinxronlash...",
    syncError: "Sinxronlash xatosi",
    liveConnected: "Live sinxronlash ulandi",
    liveReconnect: "Live sinxronlash qayta ulanmoqda...",
    liveParseError: "Live sinxronlash xatosi",
    openLink: "🔗 Havolani ochish",
    category: { projects: "📁 Loyihalar", areas: "🎯 Sohalar", resources: "📚 Resurslar", archives: "🗄️ Arxivlar" }
  }
};

function t(key) {
  return I18N[currentLang]?.[key] || I18N.en[key] || key;
}

function debounce(fn, delayMs) {
  let timer = null;
  return (...args) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delayMs);
  };
}

function getAvatarEmoji() {
  return localStorage.getItem("avatar-emoji") || "";
}

function getDisplayName() {
  return localStorage.getItem("display-name") || "";
}

function getAppTitle() {
  return localStorage.getItem("app-title") || "My Second Brain";
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
    profileLink: getProfileLink()
  };
}

function categoryLabel(value) {
  const map = t("category");
  return map[value] || value;
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
  if (languageMode) {
    languageMode.value = currentLang;
  }
  if (authSubtitle) authSubtitle.textContent = t("authSubtitle");
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
  if (searchInput) searchInput.placeholder = t("searchPlaceholder");
  if (noteTitle) noteTitle.placeholder = t("noteTitlePlaceholder");
  if (noteContent) noteContent.placeholder = t("noteContentPlaceholder");
  if (issueText) issueText.placeholder = t("issuePlaceholder");
  if (displayNameInput) displayNameInput.placeholder = t("displayNamePlaceholder");
  if (appTitleInput) appTitleInput.placeholder = t("appTitlePlaceholder");
  if (profileLinkInput) profileLinkInput.placeholder = t("profileLinkPlaceholder");
  if (publicSiteLinkInput && !publicSiteLinkInput.value) {
    publicSiteLinkInput.placeholder = t("publicLinkPlaceholder");
  }
  if (noteCategory) {
    Array.from(noteCategory.options).forEach((opt) => {
      opt.textContent = categoryLabel(opt.value);
    });
  }
  renderPrettyLink();
}

function setMobilePanel(nextPanel) {
  mobilePanel = nextPanel;
  const compact = window.matchMedia("(max-width: 900px)").matches;
  if (!compact || !asidePanel || !notesPanel || !mobileNav) return;

  mobileNav.classList.remove("hidden");
  const blocks = Array.from(asidePanel.querySelectorAll("[data-mobile-panel]"));
  blocks.forEach((block) => block.classList.add("hidden"));
  if (nextPanel === "create" || nextPanel === "settings") {
    const target = asidePanel.querySelector(`[data-mobile-panel="${nextPanel}"]`);
    if (target) target.classList.remove("hidden");
    asidePanel.classList.remove("hidden");
    notesPanel.classList.add("hidden");
  } else {
    asidePanel.classList.add("hidden");
    notesPanel.classList.remove("hidden");
  }

  [mobileNavNotes, mobileNavCreate, mobileNavSettings].forEach((btn) => {
    if (!btn) return;
    btn.classList.toggle("active", btn.dataset.mobileTarget === nextPanel);
  });
}

function syncDesktopPanels() {
  if (!asidePanel || !notesPanel || !mobileNav) return;
  const compact = window.matchMedia("(max-width: 900px)").matches;
  const blocks = Array.from(asidePanel.querySelectorAll("[data-mobile-panel]"));
  if (!compact) {
    asidePanel.classList.remove("hidden");
    notesPanel.classList.remove("hidden");
    mobileNav.classList.add("hidden");
    blocks.forEach((block) => block.classList.remove("hidden"));
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
  const nextTitle = (title || "My Second Brain").trim() || "My Second Brain";
  const heading = document.querySelector("header h2");
  if (heading) {
    heading.textContent = nextTitle;
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
    throw new Error("Invalid settings file");
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
    alert(t("noLink"));
    return;
  }
  try {
    await navigator.clipboard.writeText(value);
    alert(t("copied"));
  } catch (error) {
    publicSiteLinkInput.select();
    document.execCommand("copy");
    alert(t("copied"));
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
  if (themeMode) {
    themeMode.value = mode;
  }
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
    throw new Error(data.error || "Request failed");
  }
  return data;
}

function setView() {
  const authed = Boolean(token && user);
  authView.classList.toggle("hidden", authed);
  appView.classList.toggle("hidden", !authed);
  if (authed) {
    const avatar = getAvatarEmoji();
    const displayName = getDisplayName();
    const mainText = displayName ? `${displayName} - ${user.email}` : user.email;
    meLabel.textContent = avatar ? `${avatar} ${mainText}` : mainText;
  }
}

function formatDate(ms) {
  return new Date(ms).toLocaleString();
}

function matchSearch(n, text) {
  if (!text) return true;
  const hay = `${n.title} ${n.content} ${n.category}`.toLowerCase();
  return hay.includes(text.toLowerCase());
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

  if (!filtered.length) {
    notesWrap.innerHTML = `<p>${escapeHtml(t("noNotes"))}</p>`;
    return;
  }

  const groups = ["projects", "areas", "resources", "archives"].map((category) => ({
    category,
    notes: filtered.filter((n) => n.category === category)
  }));

  if (activeFolderLabel) {
    activeFolderLabel.textContent = activeFolder ? categoryLabel(activeFolder) : "";
  }
  if (clearFolderBtn) {
    clearFolderBtn.classList.toggle("hidden", !activeFolder);
  }

  notesWrap.innerHTML = groups
    .filter((g) => g.notes.length > 0)
    .map(
      (g) => `
      <section class="tree-group">
        <details class="tree-node" ${activeFolder === g.category ? "open" : ""}>
          <summary data-role="open-folder" data-folder="${g.category}">
            <span class="tree-caret">▾</span>${escapeHtml(categoryLabel(g.category))}
            <span class="folder-count">(${g.notes.length})</span>
          </summary>
          <div class="tree-children">
            ${(activeFolder === g.category ? g.notes : [])
              .map(
                (n) => `
              <div class="tree-item">
                <span class="tree-bullet">•</span>
                <article class="note" data-id="${n.id}">
                  <input data-role="title" class="note-title-input" value="${escapeHtml(n.title)}" />
                  <div class="meta">${categoryLabel(n.category)} - ${formatDate(n.updatedAt)}</div>
                  <textarea data-role="content">${escapeHtml(n.content)}</textarea>
                  <div class="note-actions">
                    <select data-role="category">
                      ${["projects", "areas", "resources", "archives"]
                        .map(
                          (c) =>
                            `<option value="${c}" ${n.category === c ? "selected" : ""}>${escapeHtml(
                              categoryLabel(c)
                            )}</option>`
                        )
                        .join("")}
                    </select>
                    <button data-role="save">${escapeHtml(t("save"))}</button>
                    <button class="danger" data-role="delete">${escapeHtml(t("del"))}</button>
                  </div>
                </article>
              </div>
            `
              )
              .join("")}
          </div>
        </details>
      </section>
    `
    )
    .join("");

  if (!activeFolder && filtered.length > 0) {
    notesWrap.insertAdjacentHTML(
      "afterbegin",
      `<p class="folder-hint">${escapeHtml(t("chooseFolder"))}</p>`
    );
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
    syncStatus.textContent = `Synced ${new Date().toLocaleTimeString()}`;
  } catch (error) {
    syncStatus.textContent = t("syncError");
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

function startLiveEvents() {
  stopLiveEvents();
  if (!token) return;
  const url = `/api/events?token=${encodeURIComponent(token)}`;
  const es = new EventSource(url);
  eventsConnection = es;

  es.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data || "{}");
      if (data.event === "connected") {
        syncStatus.textContent = t("liveConnected");
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
      syncStatus.textContent = `Live synced ${new Date().toLocaleTimeString()}`;
    } catch (error) {
      syncStatus.textContent = t("liveParseError");
    }
  };

  es.onerror = () => {
    syncStatus.textContent = t("liveReconnect");
    stopLiveEvents();
    setTimeout(startLiveEvents, 2000);
  };
}

async function doAuth(mode) {
  authError.textContent = "";
  try {
    const payload = {
      email: emailInput.value.trim(),
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
    authError.textContent = error.message;
  }
}

async function createNote() {
  try {
    const payload = {
      title: noteTitle.value.trim(),
      category: noteCategory.value,
      content: noteContent.value
    };
    const data = await api("/api/notes", {
      method: "POST",
      body: JSON.stringify(payload)
    });
    notes.unshift(data.note);
    renderSignature = "";
    renderNotes();
    noteTitle.value = "";
    noteContent.value = "";
  } catch (error) {
    alert(error.message);
  }
}

async function saveOne(id, title, content, category) {
  const current = notes.find((n) => n.id === id);
  if (!current) return;
  const data = await api(`/api/notes/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      title,
      content,
      category
    })
  });
  notes = notes.map((n) => (n.id === id ? data.note : n));
  renderSignature = "";
  renderNotes();
}

async function removeOne(id) {
  await api(`/api/notes/${id}`, { method: "DELETE" });
  notes = notes.filter((n) => n.id !== id);
  renderSignature = "";
  renderNotes();
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
    alert(t("issueSent"));
  } catch (error) {
    alert(error.message);
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
  });
}
if (createNoteBtn) createNoteBtn.addEventListener("click", createNote);
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
if (themeMode) {
  themeMode.addEventListener("change", () => {
    const mode = themeMode.value;
    localStorage.setItem("theme-mode", mode);
    applyTheme(mode);
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
if (languageMode) {
  languageMode.addEventListener("change", () => {
    currentLang = languageMode.value;
    applyLanguage();
    renderSignature = "";
    renderNotes();
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
      alert(t("imported"));
    } catch (error) {
      alert(t("importError"));
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

notesWrap.addEventListener("click", async (event) => {
  const target = event.target;
  const folderTrigger = target.closest('[data-role="open-folder"]');
  if (folderTrigger && folderTrigger.dataset.folder) {
    event.preventDefault();
    activeFolder = activeFolder === folderTrigger.dataset.folder ? "" : folderTrigger.dataset.folder;
    renderSignature = "";
    renderNotes();
    return;
  }
  const article = target.closest(".note");
  if (!article) return;
  const id = article.dataset.id;
  const title = article.querySelector('[data-role="title"]').value;
  const content = article.querySelector('[data-role="content"]').value;
  const category = article.querySelector('[data-role="category"]').value;

  if (target.dataset.role === "save") {
    await saveOne(id, title, content, category);
  }
  if (target.dataset.role === "delete") {
    await removeOne(id);
  }
});

async function boot() {
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
  } catch (error) {
    clearAuth();
    setView();
  }
}

boot();

