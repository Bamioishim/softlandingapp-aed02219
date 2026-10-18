import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { CityPicker } from "@/components/CityPicker";
import { AnswerCard } from "@/components/AnswerCard";
import { runSampleAgent } from "@/lib/sample-agent";
import { searchCities } from "@/lib/cities";
import { canCoverImage, originalImage, placeImages } from "@/lib/qloo-images";
import { queryQloo } from "@/lib/qloo";

afterEach(cleanup);

describe("Search and sample rules", () => {
  it("clicking the Ilorin similar-city suggestion selects Lagos immediately", async () => {
    const fetcher = (async () => new Response(JSON.stringify({ results: { tags: [], entities: [] } }))) as typeof fetch;
    const r = await queryQloo({ city: "Ilorin", message: "coffee" }, "test", fetcher);
    let searched = "";
    render(<AnswerCard r={r} onChooseCity={(city) => { searched = city; }} />);
    fireEvent.click(screen.getByRole("button", { name: "Lagos" }));
    expect(searched).toBe("Lagos");
  });

  it("Qloo failure preserves Visiting plans in same-city samples", async () => {
    const fetcher = (async () => new Response("Unauthorized", { status: 401 })) as typeof fetch;
    const r = await queryQloo({ city: "Lagos", message: "coffee", prefs: { trip: "visiting" } }, "test", fetcher);
    expect(r.source).toBe("sample");
    expect(r.trip).toBe("visiting");
    expect(r.plan[0]?.week).toBe("Day 1");
  });

  it("Enter chooses the top dropdown match and starts a search", () => {
    let selected = "";
    let searched = "";
    render(<CityPicker value={null} onResolve={(r) => { selected = r.city.name; }} onSearch={(r) => { searched = r.city.name; }} />);
    const input = screen.getByRole("textbox", { name: "Destination city" });
    fireEvent.change(input, { target: { value: "Par" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(selected).toBe(searchCities("Par")[0]?.name);
    expect(searched).toBe(selected);
    expect(searched).not.toBe("");
  });

  it("Without Qloo works beyond city sample coverage and has no neighborhood images", async () => {
    const r = await runSampleAgent("coffee", "llm", undefined, "Ilorin");
    expect(r.city).toBe("Ilorin");
    expect(r.source).toBe("sample");
    expect(r.neighborhoods).toEqual([]);
    expect(r.places.map((p) => p.name)).toContain("Neighborhood café");
  });

  it("Without Qloo preserves Visiting day-by-day planning", async () => {
    const r = await runSampleAgent("coffee", "llm", undefined, "Paris", { trip: "visiting" });
    expect(r.trip).toBe("visiting");
    expect(r.plan.map((p) => p.week)).toEqual(["Day 1", "Day 2", "Day 3"]);
  });
});

describe("Photo quality rules", () => {
  it("prefers a place's highest-resolution image metadata over its thumbnail", () => {
    const images = placeImages({ properties: { image: { url: "https://example.com/t.jpg", width: 200 }, images: [{ url: "https://example.com/original.jpg", width: 1600, height: 2000 }] } });
    expect(images[0]?.url).toBe("https://example.com/original.jpg");
    expect(images[0]?.width).toBe(1600);
  });

  it("requests originals while keeping unrelated URL parameters", () => {
    expect(originalImage("https://example.com/photo.jpg?width=200&size=small&quality=20&token=public")).toBe("https://example.com/photo.jpg?token=public");
  });

  it("rejects tiny images that would need upscaling for cover", () => {
    expect(canCoverImage(200, 250, 400, 500)).toBe(false);
    expect(canCoverImage(1200, 1500, 400, 500)).toBe(true);
  });
});