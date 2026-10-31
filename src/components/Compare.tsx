import { useEffect, useState } from "react";
import { hasRent } from "@/lib/rent";
import type { AgentResult, NeighborhoodMatch } from "@/lib/agent";
import { LockButton } from "./LockIn";

const cap = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);
const RENT_FIT: Record<string, string> = { $: "Easy on a tight budget", $$: "Fits a mid budget", $$$: "Needs a bigger budget" };

export function budgetFit(n: NeighborhoodMatch) {
  return RENT_FIT[n.rent] ?? "Budget fit unknown";
}
export function topSpots(r: AgentResult, n: NeighborhoodMatch) {
  return r.places.filter((p) => p.neighborhood === n.name).slice(0, 3).map((p) => p.name);
}
export function tasteSignals(n: NeighborhoodMatch) {
  return [...new Set([...n.matched, ...n.tags])].filter((t) => /\p{L}/u.test(t)).slice(0, 5);
}

export function Compare({ r }: { r: AgentResult }) {
  const names = r.neighborhoods.map((n) => n.name);
  const [a, setA] = useState(names[0] ?? "");
  const [b, setB] = useState(names[1] ?? "");
  useEffect(() => {
    setA(names[0] ?? "");
    setB(names[1] ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [names.join("|")]);
  if (names.length < 2) return null;
  const pair = [a, b].map((x) => r.neighborhoods.find((n) => n.name === x)).filter(Boolean) as NeighborhoodMatch[];
  const rows: { label: string; value: (n: NeighborhoodMatch) => React.ReactNode }[] = [
    { label: "Match", value: (n) => (n.scoreAvailable === false ? "Not scored" : `${Math.min(99, n.score)}%`) },
    { label: "Budget fit", value: (n) => <>{budgetFit(n)}{hasRent(n.rentRange) && <span className="block text-muted-foreground">{n.rentRange}</span>}</> },
    {
      label: "Vibe",
      value: (n) => (
        <span className="flex flex-wrap gap-1.5">
          {tasteSignals(n).map((t) => (
            <span key={t} className={`outline-tag ${n.matched.includes(t) ? "bg-secondary" : ""}`}>{cap(t)}</span>
          ))}
        </span>
      ),
    },
    {
      label: "Top spots",
      value: (n) => {
        const s = topSpots(r, n);
        return s.length ? s.join(", ") : <span className="text-muted-foreground">{n.why}</span>;
      },
    },
  ];
  const select = (value: string, set: (v: string) => void, other: string, aria: string) => (
    <select
      aria-label={aria}
      value={value}
      onChange={(e) => set(e.target.value)}
      className="w-full min-w-0 rounded-full border bg-card px-4 py-3 font-display text-lg"
    >
      {names.map((nm) => (
        <option key={nm} value={nm} disabled={nm === other}>{nm}</option>
      ))}
    </select>
  );
  return (
    <section className="rounded-2xl border p-5 sm:p-6" aria-label="Compare neighborhoods">
      <p className="eyebrow text-muted-foreground">Side by side</p>
      <h2 className="mt-3 font-display text-3xl sm:text-4xl">
        Compare <em>two.</em>
      </h2>
      <div className="mt-6 grid grid-cols-[minmax(0,5rem)_1fr_1fr] gap-3 sm:grid-cols-[8rem_1fr_1fr]">
        <span />
        {select(a, setA, b, "First neighborhood")}
        {select(b, setB, a, "Second neighborhood")}
        {rows.map((row) => (
          <div key={row.label} className="contents">
            <span className="eyebrow border-t pt-3 text-[10px] text-muted-foreground">{row.label}</span>
            {pair.map((n) => (
              <div key={n.name + row.label} className="min-w-0 border-t pt-3 text-[13px] leading-relaxed" data-testid={`compare-${row.label}`}>
                {row.value(n)}
              </div>
            ))}
          </div>
        ))}
        <span />
        {pair.map((n) => (
          <div key={n.name + "lock"} className="min-w-0 border-t pt-3">
            <LockButton r={r} n={n} short className="px-3" />
          </div>
        ))}
      </div>
    </section>
  );
}
