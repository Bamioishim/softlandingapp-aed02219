import { describe, expect, it } from "vitest";
import { queryQloo } from "@/lib/qloo";
import { runSampleAgent } from "@/lib/sample-agent";
import { spotId } from "@/lib/map-types";

describe("Map spot coordinates", () => {
  it("Qloo places and neighborhoods carry the provider's coordinates", async () => {
    const fetcher = (async () =>
      new Response(
        JSON.stringify({
          results: {
            tags: [],
            entities: [
              {
                name: "Café Test",
                location: { lat: 48.86, lon: 2.35 },
                tags: [{ name: "coffee" }],
                properties: { locality: { neighborhood: { name: "Le Marais" } } },
              },
            ],
          },
        }),
      )) as typeof fetch;
    const r = await queryQloo({ city: "Paris", message: "coffee" }, "test", fetcher);
    expect(r.places[0]?.lat).toBe(48.86);
    expect(r.places[0]?.lng).toBe(2.35);
    expect(r.neighborhoods[0]?.name).toBe("Le Marais");
    expect(r.neighborhoods[0]?.lat).toBe(48.86);
    expect(r.neighborhoods[0]?.lng).toBe(2.35);
  });

  it("built-in city samples include coordinates for every neighborhood and place", async () => {
    const r = await runSampleAgent("coffee", "qloo", undefined, "London");
    expect(r.neighborhoods.every((n) => typeof n.lat === "number" && typeof n.lng === "number")).toBe(true);
    expect(r.places.every((p) => typeof p.lat === "number" && typeof p.lng === "number")).toBe(true);
  });

  it("generic Without Qloo samples have no coordinates, so no map pins", async () => {
    const r = await runSampleAgent("coffee", "llm", undefined, "Ilorin");
    expect(r.places.every((p) => p.lat === undefined)).toBe(true);
  });

  it("spot ids are namespaced by kind", () => {
    expect(spotId("neighborhood", "Harlem")).toBe("neighborhood:Harlem");
    expect(spotId("place", "Harlem")).toBe("place:Harlem");
  });
});
