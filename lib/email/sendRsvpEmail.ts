import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { Resend } from "resend";

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** Tells the buyer that a guest replied to their child's party invite. Names are always plain text. */
export function buildRsvpEmail({ childName, guestName, attending, totals }: {
  childName: string;
  guestName: string;
  attending: boolean;
  totals: { yes: number; no: number };
}) {
  const reply = attending ? "can come" : "can’t make it";
  const subject = `${guestName} ${reply} to ${childName}’s party`;
  const tally = `So far: ${totals.yes} coming, ${totals.no} can’t make it.`;
  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${escapeHtml(subject)}</title></head>
<body style="margin:0;padding:0;background:#f4efe6;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" style="border-collapse:collapse;background:#f4efe6;">
    <tr><td style="padding:32px 16px;">
      <table role="presentation" width="100%" style="max-width:480px;margin:0 auto;border-collapse:collapse;background:#ffffff;border-radius:16px;overflow:hidden;">
        <tr><td style="background:#0f291e;padding:24px 28px;text-align:center;">
          <p style="margin:0;font-size:12px;letter-spacing:3px;text-transform:uppercase;color:#e9c97a;">CardRoots · Party RSVP</p>
          <h1 style="margin:10px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:24px;font-weight:normal;color:#fbf6ec;">${escapeHtml(guestName)} ${attending ? "can come! 🎉" : "can’t make it"}</h1>
        </td></tr>
        <tr><td style="padding:24px 28px;color:#1f2937;font-size:16px;line-height:1.6;">
          <p style="margin:0 0 12px;"><strong>${escapeHtml(guestName)}</strong> replied <strong>${attending ? "yes" : "no"}</strong> to ${escapeHtml(childName)}’s party invite.</p>
          <p style="margin:0 0 12px;">${escapeHtml(tally)}</p>
          <p style="margin:0;font-size:13px;color:#6b7280;">Guests only share a first name and their reply. Replies are deleted automatically after 90 days.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
  const text = `${guestName} replied ${attending ? "yes" : "no"} to ${childName}'s party invite.\n\n${tally}\n\nGuests only share a first name and their reply. Replies are deleted automatically after 90 days.`;
  return { subject, html, text };
}

/** Set EMAIL_DRY_RUN=1 to write the email to .email-previews/ instead of sending. */
export async function sendRsvpEmail(input: { to: string; childName: string; guestName: string; attending: boolean; totals: { yes: number; no: number } }) {
  const email = buildRsvpEmail(input);
  if (process.env.EMAIL_DRY_RUN === "1") {
    const dir = path.join(process.cwd(), ".email-previews");
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, `${Date.now()}-rsvp.html`), `<!-- to: ${input.to} | subject: ${email.subject} -->\n${email.html}`);
    return;
  }
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from) throw new Error("RESEND_API_KEY or EMAIL_FROM is not set");
  const { error } = await new Resend(apiKey).emails.send({
    from: from.includes("<") ? from : `CardRoots <${from}>`,
    to: input.to,
    replyTo: "info@cardroots.com",
    subject: email.subject,
    html: email.html,
    text: email.text,
  });
  if (error) throw new Error(`Resend rejected the email: ${error.name}: ${error.message}`);
}
