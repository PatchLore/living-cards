import "./globals.css";
import React from "react";
import { Analytics } from "@vercel/analytics/react";

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

        {/* Main content above snow */}
        <div className="relative z-[40]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {children}
          </div>
        </div>
        <Analytics />
      </body>
    </html>
  );
}


