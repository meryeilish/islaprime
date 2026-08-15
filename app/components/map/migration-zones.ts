export type MigrationZoneSource =
  | {
      id: string;
      label: string;
      mmz: boolean;
      type: "path" | "line";
      km: [number, number][];
    }
  | {
      id: string;
      label: string;
      mmz: boolean;
      type: "circle";
      center: [number, number];
      rx: number;
      ry: number;
      rot: number;
    };

export type MigrationZone = {
  id: string;
  label: string;
  mmz: boolean;
  type: "path" | "line" | "circle";
  color: string;
  points: [number, number][];
};

export const GATEWAY_MAP_SIZE = 10192;

const GAME_BOUNDS = {
  minX: -607,
  maxX: 509,
  minY: -505,
  maxY: 607,
  scale: 2.5,
} as const;

export const migrationZoneSources: MigrationZoneSource[] = [
  {
    id: "mz-delta",
    label: "Delta (MMZ)",
    mmz: true,
    type: "path",
    km: [
      [-77, 185], [-97, 220], [-108, 256], [-101, 264], [-93, 265],
      [-85, 261], [-63, 227], [-32, 192], [-17, 190], [6, 203],
      [42, 250], [58, 259], [75, 255], [116, 255], [126, 244],
      [133, 230], [129, 216], [99, 213], [89, 200], [83, 175],
      [68, 149], [50, 134], [6, 121], [-24, 120], [-77, 185],
    ],
  },
  {
    id: "mz-east-jungle",
    label: "East Jungle",
    mmz: false,
    type: "line",
    km: [
      [-97, 252], [-97, 326], [69, 326], [69, 252], [-97, 252],
    ],
  },
  {
    id: "mz-highland",
    label: "Highland",
    mmz: false,
    type: "line",
    km: [
      [-162, -19], [-107, 27], [-7, -120], [-61, -162], [-162, -19],
    ],
  },
  {
    id: "mz-mudflats",
    label: "Mudflats",
    mmz: false,
    type: "circle",
    center: [155, -291],
    rx: 67,
    ry: 70,
    rot: 5,
  },
  {
    id: "mz-north-lake",
    label: "North Lake (MMZ)",
    mmz: true,
    type: "circle",
    center: [-358, 354],
    rx: 89,
    ry: 85,
    rot: -35,
  },
  {
    id: "mz-north-jungle",
    label: "Northern Jungle",
    mmz: false,
    type: "circle",
    center: [-336, 180],
    rx: 50,
    ry: 65,
    rot: 13,
  },
  {
    id: "mz-south-plains",
    label: "South Plains (MMZ)",
    mmz: true,
    type: "circle",
    center: [271, -283],
    rx: 110,
    ry: 44,
    rot: 46,
  },
  {
    id: "mz-swamp",
    label: "Swamp",
    mmz: false,
    type: "line",
    km: [
      [227, -30], [227, 140], [361, 140], [361, -30], [227, -30],
    ],
  },
  {
    id: "mz-tide-beach",
    label: "Tide Beach",
    mmz: false,
    type: "circle",
    center: [-40, 450],
    rx: 60,
    ry: 60,
    rot: 0,
  },
  {
    id: "mz-west-rail-access",
    label: "West Rail Access",
    mmz: false,
    type: "circle",
    center: [27, -231],
    rx: 86,
    ry: 78,
    rot: 19,
  },
];

export function ellipsePoints(
  center: [number, number],
  rx: number,
  ry: number,
  rotationDegrees: number,
  segments = 64,
): [number, number][] {
  const points: [number, number][] = [];
  const rotation = (rotationDegrees * Math.PI) / 180;
  const cosRotation = Math.cos(rotation);
  const sinRotation = Math.sin(rotation);

  for (let index = 0; index <= segments; index += 1) {
    const angle = (index / segments) * Math.PI * 2;
    const localX = Math.cos(angle) * rx;
    const localY = Math.sin(angle) * ry;

    points.push([
      center[0] + localX * cosRotation - localY * sinRotation,
      center[1] + localX * sinRotation + localY * cosRotation,
    ]);
  }

  return points;
}

/**
 * Convierte coordenadas del juego expresadas en kilómetros a píxeles
 * dentro del mapa Gateway de 10192 × 10192.
 */
export function gameKmToMapPixel(
  gameXKm: number,
  gameYKm: number,
): [number, number] {
  const worldWidth =
    (GAME_BOUNDS.maxX - GAME_BOUNDS.minX) * GAME_BOUNDS.scale;
  const worldHeight =
    (GAME_BOUNDS.maxY - GAME_BOUNDS.minY) * GAME_BOUNDS.scale;

  const normalizedX =
    ((gameXKm - GAME_BOUNDS.minX) * GAME_BOUNDS.scale) / worldWidth;
  const normalizedY =
    ((gameYKm - GAME_BOUNDS.minY) * GAME_BOUNDS.scale) / worldHeight;

  /*
   * Dino Den entrega estas coordenadas a Leaflet como [latitud, longitud].
   * SVG necesita [x, y], así que el orden debe intercambiarse:
   * x = longitud de Leaflet (depende de gameY)
   * y = latitud de Leaflet (depende de gameX y va invertida)
   */
  const leafletLatitude =
    GATEWAY_MAP_SIZE - normalizedX * GATEWAY_MAP_SIZE;
  const leafletLongitude =
    normalizedY * GATEWAY_MAP_SIZE;

  return [leafletLongitude, leafletLatitude];
}

export const migrationZones: MigrationZone[] = migrationZoneSources.map(
  (zone) => {
    const sourcePoints =
      zone.type === "circle"
        ? ellipsePoints(zone.center, zone.rx, zone.ry, zone.rot)
        : zone.km;

    return {
      id: zone.id,
      label: zone.label,
      mmz: zone.mmz,
      type: zone.type,
      color: zone.mmz ? "#f59e0b" : "#06b6d4",
      points: sourcePoints.map(([x, y]) => gameKmToMapPixel(x, y)),
    };
  },
);
