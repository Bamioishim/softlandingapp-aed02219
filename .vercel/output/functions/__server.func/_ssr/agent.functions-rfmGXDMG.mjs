import { i as agentInput } from "./qloo-CgzhBWKg.mjs";
import { l as createServerFn } from "./createServerFn-DDDJMFWM.mjs";
import { t as createServerRpc } from "./createServerRpc-CxD4EZ5P.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/agent.functions-rfmGXDMG.js
var getQlooRecommendations_createServerFn_handler = createServerRpc({
	id: "1bdf63c349cd204946cfc9c8c671575abec663e9b2baa7e2d9a921505e191444",
	name: "getQlooRecommendations",
	filename: "src/lib/agent.functions.ts"
}, (opts) => getQlooRecommendations.__executeServer(opts));
var getQlooRecommendations = createServerFn({ method: "POST" }).inputValidator((input) => agentInput.parse(input)).handler(getQlooRecommendations_createServerFn_handler, async ({ data }) => {
	const key = process.env["QLOO_API_KEY"];
	const { queryQloo } = await import("./qloo-CgzhBWKg.mjs").then((n) => n.a);
	return queryQloo(data, key);
});
//#endregion
export { getQlooRecommendations_createServerFn_handler };
