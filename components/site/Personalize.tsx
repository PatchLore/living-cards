"use client";

import { useEffect, useId, useRef, useState } from "react";
import { track } from "@vercel/analytics";
import { type CatalogCard, LIMITS, PRICE_LABEL } from "../../lib/catalog";
import CardArt from "./CardArt";

const SUGGESTIONS: Record<string, string[]> = {
  Christmas: [
    "Merry Christmas! Wishing you a cosy, joyful season and a wonderful year ahead.",
    "Thinking of you this Christmas. Can't wait to see you soon. Lots of love.",
    "Happy holidays! Thank you for everything this year. Here's to the next one.",
  ],
  Halloween: [
    "Happy Halloween! Hope your night is full of treats, not tricks.",
    "Boo! Just a little ghost saying I'm thinking of you.",
    "Have a frightfully fun Halloween!",
  ],
  Birthday: [
    "Happy birthday! Wishing you a year full of good things.",
    "Have the best birthday. You deserve every bit of it!",
  ],
  "Thank You": ["Thank you so much. It really meant a lot.", "A little thank you for being wonderful."],
  default: ["Thinking of you, with love.", "Sending you the warmest wishes."],
};

type Props = {
  card: CatalogCard;
  /** Pre-fill, e.g. from the hero's "try a name" field. */
  initialRecipient?: string;
  /** Inline on a card page, or inside the dialog. */
  layout?: "dialog" | "inline";
};

export function PersonalizePanel({ card, initialRecipient = "", layout = "inline" }: Props) {
  const [recipient, setRecipient] = useState(initialRecipient);
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [playKey, setPlayKey] = useState(0);
  const ids = { to: useId(), msg: useId() };
  const suggestions = SUGGESTIONS[card.category] ?? SUGGESTIONS.default;

  // A browser "back" from Stripe can restore this page with busy=true.
  useEffect(() => {
    const reset = () => setBusy(false);
    window.addEventListener("pageshow", reset);
    return () => window.removeEventListener("pageshow", reset);
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = recipient.trim();
    const m = message.trim();
    if (!r) return setError("Add who the card is for.");
    if (!m) return setError("Write a short message for the card.");
    setError(null);
    setBusy(true);
    try {
      track("checkout_start", { cardKey: card.key });
    } catch {}
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardKey: card.key, recipient: r, message: m }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.url) throw new Error(data.error || "We couldn't start checkout. Please try again.");
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setBusy(false);
    }
  };

  const dialog = layout === "dialog";

  return (
    <div className={`grid gap-6 ${dialog ? "md:grid-cols-[minmax(0,320px)_1fr]" : "lg:grid-cols-[minmax(0,420px)_1fr] lg:gap-12"}`}>
      <div className={dialog ? "mx-auto w-full max-w-[220px] md:max-w-none" : "mx-auto w-full max-w-[420px]"}>
        <CardArt card={card} recipient={recipient.trim()} message={message.trim()} playKey={playKey} className="shadow-2xl" />
        <button
          type="button"
          onClick={() => setPlayKey((k) => k + 1)}
          className="mt-3 w-full text-center text-sm text-ink/60 underline-offset-4 hover:text-ink hover:underline"
        >
          ↻ Replay animation
        </button>
      </div>

      <form onSubmit={submit} noValidate className="flex flex-col">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-berry">{card.category}</p>
        <h2 className="mt-1 font-display text-3xl text-ink">{card.title}</h2>
        <p className="mt-2 text-ink/70">{card.description}</p>

        <label htmlFor={ids.to} className="mt-6 text-sm font-semibold text-ink">
          Who is it for?
        </label>
        <input
          id={ids.to}
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          maxLength={LIMITS.recipient}
          placeholder="e.g. Grandma, Sam, The Patels"
          autoComplete="off"
          className="mt-2 rounded-xl border border-ink/15 bg-white px-4 py-3 text-ink placeholder:text-ink/35 focus:border-berry focus:outline-none focus:ring-2 focus:ring-berry/20"
        />

        <div className="mt-5 flex items-baseline justify-between">
          <label htmlFor={ids.msg} className="text-sm font-semibold text-ink">
            Your message
          </label>
          <span className="text-xs text-ink/50">
            {message.length}/{LIMITS.message}
          </span>
        </div>
        <textarea
          id={ids.msg}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={LIMITS.message}
          rows={4}
          placeholder="Write your message and sign it with your name"
          className="mt-2 resize-none rounded-xl border border-ink/15 bg-white px-4 py-3 text-ink placeholder:text-ink/35 focus:border-berry focus:outline-none focus:ring-2 focus:ring-berry/20"
        />
        <div className="mt-2 flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setMessage(s)}
              className="rounded-full border border-ink/10 bg-white px-3 py-1 text-left text-xs text-ink/70 transition hover:border-berry/40 hover:text-ink"
            >
              {s.length > 42 ? `${s.slice(0, 40)}…` : s}
            </button>
          ))}
        </div>

        {error && (
          <p role="alert" className="mt-4 rounded-lg bg-berry/10 px-3 py-2 text-sm text-berry-deep">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-berry px-6 py-3.5 text-base font-semibold text-white shadow-md transition hover:bg-berry-deep disabled:cursor-wait disabled:opacity-70"
        >
          {busy ? "Opening secure checkout…" : `Continue to payment · ${PRICE_LABEL}`}
        </button>
        <ul className="mt-4 space-y-1.5 text-sm text-ink/65">
          <li>✉️ We email you the card link straight after payment</li>
          <li>📲 Share it by text, WhatsApp or email, or forward our email</li>
          <li>🌳 Every card helps plant a real tree</li>
        </ul>
      </form>
    </div>
  );
}

export function PersonalizeDialog({
  card,
  initialRecipient,
  onClose,
}: {
  card: CatalogCard;
  initialRecipient?: string;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    ref.current?.querySelector<HTMLInputElement>("input")?.focus({ preventScroll: true });
    try {
      track("personalize_start", { cardKey: card.key });
    } catch {}
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [card.key, onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-night/70 backdrop-blur-sm sm:items-center sm:p-6" onClick={onClose}>
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={`Personalise ${card.title}`}
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[94dvh] w-full max-w-4xl overflow-y-auto rounded-t-3xl bg-cream p-5 shadow-2xl sm:rounded-3xl sm:p-8"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-ink/5 text-xl text-ink/70 transition hover:bg-ink/10"
        >
          ×
        </button>
        <PersonalizePanel card={card} initialRecipient={initialRecipient} layout="dialog" />
      </div>
    </div>
  );
}
