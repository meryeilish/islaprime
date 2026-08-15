"use client";

import dynamic from "next/dynamic";

const GatewayMap = dynamic(() => import("@/app/components/map/GatewayMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-[#04131e]">
      <p className="text-sm font-bold uppercase tracking-[0.25em] text-zinc-500">
        Cargando Gateway…
      </p>
    </div>
  ),
});

export default function MapSection() {
  return (
    <section
      id="mapa"
      className="relative scroll-mt-24 overflow-hidden bg-[#050505] py-24"
    >
      {/* Fondo decorativo */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(185,28,28,0.12),transparent_65%)]" />

      <div className="absolute left-1/2 top-0 h-px w-[85%] -translate-x-1/2 bg-gradient-to-r from-transparent via-red-900/50 to-transparent" />

      <div className="relative mx-auto max-w-[1500px] px-4 sm:px-6">
        {/* Encabezado */}
        <div className="mb-14 text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.45em] text-red-500">
            Explora Gateway
          </p>

          <h2 className="text-4xl font-black text-white sm:text-5xl">
            Domina el mapa
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400">
            Zonas, aguas, migraciones, patrullas de IA y santuarios de Gateway,
            todo en un mapa interactivo para planear tu ruta antes de entrar.
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-black/70 shadow-[0_0_80px_rgba(127,29,29,0.15)]">
          {/* Barra superior */}
          <div className="relative z-30 flex flex-col gap-4 border-b border-white/10 bg-black/90 px-5 py-4 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-500">
                Mapa interactivo
              </p>

              <h3 className="mt-1 text-xl font-black text-white">Gateway</h3>
            </div>

            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
              The Isle Evrima · v0.21
            </p>
          </div>

          {/* Visor */}
          <div className="relative h-[540px] sm:h-[680px] lg:h-[760px]">
            <GatewayMap />
          </div>
        </div>

        {/* Información inferior */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-red-500">
              Navegación
            </p>

            <p className="mt-2 text-sm text-zinc-400">
              Usa la rueda del mouse para acercarte y arrastra para recorrer el
              mapa.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-red-500">
              Capas
            </p>

            <p className="mt-2 text-sm text-zinc-400">
              Alterna zonas, aguas, migraciones, patrullas, santuarios, puntos
              de referencia y bases humanas.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-red-500">
              Marcadores
            </p>

            <p className="mt-2 text-sm text-zinc-400">
              Pasa el cursor sobre cualquier marcador o zona para ver su nombre
              e información.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
