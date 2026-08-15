const footerLinks = [
  { name: "Mapa", href: "#mapa" },
  { name: "Mi Dino", href: "#mi-dino" },
  { name: "Estado", href: "#estado" },
  { name: "Reglas", href: "#reglas" },
  { name: "Voz", href: "#voice" },
  { name: "Tienda", href: "#tienda" },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-black py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <a href="#inicio" className="inline-block select-none leading-none">
              <p className="text-xs uppercase tracking-[0.5em] text-zinc-500">
                ISLA
              </p>
              <p className="text-3xl font-black text-red-500">PRIME</p>
            </a>

            <p className="mt-4 max-w-sm text-sm leading-6 text-zinc-500">
              Servidor hardcore de supervivencia para The Isle: Evrima. LATAM &
              ESP.
            </p>
          </div>

          <nav className="grid grid-cols-2 gap-x-12 gap-y-3 sm:grid-cols-3">
            {footerLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-bold uppercase tracking-wider text-zinc-400 transition hover:text-red-500"
              >
                {link.name}
              </a>
            ))}
          </nav>

          <div className="flex flex-col gap-3">
            <a
              href="#discord"
              className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-zinc-400 transition hover:text-white"
            >
              Discord
            </a>
            <a
              href="#patreon"
              className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-amber-400/80 transition hover:text-amber-300"
            >
              ♛ Patreon
            </a>
            <a
              href="#steam-login"
              className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-red-500 transition hover:text-red-400"
            >
              Steam Login
            </a>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} Isla Prime. The Isle: Evrima no está
            afiliado a este sitio.
          </p>

          <p className="text-xs uppercase tracking-[0.3em] text-zinc-700">
            Caza · Sobrevive · Evoluciona
          </p>
        </div>
      </div>
    </footer>
  );
}
