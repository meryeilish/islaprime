export interface SkinColors {
  marcaje: string;
  alto: string;
  medio: string;
  medio2: string;
  bajo: string;
  vientre: string;
  ojos: string;
  dientes: string;
  boca: string;
  garras: string;
}

export type SkinPattern =
  | "default"
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"
  | "G"
  | "H";

/** Zonas principales del estudio (orden de la máscara del juego). */
export const ZONE_DEFS: { id: keyof SkinColors; label: string }[] = [
  { id: "marcaje", label: "Marcaje" },
  { id: "medio", label: "Cuerpo" },
  { id: "alto", label: "Dorso" },
  { id: "bajo", label: "Flanco" },
  { id: "vientre", label: "Vientre" },
  { id: "medio2", label: "Detalle" },
  { id: "ojos", label: "Ojos" },
];

/** Zonas que se muestran como filas principales del panel Estudio. */
export const PRIMARY_ZONES: (keyof SkinColors)[] = [
  "marcaje",
  "medio",
  "alto",
  "bajo",
  "vientre",
  "medio2",
  "ojos",
];
