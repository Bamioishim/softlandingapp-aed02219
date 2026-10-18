import { CITY_DATA } from "./city-data";
import { resolveCity } from "./cities";
import type { Prefs } from "./qloo";

import type { Mode, AgentStep, AgentResult, NeighborhoodMatch } from "./agent-types";

const SYNONYMS: Record<string, string[]> = {
  afrobeats: ["afrobeat", "afro", "amapiano", "nigerian", "ghana"],
  spicy: ["spice", "hot", "pepper", "jollof"],
  budget: ["cheap", "affordable", "broke", "student"],
  student: ["student", "college", "university"],
  indie: ["indie", "independent", "arthouse"],
  film: ["film", "movie", "cinema"],
  coffee: ["coffee", "cafe", "café", "espresso"],
  quiet: ["quiet", "calm", "peaceful", "chill"],
  "hip-hop": ["hip-hop", "hip hop", "rap"],
  sneakers: ["sneaker", "kicks", "streetwear"],
  "late-night": ["late-night", "late night", "midnight"],
  music: ["music", "concert", "live"],
  jazz: ["jazz"],
};

const LABELS: Record<string, string> = { "hip-hop": "Hip-hop", "late-night": "Late-night food" };

function extract(msg: string): string[] {
  const m = msg.toLowerCase();
  const out = Object.entries(SYNONYMS)
    .filter(([k, syn]) => m.includes(k) || syn.some((s) => m.includes(s)))
    .map(([k]) => k);
  if (/mid budget|mid-range|moderate/.test(m)) out.push("mid");
  return out.length ? out : ["food", "music", "coffee"];
}



export async function runSampleAgent(
  userMessage: string,
  mode: Mode = "qloo",
  onStep?: (step: AgentStep, index: number) => void,
  city?: string,
  prefs: Prefs = {},
): Promise<AgentResult> {
  const steps: AgentStep[] = [];
  const step = async (label: string, ms: number) => {
    const start = performance.now();
    const s = { label, ms: performance.now() - start };
    steps.push(s);
    onStep?.(s, steps.length - 1);
  };

  if (!city) throw new Error("Pick a city to see your matches");
  if (!resolveCity(city)) throw new Error("Choose a recognized city before finding matches");
  if (mode === "llm") {
    const picks = [
      { name: "Neighborhood café", category: "Cafe", tags: ["coffee", "quiet", "budget"] },
      { name: "Local food market", category: "Restaurant", tags: ["food", "budget"] },
      { name: "Public park", category: "Place", tags: ["outdoors", "quiet", "budget"] },
      { name: "Live music venue", category: "Venue", tags: ["music", "nightlife"] },
      { name: "Independent bookshop", category: "Shop", tags: ["books", "quiet"] },
      { name: "Local gallery", category: "Place", tags: ["art", "quiet"] },
    ];
    const tastes = [...extract(userMessage), ...(prefs.chips ?? []).map((c) => c.toLowerCase())];
    const rank = (p: typeof picks[number]) => p.tags.filter((t) => tastes.includes(t)).length * 10
      + (prefs.budget === "low" && p.tags.includes("budget") ? 2 : 0)
      + (prefs.pace === "quiet" && p.tags.includes("quiet") ? 2 : 0)
      + (prefs.pace === "energetic" && p.tags.includes("nightlife") ? 2 : 0);
    const places = picks.sort((a, b) => rank(b) - rank(a)).map((p) => ({ ...p, neighborhood: city, reason: "Built-in sample idea, not a verified place in this city." }));
    const visiting = prefs.trip === "visiting";
    const plan = visiting
      ? [0, 1, 2].map((i) => ({ week: `Day ${i + 1}`, items: [`Explore ${city} on foot`, `Look for a ${places[i * 2]?.name.toLowerCase()}`, `Look for a ${places[i * 2 + 1]?.name.toLowerCase()}`] }))
      : [
          { week: "Week 1", items: ["Check local registration requirements", "Arrange a SIM card and transport", "Explore local banking options"] },
          { week: "Week 2", items: ["Compare apartment listings", "Find a neighborhood café"] },
          { week: "Week 3", items: ["Visit a local market", "Look for a community group"] },
          { week: "Week 4", items: ["Review your housing options", "Build a weekly routine"] },
        ];
    const summary = `Sample data, not from Qloo. These are generic ideas for ${city}, not verified local recommendations.`;
    await step("Ranked generic built-in samples", 0);
    return { city, mode, source: "sample", status: "ok", trip: prefs.trip ?? "moving", summary, spoken: summary, neighborhoods: [], places, plan, steps };
  }
  const data = CITY_DATA[city];
  if (!data) throw new Error("Choose a supported city before finding matches");
  const NEIGHBORHOODS = data.neighborhoods;
  const PLACES = data.places;
  const tastes = extract(userMessage);
  const pretty = tastes.filter((t) => t !== "mid").map((t) => LABELS[t] ?? t.charAt(0).toUpperCase() + t.slice(1));
  await step(`Locked destination: ${city}`, 240);
  await step(`Understood your tastes: ${pretty.join(", ")}`, 320);
  await step("Matched tastes against built-in samples", 420);

  const scored = NEIGHBORHOODS.map((n) => {
    let hits = tastes.filter((t) => n.tags.includes(t)).length;
    if (tastes.includes("budget") && n.rent === "$$$") hits -= 1;
    if (tastes.includes("budget") && n.rent === "$") hits += 0.5;
    const score = Math.max(52, Math.min(97, Math.round(58 + (hits / Math.max(tastes.length, 1)) * 40)));
    return { ...n, score, matched: tastes.filter((t) => n.tags.includes(t)), rentRange: data.rent[n.rent] };
  }).sort((a, b) => b.score - a.score);
  const top = scored.slice(0, 3);
  await step("Ranked sample neighborhoods", 480);

  const topNames = top.map((n) => n.name);
  const places = PLACES.map((p) => ({
    p,
    s: tastes.filter((t) => p.tags.includes(t)).length * 2 + (topNames.includes(p.neighborhood) ? 1.5 : 0),
  }))
    .sort((a, b) => b.s - a.s)
    .slice(0, 6)
    .map((x) => x.p);
  await step("Suggested sample places", 450);

  const [a, b, c] = top as [NeighborhoodMatch, NeighborhoodMatch, NeighborhoodMatch];
  const plan = [
    { week: "Week 1", items: [`Sort your residence ID or permit in ${city}`, "Open a local bank account", "Get a local SIM card", data.transit] },
    { week: "Week 2", items: [`Compare apartments in ${a.name} and ${b.name}`, `Try ${places[1]?.name ?? "a new spot"} for dinner`, "Join a local group chat or Meetup"] },
    { week: "Week 3", items: [`Spend a Saturday in ${c.name}`, `Catch something at ${places.find((p) => p.category === "Venue")?.name ?? "a local venue"}`, data.bank] },
    { week: "Week 4", items: ["Sign your lease", `Host friends at ${places[2]?.name ?? "your new favorite spot"}`, data.local] },
  ];
  await step("Wrote your plan", 330);

  return {
    source: "sample",
    status: "ok",
    summary: `Based on your love of ${pretty.slice(0, 3).join(", ").toLowerCase()}, ${a.name} in ${a.borough} is your strongest match in ${city} — ${a.why.charAt(0).toLowerCase() + a.why.slice(1)} ${b.name} and ${c.name} are close runners-up.`,
    neighborhoods: top,
    places,
    plan,
    steps,
    mode,
    city,
    spoken: `${a.name} is your best match in ${city}, at ${a.score} percent. ${b.name} and ${c.name} are close runners-up, and your 30-day plan is ready below.`,
  };
}
