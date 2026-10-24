import { describe, expect, it } from "vitest";
import { buildStory } from "@/lib/story";
import type { AgentResult, NeighborhoodMatch } from "@/lib/agent-types";

const n = (name: string, matched: string[], why = ""): NeighborhoodMatch => ({ name, borough: "X", rent: "$$", tags: [], why, score: 80, matched, rentRange: "" });
const base = (over: Partial<AgentResult>): AgentResult => ({
  summary: "", neighborhoods: [], places: [], plan: [], steps: [], mode: "qloo", city: "London", spoken: "", source: "qloo", ...over,
});

describe("decision story", () => {
  it("reads as 2–4 sentences of prose naming the city, tastes and top pick", () => {
    const s = buildStory(base({ neighborhoods: [n("Peckham", ["food", "music"], "Markets and late-night music."), n("Hackney", ["food"]), n("Brixton", [])] }));
    expect(s).toMatch(/^London is known for/);
    expect(s).toMatch(/leaned toward Peckham/);
    expect(s).toMatch(/food and music/);
    const sentences = s.split(/(?<=[.!?])\s+/).filter(Boolean);
    expect(sentences.length).toBeGreaterThanOrEqual(2);
    expect(sentences.length).toBeLessThanOrEqual(4);
    expect(s).not.toMatch(/\n|^\d\./);
  });
  it("never mentions Qloo for LLM-only results", () => {
    const s = buildStory(base({ source: "llm", mode: "llm", city: "Atlantis", neighborhoods: [n("A", ["art"]), n("B", []), n("C", [])] }));
    expect(s).not.toMatch(/qloo/i);
  });
});
