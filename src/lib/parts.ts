/** Joins label parts with " · ", dropping empty parts and any part equal (case-insensitively) to an earlier one. */
export function joinParts(...parts: (string | null | undefined)[]): string {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const p of parts) {
    const t = (p ?? "").trim();
    const k = t.toLowerCase();
    if (!t || seen.has(k)) continue;
    seen.add(k);
    out.push(t);
  }
  return out.join(" · ");
}

/** The area line for a pick/neighborhood: the borough unless it just repeats the city or neighborhood. */
export function areaLabel(borough: string | undefined, ...others: string[]): string {
  const b = (borough ?? "").trim();
  return b && !others.some((o) => o.trim().toLowerCase() === b.toLowerCase()) ? b : "";
}
