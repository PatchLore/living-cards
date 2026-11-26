"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import type { KidsPersonalisation } from "../../lib/kids";
import { FitText, PrintSheet } from "./craft";
import { NiceListCertificate, SantaLetter, ToothFairyReceipt } from "./keepsakes";
import PartyRsvp from "./PartyRsvp";

import type { WorkshopDesign } from "./workshopOptions";

// Loaded only when their scene is shown, so the other scenes stay light.
const AdventVillage = dynamic(() => import("./AdventVillage"));
const SquishyWorkshop = dynamic(() => import("./SquishyWorkshop"));

function PrintButton({ label }: { label: string }) {
  return (
    <button type="button" onClick={() => window.print()} className="min-h-[44px] rounded-xl bg-amber-400 px-5 text-sm font-bold text-forest-950 shadow transition hover:bg-amber-300">
      <span aria-hidden="true">🖨️ </span>{label}
    </button>
  );
}

export default function KidsScenes({ scene, recipientName, extraDetail, customMessage, recipientOnly = false, shareId, serverNow, workshop, onWorkshop }: KidsPersonalisation & { recipientOnly?: boolean; shareId?: string; serverNow?: number; workshop?: WorkshopDesign | null; onWorkshop?: (design: WorkshopDesign) => void }) {
  const keepsake = { recipientName, extraDetail, customMessage };
  const [santaView, setSantaView] = useState<"letter" | "cert">("letter");
  return <>
    {scene === "santa" && (<div id="scene-santa" className="scene-panel relative z-10 flex flex-col gap-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-amber-200"><span aria-hidden="true">🦌 </span>North Pole Reindeer Post</p>
                <div role="group" aria-label="Choose what to read" className="inline-flex rounded-xl border border-forest-700 bg-forest-900/90 p-1">
                  {(["letter", "cert"] as const).map(view => (
                    <button key={view} type="button" id={view === "letter" ? "santaBtnLetter" : "santaBtnCert"} onClick={() => setSantaView(view)} aria-pressed={santaView === view}
                      className={`min-h-[44px] rounded-lg px-4 text-sm font-bold transition ${santaView === view ? "bg-amber-400 text-forest-950" : "text-parchment-100 hover:text-white"}`}>
                      {view === "letter" ? "📜 Letter" : "🏅 Certificate"}
                    </button>
                  ))}
                </div>
              </div>
              <div key={santaView} className="animate-unroll">
                {santaView === "letter" ? <SantaLetter {...keepsake} /> : <NiceListCertificate {...keepsake} />}
              </div>
              {recipientOnly ? (
                <div className="flex justify-center"><PrintButton label="Print the certificate" /></div>
              ) : (
                <p className="text-center text-sm text-parchment-100">Includes the letter and the Nice List certificate. Switch between them above.</p>
              )}
              {recipientOnly && <PrintSheet label="Nice List certificate"><NiceListCertificate {...keepsake} /></PrintSheet>}
            </div>)}

    {scene === "advent" && <AdventVillage recipientName={recipientName} extraDetail={extraDetail} customMessage={customMessage} recipientOnly={recipientOnly} serverNow={serverNow} />}
    {scene === "squishy" && (<div id="scene-squishy" className="scene-panel relative z-10 flex flex-col h-full justify-between gap-3">
              <SquishyWorkshop recipientName={recipientName} extraDetail={extraDetail} customMessage={customMessage} design={workshop ?? null} onDesign={design => onWorkshop?.(design)} />
              <a href="#squishy-crafts" className="self-center rounded-xl bg-amber-400 px-4 py-2 text-xs font-bold text-forest-950 shadow transition hover:bg-amber-300">🖨️ See the whole printable kit ↓</a>
            </div>)}
    {scene === "tooth" && (<div id="scene-tooth" className="scene-panel relative z-10 flex flex-col gap-4">
              <div className="animate-unroll mx-auto w-full max-w-md"><ToothFairyReceipt {...keepsake} /></div>
              {recipientOnly && <div className="flex justify-center"><PrintButton label="Print the receipt" /></div>}
              {recipientOnly && <PrintSheet label="Tooth Fairy receipt"><ToothFairyReceipt {...keepsake} /></PrintSheet>}
            </div>)}
    {scene === "party" && (<div id="scene-party" className="scene-panel relative z-10 flex flex-col">
              <article className="kc-invite rounded-2xl border-4 border-amber-400 bg-gradient-to-br from-amber-50 via-parchment-100 to-rose-50 p-5 text-forest-950 shadow-2xl sm:p-7" aria-label={`Birthday party invitation for ${recipientName}`}>
                <svg aria-hidden="true" viewBox="0 0 300 26" preserveAspectRatio="none" className="-mx-1 -mt-2 mb-3 block h-6 w-[calc(100%+0.5rem)]">
                  <path d="M0 4 Q150 18 300 4" fill="none" stroke="#b8862f" strokeWidth="1.5" />
                  {Array.from({ length: 12 }, (_, i) => { const x = 6 + i * 24.5; const y = 4 + 14 * Math.sin((x / 300) * Math.PI) * 0.9; return <polygon key={i} points={`${x},${y} ${x + 18},${y + 0.6} ${x + 9},${y + 18}`} fill={["#bc4749", "#facc15", "#2d6a4f", "#5e60ce"][i % 4]} />; })}
                </svg>
                <p className="text-center"><span className="inline-block whitespace-nowrap rounded-full bg-berry-600 px-4 py-1.5 text-sm font-bold text-white">🎉 You’re invited!</span></p>
                <div className="kc-balloons mt-3 flex justify-center gap-3" aria-hidden="true">
                  {["#bc4749", "#facc15", "#5e60ce"].map((colour, i) => (
                    <svg key={colour} viewBox="0 0 40 64" className="h-14 w-9" style={{ animationDelay: `${i * 0.12}s` }}>
                      <path d="M20 46 C6 44 2 30 4 20 C6 8 14 2 20 2 C26 2 34 8 36 20 C38 30 34 44 20 46 Z" fill={colour} />
                      <path d="M17 46 L20 50 L23 46 Z" fill={colour} />
                      <path d="M20 50 C16 56 24 58 20 64" fill="none" stroke="#6b7280" strokeWidth="1.2" />
                      <ellipse cx="13" cy="16" rx="4" ry="7" fill="#ffffff" opacity=".35" />
                    </svg>
                  ))}
                </div>
                <h2 className="mt-3 text-center font-serif font-bold text-forest-900">
                  <FitText fitKey={recipientName} maxLines={2} className="kc-invite-title" style={{ ["--fit-size" as string]: "clamp(30px, 8vw, 44px)" }}><span className="text-berry-600">{recipientName}</span>’s Birthday Party!</FitText>
                </h2>
                <p className="mx-auto mt-3 w-fit max-w-full rounded-2xl border border-amber-500/50 bg-amber-200/60 px-4 py-2 text-center text-base font-bold text-forest-900"><span aria-hidden="true">📅 </span>{extraDetail}</p>
                <p className="mx-auto mt-4 max-w-md text-center font-hand text-2xl leading-snug text-forest-800">{customMessage}</p>
                <div className="mt-5"><PartyRsvp shareId={recipientOnly ? shareId : undefined} childName={recipientName} /></div>
              </article>
            </div>)}
  </>;
}
