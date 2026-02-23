"use client";

import { usePokerStore } from "@/lib/poker-store";
import { TableCard } from "./table-card";
import { Banknote } from "lucide-react";

export function TablesSection() {
  const { activeTables, players, buyInAmount, rebuyAmount } = usePokerStore();

  const totalBuyIns =
    players.filter((p) => p.tableId !== null).length * buyInAmount;
  const totalRebuys =
    players.reduce((sum, p) => sum + p.rebuys, 0) * rebuyAmount;
  const grandTotal = totalBuyIns + totalRebuys;

  const formatCurrency = (amount: number) =>
    `${amount.toLocaleString("cs-CZ")} Kč`;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="rounded-2xl bg-card border border-border p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
              <Banknote className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Celkem na všech stolech</p>
              <p className="text-3xl font-bold text-accent tabular-nums">
                {formatCurrency(grandTotal)}
              </p>
            </div>
          </div>
          <div className="text-right space-y-1">
            <p className="text-sm text-muted-foreground">
              {players.filter((p) => p.tableId !== null).length} hráčů ×{" "}
              {formatCurrency(buyInAmount)} ={" "}
              <span className="text-foreground font-medium">
                {formatCurrency(totalBuyIns)}
              </span>
            </p>
            <p className="text-sm text-muted-foreground">
              {players.reduce((sum, p) => sum + p.rebuys, 0)} dokupů ×{" "}
              {formatCurrency(rebuyAmount)} ={" "}
              <span className="text-foreground font-medium">
                {formatCurrency(totalRebuys)}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {Array.from({ length: activeTables }, (_, i) => i + 1).map(
          (tableNumber) => (
            <TableCard key={tableNumber} tableNumber={tableNumber} />
          )
        )}
      </div>
    </div>
  );
}
