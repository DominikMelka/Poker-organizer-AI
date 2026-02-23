"use client";

import { usePokerStore } from "@/lib/poker-store";
import { Coins } from "lucide-react";

export function BlindsDisplay() {
  const { currentLevel, blindLevels } = usePokerStore();

  const currentBlinds = blindLevels.find((b) => b.level === currentLevel);
  const nextBlinds = blindLevels.find((b) => b.level === currentLevel + 1);

  return (
    <div className="rounded-2xl bg-card border border-border p-6">
      <div className="flex items-center gap-2 mb-4">
        <Coins className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Blindy</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-secondary/50 rounded-xl p-4 text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
            Aktuální
          </p>
          <p className="text-3xl font-bold text-primary tabular-nums">
            {currentBlinds
              ? `${currentBlinds.smallBlind} / ${currentBlinds.bigBlind}`
              : "—"}
          </p>
        </div>

        <div className="bg-secondary/50 rounded-xl p-4 text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
            Další
          </p>
          <p className="text-3xl font-bold text-muted-foreground tabular-nums">
            {nextBlinds
              ? `${nextBlinds.smallBlind} / ${nextBlinds.bigBlind}`
              : "—"}
          </p>
        </div>
      </div>
    </div>
  );
}
