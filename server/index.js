const express = require("express");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { getData, saveData, addIssue } = require("./store");

const app = express();
const PORT = process.env.PORT || 4000;
const HOST = process.env.HOST || (process.env.PORT ? "0.0.0.0" : process.env.ALLOW_LAN === "true" ? "0.0.0.0" : "127.0.0.1");
const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret";
const TRUST_PROXY = String(process.env.TRUST_PROXY || "").toLowerCase() === "true" || process.env.TRUST_PROXY === "1";
if (TRUST_PROXY) {
  app.set("trust proxy", 1);
}

function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
const CATEGORIES = ["projects", "areas", "resources", "archives"];
const liveClientsByUser = new Map();
const authAttempts = new Map();
const AUTH_WINDOW_MS = 10 * 60 * 1000;
const AUTH_MAX_ATTEMPTS = 25;
const PUBLIC_LINK_PATH = path.join(__dirname, "public-link.json");

app.disable("x-powered-by");
app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "..", "web")));
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.setHeader(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self'",
      "style-src 'self'",
      "img-src 'self' data:",
      "connect-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'"
    ].join("; ")
  );
  res.setHeader("Cache-Control", "no-store");
  next();
});

if (process.env.NODE_ENV === "production" && JWT_SECRET === "change_this_secret") {
  throw new Error("JWT_SECRET must be set in production");
}

function safeUser(user) {
  return {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt
  };
}

function auth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) {
    return res.status(401).json({ error: "No token" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (payload.typ === "sse") {
      return res.status(401).json({ error: "Wrong token type" });
    }
    req.user = payload;
    return next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

function authSse(req, res, next) {
  const token = String(req.query.token || "").trim();
  if (!token) {
    return res.status(401).end();
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (payload.typ !== "sse") {
      return res.status(403).end();
    }
    req.user = { userId: payload.userId, email: payload.email };
    return next();
  } catch (error) {
    return res.status(401).end();
  }
}

function sendLiveEvent(userId, event, payload) {
  const clients = liveClientsByUser.get(userId);
  if (!clients || clients.size === 0) return;
  const body = JSON.stringify({
    event,
    payload,
    serverTime: Date.now()
  });
  clients.forEach((res) => {
    res.write(`data: ${body}\n\n`);
  });
}

app.post("/api/events-token", auth, (req, res) => {
  const token = jwt.sign(
    { userId: req.user.userId, email: req.user.email, typ: "sse" },
    JWT_SECRET,
    { expiresIn: "4m" }
  );
  return res.json({ token, expiresIn: 240 });
});

app.get("/api/events", authSse, (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  const userId = req.user.userId;
  if (!liveClientsByUser.has(userId)) {
    liveClientsByUser.set(userId, new Set());
  }
  const clients = liveClientsByUser.get(userId);
  clients.add(res);
  res.write(`data: ${JSON.stringify({ event: "connected", serverTime: Date.now() })}\n\n`);

  const keepAliveTimer = setInterval(() => {
    res.write(": ping\n\n");
  }, 25000);

  req.on("close", () => {
    clearInterval(keepAliveTimer);
    clients.delete(res);
    if (clients.size === 0) {
      liveClientsByUser.delete(userId);
    }
  });
});

function normalizeNoteInput(input = {}) {
  const title = String(input.title || "").trim().slice(0, 150);
  const content = String(input.content || "").trim().slice(0, 50000);
  const category = String(input.category || "resources").toLowerCase();
  return {
    title: title || "Untitled",
    content,
    category: CATEGORIES.includes(category) ? category : "resources"
  };
}

function checkRateLimit(req, res) {
  const ip = String(req.ip || req.socket.remoteAddress || "unknown");
  const now = Date.now();
  const bucket = authAttempts.get(ip) || [];
  const recent = bucket.filter((ts) => now - ts < AUTH_WINDOW_MS);
  recent.push(now);
  authAttempts.set(ip, recent);
  if (recent.length > AUTH_MAX_ATTEMPTS) {
    res.status(429).json({ error: "Too many attempts, try later" });
    return true;
  }
  return false;
}

function getPublicLinkPayload() {
  try {
    const raw = fs.readFileSync(PUBLIC_LINK_PATH, "utf-8");
    const parsed = JSON.parse(raw);
    return {
      url: String(parsed.url || ""),
      updatedAt: Number(parsed.updatedAt || 0)
    };
  } catch (error) {
    return { url: "", updatedAt: 0 };
  }
}

app.post("/api/auth/register", asyncHandler(async (req, res) => {
  if (checkRateLimit(req, res)) return;
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");

  if (!email || !password || password.length < 6) {
    return res.status(400).json({ error: "Invalid email or password too short" });
  }

  const db = getData();
  const exists = db.users.some((u) => u.email === email);
  if (exists) {
    return res.status(409).json({ error: "Email already exists" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = {
    id: uuidv4(),
    email,
    passwordHash,
    createdAt: Date.now()
  };
  db.users.push(user);
  saveData(db);

  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: "30d" });
  return res.status(201).json({ token, user: safeUser(user) });
}));

app.post("/api/auth/login", asyncHandler(async (req, res) => {
  if (checkRateLimit(req, res)) return;
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");

  const db = getData();
  const user = db.users.find((u) => u.email === email);
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: "30d" });
  return res.json({ token, user: safeUser(user) });
}));

app.get("/api/notes", auth, (req, res) => {
  const db = getData();
  const notes = db.notes
    .filter((n) => n.userId === req.user.userId && !n.deletedAt)
    .sort((a, b) => b.updatedAt - a.updatedAt);
  return res.json({ notes });
});

app.post("/api/notes", auth, (req, res) => {
  const db = getData();
  const input = normalizeNoteInput(req.body);
  const now = Date.now();

  const note = {
    id: uuidv4(),
    userId: req.user.userId,
    title: input.title,
    content: input.content,
    category: input.category,
    createdAt: now,
    updatedAt: now,
    deletedAt: null
  };

  db.notes.push(note);
  saveData(db);
  sendLiveEvent(req.user.userId, "note_changed", note);
  return res.status(201).json({ note });
});

app.put("/api/notes/:id", auth, (req, res) => {
  const db = getData();
  const note = db.notes.find((n) => n.id === req.params.id && n.userId === req.user.userId);
  if (!note || note.deletedAt) {
    return res.status(404).json({ error: "Note not found" });
  }

  const input = normalizeNoteInput(req.body);
  note.title = input.title;
  note.content = input.content;
  note.category = input.category;
  note.updatedAt = Date.now();

  saveData(db);
  sendLiveEvent(req.user.userId, "note_changed", note);
  return res.json({ note });
});

app.delete("/api/notes/:id", auth, (req, res) => {
  const db = getData();
  const note = db.notes.find((n) => n.id === req.params.id && n.userId === req.user.userId);
  if (!note || note.deletedAt) {
    return res.status(404).json({ error: "Note not found" });
  }
  note.deletedAt = Date.now();
  note.updatedAt = Date.now();
  saveData(db);
  sendLiveEvent(req.user.userId, "note_deleted", { id: note.id, updatedAt: note.updatedAt });
  return res.json({ ok: true });
});

app.post("/api/notes/:id/restore", auth, (req, res) => {
  const db = getData();
  const note = db.notes.find((n) => n.id === req.params.id && n.userId === req.user.userId);
  if (!note || !note.deletedAt) {
    return res.status(404).json({ error: "Note not found" });
  }
  note.deletedAt = null;
  note.updatedAt = Date.now();
  saveData(db);
  sendLiveEvent(req.user.userId, "note_changed", note);
  return res.json({ note });
});

app.get("/api/sync", auth, (req, res) => {
  const since = Number(req.query.since || 0);
  const db = getData();
  const notes = db.notes
    .filter((n) => n.userId === req.user.userId && n.updatedAt > since)
    .sort((a, b) => b.updatedAt - a.updatedAt);
  return res.json({ notes, serverTime: Date.now() });
});

app.post("/api/feedback", auth, (req, res) => {
  if (checkRateLimit(req, res)) return;
  const message = String(req.body.message || "").trim().slice(0, 3000);
  if (!message) {
    return res.status(400).json({ error: "Empty message" });
  }
  addIssue({
    id: uuidv4(),
    userId: req.user.userId,
    email: req.user.email,
    message,
    userAgent: req.headers["user-agent"] || "unknown",
    createdAt: Date.now()
  });
  return res.status(201).json({ ok: true });
});

app.post(
  "/api/account/delete",
  auth,
  asyncHandler(async (req, res) => {
    const password = String(req.body.password || "");
    if (!password) {
      return res.status(400).json({ error: "Password required for account deletion" });
    }
    const db = getData();
    const user = db.users.find((u) => u.id === req.user.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    db.notes = db.notes.filter((n) => n.userId !== user.id);
    db.users = db.users.filter((u) => u.id !== user.id);
    saveData(db);
    const clients = liveClientsByUser.get(user.id);
    if (clients) {
      clients.forEach((clientRes) => {
        try {
          clientRes.end();
        } catch (e) {
          /* ignore */
        }
      });
      liveClientsByUser.delete(user.id);
    }
    return res.json({ ok: true });
  })
);

app.get("/api/public-link", (req, res) => {
  const link = getPublicLinkPayload();
  return res.json(link);
});

app.get("/api/stats", (req, res) => {
  const db = getData();
  return res.json({ userCount: Array.isArray(db.users) ? db.users.length : 0 });
});

app.use("/api", (req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "web", "index.html"));
});

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  // eslint-disable-next-line no-console
  console.error("[server]", err && err.stack ? err.stack : err);
  if (req.path && String(req.path).startsWith("/api")) {
    return res.status(500).json({ error: "Server error" });
  }
  return res.status(500).send("Server error");
});

app.listen(PORT, HOST, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running at http://${HOST}:${PORT}`);
});

