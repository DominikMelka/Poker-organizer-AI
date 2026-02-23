"use client";

import { cn } from "@/lib/utils";
import { Spade, LayoutGrid, Settings } from "lucide-react";

interface NavbarProps {
  activeTab: "poker" | "tables" | "settings";
  onTabChange: (tab: "poker" | "tables" | "settings") => void;
}

export function Navbar({ activeTab, onTabChange }: NavbarProps) {
  const tabs = [
    { id: "poker" as const, label: "Poker", icon: Spade },
    { id: "tables" as const, label: "Stoly", icon: LayoutGrid },
    { id: "settings" as const, label: "Nastavení", icon: Settings },
  ];

  return (
    <nav className="border-b border-border bg-card">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Spade className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg text-foreground">
              Poker Organizer
            </span>
          </div>

          <div className="flex items-center gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors",
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
