"use client";

import { Card } from "@/components/ui/card";
import { WasteStation, getStatusLevel, getBinTypeColor } from "@/lib/types";
import { MapPin, ChevronRight, Trash2 } from "lucide-react";

interface WasteStationCardProps {
  station: WasteStation;
  onClick?: () => void;
}

export function WasteStationCard({ station, onClick }: WasteStationCardProps) {
  const avgFillLevel = Math.round(
    station.bins.reduce((acc, bin) => acc + bin.fillLevel, 0) / station.bins.length
  );
  const overallStatus = getStatusLevel(avgFillLevel);
  
  const statusColors = {
    green: { border: "border-success/30", bg: "bg-success", text: "text-success" },
    yellow: { border: "border-warning/30", bg: "bg-warning", text: "text-warning" },
    red: { border: "border-critical/30", bg: "bg-critical", text: "text-critical" },
    gray: { border: "border-muted", bg: "bg-muted-foreground", text: "text-muted-foreground" },
  };
  
  const colors = statusColors[overallStatus];
  const criticalBins = station.bins.filter(b => b.fillLevel >= 80).length;

  return (
    <Card
      className={`group relative overflow-hidden border bg-card transition-all duration-300 hover:border-accent/50 hover:shadow-lg cursor-pointer ${colors.border}`}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between p-4 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground">{station.name}</h3>
            <span className="rounded-md bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
              {station.stationId}
            </span>
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            <span>{station.location.building} · {station.location.floor}</span>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      </div>

      {/* Bins Overview */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Trash2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{station.bins.length} Behälter</span>
          </div>
          {criticalBins > 0 && (
            <span className="text-xs font-medium text-critical">
              {criticalBins} kritisch
            </span>
          )}
        </div>

        {/* Visual bin indicators */}
        <div className="grid grid-cols-3 gap-2">
          {station.bins.map((bin) => {
            const binStatus = getStatusLevel(bin.fillLevel, bin.status === "offline");
            const binStatusColors = statusColors[binStatus];
            const typeColor = getBinTypeColor(bin.type);
            
            return (
              <div
                key={bin.id}
                className="relative flex flex-col items-center rounded-lg border border-border bg-secondary/30 p-3"
              >
                {/* Type indicator */}
                <div 
                  className="mb-2 flex h-8 w-8 items-center justify-center rounded-md"
                  style={{ backgroundColor: typeColor + "20" }}
                >
                  <span className="text-[10px] font-bold" style={{ color: typeColor }}>
                    {bin.type.slice(0, 2).toUpperCase()}
                  </span>
                </div>
                
                {/* Fill level */}
                <span className={`text-lg font-bold ${binStatusColors.text}`}>
                  {bin.fillLevel}%
                </span>
                
                {/* Progress bar */}
                <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className={`h-full rounded-full transition-all ${binStatusColors.bg}`}
                    style={{ width: `${bin.fillLevel}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer with status bar */}
      <div className="border-t border-border bg-secondary/20 px-4 py-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Durchschnitt</span>
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${colors.bg}`} />
            <span className={`text-sm font-medium ${colors.text}`}>
              {avgFillLevel}%
            </span>
          </div>
        </div>
      </div>

      {/* Bottom status line */}
      <div className="flex h-1">
        {station.bins.map((bin) => {
          const binStatus = getStatusLevel(bin.fillLevel, bin.status === "offline");
          return (
            <div
              key={bin.id}
              className={`flex-1 ${statusColors[binStatus].bg}`}
            />
          );
        })}
      </div>
    </Card>
  );
}
