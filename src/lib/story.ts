import type { AgentResult } from "./agent-types";

// Short, recognisable flavour lines for cities we know well. Anything else gets a neutral opener.
const CITY_FLAVOR: Record<string, string> = {
  "New York City": "its late-night food, live music and borough-by-borough personality",
  London: "its markets, pubs and a music scene that changes every few streets",
  Berlin: "its clubs, canals and laid-back café culture",
  Lagos: "its Afrobeats, buzzing street food and nonstop energy",
  Paris: "its cafés, bakeries and neighbourhood markets",
  Toronto: "its multicultural food streets and creative neighbourhoods",
  Amsterdam: "its canals, bikes and cosy brown cafés",
  Tokyo: "its tiny bars, ramen counters and quiet side streets",
  Dubai: "its food halls, beaches and late-night city buzz",
  Sydney: "its beaches, brunch spots and outdoor living",
  "San Francisco": "its hills, coffee roasters and independent neighbourhoods",
  "Los Angeles": "its lively nightlife and taco trucks",
};

const list = (xs: string[]) => (xs.length <= 1 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`);

/** Builds a 2–4 sentence, natural-language explanation of how the picks were made. */
export function buildStory(r: AgentResult): string {
  const [a, b, c] = r.neighborhoods;
  const tastes = [...new Set(r.neighborhoods.flatMap((n) => n.matched))].slice(0, 3).map((t) => t.toLowerCase());
  const flavor = CITY_FLAVOR[r.city];
  const s: string[] = [];
  s.push(flavor ? `${r.city} is known for ${flavor}.` : `${r.city} has a little of everything, so we started from what you love.`);
  if (a) {
    const why = a.why ? ` ${a.why.trim().replace(/([^.!?])$/, "$1.")}` : "";
    s.push(`${tastes.length ? `With your love of ${list(tastes)}, we` : "We"} leaned toward ${a.name}.${why}`);
  }
  const rest = [b, c].filter(Boolean).map((n) => n!.name);
  if (rest.length) {
    s.push(
      r.source === "qloo"
        ? `${list(rest)} came close behind, ranked on Qloo's taste signals${r.places.length ? ` for ${r.places.length} nearby spots` : ""}.`
        : `${list(rest)} came close behind as strong second options.`,
    );
  }
  return s.slice(0, 4).join(" ");
}
