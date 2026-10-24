import { joinParts } from "@/lib/parts";
import { ClientOnly } from "@tanstack/react-router";
import { Suspense, lazy } from "react";
import { Navigation } from "lucide-react";
import type { MapSpot } from "@/lib/map-types";

const LeafletMap = lazy(() => import("./LeafletMap"));

export function CityMap({
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
  const selected = spots.find((s) => s.id === selectedId);
  return (
    <div className="map-wrap">
      <ClientOnly fallback={<div className="leaflet-map map-skeleton" aria-hidden="true" />}>
        <Suspense fallback={<div className="leaflet-map map-skeleton" aria-hidden="true" />}>
          <LeafletMap spots={spots} selectedId={selectedId} focusTick={focusTick} onSelect={onSelect} />
        </Suspense>
      </ClientOnly>
      {selected && (
        <div className="map-card" role="dialog" aria-label={`${selected.name} on the map`}>
          {selected.image && (
            <img src={selected.image} alt={selected.imageAlt ?? selected.name} className="map-card-photo" />
          )}
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-2xl leading-tight">{selected.name}</h3>
            <p className="mt-1 text-[11px] text-muted-foreground">
              {joinParts(selected.area, selected.kind === "neighborhood" ? "Neighborhood" : "Spot")}
            </p>
            <a
              className="map-directions"
              href={`https://www.google.com/maps/dir/?api=1&destination=${selected.lat},${selected.lng}&travelmode=transit`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Navigation className="h-3.5 w-3.5" /> Get Directions
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
