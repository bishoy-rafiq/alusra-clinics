import Image from "next/image";
import { CalendarClock, BadgePercent } from "lucide-react";
import BookButton from "@/components/ui/BookButton";
import { formatDate } from "@/lib/format";

export default function OfferCard({ offer, locale, t, featured = false }) {
  const title = locale === "ar" ? offer.title_ar : offer.title_en;
  const description = locale === "ar" ? offer.description_ar : offer.description_en;
  const badge = locale === "ar" ? offer.badge_ar : offer.badge_en;

  return (
    <div data-reveal="bottom" className="revealed group relative">
      <div className="absolute -inset-px rounded-[1.75rem] bg-gradient-to-br from-brand-gold via-brand-gold/30 to-brand-teal opacity-60 blur-[2px] transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative flex h-full flex-col overflow-hidden rounded-[1.7rem] border border-white/60 bg-white shadow-card transition-transform duration-300 group-hover:-translate-y-2 group-hover:shadow-[var(--shadow-lifted)]">
        {featured && (
          <span className="absolute start-5 top-0 z-20 rounded-b-2xl bg-gradient-to-br from-[#c9a24b] to-[#dcbc6f] px-4 py-1.5 text-[0.65rem] font-extrabold uppercase tracking-wide text-brand-ink shadow-glow">
            {locale === "ar" ? "عرض مميز" : "Featured"}
          </span>
        )}

        <div className="relative aspect-[4/3] w-full overflow-hidden">
          {offer.image_url ? (
            <Image
              src={offer.image_url}
              alt={title}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="relative flex h-full w-full items-center justify-center bg-gradient-brand">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.18),transparent_60%)]" />
              <BadgePercent size={52} className="text-white/70" />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/85 via-brand-ink/25 to-transparent" />

          <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
            <h3 className="font-display text-xl font-bold leading-tight text-white md:text-2xl">{title}</h3>
            {badge && (
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-white/30 bg-white/15 px-3 py-1 text-xs font-extrabold text-white backdrop-blur-md">
                <BadgePercent size={12} className="text-brand-gold" />
                {badge}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col p-5 md:p-6">
          {description && (
            <p className="line-clamp-2 text-sm leading-relaxed text-brand-slate">{description}</p>
          )}

          <div className="mt-5">
            <BookButton
              name={title}
              kind="offer"
              label={t("bookCta")}
              variant={featured ? "gold" : "whatsapp"}
              className="w-full"
            />
          </div>

          {offer.valid_until ? (
            <p className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-full bg-brand-mist px-3 py-1.5 text-xs font-semibold text-brand-slate">
              <CalendarClock size={13} className="text-brand-gold" />
              {t("validUntil")} {formatDate(offer.valid_until, locale)}
            </p>
          ) : (
            <p className="mt-4 text-center text-xs font-extrabold uppercase tracking-wider text-brand-gold">
              {locale === "ar" ? "عرض محدود" : "Limited offer"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
