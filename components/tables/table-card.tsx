"use client";

import { usePokerStore, type Player } from "@/lib/poker-store";
import { Button } from "@/components/ui/button";
import { Users, Plus, Minus, Banknote, Trash2 } from "lucide-react";

interface TableCardProps {
  tableNumber: number;
}

export function TableCard({ tableNumber }: TableCardProps) {
  const { players, buyInAmount, rebuyAmount, addRebuy, removeRebuy, removePlayer } =
    usePokerStore();

  const tablePlayers = players.filter((p) => p.tableId === tableNumber);

  const tableTotal = tablePlayers.reduce(
    (sum, p) => sum + buyInAmount + p.rebuys * rebuyAmount,
    0
  );

  const formatCurrency = (amount: number) =>
    `${amount.toLocaleString("cs-CZ")} Kč`;

  return (
    <div className="rounded-2xl bg-card border border-border overflow-hidden">
      <div className="bg-secondary/50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-primary font-bold">{tableNumber}</span>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Stůl {tableNumber}</h3>
            <p className="text-sm text-muted-foreground">
              <Users className="w-3 h-3 inline mr-1" />
              {tablePlayers.length} / 9 hráčů
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Celkem</p>
          <p className="font-bold text-primary tabular-nums">
            {formatCurrency(tableTotal)}
          </p>
        </div>
      </div>

      <div className="p-4">
        {tablePlayers.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Žádní hráči u stolu
          </p>
        ) : (
          <div className="space-y-2">
            {tablePlayers.map((player) => (
              <PlayerRow
                key={player.id}
                player={player}
                buyInAmount={buyInAmount}
                rebuyAmount={rebuyAmount}
                onAddRebuy={() => addRebuy(player.id)}
                onRemoveRebuy={() => removeRebuy(player.id)}
                onRemovePlayer={() => removePlayer(player.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface PlayerRowProps {
  player: Player;
  buyInAmount: number;
  rebuyAmount: number;
  onAddRebuy: () => void;
  onRemoveRebuy: () => void;
  onRemovePlayer: () => void;
}

function PlayerRow({
  player,
  buyInAmount,
  rebuyAmount,
  onAddRebuy,
  onRemoveRebuy,
  onRemovePlayer,
}: PlayerRowProps) {
  const totalAmount = buyInAmount + player.rebuys * rebuyAmount;
  const formatCurrency = (amount: number) =>
    `${amount.toLocaleString("cs-CZ")} Kč`;

  return (
    <div className="flex items-center justify-between bg-secondary/30 rounded-lg px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium text-primary">
          {player.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-medium text-foreground">{player.name}</p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Banknote className="w-3 h-3" />
            {formatCurrency(totalAmount)}
            {player.rebuys > 0 && (
              <span className="text-accent ml-1">
                (+{player.rebuys} dokup{player.rebuys > 1 && player.rebuys < 5 ? "y" : player.rebuys >= 5 ? "ů" : ""})
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="icon"
          className="h-8 w-8"
          onClick={onRemoveRebuy}
          disabled={player.rebuys === 0}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="w-6 text-center font-medium text-foreground tabular-nums">
          {player.rebuys}
        </span>
        <Button
          variant="secondary"
          size="icon"
          className="h-8 w-8"
          onClick={onAddRebuy}
        >
          <Plus className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 ml-1"
          onClick={onRemovePlayer}
          title="Odstranit hráče"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
