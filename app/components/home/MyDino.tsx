"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/app/config/site";
import { liveDinoDemo, walletDemo } from "@/app/data/myDino";
import type { ServerStatusPayload } from "@/lib/isle/parse";
import SteamButton from "@/app/components/ui/SteamButton";

const toneBar: Record<string, string> = {
  red: "from-red-600 to-red-400",
  amber: "from-amber-600 to-amber-400",
  sky: "from-sky-600 to-sky-400",
  green: "from-emerald-600 to-emerald-400",
  rose: "from-rose-700 to-rose-500",
};

function VitalBar({
  label,
  value,
  max,
  tone,
}: {
  label: string;
  value: number;
  max: number;
  tone: string;
}) {
  const pct = Math.max(0, Math.min(100, Math.round((value / max) * 100)));
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <span className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500">
          {label}
        </span>
        <span className="text-xs font-black tabular-nums text-zinc-300">
          {value}
          <span className="text-zinc-600">/{max}</span>
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${toneBar[tone] ?? toneBar.red} transition-[width] duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function formatAgo(iso: string | null): string {
  if (!iso) return "—";
  const sec = Math.round((Date.now() - new Date(iso).getTime()) / 1000);
  if (!Number.isFinite(sec) || sec < 5) return "ahora";
  if (sec < 60) return `hace ${sec}s`;
  return `hace ${Math.round(sec / 60)}m`;
}

export default function MyDino() {
  const [demoOpen, setDemoOpen] = useState(false);
  const [status, setStatus] = useState<ServerStatusPayload | null>(null);
  const dino = liveDinoDemo;
  const wallet = walletDemo;

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const res = await fetch("/api/server/status", { cache: "no-store" });
        const json = (await res.json()) as ServerStatusPayload;
        if (!cancelled) setStatus(json);
      } catch {
        if (!cancelled) {
          setStatus({
            ok: false,
            online: false,
            checkedAt: new Date().toISOString(),
            error: "Sin conexión al estado del server",
            players: { count: 0, list: [], raw: "" },
            queue: null,
            playerDataRaw: null,
          });
        }
      }
    };

    void load();
    const id = window.setInterval(load, 12000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  const online = status?.online === true;
  const server = status?.server;
  const players = status?.players;
  const max = server?.maxPlayers ?? siteConfig.maxPlayers;

  return (
    <section
      id="mi-dino"
      className="relative scroll-mt-24 overflow-hidden bg-[#06080d] py-16 sm:py-24"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(185,28,28,0.14),transparent_45%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_40%,rgba(30,58,90,0.16),transparent_50%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-900/50 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-10 max-w-3xl">
          <div className="mb-5 flex items-center gap-4">
            <span className="h-px w-12 bg-red-600" />
            <p className="text-xs font-black uppercase tracking-[0.45em] text-red-500">
              En vivo
            </p>
          </div>
          <h2 className="text-4xl font-black uppercase leading-tight text-white sm:text-5xl">
            Mi <span className="text-red-500">Dino</span>
          </h2>
          <p className="mt-5 text-lg leading-8 text-zinc-400">
            Estado del server por RCON. Tus vitales personales se vinculan al
            iniciar sesión con Steam.
          </p>
        </div>

        {/* Strip live del server */}
        <div className="mb-4 flex flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-black/40 px-4 py-3">
          <span
            className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider ${
              online
                ? "bg-emerald-500/15 text-emerald-400"
                : "bg-red-500/15 text-red-400"
            }`}
          >
            {online ? "● Server online" : "● Server offline"}
          </span>
          <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-zinc-300">
            {players?.count ?? 0}/{max} jugadores
          </span>
          <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-zinc-300">
            {server?.map ?? siteConfig.map}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-600">
            Sync {formatAgo(status?.checkedAt ?? null)}
          </span>
          {status?.error ? (
            <span className="text-[10px] font-bold text-red-400">
              {status.error}
            </span>
          ) : null}
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0a0c12]/95 shadow-[0_0_60px_rgba(0,0,0,0.45)]">
          {/* Billetera */}
          <div className="flex flex-col gap-4 border-b border-white/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-[11px] font-black uppercase tracking-[0.28em] text-zinc-500">
                Billetera
              </p>

              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/35 bg-amber-500/[0.07] px-3 py-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-200">
                  Monedas
                </span>
                <span className="text-sm font-black tabular-nums text-white">
                  {wallet.coins}
                </span>
                <a
                  href="#tienda"
                  title="Recargar Monedas Prime"
                  className="ml-0.5 flex h-5 w-5 items-center justify-center rounded-full border border-amber-500/40 text-[11px] font-black text-amber-300 transition hover:bg-amber-500/20"
                >
                  +
                </a>
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/[0.06] px-3 py-1.5">
                <span className="h-2 w-2 rounded-full bg-sky-400" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-sky-200/90">
                  Marcas
                </span>
                <span className="text-sm font-black tabular-nums text-white">
                  {wallet.marks}
                </span>
              </div>

              <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-zinc-400">
                {wallet.tierLabel}
              </span>
            </div>

            <a
              href="#patreon"
              className="text-[11px] font-black uppercase tracking-[0.22em] text-white transition hover:text-red-400"
            >
              Apóyanos →
            </a>
          </div>

          <div className="grid lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)]">
            {/* Jugadores online / tu dino */}
            <div className="border-b border-white/10 p-6 lg:border-b-0 lg:border-r">
              <div className="mb-5 flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.28em] text-zinc-500">
                    Gateway en vivo
                  </p>
                  <h3 className="mt-2 text-2xl font-black tracking-tight text-white">
                    {server?.name?.split("|")[0]?.trim() || "Isla Prime"}
                  </h3>
                  <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                    {siteConfig.serverIp}
                  </p>
                </div>
              </div>

              <p className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                Jugadores conectados
              </p>

              {players && players.list.length > 0 ? (
                <ul className="max-h-56 space-y-1.5 overflow-y-auto">
                  {players.list.map((player) => (
                    <li
                      key={player}
                      className="rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2 text-sm font-bold text-zinc-200"
                    >
                      {player}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="rounded-xl border border-dashed border-white/10 px-4 py-8 text-center">
                  <p className="text-sm font-bold text-zinc-400">
                    Nadie conectado ahora
                  </p>
                  <p className="mt-2 text-xs text-zinc-600">
                    Cuando entren jugadores, saldrán aquí por RCON.
                  </p>
                </div>
              )}

              {status?.playerDataRaw ? (
                <details className="mt-5 rounded-xl border border-white/8 bg-black/30">
                  <summary className="cursor-pointer px-3 py-2 text-[10px] font-black uppercase tracking-wider text-zinc-500">
                    Datos crudos getplayerdata
                  </summary>
                  <pre className="max-h-40 overflow-auto px-3 pb-3 text-[10px] leading-relaxed text-zinc-500">
                    {status.playerDataRaw}
                  </pre>
                </details>
              ) : null}
            </div>

            {/* Vitales personales */}
            <div className="flex flex-col p-6">
              {!demoOpen ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-5 py-8 text-center">
                  <p className="text-xl font-black uppercase text-white">
                    Tu dino
                  </p>
                  <p className="max-w-sm text-sm leading-relaxed text-zinc-400">
                    Inicia sesión con Steam para ver salud, hambre, sed,
                    crecimiento y ubicación de tu dinosaurio.
                  </p>
                  <SteamButton label="Iniciar sesión con Steam" />
                  <button
                    type="button"
                    onClick={() => setDemoOpen(true)}
                    className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 underline-offset-4 transition hover:text-white hover:underline"
                  >
                    Ver panel demo →
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.28em] text-zinc-500">
                        Demo · {dino.species}
                      </p>
                      <h4 className="mt-1 text-lg font-black uppercase text-white">
                        Vitales
                      </h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => setDemoOpen(false)}
                      className="rounded-xl border border-white/10 px-3 py-2 text-[10px] font-black uppercase tracking-wider text-zinc-400 transition hover:border-white/20 hover:text-white"
                    >
                      Salir demo
                    </button>
                  </div>

                  <div className="relative mx-auto mb-6 flex h-28 w-28 items-center justify-center">
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: `conic-gradient(#dc2626 ${dino.growth * 3.6}deg, rgba(255,255,255,0.08) 0)`,
                      }}
                    />
                    <div className="absolute inset-2 rounded-full bg-[#0a0c12]" />
                    <div className="relative text-center">
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500">
                        Growth
                      </p>
                      <p className="text-2xl font-black text-white">
                        {dino.growth}
                        <span className="text-sm text-red-400">%</span>
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {dino.vitals.map((vital) => (
                      <VitalBar
                        key={vital.id}
                        label={vital.label}
                        value={vital.value}
                        max={vital.max}
                        tone={vital.tone}
                      />
                    ))}
                  </div>

                  <div className="mt-8 grid gap-3 sm:grid-cols-2">
                    <a
                      href="#skin-dino"
                      className="rounded-xl border border-red-500/40 bg-red-600/15 px-4 py-3 text-center text-[11px] font-black uppercase tracking-wider text-red-300 transition hover:bg-red-600/25 hover:text-white"
                    >
                      Skin Studio
                    </a>
                    <a
                      href="#mapa"
                      className="rounded-xl border border-white/10 px-4 py-3 text-center text-[11px] font-black uppercase tracking-wider text-zinc-300 transition hover:border-white/25 hover:text-white"
                    >
                      Ver en mapa
                    </a>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
