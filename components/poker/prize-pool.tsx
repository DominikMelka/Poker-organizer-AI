"use client";

import { usePokerStore } from "@/lib/poker-store";
import { Trophy, Medal } from "lucide-react";

export function PrizePool() {
  const { players, buyInAmount, rebuyAmount } = usePokerStore();

  const totalBuyIns = players.filter((p) => p.tableId !== null).length * buyInAmount;
  const totalRebuys = players.reduce((sum, p) => sum + p.rebuys, 0) * rebuyAmount;
  const prizePool = totalBuyIns + totalRebuys;

  const firstPlace = Math.round(prizePool * 0.5);
  const secondPlace = Math.round(prizePool * 0.3);
  const thirdPlace = Math.round(prizePool * 0.2);

  const formatCurrency = (amount: number) => `${amount.toLocaleString("cs-CZ")} Kč`;

  return (
    <div className="rounded-2xl bg-card border border-border p-6">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-5 h-5 text-accent" />
        <h2 className="text-lg font-semibold text-foreground">Prize Pool</h2>
      </div>

      <div className="text-center mb-6">
        <p className="text-5xl font-bold text-accent tabular-nums">
          {formatCurrency(prizePool)}
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          {players.filter((p) => p.tableId !== null).length} hráčů • {players.reduce((sum, p) => sum + p.rebuys, 0)} dokupů
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between bg-accent/20 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <Medal className="w-5 h-5 text-accent" />
            <span className="font-medium text-foreground">1. místo</span>
            <span className="text-xs text-muted-foreground">(50%)</span>
          </div>
          <span className="font-bold text-accent tabular-nums">
            {formatCurrency(firstPlace)}
          </span>
        </div>

        <div className="flex items-center justify-between bg-secondary/50 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <Medal className="w-5 h-5 text-muted-foreground" />
            <span className="font-medium text-foreground">2. místo</span>
            <span className="text-xs text-muted-foreground">(30%)</span>
          </div>
          <span className="font-bold text-foreground tabular-nums">
            {formatCurrency(secondPlace)}
          </span>
        </div>

        <div className="flex items-center justify-between bg-secondary/50 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <Medal className="w-5 h-5 text-muted-foreground" />
            <span className="font-medium text-foreground">3. místo</span>
            <span className="text-xs text-muted-foreground">(20%)</span>
          </div>
          <span className="font-bold text-foreground tabular-nums">
            {formatCurrency(thirdPlace)}
          </span>
        </div>
      </div>
    </div>
  );
}
