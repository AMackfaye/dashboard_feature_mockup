"use client";

import { useMemo } from "react";
import { SmartBin, WasteStation, getFillAmpelSortRank } from "@/lib/types";
import { SmartBinCard } from "./bin-card";
import { WasteStationCard } from "./station-card";
import { EasyBinCard } from "./easy-bin-card";
import { EasyViewSortBar } from "./easy-view-sort-bar";
import type { DashboardViewMode } from "./header";
import { Trash2 } from "lucide-react";

interface DashboardGridProps {
  bins: SmartBin[];
  stations: WasteStation[];
  viewMode: DashboardViewMode;
  searchQuery?: string;
  onBinClick?: (bin: SmartBin) => void;
  onStationClick?: (station: WasteStation) => void;
}

export function DashboardGrid({
  bins,
  stations,
  viewMode,
  searchQuery = "",
  onBinClick,
  onStationClick,
}: DashboardGridProps) {
  const filteredBins = useMemo(() => {
    let list = bins;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      list = bins.filter((bin) => {
        return (
          bin.binId.toLowerCase().includes(query) ||
          bin.type.toLowerCase().includes(query) ||
          bin.location.building.toLowerCase().includes(query) ||
          bin.location.floor.toLowerCase().includes(query) ||
          bin.location.area.toLowerCase().includes(query) ||
          bin.location.zone.toLowerCase().includes(query)
        );
      });
    }
    if (viewMode === "easy") {
      return [...list].sort((a, b) => {
        const ra = getFillAmpelSortRank(a.fillLevel);
        const rb = getFillAmpelSortRank(b.fillLevel);
        if (ra !== rb) return ra - rb;
        return b.fillLevel - a.fillLevel;
      });
    }
    return list;
  }, [bins, searchQuery, viewMode]);

  const filteredStations = useMemo(() => {
    if (!searchQuery) return stations;

    const query = searchQuery.toLowerCase();
    return stations.filter((station) => {
      return (
        station.name.toLowerCase().includes(query) ||
        station.stationId.toLowerCase().includes(query) ||
        station.location.building.toLowerCase().includes(query) ||
        station.location.area.toLowerCase().includes(query)
      );
    });
  }, [stations, searchQuery]);

  const EmptyState = ({ query }: { query: string }) => (
    <div className="col-span-full flex flex-col items-center justify-center py-16">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
        <Trash2 className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="mb-2 text-lg font-medium text-foreground">Keine Ergebnisse</h3>
      <p className="text-sm text-muted-foreground">
        Keine{" "}
        {viewMode === "stations" ? "Stationen" : "Behälter"} gefunden für &quot;{query}&quot;
      </p>
    </div>
  );

  if (viewMode === "easy") {
    return (
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <EasyViewSortBar bins={filteredBins} />
        <div
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-1 pt-3 pb-8"
          role="region"
          aria-label="Behälterliste"
        >
          <div
            className="mx-auto grid max-w-[1600px] grid-cols-1 gap-6 md:grid-cols-3"
            role="feed"
            aria-label="Behälter sortiert: kritisch, dann ok"
          >
            {filteredBins.length > 0 ? (
              filteredBins.map((bin) => <EasyBinCard key={bin.id} bin={bin} />)
            ) : (
              <div className="col-span-full md:col-span-3">
                <EmptyState query={searchQuery} />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (viewMode === "bins") {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredBins.length > 0 ? (
          filteredBins.map((bin) => (
            <SmartBinCard
              key={bin.id}
              bin={bin}
              onClick={() => onBinClick?.(bin)}
            />
          ))
        ) : (
          <EmptyState query={searchQuery} />
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {filteredStations.length > 0 ? (
        filteredStations.map((station) => (
          <WasteStationCard
            key={station.id}
            station={station}
            onClick={() => onStationClick?.(station)}
          />
        ))
      ) : (
        <EmptyState query={searchQuery} />
      )}
    </div>
  );
}
