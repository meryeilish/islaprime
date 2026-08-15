import type { LiveDinoDemo, DinoVital } from "@/app/data/myDino";

export type ParsedPlayerDino = LiveDinoDemo & {
  steamId: string;
  raw: string;
};

function clamp(n: number, min = 0, max = 100) {
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.min(max, Math.round(n)));
}

function pickField(block: string, keys: string[]): string | null {
  for (const key of keys) {
    const re = new RegExp(`${key}\\s*[:=]\\s*([^,\\n\\r|;]+)`, "i");
    const m = block.match(re);
    if (m?.[1]) return m[1].trim().replace(/^["']|["']$/g, "");
  }
  return null;
}

function pickNumber(block: string, keys: string[], fallback = 0): number {
  const raw = pickField(block, keys);
  if (!raw) return fallback;
  const n = Number(raw.replace("%", "").replace(",", "."));
  return Number.isFinite(n) ? n : fallback;
}

function dietFromSpecies(species: string): string {
  const herb = /trike|stego|para|hypsi|dryo|teno|maia|pachy|diablo|beipi|gall|cera/i;
  const omni = /omni|troodon|ptera/i;
  if (herb.test(species)) return "Herbívoro";
  if (omni.test(species)) return "Omnívoro";
  return "Carnívoro";
}

function vitalsFromBlock(block: string): DinoVital[] {
  const health = clamp(pickNumber(block, ["Health", "HP", "Salud"], 100));
  const hunger = clamp(pickNumber(block, ["Hunger", "Hambre", "Food"], 100));
  const thirst = clamp(pickNumber(block, ["Thirst", "Sed", "Water"], 100));
  const stamina = clamp(pickNumber(block, ["Stamina", "Stam", "Resistencia"], 100));
  const bleed = clamp(pickNumber(block, ["Bleed", "Bleeding", "Sangrado"], 0));
  return [
    { id: "salud", label: "Salud", value: health, max: 100, tone: "red" },
    { id: "hambre", label: "Hambre", value: hunger, max: 100, tone: "amber" },
    { id: "sed", label: "Sed", value: thirst, max: 100, tone: "sky" },
    { id: "stamina", label: "Resistencia", value: stamina, max: 100, tone: "green" },
    { id: "sangrado", label: "Sangrado", value: bleed, max: 100, tone: "rose" },
  ];
}

/**
 * Divide getplayerdata en bloques por SteamID64 cuando es posible.
 */
export function splitPlayerDataBlocks(raw: string): Array<{ steamId: string; block: string }> {
  if (!raw.trim()) return [];

  const steamIds = [...raw.matchAll(/\b(7656119\d{10})\b/g)].map((m) => m[1]);
  if (steamIds.length === 0) {
    return [{ steamId: "unknown", block: raw }];
  }

  const unique = [...new Set(steamIds)];
  if (unique.length === 1) {
    return [{ steamId: unique[0], block: raw }];
  }

  const parts = raw.split(/(?=7656119\d{10})/g).filter(Boolean);
  return parts.map((part) => {
    const id = part.match(/\b(7656119\d{10})\b/)?.[1] ?? "unknown";
    return { steamId: id, block: part };
  });
}

export function parsePlayerDino(
  raw: string,
  steamId: string,
): ParsedPlayerDino | null {
  const blocks = splitPlayerDataBlocks(raw);
  const match =
    blocks.find((b) => b.steamId === steamId) ??
    (blocks.length === 1 && raw.includes(steamId) ? blocks[0] : null);

  if (!match) return null;

  const block = match.block;
  const species =
    pickField(block, ["Class", "Dinosaur", "Dino", "Species", "CharacterClass"]) ||
    "Desconocido";
  const sexRaw = pickField(block, ["Sex", "Gender"]) || "M";
  const sex: "M" | "F" = /^f/i.test(sexRaw) ? "F" : "M";
  let growth = pickNumber(block, ["Growth", "GrowthPercent", "Stage"], 0);
  if (growth > 0 && growth <= 1) growth = growth * 100;
  growth = clamp(growth);

  const location =
    pickField(block, ["Location", "Loc", "Position", "Coords"]) || "Gateway";
  const zone = pickField(block, ["Zone", "Migration", "Region"]) || "Gateway";
  const kills = Math.max(0, pickNumber(block, ["Kills", "PlayerKills"], 0));
  const deaths = Math.max(0, pickNumber(block, ["Deaths"], 0));
  const online = !/offline|dead|spectat/i.test(block);

  return {
    steamId,
    species,
    sex,
    diet: dietFromSpecies(species),
    growth,
    location,
    zone,
    aliveFor: pickField(block, ["Alive", "PlayTime", "TimeAlive"]) || "—",
    kills,
    deaths,
    online,
    lastSync: "ahora",
    vitals: vitalsFromBlock(block),
    raw: block,
  };
}

export function formatRconTemplate(
  template: string,
  vars: Record<string, string>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => vars[key] ?? "");
}
