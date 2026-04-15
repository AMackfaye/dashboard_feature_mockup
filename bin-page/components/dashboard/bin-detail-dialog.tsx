"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SmartBin, getStatusLevel, getStatusColor, getBinTypeColor } from "@/lib/types";
import { 
  Building2, 
  Layers, 
  MapPin, 
  Thermometer, 
  Battery, 
  Clock, 
  TrendingUp,
  Wifi,
  WifiOff,
  CircleDot,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { 
  Area, 
  AreaChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  Line,
  LineChart,
  ReferenceLine
} from "recharts";

interface BinDetailDialogProps {
  bin: SmartBin | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Generate hourly fill data for today
function generateHourlyData(currentFillLevel: number) {
  const data = [];
  const now = new Date();
  const currentHour = now.getHours();
  
  let level = currentFillLevel * 0.4;
  for (let i = 0; i <= currentHour; i++) {
    level = Math.max(0, Math.min(100, level + (Math.random() - 0.3) * 8));
    data.push({
      time: `${i.toString().padStart(2, "0")}:00`,
      fillLevel: Math.round(level),
    });
  }
  data[data.length - 1].fillLevel = currentFillLevel;
  return data;
}

// Generate weekly fill data
function generateWeeklyData(currentFillLevel: number) {
  const days = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
  const daysFull = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];
  const today = new Date().getDay();
  const adjustedToday = today === 0 ? 6 : today - 1;
  
  return days.map((day, index) => ({
    day,
    dayFull: daysFull[index],
    fillLevel: index === adjustedToday 
      ? currentFillLevel 
      : Math.round(20 + Math.random() * 60),
    isToday: index === adjustedToday,
  }));
}

// Custom tooltip for charts
function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload || !payload.length) return null;
  
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-xl">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold text-foreground">{payload[0].value}%</p>
    </div>
  );
}

export function BinDetailDialog({ bin, open, onOpenChange }: BinDetailDialogProps) {
  if (!bin) return null;

  const status = getStatusLevel(bin.fillLevel, bin.status === "offline");
  const statusColor = getStatusColor(status);
  const typeColor = getBinTypeColor(bin.type);
  const hourlyData = generateHourlyData(bin.fillLevel);
  const weeklyData = generateWeeklyData(bin.fillLevel);
  
  const avgFillLevel = Math.round(weeklyData.reduce((sum, d) => sum + d.fillLevel, 0) / weeklyData.length);
  const trend = bin.fillLevel - avgFillLevel;

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("de-DE", { 
        day: "2-digit", 
        month: "2-digit",
        year: "numeric",
        hour: "2-digit", 
        minute: "2-digit" 
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl border-border bg-background p-0 gap-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="border-b border-border bg-secondary/30 px-6 py-4">
          <div className="flex items-center gap-4">
            {/* Type badge */}
            <div 
              className="flex h-12 w-12 items-center justify-center rounded-xl"
              style={{ backgroundColor: typeColor + "20" }}
            >
              <span className="text-lg font-bold" style={{ color: typeColor }}>
                {bin.type.slice(0, 2).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <DialogTitle className="flex items-center gap-3 text-xl">
                {bin.binId}
                <span 
                  className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium"
                  style={{ 
                    backgroundColor: statusColor + "20",
                    color: statusColor 
                  }}
                >
                  <CircleDot className="h-3 w-3" />
                  {status === "green" ? "Normal" : status === "yellow" ? "Mittel" : status === "red" ? "Kritisch" : "Offline"}
                </span>
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">{bin.type} - {bin.volume}L</DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              {bin.status === "offline" ? (
                <div className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5">
                  <WifiOff className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Offline</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1.5">
                  <Wifi className="h-4 w-4 text-success" />
                  <span className="text-sm text-success">Online</span>
                </div>
              )}
            </div>
          </div>
        </DialogHeader>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="flex-1">
          <div className="border-b border-border px-6">
            <TabsList className="h-12 w-full justify-start rounded-none bg-transparent p-0">
              <TabsTrigger 
                value="overview" 
                className="relative h-12 rounded-none border-b-2 border-transparent bg-transparent px-4 data-[state=active]:border-accent data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                Übersicht
              </TabsTrigger>
              <TabsTrigger 
                value="analytics"
                className="relative h-12 rounded-none border-b-2 border-transparent bg-transparent px-4 data-[state=active]:border-accent data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                Analyse
              </TabsTrigger>
              <TabsTrigger 
                value="history"
                className="relative h-12 rounded-none border-b-2 border-transparent bg-transparent px-4 data-[state=active]:border-accent data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                Verlauf
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="m-0 p-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Left Column - Info Cards */}
              <div className="space-y-4">
                {/* Location Card */}
                <div className="rounded-xl border border-border bg-secondary/20 p-4">
                  <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">
                    Standort
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Gebäude</p>
                        <p className="font-medium text-foreground">{bin.location.building}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
                        <Layers className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Stockwerk</p>
                        <p className="font-medium text-foreground">{bin.location.floor}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Bereich / Zone</p>
                        <p className="font-medium text-foreground">{bin.location.area} / {bin.location.zone}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Card */}
                <div className="rounded-xl border border-border bg-secondary/20 p-4">
                  <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">
                    Status
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-secondary/50 p-3">
                      <div className="flex items-center gap-2">
                        <Battery className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Akku</span>
                      </div>
                      <p className="mt-1 text-xl font-semibold text-foreground">{bin.batteryLevel}%</p>
                    </div>
                    <div className="rounded-lg bg-secondary/50 p-3">
                      <div className="flex items-center gap-2">
                        <Thermometer className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Temperatur</span>
                      </div>
                      <p className="mt-1 text-xl font-semibold text-foreground">22°C</p>
                    </div>
                    <div className="rounded-lg bg-secondary/50 p-3">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Öffnungen</span>
                      </div>
                      <p className="mt-1 text-xl font-semibold text-foreground">{bin.openingsCount}</p>
                    </div>
                    <div className="rounded-lg bg-secondary/50 p-3">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Aktualisiert</span>
                      </div>
                      <p className="mt-1 text-sm font-medium text-foreground">{formatDate(bin.lastUpdated)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Fill Level */}
              <div className="space-y-4">
                {/* Current Fill Level */}
                <div 
                  className="rounded-xl border p-4"
                  style={{ 
                    borderColor: statusColor + "40",
                    backgroundColor: statusColor + "08"
                  }}
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                      Füllstand
                    </h3>
                    <div className="flex items-center gap-1">
                      {trend > 0 ? (
                        <ArrowUpRight className="h-4 w-4 text-critical" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-success" />
                      )}
                      <span className={`text-sm ${trend > 0 ? "text-critical" : "text-success"}`}>
                        {trend > 0 ? "+" : ""}{trend}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="mb-4 flex items-end gap-2">
                    <span 
                      className="text-5xl font-bold"
                      style={{ color: statusColor }}
                    >
                      {bin.fillLevel}
                    </span>
                    <span className="mb-2 text-2xl text-muted-foreground">%</span>
                  </div>

                  {/* Progress bar */}
                  <div className="h-3 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${bin.fillLevel}%`, backgroundColor: statusColor }}
                    />
                  </div>

                  {/* Prediction */}
                  {bin.prediction && (
                    <div className="mt-4 rounded-lg bg-secondary/50 p-3">
                      <p className="text-xs text-muted-foreground">Prognose</p>
                      <p className="text-sm font-medium text-foreground">
                        {bin.prediction.fillLevel}% voll am {formatDate(bin.prediction.date)}
                      </p>
                    </div>
                  )}
                </div>

                {/* Today's Chart */}
                <div className="rounded-xl border border-border bg-secondary/20 p-4">
                  <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">
                    Füllstand Heute
                  </h3>
                  <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={hourlyData}>
                        <defs>
                          <linearGradient id="fillGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={statusColor} stopOpacity={0.3} />
                            <stop offset="100%" stopColor={statusColor} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid 
                          strokeDasharray="3 3" 
                          stroke="hsl(var(--border))" 
                          vertical={false}
                        />
                        <XAxis 
                          dataKey="time" 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                          interval="preserveStartEnd"
                        />
                        <YAxis 
                          domain={[0, 100]}
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                          width={30}
                        />
                        <Tooltip content={<ChartTooltip />} />
                        <Area
                          type="monotone"
                          dataKey="fillLevel"
                          stroke={statusColor}
                          strokeWidth={2}
                          fill="url(#fillGradient)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="m-0 p-6">
            <div className="space-y-6">
              {/* Weekly Chart */}
              <div className="rounded-xl border border-border bg-secondary/20 p-4">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                    Wöchentlicher Füllstand
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: statusColor }} />
                      <span>Füllstand</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-px w-4 border-t-2 border-dashed border-muted-foreground" />
                      <span>Durchschnitt ({avgFillLevel}%)</span>
                    </div>
                  </div>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weeklyData}>
                      <CartesianGrid 
                        strokeDasharray="3 3" 
                        stroke="hsl(var(--border))" 
                        vertical={false}
                      />
                      <XAxis 
                        dataKey="day" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                      />
                      <YAxis 
                        domain={[0, 100]}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                        width={30}
                      />
                      <Tooltip content={<ChartTooltip />} />
                      <ReferenceLine 
                        y={avgFillLevel} 
                        stroke="hsl(var(--muted-foreground))"
                        strokeDasharray="5 5"
                      />
                      <ReferenceLine 
                        y={80} 
                        stroke="hsl(var(--critical))"
                        strokeDasharray="3 3"
                        strokeOpacity={0.5}
                      />
                      <Line
                        type="monotone"
                        dataKey="fillLevel"
                        stroke={statusColor}
                        strokeWidth={2}
                        dot={(props) => {
                          const { cx, cy, payload } = props;
                          return (
                            <circle
                              cx={cx}
                              cy={cy}
                              r={payload.isToday ? 6 : 4}
                              fill={payload.isToday ? statusColor : "hsl(var(--background))"}
                              stroke={statusColor}
                              strokeWidth={2}
                            />
                          );
                        }}
                        activeDot={{ r: 6, fill: statusColor }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid gap-4 md:grid-cols-4">
                <div className="rounded-xl border border-border bg-secondary/20 p-4">
                  <p className="text-xs text-muted-foreground">Durchschnitt</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">{avgFillLevel}%</p>
                </div>
                <div className="rounded-xl border border-border bg-secondary/20 p-4">
                  <p className="text-xs text-muted-foreground">Maximum</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">
                    {Math.max(...weeklyData.map(d => d.fillLevel))}%
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-secondary/20 p-4">
                  <p className="text-xs text-muted-foreground">Minimum</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">
                    {Math.min(...weeklyData.map(d => d.fillLevel))}%
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-secondary/20 p-4">
                  <p className="text-xs text-muted-foreground">Trend</p>
                  <p className={`mt-1 flex items-center gap-1 text-2xl font-bold ${trend > 0 ? "text-critical" : "text-success"}`}>
                    {trend > 0 ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownRight className="h-5 w-5" />}
                    {Math.abs(trend)}%
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="m-0 p-6">
            <div className="rounded-xl border border-border bg-secondary/20 p-4">
              <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Letzte Aktivitäten
              </h3>
              <div className="space-y-3">
                {[
                  { time: "Heute, 14:32", event: "Füllstand aktualisiert", value: `${bin.fillLevel}%` },
                  { time: "Heute, 12:15", event: "Behälter geöffnet", value: `+1 Öffnung` },
                  { time: "Gestern, 18:45", event: "Füllstand kritisch", value: "85%" },
                  { time: "Gestern, 09:00", event: "Behälter geleert", value: "0%" },
                  { time: "11.04.2026, 16:20", event: "Batterie geladen", value: "100%" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between rounded-lg bg-secondary/30 p-3">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-accent" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{item.event}</p>
                        <p className="text-xs text-muted-foreground">{item.time}</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-foreground">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
