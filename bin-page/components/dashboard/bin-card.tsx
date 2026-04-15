"use client";

import { Card } from "@/components/ui/card";
import { SmartBin, getStatusLevel, getBinTypeColor } from "@/lib/types";
import { Battery, Clock, Wifi, WifiOff, TrendingUp, ChevronRight } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

interface SmartBinCardProps {
  bin: SmartBin;
  onClick?: () => void;
}

// Generate mini sparkline data
function generateSparklineData(fillLevel: number) {
  const data = [];
  let current = fillLevel * 0.6;
  for (let i = 0; i < 12; i++) {
    current = Math.max(0, Math.min(100, current + (Math.random() - 0.3) * 15));
    data.push({ value: current });
  }
  data.push({ value: fillLevel });
  return data;
}

export function SmartBinCard({ bin, onClick }: SmartBinCardProps) {
  const status = getStatusLevel(bin.fillLevel, bin.status === "offline");
  const typeColor = getBinTypeColor(bin.type);
  const sparklineData = generateSparklineData(bin.fillLevel);
  
  const statusColors = {
    green: { bg: "bg-success/10", text: "text-success", glow: "glow-success" },
    yellow: { bg: "bg-warning/10", text: "text-warning", glow: "glow-warning" },
    red: { bg: "bg-critical/10", text: "text-critical", glow: "glow-critical" },
    gray: { bg: "bg-muted", text: "text-muted-foreground", glow: "" },
  };
  
  const colors = statusColors[status];
  const chartColor = status === "green" ? "#22c55e" : status === "yellow" ? "#eab308" : status === "red" ? "#ef4444" : "#6b7280";

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
    } catch {
      return dateStr;
    }
  };

  return (
    <Card
      className={`group relative overflow-hidden border border-border bg-card transition-all duration-300 hover:border-accent/50 hover:shadow-lg cursor-pointer ${colors.glow}`}
      onClick={onClick}
    >
      {/* Status indicator line */}
      <div 
        className="absolute left-0 top-0 h-full w-1 transition-all"
        style={{ backgroundColor: chartColor }}
      />

      {/* Header */}
      <div className="flex items-start justify-between p-4 pb-3">
        <div className="flex items-center gap-3">
          {/* Type badge */}
          <div 
            className="flex h-10 w-10 items-center justify-center rounded-lg"
            style={{ backgroundColor: typeColor + "20" }}
          >
            <span className="text-xs font-bold" style={{ color: typeColor }}>
              {bin.type.slice(0, 2).toUpperCase()}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground">{bin.binId}</h3>
              {bin.status === "offline" ? (
                <WifiOff className="h-3.5 w-3.5 text-muted-foreground" />
              ) : (
                <Wifi className="h-3.5 w-3.5 text-success" />
              )}
            </div>
            <p className="text-xs text-muted-foreground">{bin.type}</p>
          </div>
        </div>
        
        <ChevronRight className="h-5 w-5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      </div>

      {/* Location */}
      <div className="px-4 pb-3">
        <p className="text-sm text-muted-foreground">
          {bin.location.building} · {bin.location.floor}
        </p>
        <p className="text-xs text-muted-foreground/70">
          {bin.location.area} / {bin.location.zone}
        </p>
      </div>

      {/* Fill Level Section */}
      <div className="mx-4 rounded-lg border border-border bg-secondary/30 p-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Füllstand</span>
          <span className={`text-2xl font-bold ${colors.text}`}>
            {bin.fillLevel}%
          </span>
        </div>
        
        {/* Mini chart */}
        <div className="h-12">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparklineData}>
              <defs>
                <linearGradient id={`gradient-${bin.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={chartColor} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={chartColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke={chartColor}
                strokeWidth={1.5}
                fill={`url(#gradient-${bin.id})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Progress bar */}
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${bin.fillLevel}%`, backgroundColor: chartColor }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-2 p-4">
        <div className="flex flex-col items-center rounded-lg bg-secondary/30 p-2">
          <Battery className="mb-1 h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">{bin.batteryLevel}%</span>
          <span className="text-[10px] text-muted-foreground">Akku</span>
        </div>
        <div className="flex flex-col items-center rounded-lg bg-secondary/30 p-2">
          <TrendingUp className="mb-1 h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">{bin.openingsCount}</span>
          <span className="text-[10px] text-muted-foreground">Öffnungen</span>
        </div>
        <div className="flex flex-col items-center rounded-lg bg-secondary/30 p-2">
          <Clock className="mb-1 h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">{bin.volume}L</span>
          <span className="text-[10px] text-muted-foreground">Volumen</span>
        </div>
      </div>

      {/* Prediction Footer */}
      <div className="border-t border-border bg-secondary/20 px-4 py-3">
        {bin.prediction ? (
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Prognose</span>
            <span className="text-xs font-medium text-foreground">
              {bin.prediction.fillLevel}% am {formatDate(bin.prediction.date)}
            </span>
          </div>
        ) : (
          <p className="text-center text-xs text-muted-foreground">
            Keine Prognose verfügbar
          </p>
        )}
      </div>
    </Card>
  );
}
