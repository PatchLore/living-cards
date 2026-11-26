"use client";

import { Analytics, type BeforeSendEvent } from "@vercel/analytics/react";
import { usePathname } from "next/navigation";

/** Card share links (/c/...) are private, so analytics never loads or reports on them. */
const isPrivate = (pathname: string) => pathname.startsWith("/c/");

/**
 * Page-view analytics without personal details. Query strings and hashes are
 * dropped from every event (they can hold Stripe session ids or preview text),
 * and anything sent from a share link after client navigation is cancelled.
 */
function stripPrivateDetails(event: BeforeSendEvent): BeforeSendEvent | null {
  const url = new URL(event.url);
  if (isPrivate(url.pathname)) return null;
  url.search = "";
  url.hash = "";
  return { ...event, url: url.toString() };
}

export default function PrivateAnalytics() {
  const pathname = usePathname();
  if (isPrivate(pathname)) return null;
  return <Analytics beforeSend={stripPrivateDetails} />;
}
