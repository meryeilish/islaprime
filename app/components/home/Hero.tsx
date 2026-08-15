export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative min-h-screen overflow-hidden pt-24"
    >
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 h-full w-full object-cover object-center"
      >
        <source src="/videos/beipi-vid.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/90" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/40" />

      <div className="absolute left-[28%] top-[38%] h-80 w-80 rounded-full bg-red-700/10 blur-[120px]" />

      {/* Partículas decorativas */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, index) => (
          <span
            key={index}
            className="absolute h-1 w-1 rounded-full bg-red-500/60"
            style={{
              left: `${15 + index * 14}%`,
              top: `${20 + (index % 3) * 22}%`,
              animation: `float-particle ${4 + index}s ease-in-out infinite`,
              animationDelay: `${index * 0.7}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-6rem)] max-w-7xl items-center gap-12 px-8 pb-24 pt-6 lg:grid-cols-2">
        <div className="text-center lg:text-left lg:-translate-y-6">
          <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/10 bg-black/50 px-4 py-2 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_12px_#22c55e]" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-300">
              Servidor operativo · The Isle Evrima
            </span>
          </div>

          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-red-500">
            Isla Prime · Hardcore Survival
          </p>

          <h2 className="text-6xl font-black leading-none sm:text-7xl lg:text-8xl">
            <span className="block text-zinc-100">ISLA</span>
            <span className="block bg-gradient-to-b from-red-400 to-red-900 bg-clip-text text-transparent">
              PRIME
            </span>
          </h2>

          <p className="mt-4 text-sm font-black uppercase tracking-[0.35em] text-zinc-300">
            Caza · Sobrevive · Evoluciona
          </p>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-zinc-300 lg:mx-0">
            Una isla viva donde cada decisión cuenta. Diseña tu dinosaurio,
            vigila el ecosistema en tiempo real y reclama tu lugar en la cima
            de la cadena alimenticia.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
            <a
              href="#mi-dino"
              className="rounded-full border border-red-500 bg-red-600 px-8 py-4 text-center text-sm font-black uppercase tracking-wider text-white shadow-[0_0_30px_rgba(220,38,38,0.25)] transition hover:-translate-y-0.5 hover:bg-red-500"
            >
              Ver mi dino en vivo
            </a>

            <a
              href="#mapa"
              className="rounded-full border border-white/20 bg-black/35 px-8 py-4 text-center text-sm font-black uppercase tracking-wider text-zinc-200 backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-red-500/50 hover:text-white"
            >
              Explorar la isla
            </a>
          </div>
        </div>

        <div className="rounded-2xl border border-red-950/70 bg-black/50 p-8 shadow-2xl backdrop-blur-md lg:-translate-y-4">
          <div className="flex items-center gap-3 border-b border-zinc-700/70 pb-5">
            <span className="h-3 w-3 rounded-full bg-green-500 shadow-[0_0_15px_#22c55e]" />
            <span className="font-bold uppercase text-red-500">
              Servidor online
            </span>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-8">
            <div>
              <p className="text-xs uppercase text-zinc-400">Jugadores</p>
              <h3 className="mt-2 text-4xl font-black text-red-500">145/200</h3>
              <span className="text-xs text-zinc-400">Conectados</span>
            </div>

            <div>
              <p className="text-xs uppercase text-zinc-400">Rendimiento</p>
              <h3 className="mt-2 text-4xl font-black text-red-500">98%</h3>
              <span className="text-xs text-zinc-400">Óptimo</span>
            </div>

            <div>
              <p className="text-xs uppercase text-zinc-400">Reinicio</p>
              <h3 className="mt-2 text-4xl font-black text-red-500">
                02:47:36
              </h3>
              <span className="text-xs text-zinc-400">HH:MM:SS</span>
            </div>

            <div>
              <p className="text-xs uppercase text-zinc-400">Versión</p>
              <h3 className="mt-2 text-4xl font-black text-red-500">
                0.18.140
              </h3>
              <span className="text-xs text-zinc-400">Evrima</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats rápidos estilo Arkadia */}
      <div className="relative z-10 mx-auto grid max-w-4xl grid-cols-3 gap-6 px-8 pb-8">
        {[
          { value: "23", label: "Especies jugables" },
          { value: "24/7", label: "En línea" },
          { value: "100%", label: "Progreso persistente" },
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-3xl font-black text-white sm:text-4xl">
              {stat.value}
            </p>
            <p className="mt-1 text-xs uppercase tracking-wider text-zinc-500">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3">
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">
          Desliza
        </span>
        <span className="block h-10 w-px bg-red-600/80 animate-scroll-line" />
      </div>

      <div className="absolute bottom-0 left-0 h-36 w-full bg-gradient-to-t from-[#050505] to-transparent" />
    </section>
  );
}
