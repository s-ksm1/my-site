const authView = document.getElementById("auth-view");
const appView = document.getElementById("app-view");
const authError = document.getElementById("auth-error");
const meLabel = document.getElementById("me");
const syncStatus = document.getElementById("sync-status");
const themeMode = document.getElementById("theme-mode");

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

let token = localStorage.getItem("token") || "";
let user = JSON.parse(localStorage.getItem("user") || "null");
let notes = [];
let syncTimer = null;
let lastSync = 0;
let eventsConnection = null;
let publicLinkTimer = null;

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
  const map = {
    projects: "📁 Projects",
    areas: "🎯 Areas",
    resources: "📚 Resources",
    archives: "🗄️ Archives"
  };
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
    return "🔗 Open link";
  }
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
  applyCustomization();
  setView();
}

async function loadPublicSiteLink() {
  try {
    const res = await fetch("/api/public-link", {
      headers: { "Content-Type": "application/json" }
    });
    const data = await res.json().catch(() => ({}));
    const url = String(data.url || "").trim();
    if (!url) {
      publicSiteLinkInput.value = "";
      publicSiteLinkInput.placeholder = "Run go-online.cmd to get link";
      return;
    }
    publicSiteLinkInput.value = url;
  } catch (error) {
    publicSiteLinkInput.value = "";
    publicSiteLinkInput.placeholder = "Public link unavailable";
  }
}

async function copyPublicLink() {
  const value = publicSiteLinkInput.value.trim();
  if (!value) {
    alert("No public link yet. Run go-online.cmd first.");
    return;
  }
  try {
    await navigator.clipboard.writeText(value);
    alert("Public link copied.");
  } catch (error) {
    publicSiteLinkInput.select();
    document.execCommand("copy");
    alert("Public link copied.");
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
  const q = searchInput.value.trim();
  const filtered = notes.filter((n) => !n.deletedAt).filter((n) => matchSearch(n, q));
  if (!filtered.length) {
    notesWrap.innerHTML = "<p>No notes yet.</p>";
    return;
  }

  notesWrap.innerHTML = filtered
    .map(
      (n) => `
      <article class="note" data-id="${n.id}">
        <input data-role="title" class="note-title-input" value="${escapeHtml(n.title)}" />
        <div class="meta">${categoryLabel(n.category)} - ${formatDate(n.updatedAt)}</div>
        <textarea data-role="content">${escapeHtml(n.content)}</textarea>
        <div class="note-actions">
          <select data-role="category">
            ${["projects", "areas", "resources", "archives"]
              .map(
                (c) =>
                  `<option value="${c}" ${n.category === c ? "selected" : ""}>${escapeHtml(categoryLabel(c))}</option>`
              )
              .join("")}
          </select>
          <button data-role="save">Save</button>
          <button class="danger" data-role="delete">Delete</button>
        </div>
      </article>
    `
    )
    .join("");
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
  renderNotes();
}

async function sync() {
  if (!token) return;
  try {
    syncStatus.textContent = "Syncing...";
    const data = await api(`/api/sync?since=${lastSync}`);
    if (Array.isArray(data.notes) && data.notes.length) {
      const byId = new Map(notes.map((n) => [n.id, n]));
      data.notes.forEach((n) => byId.set(n.id, n));
      notes = Array.from(byId.values()).sort((a, b) => b.updatedAt - a.updatedAt);
      renderNotes();
    }
    lastSync = data.serverTime || Date.now();
    syncStatus.textContent = `Synced ${new Date().toLocaleTimeString()}`;
  } catch (error) {
    syncStatus.textContent = "Sync error";
  }
}

function startSyncLoop() {
  if (syncTimer) clearInterval(syncTimer);
  syncTimer = setInterval(sync, 5000);
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
        syncStatus.textContent = "Live sync connected";
        return;
      }

      if (data.event === "note_changed" && data.payload) {
        const byId = new Map(notes.map((n) => [n.id, n]));
        byId.set(data.payload.id, data.payload);
        notes = Array.from(byId.values()).sort((a, b) => b.updatedAt - a.updatedAt);
        renderNotes();
      }

      if (data.event === "note_deleted" && data.payload) {
        notes = notes.filter((n) => n.id !== data.payload.id);
        renderNotes();
      }

      if (data.serverTime) {
        lastSync = data.serverTime;
      }
      syncStatus.textContent = `Live synced ${new Date().toLocaleTimeString()}`;
    } catch (error) {
      syncStatus.textContent = "Live sync parse error";
    }
  };

  es.onerror = () => {
    syncStatus.textContent = "Live sync reconnecting...";
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
  renderNotes();
}

async function removeOne(id) {
  await api(`/api/notes/${id}`, { method: "DELETE" });
  notes = notes.filter((n) => n.id !== id);
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
    alert("Issue sent.");
  } catch (error) {
    alert(error.message);
  }
}

registerBtn.addEventListener("click", () => doAuth("register"));
loginBtn.addEventListener("click", () => doAuth("login"));
logoutBtn.addEventListener("click", () => {
  clearAuth();
  notes = [];
  setView();
  renderNotes();
  if (syncTimer) clearInterval(syncTimer);
  stopLiveEvents();
});

createNoteBtn.addEventListener("click", createNote);
searchInput.addEventListener("input", renderNotes);
issueBtn.addEventListener("click", sendIssue);
avatarEmojiInput.addEventListener("input", () => {
  localStorage.setItem("avatar-emoji", avatarEmojiInput.value.trim().slice(0, 3));
  setView();
});
themeMode.addEventListener("change", () => {
  const mode = themeMode.value;
  localStorage.setItem("theme-mode", mode);
  applyTheme(mode);
});
displayNameInput.addEventListener("input", () => {
  localStorage.setItem("display-name", displayNameInput.value.trim());
  setView();
});
appTitleInput.addEventListener("input", () => {
  localStorage.setItem("app-title", appTitleInput.value.trim());
  applyAppTitle(appTitleInput.value);
});
accentColorInput.addEventListener("change", () => {
  localStorage.setItem("accent-color", accentColorInput.value);
  applyAccentColor(accentColorInput.value);
});
fontFamilyInput.addEventListener("change", () => {
  localStorage.setItem("font-family", fontFamilyInput.value);
  applyFontFamily(fontFamilyInput.value);
});
bgPatternInput.addEventListener("change", () => {
  localStorage.setItem("bg-pattern", bgPatternInput.value);
  applyBgPattern(bgPatternInput.value);
});
densityModeInput.addEventListener("change", () => {
  localStorage.setItem("density-mode", densityModeInput.value);
  applyDensityMode(densityModeInput.value);
});
motionModeInput.addEventListener("change", () => {
  localStorage.setItem("motion-mode", motionModeInput.value);
  applyMotionMode(motionModeInput.value);
});
profileLinkInput.addEventListener("input", () => {
  localStorage.setItem("profile-link", profileLinkInput.value.trim());
  renderPrettyLink();
});
exportSettingsBtn.addEventListener("click", exportSettings);
importSettingsBtn.addEventListener("click", () => importSettingsFile.click());
refreshPublicLinkBtn.addEventListener("click", loadPublicSiteLink);
copyPublicLinkBtn.addEventListener("click", copyPublicLink);
importSettingsFile.addEventListener("change", async () => {
  const [file] = importSettingsFile.files || [];
  if (!file) return;
  try {
    const text = await file.text();
    const parsed = JSON.parse(text);
    applyImportedSettings(parsed);
    alert("Settings imported.");
  } catch (error) {
    alert("Could not import settings JSON.");
  } finally {
    importSettingsFile.value = "";
  }
});

notesWrap.addEventListener("click", async (event) => {
  const target = event.target;
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
  applyTheme(getThemeMode());
  applyCustomization();
  await loadPublicSiteLink();
  if (publicLinkTimer) clearInterval(publicLinkTimer);
  publicLinkTimer = setInterval(loadPublicSiteLink, 12000);
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

