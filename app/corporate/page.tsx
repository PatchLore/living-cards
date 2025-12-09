import React from "react";

export default function CorporatePage() {
  return (
    <main className="min-h-screen bg-slate-50 py-16 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl p-8 shadow-lg">
        <h1 className="text-3xl font-semibold mb-4">Corporate & Bulk Orders</h1>
        <p className="text-slate-700 mb-6">
          Need to send 50+ cards? We handle everything for you — including custom branding, scheduled sending, and sustainability certificates.
        </p>

        <a
          href="mailto:hello@patchlore.com"
          className="inline-flex items-center px-6 py-3 rounded-2xl bg-amber-500 text-white font-medium shadow-md"
        >
          Contact Us for a Bulk Quote
        </a>

        <div className="mt-6 text-slate-600">
          <h2 className="text-lg font-medium mb-2">Drop-service workflow</h2>
          <p>
            Prefer us to manage your recipient list? Simply email us your names, messages, and delivery dates — we’ll handle the rest.
          </p>
          <p className="mt-3">
            Sending 100+ holiday cards?{" "}
            <a href="mailto:hello@patchlore.com" className="underline text-blue-300">
              Request a Managed Sending Service
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}


