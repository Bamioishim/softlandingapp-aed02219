import { Check, Lock } from "lucide-react";
import type { AgentResult, NeighborhoodMatch } from "@/lib/agent";
import { useLockedPick, type LockedPick } from "@/lib/locked-pick";
import { Button } from "./Button";

export function toPick(r: AgentResult, n: NeighborhoodMatch): LockedPick {
  return {
    city: r.city,
    neighborhood: n.name,
    borough: n.borough,
    score: n.scoreAvailable === false ? null : Math.min(99, n.score),
    tastes: [...new Set([...n.matched, ...n.tags])].slice(0, 4),
    rentRange: n.rentRange,
    lockedAt: new Date().toISOString(),
  };
}

export function LockButton({ r, n, className = "", short = false }: { r: AgentResult; n: NeighborhoodMatch; className?: string; short?: boolean }) {
  const [pick, lock] = useLockedPick();
  const locked = pick?.city === r.city && pick.neighborhood === n.name;
  return (
    <Button
      variant="pill"
      aria-pressed={locked}
      aria-label={locked ? `${n.name} is my pick (tap to unlock)` : `Lock in ${n.name}`}
      onClick={() => lock(locked ? null : toPick(r, n))}
      className={`w-full justify-center py-2.5 text-xs ${locked ? "bg-primary text-primary-foreground" : "border"} ${className}`}
    >
      {locked ? <Check className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
      {short ? (locked ? "My pick" : "Lock in") : locked ? `My pick: ${n.name}` : `Lock in ${n.name}`}
    </Button>
  );
}

export function LockedBanner({ city }: { city: string }) {
  const [pick, lock] = useLockedPick();
  if (!pick || pick.city !== city) return null;
  return (
    <section className="animate-rise rounded-2xl bg-card p-5 sm:p-6" aria-label="Your locked pick" data-testid="locked-banner">
      <p className="eyebrow flex items-center gap-2 text-muted-foreground">
        <span className="match-dot" /> Your pick is locked in
      </p>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-4xl leading-tight">{pick.neighborhood}</h2>
          <p className="eyebrow mt-1 text-muted-foreground">
            {pick.city} · {pick.borough}
            {pick.score !== null ? ` · ${pick.score}% match` : ""}
          </p>
        </div>
        <div className="flex flex-wrap gap-2" data-slot="pick-actions">
          <Button variant="pill" className="border py-2.5 text-xs" onClick={() => lock(null)}>
            Change pick
          </Button>
        </div>
      </div>
    </section>
  );
}
