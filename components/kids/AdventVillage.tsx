"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ADVENT_DAYS, personaliseAdvent } from "./advent";
import AdventIcon from "./adventIcons";

const PREVIEW_DOORS = 3;

/** Opened doors are remembered per card link, on this device only. */
const storageKey = () => `cardroots-advent:${window.location.pathname}`;

function loadOpenedDays(): number[] {
  try {
    const saved = JSON.parse(window.localStorage.getItem(storageKey()) || "[]");
    return Array.isArray(saved) ? saved.filter((day): day is number => Number.isInteger(day) && day >= 1 && day <= 24) : [];
  } catch {
    return [];
  }
}

function saveOpenedDays(days: number[]) {
  try {
    window.localStorage.setItem(storageKey(), JSON.stringify(days));
  } catch {}
}

/** Whole days from today until 1 December (this year, or next once Christmas has passed). */
function sleepsUntilAdvent(date: Date) {
  const year = date.getMonth() === 11 ? date.getFullYear() + 1 : date.getFullYear();
  const today = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.round((Date.UTC(year, 11, 1) - today) / 86_400_000);
}

const DoorStar = () => (
  <svg aria-hidden="true" viewBox="0 0 20 20" className="h-3 w-3"><path d="M10 1 L12.4 7.6 L19 10 L12.4 12.4 L10 19 L7.6 12.4 L1 10 L7.6 7.6 Z" fill="currentColor" /></svg>
);
const DoorLock = () => (
  <svg aria-hidden="true" viewBox="0 0 20 20" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="4" y="9" width="12" height="9" rx="2" fill="currentColor" stroke="none" /><path d="M7 9 V6.5 a3 3 0 0 1 6 0 V9" /></svg>
);

/** Reads the day's chapter aloud with the browser's own voice, where supported. */
function useReadAloud() {
  const [speaking, setSpeaking] = useState(false);
  const supported = typeof window !== "undefined" && "speechSynthesis" in window;
  const stop = () => {
    if (supported) window.speechSynthesis.cancel();
    setSpeaking(false);
  };
  const speak = (text: string) => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = window.speechSynthesis.getVoices().find(item => item.lang === "en-GB");
    if (voice) utterance.voice = voice;
    utterance.lang = "en-GB";
    utterance.rate = 0.92;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };
  useEffect(() => () => { if (supported) window.speechSynthesis.cancel(); }, [supported]);
  return { supported, speaking, speak, stop };
}

type Props = {
  recipientName: string;
  extraDetail: string;
  customMessage: string;
  recipientOnly: boolean;
};

export default function AdventVillage({ recipientName, extraDetail, customMessage, recipientOnly }: Props) {
  const [demoUnlocked, setDemoUnlocked] = useState(!recipientOnly);
  const [openedDays, setOpenedDays] = useState<number[]>([]);
  const [activeDay, setActiveDay] = useState<number | null>(null);
  const [currentDay, setCurrentDay] = useState(0);
  const [sleeps, setSleeps] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const dialogId = useId();
  const titleId = useId();
  const descriptionId = useId();
  const surprise = ADVENT_DAYS.find(item => item.day === activeDay);
  const say = (text: string) => personaliseAdvent(text, recipientName);
  const readAloud = useReadAloud();
  // The studio preview opens a taster of three doors; the full calendar comes with a purchase.
  const unlockedThrough = !recipientOnly && demoUnlocked ? PREVIEW_DOORS : currentDay;

  useEffect(() => {
    const updateDay = () => {
      const date = new Date();
      setCurrentDay(date.getMonth() === 11 ? Math.min(date.getDate(), 24) : 0);
      setSleeps(sleepsUntilAdvent(date));
    };
    updateDay();
    const timer = window.setInterval(updateDay, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (recipientOnly) setOpenedDays(loadOpenedDays());
  }, [recipientOnly]);

  useEffect(() => {
    if (activeDay === null) return;
    const timer = window.setTimeout(() => {
      if (!dialog.current?.open) dialog.current?.showModal();
    }, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 320);
    return () => window.clearTimeout(timer);
  }, [activeDay]);

  const openDoor = (day: number) => {
    if (day > unlockedThrough) return;
    setOpenedDays(days => {
      if (days.includes(day)) return days;
      const next = [...days, day];
      if (recipientOnly) saveOpenedDays(next);
      return next;
    });
    setActiveDay(day);
  };

  return (
    <div id="scene-advent" className="scene-panel relative z-10 flex flex-col gap-4 text-parchment-50">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-amber-300">A 24-chapter Christmas story</p>
          <h3 className="font-serif text-2xl text-white">{recipientName}’s Magical Advent Village</h3>
        </div>
        {!recipientOnly && (
          <label className="flex cursor-pointer items-center gap-2 rounded-full border border-amber-400/30 bg-forest-800 px-3 py-2 text-xs text-amber-200">
            <input id="adventDemoUnlock" type="checkbox" checked={demoUnlocked} onChange={event => {
              setDemoUnlocked(event.target.checked);
              setOpenedDays([]);
              dialog.current?.close();
              setActiveDay(null);
            }} />
            Preview: try the first {PREVIEW_DOORS} doors
          </label>
        )}
      </div>

      <div className="rounded-xl border border-amber-300/40 bg-amber-400/10 p-4">
        <p className="text-sm font-bold text-amber-300">
          {unlockedThrough
            ? "Tap a door to open today’s chapter of Berry’s Lantern"
            : sleeps && sleeps > 0
              ? `${sleeps} ${sleeps === 1 ? "sleep" : "sleeps"} until the first door opens on 1 December`
              : "Your first door opens on 1 December"}
        </p>
        <p className="mt-1 text-xs leading-relaxed text-parchment-100">
          {!recipientOnly && demoUnlocked
            ? `Read the first ${PREVIEW_DOORS} chapters in this preview. After purchase, a new chapter opens each day from 1–24 December, ending on Christmas Eve.`
            : `Berry the Robin needs one spark of Christmas magic each day so ${recipientName} can light the Christmas Star. A new chapter opens every day from 1–24 December, and earlier doors can be opened again.`}
        </p>
        <p className="mt-2 text-xs text-parchment-200">Made for {recipientName} — featuring {extraDetail}.</p>
      </div>

      <div id="adventGrid" className="grid grid-cols-4 gap-2 sm:grid-cols-6">
        {ADVENT_DAYS.map(item => {
          const unlocked = item.day <= unlockedThrough;
          const opened = unlocked && openedDays.includes(item.day);
          return (
            <button
              key={item.day}
              type="button"
              disabled={!unlocked}
              className="advent-door"
              data-open={opened}
              aria-label={`Day ${item.day}: ${!unlocked ? `locked until ${item.day} December` : opened ? "read again" : "open today’s chapter"}`}
              aria-haspopup="dialog"
              aria-controls={dialogId}
              onClick={() => openDoor(item.day)}
            >
              <span className="advent-door-surprise" aria-hidden="true"><AdventIcon day={item.day} className="h-[72%] w-[72%]" /></span>
              <span className="advent-door-face" aria-hidden="true">
                <span className="advent-door-number">{item.day}</span>
                <span className="advent-door-decoration">{unlocked ? <DoorStar /> : <DoorLock />}</span>
                <span className="advent-door-handle" />
              </span>
              {opened && <span className="advent-door-opened" aria-hidden="true">✓</span>}
            </button>
          );
        })}
      </div>

      <p className="text-center text-xs text-parchment-200" role="status" aria-live="polite">
        ✨ {openedDays.filter(day => day <= unlockedThrough).length} of 24 sparks collected for Berry’s lantern{!recipientOnly && demoUnlocked ? " in this preview" : ""}
      </p>
      <p className="rounded-xl border border-forest-700 bg-forest-900/80 px-4 py-3 text-sm">{customMessage}</p>

      <dialog
        ref={dialog}
        id={dialogId}
        className="advent-surprise-dialog"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        onClose={() => { readAloud.stop(); setActiveDay(null); }}
        onClick={event => { if (event.target === event.currentTarget) event.currentTarget.close(); }}
      >
        {surprise && <div className="advent-surprise-content">
          <button type="button" className="advent-surprise-close" aria-label="Close chapter" onClick={() => dialog.current?.close()}>×</button>
          <p className="text-xs font-bold uppercase tracking-widest text-forest-700">Berry’s Lantern · Chapter {surprise.day} of 24</p>
          <div key={surprise.day} className="advent-surprise-icon" aria-hidden="true"><AdventIcon day={surprise.day} className="mx-auto h-28 w-28" /></div>
          <h4 id={titleId} className="font-serif text-2xl font-bold text-forest-900">{say(surprise.title)}</h4>
          <p className="mx-auto mt-3 max-w-xs font-hand text-xl leading-snug text-berry-700">
            {surprise.poem.map(verse => <span key={verse} className="block">{say(verse)}</span>)}
          </p>
          <p id={descriptionId} className="mt-4 text-left text-sm leading-relaxed text-forest-800">{say(surprise.story)}</p>
          <div className="mt-5 rounded-xl border border-amber-300 bg-amber-50 p-3 text-left">
            <p className="text-xs font-bold uppercase tracking-wider text-amber-700">✨ Today’s spark for {recipientName}</p>
            <p className="mt-1 text-sm text-forest-900">{say(surprise.spark)}</p>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {readAloud.supported && (
              <button type="button" onClick={() => readAloud.speaking ? readAloud.stop() : readAloud.speak(say(`${surprise.title}. ${surprise.poem.join(" ")} ${surprise.story} Today’s spark: ${surprise.spark}`))} className="rounded-xl border border-forest-900 px-4 py-3 text-sm font-semibold text-forest-900 hover:bg-forest-100">
                {readAloud.speaking ? "⏹ Stop reading" : "🔊 Read it to me"}
              </button>
            )}
            <button type="button" autoFocus className="rounded-xl bg-forest-900 px-5 py-3 text-sm font-semibold text-white hover:bg-forest-800" onClick={() => dialog.current?.close()}>Back to the village</button>
          </div>
        </div>}
      </dialog>
    </div>
  );
}
