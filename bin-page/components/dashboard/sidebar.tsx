"use client";

import { cn } from "@/lib/utils";
import {
  LayoutGrid,
  BarChart3,
  Calendar,
  Building2,
  MessageSquareText,
  Settings,
  LogOut,
  Trash2,
} from "lucide-react";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  badge?: string;
}

const navItems: NavItem[] = [
  { icon: <LayoutGrid className="h-5 w-5" />, label: "Overview", href: "/", badge: "Internal" },
  { icon: <BarChart3 className="h-5 w-5" />, label: "Analytics", href: "/analytics" },
  { icon: <Trash2 className="h-5 w-5" />, label: "Smart Bins", href: "/bins" },
  { icon: <Building2 className="h-5 w-5" />, label: "Stationen", href: "/stations" },
  { icon: <Calendar className="h-5 w-5" />, label: "Planer", href: "/planner" },
  { icon: <MessageSquareText className="h-5 w-5" />, label: "Feedback", href: "/feedback" },
];

const bottomItems: NavItem[] = [
  { icon: <Settings className="h-5 w-5" />, label: "Einstellungen", href: "/settings" },
  { icon: <LogOut className="h-5 w-5" />, label: "Abmelden", href: "/logout" },
];

interface DashboardSidebarProps {
  activeItem?: string;
}

export function DashboardSidebar({ activeItem = "Overview" }: DashboardSidebarProps) {
  return (
    <aside className="fixed left-0 top-0 z-50 h-screen w-56 flex-col border-r border-border bg-sidebar">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2 border-b border-border px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
          <Trash2 className="h-4 w-4 text-accent-foreground" />
        </div>
        <span className="font-semibold text-foreground">SmartWaste</span>
      </div>

      <div className="flex h-[calc(100vh-3.5rem)] flex-col justify-between p-3">
        {/* Main Navigation */}
        <nav className="flex flex-col gap-1">
          <span className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Dashboard
          </span>
          {navItems.map((item) => {
            const isActive = item.label === activeItem;
            return (
              <button
                key={item.label}
                className={cn(
                  "group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200",
                  isActive
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                )}
              >
                <span className={cn(
                  "transition-colors",
                  isActive ? "text-accent" : "text-muted-foreground group-hover:text-foreground"
                )}>
                  {item.icon}
                </span>
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <span className="rounded-full bg-accent/20 px-2 py-0.5 text-xs font-medium text-accent">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Navigation */}
        <nav className="flex flex-col gap-1 border-t border-border pt-3">
          {bottomItems.map((item) => {
            const isActive = item.label === activeItem;
            return (
              <button
                key={item.label}
                className={cn(
                  "group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200",
                  isActive
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                )}
              >
                <span className="transition-colors text-muted-foreground group-hover:text-foreground">
                  {item.icon}
                </span>
                <span className="flex-1 text-left">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
