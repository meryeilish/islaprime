export default function CTA() {
  return (
    <section className="relative overflow-hidden bg-[#050505] py-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(185,28,28,0.18),transparent_65%)]" />

      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-900/50 to-transparent" />

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <p className="mb-4 text-xs font-black uppercase tracking-[0.45em] text-red-500">
          Gateway · Build actual
        </p>

        <h2 className="text-4xl font-black uppercase text-white sm:text-5xl">
          ¿Listo para sobrevivir?
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
          Vincula tu cuenta de Steam, personaliza tu dinosaurio y entra al
          servidor en vivo de Isla Prime.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#steam-login"
            className="inline-flex items-center gap-3 rounded-full bg-red-600 px-8 py-4 text-sm font-black uppercase tracking-wider text-white shadow-[0_0_40px_rgba(220,38,38,0.35)] transition hover:-translate-y-0.5 hover:bg-red-500"
          >
            <span className="text-lg">⬡</span>
            Entrar con Steam
          </a>

          <a
            href="#estado"
            className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/[0.04] px-8 py-4 text-sm font-black uppercase tracking-wider text-zinc-200 backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-red-500/50 hover:text-white"
          >
            Ver el servidor en vivo
          </a>
        </div>
      </div>
    </section>
  );
}
