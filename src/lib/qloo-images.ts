type ImageCandidate = { url: string; width: number; height: number };

export function originalImage(url: string): string {
  try {
    const u = new URL(url);
    for (const key of [...u.searchParams.keys()]) {
      if (/^(w|width|h|height|size|fit|q|quality|dpr|maxwidth|maxheight|resize|crop)$/i.test(key)) u.searchParams.delete(key);
    }
    return u.toString();
  } catch { return url; }
}

// Only inspect explicit image fields, never arbitrary provider links.
export function placeImages(entity: unknown): ImageCandidate[] {
  const found: ImageCandidate[] = [];
  const read = (value: unknown) => {
    if (Array.isArray(value)) { value.forEach(read); return; }
    if (!value || typeof value !== "object") return;
    const image = value as Record<string, unknown>;
    if (typeof image.url === "string") {
      try {
        const url = new URL(image.url);
        if (url.protocol !== "https:" && url.protocol !== "http:") return;
        const dimension = (key: "width" | "height", short: string) => {
          const n = Number(image[key] ?? url.searchParams.get(key) ?? url.searchParams.get(short));
          return Number.isFinite(n) && n > 0 ? n : 0;
        };
        found.push({ url: originalImage(image.url), width: dimension("width", "w"), height: dimension("height", "h") });
      } catch { /* Invalid provider image, skip it. */ }
    }
    for (const key of ["original", "large", "medium", "small", "thumbnail", "variants", "sizes", "images"]) {
      if (key in image) read(image[key]);
    }
  };
  if (entity && typeof entity === "object") {
    const row = entity as Record<string, unknown>;
    const properties = row.properties && typeof row.properties === "object" ? row.properties as Record<string, unknown> : {};
    [properties.image, properties.images, row.image, row.images].forEach(read);
  }
  return found.sort((a, b) => b.width - a.width || b.height - a.height);
}

export function canCoverImage(naturalWidth: number, naturalHeight: number, width: number, height: number): boolean {
  return naturalWidth >= width * 1.035 && naturalHeight >= height * 1.035;
}