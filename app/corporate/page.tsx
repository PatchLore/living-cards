import React from "react";
import { Metadata } from "next";
import EnquiryForm from "./EnquiryForm";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.cardroots.com").replace(/\/$/, "");
const TITLE = "Business and Bulk Animated Cards";
const DESCRIPTION =
  "Send animated digital greeting cards to clients, staff or customers. Bulk pricing for teams, personalised cards that each plant a tree. Request a quote.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/corporate" },
  openGraph: { type: "website", url: `${siteUrl}/corporate`, title: TITLE, description: DESCRIPTION, siteName: "CardRoots" },
  twitter: { card: "summary", title: TITLE, description: DESCRIPTION },
};

const STEPS = [
  ["Tell us what you need", "How many cards, the occasion, and when you need them by."],
  ["Get a quote", "We reply within one working day with a per-card price for your volume."],
  ["Pay and send", "Pay for the quantity, then send the links yourself or ask us to send them for you."],
];

export default function CorporatePage() {
  return (
    <main className="bg-paper px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-berry">For teams and businesses</p>
        <h1 className="mt-3 font-display text-4xl leading-tight text-ink sm:text-5xl">Animated cards for clients, staff and customers</h1>
        <p className="mt-5 max-w-2xl text-lg text-ink/70">
          Every card is personalised with the recipient&apos;s name and your message, and every one plants a real tree. Tell us
          how many you need and we&apos;ll send a quote.
        </p>

        <ol className="mt-12 grid gap-5 md:grid-cols-3">
          {STEPS.map(([title, body], i) => (
            <li key={title} className="rounded-2xl border border-ink/10 bg-white p-6">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-berry font-display text-white">{i + 1}</span>
              <h2 className="mt-4 font-display text-xl text-ink">{title}</h2>
              <p className="mt-2 text-ink/65">{body}</p>
            </li>
          ))}
        </ol>

        <section id="enquiry" className="mt-14 scroll-mt-24 rounded-3xl bg-white p-6 shadow-lg sm:p-10">
          <h2 className="font-display text-3xl text-ink">Request a quote</h2>
          <p className="mt-2 text-ink/65">Takes about two minutes. There&apos;s no obligation.</p>
          <div className="mt-8">
            <EnquiryForm />
          </div>
        </section>

        <p className="mt-10 text-sm text-ink/60">
          Prefer email? Write to{" "}
          <a href="mailto:info@cardroots.com?subject=Business%20enquiry" className="font-semibold text-berry underline">
            info@cardroots.com
          </a>
          .
        </p>
      </div>
    </main>
  );
}
