import type { Metadata } from "next";
import KidsStudio from "../../components/kids/KidsStudio";
import { isKidsScene, KIDS_LIMITS, KIDS_SCENES, type KidsPersonalisation } from "../../lib/kids";

type Params = Record<string, string | string[] | undefined>;
type Props = { searchParams: Promise<Params> };
const first = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] : value;

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const personalised = Object.keys(params).length > 0;
  return {
    title: "For Kids — Personalised Animated Cards & Crafts",
    description: "Make magical moments with personalised Santa letters, an interactive advent village, paper squishy kits, Tooth Fairy receipts and birthday invitations. Every order plants a tree.",
    alternates: { canonical: "/kids" },
    robots: personalised ? { index: false, follow: false, noarchive: true, googleBot: { index: false, follow: false } } : { index: true, follow: true },
    referrer: "no-referrer",
    openGraph: { title: "A little wonder, made just for them | CardRoots For Kids", description: "Personalised animated experiences and printable crafts. Every order plants a real tree.", url: "/kids" },
    twitter: { title: "CardRoots For Kids", description: "Personalised animated experiences and printable crafts." },
  };
}

export default async function KidsPage({ searchParams }: Props) {
  const params = await searchParams;
  const requestedScene = first(params.scene);
  const scene = isKidsScene(requestedScene) ? requestedScene : "santa";
  const config = KIDS_SCENES[scene];
  const initialData: KidsPersonalisation = {
    scene,
    recipientName: (first(params.name) || "Leo").slice(0, KIDS_LIMITS.recipientName),
    extraDetail: (first(params.extra) || config.defaultExtra).slice(0, KIDS_LIMITS.extraDetail),
    customMessage: (first(params.msg) || config.defaultMessage).slice(0, KIDS_LIMITS.customMessage),
    packageType: first(params.package) === "single" ? "single" : "bundle",
  };
  // The full, unwatermarked experience is only served from a purchased /c/ link.
  return <KidsStudio key={JSON.stringify(initialData)} initialData={initialData} />;
}
