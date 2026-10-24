import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { Resend } from "resend";
import { getCard } from "../catalog";
import { siteUrl } from "../siteUrl";
import { KIDS_SCENES, parseKidsCardKey } from "../kids";
import { IMMEDIATE_SUPPLY_CONFIRMATION, cardLinkExpiresAt, formatUkDate } from "../sales";

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export function buildCardEmail({
  shareId,
  cardKey,
  recipientName,
  treeLocation,
  createdAt,
}: {
  shareId: string;
  cardKey: string;
  recipientName: string;
  /** Set once a tree has been registered for this card. */
  treeLocation?: string;
  /** When the card was made; its link expires a set time later. Defaults to now. */
  createdAt?: string | Date;
}) {
  const expires = formatUkDate(cardLinkExpiresAt(createdAt ?? new Date()));
  const base = siteUrl();
  const card = getCard(cardKey);
  const kids = parseKidsCardKey(cardKey);
  const productTitle = kids ? (kids.packageType === "bundle" ? "Complete Kids Magical Bundle" : KIDS_SCENES[kids.scene].title) : card?.title ?? "card";
  const cardUrl = `${base}/c/${shareId}`;
  const image = `${base}${card?.poster ?? "/og-image.jpg"}`;
  const name = escapeHtml(recipientName || "your recipient");
  const christmas = card?.category === "Christmas";

  const who = recipientName || "your recipient";
  const subject = kids
    ? `Your CardRoots Kids creation for ${who} is ready ✨`
    : christmas
    ? `Your Christmas card for ${who} is ready 🎄`
    : card?.category === "Halloween"
      ? `Your Halloween card for ${who} is ready 🎃`
      : `Your card for ${who} is ready 🌱`;

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
            <img src="${image}" width="240" alt="${escapeHtml(productTitle)}" style="display:block;margin:0 auto;width:240px;max-width:100%;border-radius:12px;border:1px solid #2a3a52;">
          </a>
        </td></tr>
        <tr><td style="padding:28px 32px 8px;font-family:Arial,Helvetica,sans-serif;color:#1f2937;font-size:16px;line-height:1.6;">
          <p style="margin:0 0 16px;">Thank you for your order. Your ${escapeHtml(productTitle)} for <strong>${name}</strong> is ready to send.</p>
          ${kids?.packageType === "bundle" ? '<p style="margin:0 0 16px;">Your bundle includes the Santa Scroll and Nice List Certificate, the 24-chapter Advent Village story and a Tooth Fairy Receipt. Open the link to explore them together.</p>' : ""}
          ${kids?.scene === "party" ? '<p style="margin:0 0 16px;">Guests can reply on the invite. We’ll email you each reply (their first name and whether they can come).</p>' : ""}
          ${treeLocation ? `<p style="margin:0 0 16px;background:#f1f7ee;border-radius:10px;padding:12px 14px;"><strong>🌳 Your tree is registered</strong> in ${escapeHtml(treeLocation)}. Its verified planting certificate, with photos and location, appears on the card page.</p>` : ""}
          <p style="margin:0 0 8px;"><strong>How to send it:</strong> share the link below with ${name} by text, WhatsApp or email, or simply forward them this email.</p>
        </td></tr>
        <tr><td style="padding:16px 32px;text-align:center;">
          <a href="${cardUrl}" style="display:inline-block;background:#b3263a;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:999px;font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:bold;">Open the card</a>
        </td></tr>
        <tr><td style="padding:8px 32px 28px;font-family:Arial,Helvetica,sans-serif;text-align:center;">
          <p style="margin:0 0 6px;font-size:13px;color:#6b7280;">Card link</p>
          <p style="margin:0;font-size:14px;color:#0f1d2e;word-break:break-all;"><a href="${cardUrl}" style="color:#0f1d2e;">${cardUrl}</a></p>
        </td></tr>
        <tr><td style="padding:4px 32px 20px;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.55;color:#4b5563;">
          <p style="margin:0 0 8px;">This private link works until <strong>${escapeHtml(expires)}</strong>. After that, the name and message are deleted.</p>
          <p style="margin:0;">${escapeHtml(IMMEDIATE_SUPPLY_CONFIRMATION)}</p>
        </td></tr>
        <tr><td style="padding:20px 32px 28px;border-top:1px solid #eee4d3;background:#faf6ee;font-family:Arial,Helvetica,sans-serif;text-align:center;">
          <p style="margin:0;font-size:13px;line-height:1.5;color:#4b5563;">🌳 Your card helps plant a real tree.<br>Questions? Reply to this email or write to info@cardroots.com.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const partyLine = kids?.scene === "party"
    ? `Guests can reply on the invite. We’ll email you each reply (their first name and whether they can come).

`
    : "";
  const treeLine = treeLocation
    ? `Your tree is registered in ${treeLocation}. Its verified planting certificate appears on the card page.

`
    : "";
  const text = `Your card for ${recipientName || "your recipient"} is ready.

Open it here: ${cardUrl}

Share this link with them, or forward this email.

${partyLine}${treeLine}This private link works until ${expires}. After that, the name and message are deleted.

${IMMEDIATE_SUPPLY_CONFIRMATION}

Questions? info@cardroots.com`;

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
  treeLocation,
  createdAt,
}: {
  to: string;
  shareId: string;
  cardKey: string;
  recipientName: string;
  treeLocation?: string;
  createdAt?: string | Date;
}) {
  const email = buildCardEmail({ shareId, cardKey, recipientName, treeLocation, createdAt });

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
