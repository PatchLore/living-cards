"use client";

import { useEffect, useRef, useState } from "react";
import { SquishyPortrait } from "./squishyCharacters";
import {
  BODIES, BODY_NAMES, DEFAULT_DESIGN, FACES, FACE_LABELS, PALETTES, PALETTE_COLOURS, TOPPERS, TOPPER_LABELS,
  makeWorkshopCharacter, randomDesign, type WorkshopDesign,
} from "./workshopDesign";

type Phase = "intro" | "build" | "squish" | "reveal";
const SQUISHES_NEEDED = 3;
const SQUISH_WORDS = ["Squish!", "Boing!", "Poof!"];

type Props = {
  recipientName: string;
  extraDetail: string;
  customMessage: string;
  /** The creature already made on this link, if any. */
  design: WorkshopDesign | null;
  onDesign: (design: WorkshopDesign) => void;
};

/**
 * The Squishy Workshop: the child builds a creature in three choices, squishes
 * it to life, and it reveals the personalised message from its tummy pocket.
 * The finished creature joins the printable kit.
 */
export default function SquishyWorkshop({ recipientName, extraDetail, customMessage, design, onDesign }: Props) {
  const [phase, setPhase] = useState<Phase>(design ? "reveal" : "intro");
  const [draft, setDraft] = useState<WorkshopDesign>(design ?? DEFAULT_DESIGN);
  const [step, setStep] = useState(0);
  const [squishes, setSquishes] = useState(0);
  const revealTimer = useRef<number | undefined>(undefined);
  const creature = makeWorkshopCharacter(draft, recipientName);

  useEffect(() => () => window.clearTimeout(revealTimer.current), []);

  const squish = () => {
    if (phase !== "squish" || squishes >= SQUISHES_NEEDED) return;
    const next = squishes + 1;
    setSquishes(next);
    if (next === SQUISHES_NEEDED) {
      onDesign(draft);
      revealTimer.current = window.setTimeout(() => setPhase("reveal"), 900);
    }
  };

  const startOver = () => {
    setStep(0);
    setSquishes(0);
    setPhase("build");
  };

  const option = (key: keyof WorkshopDesign, value: string, label: string, preview: React.ReactNode) => (
    <button
      key={value}
      type="button"
      aria-pressed={draft[key] === value}
      aria-label={label}
      onClick={() => setDraft(current => ({ ...current, [key]: value }))}
      className={`flex min-h-[44px] flex-col items-center gap-1 rounded-2xl border-2 p-1.5 text-[11px] font-semibold transition ${draft[key] === value ? "border-forest-900 bg-forest-100 text-forest-950" : "border-parchment-300 bg-white text-forest-800 hover:bg-parchment-50"}`}
    >
      {preview}
      <span>{label}</span>
    </button>
  );

  const thumb = (change: Partial<WorkshopDesign>) => (
    <SquishyPortrait character={makeWorkshopCharacter({ ...draft, ...change }, recipientName)} className="h-14 w-14" />
  );

  const steps = [
    {
      title: "Pick a shape",
      body: <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">{BODIES.map(body => option("body", body, BODY_NAMES[body].split(" ")[0], thumb({ body })))}</div>,
    },
    {
      title: "Pick a face",
      body: <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{FACES.map(face => option("face", face, FACE_LABELS[face], thumb({ face })))}</div>,
    },
    {
      title: "Pick a hat and a colour",
      body: (
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">{TOPPERS.map(topper => option("topper", topper, TOPPER_LABELS[topper], thumb({ topper })))}</div>
          <div role="group" aria-label="Colour" className="flex flex-wrap justify-center gap-2">
            {PALETTES.map(palette => (
              <button
                key={palette}
                type="button"
                aria-pressed={draft.palette === palette}
                aria-label={PALETTE_COLOURS[palette].label}
                onClick={() => setDraft(current => ({ ...current, palette }))}
                className={`h-11 w-11 rounded-full border-4 transition ${draft.palette === palette ? "scale-110 border-forest-900" : "border-white shadow"}`}
                style={{ background: PALETTE_COLOURS[palette].body }}
              />
            ))}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="flex-1 rounded-2xl border-2 border-amber-400 bg-parchment-50 p-4 text-forest-950 shadow-xl sm:p-6">
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-berry-600 px-3 py-1 text-xs font-bold text-white">✂️ The Squishy Workshop</span>
        {phase === "build" && <span className="text-xs font-bold text-forest-700">Step {step + 1} of {steps.length}</span>}
        {phase === "squish" && <span className="text-xs font-bold text-forest-700">{squishes} of {SQUISHES_NEEDED} squishes</span>}
      </div>

      {phase === "intro" && (
        <div className="flex flex-col items-center gap-4 py-4 text-center">
          <div className="grid h-36 w-36 place-items-center rounded-full border-4 border-dashed border-forest-700/40 bg-white text-6xl font-bold text-forest-700/50" aria-hidden="true">?</div>
          <h3 className="font-serif text-2xl font-bold">The workshop needs a new friend!</h3>
          <p className="max-w-sm text-sm text-forest-800">Let’s make a squishy just for you, <strong>{recipientName}</strong>. It has a secret message hidden in its tummy pocket…</p>
          <button type="button" onClick={() => setPhase("build")} className="rounded-2xl bg-forest-900 px-6 py-3.5 text-base font-bold text-white shadow-lg transition hover:bg-forest-800">Let’s make it! ✨</button>
        </div>
      )}

      {phase === "build" && (
        <div className="grid items-center gap-4 sm:grid-cols-[minmax(0,180px)_1fr]">
          <div className="text-center">
            <SquishyPortrait character={creature} className="mx-auto h-40 w-40 drop-shadow-lg" />
            <p className="mt-1 font-serif text-sm font-bold">{creature.name}</p>
          </div>
          <div>
            <div className="mb-3 flex items-center justify-between gap-2">
              <h3 className="font-serif text-xl font-bold">{steps[step].title}</h3>
              <button type="button" onClick={() => setDraft(randomDesign())} className="rounded-xl border border-forest-800 px-3 py-2 text-xs font-bold text-forest-900 hover:bg-forest-100">🎲 Surprise me</button>
            </div>
            {steps[step].body}
            <div className="mt-4 flex justify-between gap-2">
              <button type="button" disabled={step === 0} onClick={() => setStep(step - 1)} className="rounded-xl px-4 py-3 text-sm font-semibold text-forest-800 disabled:invisible">← Back</button>
              {step < steps.length - 1
                ? <button type="button" onClick={() => setStep(step + 1)} className="rounded-xl bg-forest-900 px-5 py-3 text-sm font-bold text-white hover:bg-forest-800">Next →</button>
                : <button type="button" onClick={() => setPhase("squish")} className="rounded-xl bg-amber-400 px-5 py-3 text-sm font-bold text-forest-950 shadow hover:bg-amber-300">Bring it to life! ✨</button>}
            </div>
          </div>
        </div>
      )}

      {phase === "squish" && (
        <div className="flex flex-col items-center gap-3 py-2 text-center">
          <h3 className="font-serif text-xl font-bold">{squishes < SQUISHES_NEEDED ? `Squish ${creature.name.split(" ")[0]} ${SQUISHES_NEEDED - squishes} more ${SQUISHES_NEEDED - squishes === 1 ? "time" : "times"}!` : "It’s waking up…"}</h3>
          <button type="button" onClick={squish} aria-label={`Squish ${creature.name}`} className="relative rounded-full p-2 focus-visible:outline focus-visible:outline-4 focus-visible:outline-amber-400">
            <span key={squishes} className={`block ${squishes ? "animate-squish squish-active" : "animate-float-gentle"}`}>
              <SquishyPortrait character={creature} className="h-48 w-48 drop-shadow-xl" />
            </span>
            {squishes > 0 && <span key={`word-${squishes}`} className="animate-stamp absolute -right-2 top-2 rounded-full bg-amber-400 px-3 py-1 font-hand text-2xl font-bold text-forest-950 shadow">{SQUISH_WORDS[squishes - 1]}</span>}
          </button>
          <div className="flex gap-2" aria-hidden="true">
            {Array.from({ length: SQUISHES_NEEDED }, (_, i) => <span key={i} className={`h-3 w-3 rounded-full ${i < squishes ? "bg-amber-400" : "bg-parchment-300"}`} />)}
          </div>
        </div>
      )}

      {phase === "reveal" && (
        <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:items-start sm:text-left">
          <div className="relative shrink-0">
            <span className="animate-float-gentle block"><SquishyPortrait character={creature} className="h-40 w-40 drop-shadow-xl" /></span>
            {["✨", "⭐", "✨"].map((sparkle, i) => <span key={i} aria-hidden="true" className="animate-stamp absolute text-2xl" style={{ left: `${[4, 80, 44][i]}%`, top: `${[8, 2, 84][i]}%`, animationDelay: `${0.3 + i * 0.15}s` }}>{sparkle}</span>)}
          </div>
          <div className="animate-pocket min-w-0 flex-1 rounded-2xl border-2 border-dashed border-berry-600/50 bg-white p-4 shadow-md">
            <p className="text-xs font-bold uppercase tracking-wider text-berry-600">💌 From {creature.name.split(" ")[0]}’s tummy pocket</p>
            <h3 className="mt-1 font-serif text-2xl font-bold">Made specially for {recipientName}!</h3>
            {extraDetail && <p className="mt-1 text-xs text-forest-700">Special edition: <strong>{extraDetail}</strong></p>}
            <p className="mt-3 rounded-xl border border-amber-300/60 bg-amber-100/70 p-3 font-hand text-xl leading-snug">{customMessage}</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
              <a href="#squishy-crafts" className="rounded-xl bg-forest-900 px-4 py-3 text-sm font-bold text-white hover:bg-forest-800">✂️ Print {creature.name.split(" ")[0]} ↓</a>
              <button type="button" onClick={startOver} className="rounded-xl border border-forest-900 px-4 py-3 text-sm font-semibold text-forest-900 hover:bg-forest-100">🔁 Make a new one</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
