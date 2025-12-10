import crypto from "crypto";
import { notFound } from "next/navigation";

export const runtime = "nodejs";

// Same mapping as /card/[cardKey]/page.tsx
const CARD_VIDEO_MAP: Record<string, string> = {
  "starlit-christmas-tree": "christmas_tree.mp4",
  "christmas-night-moonlight": "moonlight.mp4",
  "snowy-cottage-evening": "Christmas2.mp4",
  "winter-forest-tree": "XmasTree.mp4",
  "golden-christmas-tree-rise": "Christmas1.mp4",
  "santas-moonlit-ride": "Santa.mp4",
  "elegant-floral-birthday": "Birthday2.mp4",
  "birthday-rose-bloom": "rose.mp4",
  "thank-you-florals": "Thankyou2.mp4",
  "golden-heart-glow": "heart2.mp4",
  "heart-of-light": "heart1.mp4",
  "warm-wishes": "warm_wishes.mp4",
};

function getShareSecret() {
  const secret = process.env.CARDROOTS_SHARE_SECRET;
  if (!secret) {
    throw new Error("CARDROOTS_SHARE_SECRET is not set");
  }
  return secret;
}

function verifyShareToken(token: string): {
  cardKey: string;
  recipient: string;
  message: string;
} {
  const secret = getShareSecret();
  const parts = token.split(".");

  if (parts.length !== 2) {
    throw new Error("Invalid token format");
  }

  const [payloadB64, sig] = parts;

  const expectedSig = crypto
    .createHmac("sha256", secret)
    .update(payloadB64)
    .digest("base64url");

  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))) {
    throw new Error("Invalid token signature");
  }

  const json = Buffer.from(payloadB64, "base64url").toString("utf8");
  const data = JSON.parse(json);

  if (!data.cardKey || !data.recipient || !data.message) {
    throw new Error("Invalid token payload");
  }

  return data;
}

export default function PrettySharePage({ params }: { params: { shareId: string } }) {
  let cardKey: string;
  let recipient: string;
  let message: string;

  try {
    const decoded = verifyShareToken(params.shareId);
    cardKey = decoded.cardKey;
    recipient = decoded.recipient;
    message = decoded.message;
  } catch (e) {
    console.error("❌ Invalid share token:", e);
    notFound();
  }

  const videoFile = CARD_VIDEO_MAP[cardKey];

  if (!videoFile) {
    notFound();
  }

  const videoSrc = `/cards/${videoFile}`;

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-100 to-slate-200 py-14 px-6">
      <section className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 space-y-2">
          <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight">
            Your Living Card 💌
          </h1>
          <p className="text-slate-600">
            A premium digital greeting, paired with a real tree planted in your name. 🌱
          </p>
        </div>

        {/* Card Layout */}
        <div className="flex flex-col lg:flex-row gap-8 items-stretch justify-center">
          {/* Front of Card (Video) */}
          <div className="flex-1">
            <div className="text-sm font-medium text-slate-500 mb-3 uppercase tracking-wide">
              Front of Card
            </div>
            <div className="relative bg-gradient-to-b from-white to-slate-50 rounded-3xl shadow-xl border border-slate-200 p-4 sm:p-5">
              <div className="absolute inset-0 rounded-3xl pointer-events-none border border-white/60 shadow-inner" />

              <div className="rounded-2xl overflow-hidden shadow-md mb-4">
                <video
                  src={videoSrc}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>

              <p className="text-base text-slate-700 font-medium">
                To: <span className="font-semibold text-slate-900">{recipient}</span>
              </p>
              <p className="mt-2 text-xs text-slate-500">
                Animated front cover · This is the looping Living Card animation your
                recipient will see first.
              </p>
            </div>
          </div>

          {/* Inside Message */}
          <div className="flex-1">
            <div className="text-sm font-medium text-slate-500 mb-3 uppercase tracking-wide">
              Inside Message
            </div>
            <div className="relative bg-gradient-to-b from-white to-amber-50/60 rounded-3xl shadow-xl border border-amber-100 p-5 sm:p-6">
              <div className="absolute inset-0 rounded-3xl pointer-events-none border border-white/70 shadow-inner" />

              <div className="bg-white/80 rounded-2xl border border-amber-100/80 px-5 py-6 text-left">
                <p className="text-sm uppercase tracking-[0.2em] text-amber-600 mb-3">
                  A Personal Note
                </p>
                <p className="whitespace-pre-wrap text-slate-800 leading-relaxed text-base">
                  {message}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between gap-3 text-xs text-slate-500">
                <span>
                  ✨ This message is shown with your card when your recipient opens the
                  link.
                </span>
                <span className="whitespace-nowrap">
                  🌱 1 tree planted with this card
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={videoSrc}
            download={`${cardKey}.mp4`}
            className="px-6 py-3 rounded-2xl bg-amber-500 text-white font-medium shadow-md hover:bg-amber-600 transition text-center"
          >
            Download Animated Front (MP4)
          </a>

          <button
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(window.location.href);
                alert("Share link copied!");
              } catch {
                alert("Failed to copy link.");
              }
            }}
            className="px-6 py-3 rounded-2xl bg-slate-900 text-white font-medium shadow-md hover:bg-slate-950 transition"
          >
            Copy Card Link
          </button>
        </div>

        <div className="mt-8 text-center text-sm text-slate-600">
          <a
            href="/"
            className="font-medium text-slate-800 hover:text-slate-950 underline underline-offset-4"
          >
            Send another Living Card →
          </a>
        </div>
      </section>
    </main>
  );
}
