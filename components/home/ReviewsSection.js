import { getTranslations, getLocale } from "next-intl/server";
import { Star, ExternalLink, Quote } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { getTestimonials, getSettings } from "@/lib/data";
import { getGooglePlaceReviews } from "@/lib/googlePlaces";

function GoogleG({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.6-.4-3.9z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 18.9 12 24 12c3.1 0 5.9 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C36.9 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.9z" />
    </svg>
  );
}

function Stars({ rating }) {
  return (
    <div className="flex gap-0.5 text-brand-gold">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={14} fill={i < rating ? "currentColor" : "none"} strokeWidth={1.5} />
      ))}
    </div>
  );
}

export default async function ReviewsSection() {
  const locale = await getLocale();
  const t = await getTranslations("reviews");
  const settings = await getSettings();

  const [live, manual] = await Promise.all([getGooglePlaceReviews(locale), getTestimonials()]);

  const googleReviews = live?.reviews || [];
  const reviews = googleReviews.length
    ? googleReviews
    : manual.map((m) => ({
        author: m.author_name,
        rating: m.rating,
        text: locale === "ar" ? m.text_ar : m.text_en,
        avatar: m.avatar_url,
      }));

  return (
    <section className="section-y bg-brand-mist" id="reviews">
      <div className="container-brand">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow={t("eyebrow")} title={t("title")} />
          {settings?.maps_url && (
            <a href={settings.maps_url} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
              {t("viewOnGoogle")} <ExternalLink size={15} />
            </a>
          )}
        </div>

        {live && (
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4 rounded-3xl border border-brand-line bg-white px-6 py-5 shadow-soft">
            <span className="icon-chip flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-soft ring-1 ring-brand-line">
              <GoogleG size={26} />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-display text-2xl font-extrabold text-brand-ink">{live.rating}</p>
                <Stars rating={Math.round(live.rating)} />
              </div>
              <p className="mt-0.5 text-sm font-semibold text-brand-slate">
                {t("basedOn", { count: live.totalReviews })}
              </p>
            </div>
            <span className="ms-auto inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1.5 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              {t("liveFromGoogle")}
            </span>
          </div>
        )}

        {reviews.length ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.slice(0, 6).map((r, i) => (
              <div key={i} data-reveal="bottom" className="revealed card-brand relative p-7">
                <Quote size={40} className="absolute end-6 top-6 text-brand-mist" />
                <Stars rating={r.rating} />
                <p className="relative mt-4 text-sm leading-relaxed text-brand-slate">&ldquo;{r.text}&rdquo;</p>
                <div className="mt-5 flex items-center gap-3 border-t border-brand-line pt-4">
                  {r.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={r.avatar} alt={r.author} className="h-9 w-9 rounded-full object-cover ring-2 ring-brand-mist" />
                  ) : (
                    <span className="icon-chip flex h-9 w-9 items-center justify-center rounded-full bg-gradient-brand text-xs font-bold text-white">
                      {(r.author || "?")[0]}
                    </span>
                  )}
                  <p className="text-sm font-bold text-brand-ink">{r.author}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-3xl border border-dashed border-brand-line bg-white p-12 text-center">
            <p className="text-brand-slate">{t("empty")}</p>
          </div>
        )}
      </div>
    </section>
  );
}
