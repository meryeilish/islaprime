export interface RankingEntry {
  rank: number;
  player: string;
  value: string;
  species?: string;
}

export const rankingTabs = [
  { id: "kills", label: "Más kills" },
  { id: "ratio", label: "Mejor ratio" },
  { id: "life", label: "Vida más larga" },
  { id: "ai", label: "Muertes por IA" },
] as const;

export type RankingTabId = (typeof rankingTabs)[number]["id"];

export const rankingsData: Record<RankingTabId, RankingEntry[]> = {
  kills: [
    { rank: 1, player: "RexDominus", value: "847", species: "Tyrannosaurus" },
    { rank: 2, player: "NightHunter", value: "612", species: "Allosaurus" },
    { rank: 3, player: "PrimeAlpha", value: "589", species: "Carnotaurus" },
    { rank: 4, player: "VolcanoKing", value: "501", species: "Giganotosaurus" },
    { rank: 5, player: "ShadowPack", value: "478", species: "Deinosuchus" },
  ],
  ratio: [
    { rank: 1, player: "SilentStalker", value: "12.4", species: "Utahraptor" },
    { rank: 2, player: "PrimeAlpha", value: "9.8", species: "Carnotaurus" },
    { rank: 3, player: "RexDominus", value: "8.2", species: "Tyrannosaurus" },
    { rank: 4, player: "ApexPredator", value: "7.6", species: "Allosaurus" },
    { rank: 5, player: "IslandGhost", value: "6.9", species: "Dilophosaurus" },
  ],
  life: [
    { rank: 1, player: "AncientOne", value: "142h 18m", species: "Triceratops" },
    { rank: 2, player: "OldGuard", value: "128h 04m", species: "Stegosaurus" },
    { rank: 3, player: "PrimeHerb", value: "96h 52m", species: "Diablochus" },
    { rank: 4, player: "RexDominus", value: "88h 30m", species: "Tyrannosaurus" },
    { rank: 5, player: "MarshKing", value: "81h 11m", species: "Deinosuchus" },
  ],
  ai: [
    { rank: 1, player: "UnluckySoul", value: "312", species: "Hypsilophodon" },
    { rank: 2, player: "FreshSpawn", value: "287", species: "Pachycephalosaurus" },
    { rank: 3, player: "SnackPack", value: "241", species: "Tenontosaurus" },
    { rank: 4, player: "NewbieDino", value: "198", species: "Gallimimus" },
    { rank: 5, player: "TrialError", value: "176", species: "Dryosaurus" },
  ],
};
