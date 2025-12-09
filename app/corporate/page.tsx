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
          href="mailto:info@cardroots.com?subject=Corporate%20Bulk%20Card%20Order"
          className="inline-flex items-center px-6 py-3 rounded-2xl bg-amber-500 text-white font-medium shadow-md hover:bg-amber-600 transition"
        >
          Contact Us for a Bulk Quote
        </a>

        <div className="mt-8 text-slate-600">
          <h2 className="text-xl font-semibold mb-3 text-slate-800">Drop-service workflow</h2>
          <p className="mb-4">
            Prefer us to manage your recipient list? Simply email us your names, messages, and delivery dates — we'll handle the rest.
          </p>
          <p className="mt-3">
            Sending 100+ holiday cards?{" "}
            <a
              href="mailto:info@cardroots.com?subject=Managed%20Sending%20Service%20Enquiry"
              className="underline text-blue-600 hover:text-blue-700"
            >
              Request a Managed Sending Service
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}


