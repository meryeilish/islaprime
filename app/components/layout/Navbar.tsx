"use client";

import { useCallback, useEffect, useState } from "react";
import { walletDemo } from "@/app/data/myDino";

const links = [
  { name: "Sistemas", href: "#sistemas" },
  { name: "Mapa", href: "#mapa" },
  { name: "Mi Dino", href: "#mi-dino" },
  { name: "Estado", href: "#estado" },
  { name: "Reglas", href: "#reglas" },
  { name: "Voz", href: "#voice" },
  { name: "Tienda", href: "#tienda" },
];

type AuthUser = {
  name: string | null;
  avatar: string | null;
  coins: number;
  marks: number;
  tierLabel?: string;
};

function NavWallet({
  compact = false,
  coins,
  marks,
}: {
  compact?: boolean;
  coins: number;
  marks: number;
}) {
  return (
    <div
      className={`flex items-center gap-2 ${compact ? "flex-wrap" : ""}`}
      aria-label="Billetera"
    >
      {!compact ? (
        <span className="hidden text-[9px] font-black uppercase tracking-[0.22em] text-zinc-500 2xl:inline">
          Billetera
        </span>
      ) : (
        <span className="text-[10px] font-black uppercase tracking-[0.22em] text-zinc-500">
          Billetera
        </span>
      )}

      <a
        href="#tienda"
        title="Monedas Prime"
        className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/[0.08] px-2.5 py-1 transition hover:border-amber-400/70 hover:bg-amber-500/15"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.85)]" />
        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-200">
          Monedas
        </span>
        <span className="text-[11px] font-black tabular-nums text-white">
          {coins}
        </span>
        <span className="flex h-4 w-4 items-center justify-center rounded-full border border-amber-500/45 text-[9px] font-black text-amber-300">
          +
        </span>
      </a>

      <a
        href="#mi-dino"
        title="Marcas"
        className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/35 bg-sky-500/[0.07] px-2.5 py-1 transition hover:border-sky-400/60 hover:bg-sky-500/12"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
        <span className="text-[10px] font-bold uppercase tracking-wider text-sky-200/90">
          Marcas
        </span>
        <span className="text-[11px] font-black tabular-nums text-white">
          {marks}
        </span>
      </a>
    </div>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  const refreshAuth = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      const json = (await res.json()) as { user: AuthUser | null };
      setUser(json.user);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    void refreshAuth();
  }, [refreshAuth]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const coins = user?.coins ?? walletDemo.coins;
  const marks = user?.marks ?? walletDemo.marks;

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  }

  return (
    <header
      className={`fixed left-0 top-0 z-50 w-full border-b transition-all duration-300 ${
        scrolled
          ? "border-red-900/40 bg-black/90 shadow-[0_10px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl"
          : "border-white/5 bg-black/45 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <a href="#inicio" className="shrink-0 select-none leading-none">
          <p className="text-[10px] uppercase tracking-[0.5em] text-zinc-400">
            ISLA
          </p>
          <h1 className="text-3xl font-black text-red-500">PRIME</h1>
        </a>

        <nav className="hidden items-center gap-5 xl:flex">
          {links.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="group relative py-2 text-xs font-bold uppercase tracking-wider text-zinc-300 transition hover:text-red-500"
            >
              {link.name}
              <span className="absolute bottom-0 left-1/2 h-[2px] w-0 -translate-x-1/2 bg-red-500 transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden md:block">
            <NavWallet coins={coins} marks={marks} />
          </div>

          <a
            href="#patreon"
            className="hidden items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/5 px-3 py-2 text-[10px] font-black uppercase tracking-wider text-amber-400 transition hover:border-amber-400/60 hover:bg-amber-500/10 lg:flex"
          >
            <span>♛</span>
            Apóyanos
          </a>

          <a
            href="#discord"
            aria-label="Discord"
            className="hidden h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-sm transition hover:border-indigo-500/50 hover:bg-indigo-500/10 sm:flex"
          >
            💬
          </a>

          {user ? (
            <div className="hidden items-center gap-2 lg:flex">
              {user.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.avatar}
                  alt=""
                  className="h-8 w-8 rounded-full border border-white/15"
                />
              ) : null}
              <span className="max-w-[8rem] truncate text-[10px] font-black uppercase tracking-wider text-zinc-200">
                {user.name || "Steam"}
              </span>
              <button
                type="button"
                onClick={() => void logout()}
                className="rounded-full border border-white/15 px-3 py-2 text-[10px] font-black uppercase tracking-wider text-zinc-300 transition hover:border-white/30 hover:text-white"
              >
                Salir
              </button>
            </div>
          ) : (
            <a
              href="/api/auth/steam"
              className="hidden items-center gap-2 rounded-full bg-red-600 px-4 py-2.5 text-[10px] font-black uppercase tracking-wider text-white shadow-[0_0_20px_rgba(220,38,38,0.25)] transition hover:bg-red-500 lg:inline-flex"
            >
              Entrar con Steam
            </a>
          )}

          <button
            type="button"
            aria-label="Abrir menú"
            onClick={() => setMenuOpen((open) => !open)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white xl:hidden"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-white/10 bg-black/95 px-6 py-6 backdrop-blur-xl xl:hidden">
          <div className="mb-4 rounded-xl border border-white/10 bg-white/[0.03] p-3 md:hidden">
            <NavWallet compact coins={coins} marks={marks} />
            <a
              href="#patreon"
              onClick={() => setMenuOpen(false)}
              className="mt-3 block text-center text-[11px] font-black uppercase tracking-[0.2em] text-amber-400"
            >
              Apóyanos →
            </a>
          </div>

          <nav className="flex flex-col gap-1">
            {links.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-bold uppercase tracking-wider text-zinc-300 transition hover:bg-white/[0.05] hover:text-red-500"
              >
                {link.name}
              </a>
            ))}
          </nav>

          <div className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-4">
            {user ? (
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  void logout();
                }}
                className="rounded-full border border-white/15 px-5 py-3 text-center text-xs font-black uppercase tracking-wider text-zinc-200"
              >
                Salir ({user.name || "Steam"})
              </button>
            ) : (
              <a
                href="/api/auth/steam"
                onClick={() => setMenuOpen(false)}
                className="rounded-full bg-red-600 px-5 py-3 text-center text-xs font-black uppercase tracking-wider text-white"
              >
                Entrar con Steam
              </a>
            )}

            <a
              href="#patreon"
              onClick={() => setMenuOpen(false)}
              className="rounded-full border border-amber-500/30 px-5 py-3 text-center text-xs font-black uppercase tracking-wider text-amber-400"
            >
              ♛ Apóyanos
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
