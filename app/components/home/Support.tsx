import { siteConfig } from "@/app/config/site";
import {
  claimSteps,
  primeCoins,
  supporterTiers,
  vipPillars,
} from "@/app/data/shop";

export default function Support() {
  return (
    <section
      id="tienda"
      className="relative scroll-mt-24 overflow-hidden bg-[#050505] py-20 sm:py-28"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(185,28,28,0.14),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_60%,rgba(30,58,90,0.12),transparent_45%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-900/50 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-5 flex items-center justify-center gap-4">
            <span className="h-px w-12 bg-red-600" />
            <p className="text-xs font-black uppercase tracking-[0.45em] text-red-500">
              Apoyo
            </p>
            <span className="h-px w-12 bg-red-600" />
          </div>

          <h2 className="text-4xl font-black uppercase leading-tight text-white sm:text-5xl">
            Apoya <span className="text-red-500">Isla Prime</span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
            Apoya el servidor, la web y la comunidad. Patreon desbloquea VIP;
            las <span className="text-white">{primeCoins.name}</span> sirven
            para grows, recompensas y funciones de la página.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-[11px] font-black uppercase tracking-[0.16em]">
            <span className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-zinc-300">
              4 niveles Patreon
            </span>
            <span className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-zinc-300">
              Desde $5 / mes
            </span>
            <span className="rounded-full border border-red-500/40 bg-red-600/15 px-4 py-2 text-red-300">
              Destacado · Prime Hunter
            </span>
          </div>
        </div>

        {/* Qué da el VIP */}
        <div className="mt-16">
          <p className="mb-6 text-center text-[11px] font-black uppercase tracking-[0.35em] text-zinc-500">
            Qué te da ser supporter
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            {vipPillars.map((pillar) => (
              <div
                key={pillar.id}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
              >
                <p className="text-2xl">{pillar.emoji}</p>
                <h3 className="mt-3 text-lg font-black uppercase tracking-wide text-white">
                  {pillar.title}
                </h3>
                <ul className="mt-4 space-y-2">
                  {pillar.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-sm text-zinc-400"
                    >
                      <span className="h-1 w-1 shrink-0 rounded-full bg-red-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Prime Coins */}
        <div className="mt-10 rounded-2xl border border-amber-500/20 bg-gradient-to-r from-amber-500/[0.07] to-transparent px-6 py-5 sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-400">
                Moneda de la isla
              </p>
              <h3 className="mt-1 text-xl font-black uppercase text-white">
                {primeCoins.name}
              </h3>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-400">
                Cada nivel entrega monedas {primeCoins.cadence}. Úsalas para{" "}
                {primeCoins.uses.slice(0, 2).join(", ").toLowerCase()} y más.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {supporterTiers.map((tier) => (
                <span
                  key={tier.id}
                  className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-[11px] font-bold text-zinc-300"
                >
                  {tier.emoji} {tier.coins} monedas
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Tiers */}
        <div id="patreon" className="mt-16 scroll-mt-28">
          <div className="mb-8 text-center">
            <p className="text-[11px] font-black uppercase tracking-[0.35em] text-zinc-500">
              Paquetes Patreon
            </p>
            <h3 className="mt-2 text-2xl font-black uppercase text-white sm:text-3xl">
              Elige tu nivel
            </h3>
          </div>

          <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-4">
            {supporterTiers.map((tier) => (
              <article
                key={tier.id}
                className={`relative flex flex-col overflow-hidden rounded-2xl border p-6 transition ${
                  tier.popular
                    ? "border-red-500/50 bg-gradient-to-b from-red-600/15 to-[#0b0b0b] shadow-[0_0_50px_rgba(185,28,28,0.18)] xl:-translate-y-2"
                    : "border-white/10 bg-[#0b0b0b] hover:border-white/20"
                }`}
              >
                {tier.popular ? (
                  <span className="absolute right-4 top-4 rounded-full bg-red-600 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-white">
                    ★ Más popular
                  </span>
                ) : null}

                <p className="text-3xl">{tier.emoji}</p>
                <h4 className="mt-3 text-lg font-black uppercase tracking-wide text-white">
                  {tier.name}
                </h4>
                <p className="mt-1 text-sm text-zinc-500">{tier.summary}</p>

                <div className="mt-5 flex items-end gap-1">
                  <span className="text-4xl font-black text-white">
                    {tier.price}
                  </span>
                  <span className="mb-1 text-xs font-bold uppercase tracking-wider text-zinc-500">
                    {tier.priceNote}
                  </span>
                </div>

                <p className="mt-3 rounded-xl border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-[11px] font-black uppercase tracking-wider text-amber-300">
                  {tier.coinsLabel}
                </p>

                <ul className="mt-5 flex-1 space-y-2.5">
                  {tier.perks.map((perk) => (
                    <li
                      key={perk}
                      className="flex gap-2 text-sm leading-snug text-zinc-400"
                    >
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-red-500" />
                      {perk}
                    </li>
                  ))}
                </ul>

                <a
                  href={siteConfig.urls.patreon}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-7 inline-flex items-center justify-center rounded-full px-5 py-3 text-center text-[11px] font-black uppercase tracking-wider transition ${
                    tier.popular
                      ? "bg-red-600 text-white shadow-[0_0_24px_rgba(220,38,38,0.35)] hover:bg-red-500"
                      : "border border-white/15 text-zinc-200 hover:border-red-500/40 hover:text-white"
                  }`}
                >
                  Abrir en Patreon
                </a>
              </article>
            ))}
          </div>
        </div>

        {/* Cómo reclamar */}
        <div className="mt-20">
          <div className="mb-8 text-center">
            <p className="text-[11px] font-black uppercase tracking-[0.35em] text-zinc-500">
              Cómo activar VIP
            </p>
            <h3 className="mt-2 text-2xl font-black uppercase text-white">
              Patreon → Web → Discord
            </h3>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {claimSteps.map((item) => (
              <div
                key={item.step}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
              >
                <span className="text-2xl font-black text-red-500/40">
                  {item.step}
                </span>
                <h4 className="mt-3 text-sm font-black uppercase tracking-wide text-white">
                  {item.title}
                </h4>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={siteConfig.urls.patreon}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-red-600 px-7 py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-[0_0_30px_rgba(220,38,38,0.3)] transition hover:bg-red-500"
            >
              ♛ Unirme en Patreon
            </a>
            <a
              href={siteConfig.urls.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-7 py-3.5 text-xs font-black uppercase tracking-wider text-zinc-300 transition hover:border-white/30 hover:text-white"
            >
              Discord de la isla
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
