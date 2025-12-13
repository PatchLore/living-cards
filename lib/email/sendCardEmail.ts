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
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Cardroots card is ready</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 520px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); border-collapse: collapse;">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 32px; text-align: center; border-bottom: 1px solid #e5e5e5;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 600; color: #0f172a; line-height: 1.2;">
                Your card is ready 🌱
              </h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 32px 40px;">
              <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.6; color: #1e293b;">
                Hi ${recipientName || "there"},
              </p>
              
              <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #1e293b;">
                Your Cardroots card has been created successfully.
              </p>
              
              <!-- Primary CTA Button -->
              <table role="presentation" style="width: 100%; margin: 32px 0; border-collapse: collapse;">
                <tr>
                  <td style="text-align: center;">
                    <a href="${cardUrl}" 
                       style="display: inline-block; background-color: #0f172a; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 16px; font-weight: 500; line-height: 1.5;">
                      View your card
                    </a>
                  </td>
                </tr>
              </table>
              
              <!-- Share Link Section -->
              <p style="margin: 24px 0 8px; font-size: 14px; line-height: 1.5; color: #64748b;">
                You can also share this link with anyone:
              </p>
              <p style="margin: 0 0 32px; font-size: 14px; line-height: 1.5; color: #0f172a; word-break: break-all;">
                ${cardUrl}
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px 32px; text-align: center; border-top: 1px solid #e5e5e5; background-color: #f8f9fa;">
              <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #64748b;">
                🌳 A tree has been planted as part of this card.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  });
}

