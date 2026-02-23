"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { PokerSection } from "@/components/poker/poker-section";
import { TablesSection } from "@/components/tables/tables-section";
import { SettingsSection } from "@/components/settings/settings-section";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"poker" | "tables" | "settings">(
    "poker"
  );

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
