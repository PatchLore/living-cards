import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { Resend } from "resend";
import { getCard } from "../catalog";
import { siteUrl } from "../siteUrl";

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export function buildCardEmail({
  shareId,
  cardKey,
  recipientName,
}: {
  shareId: string;
  cardKey: string;
  recipientName: string;
}) {
  const base = siteUrl();
  const card = getCard(cardKey);
  const cardUrl = `${base}/c/${shareId}`;
  const image = `${base}${card?.poster ?? "/og-image.jpg"}`;
  const name = escapeHtml(recipientName || "your recipient");
  const christmas = card?.category === "Christmas";

  const subject = christmas
    ? `Your Christmas card for ${recipientName || "your recipient"} is ready 🎄`
    : `Your card for ${recipientName || "your recipient"} is ready 🌱`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background:#f4efe6;font-family:Georgia,'Times New Roman',serif;">
  <table role="presentation" width="100%" style="border-collapse:collapse;background:#f4efe6;">
    <tr><td style="padding:32px 16px;">
      <table role="presentation" width="100%" style="max-width:520px;margin:0 auto;border-collapse:collapse;background:#ffffff;border-radius:16px;overflow:hidden;">
        <tr><td style="background:#0f1d2e;padding:28px 32px 8px;text-align:center;">
          <p style="margin:0;font-size:13px;letter-spacing:3px;text-transform:uppercase;color:#e9c97a;">CardRoots</p>
          <h1 style="margin:12px 0 0;font-size:26px;font-weight:normal;color:#fbf6ec;line-height:1.3;">Your card for ${name} is ready</h1>
        </td></tr>
        <tr><td style="background:#0f1d2e;padding:20px 32px 28px;text-align:center;">
          <a href="${cardUrl}" style="text-decoration:none;">
            <img src="${image}" width="240" alt="${escapeHtml(card?.title ?? "Your card")}" style="display:block;margin:0 auto;width:240px;max-width:100%;border-radius:12px;border:1px solid #2a3a52;">
          </a>
        </td></tr>
        <tr><td style="padding:28px 32px 8px;font-family:Arial,Helvetica,sans-serif;color:#1f2937;font-size:16px;line-height:1.6;">
          <p style="margin:0 0 16px;">Thank you for your order. Your ${escapeHtml(card?.title ?? "card")} for <strong>${name}</strong> is ready to send.</p>
          <p style="margin:0 0 8px;"><strong>How to send it:</strong> share the link below with ${name} by text, WhatsApp or email, or simply forward them this email.</p>
        </td></tr>
        <tr><td style="padding:16px 32px;text-align:center;">
          <a href="${cardUrl}" style="display:inline-block;background:#b3263a;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:999px;font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:bold;">Open the card</a>
        </td></tr>
        <tr><td style="padding:8px 32px 28px;font-family:Arial,Helvetica,sans-serif;text-align:center;">
          <p style="margin:0 0 6px;font-size:13px;color:#6b7280;">Card link</p>
          <p style="margin:0;font-size:14px;color:#0f1d2e;word-break:break-all;"><a href="${cardUrl}" style="color:#0f1d2e;">${cardUrl}</a></p>
        </td></tr>
        <tr><td style="padding:20px 32px 28px;border-top:1px solid #eee4d3;background:#faf6ee;font-family:Arial,Helvetica,sans-serif;text-align:center;">
          <p style="margin:0;font-size:13px;line-height:1.5;color:#4b5563;">🌳 Your card helps plant a real tree.<br>Questions? Reply to this email or write to info@cardroots.com.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = `Your card for ${recipientName || "your recipient"} is ready.\n\nOpen it here: ${cardUrl}\n\nShare this link with them, or forward this email.\n\nYour card helps plant a real tree. Questions? info@cardroots.com`;

  return { subject, html, text, cardUrl };
}

/**
 * Emails the buyer their card link. Throws if the email could not be sent, so
 * the caller can leave the card marked unsent and let Stripe retry.
 * Set EMAIL_DRY_RUN=1 to write the email to .email-previews/ instead of sending.
 */
export async function sendCardEmail({
  to,
  shareId,
  cardKey,
  recipientName,
}: {
  to: string;
  shareId: string;
  cardKey: string;
  recipientName: string;
}) {
  const email = buildCardEmail({ shareId, cardKey, recipientName });

  if (process.env.EMAIL_DRY_RUN === "1") {
    const dir = path.join(process.cwd(), ".email-previews");
    await mkdir(dir, { recursive: true });
    const file = path.join(dir, `${Date.now()}-${shareId}.html`);
    await writeFile(file, `<!-- to: ${to} | subject: ${email.subject} -->\n${email.html}`);
    console.log(`[EMAIL] Dry run: wrote ${file}`);
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from) throw new Error("RESEND_API_KEY or EMAIL_FROM is not set");

  const { error } = await new Resend(apiKey).emails.send({
    from: from.includes("<") ? from : `CardRoots <${from}>`,
    to,
    replyTo: "info@cardroots.com",
    subject: email.subject,
    html: email.html,
    text: email.text,
  });
  if (error) throw new Error(`Resend rejected the email: ${error.name}: ${error.message}`);
}
