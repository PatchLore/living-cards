 "use client";

import { useEffect, useState } from "react";

export default function UrgencyBanner() {
  const [visible, setVisible] = useState<boolean>(true);

  useEffect(() => {
    try {
      const dismissed = localStorage.getItem("dismiss-seasonal-banner");
      if (dismissed === "1") setVisible(false);
    } catch {
      /* ignore */
    }
  }, []);

  if (!visible) return null;

  return (
    <div className="w-full bg-amber-500/95 text-amber-900 text-sm px-4 py-2 flex items-center justify-between">
      <div className="max-w-6xl mx-auto w-full flex items-center justify-center">
        Order now for Christmas delivery — instant digital cards delivered worldwide.
      </div>
      <button
        aria-label="Dismiss banner"
        onClick={() => {
          try {
            localStorage.setItem("dismiss-seasonal-banner", "1");
          } catch {}
          setVisible(false);
        }}
        className="px-3 py-1 text-amber-900/80"
      >
        ✕
      </button>
    </div>
  );
}


