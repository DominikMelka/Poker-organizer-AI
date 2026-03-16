"use client";

import { useState } from "react";
import { usePokerStore } from "@/lib/poker-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Clock,
  Coins,
  Users,
  Shuffle,
  Plus,
  Trash2,
  Banknote,
  LayoutGrid,
} from "lucide-react";

export function SettingsSection() {
  const {
    levelDuration,
    blindLevels,
    buyInAmount,
    rebuyAmount,
    addonAmount,
    activeTables,
    players,
    setLevelDuration,
    addBlindLevel,
    updateBlindLevel,
    removeBlindLevel,
    setBuyInAmount,
    setRebuyAmount,
    setAddonAmount,
    setActiveTables,
    addPlayer,
    removePlayer,
    randomizePlayerAssignment,
  } = usePokerStore();

  const [newPlayerName, setNewPlayerName] = useState("");
  const [bulkPlayersText, setBulkPlayersText] = useState("");

  const handleAddPlayer = () => {
    if (newPlayerName.trim()) {
      addPlayer(newPlayerName.trim());
      setNewPlayerName("");
    }
  };

  const handleBulkAddPlayers = () => {
    const names = bulkPlayersText
      .split("\n")
      .map((name) => name.trim())
      .filter((name) => name.length > 0);

    names.forEach((name) => addPlayer(name));
    setBulkPlayersText("");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins} min`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Timer & Blinds Settings */}
      <div className="space-y-6">
        {/* Level Duration */}
        <div className="rounded-2xl bg-card border border-border p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">
              Délka levelu
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label htmlFor="levelDuration" className="text-muted-foreground">
                Čas (minuty)
              </Label>
              <Input
                id="levelDuration"
                type="number"
                min={1}
                value={Math.floor(levelDuration / 60)}
                onChange={(e) =>
                  setLevelDuration(Number.parseInt(e.target.value) * 60)
                }
                className="mt-1"
              />
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Aktuální</p>
              <p className="text-2xl font-bold text-primary">
                {formatTime(levelDuration)}
              </p>
            </div>
          </div>
        </div>

        {/* Buy-in Settings */}
        <div className="rounded-2xl bg-card border border-border p-6">
          <div className="flex items-center gap-2 mb-4">
            <Banknote className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-semibold text-foreground">
              Buy-in, Dokup & Add-on
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="buyIn" className="text-muted-foreground">
                Buy-in (Kč)
              </Label>
              <Input
                id="buyIn"
                type="number"
                min={0}
                step={50}
                value={buyInAmount}
                onChange={(e) => setBuyInAmount(Number.parseInt(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="rebuy" className="text-muted-foreground">
                Dokup (Kč)
              </Label>
              <Input
                id="rebuy"
                type="number"
                min={0}
                step={50}
                value={rebuyAmount}
                onChange={(e) => setRebuyAmount(Number.parseInt(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="addon" className="text-muted-foreground">
                Add-on (Kč)
              </Label>
              <Input
                id="addon"
                type="number"
                min={0}
                step={50}
                value={addonAmount}
                onChange={(e) => setAddonAmount(Number.parseInt(e.target.value))}
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* Blinds Structure */}
        <div className="rounded-2xl bg-card border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">
                Struktura blindů
              </h2>
            </div>
            <Button variant="secondary" size="sm" onClick={addBlindLevel}>
              <Plus className="w-4 h-4 mr-1" />
              Přidat
            </Button>
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
            {blindLevels.map((level) => (
              <div
                key={level.id}
                className="flex items-center gap-3 bg-secondary/30 rounded-lg p-3"
              >
                <span className="w-16 text-sm text-muted-foreground">
                  Level {level.level}
                </span>
                <Input
                  type="number"
                  min={0}
                  value={level.smallBlind}
                  onChange={(e) =>
                    updateBlindLevel(
                      level.id,
                      Number.parseInt(e.target.value),
                      level.bigBlind
                    )
                  }
                  className="w-20 text-center"
                />
                <span className="text-muted-foreground">/</span>
                <Input
                  type="number"
                  min={0}
                  value={level.bigBlind}
                  onChange={(e) =>
                    updateBlindLevel(
                      level.id,
                      level.smallBlind,
                      Number.parseInt(e.target.value)
                    )
                  }
                  className="w-20 text-center"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => removeBlindLevel(level.id)}
                  disabled={blindLevels.length <= 1}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tables & Players Settings */}
      <div className="space-y-6">
        {/* Active Tables */}
        <div className="rounded-2xl bg-card border border-border p-6">
          <div className="flex items-center gap-2 mb-4">
            <LayoutGrid className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">
              Počet stolů
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {[1, 2, 3].map((num) => (
              <Button
                key={num}
                variant={activeTables === num ? "default" : "secondary"}
                className="flex-1"
                onClick={() => setActiveTables(num)}
              >
                {num} {num === 1 ? "stůl" : num < 5 ? "stoly" : "stolů"}
              </Button>
            ))}
          </div>
        </div>

        {/* Players Management */}
        <div className="rounded-2xl bg-card border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">
                Hráči ({players.length})
              </h2>
            </div>
            <Button
              variant="default"
              size="sm"
              onClick={randomizePlayerAssignment}
              disabled={players.length === 0}
            >
              <Shuffle className="w-4 h-4 mr-1" />
              Rozhodit
            </Button>
          </div>

          {/* Add single player */}
          <div className="flex items-center gap-2 mb-4">
            <Input
              placeholder="Jméno hráče"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddPlayer()}
            />
            <Button onClick={handleAddPlayer} disabled={!newPlayerName.trim()}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {/* Bulk add players */}
          <div className="mb-4">
            <Label className="text-muted-foreground text-sm">
              Hromadné přidání (jedno jméno na řádek)
            </Label>
            <textarea
              className="mt-1 w-full h-24 rounded-lg bg-input border border-border px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              placeholder={"Jan\nPetr\nMarie\n..."}
              value={bulkPlayersText}
              onChange={(e) => setBulkPlayersText(e.target.value)}
            />
            <Button
              variant="secondary"
              size="sm"
              className="mt-2"
              onClick={handleBulkAddPlayers}
              disabled={!bulkPlayersText.trim()}
            >
              Přidat všechny
            </Button>
          </div>

          {/* Players list */}
          <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {players.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                Zatím žádní hráči
              </p>
            ) : (
              players.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between bg-secondary/30 rounded-lg px-4 py-2"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium text-primary">
                      {player.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-foreground">
                      {player.name}
                    </span>
                    {player.tableId && (
                      <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                        Stůl {player.tableId}
                      </span>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => removePlayer(player.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
