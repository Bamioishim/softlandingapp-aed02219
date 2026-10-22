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
};
export type LlmPlace = {
  name: string;
  category: "Cafe" | "Restaurant" | "Venue" | "Shop" | "Place";
  neighborhood: string;
  reason: string;
};
export type LlmOutput = {
  summary: string;
  neighborhoods: LlmNeighborhood[];
  places: LlmPlace[];
  plan: { label: string; items: string[] }[];
};

export function buildLlmResult(opts: {
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
      rentRange: `${n.rentBand} (AI estimate)`,
    };
  });
  const places: Place[] = output.places.slice(0, 8).map((p, i) => ({
    name: p.name,
    category: p.category,
    neighborhood: p.neighborhood,
    tags: [],
    reason: p.reason,
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
    spoken: summary,
    neighborhoods,
    places,
    plan,
    steps,
  };
}
