export type UtilChannel = "r" | "g" | "b" | null;

export interface SkinUtilInfo {
  /** Archivo de máscara de dientes/boca/garras dentro de la carpeta de la especie */
  file: string;
  teeth: UtilChannel;
  mouth: UtilChannel;
  claws: UtilChannel;
}

export interface SkinModelInfo {
  /** Carpeta dentro de /public/models/skins */
  folder: string;
  /** Variantes de patrón disponibles (archivos male_X.glb / female_X.glb) */
  variants: string[];
  /** Número de máscaras de regiones (pattern_0..N-1.webp) */
  maskCount: number;
  /** Máscara de utilidades para dientes/boca/garras (si existe) */
  util: SkinUtilInfo | null;
}

/** Modelos GLB propios, indexados por id de especie del Skin Creator. */
export const SKIN_MODELS: Record<string, SkinModelInfo> = {
  allo: {
    folder: "allo",
    variants: ["a", "b", "c"],
    maskCount: 3,
    util: null,
  },
  aust: {
    folder: "austro",
    variants: ["a", "b", "c", "d"],
    maskCount: 4,
    util: null,
  },
  beip: {
    folder: "beipi",
    variants: ["a", "b", "c"],
    maskCount: 3,
    util: null,
  },
  carno: {
    folder: "carno",
    variants: ["a", "b", "c", "e"],
    maskCount: 4,
    util: { file: "tmc_mask.webp", teeth: "b", mouth: "r", claws: "g" },
  },
  cerato: {
    folder: "cera",
    variants: ["a", "b", "c"],
    maskCount: 3,
    util: { file: "tmc_mask.webp", teeth: "g", mouth: "r", claws: "b" },
  },
  deino: {
    folder: "deino",
    variants: ["a", "b", "c"],
    maskCount: 3,
    util: { file: "tmc_mask.webp", teeth: "r", mouth: "g", claws: null },
  },
  diablo: {
    folder: "diablo",
    variants: ["a", "b", "c"],
    maskCount: 3,
    util: { file: "tmc_mask.webp", teeth: null, mouth: "g", claws: "b" },
  },
  dilo: {
    folder: "dilo",
    variants: ["a", "b", "c"],
    maskCount: 3,
    util: null,
  },
  dryo: {
    folder: "dryo",
    variants: ["a", "b", "c", "d"],
    maskCount: 3,
    util: { file: "tmc_mask.webp", teeth: null, mouth: "g", claws: "b" },
  },
  galli: {
    folder: "galli",
    variants: ["a", "b", "c"],
    maskCount: 3,
    util: { file: "tmc_mask.webp", teeth: null, mouth: "g", claws: "b" },
  },
  herra: {
    folder: "herrera",
    variants: ["a", "b", "c", "d"],
    maskCount: 5,
    util: null,
  },
  hypsi: {
    folder: "hypsi",
    variants: ["a"],
    maskCount: 3,
    util: null,
  },
  kentro: {
    folder: "kentro",
    variants: ["a", "b", "c"],
    maskCount: 3,
    util: { file: "tmc_mask.webp", teeth: null, mouth: "g", claws: "b" },
  },
  maia: {
    folder: "maia",
    variants: ["a", "b", "c"],
    maskCount: 3,
    util: { file: "tmc_mask.webp", teeth: null, mouth: "g", claws: "b" },
  },
  omni: {
    folder: "omniraptor",
    variants: ["a", "b", "c", "d", "e", "f"],
    maskCount: 6,
    util: { file: "tmc_mask.webp", teeth: "r", mouth: "g", claws: "b" },
  },
  pachy: {
    folder: "pachy",
    variants: ["a", "b", "c", "d", "e", "f", "g", "h"],
    maskCount: 5,
    util: { file: "tmc_mask.webp", teeth: null, mouth: "g", claws: "b" },
  },
  ptera: {
    folder: "ptera",
    variants: ["a"],
    maskCount: 3,
    util: { file: "tmc_mask.webp", teeth: null, mouth: "g", claws: "b" },
  },
  rex: {
    folder: "rex",
    variants: ["a", "b", "c"],
    maskCount: 5,
    util: { file: "tmc_mask.webp", teeth: "r", mouth: "g", claws: "b" },
  },
  stego: {
    folder: "stego",
    variants: ["a"],
    maskCount: 4,
    util: null,
  },
  teno: {
    folder: "teno",
    variants: ["a", "b", "c", "d"],
    maskCount: 3,
    util: { file: "tmc_mask.webp", teeth: null, mouth: "g", claws: "b" },
  },
  trike: {
    folder: "trice",
    variants: ["a", "b", "c"],
    maskCount: 6,
    util: { file: "tmc_mask.webp", teeth: null, mouth: "g", claws: "b" },
  },
  troodon: {
    folder: "troodon",
    variants: ["a", "b", "c"],
    maskCount: 3,
    util: { file: "tmc_mask.webp", teeth: "r", mouth: "g", claws: "b" },
  },
};

export function hasSkinModel(speciesId: string): boolean {
  return speciesId in SKIN_MODELS;
}

export function skinVariants(speciesId: string): string[] {
  return SKIN_MODELS[speciesId]?.variants ?? ["a"];
}

export interface SkinAssets {
  modelUrl: string;
  maskUrl: string;
  utilUrl: string | null;
  util: SkinUtilInfo | null;
}

/**
 * Devuelve las URLs del GLB y de las máscaras para la selección actual,
 * o null si la especie no tiene modelos. Si el patrón elegido no existe
 * para la especie, cae a la primera variante disponible.
 *
 * Importante: la geometría es idéntica entre patrones (solo cambia la
 * textura/máscara). Cargamos un único GLB por sexo para no redescargar
 * ~44 MB cada vez que se cambia A/B/C.
 */
export function skinAssets(
  speciesId: string,
  sex: "M" | "F",
  pattern: string,
): SkinAssets | null {
  const info = SKIN_MODELS[speciesId];
  if (!info) return null;

  const wanted = pattern.toLowerCase();
  const index = info.variants.indexOf(wanted);
  const variantIndex = index >= 0 ? index : 0;
  const meshVariant = info.variants[0];
  const prefix = sex === "M" ? "male" : "female";
  const maskIndex = Math.min(variantIndex, info.maskCount - 1);
  const dir = `/models/skins/${info.folder}`;

  return {
    modelUrl: `${dir}/${prefix}_${meshVariant}.glb`,
    maskUrl: `${dir}/pattern_${maskIndex}.webp`,
    utilUrl: info.util ? `${dir}/${info.util.file}` : null,
    util: info.util,
  };
}
