import { NextResponse, type NextRequest } from "next/server";
import { CARDS } from "./lib/catalog";

// Retired cards (Easter, the old video cards and Valentine's) are sent to the
// homepage, which shows the current collection, instead of returning an empty page.
const RETIRED_KEYS = new Set(CARDS.filter((c) => c.retired).map((c) => c.key));
const RETIRED_CARD = /^\/cards?\/(?:valentines\/)?([a-z0-9-]+)\/?$/;

export function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // One canonical host: the bare domain goes to www, so Google sees one version of each page.
  if (url.hostname === "cardroots.com") {
    url.protocol = "https:";
    url.hostname = "www.cardroots.com";
    url.port = "";
    return NextResponse.redirect(url, 301);
  }

  const retired = url.pathname.match(RETIRED_CARD);
  if (retired && RETIRED_KEYS.has(retired[1])) {
    return NextResponse.redirect(new URL("/", req.url), 301);
  }

  const response = NextResponse.next();

  // The public studio is indexable; URLs containing personalisation or recipient
  // details must stay out of search results and cached search previews.
  if (/^\/kids\/?$/.test(url.pathname) && url.search.length > 0) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  }

  return response;
}

export const config = {
  // Skip Next.js build assets and image optimisation, which never need redirecting.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
