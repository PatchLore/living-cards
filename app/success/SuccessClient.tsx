"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getCard } from "../../lib/catalog";
import CardArt from "../../components/site/CardArt";
import { KIDS_SCENES, type KidsPersonalisation } from "../../lib/kids";

type Order = {
  status: "ready";
  shareId: string;
  cardKey: string;
  recipient: string;
  message: string;
  emailedTo: string | null;
  kids?: KidsPersonalisation;
};

type State = { kind: "loading" } | { kind: "error"; message: string } | { kind: "ready"; order: Order };

export default function SuccessClient() {
  const sessionId = useSearchParams().get("session_id");
  const [state, setState] = useState<State>({ kind: "loading" });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!sessionId) {
      setState({ kind: "error", message: "We couldn't find your order reference." });
      return;
    }
    let cancelled = false;
    let attempt = 0;

    const load = async () => {
      attempt++;
      try {
        const res = await fetch(`/api/order?session_id=${encodeURIComponent(sessionId)}`, { cache: "no-store" });
        const data = await res.json();
        if (cancelled) return;
        if (data.status === "ready") return setState({ kind: "ready", order: data });
        if (data.status === "pending" && attempt < 15) return void setTimeout(load, 2000);
        throw new Error(data.error);
      } catch {
        if (cancelled) return;
        if (attempt < 4) return void setTimeout(load, 2000);
        setState({
          kind: "error",
          message:
            "Your payment went through, but we couldn't load your card just now. We'll email you the link shortly. If it doesn't arrive, contact info@cardroots.com.",
        });
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  if (state.kind !== "ready") {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-night px-4 text-center text-cream">
        {state.kind === "loading" ? (
          <div>
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-gold/30 border-t-gold" />
            <p className="mt-5 font-display text-2xl">Wrapping up your card…</p>
          </div>
        ) : (
          <div className="max-w-md">
            <p className="font-display text-2xl">Thank you for your order</p>
            <p className="mt-3 text-cream/70">{state.message}</p>
          </div>
        )}
      </main>
    );
  }

  const { order } = state;
  const card = getCard(order.cardKey);
  const kids = order.kids;
  const shareUrl = `${window.location.origin}/c/${order.shareId}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const share = async () => {
    try {
      await navigator.share({ title: `A card for ${order.recipient}`, url: shareUrl });
    } catch {}
  };

  return (
    <main className="relative overflow-hidden bg-night px-4 py-12 text-cream sm:py-16">
      <div className="starfield absolute inset-0 opacity-50" aria-hidden />
      <div className="relative mx-auto grid max-w-5xl items-center gap-12 md:grid-cols-[minmax(0,360px)_1fr]">
        <div className="mx-auto w-full max-w-[360px]">
          {card && <CardArt card={card} recipient={order.recipient} message={order.message} className="shadow-2xl ring-1 ring-white/10" />}
          {kids && (
            <div className="rounded-[2rem] border border-gold/30 bg-cream p-8 text-center text-night shadow-2xl">
              <span className="text-7xl" aria-hidden>{KIDS_SCENES[kids.scene].icon}</span>
              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em]">CardRoots For Kids</p>
              <h2 className="mt-3 font-display text-3xl">{kids.packageType === "bundle" ? "Complete Kids Magical Bundle" : KIDS_SCENES[kids.scene].title}</h2>
              <p className="mt-4 text-sm text-night/70">Personalised for {order.recipient}, ready to open and share.</p>
              {kids.packageType === "bundle" && <p className="mt-4 text-sm text-night/70">Santa Scroll, Advent Village and Paper Squishy Kit included.</p>}
            </div>
          )}
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-gold">Payment complete</p>
          <h1 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">Your card for {order.recipient} is ready</h1>
          <p className="mt-4 text-lg text-cream/70">
            Send them this link however you like: text, WhatsApp, email or social.
          </p>

          <div className="mt-6 flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 p-2 pl-4">
            <span className="min-w-0 flex-1 truncate text-sm text-cream/80">{shareUrl}</span>
            <button
              type="button"
              onClick={copy}
              className="shrink-0 rounded-xl bg-berry px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-berry-deep"
            >
              {copied ? "Copied ✓" : "Copy link"}
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            {typeof navigator !== "undefined" && "share" in navigator && (
              <button
                type="button"
                onClick={share}
                className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold transition hover:bg-white/10"
              >
                Share…
              </button>
            )}
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`I've sent you ${kids ? "some CardRoots Kids magic ✨" : "a card 🎄"} ${shareUrl}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold transition hover:bg-white/10"
            >
              WhatsApp
            </a>
            <Link
              href={`/c/${order.shareId}`}
              className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold transition hover:bg-white/10"
            >
              Open the card
            </Link>
          </div>

          <p className="mt-8 text-sm text-cream/60">
            {order.emailedTo
              ? `We've also emailed this link to ${order.emailedTo}, so you can find it later.`
              : "We'll also email you this link so you can find it later."}{" "}
            🌳 A tree is planted with your order.
          </p>
          <Link href={kids ? "/kids" : "/#christmas"} className="mt-6 inline-block text-sm font-semibold text-gold hover:underline">
            {kids ? "Create more kids magic →" : "Send another card →"}
          </Link>
        </div>
      </div>
    </main>
  );
}
