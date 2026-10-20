// Browser-only Leaflet map. Loaded lazily behind <ClientOnly>; never import from SSR modules.
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";
import type { MapSpot } from "@/lib/map-types";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");

export default function LeafletMap({
  spots,
  selectedId,
  focusTick,
  onSelect,
}: {
  spots: MapSpot[];
  selectedId: string | null;
  focusTick: number;
  onSelect: (id: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<globalThis.Map<string, L.Marker>>(new globalThis.Map());
  const spotsRef = useRef(spots);
  spotsRef.current = spots;
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, { scrollWheelZoom: true });
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map);
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current.clear();
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    markersRef.current.forEach((m) => m.remove());
    markersRef.current.clear();
    for (const spot of spots) {
      const icon = L.divIcon({
        className: "map-pin",
        html: `<span class="map-pin-inner">${
          spot.image
            ? `<img src="${esc(spot.image)}" alt="" loading="lazy" />`
            : `<span class="map-pin-letter">${esc(spot.name.charAt(0))}</span>`
        }</span>`,
        iconSize: [44, 44],
        iconAnchor: [22, 22],
      });
      const marker = L.marker([spot.lat, spot.lng], { icon, keyboard: true, title: spot.name })
        .addTo(map)
        .on("click", () => onSelectRef.current(spot.id));
      markersRef.current.set(spot.id, marker);
    }
    if (spots.length) {
      const bounds = L.latLngBounds(spots.map((s) => [s.lat, s.lng] as [number, number]));
      map.fitBounds(bounds, { padding: [48, 48], maxZoom: 13 });
    }
  }, [spots]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedId) return;
    markersRef.current.forEach((m, id) => {
      const el = m.getElement();
      if (el) el.classList.toggle("map-pin-selected", id === selectedId);
    });
    const spot = spotsRef.current.find((s) => s.id === selectedId);
    if (spot) map.flyTo([spot.lat, spot.lng], Math.max(map.getZoom(), 15), { duration: 0.6 });
  }, [selectedId, focusTick]);

  return <div ref={containerRef} className="leaflet-map" role="application" aria-label="Map of recommended spots" />;
}
