import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";

export const runtime = "nodejs";

const Enquiry = z.object({
  name: z.string().trim().min(2, "Please add your name").max(80),
  email: z.string().trim().email("Please add a valid email address").max(120),
  company: z.string().trim().max(120).optional().default(""),
  quantity: z.enum(["10-49", "50-99", "100-249", "250+", "Not sure yet"], { message: "Please choose how many cards" }),
  occasion: z.string().trim().max(60).optional().default(""),
  deadline: z.string().trim().max(40).optional().default(""),
  sending: z.enum(["We'll send the links ourselves", "Please send them for us", "Not decided yet"], {
    message: "Please choose who will send the cards",
  }),
  notes: z.string().trim().max(1000).optional().default(""),
  // Honeypot: real visitors never fill this in (checked before validation).
  website: z.string().optional().default(""),
});

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  // Bots get the same "ok" as a real submission, so they learn nothing.
  if (body && typeof body === "object" && typeof body.website === "string" && body.website.length > 0) {
    return NextResponse.json({ ok: true });
  }
  const parsed = Enquiry.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Please check the form" }, { status: 400 });
  }
  const d = parsed.data;

  const to = process.env.ENQUIRY_EMAIL_TO || "info@cardroots.com";
  const from = process.env.EMAIL_FROM || "info@cardroots.com";
  const rows: [string, string][] = [
    ["Name", d.name],
    ["Email", d.email],
    ["Company", d.company || "-"],
    ["Quantity", d.quantity],
    ["Occasion", d.occasion || "-"],
    ["Needed by", d.deadline || "-"],
    ["Who sends the cards", d.sending],
    ["Notes", d.notes || "-"],
  ];

  if (process.env.EMAIL_DRY_RUN === "1") {
    console.log("[ENQUIRY] Dry run:", rows.map(([k, v]) => `${k}: ${v}`).join(" | "));
    return NextResponse.json({ ok: true });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "We couldn't send your enquiry. Please email info@cardroots.com." }, { status: 500 });

  const resend = new Resend(apiKey);
  try {
    const { error } = await resend.emails.send({
      from: from.includes("<") ? from : `CardRoots <${from}>`,
      to,
      replyTo: d.email,
      subject: `Business enquiry: ${d.company || d.name} (${d.quantity} cards)`,
      html: `<table style="font-family:Arial,sans-serif;font-size:14px;border-collapse:collapse">${rows
        .map(([k, v]) => `<tr><td style="padding:6px 12px 6px 0;color:#555;vertical-align:top">${k}</td><td style="padding:6px 0;white-space:pre-wrap">${esc(v)}</td></tr>`)
        .join("")}</table>`,
      text: rows.map(([k, v]) => `${k}: ${v}`).join("\n"),
    });
    if (error) throw new Error(error.message);

    // Confirmation to the enquirer, so they know it arrived.
    await resend.emails.send({
      from: from.includes("<") ? from : `CardRoots <${from}>`,
      to: d.email,
      replyTo: "info@cardroots.com",
      subject: "We've received your CardRoots enquiry",
      html: `<p style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6">Hi ${esc(d.name)},</p><p style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6">Thanks for getting in touch about ${esc(d.quantity)} cards. We'll reply within one working day with a quote and next steps.</p><p style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6">CardRoots</p>`,
      text: `Hi ${d.name},\n\nThanks for getting in touch about ${d.quantity} cards. We'll reply within one working day with a quote and next steps.\n\nCardRoots`,
    }).catch((e) => console.error("[ENQUIRY] Confirmation email failed:", e));

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[ENQUIRY] Send failed:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "We couldn't send your enquiry. Please email info@cardroots.com." }, { status: 500 });
  }
}
