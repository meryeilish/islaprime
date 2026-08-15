/** Parseo de respuestas RCON de Evrima. */

export interface ParsedServerDetails {
  name: string;
  map: string;
  maxPlayers: number;
  currentPlayers: number;
  mutations: boolean;
  humans: boolean;
  password: boolean;
  queue: boolean;
  whitelist: boolean;
  spawnAi: boolean;
  raw: string;
}

export interface ServerStatusPayload {
  ok: boolean;
  online: boolean;
  checkedAt: string;
  error?: string;
  hint?: string;
  server?: ParsedServerDetails;
  players: {
    count: number;
    list: string[];
    raw: string;
  };
  queue: string | null;
  playerDataRaw: string | null;
}

function pick(raw: string, key: string): string | null {
  // Formatos vistos: "ServerMap: Gateway," o "ServerName: foo, ServerPassword:"
  const re = new RegExp(`${key}\\s*:\\s*([^,]*)`, "i");
  const match = raw.match(re);
  if (!match) return null;
  return match[1].trim();
}

function pickBool(raw: string, key: string): boolean {
  const value = pick(raw, key);
  if (!value) return false;
  return /^(true|1|yes)$/i.test(value);
}

function pickInt(raw: string, key: string, fallback: number): number {
  const value = pick(raw, key);
  if (!value) return fallback;
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export function parseServerDetails(raw: string): ParsedServerDetails {
  const cleaned = raw.replace(/^\[.*?\]\s*/g, "").replace(/^ServerDetails/i, "");
  return {
    name: pick(cleaned, "ServerName") || "Isla Prime",
    map: pick(cleaned, "ServerMap") || "Gateway",
    maxPlayers: pickInt(cleaned, "ServerMaxPlayers", 50),
    currentPlayers: pickInt(cleaned, "ServerCurrentPlayers", 0),
    mutations: pickBool(cleaned, "bEnableMutations"),
    humans: pickBool(cleaned, "bEnableHumans"),
    password: pickBool(cleaned, "bServerPassword"),
    queue: pickBool(cleaned, "bQueueEnabled"),
    whitelist: pickBool(cleaned, "bServerWhitelist"),
    spawnAi: pickBool(cleaned, "bSpawnAI"),
    raw,
  };
}

export function parsePlayerList(raw: string): string[] {
  return raw
    .split(/\r?\n|,/)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !/^playerlist$/i.test(line))
    .filter((line) => !/^\[/.test(line));
}

/** Extrae GROWTH X3 del nombre del server si viene ahí. */
export function growthFromServerName(name: string): string {
  const match = name.match(/growth\s*x?\s*(\d+)/i);
  return match ? `${match[1]}x` : "—";
}
