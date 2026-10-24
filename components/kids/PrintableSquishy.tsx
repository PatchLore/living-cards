"use client";

import { useState } from "react";

export interface PrintableSquishyProps {
  recipientName: string;
  preview?: boolean;
}

export default function PrintableSquishy({ recipientName, preview = false }: PrintableSquishyProps) {
  const [outlineOnly, setOutlineOnly] = useState(false);
  const makerName = recipientName.trim() || "Your little maker";
  const fitLongName = Array.from(makerName).length > 10;
  const bodyFill = outlineOnly ? "#ffffff" : "#7f4f24";
  const hatFill = outlineOnly ? "#ffffff" : "#bc4749";

  return (
    <section id="squishy-crafts" aria-labelledby="squishy-heading" className="mx-auto max-w-7xl border-t border-parchment-300 px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-parchment-300 bg-white p-5 shadow-xl sm:p-8 lg:p-10">
        <div className="no-print mb-6 flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <span className="mb-2 inline-flex rounded-full bg-berry-600/10 px-3 py-1 text-xs font-bold text-berry-700">
              ✂️ A little card. A hands-on adventure.
            </span>
            <h2 id="squishy-heading" className="kids-serif text-2xl font-bold text-forest-900 sm:text-3xl">Make your own paper squishy</h2>
            <p className="mt-2 text-sm leading-relaxed text-forest-700">
              Print a personalised Berry the Robin for <strong>{makerName}</strong>, then cut, fold and fill it with tissue. Choose full colour or a version to colour in together.
            </p>
            {preview && <p className="mt-2 text-xs font-semibold text-forest-700">Preview template · The printable version without the watermark comes with your purchase.</p>}
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:items-start">
            <div role="group" aria-label="Printable colour mode" className="inline-flex rounded-xl border border-forest-800 p-1">
              <button
                type="button"
                aria-pressed={!outlineOnly}
                onClick={() => setOutlineOnly(false)}
                className={`rounded-lg px-3 py-2 text-xs font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-700 sm:text-sm ${!outlineOnly ? "bg-forest-900 text-white" : "text-forest-900 hover:bg-forest-100"}`}
              >Full Colour</button>
              <button
                type="button"
                aria-pressed={outlineOnly}
                onClick={() => setOutlineOnly(true)}
                className={`rounded-lg px-3 py-2 text-xs font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-700 sm:text-sm ${outlineOnly ? "bg-forest-900 text-white" : "text-forest-900 hover:bg-forest-100"}`}
              >Colour-In Outline</button>
            </div>
            {preview ? (
              <button type="button" disabled className="cursor-not-allowed rounded-xl bg-forest-900/60 px-5 py-3 text-sm font-semibold text-white shadow">
                <span aria-hidden="true">🔒 </span>Printing unlocks after purchase
              </button>
            ) : (
              <button type="button" onClick={() => window.print()} className="rounded-xl bg-forest-900 px-5 py-3 text-sm font-semibold text-white shadow transition hover:bg-forest-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-700">
                <span aria-hidden="true">🖨️ </span>Print A4 template
              </button>
            )}
          </div>
        </div>

        <div id="printable-squishy-sheet" className="relative mx-auto max-w-4xl rounded-2xl border-2 border-dashed border-forest-700/50 bg-parchment-50 p-4 sm:p-8">
          {/* Stays on the sheet even if someone prints the preview from the browser menu. */}
          {preview && (
            <div aria-hidden className="kids-watermark kids-watermark--print pointer-events-none absolute inset-0 z-10 overflow-hidden">
              {Array.from({ length: 10 }, (_, i) => (
                <span key={i} style={{ top: `${(i % 5) * 22 - 2}%`, left: `${i < 5 ? -5 : 48}%` }}>
                  PREVIEW · CardRoots
                </span>
              ))}
            </div>
          )}
          <div className="mb-6 flex flex-col justify-between gap-3 border-b border-forest-900/20 pb-3 sm:flex-row sm:items-start">
            <div className="shrink-0">
              <span className="kids-serif text-lg font-bold text-forest-900">🌲 CardRoots Squishy Studio</span>
              <p className="mt-1 text-xs text-forest-700">Custom edition for <strong className="break-words underline">{makerName}</strong></p>
            </div>
            <div className="max-w-sm text-xs leading-relaxed text-forest-700 sm:text-right">
              <p className="font-bold">How to make your paper squishy:</p>
              <p>1. Cut along the outer dashed line · 2. Fold down the middle line · 3. Tape the sides, leaving the top open · 4. Stuff with tissue and seal!</p>
            </div>
          </div>

          <div className="flex flex-col items-center rounded-2xl border border-parchment-300 bg-white p-3 sm:p-6">
            <p className="mb-2 text-center text-[11px] font-bold uppercase tracking-widest text-berry-600">✂️ Cut around the outer dashed box — keep the centre fold line intact!</p>
            <svg id="printableSquishySvg" role="img" aria-labelledby="squishy-svg-title squishy-svg-description" className="h-auto w-full max-w-2xl" viewBox="0 0 640 300" fill="none" xmlns="http://www.w3.org/2000/svg">
              <title id="squishy-svg-title">{`Personalised Berry the Robin paper squishy for ${makerName}`}</title>
              <desc id="squishy-svg-description">A joined front and back paper template. Cut around the outer dashed rectangle, fold at the centre line, tape the sides and fill with tissue before sealing the top.</desc>
              <rect x="20" y="20" width="600" height="260" rx="36" fill="#fffdf9" stroke="#1b4332" strokeWidth="2.5" strokeDasharray="8 6" />
              <line x1="320" y1="20" x2="320" y2="280" stroke="#bc4749" strokeWidth="2" strokeDasharray="4 4" />
              <rect x="275" y="8" width="90" height="20" rx="10" fill="#bc4749" />
              <text x="320" y="22" textAnchor="middle" fill="#ffffff" fontSize="10" fontFamily="Inter, sans-serif" fontWeight="bold">↕ FOLD HERE</text>
              <text x="170" y="38" textAnchor="middle" fill="#2d6a4f" fontSize="10" fontFamily="Inter, sans-serif" fontWeight="bold">⬆ LEAVE TOP OPEN FOR STUFFING ⬆</text>
              <text x="470" y="38" textAnchor="middle" fill="#2d6a4f" fontSize="10" fontFamily="Inter, sans-serif" fontWeight="bold">⬆ LEAVE TOP OPEN FOR STUFFING ⬆</text>

              <g id="squishyPrintFront">
                <ellipse cx="170" cy="165" rx="85" ry="78" className="sq-fill-body" fill={bodyFill} stroke="#1b4332" strokeWidth="3" />
                <ellipse cx="170" cy="180" rx="55" ry="50" className="sq-fill-belly" fill={outlineOnly ? "#ffffff" : "#e63946"} stroke="#1b4332" strokeWidth="2.5" />
                <circle cx="138" cy="135" r="12" fill="#1b4332" />
                <circle cx="134" cy="131" r="4" fill="#ffffff" />
                <circle cx="202" cy="135" r="12" fill="#1b4332" />
                <circle cx="198" cy="131" r="4" fill="#ffffff" />
                <ellipse cx="115" cy="150" rx="10" ry="6" className="sq-fill-cheek" fill={outlineOnly ? "#f3f4f6" : "#ff8fa3"} />
                <ellipse cx="225" cy="150" rx="10" ry="6" className="sq-fill-cheek" fill={outlineOnly ? "#f3f4f6" : "#ff8fa3"} />
                <polygon points="160,142 180,142 170,156" className="sq-fill-beak" fill={outlineOnly ? "#ffffff" : "#ffb703"} stroke="#1b4332" strokeWidth="2" />
                <path d="M105 102 C130 50, 210 50, 235 102 Z" className="sq-fill-hat" fill={hatFill} stroke="#1b4332" strokeWidth="3" />
                <rect x="98" y="95" width="144" height="18" rx="9" fill="#ffffff" stroke="#1b4332" strokeWidth="2.5" />
                <circle cx="170" cy="60" r="14" fill="#ffffff" stroke="#1b4332" strokeWidth="2.5" />
                <text x="170" y="264" textAnchor="middle" fill="#1b4332" fontSize="13" fontFamily="Fraunces, serif" fontWeight="bold">FRONT · Berry the Robin</text>
              </g>

              <g id="squishyPrintBack">
                <ellipse cx="470" cy="165" rx="85" ry="78" className="sq-fill-body" fill={bodyFill} stroke="#1b4332" strokeWidth="3" />
                <rect x="405" y="130" width="130" height="72" rx="16" fill="#faf6f0" stroke="#1b4332" strokeWidth="2.5" />
                <text x="470" y="154" textAnchor="middle" fill="#2d6a4f" fontSize="10" fontFamily="Inter, sans-serif" fontWeight="bold">HANDCRAFTED BY</text>
                <text id="svgSquishyMakerName" x="470" y="177" textAnchor="middle" fill="#bc4749" fontSize="20" fontFamily="Fraunces, serif" fontWeight="bold" textLength={fitLongName ? 112 : undefined} lengthAdjust={fitLongName ? "spacingAndGlyphs" : undefined}>{makerName}</text>
                <text x="470" y="194" textAnchor="middle" fill="#1b4332" fontSize="9" fontFamily="Inter, sans-serif">🌲 Made with CardRoots</text>
                <path d="M405 102 C430 50, 510 50, 535 102 Z" className="sq-fill-hat" fill={hatFill} stroke="#1b4332" strokeWidth="3" />
                <rect x="398" y="95" width="144" height="18" rx="9" fill="#ffffff" stroke="#1b4332" strokeWidth="2.5" />
                <circle cx="470" cy="60" r="14" fill="#ffffff" stroke="#1b4332" strokeWidth="2.5" />
                <text x="470" y="264" textAnchor="middle" fill="#1b4332" fontSize="13" fontFamily="Fraunces, serif" fontWeight="bold">BACK · Personalised Maker Badge</text>
              </g>
            </svg>
          </div>
          <p className="mt-3 text-center text-xs text-forest-700">Use scissors with adult supervision. Fill with clean, dry tissue.</p>
        </div>
      </div>
    </section>
  );
}
