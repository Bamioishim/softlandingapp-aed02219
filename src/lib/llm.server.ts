// Server-only: the LLM-only ("LLM-only") recommendation engine.
// Calls the Lovable AI Gateway with the resolved default model and consumes the streamed structured output here.
import { streamText, Output, NoObjectGeneratedError } from "ai";
import { z } from "zod";
import { createLovableAiGatewayResponses } from "./gateway.server";
import { resolveCity } from "./cities";
import { agentInput, type Prefs } from "./qloo";
import { buildLlmResult, type LlmOutput } from "./llm-map";
import type { AgentResult } from "./agent-types";
import { fillNeighborhoodImages } from "./neighborhood-images";

const outputSchema = z
  .object({
    summary: z.string(),
    story: z.string(),
    neighborhoods: z
      .array(
        z
          .object({
            name: z.string(),
            borough: z.string(),
            why: z.string(),
            rentBand: z.enum(["$", "$$", "$$$"]),
            matched: z.array(z.string()),
          })
          .strict(),
      ),
    places: z
      .array(
        z
          .object({
            name: z.string(),
            category: z.enum(["Cafe", "Restaurant", "Venue", "Shop", "Place"]),
            neighborhood: z.string(),
            reason: z.string(),
          })
          .strict(),
      ),
    plan: z.array(z.object({ label: z.string(), items: z.array(z.string()) }).strict()),
  })
  .strict();

const SYSTEM_PROMPT = `You are Soft Landing's relocation concierge. Given a destination city and what the user loves, recommend real, well-known neighborhoods and places in that city, drawn from broadly known information about it (local guides, popular venues, widely discussed spots).
Rules:
- Only name real places that genuinely exist in the city. If unsure, prefer famous, verifiable spots over obscure guesses.
- Never invent ratings, percentages, or exact prices. rentBand is a coarse one-bedroom rent band only.
- Every "why" and "reason" is one warm, specific sentence tied to the user's tastes.
- neighborhoods: exactly 3, real neighborhood names with their borough or district.
- places: exactly 6, each placed in a neighborhood named above or a real district of the city.
- plan: exactly 3 entries labeled "Day 1", "Day 2", "Day 3" for visiting trips (3 short checklist items each weaving in the recommended places), or exactly 4 entries labeled "Week 1" through "Week 4" for moves (3-4 short settling-in items each, respecting the life stage).
- summary: 1-2 sentences explaining the picks.
- story: 2-4 sentences of natural, flowing prose about the city and why these picks fit, e.g. "Los Angeles is known for its lively nightlife and taco trucks, so we leaned toward Silver Lake…". No lists or step numbers.
Keep every string short and plain.`;

function userPrompt(city: { name: string; country: string }, message: string, prefs: Prefs) {
  const chips = (prefs.chips ?? []).join(", ") || "none";
  return [
    `Destination: ${city.name}, ${city.country}`,
    `What the user loves: ${message}`,
    `Preferences: budget=${prefs.budget ?? "unspecified"}, pace=${prefs.pace ?? "unspecified"}, life stage=${prefs.lifeStage ?? "unspecified"}, trip=${prefs.trip ?? "moving"}, extra tastes=${chips}, needs=${(prefs.needs ?? []).join(", ") || "none"}. Favor neighborhoods and places that suit these needs.`,
  ].join("\n");
}

function tasteLabels(message: string, prefs: Prefs): string[] {
  const fromMessage = message
    .split(/[,;.]+/)
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);
  const chips = (prefs.chips ?? []).map((c) => c.toLowerCase());
  return [...new Set([...chips, ...fromMessage])];
}

export async function generateLlmRecommendations(input: z.infer<typeof agentInput>): Promise<AgentResult> {
  const { city: cityName, message, prefs = {} } = agentInput.parse(input);
  const resolved = resolveCity(cityName);
  if (!resolved) throw new Error("Choose a recognized city before finding matches");
  const city = resolved.city;
  const apiKey = process.env['LOVABLE_API_KEY'];
  if (!apiKey) throw new Error("Lovable AI is not configured");
  const { provider } = createLovableAiGatewayResponses(apiKey);

  const start = performance.now();
  const result = streamText({
    model: provider.responses("openai/gpt-6-astra"),
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userPrompt(city, message, prefs) }],
    output: Output.object({ schema: outputSchema }),
    providerOptions: {
      openai: {
        store: false,
        forceReasoning: true,
        reasoningEffort: "medium",
        reasoningSummary: "auto",
        include: ["reasoning.encrypted_content"],
      },
    },
  });
  let output: LlmOutput;
  try {
    output = (await result.output) as LlmOutput;
  } catch (error) {
    if (NoObjectGeneratedError.isInstance(error) && error.text) {
      throw new Error(error.text.replace(/\s+/g, " ").slice(0, 200));
    }
    throw error;
  }
  const aiMs = performance.now() - start;
  const r = buildLlmResult({ city: city.name, tastes: tasteLabels(message, prefs), prefs, output, aiMs });
  const wikiFetch = (url: string) => fetch(url, { headers: { "User-Agent": "SoftLanding/1.0 (softlandingapp.lovable.app)" }, signal: AbortSignal.timeout(5000) });
  r.neighborhoods = await fillNeighborhoodImages(r.city, r.neighborhoods, wikiFetch);
  return r;
}
