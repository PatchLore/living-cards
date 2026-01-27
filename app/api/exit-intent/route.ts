import { NextResponse } from "next/server";
import { Resend } from "resend";

const EMAIL_TO = process.env.EXIT_INTENT_EMAIL_TO || "info@cardroots.com";

export async function POST(req: Request) {
  const resendKey = process.env.RESEND_API_KEY;
  const emailFrom = process.env.EMAIL_FROM;

  if (!resendKey || !emailFrom) {
    console.warn("Exit intent email config missing.");
    return NextResponse.json(
      { error: "Email service is not configured." },
      { status: 500 }
    );
  }

  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValidEmail) {
      return NextResponse.json({ error: "Invalid email." }, { status: 400 });
    }

    const resend = new Resend(resendKey);

    await resend.emails.send({
      from: emailFrom,
      to: EMAIL_TO,
      subject: "CardRoots exit-intent signup",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5;">
          <p>New exit-intent signup:</p>
          <p><strong>Email:</strong> ${email}</p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Exit intent email error:", error);
    return NextResponse.json({ error: "Unable to process request." }, { status: 500 });
  }
}
