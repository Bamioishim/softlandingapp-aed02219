import { getQlooRecommendations } from "./agent.functions";
import { runSampleAgent } from "./sample-agent";
import type { Mode, AgentStep, AgentResult } from "./agent-types";
import type { Prefs } from "./qloo";
export type { Mode, Neighborhood, Place, AgentStep, NeighborhoodMatch, AgentResult } from "./agent-types";

export async function runAgent(message: string, mode: Mode = "qloo", onStep?: (step: AgentStep, index: number) => void, city?: string, prefs?: Prefs): Promise<AgentResult> {
  if (!city) throw new Error("Pick a city to see your matches");
  const result = mode === "qloo" ? await getQlooRecommendations({ data: { city, message, prefs } }) : await runSampleAgent(message, mode, undefined, city, prefs);
  result.steps.forEach((step, index) => onStep?.(step, index));
  return result;
}
