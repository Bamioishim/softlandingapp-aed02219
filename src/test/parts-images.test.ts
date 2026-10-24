import { describe, expect, it } from "vitest";
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
