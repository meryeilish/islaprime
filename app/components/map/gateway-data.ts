/**
 * Puntos de interés de Gateway v0.21.7 (The Isle Evrima).
 * Coordenadas en kilómetros del juego (Lat = X, Long = Y), convertidas
 * al espacio de píxeles del mapa con gameKmToMapPixel.
 * Fuente de datos: VulnonaMAP (vulnona.com/game/map).
 */
import { ellipsePoints, gameKmToMapPixel } from "./migration-zones";

export type LatLng = [number, number];

/** Convierte coordenadas del juego a [lat, lng] de Leaflet (CRS.Simple). */
export function gameToLatLng(x: number, y: number): LatLng {
  const [lng, lat] = gameKmToMapPixel(x, y);
  return [lat, lng];
}

export interface MapLabel {
  label: string;
  latLng: LatLng;
  size: "large" | "normal" | "small";
  ocean?: boolean;
}

export interface MapPoint {
  label: string;
  latLng: LatLng;
}

export interface MapZone {
  label: string;
  latLngs: LatLng[];
}

type LabelSource = [x: number, y: number, label: string, size?: "large" | "small", ocean?: boolean];

const areaSources: LabelSource[] = [
  [33, 177, "Delta", "large"],
  [211, 338, "Delta Bay", undefined, true],
  [-110, 552, "East Coast"],
  [-157, 398, "Eastern Jungle", "large"],
  [-119, 246, "Forks Plains", "small"],
  [-127, -80, "Highland", "large"],
  [-49, 71, "Central Jungle", "large"],
  [334, -91, "Lagoon"],
  [-460, 433, "NE. Cape"],
  [-410, 14, "North Bay", undefined, true],
  [-345, 353, "North Plains", "large"],
  [-321, 166, "Northern Jungle", "large"],
  [-257, -156, "Ridges"],
  [-308, 548, "Port (Ocean-port)", "large"],
  [6, -388, "Rail Beach", "small"],
  [74, 399, "Sandbank Bay", "small", true],
  [256, -308, "South Plains", "large"],
  [397, 130, "Southern Beach", "small"],
  [238, -211, "Southern Strait", "small"],
  [273, 74, "Swamps", "large"],
  [329, -394, "The Pit", "large"],
  [-36, 455, "Tide Pool", "small"],
  [-4, -238, "West Rail", "large"],
  [-214, 87, "Water Access", "large"],
];

const waterSources: LabelSource[] = [
  [-175, 152, "Cascades"],
  [50, 330, "Coastal Pond", "small"],
  [-267, 79, "Dam Lake"],
  [43, 189, "Delta"],
  [-84, 254, "Delta River"],
  [-137, 460, "East Lake", "large"],
  [-179, 238, "Forks Pond", "small"],
  [135, -198, "Gorge River"],
  [-135, -22, "Highland Lake (norte)"],
  [-92, -65, "Highland Lake (sur)"],
  [-171, 344, "Hollow Falls"],
  [-2, 82, "Jungle Pond"],
  [-80, -226, "Landslid Lake"],
  [-374, 324, "North Lake"],
  [281, -332, "Pit Pond"],
  [-290, 368, "Plains River"],
  [82, -244, "Pygmy's Puddle", "small"],
  [319, -252, "Rock Pond"],
  [199, 179, "Endorheic", "small"],
  [200, -352, "South Puddle", "small"],
  [254, 106, "Swamp East"],
  [276, -30, "Swamp West"],
  [-273, 168, "Verdant Pond"],
  [-258, 285, "Volcano Cave", "small"],
  [-283, 256, "Volcano Chamber", "small"],
  [20, -277, "West Pond"],
  [90, -128, "Shade Puddle", "small"],
];

const landmarkSources: LabelSource[] = [
  [104, -43, "Central Dome (Hexagon)"],
  [-286, 72, "Dam"],
  [141, 240, "Estuary Weir"],
  [-199, 10, "Highland Bridge"],
  [-221, 360, "Log Bridge"],
  [-45, 213, "Mad Grotto"],
  [191, 47, "Pipes"],
  [313, -431, "Pit's Antenna"],
  [-236, 526, "Port Tunnel"],
  [-221, 543, "Radio Tower"],
  [270, 215, "Shallows Beach"],
  [136, 123, "Swamp Tunnel"],
  [-268, 250, "Volcán extinto"],
];

const siteSources: LabelSource[] = [
  [-430, 201, "Site C14 (Derelict Base)"],
  [-307, 93, "Site E12"],
  [-325, 252, "Site E15 (Volc. norte)"],
  [-239, 37, "Site F11 (Lake-port)"],
  [-260, 331, "Site F16 (Volc. este)"],
  [-263, 501, "Site F19 (Port)"],
  [-222, 269, "Site G15 (Volc. sur)"],
  [-204, 538, "Site G20 (Radio Base)"],
  [-200, 483, "Storage G19"],
  [-109, 81, "Site I12 (RS)"],
  [-107, 487, "Site I21"],
  [-23, 363, "Site J17"],
  [27, 252, "Site K15 (Delta)"],
  [87, 30, "Site L11 (entrada al Dome)"],
  [293, -374, "Site P04 (The Pit)"],
];

function toLabels(sources: LabelSource[]): MapLabel[] {
  return sources.map(([x, y, label, size, ocean]) => ({
    label,
    latLng: gameToLatLng(x, y),
    size: size ?? "normal",
    ocean,
  }));
}

function toPoints(sources: LabelSource[]): MapPoint[] {
  return sources.map(([x, y, label]) => ({
    label,
    latLng: gameToLatLng(x, y),
  }));
}

export const areaLabels: MapLabel[] = toLabels(areaSources);
export const waterPoints: MapLabel[] = toLabels(waterSources);
export const landmarkPoints: MapPoint[] = toPoints(landmarkSources);
export const humanSites: MapPoint[] = toPoints(siteSources);

/* ------------------------------------------------------------------ */
/* Zonas (polígonos y elipses expresadas en km del juego)              */
/* ------------------------------------------------------------------ */

type ZoneShape =
  | { kind: "poly"; km: [number, number][] }
  | { kind: "circle"; center: [number, number]; rx: number; ry?: number; rot?: number };

interface ZoneSource {
  label: string;
  shapes: ZoneShape[];
}

function shapeToLatLngs(shape: ZoneShape): LatLng[] {
  const km =
    shape.kind === "circle"
      ? ellipsePoints(shape.center, shape.rx, shape.ry ?? shape.rx, shape.rot ?? 0)
      : shape.km;

  return km.map(([x, y]) => gameToLatLng(x, y));
}

function toZones(sources: ZoneSource[]): MapZone[] {
  return sources.flatMap((zone) =>
    zone.shapes.map((shape) => ({
      label: zone.label,
      latLngs: shapeToLatLngs(shape),
    })),
  );
}

const sanctuarySources: ZoneSource[] = [
  { label: "Santuario · Delta", shapes: [{ kind: "circle", center: [-18, 228], rx: 11 }] },
  { label: "Santuario · East Lake", shapes: [{ kind: "circle", center: [-173, 436], rx: 8, ry: 11, rot: -9 }] },
  {
    label: "Santuario · Highland",
    shapes: [
      { kind: "circle", center: [-67, -164], rx: 15, ry: 6, rot: -10 },
      { kind: "circle", center: [-45, -172], rx: 10, ry: 6, rot: -20 },
    ],
  },
  { label: "Santuario · Mudflats", shapes: [{ kind: "circle", center: [171, -329], rx: 10, ry: 8 }] },
  { label: "Santuario · South Plains", shapes: [{ kind: "circle", center: [229, -176], rx: 7, ry: 10, rot: -20 }] },
  { label: "Santuario · Swamp", shapes: [{ kind: "circle", center: [282, 28], rx: 10, ry: 8, rot: 16 }] },
  { label: "Santuario · Verdant Forest", shapes: [{ kind: "circle", center: [-241, 171], rx: 8 }] },
];

const patrolSources: ZoneSource[] = [
  {
    label: "Patrulla · Central Jungle",
    shapes: [{ kind: "poly", km: [[-104, 46], [-104, 69], [-54, 69], [-54, 47]] }],
  },
  {
    label: "Patrulla · Delta",
    shapes: [
      { kind: "circle", center: [-44, 174], rx: 14, ry: 25, rot: 46 },
      { kind: "circle", center: [79, 206], rx: 15 },
      { kind: "poly", km: [[-5, 163], [-6, 185], [32, 188], [33, 166]] },
      { kind: "poly", km: [[21, 186], [7, 196], [42, 251], [56, 242]] },
      { kind: "poly", km: [[-21, 121], [-22, 140], [30, 143], [31, 124]] },
    ],
  },
  {
    label: "Patrulla · Delta River",
    shapes: [{ kind: "poly", km: [[-128, 301], [-110, 318], [-86, 290], [-104, 273]] }],
  },
  {
    label: "Patrulla · East Coast",
    shapes: [
      { kind: "circle", center: [-162, 540], rx: 28 },
      { kind: "circle", center: [-90, 503], rx: 25, ry: 28 },
    ],
  },
  {
    label: "Patrulla · Forks Plains",
    shapes: [
      { kind: "poly", km: [[-201, 256], [-201, 298], [-161, 298], [-161, 256]] },
      { kind: "poly", km: [[-119, 191], [-119, 222], [-70, 223], [-66, 214], [-64, 193]] },
    ],
  },
  {
    label: "Patrulla · Highland",
    shapes: [
      { kind: "circle", center: [-163, -7], rx: 15 },
      { kind: "poly", km: [[-182, -53], [-162, -36], [-149, -51], [-170, -69]] },
      { kind: "circle", center: [-143, -112], rx: 13 },
      { kind: "circle", center: [-52, -132], rx: 13 },
    ],
  },
  { label: "Patrulla · Mudflats", shapes: [{ kind: "circle", center: [146, -295], rx: 15 }] },
  {
    label: "Patrulla · NE Cape",
    shapes: [
      { kind: "poly", km: [[-515, 436], [-508, 463], [-414, 438], [-424, 410]] },
      { kind: "circle", center: [-475, 418], rx: 20 },
      { kind: "circle", center: [-432, 457], rx: 22 },
    ],
  },
  {
    label: "Patrulla · North Plains",
    shapes: [
      { kind: "circle", center: [-458, 291], rx: 12 },
      { kind: "circle", center: [-344, 344], rx: 12 },
      { kind: "circle", center: [-314, 363], rx: 12 },
      { kind: "poly", km: [[-430, 237], [-430, 279], [-398, 280], [-394, 274], [-394, 237]] },
    ],
  },
  {
    label: "Patrulla · Northern Jungle",
    shapes: [
      { kind: "poly", km: [[-349, 106], [-349, 147], [-311, 147], [-311, 106]] },
      { kind: "poly", km: [[-304, 108], [-304, 149], [-264, 149], [-264, 108]] },
    ],
  },
  {
    label: "Patrulla · The Pit",
    shapes: [
      { kind: "circle", center: [182, -367], rx: 20 },
      { kind: "circle", center: [213, -348], rx: 16 },
      { kind: "circle", center: [235, -316], rx: 16 },
      { kind: "circle", center: [254, -261], rx: 21 },
      { kind: "circle", center: [288, -279], rx: 16 },
      { kind: "circle", center: [284, -225], rx: 21 },
      { kind: "circle", center: [349, -250], rx: 16 },
      { kind: "circle", center: [406, -239], rx: 23 },
      { kind: "circle", center: [348, -289], rx: 18, ry: 14 },
      { kind: "circle", center: [372, -365], rx: 23 },
      { kind: "circle", center: [320, -443], rx: 23 },
    ],
  },
  { label: "Patrulla · Port Hill", shapes: [{ kind: "circle", center: [-304, 440], rx: 11 }] },
  { label: "Patrulla · Radio Tower", shapes: [{ kind: "circle", center: [-207, 530], rx: 16 }] },
  {
    label: "Patrulla · Sandbank Bay",
    shapes: [
      { kind: "poly", km: [[-18, 378], [-2, 434], [15, 430], [0, 374]] },
      { kind: "poly", km: [[-20, 332], [-23, 351], [36, 360], [39, 341]] },
      { kind: "poly", km: [[30, 337], [42, 354], [95, 319], [82, 302]] },
    ],
  },
  {
    label: "Patrulla · South Plains",
    shapes: [
      { kind: "circle", center: [153, -252], rx: 20 },
      { kind: "circle", center: [267, -195], rx: 21 },
    ],
  },
  {
    label: "Patrulla · Southern Beach",
    shapes: [
      { kind: "circle", center: [310, -95], rx: 23 },
      { kind: "poly", km: [[334, 3], [369, 40], [392, 16], [357, -21]] },
      { kind: "poly", km: [[345, -63], [403, 12], [429, -10], [369, -84]] },
    ],
  },
  {
    label: "Patrulla · Swamps",
    shapes: [
      { kind: "poly", km: [[189, 125], [189, 161], [241, 161], [241, 124]] },
      { kind: "poly", km: [[208, 40], [208, 74], [261, 74], [261, 40]] },
      { kind: "poly", km: [[291, -41], [291, 11], [326, 11], [326, -41]] },
      { kind: "circle", center: [247, 6], rx: 25 },
      { kind: "circle", center: [304, 10], rx: 21 },
      { kind: "circle", center: [322, 54], rx: 16 },
      { kind: "circle", center: [293, 114], rx: 29 },
    ],
  },
  {
    label: "Patrulla · West Rail",
    shapes: [
      { kind: "circle", center: [25, -323], rx: 20 },
      { kind: "circle", center: [-12, -287], rx: 20 },
      { kind: "circle", center: [26, -248], rx: 16 },
      { kind: "circle", center: [6, -226], rx: 17 },
      { kind: "poly", km: [[-65, -385], [-65, -345], [15, -345], [15, -385]] },
    ],
  },
];

export const sanctuaryZones: MapZone[] = toZones(sanctuarySources);
export const patrolZones: MapZone[] = toZones(patrolSources);

/** Cantidad de grupos de patrulla (para mostrar en la UI). */
export const patrolGroupCount = patrolSources.length;
export const sanctuaryGroupCount = sanctuarySources.length;
