"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useMemo, useState, useSyncExternalStore, type Dispatch, type SetStateAction } from "react";
import { KIDS_BUNDLE_PRICE, KIDS_LIMITS, KIDS_SCENES, isKidsSceneForSale, kidsBundleValue, kidsIncludedScenes, kidsPrice, kidsSceneDetails, type KidsPersonalisation, type KidsScene, type KidsSceneDetails } from "../../lib/kids";
import { CARD_LINK_MONTHS, CHECKOUT_CLOSED_MESSAGE, IMMEDIATE_SUPPLY_CONSENT } from "../../lib/sales";
import { useSalesOpen } from "../site/SalesStatus";
import KidsScenes from "./KidsScenes";
import { useHydrated } from "./craft";
import { kidsFontVariables } from "./kidsFonts";
import { isWorkshopDesign, type WorkshopDesign } from "./workshopOptions";
import "./kids.css";

// Only purchased squishy links show the printable kit, so it loads on demand.
const PrintableSquishy = dynamic(() => import("./PrintableSquishy"));
const sceneKeys = (Object.keys(KIDS_SCENES) as KidsScene[]).filter(isKidsSceneForSale);
const santaBundleSaving = kidsBundleValue("santa") - KIDS_BUNDLE_PRICE;
const defaults: KidsPersonalisation = { scene: "santa", recipientName: "Leo", extraDetail: KIDS_SCENES.santa.defaultExtra, customMessage: KIDS_SCENES.santa.defaultMessage, packageType: "bundle" };

/**
 * The studio keeps an unfinished draft in this browser tab only, so a child's
 * name never has to travel in the address bar (or analytics, or history).
 */
const DRAFT_KEY = "cardroots-kids-draft";
type StudioDraft = { data: KidsPersonalisation; primary: KidsScene; drafts: Record<KidsScene, KidsSceneDetails> };

const fitsLimits = (details: unknown): details is KidsSceneDetails => {
  const d = details as Partial<KidsSceneDetails> | null;
  return !!d && typeof d.extraDetail === "string" && typeof d.customMessage === "string"
    && d.extraDetail.length <= KIDS_LIMITS.extraDetail && d.customMessage.length <= KIDS_LIMITS.customMessage;
};

function readDraft(raw: string | null): StudioDraft | null {
  try {
    const saved = JSON.parse(raw || "null") as StudioDraft | null;
    const data = saved?.data;
    if (!saved || !data || !isKidsSceneForSale(data.scene) || !isKidsSceneForSale(saved.primary)) return null;
    if (typeof data.recipientName !== "string" || data.recipientName.length > KIDS_LIMITS.recipientName || !fitsLimits(data)) return null;
    if (data.packageType !== "single" && data.packageType !== "bundle") return null;
    if (!sceneKeys.every(scene => fitsLimits(saved.drafts?.[scene]))) return null;
    return { data: { scene: data.scene, recipientName: data.recipientName, extraDetail: data.extraDetail, customMessage: data.customMessage, packageType: data.packageType }, primary: saved.primary, drafts: saved.drafts };
  } catch {
    return null;
  }
}

const subscribeToNothing = () => () => {};
const getEmptyStorageSnapshot = () => null;
const getDraftSnapshot = () => window.sessionStorage.getItem(DRAFT_KEY);

function subscribeToWorkshopStorage(callback: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === workshopKey() || event.key === null) callback();
  };
  window.addEventListener("storage", onStorage);
  return () => window.removeEventListener("storage", onStorage);
}

function getWorkshopSnapshot() {
  try {
    return window.localStorage.getItem(workshopKey());
  } catch {
    return null;
  }
}

function readWorkshop(raw: string | null): WorkshopDesign | null {
  try {
    const saved: unknown = JSON.parse(raw || "null");
    return isWorkshopDesign(saved) ? saved : null;
  } catch {
    return null;
  }
}

/** The Squishy Workshop creature is remembered per purchased link, on this device only. */
const workshopKey = () => `cardroots-squishy:${window.location.pathname}`;

/** Diagonal "PREVIEW" marks over the studio preview; purchased links don't show it. */
function PreviewWatermark() {
  return (
    <div aria-hidden className="kids-watermark pointer-events-none absolute inset-0 z-30 overflow-hidden">
      {Array.from({ length: 14 }, (_, i) => (
        <span key={i} style={{ top: `${(i % 7) * 15 - 4}%`, left: `${i < 7 ? -10 : 45}%` }}>
          PREVIEW · CardRoots
        </span>
      ))}
    </div>
  );
}

export default function KidsStudio({ initialData, recipientOnly = false, shareId, sceneFromUrl = false, serverNow }: { initialData?: KidsPersonalisation; recipientOnly?: boolean; shareId?: string; sceneFromUrl?: boolean; serverNow?: number }) {
  const start = initialData || defaults;
  const hydrated = useHydrated();
  const draftSnapshot = useSyncExternalStore(subscribeToNothing, getDraftSnapshot, getEmptyStorageSnapshot);
  const savedDraft = useMemo(() => readDraft(draftSnapshot), [draftSnapshot]);
  const initialDraft = useMemo<StudioDraft>(() => ({
    data: start,
    primary: start.scene,
    drafts: Object.fromEntries(sceneKeys.map(scene => [scene, kidsSceneDetails(start, scene)])) as Record<KidsScene, KidsSceneDetails>,
  }), [start]);
  const restoredDraft = useMemo<StudioDraft>(() => savedDraft
    ? sceneFromUrl && savedDraft.primary !== start.scene
      ? {
          data: { ...start, recipientName: savedDraft.data.recipientName, ...savedDraft.drafts[start.scene] },
          primary: start.scene,
          drafts: savedDraft.drafts,
        }
      : savedDraft
    : initialDraft, [savedDraft, sceneFromUrl, start, initialDraft]);
  const [draftOverride, setDraftOverride] = useState<StudioDraft | null>(null);
  const activeDraft = draftOverride ?? restoredDraft;
  const { data, primary, drafts } = activeDraft;
  const setData: Dispatch<SetStateAction<KidsPersonalisation>> = action => {
    setDraftOverride(current => ({
      ...(current ?? restoredDraft),
      data: typeof action === "function" ? action((current ?? restoredDraft).data) : action,
    }));
  };
  const setPrimary: Dispatch<SetStateAction<KidsScene>> = action => {
    setDraftOverride(current => ({
      ...(current ?? restoredDraft),
      primary: typeof action === "function" ? action((current ?? restoredDraft).primary) : action,
    }));
  };
  const setDrafts: Dispatch<SetStateAction<Record<KidsScene, KidsSceneDetails>>> = action => {
    setDraftOverride(current => ({
      ...(current ?? restoredDraft),
      drafts: typeof action === "function" ? action((current ?? restoredDraft).drafts) : action,
    }));
  };
  const [preview, setPreview] = useState(recipientOnly);
  const [replay, setReplay] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [consent, setConsent] = useState(false);
  const salesOpen = useSalesOpen();
  const workshopSnapshot = useSyncExternalStore(subscribeToWorkshopStorage, getWorkshopSnapshot, getEmptyStorageSnapshot);
  const [workshopOverride, setWorkshopOverride] = useState<WorkshopDesign | null | undefined>(undefined);
  const savedWorkshop = useMemo(() => readWorkshop(workshopSnapshot), [workshopSnapshot]);
  const workshop = workshopOverride !== undefined
    ? workshopOverride
    : recipientOnly ? savedWorkshop : null;
  const workshopLoaded = !recipientOnly || hydrated;
  const draftReady = recipientOnly || hydrated;

  useEffect(() => {
    if (!draftReady || recipientOnly) return;
    try { window.sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ data, primary, drafts })); } catch {}
  }, [data, primary, drafts, draftReady, recipientOnly]);

  const saveWorkshop = (design: WorkshopDesign) => {
    setWorkshopOverride(design);
    if (!recipientOnly) return;
    try { window.localStorage.setItem(workshopKey(), JSON.stringify(design)); } catch {}
  };
  const config = KIDS_SCENES[data.scene];
  const price = kidsPrice({ scene: primary, packageType: data.packageType });
  const displayData = { ...data, recipientName: data.recipientName.trim() || "Leo", extraDetail: data.extraDetail.trim() || config.defaultExtra, customMessage: data.customMessage.trim() || config.defaultMessage };
  const includedScenes = kidsIncludedScenes({ scene: primary, packageType: data.packageType });
  const selectableScenes = recipientOnly ? includedScenes : sceneKeys;
  // Only a squishy bought before it went off sale still shows the printable kit.
  const showPrint = recipientOnly && data.scene === "squishy";
  const bundleEditing = !recipientOnly && data.packageType === "bundle";

  /** Show another experience, keeping the wording typed for the current one. */
  const viewScene = (scene: KidsScene) => {
    if (scene === data.scene) return;
    setDrafts(current => ({ ...current, [data.scene]: { extraDetail: data.extraDetail, customMessage: data.customMessage } }));
    setData(current => ({ ...current, scene, ...drafts[scene] }));
    setFeedback("");
    setError("");
  };

  const selectScene = (scene: KidsScene) => {
    if (!recipientOnly) setPrimary(scene);
    viewScene(scene);
  };

  const setPackage = (packageType: KidsPersonalisation["packageType"]) => {
    if (packageType === "single") viewScene(primary);
    setData(current => ({ ...current, packageType }));
  };

  /** What checkout receives: the bought experience's wording, plus each other bundle experience's. */
  const checkoutBody = () => {
    const all = { ...drafts, [data.scene]: { extraDetail: data.extraDetail, customMessage: data.customMessage } };
    const filled = (scene: KidsScene) => ({ extraDetail: all[scene].extraDetail.trim() || KIDS_SCENES[scene].defaultExtra, customMessage: all[scene].customMessage.trim() || KIDS_SCENES[scene].defaultMessage });
    const others = includedScenes.filter(scene => scene !== primary);
    return {
      scene: primary,
      packageType: data.packageType,
      recipientName: data.recipientName.trim(),
      ...filled(primary),
      ...(data.packageType === "bundle" ? { bundle: Object.fromEntries(others.map(scene => [scene, filled(scene)])) } : {}),
    };
  };

  const checkout = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy) return;
    setError("");
    if (!data.recipientName.trim()) { setError("Please add the child’s first name."); return; }
    if (!salesOpen) { setError(CHECKOUT_CLOSED_MESSAGE); return; }
    if (!consent) { setError("Please tick the box to confirm you want your order delivered straight away."); return; }
    setBusy(true);
    try {
      const response = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...checkoutBody(), immediateSupplyConsent: consent }) });
      const result = await response.json();
      if (!response.ok || !result.url) throw new Error(result.error || "We couldn’t start checkout. Please try again.");
      window.location.assign(result.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "We couldn’t start checkout. Please try again.");
      setBusy(false);
    }
  };


  return (
    <div className={`kids-studio ${kidsFontVariables}`}>
      {!preview && <>
        <div className="no-print kids-announcement border-b border-forest-800 bg-forest-950 px-4 py-2.5 text-center text-xs font-medium text-parchment-100 sm:text-sm">🌲 Every personalised order plants a real tree <span className="mx-2 text-amber-300">·</span> Instant personalised links <span className="mx-2 text-amber-300">·</span> <a href="#bundles" className="font-semibold text-amber-300 underline-offset-4 hover:underline">Complete Kids Magical Bundle £{KIDS_BUNDLE_PRICE} — save £{santaBundleSaving}</a></div>
        <section id="top" className="no-print kids-hero relative overflow-hidden border-b border-forest-800 px-5 py-12 text-parchment-50 sm:px-8 sm:py-16 lg:py-20">
          <div className="kids-hero-glow" aria-hidden="true" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
            <div>
              <p className="mb-5 inline-flex rounded-full border border-amber-200/25 bg-forest-950/55 px-4 py-2 text-sm font-semibold text-amber-200">🎄 CardRoots For Kids <span className="mx-2 text-forest-400">·</span> Little moments, made personal</p>
              <h1 className="max-w-3xl font-serif text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">Make room for a little everyday magic.</h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-parchment-200 sm:text-lg">Choose printable screen-free activities for home, or create a personalised story and keepsake with your child at the heart of it.</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a href="#printables" className="inline-flex min-h-12 items-center justify-center rounded-full bg-amber-300 px-6 py-3 text-sm font-bold text-forest-950 shadow-lg transition hover:bg-amber-200">Explore printable packs <span className="ml-2" aria-hidden="true">↓</span></a>
                <a href="#studio" className="inline-flex min-h-12 items-center justify-center rounded-full border border-parchment-100/35 bg-white/5 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10">Create a personalised keepsake <span className="ml-2" aria-hidden="true">→</span></a>
              </div>
              <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm text-parchment-200">
                <span>⚡ Instant shareable link</span><span>🌱 Every personalised order plants a tree</span><span>🔒 First names only, no photos</span>
              </div>
            </div>
            <div className="kids-hero-art relative mx-auto w-full max-w-[520px]" aria-label="A selection of CardRoots Kids printable activity packs">
              <div className="kids-hero-art-backdrop" aria-hidden="true" />
              <div className="kids-hero-cover kids-hero-cover--left"><Image src="/kids/after-school/7day-reset-cover.png" alt="The 7-Day Screen-Free Reset cover" width={1241} height={1754} priority /></div>
              <div className="kids-hero-cover kids-hero-cover--right"><Image src="/kids/after-school/30day-challenge-cover.png" alt="The 30-Day Screen-Free Challenge cover" width={1241} height={1754} priority /></div>
              <div className="kids-hero-cover kids-hero-cover--front"><Image src="/kids/after-school/cover.png" alt="The After-School Hour activity-card pack cover" width={1241} height={1754} priority /></div>
              <span className="kids-hero-note">Screen-free fun<br />for ages 6–8</span>
            </div>
          </div>
        </section>
        <nav aria-label="Kids page sections" className="no-print kids-category-nav sticky top-0 z-20 border-b border-parchment-300 bg-parchment-50/95 px-4 py-3 shadow-sm backdrop-blur sm:px-8">
          <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto pb-1 text-sm font-semibold text-forest-800">
            <a href="#printables" className="kids-nav-chip">Printable packs</a><a href="#screen-free-packs" className="kids-nav-chip">Screen-free</a><a href="#rainy-day-packs" className="kids-nav-chip">Rainy days</a><a href="#printable-bundles" className="kids-nav-chip">Printable bundles</a><a href="#studio" className="kids-nav-chip">Kids Studio</a><a href="#bundles" className="kids-nav-chip">Studio pricing</a><a href="#privacy-trust" className="kids-nav-chip">Parent promise</a>
          </div>
        </nav>

        <section id="printables" className="no-print kids-shop-section px-5 py-12 text-forest-900 sm:px-8 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-7xl">
            <div id="after-school-hour" className="kids-feature-card scroll-mt-28 overflow-hidden rounded-[2rem] border border-forest-900/10 bg-white shadow-[0_24px_70px_-36px_rgba(15,41,30,.35)]">
              <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
                <div className="kids-feature-gallery p-4 sm:p-6 lg:p-8">
                  <div className="kids-feature-main"><Image src="/kids/after-school/cover.png" alt="The After-School Hour activity-card pack cover" width={1241} height={1754} priority className="h-full w-full object-contain" /></div>
                  <div className="mt-3 grid grid-cols-3 gap-3">
                    <Image src="/kids/after-school/activity-sheet-colour.png" alt="Colour printable activity sheet preview" width={1241} height={1754} className="kids-feature-thumb" />
                    <Image src="/kids/after-school/activity-sheet-lowink.png" alt="Low-ink printable activity sheet preview" width={1241} height={1754} className="kids-feature-thumb" />
                    <Image src="/kids/after-school/card-closeup.png" alt="Close-up of one screen-free activity card" width={1054} height={758} className="kids-feature-thumb" />
                  </div>
                </div>
                <div className="flex flex-col justify-center p-6 sm:p-9 lg:p-12">
                  <p className="kids-eyebrow">Printable fun · Ages 6–8</p>
                  <h2 className="mt-3 font-serif text-3xl font-bold leading-tight sm:text-4xl">The After-School Hour</h2>
                  <p className="mt-4 max-w-2xl text-base leading-relaxed text-forest-800">Thirty screen-free activity cards to make the after-school stretch easier to fill, plus four short guides for grown-ups. Most ideas use everyday household things, a few found objects, or nothing at all.</p>
                  <ul className="mt-6 grid gap-3 text-sm text-forest-800 sm:grid-cols-2">
                    <li className="kids-feature-point">30 activities + 4 grown-up guides</li><li className="kids-feature-point">A4 and US Letter PDF formats</li><li className="kids-feature-point">Colour and low-ink print options</li><li className="kids-feature-point">Instant digital download</li>
                  </ul>
                  <div className="mt-7 flex flex-wrap items-center gap-4">
                    <a href="https://payhip.com/b/hWwNf" className="kids-primary-cta">Get the cards <span className="ml-2">· £5.99</span></a>
                    <span className="text-sm text-forest-700">Sold securely through Payhip. Printable packs don&apos;t include tree planting.</span>
                  </div>
                </div>
              </div>
            </div>

            <div id="screen-free-packs" className="kids-section-heading scroll-mt-28">
              <div><p className="kids-eyebrow">Simple plans for everyday moments</p><h2 className="mt-2 font-serif text-3xl font-bold sm:text-4xl">Screen-free packs</h2></div>
              <p className="max-w-xl text-sm leading-relaxed text-forest-700 sm:text-base">Printable mission packs for children aged 6–8, with simple ideas, trackers and certificates. Choose a free week or keep going for a month.</p>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <article className="kids-product-card">
                <div className="kids-product-art"><span className="kids-product-badge">FREE</span><Image src="/kids/after-school/7day-reset-cover.png" alt="The 7-Day Screen-Free Reset printable cover" width={1241} height={1754} /></div>
                <div className="kids-product-body"><p className="kids-product-meta">Ages 6–8 <span>·</span> One week</p><h3 className="kids-product-title">The 7-Day Screen-Free Reset</h3><p className="kids-product-description">Seven short missions for after school, the kitchen, bath time, garden, car, bedtime and a weekend morning. Each takes under 20 minutes and uses things you already have at home.</p><ul className="kids-product-list"><li>Four print files: A4 and US Letter, colour and low-ink</li><li>Fridge tracker and screen-free week certificate</li></ul><div className="kids-product-footer"><span className="kids-product-price">Free</span><a href="https://payhip.com/b/MT6hg" className="kids-primary-cta">Download free on Payhip <span className="ml-2">→</span></a></div></div>
              </article>
              <article className="kids-product-card">
                <div className="kids-product-art"><span className="kids-product-badge kids-product-badge--gold">30 MISSIONS</span><Image src="/kids/after-school/30day-challenge-cover.png" alt="The 30-Day Screen-Free Challenge printable cover" width={1241} height={1754} /></div>
                <div className="kids-product-body"><p className="kids-product-meta">Ages 6–8 <span>·</span> One month</p><h3 className="kids-product-title">The 30-Day Screen-Free Challenge</h3><p className="kids-product-description">A month of short missions grouped around making things, going outside, words and stories, and turning the house into a playground. Skip, swap or repeat days to suit your family.</p><ul className="kids-product-list"><li>Four print files: A4 and US Letter, colour and low-ink</li><li>Month tracker and screen-free month certificate</li></ul><div className="kids-product-footer"><span className="kids-product-price">£4</span><a href="https://payhip.com/b/MjsHy" className="kids-primary-cta">Get the challenge <span className="ml-2">· £4</span></a></div></div>
              </article>
            </div>

            <div id="rainy-day-packs" className="kids-section-heading scroll-mt-28">
              <div><p className="kids-eyebrow">For the days spent indoors</p><h2 className="mt-2 font-serif text-3xl font-bold sm:text-4xl">Rainy day packs</h2></div>
              <p className="max-w-xl text-sm leading-relaxed text-forest-700 sm:text-base">Two printable packs to keep in a drawer for the days it will not stop raining. Everything uses paper, a pencil and things you already have at home.</p>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <article className="kids-product-card">
                <div className="kids-product-art"><span className="kids-product-badge kids-product-badge--blue">10 MISSIONS</span><Image src="/kids/after-school/rainy-day-missions-cover.png" alt="Rainy Day Missions printable cover" width={1240} height={1754} /></div>
                <div className="kids-product-body"><p className="kids-product-meta">Ages 6–8 <span>·</span> Indoors</p><h3 className="kids-product-title">Rainy Day Missions</h3><p className="kids-product-description">Ten indoor missions, each under 20 minutes, from Raindrop Race and Paper Boat Harbour to Sock Bowling and The Forecast Hunt. Some are quiet solo play, some need a second person.</p><ul className="kids-product-list"><li>Four print files: A4 and US Letter, colour and low-ink</li><li>Raindrop tracker and Rainy Day Champion certificate</li></ul><div className="kids-product-footer"><span className="kids-product-price">£2.99</span><a href="https://payhip.com/b/qLk6U" className="kids-primary-cta">Get Rainy Day Missions <span className="ml-2">· £2.99</span></a></div></div>
              </article>
              <article className="kids-product-card">
                <div className="kids-product-art"><span className="kids-product-badge kids-product-badge--gold">CRAFT PACK</span><Image src="/kids/after-school/rainy-day-craft-cover.png" alt="Rainy Day Rescue Craft Pack printable cover" width={1241} height={1754} /></div>
                <div className="kids-product-body"><p className="kids-product-meta">Ages 6–8 <span>·</span> About an hour</p><h3 className="kids-product-title">Rainy Day Rescue: Craft Pack</h3><p className="kids-product-description">A rainy-afternoon plan: a five-minute warm-up, a Rain Cloud Stand to cut and fold, an indoor jumping game, a quiet listening page and a journal page. Do it all or pick one.</p><ul className="kids-product-list"><li>Four print files: A4 and US Letter, colour and low-ink</li><li>Grown-up page and a certificate to keep</li></ul><div className="kids-product-footer"><span className="kids-product-price">£5</span><a href="https://payhip.com/b/Fe3yA" className="kids-primary-cta">Get the Craft Pack <span className="ml-2">· £5</span></a></div></div>
              </article>
            </div>

            <section id="printable-bundles" className="kids-printable-bundles scroll-mt-28">
              <div className="mx-auto max-w-3xl text-center"><p className="kids-eyebrow kids-eyebrow--light">More ideas, better value</p><h2 className="mt-2 font-serif text-3xl font-bold text-white sm:text-4xl">Printable bundles</h2><p className="mt-3 text-sm leading-relaxed text-parchment-200 sm:text-base">Pick the set that suits your family. Each bundle is sold through Payhip and printable packs don&apos;t include tree planting.</p></div>
              <div className="mt-8 grid gap-4 lg:grid-cols-3">
                <article className="kids-bundle-card"><p className="kids-bundle-kicker">A simple place to start</p><h3>Starter Bundle</h3><p className="kids-bundle-total">£6</p><p className="kids-bundle-savings">Save 99p <span>· £6.99 separately</span></p><ul><li>7-Day Screen-Free Reset</li><li>30-Day Screen-Free Challenge</li><li>Rainy Day Missions</li></ul><a href="https://payhip.com/b/O6GYc" className="kids-bundle-cta">Get the Starter Bundle <span>→</span></a></article>
                <article className="kids-bundle-card kids-bundle-card--featured"><p className="kids-bundle-kicker">Rainy afternoon ready</p><h3>Rainy Day Bundle</h3><p className="kids-bundle-total">£6.99</p><p className="kids-bundle-savings">Save £1 <span>· £7.99 separately</span></p><ul><li>Rainy Day Missions</li><li>Rainy Day Rescue: Craft Pack</li></ul><a href="https://payhip.com/b/Tum1p" className="kids-bundle-cta">Get the Rainy Day Bundle <span>→</span></a></article>
                <article className="kids-bundle-card"><p className="kids-bundle-kicker">A little of everything</p><h3>Family Bundle</h3><p className="kids-bundle-total">£9</p><p className="kids-bundle-savings">Save 99p <span>· £9.99 separately</span></p><ul><li>After-School Hour</li><li>7-Day Screen-Free Reset</li><li>30-Day Screen-Free Challenge</li></ul><a href="https://payhip.com/b/9FqIa" className="kids-bundle-cta">Get the Family Bundle <span>→</span></a></article>
              </div>
            </section>
          </div>
        </section>
      </>}
      <main id="studio" className="no-print kids-studio-island scroll-mt-20 border-y border-forest-900/10 px-4 py-12 sm:px-6 sm:py-16 lg:px-8"><div className="mx-auto max-w-7xl">
        <div className="kids-studio-heading mb-8 flex flex-wrap items-end justify-between gap-4">
          <div><p className="text-sm font-bold uppercase tracking-[0.18em] text-forest-700">{preview ? "A little magic, just for you" : "Create a personalised keepsake"}</p>{preview ? <h1 className="mt-2 font-serif text-3xl font-bold text-forest-900 sm:text-4xl">Made specially for {displayData.recipientName}</h1> : <><h2 className="mt-2 font-serif text-3xl font-bold text-forest-900 sm:text-4xl">Welcome to the Kids Studio</h2><p className="mt-2 max-w-2xl text-sm leading-relaxed text-forest-700 sm:text-base">Choose a story or keepsake, add a first name and personal message, and see your creation come to life.</p></>}</div>
          {!recipientOnly && <button type="button" onClick={() => { setPreview(!preview); setFeedback(""); }} className="rounded-xl border border-forest-800 px-4 py-2 text-sm font-semibold text-forest-900 hover:bg-forest-100">{preview ? "← Back to personalising" : "👁 Recipient View"}</button>}
        </div>

        {(!preview || (recipientOnly && data.packageType === "bundle")) && <div role="group" aria-label="Choose a kids experience" id="sceneTabs" className="mb-7 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
          {selectableScenes.map(scene => { const item = KIDS_SCENES[scene]; return <button key={scene} id={`tab-${scene}`} type="button" aria-pressed={(recipientOnly ? data.scene : primary) === scene} onClick={() => selectScene(scene)} className={`scene-tab rounded-2xl border-2 p-3.5 text-left transition ${(recipientOnly ? data.scene : primary) === scene ? "border-forest-900 bg-forest-900 text-white shadow-md" : "border-parchment-300 bg-white text-forest-900 hover:bg-parchment-50"}`}><span className="flex items-center justify-between gap-2"><span className="text-2xl" aria-hidden>{item.icon}</span>{!recipientOnly && <span className="rounded-full bg-amber-300 px-2 py-0.5 text-sm font-bold text-forest-950">£{item.price}</span>}</span><span className="mt-2 block font-serif text-sm font-bold">{item.shortTitle}</span><span className="mt-1 block text-sm opacity-80">{item.description}</span></button>; })}
        </div>}

        <div className={`grid items-start gap-8 ${preview ? "mx-auto max-w-3xl" : "lg:grid-cols-12"}`}>
          <div id="stageColumn" className={preview ? "min-w-0" : "min-w-0 lg:col-span-7"}>
            <div className="relative overflow-hidden rounded-3xl border border-forest-800 bg-forest-950 p-3 shadow-2xl sm:p-5">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2 px-1 text-sm text-parchment-100"><span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />{preview ? "Your personalised creation" : "Live interactive preview · Updates as you type"}</span><button type="button" onClick={() => setReplay(value => value + 1)} className="min-h-[44px] rounded-full bg-forest-800 px-4 font-semibold text-amber-300 hover:bg-forest-700">↻ Replay animation</button></div>
              <div id="sceneViewport" className="relative flex min-h-[480px] flex-col justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-[#0b1f17] via-[#133326] to-[#0a1912] p-4 sm:min-h-[540px] sm:p-7">
                <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-75" aria-hidden>{Array.from({ length: 18 }, (_, i) => <span key={i} className="animate-twinkle absolute select-none text-amber-200/60" style={{ left: `${i * 19 % 96}%`, top: `${i * 29 % 92}%`, animationDelay: `${i * .35}s`, fontSize: `${10 + i % 8}px` }}>{["✨", "❄️", "⭐", "•"][i % 4]}</span>)}</div>
                {(workshopLoaded || data.scene !== "squishy") && <KidsScenes key={`${data.scene}-${preview}-${replay}`} {...displayData} recipientOnly={recipientOnly} shareId={shareId} serverNow={serverNow} workshop={workshop} onWorkshop={saveWorkshop} />}
                {!recipientOnly && <PreviewWatermark />}
              </div>
            </div>
          </div>

          {!preview && <form onSubmit={checkout} id="controlsColumn" className="min-w-0 rounded-3xl border border-parchment-300 bg-white p-5 shadow-xl sm:p-7 lg:col-span-5">
            <div className="mb-5 flex items-center justify-between gap-3 border-b border-parchment-200 pb-4"><div><p className="text-sm font-bold uppercase tracking-wider text-forest-700">2. Make it theirs</p><h3 className="mt-1 font-serif text-xl font-bold text-forest-900">{data.packageType === "bundle" ? "Complete Kids Magical Bundle" : config.title}</h3></div><div className="shrink-0 text-right"><span className="font-serif text-2xl font-bold text-forest-900">£{price}</span><span className="block text-sm text-forest-700">{data.packageType === "bundle" ? "Bundle · " : ""}Includes 1 tree 🌱</span></div></div>
            {bundleEditing && <div className="mb-5 rounded-xl border border-amber-400/50 bg-amber-50 p-3">
              <p className="text-sm font-semibold text-forest-900">Your bundle includes {includedScenes.length} experiences. Personalise each one:</p>
              <div role="group" aria-label="Personalise each bundle experience" className="mt-2 flex flex-wrap gap-1.5">{includedScenes.map(scene => <button key={scene} type="button" aria-pressed={data.scene === scene} onClick={() => viewScene(scene)} className={`rounded-lg border px-2.5 py-1.5 text-sm font-semibold ${data.scene === scene ? "border-forest-900 bg-forest-900 text-white" : "border-parchment-300 bg-white text-forest-900 hover:bg-parchment-100"}`}><span aria-hidden>{KIDS_SCENES[scene].icon} </span>{KIDS_SCENES[scene].shortTitle}</button>)}</div>
              <p className="mt-2 text-sm text-forest-700">The first name is shared. Anything you leave blank uses our wording.</p>
            </div>}
            <p className="mb-5 rounded-xl border border-forest-600/20 bg-forest-100/70 p-3 text-sm leading-relaxed text-forest-800">🔒 <strong>Our parent privacy promise:</strong> First names only. Please leave out surnames, photos, birthdays, contact details and home addresses.</p>
            <div className="space-y-4">
              <div><label htmlFor="childNameInput" className="mb-1.5 block text-sm font-semibold text-forest-900">Child’s first name</label><input id="childNameInput" name="recipientName" required autoComplete="off" maxLength={KIDS_LIMITS.recipientName} value={data.recipientName} onChange={e => setData({ ...data, recipientName: e.target.value })} placeholder="e.g. Leo, Maya, Oliver…" aria-describedby="childNameHint" className="kids-input" /><p id="childNameHint" className="mt-1.5 text-sm text-forest-700">First name only, please. No surnames, birthdays or addresses.</p></div>
              <div><label htmlFor="extraFieldInput" className="mb-1.5 block text-sm font-semibold text-forest-900">{config.extraLabel}</label><input id="extraFieldInput" name="extraDetail" autoComplete="off" maxLength={KIDS_LIMITS.extraDetail} value={data.extraDetail} onChange={e => setData({ ...data, extraDetail: e.target.value })} className="kids-input" /></div>
              <div><div className="mb-1.5 flex justify-between gap-3 text-sm"><label htmlFor="customMessageInput" className="font-semibold text-forest-900">Your personal message</label><span className="text-forest-700">{data.customMessage.length} / {KIDS_LIMITS.customMessage}</span></div><textarea id="customMessageInput" name="customMessage" rows={4} maxLength={KIDS_LIMITS.customMessage} value={data.customMessage} onChange={e => setData({ ...data, customMessage: e.target.value })} className="kids-input resize-y" /><div className="mt-2 flex flex-wrap gap-1.5">{config.chips.map(chip => <button type="button" key={chip} onClick={() => setData({ ...data, customMessage: chip })} className="rounded-lg border border-parchment-300 bg-parchment-100 px-2.5 py-1.5 text-left text-sm text-forest-800 hover:bg-parchment-200">+ “{chip}”</button>)}</div></div>
              <fieldset className="border-t border-parchment-200 pt-4"><legend className="mb-2 text-sm font-bold uppercase tracking-wider text-forest-700">3. Choose your package</legend><div className="space-y-2.5">
                <label className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-3 ${data.packageType === "single" ? "border-forest-800 bg-forest-100/50" : "border-parchment-300"}`}><input type="radio" name="packageOption" value="single" checked={data.packageType === "single"} onChange={() => setPackage("single")} /><span className="min-w-0 flex-1"><strong className="block text-sm text-forest-900">Single: {KIDS_SCENES[primary].shortTitle}</strong><span className="text-sm text-forest-700">Instant link + 1 real tree</span></span><strong className="font-serif text-xl text-forest-900">£{KIDS_SCENES[primary].price}</strong></label>
                <label className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-3 ${data.packageType === "bundle" ? "border-forest-800 bg-forest-100/50" : "border-parchment-300"}`}><input type="radio" name="packageOption" value="bundle" checked={data.packageType === "bundle"} onChange={() => setPackage("bundle")} /><span className="min-w-0 flex-1"><strong className="block text-sm text-forest-950">🌟 Complete Kids Magical Bundle</strong><span className="mt-1 block text-sm leading-relaxed text-forest-700">Santa Scroll + Nice List + 24-Day Advent + Tooth Fairy Receipt + 1 tree{primary === "party" ? ` + ${KIDS_SCENES[primary].shortTitle}` : ""}</span></span><span className="shrink-0 text-right"><span className="block text-sm text-forest-700 line-through">£{kidsBundleValue(primary)}</span><strong className="font-serif text-xl text-forest-900">£{KIDS_BUNDLE_PRICE}</strong></span></label>
              </div></fieldset>
              {salesOpen ? (<>
                <label htmlFor="supplyConsent" className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-forest-800">
                  <input id="supplyConsent" type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} className="mt-0.5 h-5 w-5 shrink-0" />
                  <span>{IMMEDIATE_SUPPLY_CONSENT}</span>
                </label>
                <button type="submit" disabled={busy} className="flex w-full items-center justify-between gap-2 rounded-2xl bg-forest-900 px-4 py-3.5 font-semibold text-white shadow-lg transition hover:bg-forest-800 disabled:cursor-wait disabled:opacity-60"><span>{busy ? "Opening secure checkout…" : "🌲 Continue to Checkout"}</span><span className="shrink-0 rounded-xl bg-amber-400 px-3 py-1 text-sm font-bold text-forest-950">£{price} · {data.packageType === "bundle" ? "Bundle" : "Single"}</span></button>
              </>) : (
                <div role="status" className="rounded-2xl border border-amber-400/60 bg-amber-50 p-4 text-forest-900">
                  <p className="font-serif text-lg font-bold">Opening soon ✨</p>
                  <p className="mt-1 text-sm">{CHECKOUT_CLOSED_MESSAGE}</p>
                </div>
              )}
              {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p>}
              {includedScenes.includes("advent") && <p className="text-sm leading-relaxed text-forest-700">🏘️ The Advent Village link works straight away. A new door opens at midnight (UK time) each day from 1 to 24 December.</p>}
              <p className="text-sm leading-relaxed text-forest-700">This is a watermarked preview. After payment you get a private link to the full creation to share with them. The link stays open for {CARD_LINK_MONTHS} months, then the name and messages are deleted.</p>
            </div>
          </form>}
        </div>
        <p aria-live="polite" role="status" className={`mt-5 text-sm font-medium text-forest-800 ${feedback ? "rounded-xl border border-forest-600/20 bg-forest-100 p-3" : ""}`}>{feedback}</p>
        </div>
      </main>

      {showPrint && <PrintableSquishy recipientName={displayData.recipientName} preview={!recipientOnly} customDesign={workshop} />}

      {!preview && <>
        <section id="bundles" className="no-print kids-studio-pricing scroll-mt-20 px-5 py-14 sm:px-8 sm:py-16"><div className="mx-auto max-w-7xl"><div className="mx-auto mb-8 max-w-2xl text-center"><p className="text-sm font-bold uppercase tracking-widest text-forest-700">Simple pricing · A real tree with every order</p><h2 className="mt-2 font-serif text-3xl font-bold text-forest-900">Little moments. A whole lot of magic.</h2></div><div className="mx-auto grid max-w-4xl gap-5 md:grid-cols-2">{[{ title: "A single magical moment", price: "From £5", text: "Choose a Santa letter, advent story, Tooth Fairy receipt or birthday invite. Personalised with their name and your message.", action: "Choose a creation", bundle: false }, { title: "Complete Kids Magical Bundle", price: "£12", text: `Santa’s scroll and Nice List certificate, the 24-chapter advent story and a Tooth Fairy receipt for when the next tooth wobbles out, plus 1 real tree. Buy separately for £${kidsBundleValue("santa")}.`, action: "Personalise the bundle", bundle: true }].map(item => <div key={item.title} className={`flex flex-col rounded-3xl border p-6 ${item.bundle ? "border-forest-800 bg-forest-900 text-parchment-50 shadow-xl" : "border-parchment-300 bg-white text-forest-900"}`}><h3 className="font-serif text-xl font-bold">{item.title}</h3><p className="mt-4 font-serif text-4xl font-bold">{item.price}</p><p className="mt-4 flex-1 text-sm leading-relaxed opacity-85">{item.text}</p><a href="#studio" onClick={() => setPackage(item.bundle ? "bundle" : "single")} className={`mt-6 rounded-xl px-4 py-3 text-center text-sm font-semibold ${item.bundle ? "bg-amber-400 text-forest-950" : "bg-forest-100 text-forest-900"}`}>{item.action} →</a></div>)}</div></div></section>
        <section id="privacy-trust" className="no-print border-t border-parchment-300 bg-parchment-50 px-5 py-12 text-forest-900"><div className="mx-auto max-w-4xl text-center"><p className="text-sm font-bold uppercase tracking-widest text-forest-700">Made for children. Purchased by grown-ups.</p><h2 className="mt-2 font-serif text-3xl font-bold">A little wonder, with peace of mind.</h2><div className="mt-8 grid gap-6 text-sm leading-relaxed sm:grid-cols-3"><div><h3 className="font-bold">🔒 First names only</h3><p className="mt-2 text-forest-700">No child accounts, photographs or contact details. Keep personal messages free of sensitive information.</p></div><div><h3 className="font-bold">🔗 Unlisted purchased links</h3><p className="mt-2 text-forest-700">Purchased creations use unique share tokens, stay out of search engines, and are never listed publicly.</p></div><div><h3 className="font-bold">🌱 A gift that grows</h3><p className="mt-2 text-forest-700">Every order supports a real tree through CardRoots’ existing tree planting programme.</p></div></div><p className="mt-7 text-sm text-forest-700">Read our <Link href="/privacy" className="underline">privacy policy</Link> and <Link href="/terms" className="underline">terms</Link>. Grown-ups should supervise cutting and crafting.</p></div></section>
      </>}
    </div>
  );
}
