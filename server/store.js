const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const dataPath = path.join(__dirname, "data.json");
const issuesPath = path.join(__dirname, "issues.json");

const baseData = {
  users: [],
  notes: []
};

function getEncryptionKey() {
  const secret = String(process.env.APP_ENCRYPTION_KEY || "").trim();
  if (!secret) return null;
  return crypto.createHash("sha256").update(secret).digest();
}

function encryptObject(data, key) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(data), "utf-8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return {
    enc: true,
    alg: "aes-256-gcm",
    iv: iv.toString("base64"),
    tag: tag.toString("base64"),
    data: encrypted.toString("base64")
  };
}

function decryptObject(payload, key) {
  if (!payload || payload.enc !== true) {
    return payload;
  }
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, Buffer.from(payload.iv, "base64"));
  decipher.setAuthTag(Buffer.from(payload.tag, "base64"));
  const plain = Buffer.concat([
    decipher.update(Buffer.from(payload.data, "base64")),
    decipher.final()
  ]).toString("utf-8");
  return JSON.parse(plain);
}

function ensureFiles() {
  if (!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, JSON.stringify(baseData, null, 2), "utf-8");
  }
  if (!fs.existsSync(issuesPath)) {
    fs.writeFileSync(issuesPath, JSON.stringify({ issues: [] }, null, 2), "utf-8");
  }
}

function readJson(filePath, fallback) {
  const key = getEncryptionKey();
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(raw);
    if (!key) return parsed;
    return decryptObject(parsed, key);
  } catch (error) {
    return fallback;
  }
}

function writeJson(filePath, data) {
  const key = getEncryptionKey();
  const payload = key ? encryptObject(data, key) : data;
  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2), "utf-8");
}

function getData() {
  ensureFiles();
  return readJson(dataPath, baseData);
}

function saveData(next) {
  writeJson(dataPath, next);
}

function getIssues() {
  ensureFiles();
  return readJson(issuesPath, { issues: [] });
}

function addIssue(issue) {
  const all = getIssues();
  all.issues.push(issue);
  writeJson(issuesPath, all);
}

module.exports = {
  getData,
  saveData,
  addIssue
};

