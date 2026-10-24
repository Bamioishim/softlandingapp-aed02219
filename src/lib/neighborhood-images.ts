// Finds a real photo for each neighborhood: Wikipedia image search for "<neighborhood> <city>",
// then a city photo. Never repeats a photo across cards.
import { cityPhoto, CITY_PHOTOS } from "./photos";
import { CATEGORY_POOLS, photoCategory } from "./category-photos";

type Fetcher = (url: string) => Promise<{ ok: boolean; json: () => Promise<unknown> }>;

export async function wikipediaSearchImages(query: string, fetcher: Fetcher): Promise<string[]> {
  try {
    const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&generator=search&gsrnamespace=0&gsrlimit=5&gsrsearch=${encodeURIComponent(query)}&prop=pageimages&piprop=thumbnail&pithumbsize=1000`;
    const res = await fetcher(url);
    if (!res.ok) return [];
    const data = (await res.json()) as { query?: { pages?: Record<string, { index?: number; thumbnail?: { source?: string } }> } };
    return Object.values(data.query?.pages ?? {})
      .sort((a, b) => (a.index ?? 99) - (b.index ?? 99))
      .map((p) => p.thumbnail?.source)
      .filter((s): s is string => !!s && !/\.svg/i.test(s) && !/(flag|logo|map|coat_of_arms|locator)/i.test(s));
  } catch {
    return [];
  }
}

export async function fillNeighborhoodImages<T extends { name: string; image?: string; imageAlt?: string }>(
  city: string,
  neighborhoods: T[],
  fetcher: Fetcher,
  used: Set<string> = new Set(),
): Promise<T[]> {
  for (const n of neighborhoods) if (n.image) used.add(n.image);
  const results = await Promise.all(neighborhoods.map((n) => (n.image ? Promise.resolve([]) : wikipediaSearchImages(`${n.name} ${city}`, fetcher))));
  const cityCount = Math.max(CITY_PHOTOS[city]?.length ?? 2, 1);
  let cityIdx = 0;
  return neighborhoods.map((n, i) => {
    if (n.image) return n;
    const wiki = results[i]!.find((src) => !used.has(src));
    if (wiki) {
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
      const first = await wikipediaSearchImages(`${p.name} ${city}`, fetcher);
      return first.length ? first : wikipediaSearchImages(p.name, fetcher);
    }),
  );
  const cursors: Record<string, number> = {};
  return places.map((p, i) => {
    const wiki = results[i]!.find((src) => !used.has(src));
    if (wiki) {
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
