/**
 * Offer image helpers.
 *
 * Offers can store multiple images. Depending on the Database version, images
 * live either in a dedicated `images` jsonb column or (fallback, when that
 * column does not exist yet) as a JSON array string inside `image_url`.
 * These helpers normalise both shapes so every consumer just calls
 * offerImages(offer) / offerCover(offer).
 */
function toStrings(v) {
  if (Array.isArray(v)) return v.filter((x) => typeof x === "string" && x.trim());
  return [];
}

function parseJsonList(raw) {
  if (typeof raw !== "string" || !raw.trim()) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? toStrings(parsed) : [];
  } catch {
    return [];
  }
}

export function offerImages(offer) {
  if (!offer) return [];

  const fromImages = parseJsonList(offer.images ?? null);
  if (fromImages.length) return fromImages;

  const raw = typeof offer.image_url === "string" ? offer.image_url.trim() : "";
  if (raw.startsWith("[")) {
    const fromImageUrl = parseJsonList(raw);
    if (fromImageUrl.length) return fromImageUrl;
  }
  return raw && !raw.startsWith("[") ? [raw] : [];
}

export function offerCover(offer) {
  return offerImages(offer)[0] || null;
}