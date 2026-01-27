 "use client";

import { useEffect, useState } from "react";
import { track } from "@vercel/analytics";

type ExitIntentModalProps = {
  headline: string;
  subheadline: string;
  offer: string;
  imageSrc?: string;
};

export default function ExitIntentModal({
  headline,
  subheadline,
  offer,
  imageSrc,
}: ExitIntentModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("exit-intent-dismissed");
      if (stored === "1") setDismissed(true);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (dismissed) return;
    const handleMouseMove = (event: MouseEvent) => {
      if (event.clientY <= 8) {
        setIsOpen(true);
        track("exit_intent_open");
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [dismissed]);

  if (dismissed || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6 py-10 bg-slate-900/70 backdrop-blur-sm">
      <div className="w-full max-w-3xl rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-8">
            <p className="text-xs uppercase tracking-wide text-amber-600 font-semibold mb-3">
              {offer}
            </p>
            <h3 className="text-2xl font-semibold text-slate-900 mb-3">{headline}</h3>
            <p className="text-sm text-slate-600 mb-5">{subheadline}</p>
            {submitted ? (
              <div className="text-sm text-emerald-700 font-medium">
                Thanks! We will send your discount shortly.
              </div>
            ) : (
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  setSubmitted(true);
                  track("exit_intent_submit");
                }}
                className="space-y-3"
              >
                <input
                  type="email"
                  required
                  placeholder="Email address"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-700"
                />
                <button
                  type="submit"
                  className="w-full bg-slate-900 text-white py-3 rounded-xl"
                >
                  Get 10% off + track your tree impact
                </button>
              </form>
            )}
            <button
              onClick={() => {
                setIsOpen(false);
                setDismissed(true);
                try {
                  localStorage.setItem("exit-intent-dismissed", "1");
                } catch {
                  // ignore
                }
                track("exit_intent_dismiss");
              }}
              className="mt-4 text-xs text-slate-500 hover:text-slate-700"
            >
              No thanks, continue browsing
            </button>
          </div>
          <div className="hidden md:block">
            {imageSrc ? (
              <img src={imageSrc} alt="Forest scene" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-emerald-200 via-amber-100 to-sky-200" />
            )}
          </div>
        </div>
        <button
          onClick={() => {
            setIsOpen(false);
            setDismissed(true);
            try {
              localStorage.setItem("exit-intent-dismissed", "1");
            } catch {
              // ignore
            }
            track("exit_intent_dismiss");
          }}
          className="absolute top-4 right-4 text-slate-500 hover:text-slate-700"
          aria-label="Dismiss exit intent"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
