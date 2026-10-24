import { describe, expect, it } from "vitest";
import { buildPlan, prefsSchema } from "@/lib/qloo";

describe("dietary and accessibility needs", () => {
  it("accepts needs in prefs and adds matching plan steps", () => {
    const prefs = prefsSchema.parse({ needs: ["halal", "accessible"] });
    const plan = buildPlan("London", prefs, [], []);
    const items = plan.flatMap((w) => w.items).join(" ");
    expect(items).toMatch(/halal/i);
    expect(items).toMatch(/step-free/i);
  });
  it("adds needs to a visiting plan's first day", () => {
    const plan = buildPlan("Paris", { trip: "visiting", needs: ["vegan"] }, [], []);
    expect(plan[0]?.items.join(" ")).toMatch(/vegan/i);
  });
  it("rejects unknown needs", () => {
    expect(() => prefsSchema.parse({ needs: ["keto"] })).toThrow();
  });
});
