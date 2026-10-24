import { useEffect, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { UserRound, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { readLockedPick, useLockedPick, writeLockedPick, type LockedPick } from "@/lib/locked-pick";
import { Button } from "./Button";

/** Optional account: email magic-link sign-in. The locked pick syncs to the user's account metadata. */
export function AccountButton() {
  const [user, setUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");
  const [pick] = useLockedPick();
  const restored = useRef(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null)).catch(() => {});
    const { data } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null));
    return () => data.subscription.unsubscribe();
  }, []);

  // On sign-in, restore a saved pick if this device has none.
  useEffect(() => {
    if (!user || restored.current) return;
    restored.current = true;
    const saved = user.user_metadata?.locked_pick as LockedPick | undefined;
    if (!readLockedPick() && saved && typeof saved.neighborhood === "string") writeLockedPick(saved);
  }, [user]);

  // Keep the account copy in step with the local pick.
  useEffect(() => {
    if (!user || !restored.current) return;
    const saved = user.user_metadata?.locked_pick ?? null;
    if (JSON.stringify(saved) === JSON.stringify(pick)) return;
    supabase.auth.updateUser({ data: { locked_pick: pick } }).catch(() => {});
  }, [user, pick]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setState("sending");
    setError("");
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: { emailRedirectTo: window.location.origin, shouldCreateUser: true },
      });
      if (error) {
        setError(error.message);
        setState("error");
      } else setState("sent");
    } catch {
      setError("Could not reach the sign-in service.");
      setState("error");
    }
  };

  return (
    <>
      <Button
        variant="icon"
        aria-label={user ? "Your account" : "Sign in (optional)"}
        onClick={() => setOpen(true)}
        className={user ? "bg-card" : ""}
        data-testid="account-button"
      >
        <UserRound className="h-5 w-5" />
      </Button>
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-photo-shade/40 p-5" onClick={() => setOpen(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="account-title"
            className="relative w-full max-w-md rounded-3xl bg-background p-8 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <Button variant="icon" aria-label="Close account" onClick={() => setOpen(false)} className="absolute right-3 top-3">
              <X className="h-4 w-4" />
            </Button>
            <p className="eyebrow text-muted-foreground">Optional</p>
            {user ? (
              <>
                <h2 id="account-title" className="mt-4 text-4xl">
                  You're <i>signed in.</i>
                </h2>
                <p className="mt-4 text-sm text-muted-foreground">{user.email}</p>
                <p className="mt-4 text-sm leading-relaxed">
                  {pick ? <>Your pick, <strong>{pick.neighborhood}</strong> in {pick.city}, is saved to your account.</> : "Lock in a neighborhood and it'll be saved to your account."}
                </p>
                <Button className="mt-6 border py-2.5 text-xs" onClick={() => supabase.auth.signOut().then(() => setOpen(false))}>
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <h2 id="account-title" className="mt-4 text-4xl">
                  Keep your pick <i>everywhere.</i>
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  No account needed to use Soft Landing. Sign in with your email to save your locked pick and see it on any device.
                </p>
                {state === "sent" ? (
                  <p role="status" className="mt-6 rounded-xl border p-4 text-sm">
                    Check {email} for a sign-in link.
                  </p>
                ) : (
                  <form onSubmit={send} className="mt-6 flex flex-col gap-3">
                    <label htmlFor="account-email" className="eyebrow text-muted-foreground">Email</label>
                    <input
                      id="account-email"
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="rounded-full border bg-card px-5 py-3 text-base outline-none"
                    />
                    <Button type="submit" disabled={state === "sending"} className="bg-primary py-3 text-xs text-primary-foreground">
                      {state === "sending" ? "Sending…" : "Email me a sign-in link"}
                    </Button>
                    {state === "error" && <p role="alert" className="text-xs">{error || "Something went wrong. Please try again."}</p>}
                  </form>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
