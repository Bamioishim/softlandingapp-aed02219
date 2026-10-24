import type { LockedPick } from "./locked-pick";

import { CHARACTER_URL } from "./character";

const INK = "#151513";
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

/** Loads an image with CORS enabled; resolves null on any failure. */
function loadImage(src: string | null | undefined): Promise<HTMLImageElement | null> {
  if (!src) return Promise.resolve(null);
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.decoding = "async";
    const t = setTimeout(() => resolve(null), 8000);
    img.onload = () => { clearTimeout(t); resolve(img); };
    img.onerror = () => { clearTimeout(t); resolve(null); };
    img.src = src;
  });
}

function drawCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, size: number) {
  const scale = Math.max(size / img.naturalWidth, size / img.naturalHeight);
  const w = img.naturalWidth * scale;
  const h = img.naturalHeight * scale;
  ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
}

/** True when the canvas can still be exported (i.e. not tainted by a cross-origin image). */
function canExport(ctx: CanvasRenderingContext2D) {
  try {
    ctx.getImageData(0, 0, 1, 1);
    return true;
  } catch {
    return false;
  }
}

function drawFallbackBg(ctx: CanvasRenderingContext2D, size: number) {
  const g = ctx.createLinearGradient(0, 0, size * 0.6, size);
  g.addColorStop(0, GREEN);
  g.addColorStop(0.55, "#2b3328");
  g.addColorStop(1, INK);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
}

/**
 * Draws the locked pick as a 1080×1080 rounded card matching the in-app popup:
 * destination photo background (gradient fallback if it can't be drawn, e.g. CORS), dark shade, white type.
 */
export async function renderPickCard(pick: LockedPick): Promise<Blob> {
  const size = 1080;
  const [photo, character] = await Promise.all([loadImage(pick.image), loadImage(CHARACTER_URL)]);
  try {
    await document.fonts?.ready;
  } catch {}

  const draw = (usePhoto: boolean, useCharacter: boolean) => {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas not supported");
    ctx.clearRect(0, 0, size, size);
    ctx.save();
    rounded(ctx, 0, 0, size, size, 96);
    ctx.clip();
    if (usePhoto && photo) drawCover(ctx, photo, size);
    else drawFallbackBg(ctx, size);
    const shade = ctx.createLinearGradient(0, 0, 0, size);
    shade.addColorStop(0, "rgba(0,0,0,0.78)");
    shade.addColorStop(0.45, "rgba(0,0,0,0.35)");
    shade.addColorStop(1, "rgba(0,0,0,0.72)");
    ctx.fillStyle = shade;
    ctx.fillRect(0, 0, size, size);

    const x = 90;
    const w = size - 180;
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.font = `600 26px ${SANS}`;
    ctx.fillText("MY SOFT LANDING", x, 140);

    // Place name: neighborhood + city in big serif type.
    const nameSize = fitText(ctx, pick.neighborhood, w, 140, SERIF);
    let y = 150 + nameSize;
    ctx.fillStyle = "#ffffff";
    ctx.font = `${nameSize}px ${SERIF}`;
    ctx.fillText(pick.neighborhood, x, y);
    y += 80;
    ctx.font = `italic 72px ${SERIF}`;
    ctx.fillStyle = "rgba(255,255,255,0.92)";
    ctx.fillText(pick.city, x, y);
    y += 50;
    ctx.fillStyle = "rgba(255,255,255,0.72)";
    ctx.font = `500 26px ${SANS}`;
    ctx.fillText(pick.borough.toUpperCase(), x, y);

    if (pick.score !== null) {
      y += 90;
      const label = `${pick.score}% match`;
      ctx.font = `600 34px ${SANS}`;
      const bw = ctx.measureText(label).width + 100;
      rounded(ctx, x, y - 52, bw, 76, 38);
      ctx.fillStyle = "rgba(255,255,255,0.18)";
      ctx.fill();
      ctx.fillStyle = "#9fb592";
      ctx.beginPath();
      ctx.arc(x + 38, y - 14, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.fillText(label, x + 62, y);
    }

    y += 44;
    ctx.font = `500 28px ${SANS}`;
    let cx = x;
    const chipMax = x + w * 0.62;
    for (const t of pick.tastes.slice(0, 4)) {
      const text = t.charAt(0).toUpperCase() + t.slice(1);
      const tw = ctx.measureText(text).width + 52;
      if (cx + tw > chipMax) break;
      rounded(ctx, cx, y, tw, 60, 30);
      ctx.fillStyle = "rgba(0,0,0,0.25)";
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.55)";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = "#ffffff";
      ctx.fillText(text, cx + 26, y + 40);
      cx += tw + 14;
    }

    // Character, bottom-right, ~45% of the card height, in front of the photo.
    if (useCharacter && character) {
      const ch = size * 0.45;
      const cw = (character.naturalWidth / character.naturalHeight) * ch;
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.45)";
      ctx.shadowBlur = 30;
      ctx.shadowOffsetY = 10;
      ctx.drawImage(character, size - cw - 60, size - ch - 50, cw, ch);
      ctx.restore();
    }

    ctx.fillStyle = "#ffffff";
    ctx.font = `44px ${SERIF}`;
    ctx.fillText("Soft Landing", x, size - 120);
    ctx.fillStyle = "rgba(255,255,255,0.75)";
    ctx.font = `500 24px ${SANS}`;
    ctx.fillText("softlandingapp.lovable.app", x, size - 80);
    ctx.restore();
    return { canvas, ctx };
  };

  let { canvas, ctx } = draw(true, true);
  if (!canExport(ctx)) ({ canvas, ctx } = draw(false, true)); // photo tainted by CORS: gradient instead
  if (!canExport(ctx)) ({ canvas, ctx } = draw(false, false));
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
