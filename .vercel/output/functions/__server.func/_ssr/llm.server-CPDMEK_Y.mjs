import { a as objectType, o as stringType, r as enumType, t as arrayType } from "../_libs/zod.mjs";
import { c as CITY_PHOTOS, f as cityPhoto, h as resolveCity, i as agentInput, s as CAFE_PHOTO, u as FOOD_PHOTO } from "./qloo-CgzhBWKg.mjs";
import { n as output_exports, r as streamText, t as NoObjectGeneratedError } from "../_libs/ai.mjs";
import { t as createOpenAI } from "../_libs/ai-sdk__openai+zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/llm.server-CPDMEK_Y.js
var LOVABLE_AIG_RUN_ID_HEADER = "X-Lovable-AIG-Run-ID";
function createLovableAiGatewayRunIdFetch(initialRunId) {
	let runId = initialRunId?.trim() || void 0;
	let resolveRunId = () => {};
	let runIdResolved = false;
	const runIdReady = new Promise((resolve) => {
		resolveRunId = resolve;
	});
	const publishRunId = (value) => {
		const nextRunId = value?.trim() || void 0;
		if (!runId && nextRunId) runId = nextRunId;
		if (!runIdResolved) {
			runIdResolved = true;
			resolveRunId(runId);
		}
	};
	if (runId) publishRunId(runId);
	return {
		fetch: async (input, init) => {
			const headers = new Headers(init?.headers);
			if (runId && !headers.has(LOVABLE_AIG_RUN_ID_HEADER)) headers.set(LOVABLE_AIG_RUN_ID_HEADER, runId);
			try {
				const response = await fetch(input, {
					...init,
					headers
				});
				publishRunId(response.headers.get(LOVABLE_AIG_RUN_ID_HEADER) ?? void 0);
				return response;
			} catch (error) {
				publishRunId(void 0);
				throw error;
			}
		},
		getRunId: () => runId,
		waitForRunId: () => runId ? Promise.resolve(runId) : runIdReady
	};
}
function createLovableAiGatewayResponses(apiKey) {
	const runIdFetch = createLovableAiGatewayRunIdFetch();
	return {
		provider: createOpenAI({
			baseURL: "https://ai.gateway.lovable.dev/v1",
			apiKey,
			headers: {
				"Lovable-API-Key": apiKey,
				"X-Lovable-AIG-SDK": "vercel-ai-sdk"
			},
			fetch: runIdFetch.fetch
		}),
		runIdFetch
	};
}
function buildLlmResult(opts) {
	const { city, tastes, prefs, output } = opts;
	const visiting = prefs.trip === "visiting";
	const steps = [
		{
			label: `Locked destination: ${city}`,
			ms: 0
		},
		{
			label: `Understood your tastes: ${tastes.slice(0, 4).join(", ") || "everything local"}`,
			ms: 0
		},
		{
			label: "Asked Lovable AI for places that match (live AI call)",
			ms: opts.aiMs
		},
		{
			label: visiting ? "Shaped your day-by-day trip" : "Shaped your 30-day plan",
			ms: 0
		}
	];
	const neighborhoods = output.neighborhoods.slice(0, 4).map((n) => {
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
			rentRange: `${n.rentBand} (AI estimate)`
		};
	});
	const places = output.places.slice(0, 8).map((p, i) => ({
		name: p.name,
		category: p.category,
		neighborhood: p.neighborhood,
		tags: [],
		reason: p.reason,
		image: p.category === "Cafe" ? CAFE_PHOTO : p.category === "Restaurant" ? FOOD_PHOTO : cityPhoto(city, i),
		imageAlt: `AI-suggested ${p.category.toLowerCase()} in ${city}`
	}));
	const plan = output.plan.slice(0, visiting ? 3 : 4).map((w) => ({
		week: w.label,
		items: w.items.slice(0, 6)
	}));
	const summary = output.summary;
	return {
		city,
		mode: "llm",
		source: "llm",
		status: "ok",
		trip: prefs.trip ?? "moving",
		summary,
		...output.story ? { story: output.story } : {},
		spoken: summary,
		neighborhoods,
		places,
		plan,
		steps
	};
}
var COMMONS = {
	"cafe": [
		"https://thumb.wikimedia.org/wikipedia/commons/thumb/6/66/Covington_St_Johns_Coffeehouse_Interior.jpg/960px-Covington_St_Johns_Coffeehouse_Interior.jpg",
		"https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1b/Interior_Johnie%27s_Coffee_Shop_2021.jpg/960px-Interior_Johnie%27s_Coffee_Shop_2021.jpg",
		"https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c8/Interior_Johnie%27s_Coffee_Shop_2021_2.jpg/960px-Interior_Johnie%27s_Coffee_Shop_2021_2.jpg",
		"https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b5/Newark-on-Trent%2C_Interior_of_%27Cherizena_Coffee_Shop%27%2C_23-24_Stodman_Street_-_geograph.org.uk_-_7846323.jpg/960px-Newark-on-Trent%2C_Interior_of_%27Cherizena_Coffee_Shop%27%2C_23-24_Stodman_Street_-_geograph.org.uk_-_7846323.jpg",
		"https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3f/2019_02_Awesome_Coffee_Shop_in_Korat.jpg/960px-2019_02_Awesome_Coffee_Shop_in_Korat.jpg"
	],
	"bar": [
		"https://thumb.wikimedia.org/wikipedia/commons/thumb/4/46/Interior_of_Czeczotka_Cocktail_Bar%2C_Krak%C3%B3w%2C_2019.jpg/960px-Interior_of_Czeczotka_Cocktail_Bar%2C_Krak%C3%B3w%2C_2019.jpg",
		"https://thumb.wikimedia.org/wikipedia/commons/thumb/6/60/Interior_of_Last_Tuesday_Society_cocktail_bar.jpg/960px-Interior_of_Last_Tuesday_Society_cocktail_bar.jpg",
		"https://thumb.wikimedia.org/wikipedia/commons/thumb/8/83/Bartender_at_Sylvarum_cocktail_bar%2C_Alicante.jpg/960px-Bartender_at_Sylvarum_cocktail_bar%2C_Alicante.jpg",
		"https://thumb.wikimedia.org/wikipedia/commons/thumb/d/dc/Cocktail-Bar_%28Kleines_Phi%29_in_Hamburg.jpg/960px-Cocktail-Bar_%28Kleines_Phi%29_in_Hamburg.jpg",
		"https://thumb.wikimedia.org/wikipedia/commons/thumb/5/51/Cure_cocktail_bar_New_Orleans_2011.jpg/960px-Cure_cocktail_bar_New_Orleans_2011.jpg"
	],
	"restaurant": [
		"https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f3/Restaurant_room_of_Amantaka_luxury_Resort_%26_Hotel_in_Luang_Prabang_Laos.jpg/960px-Restaurant_room_of_Amantaka_luxury_Resort_%26_Hotel_in_Luang_Prabang_Laos.jpg",
		"https://thumb.wikimedia.org/wikipedia/commons/thumb/8/80/DZ6_0550_A_cozy_dimly_lit_restaurant_interior_with_a_long_reflecting_water_feature_running_past_tables_toward_an_open_kitchen_where_a_chef_works.jpg/960px-DZ6_0550_A_cozy_dimly_lit_restaurant_interior_with_a_long_reflecting_water_feature_running_past_tables_toward_an_open_kitchen_where_a_chef_works.jpg",
		"https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b4/DZ6_2644_Cozy_candlelit_dinner_tables_set_for_an_intimate_evening_at_a_charming_Thai_restaurant.jpg/960px-DZ6_2644_Cozy_candlelit_dinner_tables_set_for_an_intimate_evening_at_a_charming_Thai_restaurant.jpg",
		"https://thumb.wikimedia.org/wikipedia/commons/thumb/3/31/Bistro_Remedios_Interior%2C_May_2025_%283%29.jpg/960px-Bistro_Remedios_Interior%2C_May_2025_%283%29.jpg",
		"https://thumb.wikimedia.org/wikipedia/commons/thumb/1/13/Luna_Trattoria_-_Stierch_02.jpg/960px-Luna_Trattoria_-_Stierch_02.jpg"
	],
	"park": [
		"https://thumb.wikimedia.org/wikipedia/commons/thumb/a/ac/M%C3%BCnster%2C_WestLotto_--_2013_--_3296.jpg/960px-M%C3%BCnster%2C_WestLotto_--_2013_--_3296.jpg",
		"https://thumb.wikimedia.org/wikipedia/commons/thumb/3/32/Park_%C5%9Arodula%2C_Sosnowiec%2C_Jesie%C5%84_2021.jpg/960px-Park_%C5%9Arodula%2C_Sosnowiec%2C_Jesie%C5%84_2021.jpg",
		"https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1f/Lawn_by_St_Breock_residential_home_-_geograph.org.uk_-_6390708.jpg/960px-Lawn_by_St_Breock_residential_home_-_geograph.org.uk_-_6390708.jpg",
		"https://thumb.wikimedia.org/wikipedia/commons/thumb/8/86/Wentworth_Park_1928a.jpg/960px-Wentworth_Park_1928a.jpg",
		"https://thumb.wikimedia.org/wikipedia/commons/thumb/d/dd/Wentworth_Park_Arch.jpg/960px-Wentworth_Park_Arch.jpg"
	],
	"museum": [
		"https://thumb.wikimedia.org/wikipedia/commons/thumb/6/60/Morning%2C_Interior_-_Luce.jpeg/960px-Morning%2C_Interior_-_Luce.jpeg",
		"https://thumb.wikimedia.org/wikipedia/commons/thumb/5/50/Kelvingrove_Art_Gallery_and_Museum_Central_Hall.jpg/960px-Kelvingrove_Art_Gallery_and_Museum_Central_Hall.jpg",
		"https://thumb.wikimedia.org/wikipedia/commons/thumb/9/93/Kelvingrove_Art_Gallery_and_Museum_-_interior_-_2025-04-17_01.jpg/960px-Kelvingrove_Art_Gallery_and_Museum_-_interior_-_2025-04-17_01.jpg",
		"https://thumb.wikimedia.org/wikipedia/commons/thumb/3/36/Kelvingrove_Art_Gallery_and_Museum_East_Court.jpg/960px-Kelvingrove_Art_Gallery_and_Museum_East_Court.jpg",
		"https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f4/General_view_of_one_of_the_halls_of_the_museum._Kelvingrove_Art_Gallery_and_Museum%2C_Glasgow%2C_Scotland.jpg/960px-General_view_of_one_of_the_halls_of_the_museum._Kelvingrove_Art_Gallery_and_Museum%2C_Glasgow%2C_Scotland.jpg"
	],
	"music": [
		"https://thumb.wikimedia.org/wikipedia/commons/thumb/5/58/Musician_performs_on_stage_with_bass_guitar_during_live_concert_in_an_outdoor_venue_at_night.jpg/960px-Musician_performs_on_stage_with_bass_guitar_during_live_concert_in_an_outdoor_venue_at_night.jpg",
		"https://thumb.wikimedia.org/wikipedia/commons/thumb/d/dc/Musician_performs_on_stage_with_electric_guitar_during_live_concert_at_local_venue_in_evening_light.jpg/960px-Musician_performs_on_stage_with_electric_guitar_during_live_concert_at_local_venue_in_evening_light.jpg",
		"https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4d/DFC_5470_A_guitarist_performs_on_stage_under_colorful_lights_at_a_live_music_venue_in_Pattaya_City_Thailand.jpg/960px-DFC_5470_A_guitarist_performs_on_stage_under_colorful_lights_at_a_live_music_venue_in_Pattaya_City_Thailand.jpg",
		"https://thumb.wikimedia.org/wikipedia/commons/thumb/6/64/Musicians_perform_live_on_stage_during_a_concert_at_a_local_venue.jpg/960px-Musicians_perform_live_on_stage_during_a_concert_at_a_local_venue.jpg",
		"https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a4/Enjoying_a_live_rock_concert_at_an_outdoor_venue_with_vibrant_lights_and_enthusiastic_fans.jpg/960px-Enjoying_a_live_rock_concert_at_an_outdoor_venue_with_vibrant_lights_and_enthusiastic_fans.jpg"
	],
	"shop": [
		"https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d4/ArtAmbient_boutique_interior_Arta.jpg/960px-ArtAmbient_boutique_interior_Arta.jpg",
		"https://thumb.wikimedia.org/wikipedia/commons/thumb/2/20/TWG_Tea_shop_entrance_in_Singapore.jpg/960px-TWG_Tea_shop_entrance_in_Singapore.jpg",
		"https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a4/HK_TST_ISQUARE_mall_shop_interior_%E7%B2%BE%E5%B7%A5%E9%8C%B6%E5%B0%88%E9%96%80%E5%BA%97_SEIKO_Boutique_watch_dealer_glass_door.JPG/960px-HK_TST_ISQUARE_mall_shop_interior_%E7%B2%BE%E5%B7%A5%E9%8C%B6%E5%B0%88%E9%96%80%E5%BA%97_SEIKO_Boutique_watch_dealer_glass_door.JPG",
		"https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a0/Former_Katrina_Boutique%3B_Playground_Pier_Shops%3B_Atlantic_City_NJ.jpg/960px-Former_Katrina_Boutique%3B_Playground_Pier_Shops%3B_Atlantic_City_NJ.jpg",
		"https://thumb.wikimedia.org/wikipedia/commons/thumb/8/80/Redbone_Guitar_Boutique_Showroom.jpg/960px-Redbone_Guitar_Boutique_Showroom.jpg"
	],
	"market": [
		"https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f6/Street_market_in_Marsaxlokk_12.jpg/960px-Street_market_in_Marsaxlokk_12.jpg",
		"https://thumb.wikimedia.org/wikipedia/commons/thumb/5/51/Pek_Kio_Market_and_Food_Centre_food_stalls_%2855652%29.jpg/960px-Pek_Kio_Market_and_Food_Centre_food_stalls_%2855652%29.jpg",
		"https://thumb.wikimedia.org/wikipedia/commons/thumb/0/04/Food_stalls_in_Little_Market_Square_in_Krak%C3%B3w%2C_Poland%2C_2019%2C_05.jpg/960px-Food_stalls_in_Little_Market_Square_in_Krak%C3%B3w%2C_Poland%2C_2019%2C_05.jpg",
		"https://thumb.wikimedia.org/wikipedia/commons/thumb/2/25/Food_stalls_in_Little_Market_Square_in_Krak%C3%B3w%2C_Poland%2C_2019%2C_01.jpg/960px-Food_stalls_in_Little_Market_Square_in_Krak%C3%B3w%2C_Poland%2C_2019%2C_01.jpg",
		"https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a8/Food_stalls_in_Little_Market_Square_in_Krak%C3%B3w%2C_Poland%2C_2019%2C_06.jpg/960px-Food_stalls_in_Little_Market_Square_in_Krak%C3%B3w%2C_Poland%2C_2019%2C_06.jpg"
	],
	"place": [
		"https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a7/Manhattan_New_York_City_2009_PD_20091129_009.JPG/960px-Manhattan_New_York_City_2009_PD_20091129_009.JPG",
		"https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3c/Manhattan_New_York_City_2009_PD_20091129_010.JPG/960px-Manhattan_New_York_City_2009_PD_20091129_010.JPG",
		"https://thumb.wikimedia.org/wikipedia/commons/thumb/5/50/West_Thames_Park_td_%282019-01-29%29_053_-_Rector_Street_Pedestrian_Bridge.jpg/960px-West_Thames_Park_td_%282019-01-29%29_053_-_Rector_Street_Pedestrian_Bridge.jpg",
		"https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f2/West_Thames_Park_td_%282019-01-29%29_052_-_Rector_Street_Pedestrian_Bridge.jpg/960px-West_Thames_Park_td_%282019-01-29%29_052_-_Rector_Street_Pedestrian_Bridge.jpg",
		"https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4a/West_Thames_Park_td_%282019-01-29%29_049_-_Rector_Street_Pedestrian_Bridge.jpg/960px-West_Thames_Park_td_%282019-01-29%29_049_-_Rector_Street_Pedestrian_Bridge.jpg"
	]
};
var CATEGORY_POOLS = {
	...COMMONS,
	cafe: [CAFE_PHOTO, ...COMMONS["cafe"]],
	restaurant: [FOOD_PHOTO, ...COMMONS["restaurant"]]
};
var RULES = [
	[/\b(caf[eé]|coffee|espresso|roaster|tea ?house|bakery)\b/i, "cafe"],
	[/\b(bar|pub|tavern|cocktail|brewery|taproom|wine|speakeasy|lounge)\b/i, "bar"],
	[/\b(park|garden|gardens|heath|common|green|beach|square)\b/i, "park"],
	[/\b(museum|gallery|galerie|art centre|art center|exhibition)\b/i, "museum"],
	[/\b(club|venue|hall|jazz|music|concert|theatre|theater|arena|live|records?)\b/i, "music"],
	[/\b(market|food hall|stalls?|bazaar)\b/i, "market"],
	[/\b(shop|store|boutique|books?|vintage)\b/i, "shop"],
	[/\b(restaurant|kitchen|grill|bistro|diner|eatery|food|pizza|sushi|ramen|bbq|suya|jerk)\b/i, "restaurant"]
];
/** Picks a pool key from the place name first (more specific), then the AI category. */
function photoCategory(name, category) {
	for (const [re, key] of RULES) if (re.test(name)) return key;
	const c = (category ?? "").toLowerCase();
	if (c === "cafe") return "cafe";
	if (c === "restaurant") return "restaurant";
	if (c === "venue") return "music";
	if (c === "shop") return "shop";
	for (const [re, key] of RULES) if (re.test(c)) return key;
	return "place";
}
var CITY_GEO = {
	"New York City": {
		lat: 40.7128,
		lng: -74.006,
		aliases: [
			"new york",
			"nyc",
			"manhattan",
			"brooklyn",
			"queens",
			"bronx",
			"staten island"
		]
	},
	London: {
		lat: 51.5074,
		lng: -.1278,
		aliases: ["london"]
	},
	Berlin: {
		lat: 52.52,
		lng: 13.405,
		aliases: ["berlin"]
	},
	Lagos: {
		lat: 6.5244,
		lng: 3.3792,
		aliases: ["lagos"]
	},
	Paris: {
		lat: 48.8566,
		lng: 2.3522,
		aliases: ["paris"]
	},
	Toronto: {
		lat: 43.6532,
		lng: -79.3832,
		aliases: ["toronto"]
	},
	Amsterdam: {
		lat: 52.3676,
		lng: 4.9041,
		aliases: ["amsterdam"]
	},
	Tokyo: {
		lat: 35.6762,
		lng: 139.6503,
		aliases: ["tokyo"]
	},
	Dubai: {
		lat: 25.2048,
		lng: 55.2708,
		aliases: ["dubai"]
	},
	Sydney: {
		lat: -33.8688,
		lng: 151.2093,
		aliases: ["sydney"]
	},
	"San Francisco": {
		lat: 37.7749,
		lng: -122.4194,
		aliases: ["san francisco"]
	}
};
var norm = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[\u2018\u2019`]/g, "'").replace(/&/g, "and").replace(/[^a-z0-9' ]+/g, " ").replace(/\s+/g, " ").trim();
/**
* Strict title match. Spots: exact name, or name + "(disambiguator)".
* Neighborhoods additionally allow "Name, Borough". Names merely contained in a longer title never match.
*/
function titleMatches(title, name, kind) {
	const n = norm(name);
	const raw = title.trim();
	const paren = /^(.*?)\s*\(([^)]*)\)$/.exec(raw);
	if (norm(raw) === n) return true;
	if (paren && norm(paren[1]) === n) return true;
	if (kind === "neighborhood") {
		const comma = raw.indexOf(",");
		if (comma > 0 && norm(raw.slice(0, comma)) === n) return true;
	}
	return false;
}
function km(a, b) {
	const r = (d) => d * Math.PI / 180;
	const dLat = r(b.lat - a.lat), dLng = r(b.lon - a.lng);
	const h = Math.sin(dLat / 2) ** 2 + Math.cos(r(a.lat)) * Math.cos(r(b.lat)) * Math.sin(dLng / 2) ** 2;
	return 12742 * Math.asin(Math.sqrt(h));
}
function isAboutCity(page, city) {
	const geo = CITY_GEO[city];
	const c = page.coordinates?.[0];
	if (geo && c) return km(geo, c) <= 30;
	const text = norm(page.extract ?? "");
	return (geo?.aliases ?? [norm(city)]).some((a) => text.includes(a));
}
var badImage = (s) => /\.svg/i.test(s) || /(flag|logo|map|coat_of_arms|locator|seal_of|icon)/i.test(s);
/** One quick retry on rate limiting (HTTP 429) or a network blip. */
async function retry(fetcher, url) {
	try {
		const r = await fetcher(url);
		if (r.ok || r.status !== 429) return r;
	} catch {}
	await new Promise((ok) => setTimeout(ok, 400));
	return fetcher(url);
}
var API = "https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&redirects=1";
/**
* Returns the main image of the article that strictly matches `name` in `city`, or undefined.
* Step 1 searches for candidate titles; step 2 loads each strictly matching title on its own,
* because multi-page responses drop coordinates/extracts/thumbnails to continuations.
*/
async function strictWikiImage(name, city, kind, fetcher, query = `${name} ${city}`, guesses = []) {
	try {
		const res = await retry(fetcher, `${API}&list=search&srnamespace=0&srlimit=10&srsearch=${encodeURIComponent(query)}`);
		const found = ((res.ok ? await res.json() : {}).query?.search ?? []).map((r) => r.title);
		const candidates = [.../* @__PURE__ */ new Set([...guesses, ...found])].filter((t) => titleMatches(t, name, kind)).slice(0, 3);
		for (const cand of candidates) {
			const r2 = await retry(fetcher, `${API}&titles=${encodeURIComponent(cand)}&prop=pageimages|coordinates|extracts|pageprops&piprop=thumbnail&pithumbsize=1000&exintro=1&explaintext=1&ppprop=disambiguation`);
			if (!r2.ok) continue;
			const d2 = await r2.json();
			const p = Object.values(d2.query?.pages ?? {})[0];
			if (!p || "missing" in p || p.pageprops && "disambiguation" in p.pageprops) continue;
			if (!isAboutCity(p, city)) continue;
			const src = p.thumbnail?.source;
			return src && !badImage(src) ? {
				src,
				title: p.title ?? cand
			} : void 0;
		}
	} catch {}
}
/** Likely article titles, e.g. "Astoria, Queens", tried alongside search results. */
function neighborhoodGuesses(name, borough, city) {
	const g = [];
	if (borough && norm(borough) !== norm(city) && norm(borough) !== norm(name)) g.push(`${name}, ${borough}`);
	g.push(name);
	return g;
}
async function fillNeighborhoodImages(city, neighborhoods, fetcher, used = /* @__PURE__ */ new Set()) {
	for (const n of neighborhoods) if (n.image) used.add(n.image);
	const results = await Promise.all(neighborhoods.map((n) => n.image ? Promise.resolve(void 0) : strictWikiImage(n.name, city, "neighborhood", fetcher, `${n.name} ${city}`, neighborhoodGuesses(n.name, n.borough, city))));
	const cityCount = Math.max(CITY_PHOTOS[city]?.length ?? 2, 1);
	let cityIdx = 0;
	return neighborhoods.map((n, i) => {
		if (n.image) return n;
		const wiki = results[i]?.src;
		if (wiki && !used.has(wiki)) {
			used.add(wiki);
			return {
				...n,
				image: wiki,
				imageAlt: `${n.name}, ${city}`
			};
		}
		for (let tries = 0; tries < cityCount; tries++) {
			const src = cityPhoto(city, cityIdx++);
			if (!used.has(src)) {
				used.add(src);
				return {
					...n,
					image: src,
					imageAlt: `${city} city view`
				};
			}
		}
		return n;
	});
}
/**
* Gives each spot a distinct real photo: Wikipedia search "<spot> <city>", then "<spot>", then a
* rotating per-category pool. `used` is shared with the neighborhood cards so nothing repeats on the page.
*/
async function fillPlaceImages(city, places, fetcher, used = /* @__PURE__ */ new Set()) {
	const results = await Promise.all(places.map(async (p) => {
		return await strictWikiImage(p.name, city, "spot", fetcher) ?? strictWikiImage(p.name, city, "spot", fetcher, p.name);
	}));
	const cursors = {};
	return places.map((p, i) => {
		const wiki = results[i]?.src;
		if (wiki && !used.has(wiki)) {
			used.add(wiki);
			return {
				...p,
				image: wiki,
				imageAlt: `${p.name}, ${city}`
			};
		}
		const key = photoCategory(p.name, p.category);
		const order = [key, ...Object.keys(CATEGORY_POOLS).filter((k) => k !== key)];
		for (const k of order) {
			const pool = CATEGORY_POOLS[k];
			for (let t = 0; t < pool.length; t++) {
				const src = pool[((cursors[k] = (cursors[k] ?? 0) + 1) - 1) % pool.length];
				if (!used.has(src)) {
					used.add(src);
					return {
						...p,
						image: src,
						imageAlt: `${k === "place" ? "Street" : k} in ${city}`
					};
				}
			}
		}
		return p;
	});
}
var outputSchema = objectType({
	summary: stringType(),
	story: stringType(),
	neighborhoods: arrayType(objectType({
		name: stringType(),
		borough: stringType(),
		why: stringType(),
		rentBand: enumType([
			"$",
			"$$",
			"$$$"
		]),
		matched: arrayType(stringType())
	}).strict()),
	places: arrayType(objectType({
		name: stringType(),
		category: enumType([
			"Cafe",
			"Restaurant",
			"Venue",
			"Shop",
			"Place"
		]),
		neighborhood: stringType(),
		reason: stringType()
	}).strict()),
	plan: arrayType(objectType({
		label: stringType(),
		items: arrayType(stringType())
	}).strict())
}).strict();
var SYSTEM_PROMPT = `You are Soft Landing's relocation concierge. Given a destination city and what the user loves, recommend real, well-known neighborhoods and places in that city, drawn from broadly known information about it (local guides, popular venues, widely discussed spots).
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
function userPrompt(city, message, prefs) {
	const chips = (prefs.chips ?? []).join(", ") || "none";
	return [
		`Destination: ${city.name}, ${city.country}`,
		`What the user loves: ${message}`,
		`Preferences: budget=${prefs.budget ?? "unspecified"}, pace=${prefs.pace ?? "unspecified"}, life stage=${prefs.lifeStage ?? "unspecified"}, trip=${prefs.trip ?? "moving"}, extra tastes=${chips}, needs=${(prefs.needs ?? []).join(", ") || "none"}. Favor neighborhoods and places that suit these needs.`
	].join("\n");
}
function tasteLabels(message, prefs) {
	const fromMessage = message.split(/[,;.]+/).map((t) => t.trim().toLowerCase()).filter(Boolean);
	const chips = (prefs.chips ?? []).map((c) => c.toLowerCase());
	return [.../* @__PURE__ */ new Set([...chips, ...fromMessage])];
}
async function generateLlmRecommendations(input) {
	const { city: cityName, message, prefs = {} } = agentInput.parse(input);
	const resolved = resolveCity(cityName);
	if (!resolved) throw new Error("Choose a recognized city before finding matches");
	const city = resolved.city;
	const apiKey = process.env["LOVABLE_API_KEY"];
	if (!apiKey) throw new Error("Lovable AI is not configured");
	const { provider } = createLovableAiGatewayResponses(apiKey);
	const start = performance.now();
	const result = streamText({
		model: provider.responses("openai/gpt-6-astra"),
		system: SYSTEM_PROMPT,
		messages: [{
			role: "user",
			content: userPrompt(city, message, prefs)
		}],
		output: output_exports.object({ schema: outputSchema }),
		providerOptions: { openai: {
			store: false,
			forceReasoning: true,
			reasoningEffort: "medium",
			reasoningSummary: "auto",
			include: ["reasoning.encrypted_content"]
		} }
	});
	let output;
	try {
		output = await result.output;
	} catch (error) {
		if (NoObjectGeneratedError.isInstance(error) && error.text) throw new Error(error.text.replace(/\s+/g, " ").slice(0, 200));
		throw error;
	}
	const aiMs = performance.now() - start;
	const r = buildLlmResult({
		city: city.name,
		tastes: tasteLabels(message, prefs),
		prefs,
		output,
		aiMs
	});
	const wikiFetch = (url) => fetch(url, {
		headers: { "User-Agent": "SoftLanding/1.0 (softlandingapp.lovable.app)" },
		signal: AbortSignal.timeout(3e3)
	});
	const used = /* @__PURE__ */ new Set();
	const [neighborhoods, places] = await Promise.all([fillNeighborhoodImages(r.city, r.neighborhoods, wikiFetch, used), fillPlaceImages(r.city, r.places, wikiFetch, used)]);
	r.neighborhoods = neighborhoods;
	r.places = places;
	return r;
}
//#endregion
export { generateLlmRecommendations };
