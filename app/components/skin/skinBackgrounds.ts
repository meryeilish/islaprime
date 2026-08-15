export type SkinBackgroundId =
  | "galaxy"
  | "starry"
  | "lakeside"
  | "nebula"
  | "aurora"
  | "sunset"
  | "dawn"
  | "night"
  | "forest"
  | "void"
  | "grid"
  | "jungle"
  | "lagoon"
  | "ember"
  | "mist";

export type SkyKind =
  | "galaxy"
  | "nebula"
  | "aurora"
  | "sunset"
  | "dawn"
  | "night"
  | "forest";

export interface SkinBackgroundOption {
  id: SkinBackgroundId;
  label: string;
  short: string;
  group: "espectacular" | "realista" | "estudio";
}

export const SKIN_BACKGROUNDS: SkinBackgroundOption[] = [
  { id: "galaxy", label: "Galaxia", short: "Galaxia", group: "espectacular" },
  { id: "nebula", label: "Nebulosa", short: "Nebulosa", group: "espectacular" },
  { id: "aurora", label: "Aurora", short: "Aurora", group: "espectacular" },
  { id: "starry", label: "Noche estelar", short: "Estelar", group: "realista" },
  { id: "lakeside", label: "Lago estrellado", short: "Lago", group: "realista" },
  { id: "sunset", label: "Atardecer Venecia", short: "Atardecer", group: "realista" },
  { id: "dawn", label: "Amanecer", short: "Amanecer", group: "realista" },
  { id: "night", label: "Noche desierto", short: "Noche", group: "realista" },
  { id: "forest", label: "Bosque", short: "Bosque", group: "realista" },
  { id: "grid", label: "Isla Prime", short: "Prime", group: "estudio" },
  { id: "jungle", label: "Selva", short: "Selva", group: "estudio" },
  { id: "lagoon", label: "Laguna", short: "Laguna", group: "estudio" },
  { id: "ember", label: "Brasas", short: "Brasas", group: "estudio" },
  { id: "mist", label: "Niebla", short: "Niebla", group: "estudio" },
  { id: "void", label: "Vacío", short: "Vacío", group: "estudio" },
];

export interface BackgroundTheme {
  clear: string;
  fog: string | null;
  fogNear: number;
  fogFar: number;
  ambient: number;
  key: number;
  fill: number;
  grid?: { major: string; minor: string };
  ground?: string;
  hemiSky?: string;
  hemiGround?: string;
  stars?: boolean;
  starCount?: number;
  nebula?: "violet" | "crimson" | "aurora";
  sky?: SkyKind;
  hdrFile?: string;
  hdrIntensity?: number;
  roomEnv?: boolean;
}

export const BACKGROUND_THEMES: Record<SkinBackgroundId, BackgroundTheme> = {
  galaxy: {
    clear: "#010008",
    fog: null,
    fogNear: 30,
    fogFar: 80,
    ambient: 0.28,
    key: 0.55,
    fill: 0.22,
    stars: true,
    starCount: 7000,
    nebula: "violet",
    sky: "galaxy",
    roomEnv: true,
    hemiSky: "#7a6bff",
    hemiGround: "#080414",
  },
  nebula: {
    clear: "#0a0412",
    fog: "#12061c",
    fogNear: 12,
    fogFar: 32,
    ambient: 0.38,
    key: 0.7,
    fill: 0.3,
    stars: true,
    starCount: 4000,
    nebula: "crimson",
    sky: "nebula",
    roomEnv: true,
    hemiSky: "#ff6ab0",
    hemiGround: "#1a0820",
  },
  aurora: {
    clear: "#02080f",
    fog: "#041018",
    fogNear: 10,
    fogFar: 28,
    ambient: 0.42,
    key: 0.55,
    fill: 0.35,
    stars: true,
    starCount: 3200,
    nebula: "aurora",
    sky: "aurora",
    roomEnv: true,
    ground: "#061018",
    hemiSky: "#5dffc4",
    hemiGround: "#061420",
  },
  starry: {
    clear: "#02010a",
    fog: null,
    fogNear: 16,
    fogFar: 40,
    ambient: 0.22,
    key: 0.35,
    fill: 0.15,
    sky: "night",
    hdrFile: "/env/solitude_night_1k.hdr",
    hdrIntensity: 0.95,
    roomEnv: false,
    hemiSky: "#6a7dff",
    hemiGround: "#12081f",
  },
  lakeside: {
    clear: "#02060c",
    fog: null,
    fogNear: 16,
    fogFar: 40,
    ambient: 0.24,
    key: 0.35,
    fill: 0.15,
    sky: "night",
    hdrFile: "/env/lakeside_night_1k.hdr",
    hdrIntensity: 0.9,
    roomEnv: false,
    hemiSky: "#6a8cff",
    hemiGround: "#061018",
  },
  sunset: {
    clear: "#1a0e0c",
    fog: null,
    fogNear: 12,
    fogFar: 36,
    ambient: 0.28,
    key: 0.4,
    fill: 0.18,
    sky: "sunset",
    hdrFile: "/env/venice_sunset_1k.hdr",
    hdrIntensity: 0.9,
    roomEnv: false,
    hemiSky: "#ffb07a",
    hemiGround: "#2a140e",
  },
  dawn: {
    clear: "#101820",
    fog: null,
    fogNear: 12,
    fogFar: 36,
    ambient: 0.3,
    key: 0.4,
    fill: 0.2,
    sky: "dawn",
    hdrFile: "/env/kiara_1_dawn_1k.hdr",
    hdrIntensity: 0.9,
    roomEnv: false,
    hemiSky: "#ffd0a8",
    hemiGround: "#1a2430",
  },
  night: {
    clear: "#05070c",
    fog: null,
    fogNear: 12,
    fogFar: 36,
    ambient: 0.2,
    key: 0.3,
    fill: 0.12,
    sky: "night",
    hdrFile: "/env/dikhololo_night_1k.hdr",
    hdrIntensity: 0.85,
    roomEnv: false,
    hemiSky: "#6a8cff",
    hemiGround: "#0a1018",
  },
  forest: {
    clear: "#0a120c",
    fog: null,
    fogNear: 10,
    fogFar: 30,
    ambient: 0.3,
    key: 0.35,
    fill: 0.18,
    sky: "forest",
    hdrFile: "/env/forest_slope_1k.hdr",
    hdrIntensity: 0.9,
    roomEnv: false,
    hemiSky: "#8cbc7a",
    hemiGround: "#1a2418",
  },
  void: {
    clear: "#050505",
    fog: "#050505",
    fogNear: 10,
    fogFar: 28,
    ambient: 0.55,
    key: 0.85,
    fill: 0.3,
    roomEnv: true,
  },
  grid: {
    clear: "#0a1528",
    fog: "#0d1e38",
    fogNear: 5,
    fogFar: 20,
    ambient: 0.4,
    key: 0.9,
    fill: 0.45,
    grid: { major: "#b91c1c", minor: "#122030" },
    ground: "#081220",
    hemiSky: "#4a72a8",
    hemiGround: "#0c1018",
    roomEnv: true,
  },
  jungle: {
    clear: "#07140c",
    fog: "#0b1c12",
    fogNear: 5,
    fogFar: 16,
    ambient: 0.42,
    key: 0.7,
    fill: 0.35,
    ground: "#102016",
    hemiSky: "#6fa86a",
    hemiGround: "#1a2a18",
    roomEnv: true,
  },
  lagoon: {
    clear: "#061820",
    fog: "#0a2430",
    fogNear: 6,
    fogFar: 18,
    ambient: 0.48,
    key: 0.8,
    fill: 0.45,
    ground: "#0d2a35",
    hemiSky: "#7fd0e8",
    hemiGround: "#123038",
    roomEnv: true,
  },
  ember: {
    clear: "#120805",
    fog: "#1a0c08",
    fogNear: 5,
    fogFar: 15,
    ambient: 0.4,
    key: 1.05,
    fill: 0.25,
    ground: "#24110a",
    hemiSky: "#ff8a4c",
    hemiGround: "#2a1208",
    roomEnv: true,
  },
  mist: {
    clear: "#12141a",
    fog: "#1a1d26",
    fogNear: 3.5,
    fogFar: 12,
    ambient: 0.65,
    key: 0.55,
    fill: 0.45,
    ground: "#1c2028",
    hemiSky: "#c8d0dc",
    hemiGround: "#2a303a",
    roomEnv: true,
  },
};
