import "./globals.css";
import React from "react";
import { Analytics } from "@vercel/analytics/react";
import UrgencyBanner from "../components/UrgencyBanner";

export const metadata = {
  title: "Living Tree Cards",
  description: "Send a digital card that plants a tree 🌱",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-900 relative">

        <div className="snow-overlay"></div>
        <div className="snow-overlay-layer3"></div>

        {/* Seasonal urgency banner (dismissible client component) */}
        <UrgencyBanner />

        {/* Main content above snow */}
        <div className="relative z-[40]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {children}
          </div>
        </div>

        {/* Footer trust / drop-service prompt */}
        <footer className="relative z-[40] mt-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-sm text-slate-400">
            Every card plants a tree — helping restore forests and support sustainable projects worldwide. 🌱
            <div className="mt-2">
              Sending 100+ holiday cards?{" "}
              <a
                href="mailto:info@cardroots.com?subject=Managed%20Sending%20Service%20Enquiry"
                className="underline text-blue-300"
              >
                Request a Managed Sending Service
              </a>
            </div>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}


