import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useSpeechSynthesis } from "@/hooks/use-speech";

class FakeUtterance { text: string; rate = 1; onend?: () => void; onerror?: () => void; constructor(t: string) { this.text = t; } }

function install() {
  const synth = { speaking: false, pending: false, speak: vi.fn(() => { synth.speaking = true; }), cancel: vi.fn(() => { synth.speaking = false; }) };
  Object.assign(window, { speechSynthesis: synth, SpeechSynthesisUtterance: FakeUtterance });
  return synth;
}

describe("useSpeechSynthesis 'Stop speaking' state", () => {
  afterEach(() => vi.useRealTimers());
  it("resets when speech ends even if the browser never fires onend", () => {
    vi.useFakeTimers();
    const synth = install();
    const { result } = renderHook(() => useSpeechSynthesis());
    act(() => result.current.speak("hello"));
    expect(result.current.speaking).toBe(true);
    act(() => { vi.advanceTimersByTime(1300); });
    expect(result.current.speaking).toBe(true); // still talking
    synth.speaking = false; // finished silently (no onend)
    act(() => { vi.advanceTimersByTime(1300); });
    expect(result.current.speaking).toBe(false);
  });
  it("resets when speech is blocked and never starts", () => {
    vi.useFakeTimers();
    const synth = install();
    synth.speak = vi.fn();
    const { result } = renderHook(() => useSpeechSynthesis());
    act(() => result.current.speak("hello"));
    act(() => { vi.advanceTimersByTime(1300); });
    expect(result.current.speaking).toBe(false);
  });
  it("cancels speech on navigation (pagehide) and unmount", () => {
    const synth = install();
    const { result, unmount } = renderHook(() => useSpeechSynthesis());
    act(() => result.current.speak("hello"));
    act(() => { window.dispatchEvent(new Event("pagehide")); });
    expect(result.current.speaking).toBe(false);
    act(() => result.current.speak("again"));
    unmount();
    expect(synth.cancel).toHaveBeenCalled();
  });
});
