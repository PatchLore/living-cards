import type { Metadata } from "next";
import KidsStudio from "../../components/kids/KidsStudio";
import { isKidsSceneForSale, KIDS_SCENES, type KidsPersonalisation } from "../../lib/kids";

type Params = Record<string, string | string[] | undefined>;
type Props = { searchParams: Promise<Params> };
const first = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] : value;

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const personalised = Object.keys(params).length > 0;
  return {
    title: "For Kids — Personalised Santa Letters, Advent Stories & More",
    description: "Make magical moments with personalised Santa letters, a 24-chapter advent story, Tooth Fairy receipts and birthday invitations. Every order plants a tree.",
    alternates: { canonical: "/kids" },
    robots: personalised ? { index: false, follow: false, noarchive: true, googleBot: { index: false, follow: false } } : { index: true, follow: true },
    referrer: "no-referrer",
    openGraph: { title: "A little wonder, made just for them | CardRoots For Kids", description: "Personalised Santa letters, advent stories and keepsakes. Every order plants a real tree.", url: "/kids" },
    twitter: { title: "CardRoots For Kids", description: "Personalised Santa letters, advent stories and keepsakes." },
  };
}

export default async function KidsPage({ searchParams }: Props) {
  const params = await searchParams;
  const requestedScene = first(params.scene);
  const scene = isKidsSceneForSale(requestedScene) ? requestedScene : "santa";
  const config = KIDS_SCENES[scene];
  // Only the product and package come from the URL. Names and messages stay in
  // the studio's session draft, never in links, history or analytics.
  const initialData: KidsPersonalisation = {
    scene,
    recipientName: "Leo",
    extraDetail: config.defaultExtra,
    customMessage: config.defaultMessage,
    packageType: first(params.package) === "single" ? "single" : "bundle",
  };
  // The full, unwatermarked experience is only served from a purchased /c/ link.
  return <KidsStudio key={JSON.stringify(initialData)} initialData={initialData} sceneFromUrl={isKidsSceneForSale(requestedScene)} />;
}
