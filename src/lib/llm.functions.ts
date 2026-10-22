import { createServerFn } from "@tanstack/react-start";
import { agentInput } from "./qloo";

export const getLlmRecommendations = createServerFn({ method: "POST" })
  .inputValidator((input) => agentInput.parse(input))
  .handler(async ({ data }) => {
    const { generateLlmRecommendations } = await import("./llm.server");
    return generateLlmRecommendations(data);
  });
