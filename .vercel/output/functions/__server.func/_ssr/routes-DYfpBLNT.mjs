import { r as __toESM } from "../_runtime.mjs";
import { _ as CITY_DATA, d as HERO_PHOTOS, f as cityPhoto, g as searchCities, h as resolveCity, i as agentInput, l as DEFAULT_PANEL_PHOTO, m as flagForCountry, n as NEED_LABELS, o as runSampleAgent, p as CITIES, r as TASTE_CHIPS, t as NEEDS } from "./qloo-CgzhBWKg.mjs";
import { G as isRedirect, S as ClientOnly, d as require_react_dom, x as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as TSS_SERVER_FUNCTION, l as createServerFn } from "./createServerFn-DDDJMFWM.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { t as getServerFnById } from "../__23tanstack-start-server-fn-resolver-11LbKawj.mjs";
import { t as supabase } from "./client-B31y_5dx.mjs";
import { S as ArrowRight, _ as Cpu, a as Square, b as Check, c as Send, d as Mic, f as MicOff, g as Download, h as Earth, i as Utensils, l as Navigation, m as MapPin, n as VolumeX, o as ShoppingBag, p as Menu, r as Volume2, s as Share2, t as X, u as Music, v as Coffee, x as ArrowUpRight, y as ChevronDown } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DYfpBLNT.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_react_dom = require_react_dom();
function useServerFn(serverFn) {
	const router = useRouter();
	return import_react.useCallback(async (...args) => {
		try {
			const res = await serverFn(...args);
			if (isRedirect(res)) throw res;
			return res;
		} catch (err) {
			if (isRedirect(err)) {
				err.options._fromLocation = router.stores.location.get();
				return router.navigate(router.resolveRedirect(err).options);
			}
			throw err;
		}
	}, [router, serverFn]);
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var getQlooRecommendations = createServerFn({ method: "POST" }).inputValidator((input) => agentInput.parse(input)).handler(createSsrRpc("1bdf63c349cd204946cfc9c8c671575abec663e9b2baa7e2d9a921505e191444"));
var getLlmRecommendations = createServerFn({ method: "POST" }).inputValidator((input) => agentInput.parse(input)).handler(createSsrRpc("185f8177267c95c35b22791eb5a5d451f1f93a2183ced7bcbe3ebed005e40de9"));
async function runAgent(message, mode = "qloo", onStep, city, prefs) {
	if (!city) throw new Error("Pick a city to see your matches");
	if (mode === "qloo") {
		const result = await getQlooRecommendations({ data: {
			city,
			message,
			prefs
		} });
		result.steps.forEach((step, index) => onStep?.(step, index));
		return result;
	}
	try {
		const result = await getLlmRecommendations({ data: {
			city,
			message,
			prefs
		} });
		result.steps.forEach((step, index) => onStep?.(step, index));
		return result;
	} catch (error) {
		const detail = error instanceof Error ? error.message : String(error);
		const fallback = await runSampleAgent(message, mode, onStep, city, prefs);
		fallback.steps.unshift({
			label: `Lovable AI call failed: ${detail.slice(0, 180)} — showed built-in samples`,
			ms: 0
		});
		return fallback;
	}
}
function Button({ className = "", variant = "pill", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		...props,
		className: `${variant === "pill" ? "pill-button" : variant === "ghost" ? "ghost-button" : variant === "icon" ? "icon-button" : "plain-button"} ${className}`
	});
}
function CityPicker({ value, onResolve, onSearch, compact = false, id }) {
	const [query, setQuery] = (0, import_react.useState)("");
	const [open, setOpen] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const boxRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const close = (e) => {
			if (!boxRef.current?.contains(e.target)) setOpen(false);
		};
		document.addEventListener("mousedown", close);
		return () => document.removeEventListener("mousedown", close);
	}, []);
	const pick = (name, search = false) => {
		let r = resolveCity(name);
		if (!r) {
			const top = searchCities(name)[0];
			if (top) r = resolveCity(top.name);
		}
		if (!r) {
			setError("We couldn't locate that city. Check the spelling or choose a suggestion.");
			return;
		}
		onResolve(r);
		if (search) onSearch?.(r);
		setError("");
		setQuery("");
		setOpen(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: boxRef,
		className: `relative min-w-0 ${compact ? "max-w-52" : "w-full"}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "city-picker-input",
				children: [
					value && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "emoji shrink-0",
						"aria-hidden": "true",
						children: flagForCountry(value.city.country)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id,
						"aria-label": "Destination city",
						value: query,
						onChange: (e) => {
							setQuery(e.target.value);
							setError("");
							setOpen(true);
						},
						onFocus: () => setOpen(true),
						onKeyDown: (e) => {
							if (e.key === "Enter") {
								e.preventDefault();
								pick(searchCities(query)[0]?.name ?? query, true);
							}
							if (e.key === "Escape") setOpen(false);
						},
						placeholder: value?.city.name ?? "Pick a city",
						autoComplete: "off"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-3 w-3 shrink-0 text-muted-foreground" })
				]
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				role: "alert",
				className: "city-picker-dropdown absolute left-0 top-full z-50 mt-3 w-72 max-w-[80vw] rounded-xl p-3 text-xs text-foreground",
				children: error
			}),
			open && !error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "city-picker-dropdown absolute left-0 top-full z-50 mt-3 max-h-64 w-72 max-w-[80vw] overflow-auto rounded-xl p-2 text-foreground",
				children: query.trim() && searchCities(query).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "plain",
					type: "button",
					onClick: () => pick(query),
					className: "w-full rounded-lg p-3 text-left text-xs",
					children: [
						"Use “",
						query.trim(),
						"”"
					]
				}) : (query.trim() ? searchCities(query) : CITIES.slice(0, 8)).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "plain",
					type: "button",
					onClick: () => pick(c.name),
					className: "flex w-full items-start gap-2 rounded-lg p-3 text-left text-xs hover:bg-secondary",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-4 w-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [c.name, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
						className: "block text-muted-foreground",
						children: c.country
					})] })]
				}, c.name))
			})
		]
	});
}
function useSpeechRecognition(onFinal) {
	const [supported, setSupported] = (0, import_react.useState)(null);
	const [listening, setListening] = (0, import_react.useState)(false);
	const [transcript, setTranscript] = (0, import_react.useState)("");
	const recRef = (0, import_react.useRef)(null);
	const finalRef = (0, import_react.useRef)(onFinal);
	finalRef.current = onFinal;
	(0, import_react.useEffect)(() => {
		const w = window;
		const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
		setSupported(!!SR);
		if (!SR) return;
		const rec = new SR();
		rec.lang = "en-US";
		rec.interimResults = true;
		rec.continuous = false;
		let latest = "";
		rec.onresult = (e) => {
			latest = Array.from(e.results).map((r) => r[0].transcript).join("");
			setTranscript(latest);
		};
		rec.onend = () => {
			setListening(false);
			if (latest.trim()) finalRef.current(latest.trim());
			latest = "";
			setTranscript("");
		};
		rec.onerror = () => setListening(false);
		recRef.current = rec;
		return () => rec.abort();
	}, []);
	return {
		supported,
		listening,
		transcript,
		start: (0, import_react.useCallback)(() => {
			if (!recRef.current) return;
			window.speechSynthesis?.cancel();
			setTranscript("");
			try {
				recRef.current.start();
				setListening(true);
			} catch {}
		}, []),
		stop: (0, import_react.useCallback)(() => recRef.current?.stop(), [])
	};
}
function useSpeechSynthesis() {
	const [speaking, setSpeaking] = (0, import_react.useState)(false);
	const current = (0, import_react.useRef)(null);
	const poll = (0, import_react.useRef)(null);
	const stopPoll = (0, import_react.useCallback)(() => {
		if (poll.current) clearInterval(poll.current);
		poll.current = null;
	}, []);
	const done = (0, import_react.useCallback)(() => {
		stopPoll();
		current.current = null;
		setSpeaking(false);
	}, [stopPoll]);
	const speak = (0, import_react.useCallback)((text) => {
		const s = typeof window !== "undefined" ? window.speechSynthesis : void 0;
		if (!s) return;
		s.cancel();
		stopPoll();
		const u = new SpeechSynthesisUtterance(text);
		u.rate = 1.02;
		u.onend = () => current.current === u && done();
		u.onerror = () => current.current === u && done();
		current.current = u;
		setSpeaking(true);
		s.speak(u);
		let idle = 0;
		poll.current = setInterval(() => {
			idle = s.speaking || s.pending ? 0 : idle + 1;
			if (idle >= 2) done();
		}, 600);
	}, [done, stopPoll]);
	const cancel = (0, import_react.useCallback)(() => {
		if (typeof window !== "undefined") window.speechSynthesis?.cancel();
		done();
	}, [done]);
	(0, import_react.useEffect)(() => {
		const onHide = () => cancel();
		window.addEventListener("pagehide", onHide);
		return () => {
			window.removeEventListener("pagehide", onHide);
			cancel();
		};
	}, [cancel]);
	return {
		speaking,
		speak,
		cancel
	};
}
/** Joins label parts with " · ", dropping empty parts and any part equal (case-insensitively) to an earlier one. */
function joinParts(...parts) {
	const seen = /* @__PURE__ */ new Set();
	const out = [];
	for (const p of parts) {
		const t = (p ?? "").trim();
		const k = t.toLowerCase();
		if (!t || seen.has(k)) continue;
		seen.add(k);
		out.push(t);
	}
	return out.join(" · ");
}
/** The area line for a pick/neighborhood: the borough unless it just repeats the city or neighborhood. */
function areaLabel(borough, ...others) {
	const b = (borough ?? "").trim();
	return b && !others.some((o) => o.trim().toLowerCase() === b.toLowerCase()) ? b : "";
}
function CityMap({ spots, selectedId, focusTick, onSelect }) {
	const selected = spots.find((s) => s.id === selectedId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "map-wrap",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClientOnly, { fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "leaflet-map map-skeleton",
			"aria-hidden": "true"
		}) }), selected && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "map-card",
			role: "dialog",
			"aria-label": `${selected.name} on the map`,
			children: [selected.image && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: selected.image,
				alt: selected.imageAlt ?? selected.name,
				className: "map-card-photo"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-2xl leading-tight",
						children: selected.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-[11px] text-muted-foreground",
						children: joinParts(selected.area, selected.kind === "neighborhood" ? "Neighborhood" : "Spot")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						className: "map-directions",
						href: `https://www.google.com/maps/dir/?api=1&destination=${selected.lat},${selected.lng}&travelmode=transit`,
						target: "_blank",
						rel: "noopener noreferrer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigation, { className: "h-3.5 w-3.5" }), " Get Directions"]
					})
				]
			})]
		})]
	});
}
var traveler_default = "/assets/traveler-C6ftmuMD.png";
var INK = "#151513";
var GREEN = "#53634c";
var SERIF = "\"Instrument Serif\", Georgia, serif";
var SANS = "\"Inter\", system-ui, sans-serif";
function rounded(ctx, x, y, w, h, r) {
	ctx.beginPath();
	ctx.moveTo(x + r, y);
	ctx.arcTo(x + w, y, x + w, y + h, r);
	ctx.arcTo(x + w, y + h, x, y + h, r);
	ctx.arcTo(x, y + h, x, y, r);
	ctx.arcTo(x, y, x + w, y, r);
	ctx.closePath();
}
function fitText(ctx, text, max, size, family) {
	let s = size;
	do {
		ctx.font = `${s}px ${family}`;
		if (ctx.measureText(text).width <= max) break;
		s -= 4;
	} while (s > 40);
	return s;
}
/** Loads an image with CORS enabled; resolves null on any failure. */
function loadImage(src) {
	if (!src) return Promise.resolve(null);
	return new Promise((resolve) => {
		const img = new Image();
		img.crossOrigin = "anonymous";
		img.decoding = "async";
		const t = setTimeout(() => resolve(null), 8e3);
		img.onload = () => {
			clearTimeout(t);
			resolve(img);
		};
		img.onerror = () => {
			clearTimeout(t);
			resolve(null);
		};
		img.src = src;
	});
}
function drawCover(ctx, img, size) {
	const scale = Math.max(size / img.naturalWidth, size / img.naturalHeight);
	const w = img.naturalWidth * scale;
	const h = img.naturalHeight * scale;
	ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
}
/** True when the canvas can still be exported (i.e. not tainted by a cross-origin image). */
function canExport(ctx) {
	try {
		ctx.getImageData(0, 0, 1, 1);
		return true;
	} catch {
		return false;
	}
}
function drawFallbackBg(ctx, size) {
	const g = ctx.createLinearGradient(0, 0, size * .6, size);
	g.addColorStop(0, GREEN);
	g.addColorStop(.55, "#2b3328");
	g.addColorStop(1, INK);
	ctx.fillStyle = g;
	ctx.fillRect(0, 0, size, size);
}
/**
* Draws the locked pick as a 1080×1080 rounded card matching the in-app popup:
* destination photo background (gradient fallback if it can't be drawn, e.g. CORS), dark shade, white type.
*/
async function renderPickCard(pick) {
	const size = 1080;
	const [photo, character] = await Promise.all([loadImage(pick.image), loadImage(traveler_default)]);
	try {
		await document.fonts?.ready;
	} catch {}
	const draw = (usePhoto, useCharacter) => {
		const canvas = document.createElement("canvas");
		canvas.width = size;
		canvas.height = size;
		const ctx = canvas.getContext("2d");
		if (!ctx) throw new Error("Canvas not supported");
		ctx.clearRect(0, 0, size, size);
		ctx.save();
		rounded(ctx, 0, 0, size, size, 96);
		ctx.clip();
		if (usePhoto && photo) drawCover(ctx, photo, size);
		else drawFallbackBg(ctx, size);
		const shade = ctx.createLinearGradient(0, 0, 0, size);
		shade.addColorStop(0, "rgba(0,0,0,0.78)");
		shade.addColorStop(.45, "rgba(0,0,0,0.35)");
		shade.addColorStop(1, "rgba(0,0,0,0.72)");
		ctx.fillStyle = shade;
		ctx.fillRect(0, 0, size, size);
		const x = 90;
		const w = 900;
		ctx.fillStyle = "rgba(255,255,255,0.8)";
		ctx.font = `600 26px ${SANS}`;
		ctx.fillText(`${pick.neighborhood} it is`.toUpperCase(), x, 140);
		const nameSize = fitText(ctx, pick.neighborhood, w, 140, SERIF);
		let y = 150 + nameSize;
		ctx.fillStyle = "#ffffff";
		ctx.font = `${nameSize}px ${SERIF}`;
		ctx.fillText(pick.neighborhood, x, y);
		y += 80;
		ctx.font = `italic 72px ${SERIF}`;
		ctx.fillStyle = "rgba(255,255,255,0.92)";
		ctx.fillText(pick.city, x, y);
		const area = areaLabel(pick.borough, pick.city, pick.neighborhood);
		if (area) {
			y += 50;
			ctx.fillStyle = "rgba(255,255,255,0.72)";
			ctx.font = `500 26px ${SANS}`;
			ctx.fillText(area.toUpperCase(), x, y);
		}
		if (pick.score !== null) {
			y += 90;
			const label = `${pick.score}% match`;
			ctx.font = `600 34px ${SANS}`;
			const bw = ctx.measureText(label).width + 100;
			rounded(ctx, x, y - 52, bw, 76, 38);
			ctx.fillStyle = "rgba(255,255,255,0.18)";
			ctx.fill();
			ctx.fillStyle = "#9fb592";
			ctx.beginPath();
			ctx.arc(128, y - 14, 9, 0, Math.PI * 2);
			ctx.fill();
			ctx.fillStyle = "#ffffff";
			ctx.fillText(label, 152, y);
		}
		y += 44;
		ctx.font = `500 28px ${SANS}`;
		let cx = x;
		const chipMax = 648;
		for (const t of pick.tastes.slice(0, 4)) {
			const text = t.charAt(0).toUpperCase() + t.slice(1);
			const tw = ctx.measureText(text).width + 52;
			if (cx + tw > chipMax) break;
			rounded(ctx, cx, y, tw, 60, 30);
			ctx.fillStyle = "rgba(0,0,0,0.25)";
			ctx.fill();
			ctx.strokeStyle = "rgba(255,255,255,0.55)";
			ctx.lineWidth = 2;
			ctx.stroke();
			ctx.fillStyle = "#ffffff";
			ctx.fillText(text, cx + 26, y + 40);
			cx += tw + 14;
		}
		if (useCharacter && character) {
			const ch = size * .45;
			const cw = character.naturalWidth / character.naturalHeight * ch;
			ctx.save();
			ctx.shadowColor = "rgba(0,0,0,0.45)";
			ctx.shadowBlur = 30;
			ctx.shadowOffsetY = 10;
			ctx.drawImage(character, size - cw - 60, 544, cw, ch);
			ctx.restore();
		}
		ctx.fillStyle = "#ffffff";
		ctx.font = `44px ${SERIF}`;
		ctx.fillText("Soft Landing", x, 960);
		ctx.fillStyle = "rgba(255,255,255,0.75)";
		ctx.font = `500 24px ${SANS}`;
		ctx.fillText("softlandingapp.lovable.app", x, 1e3);
		ctx.restore();
		return {
			canvas,
			ctx
		};
	};
	let { canvas, ctx } = draw(true, true);
	if (!canExport(ctx)) ({canvas, ctx} = draw(false, true));
	if (!canExport(ctx)) ({canvas, ctx} = draw(false, false));
	return await new Promise((res, rej) => canvas.toBlob((b) => b ? res(b) : rej(/* @__PURE__ */ new Error("Could not create image")), "image/png"));
}
function pickFileName(pick) {
	return `soft-landing-${pick.neighborhood}-${pick.city}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "") + ".png";
}
/** Shares the card with the Web Share API when files are supported, otherwise downloads it. */
async function sharePickCard(pick) {
	const blob = await renderPickCard(pick);
	const name = pickFileName(pick);
	const file = typeof File !== "undefined" ? new File([blob], name, { type: "image/png" }) : null;
	const text = `I'm landing in ${pick.neighborhood}, ${pick.city}${pick.score !== null ? ` — ${pick.score}% match` : ""}. Found with Soft Landing.`;
	if (file && navigator.canShare?.({ files: [file] })) try {
		await navigator.share({
			files: [file],
			title: "My Soft Landing pick",
			text
		});
		return "shared";
	} catch (e) {
		if (e instanceof DOMException && e.name === "AbortError") return "cancelled";
	}
	downloadBlob(blob, name);
	return "downloaded";
}
function downloadBlob(blob, name) {
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = name;
	document.body.appendChild(a);
	a.click();
	a.remove();
	setTimeout(() => URL.revokeObjectURL(url), 2e3);
}
var KEY = "soft-landing:locked-pick";
var EVENT = "soft-landing:locked-pick-change";
function readLockedPick() {
	try {
		const v = JSON.parse(localStorage.getItem(KEY) ?? "null");
		return v && typeof v.neighborhood === "string" && typeof v.city === "string" ? v : null;
	} catch {
		return null;
	}
}
function writeLockedPick(pick) {
	try {
		if (pick) localStorage.setItem(KEY, JSON.stringify(pick));
		else localStorage.removeItem(KEY);
	} catch {}
	window.dispatchEvent(new Event(EVENT));
}
function useLockedPick() {
	const [pick, setPick] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		const sync = () => setPick(readLockedPick());
		sync();
		window.addEventListener(EVENT, sync);
		window.addEventListener("storage", sync);
		return () => {
			window.removeEventListener(EVENT, sync);
			window.removeEventListener("storage", sync);
		};
	}, []);
	return [pick, (0, import_react.useCallback)((p) => writeLockedPick(p), [])];
}
function toPick(r, n) {
	return {
		city: r.city,
		neighborhood: n.name,
		borough: n.borough,
		score: n.scoreAvailable === false ? null : Math.min(99, n.score),
		tastes: [.../* @__PURE__ */ new Set([...n.matched, ...n.tags])].slice(0, 4),
		rentRange: n.rentRange,
		image: n.image && n.image.length ? n.image : cityPhoto(r.city, 0),
		lockedAt: (/* @__PURE__ */ new Date()).toISOString()
	};
}
var lockLabel = (neighborhood) => `${neighborhood} it is`;
function useCardActions(pick) {
	const [status, setStatus] = (0, import_react.useState)("");
	const share = async () => {
		if (!pick) return;
		setStatus("Making your card…");
		try {
			const r = await sharePickCard(pick);
			setStatus(r === "shared" ? "Shared!" : r === "downloaded" ? "Card downloaded" : "");
		} catch {
			setStatus("Could not make the card. Please try again.");
		}
	};
	const download = async () => {
		if (!pick) return;
		try {
			downloadBlob(await renderPickCard(pick), pickFileName(pick));
			setStatus("Card downloaded");
		} catch {
			setStatus("Could not make the card. Please try again.");
		}
	};
	return {
		status,
		share,
		download
	};
}
function LockButton({ r, n, className = "" }) {
	const [pick, lock] = useLockedPick();
	const [open, setOpen] = (0, import_react.useState)(false);
	const locked = pick?.city === r.city && pick.neighborhood === n.name;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
		variant: "pill",
		"aria-pressed": locked,
		"aria-label": locked ? `${n.name} is my pick (view card)` : `${lockLabel(n.name)}: pick it in ${r.city}`,
		onClick: () => {
			if (!locked) lock(toPick(r, n));
			setOpen(true);
		},
		className: `w-full justify-center py-2.5 text-xs ${locked ? "bg-primary text-primary-foreground" : "border"} ${className}`,
		children: [locked && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5" }), locked ? `My pick: ${n.name}` : lockLabel(n.name)]
	}), open && locked && pick && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PickSheet, {
		pick,
		onClose: () => setOpen(false),
		onChange: () => {
			lock(null);
			setOpen(false);
		}
	})] });
}
/** Popup card for the locked pick: destination photo background, spring-in bottom sheet. */
function PickSheet({ pick, onClose, onChange }) {
	const { status, share, download } = useCardActions(pick);
	const [photoOk, setPhotoOk] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		const onKey = (e) => e.key === "Escape" && onClose();
		window.addEventListener("keydown", onKey);
		const prev = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			window.removeEventListener("keydown", onKey);
			document.body.style.overflow = prev;
		};
	}, [onClose]);
	return (0, import_react_dom.createPortal)(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "pick-sheet-backdrop",
		onClick: onClose,
		"data-testid": "pick-sheet",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			role: "dialog",
			"aria-modal": "true",
			"aria-label": `Your pick: ${pick.neighborhood}, ${pick.city}`,
			className: "pick-sheet",
			onClick: (e) => e.stopPropagation(),
			children: [
				pick.image && photoOk ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: pick.image,
					alt: "",
					className: "pick-sheet-photo",
					onError: () => setPhotoOk(false)
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pick-sheet-photo pick-sheet-fallback" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pick-sheet-shade" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": "Close",
					onClick: onClose,
					className: "absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-black/40 text-white",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: "/assets/traveler-C6ftmuMD.png",
					alt: "",
					"data-slot": "character",
					className: "pick-sheet-character"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative z-[2] p-6 pt-8 text-white sm:p-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "eyebrow text-white/80",
							children: lockLabel(pick.neighborhood)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-3 font-display text-5xl leading-[0.95] sm:text-6xl",
							children: pick.neighborhood
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-display text-3xl italic text-white/90",
							children: pick.city
						}),
						areaLabel(pick.borough, pick.city, pick.neighborhood) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "eyebrow mt-2 text-white/70",
							children: areaLabel(pick.borough, pick.city, pick.neighborhood)
						}),
						pick.score !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm backdrop-blur",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "match-dot" }),
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [pick.score, "%"] }),
								" match"
							]
						}),
						pick.tastes.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-4 flex max-w-[22rem] flex-wrap gap-2",
							"aria-label": "Top tastes",
							children: pick.tastes.slice(0, 4).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: "rounded-full border border-white/40 bg-black/20 px-3 py-1 text-xs",
								children: t.charAt(0).toUpperCase() + t.slice(1)
							}, t))
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative z-[2] mt-auto flex w-[58%] flex-col items-start gap-2 p-6 sm:p-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "pill",
							className: "bg-white py-2.5 text-xs text-black",
							onClick: share,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "h-3.5 w-3.5" }), " Share my pick"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-medium border border-white/70 bg-black/35 text-white backdrop-blur",
							onClick: download,
							"aria-label": "Save image",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5" }), " Save image"]
						}),
						onChange && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "px-1 py-2 text-xs text-white/85 underline underline-offset-4",
							onClick: onChange,
							children: "Change pick"
						}),
						status && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							role: "status",
							className: "text-xs text-white/80",
							children: status
						})
					]
				})
			]
		})
	}), document.body);
}
function LockedBanner({ city }) {
	const [pick, lock] = useLockedPick();
	const { status, share, download } = useCardActions(pick);
	if (!pick || pick.city !== city) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "animate-rise rounded-2xl bg-card p-5 sm:p-6",
		"aria-label": "Your locked pick",
		"data-testid": "locked-banner",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "eyebrow flex items-center gap-2 text-muted-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "match-dot" }),
					" ",
					lockLabel(pick.neighborhood)
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex flex-wrap items-end justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-4xl leading-tight",
					children: pick.neighborhood
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "eyebrow mt-1 text-muted-foreground",
					children: joinParts(pick.city, pick.borough, pick.score !== null ? `${pick.score}% match` : "")
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					"data-slot": "pick-actions",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "pill",
							className: "bg-primary py-2.5 text-xs text-primary-foreground",
							onClick: share,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "h-3.5 w-3.5" }), " Share my pick"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "pill",
							className: "border py-2.5 text-xs",
							onClick: download,
							"aria-label": "Download pick card",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5" }), " Save image"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "pill",
							className: "border py-2.5 text-xs",
							onClick: () => lock(null),
							children: "Change pick"
						})
					]
				})]
			}),
			status && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				role: "status",
				className: "mt-3 text-xs text-muted-foreground",
				children: status
			})
		]
	});
}
var cap = (t) => t.charAt(0).toUpperCase() + t.slice(1);
var RENT_FIT = {
	$: "Easy on a tight budget",
	$$: "Fits a mid budget",
	$$$: "Needs a bigger budget"
};
function budgetFit(n) {
	return RENT_FIT[n.rent] ?? "Budget fit unknown";
}
function topSpots(r, n) {
	return r.places.filter((p) => p.neighborhood === n.name).slice(0, 3).map((p) => p.name);
}
function tasteSignals(n) {
	return [.../* @__PURE__ */ new Set([...n.matched, ...n.tags])].slice(0, 5);
}
function Compare({ r }) {
	const names = r.neighborhoods.map((n) => n.name);
	const [a, setA] = (0, import_react.useState)(names[0] ?? "");
	const [b, setB] = (0, import_react.useState)(names[1] ?? "");
	(0, import_react.useEffect)(() => {
		setA(names[0] ?? "");
		setB(names[1] ?? "");
	}, [names.join("|")]);
	if (names.length < 2) return null;
	const pair = [a, b].map((x) => r.neighborhoods.find((n) => n.name === x)).filter(Boolean);
	const rows = [
		{
			label: "Match",
			value: (n) => n.scoreAvailable === false ? "Not scored" : `${Math.min(99, n.score)}%`
		},
		{
			label: "Budget fit",
			value: (n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [budgetFit(n), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "block text-muted-foreground",
				children: n.rentRange
			})] })
		},
		{
			label: "Vibe",
			value: (n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "flex flex-wrap gap-1.5",
				children: tasteSignals(n).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: `outline-tag ${n.matched.includes(t) ? "bg-secondary" : ""}`,
					children: cap(t)
				}, t))
			})
		},
		{
			label: "Top spots",
			value: (n) => {
				const s = topSpots(r, n);
				return s.length ? s.join(", ") : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-muted-foreground",
					children: n.why
				});
			}
		}
	];
	const select = (value, set, other, aria) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
		"aria-label": aria,
		value,
		onChange: (e) => set(e.target.value),
		className: "w-full min-w-0 rounded-full border bg-card px-4 py-3 font-display text-lg",
		children: names.map((nm) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
			value: nm,
			disabled: nm === other,
			children: nm
		}, nm))
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-2xl border p-5 sm:p-6",
		"aria-label": "Compare neighborhoods",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "eyebrow text-muted-foreground",
				children: "Side by side"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "mt-3 font-display text-3xl sm:text-4xl",
				children: ["Compare ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "two." })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid grid-cols-[minmax(0,5rem)_1fr_1fr] gap-3 sm:grid-cols-[8rem_1fr_1fr]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}),
					select(a, setA, b, "First neighborhood"),
					select(b, setB, a, "Second neighborhood"),
					rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "contents",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "eyebrow border-t pt-3 text-[10px] text-muted-foreground",
							children: row.label
						}), pair.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "min-w-0 border-t pt-3 text-[13px] leading-relaxed",
							"data-testid": `compare-${row.label}`,
							children: row.value(n)
						}, n.name + row.label))]
					}, row.label)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}),
					pair.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "min-w-0 border-t pt-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockButton, {
							r,
							n,
							short: true,
							className: "px-3"
						})
					}, n.name + "lock"))
				]
			})
		]
	});
}
var CITY_FLAVOR = {
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
	"Los Angeles": "its lively nightlife and taco trucks"
};
var list = (xs) => xs.length <= 1 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`;
/** Builds a 2–4 sentence, natural-language explanation of how the picks were made. */
function buildStory(r) {
	const [a, b, c] = r.neighborhoods;
	const tastes = [...new Set(r.neighborhoods.flatMap((n) => n.matched))].slice(0, 3).map((t) => t.toLowerCase());
	const flavor = CITY_FLAVOR[r.city];
	const s = [];
	s.push(flavor ? `${r.city} is known for ${flavor}.` : `${r.city} has a little of everything, so we started from what you love.`);
	if (a) {
		const why = a.why ? ` ${a.why.trim().replace(/([^.!?])$/, "$1.")}` : "";
		s.push(`${tastes.length ? `With your love of ${list(tastes)}, we` : "We"} leaned toward ${a.name}.${why}`);
	}
	const rest = [b, c].filter(Boolean).map((n) => n.name);
	if (rest.length) s.push(r.source === "qloo" ? `${list(rest)} came close behind, ranked on Qloo's taste signals${r.places.length ? ` for ${r.places.length} nearby spots` : ""}.` : `${list(rest)} came close behind as strong second options.`);
	return s.slice(0, 4).join(" ");
}
function spotId(kind, name) {
	return `${kind}:${name}`;
}
function Collapsible({ title, children }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			variant: "plain",
			onClick: () => setOpen(!open),
			"aria-expanded": open,
			className: "flex w-full items-center justify-between text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cpu, { className: "h-4 w-4" }), title]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: `h-4 w-4 transition-transform ${open ? "rotate-180" : ""}` })]
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-5 border-t pt-5",
			children
		})]
	});
}
function StepList({ steps, pending, pendingText }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
		className: "space-y-3 text-sm",
		children: [steps.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: "animate-rise flex items-start gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "mt-0.5 h-4 w-4 shrink-0 text-success" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "flex-1",
					children: s.label
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-xs text-muted-foreground",
					children: [(s.ms / 1e3).toFixed(2), "s"]
				})
			]
		}, i)), pending && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: "flex items-center gap-3 text-muted-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-4 w-4 animate-spin rounded-full border border-foreground border-t-transparent" }), pendingText ?? "Finding your corner of the city…"]
		})]
	});
}
var label = (t) => t.charAt(0).toUpperCase() + t.slice(1);
var FIT_LINES = {
	"Bed-Stuy": "Brownstones, bold flavors, and a deep music scene.",
	Harlem: "Live jazz and West African flavors on your doorstep.",
	"Crown Heights": "Caribbean comfort with room in your budget.",
	Astoria: "Quiet café mornings and independent cinema.",
	Williamsburg: "Specialty coffee meets an indie creative scene.",
	"Jackson Heights": "A world of flavors at neighborhood prices.",
	"Lower East Side": "Cinema, streetwear, and nights that run late.",
	"Park Slope": "Leafy streets, bookshops, and slow mornings.",
	Peckham: "Bold flavors and music with a community heartbeat.",
	Hackney: "Independent cinema, great coffee, and warehouse gigs.",
	Hampstead: "Village lanes and unhurried bookshop afternoons.",
	"Little Jamaica": "Reggae, Caribbean flavors, and real community.",
	"Kensington Market": "Vintage finds and affordable café afternoons.",
	"The Annex": "Bookshops and cinema among Victorian homes.",
	Neukölln: "Canal-side evenings and affordable food discoveries.",
	Kreuzberg: "Street art, late bites, and a music-first spirit.",
	"Prenzlauer Berg": "Leafy squares and leisurely café Sundays.",
	"Al Karama": "South Asian flavors without the big-city price tag.",
	"Jumeirah Lake Towers": "Lakeside coffee with nightlife close by.",
	"Al Barsha": "A calmer base with cafés and cinema nearby.",
	Yaba: "Creative energy, local flavors, and friendly cafés.",
	"Lekki Phase 1": "Beachside nights with an Afrobeats soundtrack.",
	"Ikeja GRA": "Leafy streets and a quieter everyday rhythm."
};
function NeighborhoodCard({ n, city, index = 0, qloo = false, onClick }) {
	const [broken, setBroken] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setBroken(false), [n.image]);
	const tags = [.../* @__PURE__ */ new Set([...n.matched, ...n.tags])].slice(0, 3);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: `neighborhood-card min-w-0 ${onClick ? "cursor-pointer" : ""}`,
		"data-index": index,
		...onClick ? {
			role: "button",
			tabIndex: 0,
			onClick,
			onKeyDown: (e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					onClick();
				}
			}
		} : {},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "neighborhood-image-wrap",
				children: [
					n.image && !broken ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: n.image,
						alt: n.imageAlt ? `${n.imageAlt}, ${n.name}` : n.name,
						className: "neighborhood-photo",
						loading: "lazy",
						decoding: "async",
						onError: () => setBroken(true)
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-full w-full place-items-center p-6 text-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-3xl",
							children: n.name
						})
					}),
					n.scoreAvailable !== false && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "match-badge",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "match-dot" }),
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [Math.min(99, n.score), "%"] }),
							" match"
						]
					}),
					n.image && !broken && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "photo-credit",
						children: [n.imageAlt ?? "Photo", qloo ? " · Qloo" : ""]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "sr-only",
						children: city
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 flex items-start justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "neighborhood-name",
					children: n.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "mt-2 h-4 w-4 shrink-0" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "eyebrow mt-2 text-muted-foreground",
				children: joinParts(city, n.borough)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 flex flex-wrap gap-1.5",
				children: tags.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "outline-tag",
					children: label(t)
				}, t))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-[13px] leading-relaxed text-muted-foreground",
				children: n.matched.length ? `A local rhythm for your love of ${n.matched.slice(0, 2).join(" and ")}.` : FIT_LINES[n.name] ?? n.why
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 border-t pt-3 text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-muted-foreground",
					children: "Rent · 1BR "
				}), n.rentRange]
			})
		]
	});
}
function PlaceCard({ p, onClick }) {
	const Icon = p.category === "Cafe" ? Coffee : p.category === "Venue" ? Music : p.category === "Shop" ? ShoppingBag : Utensils;
	const price = p.tags.includes("budget") ? "$" : "$$";
	const [broken, setBroken] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setBroken(false), [p.image]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: `flex gap-4 rounded-2xl border p-5 ${onClick ? "cursor-pointer" : ""}`,
		...onClick ? {
			role: "button",
			tabIndex: 0,
			onClick,
			onKeyDown: (e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					onClick();
				}
			}
		} : {},
		children: [p.image && !broken ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: p.image,
			alt: p.imageAlt ?? p.name,
			className: "h-16 w-16 shrink-0 rounded-2xl object-cover",
			loading: "lazy",
			decoding: "async",
			onError: () => setBroken(true)
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0 flex-1",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "text-2xl leading-none",
						children: p.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted-foreground",
						children: price
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 flex items-center gap-1 text-[11px] text-muted-foreground",
					children: [
						p.category,
						" · ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3 w-3 shrink-0" }),
						p.neighborhood
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-xs leading-relaxed text-muted-foreground",
					children: p.reason
				})
			]
		})]
	});
}
function Timeline({ plan, city, visiting = false }) {
	const storageKey = `soft-landing:plan:${city}:${plan.map((w) => w.items.join("|")).join("||")}`;
	const [state, setState] = (0, import_react.useState)({
		key: "",
		done: []
	});
	(0, import_react.useEffect)(() => {
		let done = [];
		try {
			const raw = JSON.parse(localStorage.getItem(storageKey) ?? "[]");
			if (Array.isArray(raw)) done = raw.filter((v) => typeof v === "string");
		} catch {}
		setState({
			key: storageKey,
			done
		});
	}, [storageKey]);
	(0, import_react.useEffect)(() => {
		if (state.key !== storageKey) return;
		try {
			localStorage.setItem(storageKey, JSON.stringify(state.done));
		} catch {}
	}, [state, storageKey]);
	const done = state.key === storageKey ? state.done : [];
	const total = plan.reduce((a, w) => a + w.items.length, 0);
	const toggle = (key) => setState((s) => ({
		key: storageKey,
		done: s.done.includes(key) ? s.done.filter((k) => k !== key) : [...s.done, key]
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "plan-panel",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "eyebrow text-muted-foreground",
				children: "Your plan"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "section-title mt-5",
				children: visiting ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["Your trip, ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "day by day." })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					"Your first ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "30 days" }),
					", sorted."
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground",
				children: visiting ? `Make the most of every day in ${city}, one stop at a time.` : `A little less unknown. A few more familiar faces. One small step at a time in ${city}.`
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 h-1 w-full overflow-hidden rounded-full bg-border",
				role: "progressbar",
				"aria-label": "Plan progress",
				"aria-valuenow": done.length,
				"aria-valuemin": 0,
				"aria-valuemax": total,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-full bg-foreground transition-all",
					style: { width: `${total ? done.length / total * 100 : 0}%` }
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-xs text-muted-foreground",
				children: [
					done.length,
					" of ",
					total,
					" little steps complete"
				]
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "plan-weeks",
			children: plan.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "plan-week",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-2 flex items-baseline justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-3xl",
						children: w.week
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-[10px] text-muted-foreground",
						children: [
							w.items.filter((it) => done.includes(`${w.week}|${it}`)).length,
							" / ",
							w.items.length
						]
					})]
				}), w.items.map((it) => {
					const key = `${w.week}|${it}`;
					const checked = done.includes(key);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "plain",
						role: "checkbox",
						"aria-checked": checked,
						onClick: () => toggle(key),
						className: "plan-item flex w-full items-center gap-3 border-b py-4 text-left text-[13px] leading-relaxed",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `plan-check ${checked ? "bg-foreground text-primary-foreground" : ""}`,
							children: checked && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3 w-3" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `flex-1 ${checked ? "text-muted-foreground line-through" : ""}`,
							children: it
						})]
					}, key);
				})]
			}, w.week))
		})]
	});
}
function DecisionPanel({ r }) {
	const story = r.story?.trim() || buildStory(r);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-2xl border p-6",
		"aria-label": "How Soft Landing decided",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "eyebrow text-muted-foreground",
			children: "How Soft Landing decided"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-4 max-w-3xl font-display text-xl leading-snug sm:text-2xl",
			"data-testid": "decision-story",
			children: story
		})]
	});
}
function AnswerCard({ r, onChooseCity }) {
	const [requestState, setRequestState] = (0, import_react.useState)("idle");
	const [selected, setSelected] = (0, import_react.useState)(null);
	const mapRef = (0, import_react.useRef)(null);
	const spots = [...r.neighborhoods.filter((n) => typeof n.lat === "number" && typeof n.lng === "number").map((n) => ({
		id: spotId("neighborhood", n.name),
		name: n.name,
		area: joinParts(r.city, n.borough),
		kind: "neighborhood",
		lat: n.lat,
		lng: n.lng,
		image: n.image && n.image.length ? n.image : void 0,
		imageAlt: n.imageAlt
	})), ...r.places.filter((p) => typeof p.lat === "number" && typeof p.lng === "number").map((p) => ({
		id: spotId("place", p.name),
		name: p.name,
		area: p.neighborhood,
		kind: "place",
		lat: p.lat,
		lng: p.lng
	}))];
	const selectSpot = (id) => {
		setSelected({
			id,
			tick: Date.now()
		});
		mapRef.current?.scrollIntoView({
			behavior: "smooth",
			block: "center"
		});
	};
	const requestCity = async () => {
		const city = resolveCity(r.city)?.city;
		if (!city || requestState === "saving" || requestState === "saved") return;
		setRequestState("saving");
		try {
			const { error } = await supabase.from("city_requests").insert({
				city: city.name,
				country: city.country
			});
			setRequestState(error ? "error" : "saved");
		} catch {
			setRequestState("error");
		}
	};
	if (r.status === "unavailable" || r.status === "error") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "animate-rise space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				role: "status",
				className: "text-base",
				children: r.summary
			}),
			r.status === "unavailable" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-3",
					children: r.alternatives?.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: () => onChooseCity?.(c.name),
						title: c.reason,
						children: [c.name, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-4 w-4" })]
					}, c.name))
				}),
				r.alternatives?.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted-foreground",
					children: [
						c.name,
						" · ",
						c.reason
					]
				}, c.name)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: requestCity,
					disabled: requestState === "saving" || requestState === "saved",
					children: requestState === "saved" ? `Requested ${r.city}` : requestState === "saving" ? "Saving…" : `Request ${r.city}`
				}),
				requestState === "error" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					role: "alert",
					className: "text-xs",
					children: "Could not save your request. Please try again."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Collapsible, {
				title: "Agent steps",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepList, { steps: r.steps })
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "animate-rise space-y-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "eyebrow text-muted-foreground",
					children: r.source === "sample" ? "Sample recommendations" : r.source === "llm" ? "LLM-only" : r.mode === "qloo" ? "Qloo-grounded answer" : "LLM-only"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 max-w-3xl text-base leading-relaxed",
					children: r.summary
				}),
				r.source === "sample" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					role: "note",
					className: "mt-4 inline-block rounded-xl border px-4 py-2 text-xs",
					children: "Sample data, not from Qloo"
				}),
				r.source === "llm" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					role: "note",
					className: "mt-4 inline-block rounded-xl border px-4 py-2 text-xs",
					children: "LLM-only suggestions"
				})
			] }),
			(r.source === "qloo" || r.source === "llm") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DecisionPanel, { r }),
			r.neighborhoods.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockedBanner, { city: r.city }),
			r.neighborhoods.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "mb-6 font-display text-4xl",
				children: ["Neighborhoods that ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "get you." })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-7 md:grid-cols-3",
				children: r.neighborhoods.map((n, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-w-0 flex-col gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NeighborhoodCard, {
						n,
						city: r.city,
						index: i,
						qloo: r.source === "qloo",
						onClick: typeof n.lat === "number" ? () => selectSpot(spotId("neighborhood", n.name)) : void 0
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockButton, {
						r,
						n,
						className: "mt-auto"
					})]
				}, n.name))
			})] }),
			r.neighborhoods.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Compare, { r }),
			r.places.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "mb-6 font-display text-4xl",
				children: ["Your new ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "regular spots." })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 sm:grid-cols-2",
				children: r.places.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlaceCard, {
					p,
					onClick: typeof p.lat === "number" ? () => selectSpot(spotId("place", p.name)) : void 0
				}, p.name))
			})] }),
			spots.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				ref: mapRef,
				className: "scroll-mt-28",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "mb-6 font-display text-4xl",
					children: [
						"Your ",
						r.city,
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "on the map." })
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CityMap, {
					spots,
					selectedId: selected?.id ?? null,
					focusTick: selected?.tick ?? 0,
					onSelect: selectSpot
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Timeline, {
				plan: r.plan,
				city: r.city,
				visiting: r.trip === "visiting"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Collapsible, {
				title: "Agent steps",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepList, { steps: r.steps })
			})
		]
	});
}
var EXAMPLES = [
	"I love Afrobeats, spicy food and I'm on a student budget. Where should I live?",
	"I'm into indie films, coffee shops and quiet streets.",
	"Hip-hop, sneakers, late-night food, mid budget."
];
var SEARCH_TIMEOUT_MS = 6e4;
function withTimeout(p, ms) {
	return new Promise((resolve, reject) => {
		const id = setTimeout(() => reject(/* @__PURE__ */ new Error("Search timed out")), ms);
		p.then((v) => {
			clearTimeout(id);
			resolve(v);
		}, (e) => {
			clearTimeout(id);
			reject(e);
		});
	});
}
function tasteMessage(msgs) {
	return [...msgs].reverse().find((m) => m.role === "user")?.text ?? "";
}
function Index() {
	const getQloo = useServerFn(getQlooRecommendations);
	const [msgs, setMsgs] = (0, import_react.useState)([]);
	const [input, setInput] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [mode, setMode] = (0, import_react.useState)("qloo");
	const [voiceOn, setVoiceOn] = (0, import_react.useState)(true);
	const [about, setAbout] = (0, import_react.useState)(false);
	const [menu, setMenu] = (0, import_react.useState)(false);
	const [budget, setBudget] = (0, import_react.useState)("");
	const [pace, setPace] = (0, import_react.useState)("");
	const [trip, setTrip] = (0, import_react.useState)("moving");
	const [lifeStage, setLifeStage] = (0, import_react.useState)("");
	const [chips, setChips] = (0, import_react.useState)([]);
	const [needs, setNeeds] = (0, import_react.useState)([]);
	const [climate, setClimate] = (0, import_react.useState)("");
	const [city, setCity] = (0, import_react.useState)(null);
	const [snapNotice, setSnapNotice] = (0, import_react.useState)(null);
	const tts = useSpeechSynthesis();
	const endRef = (0, import_react.useRef)(null);
	const inputRef = (0, import_react.useRef)(null);
	const idRef = (0, import_react.useRef)(0);
	const requestRef = (0, import_react.useRef)(0);
	const resetPending = (0, import_react.useRef)(false);
	const voiceEnabledRef = (0, import_react.useRef)(voiceOn);
	voiceEnabledRef.current = voiceOn;
	const started = msgs.length > 0;
	const search = async (t, c, m) => {
		const request = ++requestRef.current;
		setInput("");
		setBusy(true);
		const aid = ++idRef.current;
		setMsgs((prev) => [
			...prev,
			{
				id: ++idRef.current,
				role: "user",
				text: t
			},
			{
				id: aid,
				role: "assistant",
				steps: []
			}
		]);
		try {
			const result = await withTimeout(m === "qloo" ? getQloo({ data: {
				message: t,
				city: c.city.name,
				prefs: {
					budget: budget || void 0,
					pace: pace || void 0,
					trip,
					lifeStage: lifeStage || void 0,
					chips,
					climate: climate || void 0,
					needs
				}
			} }) : runAgent(t, m, (s) => {
				if (request === requestRef.current) setMsgs((prev) => prev.map((x) => x.id === aid && x.role === "assistant" ? {
					...x,
					steps: [...x.steps, s]
				} : x));
			}, c.city.name, {
				budget: budget || void 0,
				pace: pace || void 0,
				trip,
				lifeStage: lifeStage || void 0,
				chips,
				needs
			}), SEARCH_TIMEOUT_MS);
			if (request !== requestRef.current) return;
			setMsgs((prev) => prev.map((x) => x.id === aid ? {
				...x,
				result
			} : x));
			setBusy(false);
			if (voiceEnabledRef.current) tts.speak(result.spoken);
			inputRef.current?.focus({ preventScroll: true });
		} catch {
			if (request !== requestRef.current) return;
			setMsgs((prev) => prev.map((x) => x.id === aid ? {
				...x,
				error: "That took too long or failed. Please try again."
			} : x));
			setBusy(false);
		}
	};
	const send = async (text) => {
		const t = text.trim() || chips.join(", ");
		if (!city) {
			if (t) setInput(t);
			focusDestination();
			return;
		}
		if (!t || busy || resetPending.current) return;
		await search(t, city, mode);
	};
	const rerun = (c, m) => {
		const t = tasteMessage(msgs) || chips.join(", ");
		++requestRef.current;
		setMsgs([]);
		setCity(c);
		setSnapNotice(null);
		setBusy(false);
		tts.cancel();
		if (t) search(t, c, m);
	};
	const stt = useSpeechRecognition(send);
	const handleCity = (r) => {
		if (started && r.city.name !== city?.city.name) rerun(r, mode);
		else {
			setCity(r);
			setSnapNotice(null);
		}
	};
	const focusDestination = () => {
		document.getElementById("pick-city")?.scrollIntoView({
			behavior: "smooth",
			block: "center"
		});
		document.getElementById("destination-city")?.focus({ preventScroll: true });
	};
	const changeCity = () => {
		++requestRef.current;
		resetPending.current = true;
		tts.cancel();
		if (stt.listening) stt.stop();
		setMsgs([]);
		setCity(null);
		setSnapNotice(null);
		setInput("");
		setBusy(false);
		window.setTimeout(() => {
			focusDestination();
			resetPending.current = false;
		}, 100);
	};
	const jump = (id) => {
		setMenu(false);
		if (started) {
			changeCity();
			window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 160);
		} else document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
	};
	const typeInstead = () => {
		document.getElementById("pick-city")?.scrollIntoView({
			behavior: "smooth",
			block: "center"
		});
		document.getElementById("tastes-input")?.focus({ preventScroll: true });
	};
	(0, import_react.useEffect)(() => {
		if (started) endRef.current?.scrollIntoView({
			behavior: "smooth",
			block: "end"
		});
	}, [msgs, started]);
	(0, import_react.useEffect)(() => {
		if (!about) return;
		const escape = (e) => {
			if (e.key === "Escape") setAbout(false);
		};
		document.addEventListener("keydown", escape);
		return () => document.removeEventListener("keydown", escape);
	}, [about]);
	const data = mode === "llm" && city ? CITY_DATA[city.city.name] : void 0;
	const preview = data?.neighborhoods.slice(0, 4).map((n, i) => ({
		...n,
		score: 94 - i * 2,
		matched: [],
		rentRange: data.rent[n.rent]
	})) ?? [];
	const previewPlan = data ? [
		{
			week: "Week 1",
			items: [`Explore ${preview[0]?.name ?? city?.city.name} on foot`, data.transit]
		},
		{
			week: "Week 2",
			items: ["Find your favorite neighborhood café", "Meet someone who shares your tastes"]
		},
		{
			week: "Week 3",
			items: [data.bank, "Make a weekend feel like your own"]
		},
		{
			week: "Week 4",
			items: ["Settle into your new routine", data.local]
		}
	] : [];
	const mic = (large = false) => stt.supported ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		type: "button",
		variant: "icon",
		"aria-label": stt.listening ? "Stop listening" : "Start speaking",
		onClick: stt.listening ? stt.stop : stt.start,
		disabled: busy,
		className: `bg-primary text-primary-foreground ${large ? "h-14 w-14" : ""} ${stt.listening ? "listening" : ""}`,
		children: stt.listening ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MicOff, { className: "h-5 w-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "h-5 w-5" })
	}) : null;
	const modeControl = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex items-center rounded-full border p-1",
		"aria-label": "Answer mode",
		children: ["qloo", "llm"].map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: "plain",
			"aria-pressed": mode === m,
			onClick: () => {
				if (m === mode) return;
				setMode(m);
				if (started && city) rerun(city, m);
			},
			className: `rounded-full px-3 py-2 text-[10px] ${mode === m ? "bg-card" : "text-muted-foreground"}`,
			children: m === "qloo" ? "Qloo-grounded" : "LLM-only"
		}, m))
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "shell",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "navbar",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
						className: "hidden items-center gap-4 text-[11px] md:flex",
						"aria-label": "Main navigation",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "plain",
								onClick: () => jump("how-it-works"),
								children: "How it works"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: "·"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "plain",
								onClick: () => jump("pick-city"),
								children: "Cities"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: "·"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "plain",
								onClick: () => setAbout(true),
								children: "About"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "md:hidden" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "plain",
						onClick: () => {
							if (started) changeCity();
							else window.scrollTo({
								top: 0,
								behavior: "smooth"
							});
						},
						"aria-label": "Soft Landing home",
						className: "wordmark",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Soft" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "LANDING" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex items-center justify-end gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "hidden max-w-44 lg:block",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CityPicker, {
									compact: true,
									value: city,
									onResolve: handleCity,
									onSearch: (r) => {
										if (!started) search(input.trim() || chips.join(", ") || "local favorites", r, mode);
									}
								})
							}),
							false,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "icon",
								"aria-label": "Open menu",
								"aria-expanded": menu,
								onClick: () => setMenu(!menu),
								children: menu ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-5 w-5" })
							}),
							menu && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
								className: "absolute right-0 top-14 z-50 flex w-64 flex-col gap-4 rounded-2xl border bg-card p-6 text-sm",
								"aria-label": "Menu",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "plain",
										onClick: () => jump("how-it-works"),
										children: "How it works"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "plain",
										onClick: () => jump("pick-city"),
										children: "Cities"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "plain",
										onClick: () => {
											setMenu(false);
											setAbout(true);
										},
										children: "About"
									}),
									modeControl,
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "plain",
										onClick: () => {
											setVoiceOn(!voiceOn);
											tts.cancel();
										},
										className: "flex items-center gap-2",
										children: [
											voiceOn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "h-4 w-4" }),
											"Voice replies ",
											voiceOn ? "on" : "off"
										]
									})
								]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", { children: !started ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "hero animate-rise",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "eyebrow text-muted-foreground",
							children: "Taste-matched relocation"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", { children: [
							"Move anywhere,",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", { className: "md:hidden" }),
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "feel at home." })
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "hero-subtitle",
							children: "The calm side of a new city."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-5 text-xs text-muted-foreground",
							children: city ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "emoji",
									children: flagForCountry(city.city.country)
								}),
								" ",
								city.city.name,
								" · Your next chapter"
							] }) : "Your next chapter, anywhere"
						}),
						city && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: changeCity,
							className: "mt-4 py-2 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Earth, { className: "h-3 w-3" }), "Change city"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-7 flex flex-wrap items-center justify-center gap-6",
							children: [stt.supported && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								onClick: stt.listening ? stt.stop : stt.start,
								className: stt.listening ? "listening" : "",
								children: [stt.listening ? "Listening…" : "Talk to Soft Landing", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "h-4 w-4" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "ghost",
								onClick: typeInstead,
								children: ["Type instead ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-3.5 w-3.5" })]
							})]
						}),
						stt.listening && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-5 text-sm",
							"aria-live": "polite",
							children: stt.transcript || "Listening…"
						}),
						stt.supported === false && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-xs text-muted-foreground",
							children: "Voice works best in Chrome"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "hero-strip",
							children: HERO_PHOTOS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figure", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: p.src,
								alt: p.label
							}) }, p.src))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-7 flex items-center justify-center gap-3 text-[10px] text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "A new city. A familiar feeling." }), mode === "qloo" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "—" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Powered by Qloo Taste AI" })] })]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					id: "pick-city",
					className: "city-panel section-space",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							className: "panel-photo",
							src: city ? cityPhoto(city.city.name) : DEFAULT_PANEL_PHOTO,
							alt: city ? `${city.city.name} skyline` : "A new city awaits"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "eyebrow mb-5 text-photo-foreground",
							children: "Somewhere that feels like you"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", { children: [
							"Pick your city.",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { children: "We'll find your people." })
						] })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								className: "destination-bar",
								onSubmit: (e) => {
									e.preventDefault();
									send(input);
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "destination-field",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "eyebrow",
											htmlFor: "destination-city",
											children: "Destination"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CityPicker, {
											id: "destination-city",
											value: city,
											onResolve: handleCity,
											onSearch: (r) => {
												if (!started) search(input.trim() || chips.join(", ") || "local favorites", r, mode);
											}
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "destination-field",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "eyebrow",
											htmlFor: "tastes-input",
											children: "What you love"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											id: "tastes-input",
											value: input,
											onChange: (e) => setInput(e.target.value),
											placeholder: "Coffee, music, quiet mornings…"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "destination-field",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "eyebrow",
											htmlFor: "budget",
											children: "Monthly budget"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											id: "budget",
											value: budget,
											onChange: (e) => setBudget(e.target.value),
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "",
													children: "Monthly budget"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "low",
													children: "Low"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "mid",
													children: "Mid"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "high",
													children: "High"
												})
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "destination-field",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "eyebrow",
											htmlFor: "pace",
											children: "Lifestyle pace"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											id: "pace",
											value: pace,
											onChange: (e) => setPace(e.target.value),
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "",
													children: "Lifestyle pace"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "quiet",
													children: "Quiet"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "balanced",
													children: "Balanced"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "energetic",
													children: "Energetic"
												})
											]
										})]
									}),
									input.trim() || chips.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "icon",
										type: "submit",
										"aria-label": "Find my neighborhoods",
										className: "bg-primary text-primary-foreground",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-5 w-5" })
									}) : mic(true)
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "preference-bar",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "preference-toggle",
										role: "group",
										"aria-label": "Moving or visiting",
										children: ["moving", "visiting"].map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											"aria-pressed": trip === v,
											onClick: () => setTrip(v),
											className: "preference-chip",
											children: v === "moving" ? "Moving" : "Visiting"
										}, v))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "destination-field",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "eyebrow",
											htmlFor: "life-stage",
											children: "Life stage"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											id: "life-stage",
											value: lifeStage,
											onChange: (e) => setLifeStage(e.target.value),
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "",
													children: "Life stage"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "student",
													children: "Student"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "young-professional",
													children: "Young professional"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "family",
													children: "Family"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "retiree",
													children: "Retiree"
												})
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "destination-field",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "eyebrow",
											htmlFor: "climate",
											children: "Climate preference"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											id: "climate",
											value: climate,
											onChange: (e) => setClimate(e.target.value),
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "",
													children: "Climate"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "warm",
													children: "Warm"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "mild",
													children: "Mild"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "cool",
													children: "Cool"
												})
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "preference-chips",
										role: "group",
										"aria-label": "Your tastes",
										children: TASTE_CHIPS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											"aria-pressed": chips.includes(c),
											className: "preference-chip",
											onClick: () => setChips((cur) => cur.includes(c) ? cur.filter((x) => x !== c) : [...cur, c]),
											children: c
										}, c))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "preference-chips",
										role: "group",
										"aria-label": "Your needs (optional)",
										children: NEEDS.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											"aria-pressed": needs?.includes(n) ?? false,
											className: "preference-chip",
											onClick: () => setNeeds((cur = []) => cur.includes(n) ? cur.filter((x) => x !== n) : [...cur, n]),
											children: NEED_LABELS[n]
										}, n))
									})
								]
							}),
							snapNotice && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 rounded-xl bg-card p-3 text-xs",
								role: "status",
								children: snapNotice
							})
						] })
					]
				}),
				!city && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					id: "how-it-works",
					className: "section-space text-center",
					role: "status",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Earth, {
							className: "mx-auto mb-5 h-6 w-6 text-muted-foreground",
							"aria-hidden": "true"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "section-title",
							children: "Pick a city to see your matches"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: focusDestination,
							className: "mt-6 text-xs",
							children: ["Pick a city ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
						})
					]
				}),
				city && preview.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					id: "how-it-works",
					className: "section-space",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-9 flex flex-wrap items-end justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "section-title",
							children: ["Neighborhoods that ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { children: "get you." })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "eyebrow pb-2 text-muted-foreground",
							children: "Sample data, not from Qloo"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `grid gap-8 sm:grid-cols-2 ${preview.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"}`,
						children: preview.map((n, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NeighborhoodCard, {
							n,
							city: city.city.name,
							index: i
						}, n.name))
					})]
				}),
				city && previewPlan.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "section-space",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Timeline, {
						plan: trip === "visiting" ? previewPlan.slice(0, 3).map((_, i) => ({
							week: `Day ${i + 1}`,
							items: ["Explore local favorites", "Find a café and take a neighborhood walk"]
						})) : previewPlan,
						city: city.city.name,
						visiting: trip === "visiting"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "section-space text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "eyebrow text-muted-foreground",
							children: "Start with what you love"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "section-title mt-4",
							children: ["Tell us your ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { children: "kind of city." })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-8 grid gap-3 md:grid-cols-3",
							children: EXAMPLES.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "plain",
								onClick: () => send(e),
								className: "rounded-2xl border p-6 text-left text-xs leading-relaxed",
								children: [
									"“",
									e,
									"”",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "mt-5 h-4 w-4" })
								]
							}, e))
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-10 flex flex-wrap items-center justify-center gap-5",
					children: [modeControl, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "icon",
						"aria-label": "Toggle voice replies",
						"aria-pressed": voiceOn,
						onClick: () => {
							setVoiceOn(!voiceOn);
							tts.cancel();
						},
						children: voiceOn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "h-4 w-4" })
					})]
				})
			] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "chat-shell",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "sticky top-0 z-30 mb-10 flex flex-wrap items-center justify-between gap-3 border-b bg-background py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: "/logo.svg",
								alt: "Soft Landing",
								width: 26,
								height: 26,
								className: "h-[26px] w-[26px]"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								onClick: changeCity,
								className: "px-4 py-3 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Earth, { className: "h-4 w-4" }), "Change city"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [modeControl, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "icon",
								"aria-label": "Toggle voice replies",
								"aria-pressed": voiceOn,
								onClick: () => {
									setVoiceOn(!voiceOn);
									tts.cancel();
								},
								children: voiceOn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "h-4 w-4" })
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "eyebrow mb-7 text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "emoji",
								children: city ? flagForCountry(city.city.country) : ""
							}),
							" Your soft landing in ",
							city?.city.name
						]
					}),
					snapNotice && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-7 rounded-xl border p-4 text-xs",
						children: snapNotice
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-12",
						children: msgs.map((m) => m.role === "user" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex justify-end",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "max-w-[90%] rounded-3xl rounded-br-md bg-card px-6 py-4 text-sm leading-relaxed",
								children: m.text
							})
						}, m.id) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: m.result ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnswerCard, {
							r: m.result,
							onChooseCity: (name) => {
								const resolved = resolveCity(name);
								if (resolved) rerun(resolved, mode);
							}
						}) : m.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							role: "alert",
							children: m.error
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border p-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "eyebrow mb-4 text-muted-foreground",
									children: "Finding your soft landing"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									role: "status",
									"aria-live": "polite",
									className: "mb-5 flex items-center gap-3 text-sm",
									"data-testid": "search-pending",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-4 w-4 shrink-0 animate-spin rounded-full border border-foreground border-t-transparent" }), mode === "llm" ? "Matching your taste to your preferences" : "Matching your tastes with Qloo. This can take up to 20 seconds…"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Collapsible, {
									title: "Agent steps",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepList, {
										steps: m.steps,
										pending: true,
										pendingText: mode === "llm" ? "Matching your taste to your preferences" : void 0
									})
								})
							]
						}) }, m.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref: endRef }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "chat-composer",
						children: [
							tts.speaking && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mb-3 text-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									onClick: tts.cancel,
									className: "py-2 text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "h-3 w-3" }), "Stop speaking"]
								})
							}),
							stt.listening && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mb-3 text-center text-xs",
								"aria-live": "polite",
								children: stt.transcript || "Listening…"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								onSubmit: (e) => {
									e.preventDefault();
									send(input);
								},
								className: "flex items-center gap-2 rounded-full border bg-card p-2 pl-6",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										ref: inputRef,
										value: input,
										onChange: (e) => setInput(e.target.value),
										placeholder: "Describe your tastes…",
										"aria-label": "Chat message",
										className: "min-w-0 flex-1 bg-transparent text-sm outline-none"
									}),
									mic(),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "icon",
										type: "submit",
										"aria-label": "Send",
										disabled: busy || !input.trim(),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-4 w-4" })
									})
								]
							}),
							stt.supported === false && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-center text-xs text-muted-foreground",
								children: "Voice works best in Chrome"
							})
						]
					})
				]
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
				className: "section-space flex flex-wrap items-center justify-between gap-5 border-t py-9",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-display text-3xl",
					children: "Soft Landing"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-6 text-[10px] text-muted-foreground",
					children: [mode === "qloo" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Powered by Qloo Taste AI" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "plain",
						onClick: () => setAbout(true),
						children: "About"
					})]
				})]
			}),
			about && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 grid place-items-center bg-photo-shade/40 p-5",
				onClick: () => setAbout(false),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					role: "dialog",
					"aria-modal": "true",
					"aria-labelledby": "about-title",
					className: "relative max-w-lg rounded-3xl bg-background p-9",
					onClick: (e) => e.stopPropagation(),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "icon",
							autoFocus: true,
							"aria-label": "Close About",
							onClick: () => setAbout(false),
							className: "absolute right-3 top-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "eyebrow text-muted-foreground",
							children: "A little about us"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							id: "about-title",
							className: "mt-5 text-4xl",
							children: ["A softer ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { children: "new beginning." })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-5 text-sm leading-relaxed text-muted-foreground",
							children: "Soft Landing helps people moving to a new city find neighborhoods, food spots and scenes that match their personal taste. Pick a destination, speak or type what you love, and explore a taste-matched first-30-days plan with every agent step shown. Qloo-grounded answers use live city insights, with clearly labeled same-city samples only when Qloo fails."
						})
					]
				})
			})
		]
	});
}
//#endregion
export { Index as component };
