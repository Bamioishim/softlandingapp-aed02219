import { useCallback, useEffect, useState } from "react";

export type LockedPick = {
  city: string;
  neighborhood: string;
  borough: string;
  score: number | null;
  tastes: string[];
  rentRange: string;
  lockedAt: string;
};

const KEY = "soft-landing:locked-pick";
const EVENT = "soft-landing:locked-pick-change";

export function readLockedPick(): LockedPick | null {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? "null");
    return v && typeof v.neighborhood === "string" && typeof v.city === "string" ? (v as LockedPick) : null;
  } catch {
    return null;
  }
}

export function writeLockedPick(pick: LockedPick | null) {
  try {
    if (pick) localStorage.setItem(KEY, JSON.stringify(pick));
    else localStorage.removeItem(KEY);
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}

export function useLockedPick() {
  const [pick, setPick] = useState<LockedPick | null>(null);
  useEffect(() => {
    const sync = () => setPick(readLockedPick());
    sync();
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  const lock = useCallback((p: LockedPick | null) => writeLockedPick(p), []);
  return [pick, lock] as const;
}
