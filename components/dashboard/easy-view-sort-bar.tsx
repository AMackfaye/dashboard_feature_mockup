"use client";

import { useMemo } from "react";
import { SmartBin, getFillAmpelLevel } from "@/lib/types";

interface EasyViewSortBarProps {
  bins: SmartBin[];
}

const DOT = {
  red: "#ef4444",
  green: "#22c55e",
} as const;

export function EasyViewSortBar({ bins }: EasyViewSortBarProps) {
  const counts = useMemo(() => {
    let red = 0;
    let green = 0;
    for (const b of bins) {
      if (getFillAmpelLevel(b.fillLevel) === "red") red++;
      else green++;
    }
    return { red, green, total: bins.length };
  }, [bins]);

  return (
    <div
      className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 bg-zinc-50/95 px-4 py-2.5 text-sm backdrop-blur-sm sm:px-6"
      role="status"
      aria-live="polite"
    >
      <p className="font-medium text-zinc-800">
        Sortierung: <span className="font-normal text-zinc-600">Kritisch → Ok</span>
      </p>
      <ul className="flex flex-wrap items-center gap-4 text-zinc-600">
        <li className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: DOT.red }} aria-hidden />
          <span>Kritisch</span>
          <span className="tabular-nums font-semibold text-zinc-900">{counts.red}</span>
        </li>
        <li className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: DOT.green }} aria-hidden />
          <span>Ok</span>
          <span className="tabular-nums font-semibold text-zinc-900">{counts.green}</span>
        </li>
        <li className="text-zinc-500">
          Gesamt <span className="font-semibold text-zinc-800">{counts.total}</span>
        </li>
      </ul>
    </div>
  );
}
