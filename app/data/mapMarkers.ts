import { foodMarkers } from "./generated/food";
export type MarkerType =
  | "agua"
  | "comida"
  | "migraciones"
  | "pvp"
  | "herbivoros"
  | "carnivoros";

export interface MapMarker {
  id: string;
  type: MarkerType;
  name: string;
  description?: string;
  x: number;
  y: number;
}

export const mapMarkers: MapMarker[] = [
  ...foodMarkers,
];