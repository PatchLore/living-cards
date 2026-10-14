"use client";

import { useState } from "react";

const QUANTITIES = ["10-49", "50-99", "100-249", "250+", "Not sure yet"];
const SENDING = ["We'll send the links ourselves", "Please send them for us", "Not decided yet"];

const field =
  "mt-2 w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-ink placeholder:text-ink/35 focus:border-berry focus:outline-none focus:ring-2 focus:ring-berry/20";

export default function EnquiryForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    setStatus("sending");
    setError(null);
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Something went wrong. Please try again.");
      setStatus("sent");
      e.currentTarget.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div role="status" className="rounded-2xl bg-emerald-50 p-8 text-center">
        <p className="font-display text-2xl text-ink">Thank you, we&apos;ve got it.</p>
        <p className="mt-3 text-ink/70">
          We&apos;ve sent a confirmation to your inbox. We&apos;ll reply with a quote within one working day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-5 sm:grid-cols-2" noValidate>
      <label className="text-sm font-semibold text-ink">
        Your name *
        <input name="name" required autoComplete="name" className={field} />
      </label>
      <label className="text-sm font-semibold text-ink">
        Email *
        <input name="email" type="email" required autoComplete="email" className={field} />
      </label>
      <label className="text-sm font-semibold text-ink">
        Company or team
        <input name="company" autoComplete="organization" className={field} />
      </label>
      <label className="text-sm font-semibold text-ink">
        How many cards? *
        <select name="quantity" required defaultValue="" className={field}>
          <option value="" disabled>
            Choose a range
          </option>
          {QUANTITIES.map((q) => (
            <option key={q}>{q}</option>
          ))}
        </select>
      </label>
      <label className="text-sm font-semibold text-ink">
        Occasion
        <input name="occasion" placeholder="e.g. Christmas, clients, staff" className={field} />
      </label>
      <label className="text-sm font-semibold text-ink">
        Needed by
        <input name="deadline" placeholder="e.g. 1 December" className={field} />
      </label>
      <fieldset className="sm:col-span-2">
        <legend className="text-sm font-semibold text-ink">Who will send the cards? *</legend>
        <div className="mt-2 flex flex-col gap-2 text-sm text-ink/80">
          {SENDING.map((s) => (
            <label key={s} className="flex items-center gap-2">
              <input type="radio" name="sending" value={s} required /> {s}
            </label>
          ))}
        </div>
      </fieldset>
      <label className="text-sm font-semibold text-ink sm:col-span-2">
        Anything else we should know?
        <textarea name="notes" rows={4} maxLength={1000} className={`${field} resize-none`} placeholder="Roughly who the cards are for, and anything you'd like included." />
      </label>

      {/* Honeypot: hidden from people, filled in by spam bots. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 overflow-hidden">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {error && (
        <p role="alert" className="rounded-lg bg-berry/10 px-3 py-2 text-sm text-berry-deep sm:col-span-2">
          {error}
        </p>
      )}

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex items-center rounded-full bg-berry px-6 py-3 font-semibold text-white shadow-md transition hover:bg-berry-deep disabled:cursor-wait disabled:opacity-70"
        >
          {status === "sending" ? "Sending…" : "Request a quote"}
        </button>
        <p className="mt-3 text-xs text-ink/55">
          We use these details only to reply to your enquiry. See our{" "}
          <a href="/privacy" className="underline">
            privacy policy
          </a>
          .
        </p>
      </div>
    </form>
  );
}
