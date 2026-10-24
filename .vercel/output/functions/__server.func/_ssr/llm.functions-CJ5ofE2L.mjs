import { i as agentInput } from "./qloo-CgzhBWKg.mjs";
import { l as createServerFn } from "./createServerFn-DDDJMFWM.mjs";
import { t as createServerRpc } from "./createServerRpc-CxD4EZ5P.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/llm.functions-CJ5ofE2L.js
var getLlmRecommendations_createServerFn_handler = createServerRpc({
	id: "185f8177267c95c35b22791eb5a5d451f1f93a2183ced7bcbe3ebed005e40de9",
	name: "getLlmRecommendations",
	filename: "src/lib/llm.functions.ts"
}, (opts) => getLlmRecommendations.__executeServer(opts));
var getLlmRecommendations = createServerFn({ method: "POST" }).inputValidator((input) => agentInput.parse(input)).handler(getLlmRecommendations_createServerFn_handler, async ({ data }) => {
	const { generateLlmRecommendations } = await import("./llm.server-CPDMEK_Y.mjs");
	return generateLlmRecommendations(data);
});
//#endregion
export { getLlmRecommendations_createServerFn_handler };
