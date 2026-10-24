import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Check, Download, Share2, X } from "lucide-react";
import { downloadBlob, pickFileName, renderPickCard, sharePickCard } from "@/lib/pick-card";
import type { AgentResult, NeighborhoodMatch } from "@/lib/agent";
import { useLockedPick, type LockedPick } from "@/lib/locked-pick";
import { cityPhoto } from "@/lib/photos";
import { CHARACTER_URL } from "@/lib/character";
import { Button } from "./Button";

export function toPick(r: AgentResult, n: NeighborhoodMatch): LockedPick {
  return {
    city: r.city,
    neighborhood: n.name,
    borough: n.borough,
    score: n.scoreAvailable === false ? null : Math.min(99, n.score),
    tastes: [...new Set([...n.matched, ...n.tags])].slice(0, 4),
    rentRange: n.rentRange,
    image: n.image && n.image.length ? n.image : cityPhoto(r.city, 0),
    lockedAt: new Date().toISOString(),
  };
}

export const lockLabel = (city: string) => `${city} it is`;

function useCardActions(pick: LockedPick | null) {
  const [status, setStatus] = useState("");
  const share = async () => {
    if (!pick) return;
    setStatus("Making your card…");
    try {
      const r = await sharePickCard(pick);
      setStatus(r === "shared" ? "Shared!" : r === "downloaded" ? "Card downloaded" : "");
    } catch {
      setStatus("Could not make the card. Please try again.");
    }
  };
  const download = async () => {
    if (!pick) return;
    try {
      downloadBlob(await renderPickCard(pick), pickFileName(pick));
      setStatus("Card downloaded");
    } catch {
      setStatus("Could not make the card. Please try again.");
    }
  };
  return { status, share, download };
}

export function LockButton({ r, n, className = "" }: { r: AgentResult; n: NeighborhoodMatch; className?: string; short?: boolean }) {
  const [pick, lock] = useLockedPick();
  const [open, setOpen] = useState(false);
  const locked = pick?.city === r.city && pick.neighborhood === n.name;
  return (
    <>
      <Button
        variant="pill"
        aria-pressed={locked}
        aria-label={locked ? `${n.name} is my pick (view card)` : `${lockLabel(r.city)}: pick ${n.name}`}
        onClick={() => {
          if (!locked) lock(toPick(r, n));
          setOpen(true);
        }}
        className={`w-full justify-center py-2.5 text-xs ${locked ? "bg-primary text-primary-foreground" : "border"} ${className}`}
      >
        {locked && <Check className="h-3.5 w-3.5" />}
        {locked ? `My pick: ${n.name}` : lockLabel(r.city)}
      </Button>
      {open && locked && pick && <PickSheet pick={pick} onClose={() => setOpen(false)} onChange={() => { lock(null); setOpen(false); }} />}
    </>
  );
}

/** Popup card for the locked pick: destination photo background, spring-in bottom sheet. */
export function PickSheet({ pick, onClose, onChange }: { pick: LockedPick; onClose: () => void; onChange?: () => void }) {
  const { status, share, download } = useCardActions(pick);
  const [photoOk, setPhotoOk] = useState(true);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);
  return createPortal(
    <div className="pick-sheet-backdrop" onClick={onClose} data-testid="pick-sheet">
      <div role="dialog" aria-modal="true" aria-label={`Your pick: ${pick.neighborhood}, ${pick.city}`} className="pick-sheet" onClick={(e) => e.stopPropagation()}>
        {pick.image && photoOk ? (
          <img src={pick.image} alt="" className="pick-sheet-photo" onError={() => setPhotoOk(false)} />
        ) : (
          <div className="pick-sheet-photo pick-sheet-fallback" />
        )}
        <div className="pick-sheet-shade" />
        <button type="button" aria-label="Close" onClick={onClose} className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-black/40 text-white">
          <X className="h-4 w-4" />
        </button>
        {/* Character illustration (src/lib/character.ts), bottom-right, ~45% of card height. */}
        {CHARACTER_URL && <img src={CHARACTER_URL} alt="" data-slot="character" className="pick-sheet-character" />}
        <div className="relative z-[2] p-6 pt-8 text-white sm:p-8">
          <p className="eyebrow text-white/80">My soft landing</p>
          <h2 className="mt-3 font-display text-5xl leading-[0.95] sm:text-6xl">{pick.neighborhood}</h2>
          <p className="mt-1 font-display text-3xl italic text-white/90">{pick.city}</p>
          <p className="eyebrow mt-2 text-white/70">{pick.borough}</p>
          {pick.score !== null && (
            <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm backdrop-blur">
              <span className="match-dot" /> <strong>{pick.score}%</strong> match
            </p>
          )}
          {pick.tastes.length > 0 && (
            <ul className="mt-4 flex max-w-[22rem] flex-wrap gap-2" aria-label="Top tastes">
              {pick.tastes.slice(0, 4).map((t) => (
                <li key={t} className="rounded-full border border-white/40 bg-black/20 px-3 py-1 text-xs">{t.charAt(0).toUpperCase() + t.slice(1)}</li>
              ))}
            </ul>
          )}
        </div>
        <div className="relative z-[2] mt-auto flex w-[58%] flex-col items-start gap-2 p-6 sm:p-8">
            <Button variant="pill" className="bg-white py-2.5 text-xs text-black" onClick={share}>
              <Share2 className="h-3.5 w-3.5" /> Share my pick
            </Button>
            <button type="button" className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-medium border border-white/70 bg-black/35 text-white backdrop-blur" onClick={download} aria-label="Save image">
              <Download className="h-3.5 w-3.5" /> Save image
            </button>
            {onChange && (
              <button type="button" className="px-1 py-2 text-xs text-white/85 underline underline-offset-4" onClick={onChange}>
                Change pick
              </button>
            )}
          {status && <p role="status" className="text-xs text-white/80">{status}</p>}
        </div>
      </div>
    </div>
  ,
    document.body,
  );
}

export function LockedBanner({ city }: { city: string }) {
  const [pick, lock] = useLockedPick();
  const { status, share, download } = useCardActions(pick);
  if (!pick || pick.city !== city) return null;
  return (
    <section className="animate-rise rounded-2xl bg-card p-5 sm:p-6" aria-label="Your locked pick" data-testid="locked-banner">
      <p className="eyebrow flex items-center gap-2 text-muted-foreground">
        <span className="match-dot" /> {lockLabel(pick.city)}
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
          <Button variant="pill" className="bg-primary py-2.5 text-xs text-primary-foreground" onClick={share}>
            <Share2 className="h-3.5 w-3.5" /> Share my pick
          </Button>
          <Button variant="pill" className="border py-2.5 text-xs" onClick={download} aria-label="Download pick card">
            <Download className="h-3.5 w-3.5" /> Save image
          </Button>
          <Button variant="pill" className="border py-2.5 text-xs" onClick={() => lock(null)}>
            Change pick
          </Button>
        </div>
      </div>
      {status && <p role="status" className="mt-3 text-xs text-muted-foreground">{status}</p>}
    </section>
  );
}
