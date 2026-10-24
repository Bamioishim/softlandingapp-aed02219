//#region node_modules/.nitro/vite/services/ssr/assets/__23tanstack-start-server-fn-resolver-11LbKawj.js
var manifest = {
	"185f8177267c95c35b22791eb5a5d451f1f93a2183ced7bcbe3ebed005e40de9": {
		functionName: "getLlmRecommendations_createServerFn_handler",
		importer: () => import("./_ssr/llm.functions-CJ5ofE2L.mjs")
	},
	"1bdf63c349cd204946cfc9c8c671575abec663e9b2baa7e2d9a921505e191444": {
		functionName: "getQlooRecommendations_createServerFn_handler",
		importer: () => import("./_ssr/agent.functions-rfmGXDMG.mjs")
	}
};
async function getServerFnById(id, access) {
	const serverFnInfo = manifest[id];
	if (!serverFnInfo) throw new Error("Server function info not found for " + id);
	const fnModule = serverFnInfo.module ??= await serverFnInfo.importer();
	if (!fnModule) throw new Error("Server function module not resolved for " + id);
	const action = fnModule[serverFnInfo.functionName];
	if (!action) throw new Error("Server function module export not resolved for serverFn ID: " + id);
	return action;
}
//#endregion
export { getServerFnById as t };
