"use client";

import { usePokerStore } from "@/lib/poker-store";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Trash2, Banknote, Users } from "lucide-react";

export function PlayersSection() {
    const {
        players,
        eliminatePlayer,
        addRebuy,
        removeRebuy,
        buyInAmount,
        rebuyAmount,
    } = usePokerStore();

    const formatCurrency = (amount: number) =>
        `${amount.toLocaleString("cs-CZ")} Kč`;

    const activePlayers = players.filter((p) => !p.isEliminated);

    return (
        <div className="space-y-6">
            {/* Header / Info box */}
            <div className="rounded-2xl bg-card border border-border p-6 shadow-sm">
                <h2 className="text-2xl font-bold text-foreground flex items-center gap-2 mb-2">
                    <Users className="w-6 h-6 text-primary" />
                    Zbývající hráči
                </h2>
                <p className="text-muted-foreground">
                    Zde vidíte pouze hráče, kteří ještě nevypadli z turnaje. Vyřazení hráče odtud jej smaže ze seznamu aktivních, ale v celkovém banku (vybraných buy-inech) všechny jeho finance zůstanou zachovány.
                </p>
            </div>

            {/* Seznam hráčů */}
            <div className="rounded-2xl bg-card border border-border overflow-hidden">
                <div className="bg-secondary/50 px-6 py-4 flex items-center justify-between border-b border-border">
                    <h3 className="font-semibold text-foreground">
                        Aktivní hráči ({activePlayers.length})
                    </h3>
                </div>

                <div className="p-4">
                    {activePlayers.length === 0 ? (
                        <div className="text-center text-muted-foreground py-12 flex flex-col items-center gap-3">
                            <Users className="w-12 h-12 text-muted-foreground/30" />
                            <p>Zatím zde nejsou žádní aktivní hráči.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {activePlayers.map((player) => {
                                const totalAmount = buyInAmount + player.rebuys * rebuyAmount;

                                return (
                                    <div
                                        key={player.id}
                                        className="flex flex-col sm:flex-row sm:items-center justify-between bg-secondary/30 rounded-lg p-4 gap-4"
                                    >
                                        {/* Hráč info */}
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-lg font-medium text-primary shrink-0">
                                                {player.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-medium text-foreground text-lg">
                                                    {player.name}
                                                </p>
                                                <div className="flex flex-wrap items-center text-sm text-muted-foreground gap-x-4 gap-y-1 mt-1">
                                                    <span className="flex items-center gap-1">
                                                        {player.tableId ? (
                                                            <span className="text-accent font-medium">Stůl {player.tableId}</span>
                                                        ) : (
                                                            <span className="text-muted-foreground/70">Neusazen</span>
                                                        )}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Banknote className="w-3.5 h-3.5" />
                                                        {formatCurrency(totalAmount)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Akce */}
                                        <div className="flex items-center gap-4 sm:ml-auto">
                                            <div className="flex items-center bg-secondary/50 rounded-lg p-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 hover:bg-background hover:text-foreground"
                                                    onClick={() => removeRebuy(player.id)}
                                                    disabled={player.rebuys === 0}
                                                    title="Odebrat dokup"
                                                >
                                                    <Minus className="h-4 w-4" />
                                                </Button>
                                                <div className="w-12 text-center flex flex-col items-center justify-center">
                                                    <span className="text-sm font-bold text-foreground leading-none">
                                                        {player.rebuys}
                                                    </span>
                                                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">
                                                        Dokup
                                                    </span>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 hover:bg-background hover:text-foreground"
                                                    onClick={() => addRebuy(player.id)}
                                                    title="Přidat dokup"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                            </div>

                                            <div className="w-px h-8 bg-border hidden sm:block"></div>

                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                onClick={() => eliminatePlayer(player.id)}
                                                title="Odstranit z turnaje a seznamu"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
