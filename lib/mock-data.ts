import type { SmartBin, WasteStation, HourlyFillData, WeeklyFillData } from "./types";
import { getStatusLevel } from "./types";

let binIdCounter = 10001;

function generateSmartBin(building: string, floor: string, area: string, zone: string, type: SmartBin["type"]): SmartBin {
  const fillLevel = Math.floor(Math.random() * 100);
  const isOffline = Math.random() > 0.92;
  const hasPrediction = Math.random() > 0.3 && !isOffline;
  
  const bin: SmartBin = {
    id: `bin-${binIdCounter}`,
    binId: String(binIdCounter++),
    type,
    fillLevel,
    status: isOffline ? "offline" : "online",
    volume: 25,
    batteryLevel: Math.floor(30 + Math.random() * 70),
    lastUpdated: new Date().toISOString(),
    openingsCount: Math.floor(Math.random() * 600),
    prediction: hasPrediction ? {
      fillLevel: Math.min(100, fillLevel + Math.floor(Math.random() * 30)),
      date: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    } : null,
    location: {
      building,
      floor,
      area,
      zone,
    },
  };
  
  return bin;
}

function calculateStationStatus(bins: SmartBin[]): WasteStation["aggregatedStatus"] {
  const onlineBins = bins.filter(b => b.status === "online");
  if (onlineBins.length === 0) return "gray";
  
  const maxFillLevel = Math.max(...onlineBins.map(b => b.fillLevel));
  return getStatusLevel(maxFillLevel);
}

function generateStation(
  name: string,
  stationId: string,
  building: string,
  floor: string,
  area: string,
  zone: string,
  binTypes: SmartBin["type"][]
): WasteStation {
  const bins = binTypes.map(type => generateSmartBin(building, floor, area, zone, type));
  
  return {
    id: `station-${stationId}`,
    name,
    stationId: `Station-${stationId}`,
    location: {
      building,
      floor,
      area,
      zone,
    },
    bins,
    aggregatedStatus: calculateStationStatus(bins),
  };
}

export const mockSmartBins: SmartBin[] = [];

// Generate individual bins for Smart Bins view
const binConfigs = [
  { building: "Hauptcampus A", floor: "UG", area: "Bereich A-10", zone: "Zone 1", type: "Recycling" as const },
  { building: "Hauptcampus A", floor: "UG", area: "Bereich B-11", zone: "Zone 1", type: "Rest" as const },
  { building: "Hauptcampus A", floor: "UG", area: "Bereich C-12", zone: "Zone 1", type: "Bio" as const },
  { building: "Hauptcampus A", floor: "EG", area: "Bereich A-20", zone: "Zone 1", type: "Papier" as const },
  { building: "Hauptcampus A", floor: "EG", area: "Bereich B-21", zone: "Zone 2", type: "Recycling" as const },
  { building: "Hauptcampus A", floor: "1. OG", area: "Bereich A-30", zone: "Zone 1", type: "Rest" as const },
  { building: "Hauptcampus A", floor: "1. OG", area: "Bereich B-31", zone: "Zone 1", type: "Bio" as const },
  { building: "Hauptcampus A", floor: "2. OG", area: "Bereich A-40", zone: "Zone 1", type: "Sondermüll" as const },
  { building: "Logistik B", floor: "EG", area: "Bereich A-10", zone: "Zone 1", type: "Recycling" as const },
  { building: "Logistik B", floor: "EG", area: "Bereich B-11", zone: "Zone 1", type: "Rest" as const },
  { building: "Logistik B", floor: "1. OG", area: "Bereich A-20", zone: "Zone 2", type: "Bio" as const },
  { building: "Logistik B", floor: "2. OG", area: "Bereich A-30", zone: "Zone 1", type: "Papier" as const },
  { building: "Technikum D", floor: "UG", area: "Bereich A-10", zone: "Zone 1", type: "Sondermüll" as const },
  { building: "Technikum D", floor: "EG", area: "Bereich B-20", zone: "Zone 1", type: "Recycling" as const },
  { building: "Technikum D", floor: "1. OG", area: "Bereich C-30", zone: "Zone 2", type: "Rest" as const },
  { building: "Verwaltung E", floor: "EG", area: "Bereich A-10", zone: "Zone 1", type: "Papier" as const },
  { building: "Verwaltung E", floor: "1. OG", area: "Bereich B-20", zone: "Zone 1", type: "Bio" as const },
  { building: "Verwaltung E", floor: "2. OG", area: "Bereich C-30", zone: "Zone 2", type: "Recycling" as const },
];

for (const config of binConfigs) {
  mockSmartBins.push(generateSmartBin(config.building, config.floor, config.area, config.zone, config.type));
}

// Reset counter for stations
binIdCounter = 20001;

export const mockWasteStations: WasteStation[] = [
  generateStation("Haupteingang", "10001", "Hauptcampus A", "EG", "Bereich A-10", "Zone 1", ["Recycling", "Bio", "Rest"]),
  generateStation("Cafeteria", "10029", "Hauptcampus A", "1. OG", "Bereich D-63", "Zone 1", ["Bio", "Recycling"]),
  generateStation("Lager Nord", "10057", "Logistik B", "EG", "Bereich B-61", "Zone 2", ["Rest", "Recycling"]),
  generateStation("Labor 3", "10085", "Technikum D", "2. OG", "Bereich E-14", "Zone 1", ["Sondermüll", "Rest"]),
  generateStation("Konferenz", "10113", "Verwaltung E", "3. OG", "Bereich C-52", "Zone 1", ["Papier", "Recycling"]),
  generateStation("Empfang", "10141", "Verwaltung E", "EG", "Bereich A-50", "Zone 2", ["Rest", "Bio", "Papier"]),
];

export function generateHourlyData(): HourlyFillData[] {
  const data: HourlyFillData[] = [];
  let currentLevel = 60 + Math.random() * 20;

  for (let hour = 0; hour < 24; hour += 2) {
    const variation = (Math.random() - 0.5) * 10;
    currentLevel = Math.max(0, Math.min(100, currentLevel + variation));
    data.push({
      time: `${hour.toString().padStart(2, "0")}:00`,
      fillLevel: Math.round(currentLevel),
    });
  }

  return data;
}

export function generateWeeklyData(): WeeklyFillData[] {
  const days = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
  return days.map((day) => ({
    day,
    fillLevel: Math.floor(20 + Math.random() * 60),
  }));
}
