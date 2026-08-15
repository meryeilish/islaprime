"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/app/config/site";
import { growthFromServerName } from "@/lib/isle/parse";
import type { ServerStatusPayload } from "@/lib/isle/parse";

type StatCard = {
  icon: string;
  title: string;
  value: string;
  color?: string;
};

function formatAgo(iso: string | null): string {
  if (!iso) return "—";
  const ms = Date.now() - new Date(iso).getTime();
  if (!Number.isFinite(ms) || ms < 0) return "ahora";
  const sec = Math.round(ms / 1000);
  if (sec < 5) return "ahora";
  if (sec < 60) return `hace ${sec}s`;
  return `hace ${Math.round(sec / 60)}m`;
}

export default function Stats() {
  const [data, setData] = useState<ServerStatusPayload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const res = await fetch("/api/server/status", { cache: "no-store" });
        const json = (await res.json()) as ServerStatusPayload;
        if (!cancelled) setData(json);
      } catch {
        if (!cancelled) {
          setData({
            ok: false,
            online: false,
            checkedAt: new Date().toISOString(),
            error: "No se pudo consultar el estado",
            players: { count: 0, list: [], raw: "" },
            queue: null,
            playerDataRaw: null,
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();
    const id = window.setInterval(load, 15000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  const online = data?.online === true;
  const server = data?.server;
  const max = server?.maxPlayers ?? siteConfig.maxPlayers;
  const current = data?.players.count ?? server?.currentPlayers ?? 0;
  const growth = server ? growthFromServerName(server.name) : "3x";

  const stats: StatCard[] = [
    {
      icon: online ? "🟢" : "🔴",
      title: "Estado",
      value: loading ? "…" : online ? "Online" : "Offline",
      color: online ? "text-green-400" : "text-red-400",
    },
    {
      icon: "👥",
      title: "Jugadores",
      value: loading ? "…" : `${current} / ${max}`,
    },
    {
      icon: "🌎",
      title: "Mapa",
      value: server?.map ?? siteConfig.map,
    },
    {
      icon: "📡",
      title: "Conexión",
      value: siteConfig.serverIp,
    },
    {
      icon: "🦖",
      title: "Crecimiento",
      value: growth,
    },
    {
      icon: "🧬",
      title: "Mutaciones",
      value: server?.mutations ? "Activas" : "Off",
      color: server?.mutations ? "text-green-400" : "text-zinc-400",
    },
    {
      icon: "🤖",
      title: "IA",
      value: server?.spawnAi ? "Activa" : "Off",
    },
    {
      icon: "⏱️",
      title: "Actualizado",
      value: loading ? "…" : formatAgo(data?.checkedAt ?? null),
    },
  ];

  return (
    <section
      id="estado"
      className="relative scroll-mt-24 overflow-hidden bg-[#050505] py-24"
    >
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(185,28,28,0.12),transparent_70%)]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <p className="mb-3 uppercase tracking-[0.45em] text-red-500">
            Estado del servidor
          </p>

          <h2 className="text-5xl font-black text-white">
            Siempre listo para jugar
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400">
            Datos en vivo vía RCON desde Isla Prime. Se actualizan cada 15
            segundos.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-red-500/60 hover:bg-white/10 hover:shadow-[0_0_40px_rgba(220,38,38,0.20)]"
            >
              <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-red-600 via-red-500 to-transparent" />

              <div className="mb-6 text-5xl">{stat.icon}</div>

              <p className="mb-2 uppercase tracking-widest text-zinc-500">
                {stat.title}
              </p>

              <h3
                className={`break-all text-3xl font-black ${stat.color ?? "text-white"}`}
              >
                {stat.value}
              </h3>
            </div>
          ))}
        </div>

        <div className="mt-20 rounded-3xl border border-red-900/30 bg-red-950/10 p-10 backdrop-blur-xl">
          <h3 className="mb-6 text-3xl font-black text-white">Estado general</h3>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-3 text-zinc-300">
              {online ? "✅ RCON conectado" : "⚠️ RCON sin respuesta"}
            </div>
            <div className="flex items-center gap-3 text-zinc-300">
              🗺️ {server?.name ?? "Isla Prime"}
            </div>
            <div className="flex items-center gap-3 text-zinc-300">
              {server?.whitelist ? "🔒 Whitelist activa" : "🔓 Whitelist off"}
            </div>
            <div className="flex items-center gap-3 text-zinc-300">
              {server?.password ? "🔑 Password activa" : "🚪 Sin password"}
            </div>
          </div>

          {data?.error ? (
            <p className="mt-6 text-sm text-red-400">{data.error}</p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
