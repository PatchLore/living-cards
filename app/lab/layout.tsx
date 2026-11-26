import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = { robots: { index: false, follow: false } };

// Internal design tools: available in development only.
export default function LabLayout({ children }: { children: React.ReactNode }) {
  if (process.env.NODE_ENV === "production") notFound();
  return children;
}
