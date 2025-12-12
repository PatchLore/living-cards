"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useRef, Suspense } from "react";

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

function SuccessClientContent() {
  const params = useSearchParams();
  const sessionId = params.get("session_id");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState<SessionData | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [shareId, setShareId] = useState<string | null>(null);
  const [cardCreateError, setCardCreateError] = useState<string | null>(null);
  const [creatingCard, setCreatingCard] = useState(false);
  const [creatingCertificate, setCreatingCertificate] = useState(false);
  const [certificateError, setCertificateError] = useState<string | null>(null);

  // Memoization: prevent duplicate card creation calls
  const cardCreatedRef = useRef(false);
  // Memoization: prevent duplicate certificate creation calls
  const certRequestedRef = useRef(false);

  useEffect(() => {
    if (!sessionId) {
      setError("No session ID provided");
      setLoading(false);
      return;
    }

    async function loadSession() {
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

        // Create card in database (idempotent)
        if (!cardCreatedRef.current) {
          cardCreatedRef.current = true;
          setCreatingCard(true);
          setCardCreateError(null);

          try {
            const cardRes = await fetch("/api/cards/create", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ sessionId }),
            });

            const cardJson = await cardRes.json();
            if (cardJson.ok && cardJson.shareUrl) {
              setShareUrl(cardJson.shareUrl);
              setShareId(cardJson.shareId);

              // Trigger certificate generation (idempotent)
              if (!certRequestedRef.current && cardJson.shareId) {
                certRequestedRef.current = true;
                setCreatingCertificate(true);
                setCertificateError(null);

                try {
                  const certRes = await fetch("/api/certificates/create", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ shareId: cardJson.shareId }),
                  });

                  const certJson = await certRes.json();
                  if (!certJson.ok) {
                    setCertificateError(certJson.error || "Failed to create certificate");
                  }
                } catch (certErr) {
                  console.error("[SUCCESS] Certificate creation error:", certErr);
                  setCertificateError("Failed to create certificate");
                } finally {
                  setCreatingCertificate(false);
                }
              }
            } else {
              setCardCreateError(cardJson.error || "Failed to create card");
            }
          } catch (cardErr) {
            console.error("[SUCCESS] Card creation error:", cardErr);
            setCardCreateError("Failed to create card");
          } finally {
            setCreatingCard(false);
          }
        }

        setLoading(false);
      } catch (err) {
        console.error("[SUCCESS] Error loading session:", err);
        setError("Failed to load session");
        setLoading(false);
      }
    }

    loadSession();
  }, [sessionId]);

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

  if (loading) {
    return (
      <div className="p-10 text-center">
        <p className="text-slate-600">Loading your purchase details...</p>
      </div>
    );
  }

  if (error) {
    return <div className="p-10 text-center text-red-600">{error}</div>;
  }

  if (!data) {
    return <div className="p-10 text-center">No data found.</div>;
  }

  const videoSrc = `/cards/${CARD_VIDEO_MAP[data.cardKey] || data.cardKey}.mp4`;

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-100 to-slate-200 py-14 px-6">
      <section className="max-w-3xl mx-auto text-center space-y-4">
        <h1 className="text-4xl font-semibold text-slate-800">Purchase Complete! 🎉</h1>
        <p className="text-lg text-slate-600">
          Your digital card is ready to view and share.
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

        <div className="text-center space-y-2 mb-8">
          <p className="text-xl font-semibold text-slate-800">To: {data.recipient}</p>
          <p className="text-slate-700 whitespace-pre-wrap">{data.message}</p>
        </div>

        {/* Card creation status */}
        {creatingCard && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
            Creating your card...
          </div>
        )}

        {cardCreateError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            Error creating card: {cardCreateError}
          </div>
        )}

        {/* Certificate creation status */}
        {creatingCertificate && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
            Generating tree certificate...
          </div>
        )}

        {certificateError && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-700">
            Certificate generation warning: {certificateError}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={videoSrc}
            download={`${data.cardKey}.mp4`}
            className="px-6 py-3 rounded-xl bg-amber-500 text-white font-medium shadow-md hover:bg-amber-600 transition text-center"
          >
            Download Video
          </a>

          <button
            onClick={copyShareLink}
            disabled={!shareUrl || creatingCard}
            className={`px-6 py-3 rounded-xl font-medium shadow-md transition text-center ${
              shareUrl && !creatingCard
                ? "bg-slate-800 text-white hover:bg-slate-900"
                : "bg-slate-400 text-white cursor-not-allowed"
            }`}
          >
            {creatingCard
              ? "Creating Card..."
              : shareUrl
              ? "Copy Share Link"
              : "Share Link Loading..."}
          </button>

          {shareUrl && (
            <a
              href={shareUrl}
              className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-medium shadow-md hover:bg-emerald-700 transition text-center"
            >
              View Your Card
            </a>
          )}
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

export default function SuccessClient() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <SuccessClientContent />
    </Suspense>
  );
}

