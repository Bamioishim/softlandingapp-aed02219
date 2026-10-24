import { describe, expect, it } from "vitest";
import { fillPlaceImages } from "@/lib/neighborhood-images";
import { photoCategory } from "@/lib/category-photos";
import { areaLabel, joinParts } from "@/lib/parts";
import { fillNeighborhoodImages, titleMatches } from "@/lib/neighborhood-images";
import { CATEGORY_POOLS } from "@/lib/category-photos";
import { cityPhoto } from "@/lib/photos";

describe("joinParts", () => {
  it("drops empty and case-insensitive duplicate parts", () => {
    expect(joinParts("New York City", "NEW YORK CITY")).toBe("New York City");
    expect(joinParts("London", "", "  ", "South London", "london")).toBe("London · South London");
    expect(areaLabel("New York City", "New York City", "Harlem")).toBe("");
    expect(areaLabel("Manhattan", "New York City", "Harlem")).toBe("Manhattan");
  });
});

type Page = { title: string; thumbnail?: { source: string }; coordinates?: { lat: number; lon: number }[]; extract?: string; pageprops?: { disambiguation: string } };
/** Fake Wikipedia: `search` maps a query to result titles; `pages` holds article details by title. */
const wiki = (search: Record<string, string[]>, pages: Record<string, Page>) => async (url: string) => {
  const u = new URL(url);
  const sr = u.searchParams.get("srsearch");
  const t = u.searchParams.get("titles");
  const body = sr != null
    ? { query: { search: (search[sr] ?? []).map((title) => ({ title })) } }
    : { query: { pages: { "1": pages[t!] ?? { title: t!, missing: "" } } } };
  return { ok: true, status: 200, json: async () => body };
};
const NYC = { lat: 40.73, lon: -73.99 };
const img = (f: string) => ({ source: `https://upload.wikimedia.org/${f}` });

describe("strict title matching", () => {
  it("accepts exact names and disambiguators, rejects names inside longer titles", () => {
    expect(titleMatches("Katz's Delicatessen", "Katz\u2019s Delicatessen", "spot")).toBe(true);
    expect(titleMatches("Abra\u00e7o (restaurant)", "Abraco", "spot")).toBe(true);
    expect(titleMatches("Wedding hugs", "Abra\u00e7o", "spot")).toBe(false);
    expect(titleMatches("Astoria, Queens", "Astoria", "neighborhood")).toBe(true);
    expect(titleMatches("Astoria (Queens)", "Astoria", "neighborhood")).toBe(true);
    expect(titleMatches("Waldorf Astoria New York", "Astoria", "neighborhood")).toBe(false);
    expect(titleMatches("Astoria, Queens", "Astoria", "spot")).toBe(false);
  });
});

describe("LLM-only photos reject wrong Wikipedia matches", () => {
  const pages: Record<string, Page> = {
    "Los Angeles River": { title: "Los Angeles River", thumbnail: img("Los_Angeles_River.jpg"), coordinates: [{ lat: 33.76, lon: -118.2 }] },
    "Cold Spring, New York": { title: "Cold Spring, New York", thumbnail: img("Cold_Spring.jpg"), coordinates: [{ lat: 41.42, lon: -73.95 }], extract: "Cold Spring is a village in New York." },
    "Wedding hugs": { title: "Wedding hugs", thumbnail: img("Wedding_hugs.jpg") },
    "Waldorf Astoria New York": { title: "Waldorf Astoria New York", thumbnail: img("Waldorf.jpg"), coordinates: [{ lat: 40.756, lon: -73.974 }] },
    Astoria: { title: "Astoria", pageprops: { disambiguation: "" } },
    "Astoria, Queens": { title: "Astoria, Queens", thumbnail: img("Astoria_street.jpg"), coordinates: [{ lat: 40.772, lon: -73.93 }] },
    "Blue Note Jazz Club": { title: "Blue Note Jazz Club", thumbnail: img("Blue_Note.jpg"), coordinates: [NYC] },
    "Mighty Oak (London)": { title: "Mighty Oak (London)", thumbnail: img("Oak_London.jpg"), coordinates: [{ lat: 51.5, lon: -0.1 }] },
  };
  const f = wiki({
    "Mighty Oak Roasters New York City": ["Los Angeles River"],
    "Kinship Coffee New York City": ["Cold Spring, New York"],
    "Abra\u00e7o New York City": ["Wedding hugs"],
    "Astoria New York City": ["Waldorf Astoria New York", "Astoria"],
    "Blue Note Jazz Club New York City": ["Blue Note Jazz Club"],
    "Mighty Oak New York City": ["Mighty Oak (London)"],
  }, pages);

  it("spots with no matching article use the category pool, never the unrelated photo", async () => {
    const out = await fillPlaceImages("New York City", [
      { name: "Mighty Oak Roasters", category: "Cafe" },
      { name: "Kinship Coffee", category: "Cafe" },
      { name: "Abra\u00e7o", category: "Cafe" },
      { name: "Mighty Oak", category: "Cafe" },
      { name: "Blue Note Jazz Club", category: "Venue" },
    ] as { name: string; category: string; image?: string }[], f);
    const pool = CATEGORY_POOLS["cafe"]!;
    for (const p of out.slice(0, 4)) expect(pool).toContain(p.image);
    expect(out.slice(0, 4).map((p) => p.image).join()).not.toMatch(/Los_Angeles|Cold_Spring|Wedding|Oak_London/);
    expect(out[4]!.image).toBe("https://upload.wikimedia.org/Blue_Note.jpg");
  });

  it("Astoria resolves to 'Astoria, Queens', never the Waldorf Astoria", async () => {
    const [n] = await fillNeighborhoodImages("New York City", [{ name: "Astoria", borough: "Queens" } as { name: string; borough: string; image?: string }], f);
    expect(n!.image).toBe("https://upload.wikimedia.org/Astoria_street.jpg");
    const [bare] = await fillNeighborhoodImages("New York City", [{ name: "Astoria" } as { name: string; image?: string }], wiki({ "Astoria New York City": ["Waldorf Astoria New York", "Astoria"] }, pages));
    expect(bare!.image).toBe(cityPhoto("New York City", 0));
  });

  it("falls back to city photos when Wikipedia fails, with no repeats", async () => {
    const out = await fillNeighborhoodImages("London", [{ name: "A" }, { name: "B" }] as { name: string; image?: string }[], async () => { throw new Error("offline"); });
    expect(out[0]!.image).toBe(cityPhoto("London", 0));
    expect(out[1]!.image).toBe(cityPhoto("London", 1));
  });
});

describe("fillPlaceImages", () => {
  type P = { name: string; category?: string; image?: string; imageAlt?: string };
  const none = async () => ({ ok: true, json: async () => ({}) });
  it("never repeats a fallback photo across many same-category spots or with neighborhoods", async () => {
    const used = new Set<string>(["https://x/hood.jpg"]);
    const ps: P[] = Array.from({ length: 8 }, (_, i) => ({ name: `Spot ${i}`, category: "Cafe" }));
    const out = await fillPlaceImages("London", ps, none, used);
    const imgs = out.map((p) => p.image);
    expect(imgs.every(Boolean)).toBe(true);
    expect(new Set(imgs).size).toBe(8);
    expect(imgs).not.toContain("https://x/hood.jpg");
  });
  it("maps names to category pools", () => {
    expect(photoCategory("Hyde Park", "Place")).toBe("park");
    expect(photoCategory("Tate Modern Museum", "Place")).toBe("museum");
    expect(photoCategory("Blue Note", "Venue")).toBe("music");
  });
});
