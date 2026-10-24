"use client";

import Link from "next/link";
import { Caveat, Inter } from "next/font/google";
import { useState } from "react";
import { KIDS_BUNDLE_PRICE, KIDS_LIMITS, KIDS_SCENES, kidsIncludedScenes, kidsPrice, kidsSceneDetails, type KidsPersonalisation, type KidsScene, type KidsSceneDetails } from "../../lib/kids";
import KidsScenes from "./KidsScenes";
import PrintableSquishy from "./PrintableSquishy";
import "./kids.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-kids-inter", display: "swap" });
const caveat = Caveat({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-kids-caveat", display: "swap" });
const sceneKeys = Object.keys(KIDS_SCENES) as KidsScene[];
const defaults: KidsPersonalisation = { scene: "santa", recipientName: "Leo", extraDetail: KIDS_SCENES.santa.defaultExtra, customMessage: KIDS_SCENES.santa.defaultMessage, packageType: "bundle" };

async function copyText(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const field = document.createElement("textarea");
  field.value = text;
  field.style.position = "fixed";
  field.style.opacity = "0";
  document.body.appendChild(field);
  field.select();
  const copied = document.execCommand("copy");
  field.remove();
  if (!copied) throw new Error("Clipboard unavailable");
}

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

export default function KidsStudio({ initialData, recipientOnly = false }: { initialData?: KidsPersonalisation; recipientOnly?: boolean }) {
  const start = initialData || defaults;
  const [data, setData] = useState<KidsPersonalisation>(start);
  // The experience being bought; `data.scene` is the one on screen, which in a bundle can be another included one.
  const [primary, setPrimary] = useState<KidsScene>(start.scene);
  // Wording kept per experience, so switching tabs never loses what was typed.
  const [drafts, setDrafts] = useState(() => Object.fromEntries(sceneKeys.map(scene => [scene, kidsSceneDetails(start, scene)])) as Record<KidsScene, KidsSceneDetails>);
  const [preview, setPreview] = useState(recipientOnly);
  const [replay, setReplay] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const config = KIDS_SCENES[data.scene];
  const price = kidsPrice({ scene: primary, packageType: data.packageType });
  const displayData = { ...data, recipientName: data.recipientName.trim() || "Leo", extraDetail: data.extraDetail.trim() || config.defaultExtra, customMessage: data.customMessage.trim() || config.defaultMessage };
  const includedScenes = kidsIncludedScenes({ scene: primary, packageType: data.packageType });
  const selectableScenes = recipientOnly ? includedScenes : sceneKeys;
  const showPrint = data.scene === "squishy" || data.packageType === "bundle";
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
    setBusy(true);
    try {
      const response = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(checkoutBody()) });
      const result = await response.json();
      if (!response.ok || !result.url) throw new Error(result.error || "We couldn’t start checkout. Please try again.");
      window.location.assign(result.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "We couldn’t start checkout. Please try again.");
      setBusy(false);
    }
  };

  const rsvp = async (attending: boolean) => {
    const text = attending ? `We’d love to come to ${displayData.recipientName}’s party!` : `Thank you for inviting us to ${displayData.recipientName}’s party. We’re sorry we can’t make it.`;
    try { await copyText(text); setFeedback("RSVP copied — send it to the party organiser to let them know."); }
    catch { setFeedback(text + " Please send this reply to the party organiser."); }
  };

  return (
    <div className={`kids-studio ${inter.variable} ${caveat.variable}`}>
      {!preview && <>
        <div className="no-print border-b border-forest-800 bg-forest-950 px-4 py-2 text-center text-xs text-parchment-100">🌲 Every order plants a real tree <span className="mx-2">·</span> Instant personalised links <span className="mx-2">·</span> <a href="#bundles" className="font-semibold text-amber-300">Christmas Kids Bundle £12 — save £9</a></div>
        <section id="top" className="no-print relative overflow-hidden border-b border-forest-800 bg-gradient-to-b from-forest-900 via-forest-800 to-forest-900 px-5 py-12 text-parchment-50 sm:px-8 sm:py-16">
          <div className="mx-auto max-w-7xl">
            <p className="mb-4 inline-flex rounded-full border border-forest-600/50 bg-forest-950/60 px-4 py-1.5 text-xs font-semibold text-amber-300">🎅 CardRoots For Kids · A little wonder, made just for them</p>
            <h1 className="max-w-3xl font-serif text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">Magical moments with their name written right into the scene.</h1>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-parchment-200 sm:text-lg">From official North Pole scrolls and 24-day digital advent villages to printable paper squishies. Personalise an animated experience, share a little magic, and plant a real tree.</p>
            <div className="mt-6 flex flex-wrap gap-2 text-xs sm:text-sm">{["⚡ Instant shareable link", "🌱 Every order plants a tree", "🔒 First names only, no photos", "✂️ Printable paper squishy kits"].map(text => <span key={text} className="rounded-xl border border-forest-700 bg-forest-950/50 px-3 py-2">{text}</span>)}</div>
            <nav aria-label="Kids studio sections" className="mt-7 flex flex-wrap gap-5 text-sm font-semibold text-amber-200"><a href="#studio" className="hover:underline">Personalise a creation ↓</a><a href="#squishy-crafts" className="hover:underline" onClick={() => { if (!showPrint) selectScene("squishy"); }}>Paper squishy kits</a><a href="#privacy-trust" className="hover:underline">Our parent promise</a></nav>
          </div>
        </section>
      </>}

      <main id="studio" className="no-print mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div><p className="text-xs font-bold uppercase tracking-wider text-forest-700">{preview ? "A little magic, just for you" : "The CardRoots Kids Studio"}</p>{preview ? <h1 className="mt-1 font-serif text-2xl font-bold text-forest-900">Made specially for {displayData.recipientName}</h1> : <h2 className="mt-1 font-serif text-2xl font-bold text-forest-900">1. Choose their magical experience</h2>}</div>
          {!recipientOnly && <button type="button" onClick={() => { setPreview(!preview); setFeedback(""); }} className="rounded-xl border border-forest-800 px-4 py-2 text-sm font-semibold text-forest-900 hover:bg-forest-100">{preview ? "← Back to personalising" : "👁 Recipient View"}</button>}
        </div>

        {(!preview || (recipientOnly && data.packageType === "bundle")) && <div role="group" aria-label="Choose a kids experience" id="sceneTabs" className="mb-7 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
          {selectableScenes.map(scene => { const item = KIDS_SCENES[scene]; return <button key={scene} id={`tab-${scene}`} type="button" aria-pressed={(recipientOnly ? data.scene : primary) === scene} onClick={() => selectScene(scene)} className={`scene-tab rounded-2xl border-2 p-3.5 text-left transition ${(recipientOnly ? data.scene : primary) === scene ? "border-forest-900 bg-forest-900 text-white shadow-md" : "border-parchment-300 bg-white text-forest-900 hover:bg-parchment-50"}`}><span className="flex items-center justify-between gap-2"><span className="text-2xl" aria-hidden>{item.icon}</span>{!recipientOnly && <span className="rounded-full bg-amber-300 px-2 py-0.5 text-xs font-bold text-forest-950">£{item.price}</span>}</span><span className="mt-2 block font-serif text-sm font-bold">{item.shortTitle}</span><span className="mt-1 block text-[11px] opacity-80">{item.description}</span></button>; })}
        </div>}

        <div className={`grid items-start gap-8 ${preview ? "mx-auto max-w-3xl" : "lg:grid-cols-12"}`}>
          <div id="stageColumn" className={preview ? "min-w-0" : "min-w-0 lg:col-span-7"}>
            <div className="relative overflow-hidden rounded-3xl border border-forest-800 bg-forest-950 p-3 shadow-2xl sm:p-5">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-parchment-200"><span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />{preview ? "Your personalised creation" : "Live interactive preview · Updates as you type"}</span><button type="button" onClick={() => setReplay(value => value + 1)} className="rounded-full bg-forest-800 px-3 py-1.5 font-semibold text-amber-300 hover:bg-forest-700">↻ Replay animation</button></div>
              <div id="sceneViewport" className="relative flex min-h-[480px] flex-col justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-[#0b1f17] via-[#133326] to-[#0a1912] p-4 sm:min-h-[540px] sm:p-7">
                <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-75" aria-hidden>{Array.from({ length: 18 }, (_, i) => <span key={i} className="animate-twinkle absolute select-none text-amber-200/60" style={{ left: `${i * 19 % 96}%`, top: `${i * 29 % 92}%`, animationDelay: `${i * .35}s`, fontSize: `${10 + i % 8}px` }}>{["✨", "❄️", "⭐", "•"][i % 4]}</span>)}</div>
                <KidsScenes key={`${data.scene}-${preview}-${replay}`} {...displayData} recipientOnly={recipientOnly} onRsvp={rsvp} />
                {!recipientOnly && <PreviewWatermark />}
              </div>
            </div>
          </div>

          {!preview && <form onSubmit={checkout} id="controlsColumn" className="min-w-0 rounded-3xl border border-parchment-300 bg-white p-5 shadow-xl sm:p-7 lg:col-span-5">
            <div className="mb-5 flex items-center justify-between gap-3 border-b border-parchment-200 pb-4"><div><p className="text-xs font-bold uppercase tracking-wider text-forest-700">2. Make it theirs</p><h3 className="mt-1 font-serif text-xl font-bold text-forest-900">{config.title}</h3></div><div className="shrink-0 text-right"><span className="font-serif text-2xl font-bold text-forest-900">£{price}</span><span className="block text-[11px] text-forest-600">{data.packageType === "bundle" ? "Bundle · " : ""}Includes 1 tree 🌱</span></div></div>
            {bundleEditing && <div className="mb-5 rounded-xl border border-amber-400/50 bg-amber-50 p-3">
              <p className="text-xs font-semibold text-forest-900">Your bundle includes {includedScenes.length} experiences. Personalise each one:</p>
              <div role="group" aria-label="Personalise each bundle experience" className="mt-2 flex flex-wrap gap-1.5">{includedScenes.map(scene => <button key={scene} type="button" aria-pressed={data.scene === scene} onClick={() => viewScene(scene)} className={`rounded-lg border px-2.5 py-1.5 text-xs font-semibold ${data.scene === scene ? "border-forest-900 bg-forest-900 text-white" : "border-parchment-300 bg-white text-forest-900 hover:bg-parchment-100"}`}><span aria-hidden>{KIDS_SCENES[scene].icon} </span>{KIDS_SCENES[scene].shortTitle}</button>)}</div>
              <p className="mt-2 text-[11px] text-forest-700">The first name is shared. Anything you leave blank uses our wording.</p>
            </div>}
            <p className="mb-5 rounded-xl border border-forest-600/20 bg-forest-100/70 p-3 text-xs leading-relaxed text-forest-800">🔒 <strong>Our parent privacy promise:</strong> First names only. Please leave out surnames, photos, birthdays, contact details and home addresses.</p>
            <div className="space-y-4">
              <div><label htmlFor="childNameInput" className="mb-1.5 block text-xs font-semibold text-forest-900">Child’s first name</label><input id="childNameInput" name="recipientName" required autoComplete="off" maxLength={KIDS_LIMITS.recipientName} value={data.recipientName} onChange={e => setData({ ...data, recipientName: e.target.value })} placeholder="e.g. Leo, Maya, Oliver…" className="kids-input" /></div>
              <div><label htmlFor="extraFieldInput" className="mb-1.5 block text-xs font-semibold text-forest-900">{config.extraLabel}</label><input id="extraFieldInput" name="extraDetail" autoComplete="off" maxLength={KIDS_LIMITS.extraDetail} value={data.extraDetail} onChange={e => setData({ ...data, extraDetail: e.target.value })} className="kids-input" /></div>
              <div><div className="mb-1.5 flex justify-between gap-3 text-xs"><label htmlFor="customMessageInput" className="font-semibold text-forest-900">Your personal message</label><span className="text-forest-700">{data.customMessage.length} / {KIDS_LIMITS.customMessage}</span></div><textarea id="customMessageInput" name="customMessage" rows={4} maxLength={KIDS_LIMITS.customMessage} value={data.customMessage} onChange={e => setData({ ...data, customMessage: e.target.value })} className="kids-input resize-y" /><div className="mt-2 flex flex-wrap gap-1.5">{config.chips.map(chip => <button type="button" key={chip} onClick={() => setData({ ...data, customMessage: chip })} className="rounded-lg border border-parchment-300 bg-parchment-100 px-2.5 py-1.5 text-left text-[11px] text-forest-800 hover:bg-parchment-200">+ “{chip}”</button>)}</div></div>
              <fieldset className="border-t border-parchment-200 pt-4"><legend className="mb-2 text-xs font-bold uppercase tracking-wider text-forest-700">3. Choose your package</legend><div className="space-y-2.5">
                <label className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-3 ${data.packageType === "single" ? "border-forest-800 bg-forest-100/50" : "border-parchment-300"}`}><input type="radio" name="packageOption" value="single" checked={data.packageType === "single"} onChange={() => setPackage("single")} /><span className="min-w-0 flex-1"><strong className="block text-sm text-forest-900">Single: {KIDS_SCENES[primary].shortTitle}</strong><span className="text-xs text-forest-700">Instant link + 1 real tree</span></span><strong className="font-serif text-xl text-forest-900">£{KIDS_SCENES[primary].price}</strong></label>
                <label className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-3 ${data.packageType === "bundle" ? "border-forest-800 bg-forest-100/50" : "border-parchment-300"}`}><input type="radio" name="packageOption" value="bundle" checked={data.packageType === "bundle"} onChange={() => setPackage("bundle")} /><span className="min-w-0 flex-1"><strong className="block text-sm text-forest-950">🌟 Complete Kids Magical Bundle</strong><span className="mt-1 block text-xs leading-relaxed text-forest-700">Santa Scroll + Nice List + 24-Day Advent + Paper Squishy Kit + 1 tree{primary === "tooth" || primary === "party" ? ` + ${KIDS_SCENES[primary].shortTitle}` : ""}</span></span><span className="shrink-0 text-right"><span className="block text-xs text-forest-600 line-through">£21</span><strong className="font-serif text-xl text-forest-900">£{KIDS_BUNDLE_PRICE}</strong></span></label>
              </div></fieldset>
              <button type="submit" disabled={busy} className="flex w-full items-center justify-between gap-2 rounded-2xl bg-forest-900 px-4 py-3.5 font-semibold text-white shadow-lg transition hover:bg-forest-800 disabled:cursor-wait disabled:opacity-60"><span>{busy ? "Opening secure checkout…" : "🌲 Continue to Checkout"}</span><span className="shrink-0 rounded-xl bg-amber-400 px-3 py-1 text-sm font-bold text-forest-950">£{price} · {data.packageType === "bundle" ? "Bundle" : "Single"}</span></button>
              {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p>}
              {includedScenes.includes("advent") && new Date().getMonth() !== 11 && <p className="text-[11px] leading-relaxed text-forest-700">🏘️ The Advent Village link works straight away, and its first door opens on 1 December.</p>}
              <p className="text-[11px] leading-relaxed text-forest-700">This is a watermarked preview. After payment you get a private link to the full creation to share with them.</p>
            </div>
          </form>}
        </div>
        <p aria-live="polite" role="status" className={`mt-5 text-sm font-medium text-forest-800 ${feedback ? "rounded-xl border border-forest-600/20 bg-forest-100 p-3" : ""}`}>{feedback}</p>
      </main>

      {showPrint && <PrintableSquishy recipientName={displayData.recipientName} preview={!recipientOnly} />}

      {!preview && <>
        <section id="bundles" className="no-print mx-auto max-w-7xl px-5 py-12 sm:px-8"><div className="mx-auto mb-8 max-w-2xl text-center"><p className="text-xs font-bold uppercase tracking-widest text-forest-700">Simple pricing · A real tree with every order</p><h2 className="mt-2 font-serif text-3xl font-bold text-forest-900">Little moments. A whole lot of magic.</h2></div><div className="grid gap-5 md:grid-cols-3">{[{ title: "A single magical moment", price: "From £5", text: "Choose a Santa letter, Tooth Fairy receipt, squishy kit, advent village or birthday invite. Personalised with their name and your message.", action: "Choose a creation", bundle: false }, { title: "Complete Kids Magical Bundle", price: "£12", text: "Santa’s scroll and Nice List certificate, 24 days of advent surprises, and a printable squishy kit. Buy separately for £21.", action: "Personalise the bundle", bundle: true }, { title: "Made by little hands", price: "£6", text: "An animated greeting and a personalised printable kit: six squishy characters and an Official Squishy Maker certificate. Print in full colour or as outlines to colour in.", action: "Make a paper squishy", bundle: false, squishy: true }].map(item => <div key={item.title} className={`flex flex-col rounded-3xl border p-6 ${item.bundle ? "border-forest-800 bg-forest-900 text-parchment-50 shadow-xl" : "border-parchment-300 bg-white text-forest-900"}`}><h3 className="font-serif text-xl font-bold">{item.title}</h3><p className="mt-4 font-serif text-4xl font-bold">{item.price}</p><p className="mt-4 flex-1 text-sm leading-relaxed opacity-85">{item.text}</p><a href="#studio" onClick={() => { if (item.squishy) selectScene("squishy"); setPackage(item.bundle ? "bundle" : "single"); }} className={`mt-6 rounded-xl px-4 py-3 text-center text-sm font-semibold ${item.bundle ? "bg-amber-400 text-forest-950" : "bg-forest-100 text-forest-900"}`}>{item.action} →</a></div>)}</div></section>
        <section id="privacy-trust" className="no-print border-t border-parchment-300 bg-parchment-50 px-5 py-12 text-forest-900"><div className="mx-auto max-w-4xl text-center"><p className="text-xs font-bold uppercase tracking-widest text-forest-700">Made for children. Purchased by grown-ups.</p><h2 className="mt-2 font-serif text-3xl font-bold">A little wonder, with peace of mind.</h2><div className="mt-8 grid gap-6 text-sm leading-relaxed sm:grid-cols-3"><div><h3 className="font-bold">🔒 First names only</h3><p className="mt-2 text-forest-700">No child accounts, photographs or contact details. Keep personal messages free of sensitive information.</p></div><div><h3 className="font-bold">🔗 Unlisted purchased links</h3><p className="mt-2 text-forest-700">Purchased creations use unique share tokens, stay out of search engines, and are never listed publicly.</p></div><div><h3 className="font-bold">🌱 A gift that grows</h3><p className="mt-2 text-forest-700">Every order supports a real tree through CardRoots’ existing tree planting programme.</p></div></div><p className="mt-7 text-xs text-forest-700">Read our <Link href="/privacy" className="underline">privacy policy</Link> and <Link href="/terms" className="underline">terms</Link>. Grown-ups should supervise cutting and crafting.</p></div></section>
      </>}
    </div>
  );
}
