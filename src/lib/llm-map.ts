// Client-safe mapping from the AI model's structured output to an AgentResult.
// Lives outside llm.server.ts so tests and the UI can share it without secrets.
import type { AgentResult, AgentStep, NeighborhoodMatch, Place } from "./agent-types";
import { CAFE_PHOTO, FOOD_PHOTO, cityPhoto } from "./photos";
import type { Prefs } from "./qloo";

export type LlmNeighborhood = {
  name: string;
  borough: string;
  why: string;
  rentBand: "$" | "$$" | "$$$";
  matched: string[];
  lat?: number;
  lng?: number;
};
export type LlmPlace = {
  name: string;
  category: "Cafe" | "Restaurant" | "Venue" | "Shop" | "Place";
  neighborhood: string;
  reason: string;
  lat?: number;
  lng?: number;
};
export type LlmOutput = {
  summary: string;
  story?: string;
  neighborhoods: LlmNeighborhood[];
  places: LlmPlace[];
  plan: { label: string; items: string[] }[];
};

type LatLng = { lat: number; lng: number };
/** True when a point is a plausible location inside the city (within ~60 km of its center). */
export function nearCity(p: { lat?: number | undefined; lng?: number | undefined }, c: LatLng): p is LatLng {
  if (typeof p.lat !== "number" || typeof p.lng !== "number" || !Number.isFinite(p.lat) || !Number.isFinite(p.lng)) return false;
  if (p.lat === 0 && p.lng === 0) return false;
  const kx = Math.cos((c.lat * Math.PI) / 180) * 111;
  return Math.hypot((p.lat - c.lat) * 111, (p.lng - c.lng) * kx) <= 60;
}
const coords = (p: { lat?: number; lng?: number }, c?: LatLng) => (c && nearCity(p, c) ? { lat: p.lat, lng: p.lng } : {});

export function buildLlmResult(opts: {
  center?: LatLng;
  city: string;
  tastes: string[];
  prefs: Prefs;
  output: LlmOutput;
  aiMs: number;
}): AgentResult {
  const { city, tastes, prefs, output } = opts;
  const visiting = prefs.trip === "visiting";
  const steps: AgentStep[] = [
    { label: `Locked destination: ${city}`, ms: 0 },
    { label: `Understood your tastes: ${tastes.slice(0, 4).join(", ") || "everything local"}`, ms: 0 },
    { label: "Asked Lovable AI for places that match (live AI call)", ms: opts.aiMs },
    { label: visiting ? "Shaped your day-by-day trip" : "Shaped your 30-day plan", ms: 0 },
  ];
  const neighborhoods: NeighborhoodMatch[] = output.neighborhoods.slice(0, 4).map((n) => {
    const matched = n.matched.slice(0, 3);
    return {
      name: n.name,
      borough: n.borough,
      rent: n.rentBand,
      tags: matched,
      why: n.why,
      score: 0,
      scoreAvailable: false,
      matched,
      ...coords(n, opts.center),
      rentRange: "", // no real rent figure in LLM-only mode: the rent row stays hidden
    };
  });
  const places: Place[] = output.places.slice(0, 8).map((p, i) => ({
    name: p.name,
    category: p.category,
    neighborhood: p.neighborhood,
    tags: [],
    reason: p.reason,
    ...coords(p, opts.center),
    image: p.category === "Cafe" ? CAFE_PHOTO : p.category === "Restaurant" ? FOOD_PHOTO : cityPhoto(city, i),
    imageAlt: `AI-suggested ${p.category.toLowerCase()} in ${city}`,
  }));
  const plan = output.plan.slice(0, visiting ? 3 : 4).map((w) => ({
    week: w.label,
    items: w.items.slice(0, 6),
  }));
  const summary = output.summary;
  return {
    city,
    mode: "llm",
    source: "llm",
    status: "ok",
    trip: prefs.trip ?? "moving",
    summary,
    ...(output.story ? { story: output.story } : {}),
    spoken: summary,
    neighborhoods,
    places,
    plan,
    steps,
  };
}
