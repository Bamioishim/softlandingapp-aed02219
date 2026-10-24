import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { buildLlmResult, type LlmOutput } from "@/lib/llm-map";
import { AnswerCard } from "@/components/AnswerCard";

afterEach(cleanup);

const output: LlmOutput = {
  summary: "Paris picks.",
  neighborhoods: [
    { name: "Le Marais", borough: "3rd/4th arrondissement", why: "Cafés and boutiques on every lane.", rentBand: "$$$", matched: ["coffee", "art", "books", "film"] },
    { name: "Canal Saint-Martin", borough: "10th arrondissement", why: "Canal-side evenings.", rentBand: "$$", matched: [] },
    { name: "Belleville", borough: "19th/20th arrondissement", why: "Studio scene and street food.", rentBand: "$", matched: ["art"] },
  ],
  places: [
    { name: "Café de Flore", category: "Cafe", neighborhood: "Saint-Germain", reason: "Classic literary café." },
    { name: "Marché des Enfants Rouges", category: "Restaurant", neighborhood: "Le Marais", reason: "Oldest covered market." },
    { name: "Parc des Buttes-Chaumont", category: "Place", neighborhood: "Belleville", reason: "Hilltop park." },
  ],
  plan: [
    { label: "Day 1", items: ["Arrive", "Café", "Dinner"] },
    { label: "Day 2", items: ["Explore", "Market", "Evening"] },
    { label: "Day 3", items: ["Morning", "Park", "Last stop"] },
  ],
};

describe("LLM-only mode", () => {
  it("maps AI output without fabricated scores and labels rent as an estimate", () => {
    const r = buildLlmResult({ city: "Paris", tastes: ["coffee"], prefs: { trip: "visiting" }, output, aiMs: 1200 });
    expect(r.source).toBe("llm");
    expect(r.trip).toBe("visiting");
    expect(r.plan.map((p) => p.week)).toEqual(["Day 1", "Day 2", "Day 3"]);
    expect(r.neighborhoods.every((n) => n.scoreAvailable === false)).toBe(true);
    expect(r.neighborhoods[0]?.rentRange).toContain("AI estimate");
    expect(r.neighborhoods[0]?.matched).toHaveLength(3);
    expect(r.places[0]?.image).toBeTruthy();
    expect(r.steps.some((s) => s.label.includes("Lovable AI"))).toBe(true);
  });

  it("keeps the moving plan at four weeks", () => {
    const moving: LlmOutput = { ...output, plan: ["Week 1", "Week 2", "Week 3", "Week 4"].map((label) => ({ label, items: ["a", "b"] })) };
    const r = buildLlmResult({ city: "Paris", tastes: [], prefs: {}, output: moving, aiMs: 900 });
    expect(r.plan.map((p) => p.week)).toEqual(["Week 1", "Week 2", "Week 3", "Week 4"]);
  });

  it("labels the mode LLM-only and never mentions Qloo", () => {
    const r = buildLlmResult({ city: "Paris", tastes: ["coffee"], prefs: {}, output, aiMs: 900 });
    const { container } = render(<AnswerCard r={r} />);
    expect(screen.getByText("LLM-only")).toBeTruthy();
    expect(screen.getByText("LLM-only suggestions")).toBeTruthy();
    expect(container.textContent).not.toMatch(/qloo/i);
  });

  it("shows the model's story as prose in the decision panel", () => {
    const story = "Paris is known for its cafés. We leaned toward Le Marais.";
    const r = buildLlmResult({ city: "Paris", tastes: ["coffee"], prefs: {}, output: { ...output, story }, aiMs: 900 });
    render(<AnswerCard r={r} />);
    expect(screen.getByTestId("decision-story").textContent).toBe(story);
  });

  it("labels every lock-in button with the city name", () => {
    const r = buildLlmResult({ city: "Paris", tastes: ["coffee"], prefs: {}, output, aiMs: 900 });
    render(<AnswerCard r={r} />);
    expect(screen.getAllByText("Paris it is").length).toBeGreaterThanOrEqual(3);
  });
});
