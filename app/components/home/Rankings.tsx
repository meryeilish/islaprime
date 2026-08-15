"use client";

import { useState } from "react";

import SectionHeader from "@/app/components/ui/SectionHeader";
import {
  rankingTabs,
  rankingsData,
  type RankingTabId,
} from "@/app/data/rankings";

export default function Rankings() {
  const [activeTab, setActiveTab] = useState<RankingTabId>("kills");
  const entries = rankingsData[activeTab];

  return (
    <section
      id="rankings"
      className="relative scroll-mt-24 overflow-hidden bg-[#050505] py-28"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-900/50 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-6">
        <SectionHeader
          label="Rankings"
          title={
            <>
              Los mejores de{" "}
              <span className="text-red-500">la isla</span>
            </>
          }
          description="Tablas de líderes actualizadas del servidor. Kills, ratio, vidas más largas y más."
          centered
        />

        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {rankingTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-full border px-5 py-2.5 text-xs font-black uppercase tracking-wider transition ${
                activeTab === tab.id
                  ? "border-red-500 bg-red-600/20 text-red-400"
                  : "border-white/10 bg-white/[0.03] text-zinc-400 hover:border-red-500/30 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02]">
          <div className="grid grid-cols-[60px_1fr_1fr_100px] gap-4 border-b border-white/10 bg-black/40 px-6 py-4 text-xs font-black uppercase tracking-wider text-zinc-500">
            <span>#</span>
            <span>Jugador</span>
            <span className="hidden sm:block">Especie</span>
            <span className="text-right">Valor</span>
          </div>

          {entries.map((entry) => (
            <div
              key={`${activeTab}-${entry.rank}`}
              className="grid grid-cols-[60px_1fr_1fr_100px] items-center gap-4 border-b border-white/5 px-6 py-5 transition last:border-0 hover:bg-white/[0.03]"
            >
              <span
                className={`text-2xl font-black ${
                  entry.rank === 1
                    ? "text-amber-400"
                    : entry.rank === 2
                      ? "text-zinc-300"
                      : entry.rank === 3
                        ? "text-amber-700"
                        : "text-zinc-600"
                }`}
              >
                {entry.rank}
              </span>

              <span className="font-bold text-white">{entry.player}</span>

              <span className="hidden text-sm text-zinc-500 sm:block">
                {entry.species}
              </span>

              <span className="text-right text-lg font-black text-red-500">
                {entry.value}
              </span>
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-zinc-600">
          Datos de ejemplo · Se conectarán al servidor en la siguiente fase
        </p>
      </div>
    </section>
  );
}
