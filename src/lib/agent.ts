import { getQlooRecommendations } from "./agent.functions";
import { getLlmRecommendations } from "./llm.functions";
import { runSampleAgent } from "./sample-agent";
import type { Mode, AgentStep, AgentResult } from "./agent-types";
import type { Prefs } from "./qloo";
export type { Mode, Neighborhood, Place, AgentStep, NeighborhoodMatch, AgentResult } from "./agent-types";

export async function runAgent(message: string, mode: Mode = "qloo", onStep?: (step: AgentStep, index: number) => void, city?: string, prefs?: Prefs): Promise<AgentResult> {
  if (!city) throw new Error("Pick a city to see your matches");
  if (mode === "qloo") {
    const result = await getQlooRecommendations({ data: { city, message, prefs } });
    result.steps.forEach((step, index) => onStep?.(step, index));
    return result;
  }
  try {
    const result = await getLlmRecommendations({ data: { city, message, prefs } });
    result.steps.forEach((step, index) => onStep?.(step, index));
    return result;
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    const fallback = await runSampleAgent(message, mode, onStep, city, prefs);
    fallback.steps.unshift({ label: `Lovable AI call failed: ${detail.slice(0, 180)} — showed built-in samples`, ms: 0 });
    return fallback;
  }
}
