import { NextResponse, type NextRequest } from "next/server";

// Retired seasonal cards (e.g. /card/easter-sunrise) are sent to the homepage,
// which shows the current collection, instead of returning an empty page.
const RETIRED_CARD = /^\/card\/easter-[a-z0-9-]+\/?$/;

export function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // One canonical host: the bare domain goes to www, so Google sees one version of each page.
  if (url.hostname === "cardroots.com") {
    url.protocol = "https:";
    url.hostname = "www.cardroots.com";
    url.port = "";
    return NextResponse.redirect(url, 301);
  }

  if (RETIRED_CARD.test(url.pathname)) {
    return NextResponse.redirect(new URL("/", req.url), 301);
  }

  return NextResponse.next();
}

export const config = {
  // Skip Next.js build assets and image optimisation, which never need redirecting.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
