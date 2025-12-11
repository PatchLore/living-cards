"use client";

export default function CopyButton() {
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(window.location.href);
          alert("Share link copied!");
        } catch {
          alert("Failed to copy link.");
        }
      }}
      className="px-6 py-3 rounded-2xl bg-slate-900 text-white font-medium shadow-md hover:bg-slate-950 transition"
    >
      Copy Card Link
    </button>
  );
}

