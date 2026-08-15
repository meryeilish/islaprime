const steps = [
  {
    step: "01",
    title: "Consigue The Isle",
    description:
      "Juega The Isle: Evrima en Steam. Asegúrate de estar en la build actual del juego.",
    icon: "🎮",
  },
  {
    step: "02",
    title: "Conéctate a Isla Prime",
    description:
      "Busca «Isla Prime» en la lista de servidores de la comunidad y entra a la isla.",
    icon: "🌋",
  },
  {
    step: "03",
    title: "Vincula tu Steam",
    description:
      "Inicia sesión aquí para diseñar skins, seguir tus vitales en vivo y mucho más.",
    icon: "🔗",
  },
];

export default function Community() {
  return (
    <section
      id="unirse"
      className="relative scroll-mt-24 overflow-hidden bg-[#050505] py-28"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(185,28,28,0.08),transparent_50%)]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <div className="mb-5 flex items-center justify-center gap-4">
            <span className="h-px w-12 bg-red-600" />
            <p className="text-xs font-black uppercase tracking-[0.45em] text-red-500">
              Cómo empezar
            </p>
            <span className="h-px w-12 bg-red-600" />
          </div>

          <h2 className="text-4xl font-black uppercase text-white sm:text-5xl">
            Únete a la isla
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400">
            Tres pasos para entrar en Isla Prime y empezar a personalizar tu
            experiencia.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {steps.map((item, index) => (
            <div key={item.step} className="relative">
              {index < steps.length - 1 && (
                <div className="absolute left-[calc(50%+3rem)] top-12 hidden h-px w-[calc(100%-6rem)] bg-gradient-to-r from-red-600/50 to-transparent lg:block" />
              )}

              <div className="relative rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl transition hover:border-red-500/30 hover:bg-white/[0.05]">
                <div className="mb-6 flex items-center gap-4">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/30 bg-red-600/10 text-2xl">
                    {item.icon}
                  </span>

                  <span className="text-4xl font-black text-red-500/30">
                    {item.step}
                  </span>
                </div>

                <h3 className="text-2xl font-black uppercase text-white">
                  {item.title}
                </h3>

                <p className="mt-4 leading-7 text-zinc-400">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
