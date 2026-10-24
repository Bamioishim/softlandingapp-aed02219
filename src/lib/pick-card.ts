import type { LockedPick } from "./locked-pick";

const BG = "#efebdf";
const CARD = "#ffffff";
const INK = "#151513";
const MUTED = "#8a8576";
const LINE = "#cfc8b6";
const GREEN = "#53634c";
const SERIF = '"Instrument Serif", Georgia, serif';
const SANS = '"Inter", system-ui, sans-serif';

function rounded(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function fitText(ctx: CanvasRenderingContext2D, text: string, max: number, size: number, family: string) {
  let s = size;
  do {
    ctx.font = `${s}px ${family}`;
    if (ctx.measureText(text).width <= max) break;
    s -= 4;
  } while (s > 40);
  return s;
}

/** Draws the locked pick as a 1080×1080 rounded-square card and returns it as a PNG blob. */
export async function renderPickCard(pick: LockedPick): Promise<Blob> {
  const size = 1080;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");
  try {
    await document.fonts?.ready;
  } catch {}
  // Transparent corners so the square itself is rounded.
  ctx.clearRect(0, 0, size, size);
  rounded(ctx, 0, 0, size, size, 120);
  ctx.fillStyle = BG;
  ctx.fill();
  ctx.save();
  rounded(ctx, 70, 70, size - 140, size - 140, 72);
  ctx.fillStyle = CARD;
  ctx.fill();
  ctx.restore();

  const x = 140;
  const w = size - 280;
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = MUTED;
  ctx.font = `600 26px ${SANS}`;
  ctx.fillText("MY SOFT LANDING", x, 190);

  ctx.fillStyle = INK;
  ctx.font = `64px ${SERIF}`;
  ctx.fillText(`In ${pick.city},`, x, 300);
  ctx.font = `italic 64px ${SERIF}`;
  ctx.fillText("I'm landing in", x, 375);

  const nameSize = fitText(ctx, pick.neighborhood, w, 150, SERIF);
  ctx.font = `${nameSize}px ${SERIF}`;
  ctx.fillText(pick.neighborhood, x, 375 + nameSize + 10);

  let y = 375 + nameSize + 80;
  ctx.fillStyle = MUTED;
  ctx.font = `500 28px ${SANS}`;
  ctx.fillText(`${pick.borough.toUpperCase()}`, x, y);

  if (pick.score !== null) {
    y += 80;
    const label = `${pick.score}% match`;
    ctx.font = `600 34px ${SANS}`;
    const bw = ctx.measureText(label).width + 100;
    rounded(ctx, x, y - 50, bw, 76, 38);
    ctx.fillStyle = BG;
    ctx.fill();
    ctx.fillStyle = GREEN;
    ctx.beginPath();
    ctx.arc(x + 38, y - 12, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = INK;
    ctx.fillText(label, x + 62, y);
  }

  // Taste chips
  y += 70;
  ctx.font = `500 28px ${SANS}`;
  let cx = x;
  for (const t of pick.tastes.slice(0, 4)) {
    const text = t.charAt(0).toUpperCase() + t.slice(1);
    const tw = ctx.measureText(text).width + 52;
    if (cx + tw > x + w) break;
    rounded(ctx, cx, y, tw, 60, 30);
    ctx.strokeStyle = LINE;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = INK;
    ctx.fillText(text, cx + 26, y + 40);
    cx += tw + 14;
  }

  ctx.strokeStyle = LINE;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, size - 200);
  ctx.lineTo(x + w, size - 200);
  ctx.stroke();
  ctx.fillStyle = INK;
  ctx.font = `44px ${SERIF}`;
  ctx.fillText("Soft Landing", x, size - 130);
  ctx.fillStyle = MUTED;
  ctx.font = `500 24px ${SANS}`;
  const url = "softlandingapp.lovable.app";
  ctx.fillText(url, x + w - ctx.measureText(url).width, size - 134);

  return await new Promise<Blob>((res, rej) => canvas.toBlob((b) => (b ? res(b) : rej(new Error("Could not create image"))), "image/png"));
}

export function pickFileName(pick: LockedPick) {
  return `soft-landing-${pick.neighborhood}-${pick.city}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "") + ".png";
}

/** Shares the card with the Web Share API when files are supported, otherwise downloads it. */
export async function sharePickCard(pick: LockedPick): Promise<"shared" | "downloaded" | "cancelled"> {
  const blob = await renderPickCard(pick);
  const name = pickFileName(pick);
  const file = typeof File !== "undefined" ? new File([blob], name, { type: "image/png" }) : null;
  const text = `I'm landing in ${pick.neighborhood}, ${pick.city}${pick.score !== null ? ` — ${pick.score}% match` : ""}. Found with Soft Landing.`;
  if (file && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: "My Soft Landing pick", text });
      return "shared";
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") return "cancelled";
    }
  }
  downloadBlob(blob, name);
  return "downloaded";
}

export function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
