"use client";

import React from "react";

export default function CopyButton({ text }: { text: string }) {
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Link copied to clipboard");
    } catch (err) {
      alert("Failed to copy");
    }
  };

  return (
    <button
      onClick={copy}
      className="inline-flex items-center px-3 py-2 rounded-md bg-slate-700/60 hover:bg-slate-700 text-sm"
    >
      Copy
    </button>
  );
}


