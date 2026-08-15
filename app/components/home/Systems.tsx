const systems = [
  {
    number: "01",
    title: "Mapa",
    description:
      "Mapa interactivo de Gateway: capas de agua, comida, migraciones, PvP y spawns en tiempo real.",
    href: "#mapa",
    icon: "🗺️",
  },
  {
    number: "02",
    title: "Mi Dino",
    description:
      "Monitorea tu dino en vivo: vitales, crecimiento, ubicación y editor de skin con paleta completa.",
    href: "#mi-dino",
    icon: "🎨",
  },
  {
    number: "03",
    title: "Estado en vivo",
    description:
      "Panel de vitales: salud, hambre, sed, crecimiento y progreso de tu dinosaurio conectado al servidor.",
    href: "#mi-dino",
    icon: "📊",
  },
  {
    number: "04",
    title: "Rankings",
    description:
      "Tablas de la isla: más kills, mejor ratio, muertes por IA y las vidas más largas del servidor.",
    href: "#rankings",
    icon: "🏆",
  },
  {
    number: "05",
    title: "Reglas",
    description:
      "Reglas oficiales del servidor y de Discord. Conócelas antes de entrar a la isla.",
    href: "#reglas",
    icon: "📜",
  },
  {
    number: "06",
    title: "Voz",
    description:
      "Canal de voz espacial. Habla con jugadores cercanos directamente desde el navegador.",
    href: "#voice",
    icon: "🎙️",
  },
  {
    number: "07",
    title: "Estado del servidor",
    description:
      "Salud de la isla: estado en tiempo real del juego, bots y todos los servicios activos.",
    href: "#estado",
    icon: "🟢",
  },
  {
    number: "08",
    title: "Tienda",
    description:
      "Mercado y membresías. Apoya al servidor y desbloquea beneficios exclusivos.",
    href: "#tienda",
    icon: "🛒",
  },
];

export default function Systems() {
  return (
    <section
      id="sistemas"
      className="relative scroll-mt-24 overflow-hidden bg-[#050505] py-28"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-900/50 to-transparent" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(185,28,28,0.10),transparent_55%)]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mb-16 max-w-3xl">
          <div className="mb-5 flex items-center gap-4">
            <span className="h-px w-12 bg-red-600" />
            <p className="text-xs font-black uppercase tracking-[0.45em] text-red-500">
              Centro de mando
            </p>
          </div>

          <h2 className="text-4xl font-black uppercase leading-tight text-white sm:text-5xl lg:text-6xl">
            Todo lo que necesitas,{" "}
            <span className="text-red-500">en un lugar</span>
          </h2>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
            Ocho sistemas conectados a la isla en vivo. Inicia sesión con Steam
            para sincronizar tu dino y desbloquear todo el control.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {systems.map((system) => (
            <a
              key={system.number}
              href={system.href}
              className="group relative flex min-h-[260px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition duration-300 hover:-translate-y-1 hover:border-red-500/40 hover:bg-white/[0.06] hover:shadow-[0_0_50px_rgba(220,38,38,0.12)]"
            >
              <div className="flex items-start justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-red-500/20 bg-red-600/10 text-xl">
                  {system.icon}
                </span>

                <span className="text-5xl font-black leading-none text-white/[0.06] transition group-hover:text-red-500/15">
                  {system.number}
                </span>
              </div>

              <div className="mt-auto pt-8">
                <h3 className="text-xl font-black uppercase tracking-wide text-white">
                  {system.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-zinc-500 transition group-hover:text-zinc-400">
                  {system.description}
                </p>

                <p className="mt-5 text-xs font-black uppercase tracking-[0.2em] text-red-500 opacity-0 transition group-hover:opacity-100">
                  Abrir sistema →
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
