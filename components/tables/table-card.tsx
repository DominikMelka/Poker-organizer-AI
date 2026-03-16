"use client";

import { usePokerStore, type Player } from "@/lib/poker-store";
import { Button } from "@/components/ui/button";
import { Users, Plus, Minus, Banknote, Trash2 } from "lucide-react";

interface TableCardProps {
  tableNumber: number;
}

export function TableCard({ tableNumber }: TableCardProps) {
  const { players, buyInAmount, rebuyAmount, addonAmount, addRebuy, removeRebuy, toggleAddon, removePlayer } =
    usePokerStore();

  const tablePlayers = players.filter((p) => p.tableId === tableNumber);

  const tableTotal = tablePlayers.reduce(
    (sum, p) => sum + buyInAmount + p.rebuys * rebuyAmount + (p.addon ? addonAmount : 0),
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
                addonAmount={addonAmount}
                onAddRebuy={() => addRebuy(player.id)}
                onRemoveRebuy={() => removeRebuy(player.id)}
                onToggleAddon={() => toggleAddon(player.id)}
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
  addonAmount: number;
  onAddRebuy: () => void;
  onRemoveRebuy: () => void;
  onToggleAddon: () => void;
  onRemovePlayer: () => void;
}

function PlayerRow({
  player,
  buyInAmount,
  rebuyAmount,
  addonAmount,
  onAddRebuy,
  onRemoveRebuy,
  onToggleAddon,
  onRemovePlayer,
}: PlayerRowProps) {
  const totalAmount = buyInAmount + player.rebuys * rebuyAmount + (player.addon ? addonAmount : 0);
  const formatCurrency = (amount: number) =>
    `${amount.toLocaleString("cs-CZ")} Kč`;

  return (
    <div className="flex flex-col gap-3 2xl:flex-row 2xl:items-center justify-between bg-secondary/30 rounded-lg px-4 py-3">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-full bg-primary/20 shrink-0 flex items-center justify-center text-sm font-medium text-primary">
          {player.name.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="font-medium text-foreground truncate">{player.name}</p>
          <div className="text-xs text-muted-foreground flex flex-wrap items-center gap-x-1.5 gap-y-0.5 mt-0.5">
            <span className="flex items-center gap-1 whitespace-nowrap">
              <Banknote className="w-3 h-3 shrink-0" />
              {formatCurrency(totalAmount)}
            </span>
            {player.rebuys > 0 && (
              <span className="text-accent whitespace-nowrap">
                (+{player.rebuys} dokup{player.rebuys > 1 && player.rebuys < 5 ? "y" : player.rebuys >= 5 ? "ů" : ""})
              </span>
            )}
            {player.addon && (
              <span className="text-primary whitespace-nowrap">
                (+Add-on)
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end 2xl:self-auto shrink-0">
        <Button
          variant={player.addon ? "default" : "outline"}
          size="sm"
          className="h-8 px-2 lg:px-3 lg:mr-2"
          onClick={onToggleAddon}
        >
          Add-on
        </Button>
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
          title="Odstranit hráče ze stolu i turnaje"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
