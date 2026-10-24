import { readFileSync } from "node:fs";
import { describe, it, expect } from "vitest";
describe("optional sign-in", () => {
  it("is hidden behind SHOW_SIGNIN = false", () => {
    const src = readFileSync("src/routes/index.tsx", "utf8");
    expect(src).toMatch(/SHOW_SIGNIN = false/);
    expect(src).toMatch(/\{SHOW_SIGNIN && <AccountButton \/>\}/);
  });
});
