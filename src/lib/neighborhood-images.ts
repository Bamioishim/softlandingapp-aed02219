// Real photos for LLM-only cards. Wikipedia is used only when the article title strictly matches the
// place and the article is about this city; otherwise neighborhoods get a city photo and spots a
// category photo. A wrong photo is worse than a generic one. Never repeats a photo across cards.
import { cityPhoto, CITY_PHOTOS } from "./photos";
import { CATEGORY_POOLS, photoCategory } from "./category-photos";

type Fetcher = (url: string) => Promise<{ ok: boolean; json: () => Promise<unknown> }>;

// City centres and the words an article must mention to count as "about this city".
export const CITY_GEO: Record<string, { lat: number; lng: number; aliases: string[] }> = {
  "New York City": { lat: 40.7128, lng: -74.006, aliases: ["new york", "nyc", "manhattan", "brooklyn", "queens", "bronx", "staten island"] },
  London: { lat: 51.5074, lng: -0.1278, aliases: ["london"] },
  Berlin: { lat: 52.52, lng: 13.405, aliases: ["berlin"] },
  Lagos: { lat: 6.5244, lng: 3.3792, aliases: ["lagos"] },
  Paris: { lat: 48.8566, lng: 2.3522, aliases: ["paris"] },
  Toronto: { lat: 43.6532, lng: -79.3832, aliases: ["toronto"] },
  Amsterdam: { lat: 52.3676, lng: 4.9041, aliases: ["amsterdam"] },
  Tokyo: { lat: 35.6762, lng: 139.6503, aliases: ["tokyo"] },
  Dubai: { lat: 25.2048, lng: 55.2708, aliases: ["dubai"] },
  Sydney: { lat: -33.8688, lng: 151.2093, aliases: ["sydney"] },
  "San Francisco": { lat: 37.7749, lng: -122.4194, aliases: ["san francisco"] },
};

export const norm = (s: string) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[\u2018\u2019`]/g, "'").replace(/&/g, "and").replace(/[^a-z0-9' ]+/g, " ").replace(/\s+/g, " ").trim();

/**
 * Strict title match. Spots: exact name, or name + "(disambiguator)".
 * Neighborhoods additionally allow "Name, Borough". Names merely contained in a longer title never match.
 */
export function titleMatches(title: string, name: string, kind: "spot" | "neighborhood"): boolean {
  const n = norm(name);
  const raw = title.trim();
  const paren = /^(.*?)\s*\(([^)]*)\)$/.exec(raw);
  if (norm(raw) === n) return true;
  if (paren && norm(paren[1]!) === n) return true;
  if (kind === "neighborhood") {
    const comma = raw.indexOf(",");
    if (comma > 0 && norm(raw.slice(0, comma)) === n) return true;
  }
  return false;
}

function km(a: { lat: number; lng: number }, b: { lat: number; lon: number }): number {
  const r = (d: number) => (d * Math.PI) / 180;
  const dLat = r(b.lat - a.lat), dLng = r(b.lon - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(r(a.lat)) * Math.cos(r(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(h));
}

type WikiPage = { title?: string; index?: number; thumbnail?: { source?: string }; coordinates?: { lat: number; lon: number }[]; extract?: string; pageprops?: { disambiguation?: string } };

export function isAboutCity(page: WikiPage, city: string): boolean {
  const geo = CITY_GEO[city];
  const c = page.coordinates?.[0];
  if (geo && c) return km(geo, c) <= 30; // coordinates are decisive when present
  const text = norm(page.extract ?? "");
  const aliases = geo?.aliases ?? [norm(city)];
  return aliases.some((a) => text.includes(a));
}

const badImage = (s: string) => /\.svg/i.test(s) || /(flag|logo|map|coat_of_arms|locator|seal_of|icon)/i.test(s);

/** One quick retry on rate limiting (HTTP 429) or a network blip. */
async function retry(fetcher: Fetcher, url: string) {
  try {
    const r = await fetcher(url);
    if (r.ok || (r as { status?: number }).status !== 429) return r;
  } catch {
    /* fall through to one retry */
  }
  await new Promise((ok) => setTimeout(ok, 400));
  return fetcher(url);
}

const API = "https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&redirects=1";

/**
 * Returns the main image of the article that strictly matches `name` in `city`, or undefined.
 * Step 1 searches for candidate titles; step 2 loads each strictly matching title on its own,
 * because multi-page responses drop coordinates/extracts/thumbnails to continuations.
 */
export async function strictWikiImage(name: string, city: string, kind: "spot" | "neighborhood", fetcher: Fetcher, query = `${name} ${city}`, guesses: string[] = []): Promise<{ src: string; title: string } | undefined> {
  try {
    const res = await retry(fetcher, `${API}&list=search&srnamespace=0&srlimit=10&srsearch=${encodeURIComponent(query)}`);
    const data = (res.ok ? await res.json() : {}) as { query?: { search?: { title: string }[] } };
    const found = (data.query?.search ?? []).map((r) => r.title);
    const candidates = [...new Set([...guesses, ...found])].filter((t) => titleMatches(t, name, kind)).slice(0, 3);
    for (const cand of candidates) {
      const r2 = await retry(fetcher, `${API}&titles=${encodeURIComponent(cand)}&prop=pageimages|coordinates|extracts|pageprops&piprop=thumbnail&pithumbsize=1000&exintro=1&explaintext=1&ppprop=disambiguation`);
      if (!r2.ok) continue;
      const d2 = (await r2.json()) as { query?: { pages?: Record<string, WikiPage> } };
      const p = Object.values(d2.query?.pages ?? {})[0];
      if (!p || "missing" in p || (p.pageprops && "disambiguation" in p.pageprops)) continue;
      if (!isAboutCity(p, city)) continue;
      const src = p.thumbnail?.source;
      // The right article but no usable photo: stop rather than try weaker matches.
      return src && !badImage(src) ? { src, title: p.title ?? cand } : undefined;
    }
  } catch {
    /* offline or timeout: caller falls back */
  }
  return undefined;
}

/** Likely article titles, e.g. "Astoria, Queens", tried alongside search results. */
export function neighborhoodGuesses(name: string, borough: string | undefined, city: string): string[] {
  const g: string[] = [];
  if (borough && norm(borough) !== norm(city) && norm(borough) !== norm(name)) g.push(`${name}, ${borough}`);
  g.push(name); // the bare title still has to pass the city check (e.g. "Astoria" is Oregon, rejected)
  return g;
}

export async function fillNeighborhoodImages<T extends { name: string; image?: string; imageAlt?: string }>(
  city: string,
  neighborhoods: T[],
  fetcher: Fetcher,
  used: Set<string> = new Set(),
): Promise<T[]> {
  for (const n of neighborhoods) if (n.image) used.add(n.image);
  const results = await Promise.all(neighborhoods.map((n) => (n.image ? Promise.resolve(undefined) : strictWikiImage(n.name, city, "neighborhood", fetcher, `${n.name} ${city}`, neighborhoodGuesses(n.name, (n as { borough?: string }).borough, city)))));
  const cityCount = Math.max(CITY_PHOTOS[city]?.length ?? 2, 1);
  let cityIdx = 0;
  return neighborhoods.map((n, i) => {
    if (n.image) return n;
    const wiki = results[i]?.src;
    if (wiki && !used.has(wiki)) {
      used.add(wiki);
      return { ...n, image: wiki, imageAlt: `${n.name}, ${city}` };
    }
    for (let tries = 0; tries < cityCount; tries++) {
      const src = cityPhoto(city, cityIdx++);
      if (!used.has(src)) {
        used.add(src);
        return { ...n, image: src, imageAlt: `${city} city view` };
      }
    }
    return n; // no unused photo left: keep the plain name card rather than repeat one
  });
}

/**
 * Gives each spot a distinct real photo: Wikipedia search "<spot> <city>", then "<spot>", then a
 * rotating per-category pool. `used` is shared with the neighborhood cards so nothing repeats on the page.
 */
export async function fillPlaceImages<T extends { name: string; category?: string | undefined; image?: string | undefined; imageAlt?: string | undefined }>(
  city: string,
  places: T[],
  fetcher: Fetcher,
  used: Set<string> = new Set(),
): Promise<T[]> {
  const results = await Promise.all(
    places.map(async (p) => {
      const first = await strictWikiImage(p.name, city, "spot", fetcher);
      return first ?? strictWikiImage(p.name, city, "spot", fetcher, p.name);
    }),
  );
  const cursors: Record<string, number> = {};
  return places.map((p, i) => {
    const wiki = results[i]?.src;
    if (wiki && !used.has(wiki)) {
      used.add(wiki);
      return { ...p, image: wiki, imageAlt: `${p.name}, ${city}` };
    }
    const key = photoCategory(p.name, p.category);
    const order = [key, ...Object.keys(CATEGORY_POOLS).filter((k) => k !== key)];
    for (const k of order) {
      const pool = CATEGORY_POOLS[k]!;
      for (let t = 0; t < pool.length; t++) {
        const idx = (cursors[k] = (cursors[k] ?? 0) + 1) - 1;
        const src = pool[idx % pool.length]!;
        if (!used.has(src)) {
          used.add(src);
          return { ...p, image: src, imageAlt: `${k === "place" ? "Street" : k} in ${city}` };
        }
      }
    }
    return p;
  });
}
