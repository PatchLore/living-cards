"use client";

import { useEffect, useState } from "react";
import { createPortal, flushSync } from "react-dom";
import { SQUISHY_CHARACTERS, SquishyPortrait, SquishyTemplate, type SquishyCharacter } from "./squishyCharacters";
import { makeWorkshopCharacter, type WorkshopDesign } from "./workshopDesign";

export interface PrintableSquishyProps {
  recipientName: string;
  preview?: boolean;
  /** The child's own Squishy Workshop creature, printed first in the kit. */
  customDesign?: WorkshopDesign | null;
}

type PrintMode = "one" | "kit";
const STEPS = "1. Cut along the outer dashed line · 2. Fold down the middle line · 3. Tape the sides, leaving the top open · 4. Stuff with tissue and seal!";
/** Two templates fit on each A4 page, then the certificate gets its own. */
const kitPages = (count: number) => Math.ceil(count / 2) + 1;

function PreviewMarks({ count, spread }: { count: number; spread: number }) {
  return (
    <div aria-hidden className="kids-watermark kids-watermark--print pointer-events-none absolute inset-0 z-10 overflow-hidden">
      {Array.from({ length: count }, (_, i) => (
        <span key={i} style={{ top: `${(i % (count / 2)) * spread - 2}%`, left: `${i < count / 2 ? -5 : 48}%` }}>PREVIEW · CardRoots</span>
      ))}
    </div>
  );
}

function Certificate({ makerName, outline, characters }: { makerName: string; outline: boolean; characters: SquishyCharacter[] }) {
  return (
    <div className="squishy-certificate rounded-2xl border-4 border-double border-forest-800 bg-white p-6 text-center text-forest-900 sm:p-8">
      <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-berry-600">CardRoots Squishy Studio</p>
      <h3 className="kids-serif mt-2 text-3xl font-bold">Official Squishy Maker</h3>
      <p className="mt-3 text-sm">This certificate is proudly awarded to</p>
      <p className="kids-serif mt-1 break-words text-4xl font-bold text-berry-600">{makerName}</p>
      <p className="mx-auto mt-3 max-w-md text-sm">for cutting, folding, colouring and squishing with great care. Tick off each squishy friend once it’s made!</p>
      <ul className={`mx-auto mt-6 grid max-w-xl gap-4 ${characters.length > 6 ? "grid-cols-4" : "grid-cols-3"}`}>
        {characters.map(character => (
          <li key={character.id} className="flex flex-col items-center gap-1 text-[11px] font-semibold">
            <SquishyPortrait character={character} outline={outline} className="h-16 w-16" />
            <span>{character.name}</span>
            <span className="mt-0.5 inline-block h-5 w-5 rounded border-2 border-forest-800" aria-label="Tick box" />
          </li>
        ))}
      </ul>
      <div className="mx-auto mt-8 grid max-w-md grid-cols-2 gap-8 text-xs">
        <p className="border-t border-forest-800 pt-1">Date</p>
        <p className="border-t border-forest-800 pt-1">Signed by a grown-up</p>
      </div>
    </div>
  );
}

function PrintTemplate({ character, makerName, outline }: { character: SquishyCharacter; makerName: string; outline: boolean }) {
  return (
    <section className="print-template">
      <p className="print-template-title">✂️ {character.name} · made for {makerName}</p>
      <SquishyTemplate character={character} outline={outline} makerName={makerName} />
    </section>
  );
}

/** Lives under <body> so printing shows only these pages, however long the kit is. */
function PrintPages({ mode, character, characters, makerName, outline, preview }: { mode: PrintMode; character: SquishyCharacter; characters: SquishyCharacter[]; makerName: string; outline: boolean; preview: boolean }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const header = (
    <header className="print-header">
      <strong>🌲 CardRoots Squishy Studio</strong>
      <span>{STEPS}</span>
    </header>
  );
  const pairs: SquishyCharacter[][] = [];
  for (let i = 0; i < characters.length; i += 2) pairs.push(characters.slice(i, i + 2));

  return createPortal(
    <div className="kids-print-root">
      {preview ? (
        <div className="print-page print-locked">
          <p>🔒 This is a preview.</p>
          <p>The printable squishy kit unlocks after purchase at cardroots.com/kids</p>
        </div>
      ) : mode === "one" ? (
        <div className="print-page">{header}<PrintTemplate character={character} makerName={makerName} outline={outline} /></div>
      ) : (
        <>
          {pairs.map(pair => (
            <div key={pair[0].id} className="print-page">{header}{pair.map(item => <PrintTemplate key={item.id} character={item} makerName={makerName} outline={outline} />)}</div>
          ))}
          <div className="print-page"><Certificate makerName={makerName} outline={outline} characters={characters} /></div>
        </>
      )}
    </div>,
    document.body,
  );
}

export default function PrintableSquishy({ recipientName, preview = false, customDesign = null }: PrintableSquishyProps) {
  const [outlineOnly, setOutlineOnly] = useState(false);
  const [selected, setSelected] = useState<string>(SQUISHY_CHARACTERS[0].id);
  const [printMode, setPrintMode] = useState<PrintMode>("kit");
  const makerName = recipientName.trim() || "Your little maker";
  const characters = customDesign ? [makeWorkshopCharacter(customDesign, makerName), ...SQUISHY_CHARACTERS] : SQUISHY_CHARACTERS;
  const showCertificate = selected === "certificate";
  const character = characters.find(item => item.id === selected) ?? characters[0];

  // A freshly made Workshop creature is the one they'll want to see first.
  useEffect(() => {
    if (customDesign) setSelected("workshop");
  }, [customDesign]);

  const print = (mode: PrintMode) => {
    flushSync(() => setPrintMode(mode));
    window.print();
  };

  const pickerButton = "flex flex-col items-center gap-1 rounded-2xl border-2 p-2 text-center text-[11px] font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-700";

  return (
    <section id="squishy-crafts" aria-labelledby="squishy-heading" className="mx-auto max-w-7xl border-t border-parchment-300 px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-parchment-300 bg-white p-5 shadow-xl sm:p-8 lg:p-10">
        <div className="mb-6 flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <span className="mb-2 inline-flex rounded-full bg-berry-600/10 px-3 py-1 text-xs font-bold text-berry-700">
              ✂️ The printable squishy kit · {characters.length} characters + certificate
            </span>
            <h2 id="squishy-heading" className="kids-serif text-2xl font-bold text-forest-900 sm:text-3xl">Make your own paper squishies</h2>
            <p className="mt-2 text-sm leading-relaxed text-forest-700">
              {customDesign ? <>Your own <strong>{characters[0].name}</strong> from the Squishy Workshop and {SQUISHY_CHARACTERS.length} festive friends</> : <>{SQUISHY_CHARACTERS.length} festive squishy friends</>}, each with a back badge saying they were made by <strong>{makerName}</strong>, plus an Official Squishy Maker certificate. Cut, fold, fill with tissue and squish. Choose full colour or outlines to colour in together.
            </p>
            {preview && <p className="mt-2 text-xs font-semibold text-forest-700">Preview · The full printable kit, without the watermark, comes with your purchase.</p>}
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:items-start">
            <div role="group" aria-label="Printable colour mode" className="inline-flex rounded-xl border border-forest-800 p-1">
              <button type="button" aria-pressed={!outlineOnly} onClick={() => setOutlineOnly(false)} className={`rounded-lg px-3 py-2 text-xs font-semibold transition sm:text-sm ${!outlineOnly ? "bg-forest-900 text-white" : "text-forest-900 hover:bg-forest-100"}`}>Full Colour</button>
              <button type="button" aria-pressed={outlineOnly} onClick={() => setOutlineOnly(true)} className={`rounded-lg px-3 py-2 text-xs font-semibold transition sm:text-sm ${outlineOnly ? "bg-forest-900 text-white" : "text-forest-900 hover:bg-forest-100"}`}>Colour-In Outline</button>
            </div>
            {preview ? (
              <button type="button" disabled className="cursor-not-allowed rounded-xl bg-forest-900/60 px-5 py-3 text-sm font-semibold text-white shadow">
                <span aria-hidden="true">🔒 </span>Printing unlocks after purchase
              </button>
            ) : (
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => print("kit")} className="rounded-xl bg-forest-900 px-5 py-3 text-sm font-semibold text-white shadow transition hover:bg-forest-800">
                  <span aria-hidden="true">🖨️ </span>Print the whole kit ({kitPages(characters.length)} A4 pages)
                </button>
                {!showCertificate && (
                  <button type="button" onClick={() => print("one")} className="rounded-xl border border-forest-900 px-4 py-3 text-sm font-semibold text-forest-900 transition hover:bg-forest-100">
                    Print just {character.name.split(" ")[0]}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div role="group" aria-label="Choose a squishy to view" className="mb-6 grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-7">
          {characters.map(item => (
            <button key={item.id} type="button" aria-pressed={selected === item.id} onClick={() => setSelected(item.id)} className={`${pickerButton} ${selected === item.id ? "border-forest-900 bg-forest-100" : "border-parchment-300 hover:bg-parchment-50"}`}>
              <SquishyPortrait character={item} outline={outlineOnly} className="h-14 w-14" />
              <span className="text-forest-900">{item.id === "workshop" ? `⭐ ${item.name}` : item.name}</span>
            </button>
          ))}
          <button type="button" aria-pressed={showCertificate} onClick={() => setSelected("certificate")} className={`${pickerButton} ${showCertificate ? "border-forest-900 bg-forest-100" : "border-parchment-300 hover:bg-parchment-50"}`}>
            <span className="grid h-14 w-14 place-items-center text-3xl" aria-hidden="true">🏅</span>
            <span className="text-forest-900">Maker certificate</span>
          </button>
        </div>

        <div id="printable-squishy-sheet" className="relative mx-auto max-w-4xl rounded-2xl border-2 border-dashed border-forest-700/50 bg-parchment-50 p-4 sm:p-8">
          {preview && <PreviewMarks count={10} spread={22} />}
          {showCertificate ? (
            <Certificate makerName={makerName} outline={outlineOnly} characters={characters} />
          ) : (
            <>
              <div className="mb-6 flex flex-col justify-between gap-3 border-b border-forest-900/20 pb-3 sm:flex-row sm:items-start">
                <div className="shrink-0">
                  <span className="kids-serif text-lg font-bold text-forest-900">{character.name}</span>
                  <p className="mt-1 text-xs text-forest-700">{character.blurb} · made for <strong className="break-words underline">{makerName}</strong></p>
                </div>
                <div className="max-w-sm text-xs leading-relaxed text-forest-700 sm:text-right">
                  <p className="font-bold">How to make your paper squishy:</p>
                  <p>{STEPS}</p>
                </div>
              </div>
              <div className="flex flex-col items-center rounded-2xl border border-parchment-300 bg-white p-3 sm:p-6">
                <p className="mb-2 text-center text-[11px] font-bold uppercase tracking-widest text-berry-600">✂️ Cut around the outer dashed box — keep the centre fold line intact!</p>
                <div className="w-full max-w-2xl"><SquishyTemplate character={character} outline={outlineOnly} makerName={makerName} /></div>
              </div>
            </>
          )}
          <p className="mt-3 text-center text-xs text-forest-700">Use scissors with adult supervision. Fill with clean, dry tissue.</p>
        </div>
      </div>
      <PrintPages mode={printMode} character={character} characters={characters} makerName={makerName} outline={outlineOnly} preview={preview} />
    </section>
  );
}
