import { notFound } from "next/navigation";
import { getCardByShareId } from "../../../lib/db/cards";
import CopyButton from "./CopyButton";

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

export default async function PrettySharePage(props: any) {
  const { shareId } = await props.params;
  
  // 1. Fetch card from database
  const card = await getCardByShareId(shareId);

  if (!card) {
    console.error(`[CARD-VIEWER] Card not found for share_id: ${shareId}`);
    notFound();
  }

  // 2. Get video file from mapping
  const videoFile = CARD_VIDEO_MAP[card.card_key];

  if (!videoFile) {
    console.error(
      `[CARD-VIEWER] No video mapping found for card_key: ${card.card_key}`
    );
    notFound();
  }

  const videoSrc = `/cards/${videoFile}`;

  // Determine card type and subheading based on cardKey
  const getCardSubheading = (cardKey: string): string => {
    const key = cardKey.toLowerCase();
    if (
      key.includes("christmas") ||
      key.includes("winter") ||
      key.includes("snowy") ||
      key.includes("santa") ||
      key.includes("moonlight") ||
      key.includes("tree") ||
      key.includes("forest") ||
      key.includes("warm-wishes")
    ) {
      return "Sent with warm Christmas wishes 🎄";
    }
    if (key.includes("birthday") || key.includes("rose") || key.includes("floral")) {
      return "A birthday message just for you 🎂";
    }
    if (key.includes("thank-you") || key.includes("gratitude") || key.includes("florals")) {
      return "A heartfelt thank you 🌸";
    }
    if (key.includes("heart") || key.includes("love") || key.includes("valentines")) {
      return "Sent with love ❤️";
    }
    return "A message sent with care ✨";
  };

  const cardSubheading = getCardSubheading(card.card_key);
  const displayMessage = card.message?.trim() || "Thinking of you and sending something meaningful 🌱";

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-100 to-slate-200 py-14 px-6">
      <section className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 space-y-2">
          <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight">
            Your Living Card 💌
          </h1>
          <p className="text-slate-600">
            A premium digital greeting, paired with a real tree planted in your
            name. 🌱
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
                To:{" "}
                <span className="font-semibold text-slate-900">
                  {card.recipient_name}
                </span>
              </p>
              <p className="mt-2 text-xs text-slate-500">
                Animated front cover · This is the looping Living Card animation
                your recipient will see first.
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
                <p className="text-sm uppercase tracking-[0.2em] text-amber-600 mb-2">
                  A Personal Note
                </p>
                <p className="text-sm text-amber-700/80 mb-4 italic">
                  {cardSubheading}
                </p>
                <p className="whitespace-pre-wrap text-slate-800 leading-relaxed text-base">
                  {displayMessage}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 text-xs text-slate-500">
                <span className="whitespace-nowrap">
                  🌱 One real tree planted with this card
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tree Certificate Section */}
        <div className="mt-8 text-center">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Tree Certificate
          </h3>

          {/* Tree Metadata */}
          {(card.tree_species || card.tree_location || card.tree_date_planted) && (
            <div className="mb-4 text-center text-sm text-slate-600 space-y-1">
              {card.tree_species && (
                <p>
                  🌱 <span className="font-semibold">Species:</span>{" "}
                  {card.tree_species}
                </p>
              )}
              {card.tree_location && (
                <p>
                  📍 <span className="font-semibold">Location:</span>{" "}
                  {card.tree_location}
                </p>
              )}
              {card.tree_date_planted && (
                <p>
                  📅 <span className="font-semibold">Planted:</span>{" "}
                  {(() => {
                    try {
                      const date = new Date(card.tree_date_planted);
                      if (isNaN(date.getTime())) return "Invalid date";
                      return date.toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      });
                    } catch {
                      return "Invalid date";
                    }
                  })()}
                </p>
              )}
            </div>
          )}

          {card.tree_certificate_url ? (
            <a
              href={card.tree_certificate_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 text-white font-semibold px-4 py-2 shadow hover:bg-emerald-700 transition"
            >
              🌱 View Tree Certificate
            </a>
          ) : (
            <p className="text-center text-sm text-slate-400 mt-4">
              🌱 Tree certificate will appear here once planting is confirmed.
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={videoSrc}
            download={`${card.card_key}.mp4`}
            className="px-6 py-3 rounded-2xl bg-amber-500 text-white font-medium shadow-md hover:bg-amber-600 transition text-center"
          >
            Download Animated Front (MP4)
          </a>

          <CopyButton />
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
