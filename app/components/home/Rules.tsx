"use client";

import { useMemo, useState, type ReactNode } from "react";

import SectionHeader from "@/app/components/ui/SectionHeader";
import { ruleSections } from "@/app/data/rules";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatInline(text: string, query: string) {
  let html = escapeHtml(text);
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");

  const q = query.trim();
  if (!q) return html;

  const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return html.replace(
    new RegExp(`(${escaped})`, "gi"),
    '<mark class="rounded-sm bg-amber-300/40 px-0.5 text-amber-100 underline decoration-amber-300 decoration-2 underline-offset-2">$1</mark>',
  );
}

function highlightPlain(text: string, query: string): ReactNode {
  const q = query.trim();
  if (!q) return text;

  const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escaped})`, "gi"));
  return parts.map((part, index) =>
    part.toLowerCase() === q.toLowerCase() ? (
      <mark
        key={`${part}-${index}`}
        className="rounded-sm bg-amber-300/40 px-0.5 text-amber-100 underline decoration-amber-300 decoration-2 underline-offset-2"
      >
        {part}
      </mark>
    ) : (
      part
    ),
  );
}

function renderBody(body: string, query: string) {
  const lines = body.split("\n");

  return lines.map((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) return <div key={index} className="h-2" />;

    if (trimmed === "---") {
      return <hr key={index} className="my-5 border-white/10" />;
    }

    if (trimmed.startsWith("### ")) {
      return (
        <h4 key={index} className="mt-5 text-sm font-black uppercase tracking-wider text-red-400">
          {highlightPlain(trimmed.slice(4), query)}
        </h4>
      );
    }

    if (trimmed.startsWith("## ")) {
      return (
        <h3 key={index} className="mt-6 text-base font-black uppercase tracking-wide text-white">
          {highlightPlain(trimmed.slice(3), query)}
        </h3>
      );
    }

    const bulletMatch = trimmed.match(/^[-*]\s+(.*)$/);
    if (bulletMatch) {
      return (
        <li
          key={index}
          className="ml-4 list-disc text-sm leading-relaxed text-zinc-400 [&_em]:italic [&_mark]:font-semibold [&_strong]:font-bold [&_strong]:text-zinc-200"
          dangerouslySetInnerHTML={{ __html: formatInline(bulletMatch[1], query) }}
        />
      );
    }

    return (
      <p
        key={index}
        className="text-sm leading-relaxed text-zinc-400 [&_em]:italic [&_mark]:font-semibold [&_strong]:font-bold [&_strong]:text-zinc-200"
        dangerouslySetInnerHTML={{ __html: formatInline(trimmed, query) }}
      />
    );
  });
}

export default function Rules() {
  const [activeId, setActiveId] = useState(ruleSections[0]?.id ?? "");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ruleSections;
    return ruleSections.filter(
      (section) =>
        section.title.toLowerCase().includes(q) ||
        section.body.toLowerCase().includes(q),
    );
  }, [query]);

  const active = filtered.find((section) => section.id === activeId) ?? filtered[0];

  return (
    <section id="reglas" className="relative scroll-mt-24 overflow-hidden bg-[#050505] py-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(185,28,28,0.10),transparent_50%)]" />
      <div className="absolute left-1/2 top-0 h-px w-[85%] -translate-x-1/2 bg-gradient-to-r from-transparent via-red-900/50 to-transparent" />

      <div className="relative mx-auto max-w-[1400px] px-4 sm:px-6">
        <SectionHeader
          label="Reglas"
          title={
            <>
              Reglas <span className="text-red-500">Evrima</span>
            </>
          }
          description="Normas de semi-realismo de Isla Prime. Léelas antes de entrar: límites de grupo, combate, nesting y sistema de strikes."
        />

        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar reglas... (ej. Adulto, Overpacking)"
            className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-2.5 text-sm text-white outline-none transition focus:border-red-500/50 sm:max-w-md"
          />
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-600">
            {filtered.length} secciones
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[300px_minmax(0,1fr)]">
          <aside className="max-h-[70vh] overflow-y-auto rounded-2xl border border-white/10 bg-white/[0.03] p-3">
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setActiveId(ruleSections[0]?.id ?? "");
              }}
              className="mb-2 w-full rounded-xl border border-white/10 px-3 py-2 text-left text-xs font-black uppercase tracking-wider text-zinc-400 transition hover:border-white/20 hover:text-white"
            >
              Todas las secciones
            </button>

            <div className="space-y-1">
              {filtered.map((section) => {
                const selected = active?.id === section.id;
                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => setActiveId(section.id)}
                    className={`w-full rounded-xl border px-3 py-2.5 text-left text-xs font-bold uppercase tracking-wide transition ${
                      selected
                        ? "border-red-500/50 bg-red-600/15 text-white"
                        : "border-transparent text-zinc-500 hover:border-white/10 hover:bg-white/[0.03] hover:text-zinc-300"
                    }`}
                  >
                    {highlightPlain(section.title, query)}
                  </button>
                );
              })}
            </div>
          </aside>

          <article className="min-h-[70vh] rounded-2xl border border-white/10 bg-black/50 p-6 sm:p-8">
            {active ? (
              <>
                <p className="text-xs font-black uppercase tracking-[0.25em] text-red-500">
                  Sección
                </p>
                <h3 className="mt-2 text-2xl font-black uppercase text-white sm:text-3xl">
                  {highlightPlain(active.title, query)}
                </h3>
                <div className="mt-6 space-y-1 border-t border-white/10 pt-6">
                  {renderBody(active.body, query)}
                </div>
              </>
            ) : (
              <p className="text-sm text-zinc-500">No hay resultados para esa búsqueda.</p>
            )}
          </article>
        </div>
      </div>
    </section>
  );
}
