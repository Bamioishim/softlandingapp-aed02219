import { useCallback, useEffect, useRef, useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRec = any;

export function useSpeechRecognition(onFinal: (text: string) => void) {
  const [supported, setSupported] = useState<boolean | null>(null);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recRef = useRef<AnyRec>(null);
  const finalRef = useRef(onFinal);
  finalRef.current = onFinal;

  useEffect(() => {
    const w = window as AnyRec;
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
    setSupported(!!SR);
    if (!SR) return;
    const rec = new SR();
    rec.lang = "en-US";
    rec.interimResults = true;
    rec.continuous = false;
    let latest = "";
    rec.onresult = (e: AnyRec) => {
      latest = Array.from(e.results).map((r: AnyRec) => r[0].transcript).join("");
      setTranscript(latest);
    };
    rec.onend = () => {
      setListening(false);
      if (latest.trim()) finalRef.current(latest.trim());
      latest = "";
      setTranscript("");
    };
    rec.onerror = () => setListening(false);
    recRef.current = rec;
    return () => rec.abort();
  }, []);

  const start = useCallback(() => {
    if (!recRef.current) return;
    window.speechSynthesis?.cancel();
    setTranscript("");
    try {
      recRef.current.start();
      setListening(true);
    } catch {
      /* already started */
    }
  }, []);
  const stop = useCallback(() => recRef.current?.stop(), []);

  return { supported, listening, transcript, start, stop };
}

// "Stop speaking" used to stick after results: browsers (Safari/iOS especially) often never fire
// onend/onerror — when speech is blocked without a user gesture, when cancel() replaces an utterance,
// or when the utterance object is garbage-collected. So we also watch speechSynthesis.speaking and
// reset on unmount/navigation.
export function useSpeechSynthesis() {
  const [speaking, setSpeaking] = useState(false);
  const current = useRef<SpeechSynthesisUtterance | null>(null); // keeps the utterance alive (GC bug)
  const poll = useRef<ReturnType<typeof setInterval> | null>(null);
  const stopPoll = useCallback(() => {
    if (poll.current) clearInterval(poll.current);
    poll.current = null;
  }, []);
  const done = useCallback(() => {
    stopPoll();
    current.current = null;
    setSpeaking(false);
  }, [stopPoll]);
  const speak = useCallback((text: string) => {
    const s = typeof window !== "undefined" ? window.speechSynthesis : undefined;
    if (!s) return;
    s.cancel();
    stopPoll();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1.02;
    u.onend = () => current.current === u && done();
    u.onerror = () => current.current === u && done();
    current.current = u;
    setSpeaking(true);
    s.speak(u);
    let idle = 0;
    poll.current = setInterval(() => {
      // Two consecutive idle checks (~1.2s) without speaking/pending means it ended or never started.
      idle = s.speaking || s.pending ? 0 : idle + 1;
      if (idle >= 2) done();
    }, 600);
  }, [done, stopPoll]);
  const cancel = useCallback(() => {
    if (typeof window !== "undefined") window.speechSynthesis?.cancel();
    done();
  }, [done]);
  useEffect(() => {
    const onHide = () => cancel();
    window.addEventListener("pagehide", onHide);
    return () => {
      window.removeEventListener("pagehide", onHide);
      cancel();
    };
  }, [cancel]);
  return { speaking, speak, cancel };
}
