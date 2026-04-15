"use client";

import { Card } from "@/components/ui/card";
import { SmartBin, getStatusLevel } from "@/lib/types";
import { Trash2, AlertTriangle, Wifi, Battery, TrendingUp } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

interface StatsOverviewProps {
  bins: SmartBin[];
}

// Generate trend data for mini charts
function generateTrendData(baseValue: number, variance: number = 10) {
  const data = [];
  let current = baseValue;
  for (let i = 0; i < 24; i++) {
    current = Math.max(0, Math.min(100, current + (Math.random() - 0.5) * variance));
    data.push({ value: current });
  }
  return data;
}

export function StatsOverview({ bins }: StatsOverviewProps) {
  const totalBins = bins.length;
  const onlineBins = bins.filter(b => b.status === "online").length;
  const criticalBins = bins.filter(b => getStatusLevel(b.fillLevel) === "red").length;
  const warningBins = bins.filter(b => getStatusLevel(b.fillLevel) === "yellow").length;
  const avgFillLevel = Math.round(bins.reduce((acc, b) => acc + b.fillLevel, 0) / bins.length);
  const avgBattery = Math.round(bins.reduce((acc, b) => acc + b.batteryLevel, 0) / bins.length);

  const stats = [
    {
      label: "Behälter gesamt",
      value: totalBins,
      subValue: `${onlineBins} online`,
      icon: <Trash2 className="h-5 w-5" />,
      color: "#22c55e",
      trend: generateTrendData(onlineBins / totalBins * 100, 5),
    },
    {
      label: "Kritisch",
      value: criticalBins,
      subValue: `${Math.round(criticalBins / totalBins * 100)}%`,
      icon: <AlertTriangle className="h-5 w-5" />,
      color: "#ef4444",
      trend: generateTrendData(criticalBins / totalBins * 100, 15),
    },
    {
      label: "Durchschn. Füllstand",
      value: `${avgFillLevel}%`,
      subValue: `${warningBins} Warnung`,
      icon: <TrendingUp className="h-5 w-5" />,
      color: avgFillLevel >= 80 ? "#ef4444" : avgFillLevel >= 50 ? "#eab308" : "#22c55e",
      trend: generateTrendData(avgFillLevel, 8),
    },
    {
      label: "Durchschn. Akku",
      value: `${avgBattery}%`,
      subValue: `${bins.filter(b => b.batteryLevel < 20).length} niedrig`,
      icon: <Battery className="h-5 w-5" />,
      color: avgBattery > 50 ? "#22c55e" : avgBattery > 20 ? "#eab308" : "#ef4444",
      trend: generateTrendData(avgBattery, 3),
    },
  ];

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index} className="relative overflow-hidden border border-border bg-card p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {stat.label}
              </p>
              <p className="mt-2 text-3xl font-bold text-foreground">{stat.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.subValue}</p>
            </div>
            <div 
              className="flex h-10 w-10 items-center justify-center rounded-lg"
              style={{ backgroundColor: stat.color + "15" }}
            >
              <span style={{ color: stat.color }}>{stat.icon}</span>
            </div>
          </div>
          
          {/* Mini trend chart */}
          <div className="absolute bottom-0 left-0 right-0 h-12 opacity-50">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stat.trend}>
                <defs>
                  <linearGradient id={`stat-gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={stat.color} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={stat.color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={stat.color}
                  strokeWidth={1.5}
                  fill={`url(#stat-gradient-${index})`}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      ))}
    </div>
  );
}
