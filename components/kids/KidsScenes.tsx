"use client";

import { useState } from "react";
import type { KidsPersonalisation } from "../../lib/kids";
import AdventVillage from "./AdventVillage";
import SquishyWorkshop from "./SquishyWorkshop";
import type { WorkshopDesign } from "./workshopDesign";

export default function KidsScenes({ scene, recipientName, extraDetail, customMessage, recipientOnly = false, onRsvp, workshop, onWorkshop }: KidsPersonalisation & { recipientOnly?: boolean; onRsvp: (attending: boolean) => void; workshop?: WorkshopDesign | null; onWorkshop?: (design: WorkshopDesign) => void }) {
  const [santaView, setSantaView] = useState<"letter" | "cert">("letter");
  return <>
    {scene === "santa" && (<div id="scene-santa" className="scene-panel relative z-10 flex flex-col h-full justify-between">
              
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="inline-flex items-center gap-1.5 bg-amber-400/20 border border-amber-300/40 text-amber-200 text-xs px-3 py-1 rounded-full">
                  <span>🦌</span>
                  <span>North Pole Royal Mail · Express Reindeer Post</span>
                </div>
                <div className="inline-flex bg-forest-900/90 p-1 rounded-xl border border-forest-700 text-xs">
                  <button onClick={() => setSantaView("letter")} aria-pressed={santaView === "letter"} id="santaBtnLetter" className="px-2.5 py-1 rounded-lg bg-amber-400 text-forest-950 font-bold transition">📜 Letter</button>
                  <button onClick={() => setSantaView("cert")} aria-pressed={santaView === "cert"} id="santaBtnCert" className="px-2.5 py-1 rounded-lg text-parchment-200 hover:text-white transition">🏅 Nice List Cert</button>
                </div>
              </div>

              
              <div id="santaScrollCard" className="animate-unroll bg-gradient-to-b from-parchment-50 via-parchment-100 to-parchment-200 text-forest-950 rounded-2xl p-5 sm:p-7 shadow-2xl border-4 border-amber-600/40 relative">
                
                <div className="h-3 -mt-7 -mx-6 mb-5 bg-gradient-to-r from-amber-900 via-amber-700 to-amber-900 rounded-full shadow-md"></div>

                
                <div id="santaLetterContent" hidden={santaView !== "letter"}>
                  <div className="flex items-start justify-between gap-4 border-b border-amber-800/20 pb-3">
                    <div>
                      <p className="text-[11px] uppercase tracking-widest text-berry-700 font-bold">From the Desk of Father Christmas</p>
                      <h3 className="font-serif text-2xl sm:text-3xl font-bold text-forest-900 mt-0.5">
                        Dear <span className="text-berry-600 underline decoration-amber-500/60 decoration-wavy" data-bind="name">{recipientName}</span>,
                      </h3>
                    </div>
                    
                    <div className="animate-stamp shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-berry-600 to-red-900 text-amber-200 flex flex-col items-center justify-center shadow-lg border-2 border-amber-300/60 text-center leading-none select-none">
                      <span className="text-[9px] uppercase tracking-tighter font-bold">Official</span>
                      <span className="text-lg">🎅</span>
                      <span className="text-[8px] uppercase font-bold">Nice List</span>
                    </div>
                  </div>

                  
                  <div className="my-4 bg-amber-500/15 border border-amber-700/30 rounded-xl p-3 flex items-center gap-3">
                    <span className="text-2xl shrink-0">🧝‍♂️</span>
                    <div className="text-xs sm:text-sm">
                      <span className="font-bold text-forest-900">Elves’ Workshop Report:</span>
                      <span className="text-forest-800"> Bernard the Head Elf told me all about </span>
                      <span className="font-semibold text-berry-700 underline" data-bind="extra">{extraDetail}</span>!
                    </div>
                  </div>

                  
                  <p className="font-hand text-xl sm:text-2xl text-forest-900 leading-snug my-4 min-h-[72px]" data-bind="message">{customMessage}</p>

                  <div className="flex items-center justify-between pt-3 border-t border-amber-800/20 text-xs text-forest-800">
                    <div>
                      <p className="font-bold">With festive magic,</p>
                      <p className="font-hand text-2xl text-berry-700 -mt-1">Father Christmas 🎄</p>
                    </div>
                    <div className="text-right bg-forest-900/10 px-3 py-1.5 rounded-xl">
                      <p className="font-bold text-forest-900">🌱 Every order plants a tree</p>
                      <p className="text-[11px]">For <span data-bind="name">{recipientName}</span> via CardRoots</p>
                    </div>
                  </div>
                </div>

                
                <div id="santaCertContent" hidden={santaView !== "cert"} className="text-center py-3">
                  <div className="border-2 border-dashed border-amber-700/50 rounded-xl p-4 sm:p-6">
                    <p className="text-xs uppercase tracking-widest text-berry-700 font-bold">North Pole Official Registry</p>
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-forest-900 mt-1">Official Nice List Certificate</h3>
                    <p className="text-xs text-forest-700 mt-2">This certifies that</p>
                    <div className="font-serif text-3xl sm:text-4xl font-bold text-berry-600 my-2" data-bind="name">{recipientName}</div>
                    <p className="text-xs sm:text-sm text-forest-800 max-w-md mx-auto">
                      has been officially verified by the High Council of Elves for <span className="font-bold text-forest-950" data-bind="extra">{extraDetail}</span>.
                    </p>
                    <div className="mt-4 inline-flex items-center gap-4 text-xs bg-amber-500/20 px-4 py-2 rounded-full font-bold text-forest-900">
                      <span>⭐ Status: Approved</span>
                      <span>•</span>
                      <span>🌲 A little magic for the planet</span>
                    </div>
                  </div>
                </div>

                <div className="h-3 -mb-7 -mx-6 mt-5 bg-gradient-to-r from-amber-900 via-amber-700 to-amber-900 rounded-full shadow-md"></div>
              </div>

              
              <div className="mt-3 text-center text-xs text-parchment-200/80">
                💡 Tip: Click <span className="text-amber-300 font-semibold">“🏅 Nice List Cert”</span> at the top right of the scene to preview both included views!
              </div>
            </div>)}

    {scene === "advent" && <AdventVillage recipientName={recipientName} extraDetail={extraDetail} customMessage={customMessage} recipientOnly={recipientOnly} />}
    {scene === "squishy" && (<div id="scene-squishy" className="scene-panel relative z-10 flex flex-col h-full justify-between gap-3">
              <SquishyWorkshop recipientName={recipientName} extraDetail={extraDetail} customMessage={customMessage} design={workshop ?? null} onDesign={design => onWorkshop?.(design)} />
              <a href="#squishy-crafts" className="self-center rounded-xl bg-amber-400 px-4 py-2 text-xs font-bold text-forest-950 shadow transition hover:bg-amber-300">🖨️ See the whole printable kit ↓</a>
            </div>)}
    {scene === "tooth" && (<div id="scene-tooth" className="scene-panel relative z-10 flex flex-col h-full justify-between">
              <div className="flex items-center justify-between text-xs text-amber-200 mb-3">
                <span className="bg-indigo-950/90 border border-indigo-400/40 px-3 py-1 rounded-full">✨ Midnight Stardust Department</span>
                <span className="font-mono bg-amber-400/20 px-2.5 py-1 rounded-lg text-amber-300">GRADE: A+ SPARKLE</span>
              </div>

              <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-forest-950 text-white rounded-2xl p-6 border-2 border-amber-300/50 shadow-2xl relative overflow-hidden my-auto">
                <div className="flex items-start justify-between gap-4 border-b border-indigo-400/30 pb-4">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-amber-300 font-bold">Official Tooth Fairy Receipt</p>
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold mt-1">
                      Collected from <span className="text-amber-300" data-bind="name">{recipientName}</span>
                    </h3>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-amber-400/20 border border-amber-300 flex items-center justify-center text-3xl animate-float">
                    🦷
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 my-4 text-xs">
                  <div className="bg-white/10 p-3 rounded-xl">
                    <span className="text-indigo-200 block">Inspection Report:</span>
                    <span className="font-bold text-amber-300 text-sm" data-bind="extra">{extraDetail}</span>
                  </div>
                  <div className="bg-white/10 p-3 rounded-xl">
                    <span className="text-indigo-200 block">Stardust Exchange:</span>
                    <span className="font-bold text-emerald-300 text-sm">A little magic for the planet 🌱</span>
                  </div>
                </div>

                <p className="font-hand text-2xl text-amber-100 leading-snug my-3" data-bind="message">{customMessage}</p>

                <div className="text-right text-xs text-indigo-200 pt-2 border-t border-indigo-400/20">
                  Signed with wings & stardust · <span className="text-amber-300 font-bold">Queen Celeste, Tooth Fairy 🧚‍♀️</span>
                </div>
              </div>
            </div>)}
    {scene === "party" && (<div id="scene-party" className="scene-panel relative z-10 flex flex-col h-full justify-between">
              <div className="bg-gradient-to-br from-amber-50 via-parchment-100 to-rose-50 text-forest-950 rounded-2xl p-6 border-4 border-amber-400 shadow-2xl my-auto">
                <div className="flex items-center justify-between">
                  <span className="bg-berry-600 text-white text-xs font-bold px-3 py-1 rounded-full">🎉 You’re Invited!</span>
                  <span className="text-xs font-semibold text-forest-700">🌱 Every order plants a tree</span>
                </div>

                <div className="text-center my-5">
                  <div className="text-4xl mb-2 animate-bounce">🎈🎂🎈</div>
                  <h3 className="font-serif text-3xl sm:text-4xl font-bold text-forest-900">
                    <span className="text-berry-600" data-bind="name">{recipientName}</span>’s Birthday Party!
                  </h3>
                  <p className="mt-2 inline-block bg-amber-300/50 border border-amber-500/40 px-4 py-1 rounded-full text-xs sm:text-sm font-bold text-forest-900" data-bind="extra">{extraDetail}</p>
                  <p className="font-hand text-2xl text-forest-800 mt-4 max-w-md mx-auto" data-bind="message">{customMessage}</p>
                </div>

                
                <div className="bg-white p-3.5 rounded-xl border border-parchment-300 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <span id="rsvpStatusText" className="text-xs font-semibold text-forest-800">
                    📬 Choose a reply to copy and send to the organiser:
                  </span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => onRsvp(true)} className="bg-forest-800 hover:bg-forest-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition">
                      ✅ Can’t Wait!
                    </button>
                    <button onClick={() => onRsvp(false)} className="bg-parchment-200 hover:bg-parchment-300 text-forest-900 text-xs font-semibold px-3 py-2 rounded-xl transition">
                      Can’t Make It
                    </button>
                  </div>
                </div>
              </div>
            </div>)}
  </>;
}
