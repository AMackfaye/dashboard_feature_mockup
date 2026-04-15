export type BinType = "Rest" | "Papier" | "Bio" | "Recycling" | "Sondermüll";

export type BinStatus = "online" | "offline";

export type StatusLevel = "green" | "yellow" | "red" | "gray";

export interface SmartBin {
  id: string;
  binId: string; // e.g., "10001"
  type: BinType;
  fillLevel: number; // 0–100%
  status: BinStatus;
  volume: number; // in liters
  batteryLevel: number; // 0-100%
  lastUpdated: string; // ISO date
  openingsCount: number;
  prediction?: {
    fillLevel: number;
    date: string;
  } | null;
  location: {
    building: string;
    floor: string;
    area: string;
    zone: string;
  };
}

export interface WasteStation {
  id: string;
  name: string;
  stationId: string; // e.g., "SmartWasteStation-MOCK-10001"
  location: {
    building: string;
    floor: string;
    area: string;
    zone: string;
  };
  bins: SmartBin[];
  aggregatedStatus: StatusLevel;
}

export interface HourlyFillData {
  time: string;
  fillLevel: number;
}

export interface WeeklyFillData {
  day: string;
  fillLevel: number;
}

export function getStatusLevel(fillLevel: number, isOffline: boolean = false): StatusLevel {
  if (isOffline) return "gray";
  if (fillLevel >= 80) return "red";
  if (fillLevel >= 50) return "yellow";
  return "green";
}

/** Ampel nur nach Füllstand — rot (kritisch) oder grün, kein gelber Zwischenbereich. */
export type FillAmpelLevel = "green" | "red";

export function getFillAmpelLevel(fillLevel: number): FillAmpelLevel {
  if (fillLevel >= 75) return "red";
  return "green";
}

export function getStatusColor(status: StatusLevel): string {
  switch (status) {
    case "green":
      return "#22c55e";
    case "yellow":
      return "#eab308";
    case "red":
      return "#ef4444";
    case "gray":
      return "#6b7280";
  }
}

export function getStatusBgColor(status: StatusLevel): string {
  switch (status) {
    case "green":
      return "bg-success";
    case "yellow":
      return "bg-warning";
    case "red":
      return "bg-critical";
    case "gray":
      return "bg-muted-foreground";
  }
}

export function getBinTypeColor(type: BinType): string {
  switch (type) {
    case "Rest":
      return "#374151"; // gray-700
    case "Papier":
      return "#3b82f6"; // blue-500
    case "Bio":
      return "#10b981"; // emerald-500
    case "Recycling":
      return "#eab308"; // yellow-500
    case "Sondermüll":
      return "#ef4444"; // red-500
  }
}

/**
 * Linke Karten-Border in Easy View — gemäß WASTE_CODE-Farben (REST, PAPIER, PLASTIC, BIO, …).
 * Mock-Typen: Rest, Papier, Bio, Recycling (→ Kunststoff/Gelb), Sondermüll (→ Sonstige/Orange).
 */
export function getEasyViewWasteBorderColor(type: BinType): string {
  switch (type) {
    case "Rest":
      return "#1D1D1B";
    case "Papier":
      return "#3EB6FF";
    case "Bio":
      return "#21C21B";
    case "Recycling":
      return "#EED400";
    case "Sondermüll":
      return "#C04F15";
  }
}

/** Sortierung Easy View: zuerst rot, dann grün; innerhalb gleicher Stufe höherer Füllstand zuerst */
export function getFillAmpelSortRank(fillLevel: number): number {
  return getFillAmpelLevel(fillLevel) === "red" ? 0 : 1;
}
