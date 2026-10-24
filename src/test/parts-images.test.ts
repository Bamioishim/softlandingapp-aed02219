import { describe, expect, it } from "vitest";
import { fillPlaceImages } from "@/lib/neighborhood-images";
import { photoCategory } from "@/lib/category-photos";
import { areaLabel, joinParts } from "@/lib/parts";
import { fillNeighborhoodImages } from "@/lib/neighborhood-images";
import { cityPhoto } from "@/lib/photos";

describe("joinParts", () => {
  it("drops empty and case-insensitive duplicate parts", () => {
    expect(joinParts("New York City", "NEW YORK CITY")).toBe("New York City");
    expect(joinParts("London", "", "  ", "South London", "london")).toBe("London · South London");
    expect(areaLabel("New York City", "New York City", "Harlem")).toBe("");
    expect(areaLabel("Manhattan", "New York City", "Harlem")).toBe("Manhattan");
  });
});

const wiki = (map: Record<string, string[]>) => async (url: string) => {
  const q = decodeURIComponent(/gsrsearch=([^&]+)/.exec(url)![1]!);
  const pages = Object.fromEntries((map[q] ?? []).map((src, i) => [String(i), { index: i + 1, thumbnail: { source: src } }]));
  return { ok: true, json: async () => ({ query: { pages } }) };
};

describe("LLM-only neighborhood photos", () => {
  it("uses Wikipedia search per neighborhood, then city photos, with no repeats", async () => {
    type N = { name: string; image?: string };
    const ns: N[] = [{ name: "Greenwich Village" }, { name: "Harlem" }, { name: "Nowhere" }, { name: "Also Nowhere" }];
    const out = await fillNeighborhoodImages("New York City", ns, wiki({
      "Greenwich Village New York City": ["https://upload.wikimedia.org/a.jpg"],
      "Harlem New York City": ["https://upload.wikimedia.org/a.jpg", "https://upload.wikimedia.org/b.jpg"],
    }));
    expect(out[0]!.image).toBe("https://upload.wikimedia.org/a.jpg");
    expect(out[1]!.image).toBe("https://upload.wikimedia.org/b.jpg");
    expect(out[2]!.image).toBe(cityPhoto("New York City", 0));
    expect(out[3]!.image).toBe(cityPhoto("New York City", 1));
    expect(new Set(out.map((n) => n.image)).size).toBe(4);
  });
  it("falls back to city photos when Wikipedia fails", async () => {
    const out = await fillNeighborhoodImages("London", [{ name: "A" } as { name: string; image?: string }], async () => { throw new Error("offline"); });
    expect(out[0]!.image).toBe(cityPhoto("London", 0));
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
  it("uses Wikipedia first, retrying with the bare name, and skips svg/logo", async () => {
    const calls: string[] = [];
    const f = async (url: string) => {
      calls.push(decodeURIComponent(url));
      const bare = !url.includes("London");
      return { ok: true, json: async () => ({ query: { pages: bare ? { 1: { index: 1, thumbnail: { source: "https://w/logo.png" } }, 2: { index: 2, thumbnail: { source: "https://w/real.jpg" } } } : {} } }) };
    };
    const [p] = await fillPlaceImages("London", [{ name: "Ronnie Scott's" } as P], f);
    expect(p!.image).toBe("https://w/real.jpg");
    expect(calls.length).toBe(2);
  });
  it("maps names to category pools", () => {
    expect(photoCategory("Hyde Park", "Place")).toBe("park");
    expect(photoCategory("Tate Modern Museum", "Place")).toBe("museum");
    expect(photoCategory("Blue Note", "Venue")).toBe("music");
  });
});
