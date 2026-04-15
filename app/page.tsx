"use client";

import { useState } from "react";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { FilterHeader, type DashboardViewMode } from "@/components/dashboard/header";
import { DashboardGrid } from "@/components/dashboard/dashboard-grid";
import { StatsOverview } from "@/components/dashboard/stats-overview";
import { BinDetailDialog } from "@/components/dashboard/bin-detail-dialog";
import { mockSmartBins, mockWasteStations } from "@/lib/mock-data";
import { SmartBin } from "@/lib/types";

export default function SmartWasteDashboard() {
  const [viewMode, setViewMode] = useState<DashboardViewMode>("bins");
  const [searchQuery, setSearchQuery] = useState("");
  const [timeRange, setTimeRange] = useState("24h");
  
  // Dialog state
  const [selectedBin, setSelectedBin] = useState<SmartBin | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleBinClick = (bin: SmartBin) => {
    setSelectedBin(bin);
    setIsDialogOpen(true);
  };

  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      // Small delay before clearing selected bin for smooth animation
      setTimeout(() => setSelectedBin(null), 200);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <DashboardSidebar activeItem="Overview" />

      {/* Main Content — Easy View: fester Kopf, nur Kartenbereich scrollt */}
      <main
        className={
          viewMode === "easy"
            ? "ml-56 flex h-[100dvh] min-h-0 flex-col overflow-hidden"
            : "ml-56"
        }
      >
        <div className={viewMode === "easy" ? "shrink-0" : ""}>
          <FilterHeader
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
          />
        </div>

        <div
          className={
            viewMode === "easy"
              ? "mx-auto flex min-h-0 w-full max-w-[1600px] flex-1 flex-col px-4 pb-0 pt-4 sm:px-6"
              : "mx-auto w-full max-w-[1600px] p-6"
          }
        >
          {viewMode !== "easy" ? <StatsOverview bins={mockSmartBins} /> : null}

          <DashboardGrid
            bins={mockSmartBins}
            stations={mockWasteStations}
            viewMode={viewMode}
            searchQuery={searchQuery}
            onBinClick={viewMode === "easy" ? undefined : handleBinClick}
          />
        </div>
      </main>

      {/* Bin Detail Dialog */}
      <BinDetailDialog
        bin={selectedBin}
        open={isDialogOpen}
        onOpenChange={handleDialogClose}
      />
    </div>
  );
}
