import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { google } from "googleapis";

export const runtime = "nodejs";

const toEmail = process.env.CONTACT_TO_EMAIL || "bridgetobits@gmail.com";
const fromEmail = process.env.CONTACT_FROM_EMAIL || process.env.SMTP_USER || "no-reply@bridgetobits.com";
const smtpHost = process.env.SMTP_HOST;
const smtpPort = Number(process.env.SMTP_PORT || 587);
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;

const gmailServiceAccount = process.env.GMAIL_SERVICE_ACCOUNT_EMAIL;
const gmailImpersonate = process.env.GMAIL_IMPERSONATE_EMAIL || process.env.CONTACT_FROM_EMAIL;
const gmailPrivateKey = process.env.GMAIL_PRIVATE_KEY?.replace(/\\n/g, "\n");

async function sendWithGmailAPI(message: {
  from: string;
  to: string;
  replyTo?: string;
  subject: string;
  text: string;
  html: string;
}) {
  if (!gmailServiceAccount || !gmailPrivateKey || !gmailImpersonate) {
    return { ok: false, reason: "gmail-api-not-configured" } as const;
  }

  const jwtClient = new google.auth.JWT({
    email: gmailServiceAccount,
    key: gmailPrivateKey,
    scopes: ["https://www.googleapis.com/auth/gmail.send"],
    subject: gmailImpersonate,
  });

  const gmail = google.gmail({ version: "v1", auth: jwtClient });

  const raw = Buffer.from(
    [
      `From: ${message.from}`,
      `To: ${message.to}`,
      message.replyTo ? `Reply-To: ${message.replyTo}` : null,
      `Subject: ${message.subject}`,
      "MIME-Version: 1.0",
      "Content-Type: text/html; charset=utf-8",
      "",
      message.html,
    ]
      .filter(Boolean)
      .join("\n")
  )
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  await gmail.users.messages.send({ userId: "me", requestBody: { raw } });
  return { ok: true } as const;
}

function validatePayload(body: unknown) {
  if (typeof body !== "object" || body === null) return null;
  const { firstName, lastName, email, phone, message } = body as Record<string, string>;
  const cleaned = {
    firstName: firstName?.toString().trim() || "",
    lastName: lastName?.toString().trim() || "",
    email: email?.toString().trim() || "",
    phone: phone?.toString().trim() || "",
    message: message?.toString().trim() || "",
  };
  if (!cleaned.firstName || !cleaned.lastName || !cleaned.email || !cleaned.message) return null;
  return cleaned;
}

export async function POST(request: Request) {
  try {
    const payload = validatePayload(await request.json());
    if (!payload) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const fullName = `${payload.firstName} ${payload.lastName}`.trim();
    const submittedAt = new Date().toISOString();

    const textBody = [
      `Name: ${fullName}`,
      `Email: ${payload.email}`,
      `Phone: ${payload.phone || "(not provided)"}`,
      `Submitted At: ${submittedAt}`,
      "",
      payload.message,
    ].join("\n");

    const htmlBody = `
        <h2>New contact form submission</h2>
        <ul>
          <li><strong>Name:</strong> ${fullName}</li>
          <li><strong>Email:</strong> ${payload.email}</li>
          <li><strong>Phone:</strong> ${payload.phone || "(not provided)"}</li>
          <li><strong>Submitted At:</strong> ${submittedAt}</li>
        </ul>
        <p><strong>Message:</strong></p>
        <pre style="white-space:pre-wrap;font-family:inherit;">${payload.message}</pre>
      `;

    // Try Gmail API first (best for Vercel)
    const gmailResult = await sendWithGmailAPI({
      from: fromEmail,
      to: toEmail,
      replyTo: payload.email,
      subject: `New contact form submission from ${fullName}`,
      text: textBody,
      html: htmlBody,
    });

    // If Gmail API is not configured, try SMTP
    if (!gmailResult.ok && gmailResult.reason === "gmail-api-not-configured") {
      if (!smtpHost || !smtpUser || !smtpPass) {
        return NextResponse.json({ error: "Email is not configured (Gmail API or SMTP)." }, { status: 500 });
      }

      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      await transporter.sendMail({
        from: fromEmail,
        to: toEmail,
        replyTo: payload.email,
        subject: `New contact form submission from ${fullName}`,
        text: textBody,
        html: htmlBody,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact form send error", error);
    return NextResponse.json({ error: "Failed to send message." }, { status: 500 });
  }
}
