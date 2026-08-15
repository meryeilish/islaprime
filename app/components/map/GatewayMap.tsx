"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import {
  GATEWAY_MAP_SIZE,
  migrationZones,
} from "./migration-zones";
import {
  areaLabels,
  humanSites,
  landmarkPoints,
  patrolGroupCount,
  patrolZones,
  sanctuaryGroupCount,
  sanctuaryZones,
  waterPoints,
  type MapLabel,
  type MapPoint,
} from "./gateway-data";

type LayerId =
  | "areas"
  | "agua"
  | "migraciones"
  | "patrullas"
  | "santuarios"
  | "referencias"
  | "bases";

interface LayerDef {
  id: LayerId;
  label: string;
  icon: string;
  count: number;
  defaultOn: boolean;
}

const layerDefs: LayerDef[] = [
  { id: "areas", label: "Zonas", icon: "⛳", count: areaLabels.length, defaultOn: true },
  { id: "agua", label: "Agua", icon: "💧", count: waterPoints.length, defaultOn: true },
  { id: "migraciones", label: "Migraciones", icon: "🌿", count: migrationZones.length, defaultOn: true },
  { id: "patrullas", label: "Patrullas IA", icon: "👁️", count: patrolGroupCount, defaultOn: true },
  { id: "santuarios", label: "Santuarios", icon: "🔰", count: sanctuaryGroupCount, defaultOn: true },
  { id: "referencias", label: "Referencias", icon: "📌", count: landmarkPoints.length, defaultOn: false },
  { id: "bases", label: "Bases humanas", icon: "🏭", count: humanSites.length, defaultOn: false },
];

const defaultLayerState = Object.fromEntries(
  layerDefs.map((layer) => [layer.id, layer.defaultOn]),
) as Record<LayerId, boolean>;

const tooltipOptions: L.TooltipOptions = {
  direction: "top",
  offset: [0, -12],
  className: "gw-tooltip",
};

function textLabelMarker(item: MapLabel, kind: "area" | "water"): L.Marker {
  const sizeClass =
    item.size === "large" ? "gw-label--large" : item.size === "small" ? "gw-label--small" : "";
  const kindClass = kind === "water" || item.ocean ? "gw-label--water" : "";

  return L.marker(item.latLng, {
    interactive: false,
    keyboard: false,
    icon: L.divIcon({
      className: "gw-divicon",
      html: `<span class="gw-label ${sizeClass} ${kindClass}">${item.label}</span>`,
      iconSize: [0, 0],
    }),
  });
}

function poiMarker(point: MapPoint, emoji: string): L.Marker {
  const marker = L.marker(point.latLng, {
    keyboard: false,
    icon: L.divIcon({
      className: "gw-divicon",
      html: `<span class="gw-poi">${emoji}</span>`,
      iconSize: [0, 0],
    }),
  });

  marker.bindTooltip(point.label, tooltipOptions);
  return marker;
}

function buildLayerGroups(): Record<LayerId, L.LayerGroup> {
  const areas = L.layerGroup(areaLabels.map((item) => textLabelMarker(item, "area")));

  const agua = L.layerGroup(
    waterPoints.map((item) => {
      const marker = poiMarker(item, "💧");
      return marker;
    }),
  );

  const migraciones = L.layerGroup(
    migrationZones.map((zone) =>
      L.polygon(
        zone.points.map(([x, y]) => [y, x] as [number, number]),
        {
          color: zone.color,
          weight: 2,
          dashArray: "8 6",
          fillColor: zone.color,
          fillOpacity: 0.07,
        },
      ).bindTooltip(zone.mmz ? `${zone.label} — zona de migración obligatoria` : zone.label, {
        ...tooltipOptions,
        sticky: true,
      }),
    ),
  );

  const patrullas = L.layerGroup(
    patrolZones.map((zone) =>
      L.polygon(zone.latLngs, {
        color: "#60a5fa",
        weight: 1.5,
        dashArray: "4 6",
        fillColor: "#3b82f6",
        fillOpacity: 0.06,
      }).bindTooltip(zone.label, { ...tooltipOptions, sticky: true }),
    ),
  );

  const santuarios = L.layerGroup(
    sanctuaryZones.map((zone) =>
      L.polygon(zone.latLngs, {
        color: "#22c55e",
        weight: 2,
        fillColor: "#22c55e",
        fillOpacity: 0.15,
      }).bindTooltip(zone.label, { ...tooltipOptions, sticky: true }),
    ),
  );

  const referencias = L.layerGroup(landmarkPoints.map((point) => poiMarker(point, "📌")));
  const bases = L.layerGroup(humanSites.map((point) => poiMarker(point, "🏭")));

  return { areas, agua, migraciones, patrullas, santuarios, referencias, bases };
}

export default function GatewayMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const groupsRef = useRef<Record<LayerId, L.LayerGroup> | null>(null);

  const [layers, setLayers] = useState<Record<LayerId, boolean>>(defaultLayerState);
  const [panelOpen, setPanelOpen] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || mapRef.current) return;

    const bounds = L.latLngBounds([0, 0], [GATEWAY_MAP_SIZE, GATEWAY_MAP_SIZE]);

    const map = L.map(container, {
      crs: L.CRS.Simple,
      zoomControl: false,
      attributionControl: false,
      minZoom: -6,
      maxZoom: 1.5,
      zoomSnap: 0.25,
      wheelPxPerZoomLevel: 90,
      maxBounds: bounds.pad(0.25),
      maxBoundsViscosity: 0.7,
    });

    L.imageOverlay("/images/maps/gateway.webp", bounds).addTo(map);
    map.fitBounds(bounds);
    map.setMinZoom(map.getZoom());

    groupsRef.current = buildLayerGroups();
    mapRef.current = map;

    const resizeObserver = new ResizeObserver(() => map.invalidateSize());
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapRef.current = null;
      groupsRef.current = null;
    };
  }, []);

  // Sincroniza el estado de capas con los layer groups de Leaflet.
  useEffect(() => {
    const map = mapRef.current;
    const groups = groupsRef.current;
    if (!map || !groups) return;

    for (const layer of layerDefs) {
      const group = groups[layer.id];
      const shouldShow = layers[layer.id];

      if (shouldShow && !map.hasLayer(group)) group.addTo(map);
      if (!shouldShow && map.hasLayer(group)) group.remove();
    }
  }, [layers]);

  const toggleLayer = (id: LayerId) => {
    setLayers((current) => ({ ...current, [id]: !current[id] }));
  };

  const setAll = (value: boolean) => {
    setLayers(
      Object.fromEntries(layerDefs.map((layer) => [layer.id, value])) as Record<LayerId, boolean>,
    );
  };

  const resetView = () => {
    mapRef.current?.fitBounds(
      L.latLngBounds([0, 0], [GATEWAY_MAP_SIZE, GATEWAY_MAP_SIZE]),
    );
  };

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#04131e]">
      <div ref={containerRef} className="absolute inset-0 z-0" />

      {/* Controles de zoom */}
      <div className="absolute bottom-5 left-4 z-20 flex flex-col gap-2 sm:left-5">
        <button
          type="button"
          onClick={() => mapRef.current?.zoomIn()}
          aria-label="Acercar mapa"
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-black/80 text-xl font-black text-white backdrop-blur-md transition hover:border-red-500/60 hover:bg-red-600/20 hover:text-red-400"
        >
          +
        </button>

        <button
          type="button"
          onClick={() => mapRef.current?.zoomOut()}
          aria-label="Alejar mapa"
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-black/80 text-xl font-black text-white backdrop-blur-md transition hover:border-red-500/60 hover:bg-red-600/20 hover:text-red-400"
        >
          −
        </button>

        <button
          type="button"
          onClick={resetView}
          aria-label="Restablecer vista"
          title="Restablecer vista"
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-red-600/40 bg-red-600/15 text-lg text-red-400 backdrop-blur-md transition hover:border-red-500 hover:bg-red-600 hover:text-white"
        >
          ⌂
        </button>
      </div>

      {/* Botón capas (móvil) */}
      <button
        type="button"
        onClick={() => setPanelOpen((open) => !open)}
        className="absolute right-4 top-4 z-30 inline-flex h-10 items-center justify-center rounded-xl border border-white/10 bg-black/85 px-4 text-xs font-black uppercase tracking-[0.14em] text-zinc-300 backdrop-blur-md transition hover:border-red-500/50 hover:text-white lg:hidden"
      >
        {panelOpen ? "Cerrar" : "Capas"}
      </button>

      {/* Panel de capas */}
      <aside
        className={`absolute right-4 top-16 z-20 w-[260px] overflow-hidden rounded-2xl border border-white/10 bg-black/85 shadow-2xl backdrop-blur-xl transition-all duration-300 sm:right-5 lg:top-5 ${
          panelOpen
            ? "translate-x-0 opacity-100"
            : "pointer-events-none translate-x-5 opacity-0 lg:pointer-events-auto lg:translate-x-0 lg:opacity-100"
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-red-500">
              Capas del mapa
            </p>
            <p className="mt-0.5 text-[11px] text-zinc-500">Toca para alternar</p>
          </div>

          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setAll(true)}
              className="rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1 text-[10px] font-bold uppercase text-zinc-400 transition hover:border-red-500/40 hover:text-white"
            >
              Todas
            </button>
            <button
              type="button"
              onClick={() => setAll(false)}
              className="rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1 text-[10px] font-bold uppercase text-zinc-400 transition hover:border-red-500/40 hover:text-white"
            >
              Ninguna
            </button>
          </div>
        </div>

        <div className="max-h-[420px] space-y-1 overflow-y-auto p-2">
          {layerDefs.map((layer) => {
            const isActive = layers[layer.id];

            return (
              <button
                key={layer.id}
                type="button"
                onClick={() => toggleLayer(layer.id)}
                className={`flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-left transition ${
                  isActive
                    ? "border-red-500/50 bg-red-600/15 text-white"
                    : "border-transparent bg-white/[0.03] text-zinc-400 hover:border-white/10 hover:bg-white/[0.07] hover:text-white"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-black/40 text-base">
                    {layer.icon}
                  </span>

                  <span>
                    <span className="block text-sm font-bold leading-tight">{layer.label}</span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                      {layer.count}
                    </span>
                  </span>
                </span>

                <span
                  className={`relative h-5 w-9 shrink-0 rounded-full transition ${
                    isActive ? "bg-red-600" : "bg-zinc-800"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
                      isActive ? "translate-x-[18px]" : "translate-x-0.5"
                    }`}
                  />
                </span>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Ayuda inferior */}
      <div className="pointer-events-none absolute bottom-5 left-1/2 z-10 hidden -translate-x-1/2 rounded-full border border-white/10 bg-black/75 px-5 py-2 text-center text-xs text-zinc-300 backdrop-blur-md sm:block">
        Rueda para hacer zoom · Arrastra para moverte
      </div>
    </div>
  );
}
