import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendCardEmail({
  to,
  shareId,
  recipientName,
}: {
  to: string;
  shareId: string;
  recipientName?: string;
}) {
  const cardUrl = `${process.env.SITE_URL}/c/${shareId}`;

  await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to,
    subject: "Your Cardroots card 🌱",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 520px; margin: auto;">
        <h2>Your card is ready 🌱</h2>
        <p>Hi ${recipientName || "there"},</p>

        <p>Your Cardroots card has been created successfully.</p>

        <p style="margin: 24px 0;">
          <a href="${cardUrl}" 
             style="background:#0f172a;color:#fff;padding:12px 18px;
                    text-decoration:none;border-radius:8px;display:inline-block;">
            View your card
          </a>
        </p>

        <p>You can also share this link with anyone:</p>
        <p>${cardUrl}</p>

        <p style="margin-top:32px;font-size:12px;color:#555;">
          🌳 A tree has been planted as part of this card.
        </p>
      </div>
    `,
  });
}

