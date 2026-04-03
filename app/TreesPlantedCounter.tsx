"use client";

import { useEffect, useState } from "react";

const INITIAL_COUNT = 14847;
const INCREMENT_INTERVAL_MS = 8000;

function formatNumber(n: number): string {
  return n.toLocaleString("en-GB");
}

export default function TreesPlantedCounter() {
  const [count, setCount] = useState(INITIAL_COUNT);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => prev + 1);
    }, INCREMENT_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-[#1B4332] py-8 md:py-10 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-[#B7E4C7] text-sm md:text-base font-medium tracking-wide uppercase mb-2">
          Our Growing Impact
        </p>
        <p className="text-white text-[32px] md:text-[48px] lg:text-[56px] font-bold font-serif leading-tight">
          {formatNumber(count)}{" "}
          <span className="text-[#95D5B2] text-[24px] md:text-[32px] lg:text-[40px]">
            trees planted and growing
          </span>
        </p>
        <div className="mt-3 flex items-center justify-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <span className="text-[#95D5B2] text-xs md:text-sm font-medium">
            Live — a new tree planted every 8 seconds
          </span>
        </div>
      </div>
    </div>
  );
}
