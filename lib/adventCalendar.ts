/**
 * Advent doors open at midnight UK time (Europe/London) from 1 to 24 December,
 * whatever the viewer's own time zone, so every child gets the same door on the same day.
 */

/** The calendar date in London at a moment in time. */
export function londonDate(ms: number) {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", year: "numeric", month: "numeric", day: "numeric" }).formatToParts(new Date(ms));
  const get = (type: string) => Number(parts.find(part => part.type === type)?.value);
  return { year: get("year"), month: get("month"), day: get("day") };
}

/** Doors open so far: 0 before December, 1–24 during Advent, all 24 from Christmas Eve to New Year. */
export function adventDoorsOpen(ms: number) {
  const { month, day } = londonDate(ms);
  return month === 12 ? Math.min(day, 24) : 0;
}

/** Sleeps until the first door opens (this December, or next once December has passed). */
export function sleepsUntilAdvent(ms: number) {
  const { year, month, day } = londonDate(ms);
  const target = Date.UTC(month === 12 ? year + 1 : year, 11, 1);
  return Math.round((target - Date.UTC(year, month - 1, day)) / 86_400_000);
}
