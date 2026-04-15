"use client";

import { Card } from "@/components/ui/card";
import {
  SmartBin,
  getFillAmpelLevel,
  getEasyViewWasteBorderColor,
  getStatusColor,
  BinType,
  type FillAmpelLevel,
} from "@/lib/types";
import { Box, MapPin, Trash2, Wifi, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface EasyBinCardProps {
  bin: SmartBin;
}

const WASTE_TYPE_LABELS: Record<BinType, string> = {
  Rest: "Restmüll",
  Papier: "Papier",
  Bio: "Bioabfälle",
  Recycling: "Recycling",
  Sondermüll: "Sondermüll",
};

const AMPEL_RING: Record<FillAmpelLevel, string> = {
  green: "#22c55e",
  red: "#ef4444",
};

/**
 * Mülleimer-Icon mit einfarbigem Ring — Ampel nur rot (kritisch) oder grün (ok).
 */
function AmpelTrashIcon({ level, className }: { level: FillAmpelLevel; className?: string }) {
  const r = 38;
  const sw = 7;
  const ringColor = AMPEL_RING[level];
  const critical = level === "red";

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <svg viewBox="0 0 100 100" className="h-32 w-32" aria-hidden>
        <title>Füllstand: {level === "red" ? "kritisch" : "ok"}</title>
        {critical ? (
          <circle
            cx={50}
            cy={50}
            r={44}
            fill="none"
            stroke="#fecaca"
            strokeWidth={3}
            strokeLinecap="round"
            className="easy-critical-halo-pulse"
          />
        ) : null}
        <circle
          cx={50}
          cy={50}
          r={r}
          fill="none"
          stroke={ringColor}
          strokeWidth={sw}
          strokeLinecap="round"
          className={critical ? "easy-critical-ring-pulse" : undefined}
        />
      </svg>
      <Trash2
        className={cn("absolute h-11 w-11", critical && "easy-critical-icon-pulse")}
        strokeWidth={2}
        aria-hidden
        style={{ color: ringColor }}
      />
    </div>
  );
}

export function EasyBinCard({ bin }: EasyBinCardProps) {
  const ampel = getFillAmpelLevel(bin.fillLevel);
  const fillColor = getStatusColor(ampel);
  const wasteBorder = getEasyViewWasteBorderColor(bin.type);
  const typeLabel = WASTE_TYPE_LABELS[bin.type];
  const isOnline = bin.status === "online";

  const locationLine = [bin.location.building, bin.location.floor].filter(Boolean).join(" · ");
  const detailLine = [bin.location.area, bin.location.zone].filter(Boolean).join(" · ");

  const capacityLabel = `${bin.volume} l`;

  const summary = `${locationLine}. Füllstand ${bin.fillLevel} Prozent. ${typeLabel}. Behälter ${capacityLabel}. ${isOnline ? "Online" : "Offline"}.`;

  return (
    <Card
      role="article"
      aria-label={summary}
      className="overflow-hidden rounded-2xl border border-zinc-200/90 border-l-[6px] bg-zinc-100/90 shadow-sm transition-shadow duration-300 hover:shadow-md"
      style={{ borderLeftColor: wasteBorder }}
    >
      {/* 1. Standort + Online */}
      <div className="flex items-start justify-between gap-3 border-b border-zinc-200 bg-white px-4 py-3">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500">
            <MapPin className="h-5 w-5" strokeWidth={2} aria-hidden />
          </div>
          <div className="min-w-0 pt-0.5 text-sm leading-snug text-zinc-700">
            <p className="font-medium text-zinc-900">{locationLine}</p>
            {detailLine ? <p className="mt-0.5 text-zinc-500">{detailLine}</p> : null}
          </div>
        </div>
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-600"
          title={isOnline ? "Online" : "Offline"}
          aria-label={isOnline ? "Online" : "Offline"}
        >
          {isOnline ? <Wifi className="h-5 w-5" strokeWidth={2} aria-hidden /> : <WifiOff className="h-5 w-5" strokeWidth={2} aria-hidden />}
        </span>
      </div>

      {/* 2. Müll-Icon + Füllstand */}
      <div className="border-b border-zinc-200 bg-zinc-50 px-4 py-5">
        <div className="mx-auto flex max-w-sm items-center justify-center gap-5 rounded-xl bg-white px-4 py-4 ring-1 ring-zinc-200/90">
          <AmpelTrashIcon level={ampel} className="shrink-0" />
          <p
            className="min-w-0 tabular-nums text-4xl font-semibold leading-none tracking-tight sm:text-5xl"
            style={{ color: fillColor }}
          >
            {bin.fillLevel}
            <span className="text-2xl font-medium text-zinc-400 sm:text-3xl">%</span>
          </p>
        </div>
      </div>

      {/* 3. Mülltyp */}
      <div className="border-b border-zinc-200 bg-white px-4 py-3">
        <p className="text-base font-semibold text-zinc-900">{typeLabel}</p>
      </div>

      {/* 4. Volumen */}
      <div className="flex items-center gap-4 bg-zinc-50 px-4 py-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-zinc-500 ring-1 ring-zinc-200/80">
          <Box className="h-5 w-5" strokeWidth={2} aria-hidden />
        </div>
        <p className="text-xl font-semibold tabular-nums text-zinc-900">{capacityLabel}</p>
      </div>
    </Card>
  );
}
