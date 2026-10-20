// Browser-safe shared types for the results map. No Leaflet imports here.
export type MapSpot = {
  id: string;
  name: string;
  area: string;
  kind: "neighborhood" | "place";
  lat: number;
  lng: number;
  image?: string | undefined;
  imageAlt?: string | undefined;
};

export function spotId(kind: MapSpot["kind"], name: string): string {
  return `${kind}:${name}`;
}
