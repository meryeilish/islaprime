"use client";

import { useMemo, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";

import SteamButton from "@/app/components/ui/SteamButton";
import {
  PRIMARY_ZONES,
  ZONE_DEFS,
  type SkinColors,
  type SkinPattern,
} from "@/app/components/skin/skinTypes";
import {
  hasSkinModel,
  skinAssets,
  skinVariants,
} from "@/app/components/skin/skinModels";
import {
  SKIN_BACKGROUNDS,
  type SkinBackgroundId,
} from "@/app/components/skin/skinBackgrounds";

/** Roughness por defecto estilo studio (piel). */
const DEFAULT_SKIN_ROUGHNESS = 0.28;

const SkinModelViewer = dynamic(
  () => import("@/app/components/skin/SkinModelViewer"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">
          Preparando visor 3D…
        </p>
      </div>
    ),
  },
);

type Diet = "carnivoro" | "herbivoro" | "omnivoro";
type DietFilter = "all" | Diet;
type StudioTab = "custom" | "skins" | "import";

interface Species {
  id: string;
  name: string;
  diet: Diet;
}

const speciesList: Species[] = [
  { id: "allo", name: "Allosaurus", diet: "carnivoro" },
  { id: "aust", name: "Austroraptor", diet: "carnivoro" },
  { id: "beip", name: "Beipiaosaurus", diet: "herbivoro" },
  { id: "carno", name: "Carnotaurus", diet: "carnivoro" },
  { id: "cerato", name: "Ceratosaurus", diet: "carnivoro" },
  { id: "deino", name: "Deinosuchus", diet: "carnivoro" },
  { id: "diablo", name: "Diabloceratops", diet: "herbivoro" },
  { id: "dilo", name: "Dilophosaurus", diet: "carnivoro" },
  { id: "dryo", name: "Dryosaurus", diet: "herbivoro" },
  { id: "galli", name: "Gallimimus", diet: "omnivoro" },
  { id: "herra", name: "Herrerasaurus", diet: "carnivoro" },
  { id: "hypsi", name: "Hypsilophodon", diet: "herbivoro" },
  { id: "kentro", name: "Kentrosaurus", diet: "herbivoro" },
  { id: "maia", name: "Maiasaura", diet: "herbivoro" },
  { id: "omni", name: "Omniraptor", diet: "omnivoro" },
  { id: "pachy", name: "Pachycephalosaurus", diet: "herbivoro" },
  { id: "ptera", name: "Pteranodon", diet: "carnivoro" },
  { id: "rex", name: "Tyrannosaurus", diet: "carnivoro" },
  { id: "stego", name: "Stegosaurus", diet: "herbivoro" },
  { id: "teno", name: "Tenontosaurus", diet: "herbivoro" },
  { id: "trike", name: "Triceratops", diet: "herbivoro" },
  { id: "troodon", name: "Troodon", diet: "omnivoro" },
];

const dietFilters: { id: DietFilter; label: string }[] = [
  { id: "all", label: "Todos" },
  { id: "carnivoro", label: "Carnívoro" },
  { id: "herbivoro", label: "Herbívoro" },
  { id: "omnivoro", label: "Omnívoro" },
];

const studioTabs: { id: StudioTab; label: string }[] = [
  { id: "custom", label: "Personalizar" },
  { id: "skins", label: "Mis skins" },
  { id: "import", label: "Importar" },
];

function makePalette(
  partial: Partial<SkinColors> & Pick<SkinColors, "alto" | "medio" | "vientre">,
): SkinColors {
  return {
    marcaje: partial.marcaje ?? partial.alto,
    alto: partial.alto,
    medio: partial.medio,
    medio2: partial.medio2 ?? partial.medio,
    bajo: partial.bajo ?? partial.medio,
    vientre: partial.vientre,
    ojos: partial.ojos ?? "#d9c14a",
    dientes: partial.dientes ?? "#e8e0d0",
    boca: partial.boca ?? "#5a3030",
    garras: partial.garras ?? "#2a2218",
  };
}

const carnivoreDefaults = makePalette({
  marcaje: "#33231a",
  alto: "#4a2e20",
  medio: "#7a5238",
  medio2: "#5c3f2e",
  bajo: "#8a6242",
  vientre: "#c9ab84",
  ojos: "#d9c14a",
  dientes: "#efe6d4",
  boca: "#6b3030",
  garras: "#2a1a12",
});

const herbivoreDefaults = makePalette({
  marcaje: "#2c351d",
  alto: "#3c4826",
  medio: "#5d6b3f",
  medio2: "#49552f",
  bajo: "#6e7a4a",
  vientre: "#c6c39a",
  ojos: "#c47a2c",
});

const ALL_PATTERNS: { id: SkinPattern; label: string; key: string }[] = [
  { id: "A", label: "A", key: "a" },
  { id: "B", label: "B", key: "b" },
  { id: "C", label: "C", key: "c" },
  { id: "D", label: "D", key: "d" },
  { id: "E", label: "E", key: "e" },
  { id: "F", label: "F", key: "f" },
  { id: "G", label: "G", key: "g" },
  { id: "H", label: "H", key: "h" },
];

const randomPool = [
  "#7a5238", "#5c3f2e", "#8a6242", "#a3542f", "#c9ab84", "#33231a",
  "#5d6b3f", "#49552f", "#6e7a4a", "#2c351d", "#c6c39a", "#8c9463",
  "#5b6e70", "#3d5a5c", "#96605c", "#b08a4f", "#d9c14a", "#c47a2c",
  "#e8e0d0", "#6b3030", "#2a1a12", "#1f2937",
];

function randomColor(): string {
  return randomPool[Math.floor(Math.random() * randomPool.length)];
}

function defaultsFor(species: Species): SkinColors {
  return species.diet === "herbivoro" ? herbivoreDefaults : carnivoreDefaults;
}

function dietLabel(diet: Diet): string {
  if (diet === "carnivoro") return "Carnívoro";
  if (diet === "herbivoro") return "Herbívoro";
  return "Omnívoro";
}

function dietTag(diet: Diet): string {
  if (diet === "carnivoro") return "CARN";
  if (diet === "herbivoro") return "HERB";
  return "OMNI";
}

function zoneLabel(id: keyof SkinColors): string {
  return ZONE_DEFS.find((zone) => zone.id === id)?.label ?? id;
}

function ToolBtn({
  label,
  active,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`flex h-10 w-10 items-center justify-center rounded-xl border text-sm transition ${
        active
          ? "border-red-500/60 bg-gradient-to-br from-red-500/35 to-amber-500/20 text-white shadow-[0_0_18px_rgba(220,38,38,0.35)]"
          : "border-white/10 bg-black/55 text-zinc-300 hover:border-white/25 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

export default function SkinEditor() {
  const [demoMode, setDemoMode] = useState(false);
  const [selectedId, setSelectedId] = useState("allo");
  const [dinoName, setDinoName] = useState("Midnight Granite");
  const [sex, setSex] = useState<"M" | "F">("M");
  const [pattern, setPattern] = useState<SkinPattern>("A");
  const [colors, setColors] = useState<SkinColors>(carnivoreDefaults);
  const [autoRotate, setAutoRotate] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [background, setBackground] = useState<SkinBackgroundId>("grid");
  const [roughness, setRoughness] = useState(DEFAULT_SKIN_ROUGHNESS);
  const [bgMenuOpen, setBgMenuOpen] = useState(false);
  const [activeZone, setActiveZone] = useState<keyof SkinColors>("medio");
  const [dietFilter, setDietFilter] = useState<DietFilter>("all");
  const [speciesQuery, setSpeciesQuery] = useState("");
  const [studioTab, setStudioTab] = useState<StudioTab>("custom");
  const [copied, setCopied] = useState<"code" | "json" | null>(null);
  const [jsonOpen, setJsonOpen] = useState(false);
  const [jsonText, setJsonText] = useState("");
  const [jsonError, setJsonError] = useState("");

  const backgroundGroups = useMemo(
    () =>
      (
        [
          ["espectacular", "Espectaculares"],
          ["realista", "Realistas HDR"],
          ["estudio", "Estudio"],
        ] as const
      ).map(([group, label]) => ({
        group,
        label,
        items: SKIN_BACKGROUNDS.filter((item) => item.group === group),
      })),
    [],
  );

  const species = speciesList.find((item) => item.id === selectedId) ?? speciesList[0];
  const availablePatterns = useMemo(() => {
    const keys = new Set(skinVariants(species.id));
    return ALL_PATTERNS.filter((item) => keys.has(item.key));
  }, [species.id]);
  const assets = skinAssets(species.id, sex, pattern);
  const speciesIndex = speciesList.findIndex((item) => item.id === selectedId);

  const filteredSpecies = useMemo(() => {
    const q = speciesQuery.trim().toLowerCase();
    return speciesList.filter((item) => {
      if (dietFilter !== "all" && item.diet !== dietFilter) return false;
      if (q && !item.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [dietFilter, speciesQuery]);

  const skinPayload = useMemo(
    () => ({
      species: species.id,
      name: dinoName,
      sex,
      pattern,
      colors,
    }),
    [species.id, dinoName, sex, pattern, colors],
  );

  const skinCode = useMemo(() => {
    const hexes = ZONE_DEFS.map((zone) => colors[zone.id].replace("#", "")).join(".");
    return `${species.id.toUpperCase()}-${sex}-${pattern.toUpperCase()}-${hexes}`;
  }, [species.id, sex, pattern, colors]);

  const selectSpecies = (id: string) => {
    const item = speciesList.find((entry) => entry.id === id);
    if (!item) return;
    setSelectedId(item.id);
    setColors(defaultsFor(item));
    const variants = skinVariants(item.id);
    const first = ALL_PATTERNS.find((entry) => variants.includes(entry.key));
    setPattern(first?.id ?? "A");
  };

  const cycleSpecies = (dir: -1 | 1) => {
    const next = (speciesIndex + dir + speciesList.length) % speciesList.length;
    selectSpecies(speciesList[next].id);
  };

  const setZone = (zone: keyof SkinColors, value: string) => {
    setColors((current) => ({ ...current, [zone]: value }));
  };

  const randomize = () => {
    const next = { ...colors };
    for (const zone of ZONE_DEFS) next[zone.id] = randomColor();
    setColors(next);
    const pool = availablePatterns.length ? availablePatterns : ALL_PATTERNS;
    setPattern(pool[Math.floor(Math.random() * pool.length)].id);
  };

  const reset = () => {
    setColors(defaultsFor(species));
    setPattern("A");
  };

  const copyText = async (value: string, kind: "code" | "json") => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = value;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    }
    setCopied(kind);
    setTimeout(() => setCopied(null), 2000);
  };

  const openJson = () => {
    setJsonText(JSON.stringify(skinPayload, null, 2));
    setJsonError("");
    setJsonOpen(true);
    setStudioTab("import");
  };

  const loadJson = () => {
    try {
      const parsed = JSON.parse(jsonText) as Partial<typeof skinPayload> & {
        colors?: Partial<SkinColors>;
      };
      if (parsed.species && speciesList.some((item) => item.id === parsed.species)) {
        setSelectedId(parsed.species);
      }
      if (typeof parsed.name === "string") setDinoName(parsed.name.slice(0, 24));
      if (parsed.sex === "M" || parsed.sex === "F") setSex(parsed.sex);
      if (parsed.pattern && ALL_PATTERNS.some((item) => item.id === parsed.pattern)) {
        setPattern(parsed.pattern);
      } else if (parsed.pattern === "default") {
        setPattern("A");
      }
      if (parsed.colors) {
        setColors((current) => {
          const next = { ...current };
          for (const zone of ZONE_DEFS) {
            const value = parsed.colors?.[zone.id];
            if (typeof value === "string" && /^#[0-9a-fA-F]{6}$/.test(value)) {
              next[zone.id] = value;
            }
          }
          return next;
        });
      }
      setJsonError("");
      setJsonOpen(false);
      setStudioTab("custom");
    } catch {
      setJsonError("JSON inválido.");
    }
  };

  return (
    <section
      id="skin-dino"
      className={`relative scroll-mt-24 overflow-hidden bg-[#06080d] ${
        demoMode ? "py-6 sm:py-8" : "py-16 sm:py-20"
      }`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(185,28,28,0.18),transparent_40%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(40,80,130,0.28),transparent_58%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(30,58,90,0.22),transparent_45%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#06080d] to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#06080d] to-transparent" />

      {!demoMode ? (
        <div className="relative mx-auto max-w-[1500px] px-4 sm:px-6">
          <div className="mx-auto max-w-xl">
            <p className="text-[11px] font-black uppercase tracking-[0.35em] text-red-400">
              Panel
            </p>
            <h2 className="mt-3 text-4xl font-black uppercase tracking-tight text-white sm:text-5xl">
              Skin Studio
            </h2>
            <p className="mt-4 text-base leading-relaxed text-zinc-400">
              Previsualiza cada especie y diseña skins por regiones. Sin catálogo público ni fotos.
            </p>
            <div className="relative mt-8 overflow-hidden rounded-2xl border border-red-500/20 bg-gradient-to-b from-[#121722] to-[#0a0c12] p-8 text-center shadow-[0_0_60px_rgba(30,58,90,0.25)] sm:p-10">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(185,28,28,0.12),transparent_60%)]" />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(30,58,90,0.2),transparent_55%)]" />
              <p className="relative text-sm leading-relaxed text-zinc-400">
                Inicia sesión para guardar y aplicar skins, o entra en demo para explorar el estudio.
              </p>
              <div className="relative mt-7 flex flex-col items-center gap-3">
                <SteamButton className="w-full sm:w-auto" label="Iniciar sesión con Steam" />
                <button
                  type="button"
                  onClick={() => setDemoMode(true)}
                  className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 underline-offset-4 transition hover:text-white hover:underline"
                >
                  Explorar en modo demo →
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative mx-auto w-full max-w-[1920px] px-2 sm:px-3 lg:px-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3 px-1">
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.35em] text-red-400">
                Panel
              </p>
              <h2 className="text-xl font-black uppercase tracking-tight text-white sm:text-2xl">
                Skin Studio
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setDemoMode(false)}
              className="rounded-xl border border-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-wider text-zinc-400 transition hover:border-white/20 hover:text-white"
            >
              Salir demo
            </button>
          </div>

          {/* Panel único full-bleed · atmósfera Isla Prime */}
          <div className="overflow-hidden rounded-2xl border border-red-500/15 bg-[#07090f]/90 shadow-[0_0_80px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(185,28,28,0.12)] backdrop-blur-sm">
            <div className="grid min-h-[calc(100vh-9rem)] lg:min-h-[calc(100vh-8rem)] lg:grid-cols-[240px_minmax(0,1fr)_300px] xl:grid-cols-[260px_minmax(0,1fr)_320px]">
              {/* Specimens */}
              <aside className="order-2 flex max-h-[42vh] flex-col border-white/10 bg-gradient-to-b from-[#0c1018]/80 to-transparent lg:order-1 lg:max-h-none lg:border-r">
                <div className="border-b border-white/8 px-4 py-3">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-[11px] font-black uppercase tracking-[0.22em] text-zinc-400">
                      Especies
                    </p>
                    <span className="text-sm font-black text-red-400">
                      {filteredSpecies.length}
                    </span>
                  </div>
                  <div className="mb-3 flex flex-wrap gap-1.5">
                    {dietFilters.map((filter) => (
                      <button
                        key={filter.id}
                        type="button"
                        onClick={() => setDietFilter(filter.id)}
                        className={`rounded-full px-2.5 py-1.5 text-[9px] font-black uppercase tracking-wider transition ${
                          dietFilter === filter.id
                            ? "bg-red-600 text-white shadow-[0_0_16px_rgba(220,38,38,0.4)]"
                            : "border border-white/10 text-zinc-400 hover:border-white/20 hover:text-white"
                        }`}
                      >
                        {filter.label}
                      </button>
                    ))}
                  </div>
                  <input
                    type="search"
                    value={speciesQuery}
                    onChange={(event) => setSpeciesQuery(event.target.value)}
                    placeholder="Buscar especie…"
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-red-500/40"
                  />
                </div>
                <ul className="min-h-0 flex-1 space-y-0.5 overflow-y-auto px-2 py-2">
                  {filteredSpecies.map((item) => {
                    const active = item.id === selectedId;
                    const hasModel = hasSkinModel(item.id);
                    return (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={() => selectSpecies(item.id)}
                          className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition ${
                            active
                              ? "border-red-500/40 bg-red-600/15"
                              : "border-transparent hover:border-white/10 hover:bg-white/[0.03]"
                          }`}
                        >
                          <span
                            className={`h-2 w-2 shrink-0 rounded-full ${
                              hasModel
                                ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"
                                : "bg-zinc-700"
                            }`}
                          />
                          <span className="flex-1 text-sm font-bold text-white">
                            {item.name}
                          </span>
                          <span className="text-[10px] font-black uppercase tracking-wider text-red-400/80">
                            {dietTag(item.diet)}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </aside>

              {/* Visor 3D */}
              <div className="relative order-1 min-h-[58vh] bg-[#0a1528] lg:order-2 lg:min-h-0">
                {assets ? (
                  <SkinModelViewer
                    url={assets.modelUrl}
                    maskUrl={assets.maskUrl}
                    utilUrl={assets.utilUrl}
                    util={assets.util}
                    colors={colors}
                    female={sex === "F"}
                    autoRotate={autoRotate}
                    animate={animate}
                    background={background}
                    roughness={roughness}
                  />
                ) : (
                  <div className="relative flex h-full min-h-[58vh] flex-col items-center justify-center gap-2 px-8 text-center lg:min-h-0">
                    <p className="text-sm font-black uppercase tracking-wider text-zinc-400">
                      Modelo 3D próximamente
                    </p>
                    <p className="max-w-sm text-xs leading-relaxed text-zinc-600">
                      Elige una especie con punto rojo para ver la vista previa 3D.
                    </p>
                  </div>
                )}

                {/* Solo viñeta en bordes — el centro queda limpio para ver la skin */}
                <div className="pointer-events-none absolute inset-y-0 left-0 z-[5] w-16 bg-gradient-to-r from-[#07090f] to-transparent" />
                <div className="pointer-events-none absolute inset-y-0 right-0 z-[5] w-16 bg-gradient-to-l from-[#07090f] to-transparent" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-24 bg-gradient-to-t from-[#07090f] to-transparent" />
                <div className="pointer-events-none absolute inset-x-0 top-0 z-[5] h-16 bg-gradient-to-b from-[#07090f]/70 to-transparent" />

                <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex flex-col items-center gap-3 px-4 pt-5">
                  <div className="text-center">
                    <h3 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                      {species.name}
                    </h3>
                    <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.22em] text-zinc-500">
                      {dietLabel(species.diet)} · {dinoName || "Sin nombre"}
                    </p>
                  </div>

                  <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-2">
                    <div className="flex items-center gap-1 rounded-full border border-red-500/20 bg-black/55 p-1 backdrop-blur-md">
                      <span className="px-2 text-[9px] font-black uppercase tracking-[0.18em] text-zinc-500">
                        Patrón
                      </span>
                      {availablePatterns.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setPattern(item.id)}
                          className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-black transition ${
                            pattern === item.id
                              ? "bg-red-600 text-white shadow-[0_0_14px_rgba(220,38,38,0.55)]"
                              : "text-zinc-400 hover:bg-white/10 hover:text-white"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-1 rounded-full border border-red-500/15 bg-black/55 p-1 backdrop-blur-md">
                      {(
                        [
                          ["M", "♂"],
                          ["F", "♀"],
                        ] as const
                      ).map(([value, label]) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setSex(value)}
                          className={`flex h-8 w-10 items-center justify-center rounded-full text-sm font-black transition ${
                            sex === value
                              ? "bg-red-600/25 text-white"
                              : "text-zinc-500 hover:text-white"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 rounded-full border border-red-500/15 bg-black/55 px-3 py-1.5 backdrop-blur-md">
                      <span className="text-[9px] font-black uppercase tracking-[0.18em] text-zinc-500">
                        Rugosidad
                      </span>
                      <input
                        type="range"
                        min={0.08}
                        max={0.85}
                        step={0.01}
                        value={roughness}
                        onChange={(event) => setRoughness(Number(event.target.value))}
                        className="h-1.5 w-24 cursor-pointer accent-red-500 sm:w-28"
                        aria-label="Rugosidad de la skin"
                      />
                      <span className="min-w-[2.4rem] text-right text-[10px] font-black tabular-nums text-red-400">
                        {roughness.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 px-4 pb-4">
                  <div className="mb-3 flex items-end justify-between gap-3">
                    <div className="pointer-events-auto relative">
                      <button
                        type="button"
                        onClick={() => setBgMenuOpen((open) => !open)}
                        className="rounded-xl border border-white/10 bg-black/55 px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-zinc-300 backdrop-blur-md transition hover:border-white/25 hover:text-white"
                      >
                        ⛶ Fondo · {SKIN_BACKGROUNDS.find((item) => item.id === background)?.short}
                      </button>
                      {bgMenuOpen && (
                        <div className="absolute bottom-full left-0 z-20 mb-2 max-h-[340px] min-w-[200px] overflow-y-auto rounded-xl border border-white/10 bg-black/92 p-1.5 shadow-2xl backdrop-blur-md">
                          {backgroundGroups.map((section) => (
                            <div key={section.group} className="mb-1 last:mb-0">
                              <p className="px-2 py-1.5 text-[9px] font-black uppercase tracking-[0.18em] text-zinc-600">
                                {section.label}
                              </p>
                              {section.items.map((item) => (
                                <button
                                  key={item.id}
                                  type="button"
                                  onClick={() => {
                                    setBackground(item.id);
                                    setBgMenuOpen(false);
                                  }}
                                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-[11px] font-bold uppercase tracking-wider transition ${
                                    background === item.id
                                      ? "bg-red-600/25 text-white"
                                      : "text-zinc-400 hover:bg-white/5 hover:text-white"
                                  }`}
                                >
                                  <span>{item.label}</span>
                                  <span className="text-[9px] text-zinc-600">{item.short}</span>
                                </button>
                              ))}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <p className="hidden text-[10px] font-bold uppercase tracking-wider text-zinc-600 sm:block">
                      Estático · 1 malla/sexo · vista previa ≠ juego
                    </p>
                  </div>

                  <div className="pointer-events-auto mx-auto flex w-fit items-center gap-2 rounded-2xl border border-white/10 bg-black/60 p-2 backdrop-blur-md">
                    <ToolBtn label="Anterior" onClick={() => cycleSpecies(-1)}>
                      ‹
                    </ToolBtn>
                    <ToolBtn label="Siguiente" onClick={() => cycleSpecies(1)}>
                      ›
                    </ToolBtn>
                    <ToolBtn label="Reiniciar colores" onClick={reset}>
                      ↻
                    </ToolBtn>
                    <ToolBtn
                      label={animate ? "Pausar animación" : "Reproducir animación"}
                      active={animate}
                      onClick={() => setAnimate((value) => !value)}
                    >
                      {animate ? "❚❚" : "▶"}
                    </ToolBtn>
                    <ToolBtn
                      label={autoRotate ? "Pausar rotación" : "Auto-rotar cámara"}
                      active={autoRotate}
                      onClick={() => setAutoRotate((value) => !value)}
                    >
                      ⟳
                    </ToolBtn>
                    <ToolBtn label="Aleatorio" onClick={randomize}>
                      ✥
                    </ToolBtn>
                    <ToolBtn label="Exportar JSON" onClick={openJson}>
                      ⇪
                    </ToolBtn>
                  </div>
                </div>
              </div>

              {/* Colores derecha */}
              <aside className="order-3 flex max-h-[48vh] flex-col border-t border-white/10 bg-gradient-to-b from-[#0c1018]/80 to-transparent lg:max-h-none lg:border-l lg:border-t-0">
                <div className="flex flex-wrap gap-2 border-b border-white/8 px-4 py-3">
                  {studioTabs.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => {
                        setStudioTab(tab.id);
                        if (tab.id === "import") {
                          setJsonText(JSON.stringify(skinPayload, null, 2));
                          setJsonError("");
                        }
                      }}
                      className={`rounded-lg px-3 py-2 text-[11px] font-black uppercase tracking-[0.16em] transition ${
                        studioTab === tab.id
                          ? "bg-white/10 text-white underline decoration-red-500 decoration-2 underline-offset-8"
                          : "text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-4">
                  {studioTab === "custom" && (
                    <>
                      <label className="block">
                        <span className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500">
                          Nombre de la skin
                        </span>
                        <input
                          type="text"
                          value={dinoName}
                          maxLength={24}
                          onChange={(event) => setDinoName(event.target.value)}
                          placeholder="Nombre…"
                          className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm font-bold text-white outline-none focus:border-red-500/50"
                        />
                      </label>

                      <div>
                        <p className="mb-2 text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500">
                          Regiones de color
                        </p>
                        <div className="grid gap-1.5">
                          {PRIMARY_ZONES.map((zoneId) => {
                            const active = activeZone === zoneId;
                            return (
                              <label
                                key={zoneId}
                                className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 transition ${
                                  active
                                    ? "border-red-500/40 bg-red-600/10"
                                    : "border-white/8 bg-white/[0.02] hover:border-white/15"
                                }`}
                              >
                                <span className="flex-1 text-xs font-bold uppercase tracking-wider text-zinc-200">
                                  {zoneLabel(zoneId)}
                                </span>
                                <span
                                  className="h-7 w-7 shrink-0 rounded-md border border-white/15"
                                  style={{ background: colors[zoneId] }}
                                />
                                <input
                                  type="color"
                                  value={colors[zoneId]}
                                  onFocus={() => setActiveZone(zoneId)}
                                  onChange={(event) => {
                                    setActiveZone(zoneId);
                                    setZone(zoneId, event.target.value);
                                  }}
                                  className="h-0 w-0 opacity-0"
                                  aria-label={`Color ${zoneLabel(zoneId)}`}
                                />
                              </label>
                            );
                          })}
                        </div>
                      </div>

                      <div className="grid gap-2">
                        <button
                          type="button"
                          onClick={() => copyText(skinCode, "code")}
                          className={`rounded-xl border px-3 py-2.5 text-[11px] font-black uppercase tracking-wider transition ${
                            copied === "code"
                              ? "border-green-500/50 text-green-400"
                              : "border-white/10 text-zinc-300 hover:border-red-500/40 hover:text-white"
                          }`}
                        >
                          {copied === "code" ? "Copiado" : "Copiar código"}
                        </button>
                        <button
                          type="button"
                          onClick={openJson}
                          className="rounded-xl border border-white/10 px-3 py-2.5 text-[11px] font-black uppercase tracking-wider text-zinc-300 transition hover:border-red-500/40 hover:text-white"
                        >
                          Abrir JSON
                        </button>
                        <SteamButton className="!w-full !rounded-xl !py-3 !shadow-none" label="Guardar skin" />
                        <SteamButton
                          className="!w-full !rounded-xl !bg-zinc-100 !py-3 !text-black !shadow-none hover:!bg-white"
                          label="+ Aplicar en vivo"
                        />
                      </div>
                    </>
                  )}

                  {studioTab === "skins" && (
                    <div className="flex min-h-[280px] flex-col items-center justify-center rounded-xl border border-dashed border-white/10 px-6 text-center">
                      <p className="text-sm font-bold text-zinc-300">Aún no hay skins guardadas</p>
                      <p className="mt-2 max-w-sm text-xs leading-relaxed text-zinc-500">
                        Cuando inicies sesión con Steam, tus skins aparecerán aquí para aplicarlas al dino.
                      </p>
                      <div className="mt-5">
                        <SteamButton label="Iniciar sesión con Steam" />
                      </div>
                    </div>
                  )}

                  {studioTab === "import" && (
                    <div className="space-y-3">
                      <p className="text-xs text-zinc-500">
                        Pega un JSON de skin para cargarlo en el estudio.
                      </p>
                      <textarea
                        value={jsonText || JSON.stringify(skinPayload, null, 2)}
                        onChange={(event) => setJsonText(event.target.value)}
                        rows={14}
                        className="w-full rounded-xl border border-white/10 bg-black/50 px-3 py-3 font-mono text-xs text-zinc-300 outline-none focus:border-red-500/50"
                      />
                      {jsonError && <p className="text-xs text-red-400">{jsonError}</p>}
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            copyText(jsonText || JSON.stringify(skinPayload, null, 2), "json")
                          }
                          className="rounded-xl border border-white/10 px-4 py-3 text-xs font-black uppercase text-zinc-300"
                        >
                          {copied === "json" ? "Copiado" : "Copiar JSON"}
                        </button>
                        <button
                          type="button"
                          onClick={loadJson}
                          className="rounded-xl border border-red-500/40 bg-red-600/15 px-4 py-3 text-xs font-black uppercase text-white"
                        >
                          Cargar JSON
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </aside>
            </div>
          </div>
        </div>
      )}

      {jsonOpen && studioTab !== "import" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0c0c0c] p-5">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-red-500">
                Skin JSON
              </p>
              <button
                type="button"
                onClick={() => setJsonOpen(false)}
                className="text-xs font-bold uppercase text-zinc-500 hover:text-white"
              >
                Cerrar
              </button>
            </div>
            <textarea
              value={jsonText}
              onChange={(event) => setJsonText(event.target.value)}
              rows={14}
              className="w-full rounded-xl border border-white/10 bg-black/50 px-3 py-3 font-mono text-xs text-zinc-300 outline-none focus:border-red-500/50"
            />
            {jsonError && <p className="mt-2 text-xs text-red-400">{jsonError}</p>}
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => copyText(jsonText, "json")}
                className="rounded-xl border border-white/10 px-4 py-3 text-xs font-black uppercase text-zinc-300"
              >
                {copied === "json" ? "Copiado" : "Copiar JSON"}
              </button>
              <button
                type="button"
                onClick={loadJson}
                className="rounded-xl border border-red-500/40 bg-red-600/15 px-4 py-3 text-xs font-black uppercase text-white"
              >
                Cargar JSON
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
