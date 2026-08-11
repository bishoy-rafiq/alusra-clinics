/**
 * Optional: fetches live reviews from the Google Places API (New) if
 * GOOGLE_PLACES_API_KEY and GOOGLE_PLACE_ID are set in the environment.
 * Google's API only ever returns up to 5 reviews and cannot be used to
 * backfill a full history — that's expected/by design on Google's side.
 * If it isn't configured, or the request fails, this returns null so the
 * caller can fall back to the admin-managed `testimonials` table.
 */
export async function getGooglePlaceReviews(locale = "ar") {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!apiKey || !placeId) return null;

  try {
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${placeId}?fields=rating,userRatingCount,reviews&languageCode=${locale}`,
      {
        headers: { "X-Goog-Api-Key": apiKey },
        next: { revalidate: 60 * 60 * 6 }, // refresh every 6 hours
      }
    );
    if (!res.ok) {
      const body = await res.text();
      console.error(`[googlePlaces] HTTP ${res.status}: ${body}`);
      return null;
    }
    const data = await res.json();

    return {
      rating: data.rating,
      totalReviews: data.userRatingCount,
      reviews: (data.reviews || []).map((r) => ({
        author: r.authorAttribution?.displayName,
        avatar: r.authorAttribution?.photoUri,
        rating: r.rating,
        text: r.text?.text,
        relativeTime: r.relativePublishTimeDescription,
      })),
    };
  } catch {
    return null;
  }
}
