const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const rootDir = path.join(__dirname, "..");
const cloudflaredPath = path.join(rootDir, "tools", "cloudflared.exe");
const publicLinkPath = path.join(rootDir, "server", "public-link.json");

function writePublicLink(url) {
  const payload = {
    url,
    updatedAt: Date.now()
  };
  fs.writeFileSync(publicLinkPath, JSON.stringify(payload, null, 2), "utf-8");
}

function clearPublicLink() {
  writePublicLink("");
}

function extractLink(text) {
  const match = String(text).match(/https:\/\/[a-z0-9.-]+\.trycloudflare\.com/i);
  return match ? match[0] : "";
}

if (!fs.existsSync(cloudflaredPath)) {
  // eslint-disable-next-line no-console
  console.error("cloudflared.exe not found in tools folder.");
  process.exit(1);
}

clearPublicLink();

const child = spawn(
  cloudflaredPath,
  ["tunnel", "--url", "http://127.0.0.1:4000", "--protocol", "http2", "--no-autoupdate"],
  { cwd: rootDir, stdio: ["ignore", "pipe", "pipe"] }
);

let foundLink = "";

function onChunk(chunk) {
  const text = chunk.toString();
  process.stdout.write(text);
  if (!foundLink) {
    const maybe = extractLink(text);
    if (maybe) {
      foundLink = maybe;
      writePublicLink(foundLink);
      // eslint-disable-next-line no-console
      console.log(`\nPublic URL saved: ${foundLink}\n`);
    }
  }
}

child.stdout.on("data", onChunk);
child.stderr.on("data", onChunk);

child.on("exit", (code) => {
  clearPublicLink();
  process.exit(code || 0);
});

process.on("SIGINT", () => {
  clearPublicLink();
  child.kill("SIGINT");
});

