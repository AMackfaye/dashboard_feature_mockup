"use client";

import { Bell, Search, LayoutGrid, List, Calendar, MoreHorizontal, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type DashboardViewMode = "bins" | "stations" | "easy";

interface FilterHeaderProps {
  viewMode: DashboardViewMode;
  onViewModeChange: (mode: DashboardViewMode) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  timeRange: string;
  onTimeRangeChange: (range: string) => void;
}

export function FilterHeader({ 
  viewMode, 
  onViewModeChange, 
  searchQuery, 
  onSearchChange,
  timeRange,
  onTimeRangeChange,
}: FilterHeaderProps) {
  const title =
    viewMode === "bins"
      ? "Smart Bins"
      : viewMode === "stations"
        ? "Stationen"
        : "Easy View";

  const isEasy = viewMode === "easy";

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border bg-background px-6 py-4">
      {/* Left: Title and tabs */}
      <div className="flex min-w-0 flex-wrap items-center gap-4 lg:gap-6">
        <h1 className={`shrink-0 font-semibold text-foreground ${isEasy ? "text-2xl" : "text-xl"}`}>
          {title}
        </h1>
        {isEasy ? (
          <p className="max-w-md text-sm text-muted-foreground">
            Nur das Wichtigste zum Leeren: Standort, Mülltyp, Füllstand und Volumen — groß und farbig erkennbar.
          </p>
        ) : null}

        {/* View tabs */}
        <div className="flex flex-wrap items-center rounded-lg border border-border bg-secondary/30 p-1">
          <button
            type="button"
            onClick={() => onViewModeChange("bins")}
            className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
              viewMode === "bins"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <LayoutGrid className="h-4 w-4 shrink-0" />
            Bins
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("stations")}
            className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
              viewMode === "stations"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <List className="h-4 w-4 shrink-0" />
            Stationen
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("easy")}
            className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
              viewMode === "easy"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
            aria-current={viewMode === "easy" ? "page" : undefined}
          >
            <Sparkles className="h-4 w-4 shrink-0" />
            Easy View
          </button>
        </div>
      </div>

      {/* Right: Controls — Easy View: nur Suche, weniger Ablenkung */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={isEasy ? "Raum, Gebäude oder Mülltyp suchen…" : "Suchen..."}
            aria-label={isEasy ? "Behälter suchen" : "Suche"}
            className={`rounded-lg border border-border bg-secondary/30 pl-9 pr-4 text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent ${
              isEasy ? "h-11 min-h-[44px] w-[min(100vw-3rem,28rem)] text-base" : "h-9 w-64 text-sm focus:ring-1"
            }`}
          />
        </div>

        {!isEasy ? (
          <>
            <Select value={timeRange} onValueChange={onTimeRangeChange}>
              <SelectTrigger className="h-9 w-40 border-border bg-secondary/30">
                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Zeitraum" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Letzte 24 Stunden</SelectItem>
                <SelectItem value="7d">Letzte 7 Tage</SelectItem>
                <SelectItem value="30d">Letzte 30 Tage</SelectItem>
                <SelectItem value="90d">Letzte 90 Tage</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="ghost" size="icon" className="relative h-9 w-9 text-muted-foreground hover:text-foreground">
              <Bell className="h-4 w-4" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent" />
            </Button>

            <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </>
        ) : null}
      </div>
    </div>
  );
}
