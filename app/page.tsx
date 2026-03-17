"use client";

import { useEffect, useRef, useState } from "react";
import { Navbar } from "@/components/navbar";
import { PokerSection } from "@/components/poker/poker-section";
import { TablesSection } from "@/components/tables/tables-section";
import { SettingsSection } from "@/components/settings/settings-section";
import { usePokerStore } from "@/lib/poker-store";
import { playBeep } from "@/lib/timer-audio";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"poker" | "tables" | "settings">(
    "poker"
  );

  const {
    isRunning,
    timeRemaining,
    currentLevel,
    blindLevels,
    setTimeRemaining,
    nextLevel,
    toggleTimer,
  } = usePokerStore();

  const beepPlayedRef = useRef(false);

  // Persistent countdown — runs regardless of which tab is active
  useEffect(() => {
    if (!isRunning) return;

    if (timeRemaining > 0) {
      beepPlayedRef.current = false;
      const id = setInterval(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearInterval(id);
    } else {
      // Timer reached 0 — play beep once and advance level after 2s
      if (!beepPlayedRef.current) {
        beepPlayedRef.current = true;
        playBeep();
      }
      const id = setTimeout(() => {
        if (currentLevel < blindLevels.length) {
          nextLevel();
        } else {
          toggleTimer();
        }
      }, 2000);
      return () => clearTimeout(id);
    }
  }, [isRunning, timeRemaining, currentLevel, blindLevels.length, setTimeRemaining, nextLevel, toggleTimer]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="mx-auto max-w-6xl px-4 py-8">
        {activeTab === "poker" && <PokerSection />}
        {activeTab === "tables" && <TablesSection />}
        {activeTab === "settings" && <SettingsSection />}
      </main>
    </div>
  );
}
