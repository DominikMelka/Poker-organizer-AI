"use client";

import { Timer } from "./timer";
import { BlindsDisplay } from "./blinds-display";
import { PrizePool } from "./prize-pool";

export function PokerSection() {
  return (
    <div className="space-y-6">
      <Timer />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BlindsDisplay />
        <PrizePool />
      </div>
    </div>
  );
}
