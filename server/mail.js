const DEFAULT_FEEDBACK_TO = "bumblebee.autobot.bee@gmail.com";

let transporterCache = null;
let nodemailerCache;

function getNodemailer() {
  if (nodemailerCache !== undefined) {
    return nodemailerCache;
  }
  try {
    nodemailerCache = require("nodemailer");
  } catch (error) {
    nodemailerCache = null;
    // eslint-disable-next-line no-console
    console.warn("[mail] nodemailer is not installed; email delivery is disabled.");
  }
  return nodemailerCache;
}

function getTransporter() {
  if (transporterCache) return transporterCache;
  const host = String(process.env.SMTP_HOST || "").trim();
  const user = String(process.env.SMTP_USER || "").trim();
  const pass = String(process.env.SMTP_PASS || "").trim();
  if (!host || !user || !pass) return null;
  const nodemailer = getNodemailer();
  if (!nodemailer) return null;
  transporterCache = nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE || "").toLowerCase() === "true",
    auth: { user, pass }
  });
  return transporterCache;
}

/**
 * Sends feedback to FEEDBACK_TO (default: bumblebee.autobot.bee@gmail.com).
 * Requires SMTP_HOST, SMTP_USER, SMTP_PASS in environment.
 */
async function sendFeedbackEmail({ userEmail, message, userAgent }) {
  const to = (process.env.FEEDBACK_TO || DEFAULT_FEEDBACK_TO).trim();
  const transport = getTransporter();
  if (!transport) {
    // eslint-disable-next-line no-console
    console.warn("[mail] SMTP not configured; set SMTP_HOST, SMTP_USER, SMTP_PASS to email feedback.");
    return { sent: false, reason: "no_smtp" };
  }
  const from = String(process.env.SMTP_FROM || "").trim() || `"My Second Brain" <${process.env.SMTP_USER}>`;
  await transport.sendMail({
    from,
    to,
    replyTo: userEmail,
    subject: `[My Second Brain] Feedback from ${userEmail}`,
    text: `${message}\n\n---\nUser-Agent: ${userAgent}\nTime: ${new Date().toISOString()}`
  });
  return { sent: true };
}

module.exports = { sendFeedbackEmail, DEFAULT_FEEDBACK_TO };
