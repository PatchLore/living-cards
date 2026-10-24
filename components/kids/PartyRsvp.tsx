"use client";

import { useEffect, useId, useState } from "react";

const NAME_LIMIT = 30;
type Saved = { guestName: string; attending: boolean };
/** Remembers this device's reply to one invite so a guest sees what they sent. */
const replyKey = (shareId: string) => `cardroots-rsvp:${shareId}`;

/**
 * Guests reply with a first name and yes/no. The reply is emailed to whoever
 * bought the invite; in the studio preview the form is shown but disabled.
 */
export default function PartyRsvp({ shareId, childName }: { shareId?: string; childName: string }) {
  const inputId = useId();
  const [guestName, setGuestName] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [error, setError] = useState("");
  const [sent, setSent] = useState<Saved | null>(null);
  const preview = !shareId;

  useEffect(() => {
    if (!shareId) return;
    try {
      const saved = JSON.parse(window.localStorage.getItem(replyKey(shareId)) || "null");
      if (saved && typeof saved.guestName === "string" && typeof saved.attending === "boolean") setSent(saved);
    } catch {}
  }, [shareId]);

  const reply = async (attending: boolean) => {
    if (!shareId || status === "sending") return;
    const name = guestName.trim();
    if (!name) { setStatus("error"); setError("Please add your first name first."); return; }
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/rsvp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ shareId, guestName: name, attending }) });
      const result = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(result.error || "We couldn’t send your reply. Please try again.");
      const saved = { guestName: name, attending };
      setSent(saved);
      setStatus("idle");
      try { window.localStorage.setItem(replyKey(shareId), JSON.stringify(saved)); } catch {}
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "We couldn’t send your reply. Please try again.");
    }
  };

  if (sent) {
    return (
      <div className="rounded-2xl border-2 border-forest-700/30 bg-white p-4 text-center" role="status">
        <p className="font-serif text-lg font-bold text-forest-900">{sent.attending ? `Thanks, ${sent.guestName}! See you there 🎉` : `Thanks for letting us know, ${sent.guestName}.`}</p>
        <p className="mt-1 text-sm text-forest-800">Your reply has been sent to {childName}’s grown-up.</p>
        <button type="button" onClick={() => { setSent(null); setGuestName(sent.guestName); }} className="mt-3 min-h-[44px] rounded-xl px-4 text-sm font-semibold text-forest-800 underline">Change my reply</button>
      </div>
    );
  }

  return (
    <form onSubmit={event => event.preventDefault()} className="rounded-2xl border-2 border-forest-700/20 bg-white p-4 text-left">
      <p className="font-serif text-lg font-bold text-forest-900">Can you come?</p>
      <label htmlFor={inputId} className="mt-2 block text-sm font-semibold text-forest-900">Your first name</label>
      <input
        id={inputId}
        value={guestName}
        onChange={event => setGuestName(event.target.value)}
        maxLength={NAME_LIMIT}
        autoComplete="off"
        disabled={preview}
        placeholder={preview ? "Guests type their name here" : "e.g. Sam"}
        className="mt-1 min-h-[44px] w-full rounded-xl border border-parchment-300 px-3 text-base text-forest-950 disabled:bg-parchment-100"
      />
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <button type="button" disabled={preview || status === "sending"} onClick={() => reply(true)} className="min-h-[48px] rounded-xl bg-forest-800 px-4 text-base font-bold text-white transition hover:bg-forest-700 disabled:opacity-60">🎉 Yes, I’ll be there</button>
        <button type="button" disabled={preview || status === "sending"} onClick={() => reply(false)} className="min-h-[48px] rounded-xl bg-parchment-200 px-4 text-base font-semibold text-forest-900 transition hover:bg-parchment-300 disabled:opacity-60">Sorry, can’t come</button>
      </div>
      {status === "error" && <p role="alert" className="mt-2 text-sm font-semibold text-berry-700">{error}</p>}
      <p className="mt-3 text-sm text-forest-800">
        {preview ? "On the real invite, each guest’s first name and reply is emailed to you." : `Only your first name and reply are sent to ${childName}’s grown-up.`}
      </p>
    </form>
  );
}
