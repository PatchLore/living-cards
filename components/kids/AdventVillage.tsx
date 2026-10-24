"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ADVENT_SURPRISES } from "./advent";

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
  const surprise = ADVENT_SURPRISES.find(item => item.day === activeDay);
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
          <p className="text-xs font-bold uppercase tracking-wider text-amber-300">24 days of woodland magic</p>
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
            ? "Tap a door to open your woodland surprise"
            : sleeps && sleeps > 0
              ? `${sleeps} ${sleeps === 1 ? "sleep" : "sleeps"} until the first door opens on 1 December`
              : "Your first door opens on 1 December"}
        </p>
        <p className="mt-1 text-xs leading-relaxed text-parchment-100">
          {!recipientOnly && demoUnlocked
            ? `Try the first ${PREVIEW_DOORS} doors in this preview. After purchase, the recipient’s calendar opens one new door each day from 1–24 December.`
            : "A new door opens each day from 1–24 December. Earlier doors stay available to open again."}
        </p>
        <p className="mt-2 text-xs text-parchment-200">Made for {recipientName} — featuring {extraDetail}.</p>
      </div>

      <div id="adventGrid" className="grid grid-cols-4 gap-2 sm:grid-cols-6">
        {ADVENT_SURPRISES.map(item => {
          const unlocked = item.day <= unlockedThrough;
          const opened = unlocked && openedDays.includes(item.day);
          return (
            <button
              key={item.day}
              type="button"
              disabled={!unlocked}
              className="advent-door"
              data-open={opened}
              aria-label={`Day ${item.day}: ${!unlocked ? `locked until ${item.day} December` : opened ? "reopen surprise" : "open surprise"}`}
              aria-haspopup="dialog"
              aria-controls={dialogId}
              onClick={() => openDoor(item.day)}
            >
              <span className="advent-door-surprise" aria-hidden="true">{item.icon}</span>
              <span className="advent-door-face" aria-hidden="true">
                <span className="advent-door-number">{item.day}</span>
                <span className="advent-door-decoration">{unlocked ? "✦" : "🔒"}</span>
                <span className="advent-door-handle" />
              </span>
              {opened && <span className="advent-door-opened" aria-hidden="true">✓</span>}
            </button>
          );
        })}
      </div>

      <p className="text-center text-xs text-parchment-200" role="status" aria-live="polite">
        {openedDays.filter(day => day <= unlockedThrough).length} of 24 doors opened{!recipientOnly && demoUnlocked ? " in this preview" : ""}
      </p>
      <p className="rounded-xl border border-forest-700 bg-forest-900/80 px-4 py-3 text-sm">{customMessage}</p>

      <dialog
        ref={dialog}
        id={dialogId}
        className="advent-surprise-dialog"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        onClose={() => setActiveDay(null)}
        onClick={event => { if (event.target === event.currentTarget) event.currentTarget.close(); }}
      >
        {surprise && <div className="advent-surprise-content">
          <button type="button" className="advent-surprise-close" aria-label="Close surprise" onClick={() => dialog.current?.close()}>×</button>
          <p className="text-xs font-bold uppercase tracking-widest text-forest-700">A woodland surprise for {recipientName}</p>
          <div key={surprise.day} className="advent-surprise-icon" aria-hidden="true">{surprise.icon}</div>
          <h4 id={titleId} className="font-serif text-2xl font-bold text-forest-900">{surprise.title}</h4>
          <p id={descriptionId} className="mt-4 text-sm leading-relaxed text-forest-800">{surprise.text}</p>
          <p className="mt-3 font-hand text-2xl text-forest-800">A little woodland magic for {recipientName}.</p>
          <button type="button" autoFocus className="mt-6 rounded-xl bg-forest-900 px-5 py-3 text-sm font-semibold text-white hover:bg-forest-800" onClick={() => dialog.current?.close()}>Back to the village</button>
        </div>}
      </dialog>
    </div>
  );
}
