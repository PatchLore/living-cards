import type { Metadata } from "next";
import Home from "./Home";
import { HomeProvider } from "./HomeClient";
import JsonLd from "../components/site/JsonLd";
import { CHRISTMAS_LIVE, NEW_YEAR } from "../lib/catalog";
import { faqLd, itemListLd } from "../lib/seo";

// Rendered per request so the Halloween section switches off on time and
// the CDN never serves stale HTML.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function Page() {
  return (
    <>
      <JsonLd data={[faqLd, itemListLd("Animated Christmas and New Year cards", [...CHRISTMAS_LIVE, ...NEW_YEAR])]} />
      <HomeProvider>
        <Home />
      </HomeProvider>
    </>
  );
}
