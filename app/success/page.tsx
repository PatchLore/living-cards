"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type SessionData = {
  cardKey: string;
  recipient: string;
  message: string;
  shareUrl?: string;
};

// Map cardKey to actual video filename
const CARD_VIDEO_MAP: Record<string, string> = {
  "starlit-christmas-tree": "christmas_tree",
  "christmas-night-moonlight": "moonlight",
  "snowy-cottage-evening": "Christmas2",
  "winter-forest-tree": "XmasTree",
  "golden-christmas-tree-rise": "Christmas1",
  "santas-moonlit-ride": "Santa",
  "birthday-rose-bloom": "rose",
  "elegant-floral-birthday": "Birthday2",
  "thank-you-florals": "Thankyou2",
  "heart-of-light": "heart1",
  "golden-heart-glow": "heart2",
  "warm-wishes": "warm_wishes",
};

export default function SuccessPage() {
  const params = useSearchParams();
  const sessionId = params.get("session_id");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState<SessionData | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError("Missing session ID.");
      setLoading(false);
      return;
    }

    const fetchSession = async () => {
      try {
        const res = await fetch("/api/get-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });

        const json = await res.json();
        if (!json.ok) {
          setError("Unable to load purchase details.");
          setLoading(false);
          return;
        }

        const md = json.session.metadata;

        const baseData: SessionData = {
          cardKey: md.cardKey,
          recipient: md.recipient,
          message: md.message,
        };

        setData(baseData);

        // Create pretty share link
        try {
          const shareRes = await fetch("/api/create-share-link", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              cardKey: baseData.cardKey,
              recipient: baseData.recipient,
              message: baseData.message,
            }),
          });

          const shareJson = await shareRes.json();
          if (shareJson.ok && shareJson.url) {
            setShareUrl(shareJson.url);
          }
        } catch (e) {
          console.warn("Failed to create share link", e);
        }

        setLoading(false);
      } catch (e) {
        console.error("Error:", e);
        setError("Something went wrong.");
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId]);

  if (loading) return <div className="p-10 text-center">Loading your card…</div>;
  if (error) return <div className="p-10 text-center text-red-600">{error}</div>;
  if (!data) return <div className="p-10 text-center">No data found.</div>;

  // Map cardKey to actual video filename
  const videoFileName = CARD_VIDEO_MAP[data.cardKey] || data.cardKey;
  const videoSrc = `/cards/${videoFileName}.mp4`;

  const copyShareLink = async () => {
    if (!shareUrl) {
      alert("Share link not ready yet. Please try again in a moment.");
      return;
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert("Share link copied!");
    } catch {
      alert("Failed to copy link.");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 py-16 px-6">
      <section className="max-w-3xl mx-auto text-center space-y-4">
        <h1 className="text-4xl font-semibold text-slate-800">
          Your Card Is Ready 🎉
        </h1>
        <p className="text-lg text-slate-600">
          Every card plants a real tree — thank you for making a positive
          impact. 🌱
        </p>
      </section>

      <section className="max-w-3xl mx-auto mt-10 bg-white rounded-3xl shadow-xl p-6 border border-slate-200">
        <video
          src={videoSrc}
          autoPlay
          loop
          muted
          playsInline
          className="w-full rounded-2xl shadow-lg mb-6"
        />

        <div className="text-center space-y-2">
          <p className="text-xl font-semibold text-slate-800">
            To: {data.recipient}
          </p>
          <p className="text-slate-700 whitespace-pre-wrap">{data.message}</p>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={videoSrc}
            download={`${data.cardKey}.mp4`}
            className="px-6 py-3 rounded-xl bg-amber-500 text-white font-medium shadow-md hover:bg-amber-600 transition"
          >
            Download Video
          </a>

          <button
            onClick={copyShareLink}
            className="px-6 py-3 rounded-xl bg-slate-800 text-white font-medium shadow-md hover:bg-slate-900 transition"
          >
            Copy Share Link
          </button>
        </div>

        <div className="mt-10 text-center">
          <a
            href="/"
            className="text-slate-600 hover:text-slate-800 font-medium transition"
          >
            Send another card →
          </a>
        </div>
      </section>
    </main>
  );
}
