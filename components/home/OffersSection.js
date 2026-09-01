import Image from "next/image";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CalendarClock, BadgePercent, ArrowLeft, ArrowRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import BookButton from "@/components/ui/BookButton";
import { getOffers } from "@/lib/data";
import { formatDate } from "@/lib/format";

export default async function OffersSection() {
  const locale = await getLocale();
  const t = await getTranslations("offers");
  const offers = await getOffers({ activeOnly: true });

  if (!offers?.length) return null;

  const isAr = locale === "ar";
  const Arrow = isAr ? ArrowRight : ArrowLeft;
  const [featured, ...rest] = offers.slice(0, 3);

  const title = (o) => (isAr ? o.title_ar : o.title_en);
  const desc = (o) => (isAr ? o.description_ar : o.description_en);
  const badge = (o) => (isAr ? o.badge_ar : o.badge_en);

  return (
    <section className="section-y bg-brand-mist" id="offers">
      <div className="container-brand">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />
          <Link href="/offers" className="group inline-flex items-center gap-2 text-sm font-bold text-brand-teal transition-colors hover:text-brand-aqua">
            {t("viewAll")}
            <ArrowLeft className={`h-4 w-4 transition-transform group-hover:-translate-x-1 ${isAr ? "" : "rotate-180 group-hover:translate-x-1"}`} />
          </Link>
        </div>

        <div className="mt-12 space-y-6">
          <div
            data-reveal="bottom"
            className="revealed group relative flex min-h-[26rem] flex-col overflow-hidden rounded-[1.75rem] border border-brand-line bg-brand-teal shadow-card transition-all duration-300 hover:-translate-y-2 hover:shadow-[var(--shadow-lifted)]"
          >
            {featured.image_url ? (
              <Image
                src={featured.image_url}
                alt={title(featured)}
                fill
                priority
                sizes="100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-brand-teal via-brand-teal-mid to-brand-aqua">
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
                <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-brand-gold/25 blur-2xl" />
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/90 via-brand-ink/45 to-brand-ink/5" />

            <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border-2 border-white/70 bg-gradient-to-br from-[#e9c977] to-[#c9a24b] px-4 py-2 text-sm font-extrabold uppercase tracking-wide text-brand-ink shadow-[var(--shadow-lifted)]">
              <BadgePercent size={15} />
              {badge(featured) || (isAr ? "عرض مميز" : "Featured")}
            </div>

            <div className="relative z-10 mt-auto flex flex-col gap-1.5 p-5 text-white md:p-7">
              <Link
                href={`/offers/${featured.slug}`}
                className="inline-flex items-start gap-2 underline-offset-4 transition-colors hover:text-brand-gold group-hover:underline"
              >
                <h3 className="font-display text-2xl font-bold leading-snug md:text-3xl">{title(featured)}</h3>
                <Arrow size={22} className="mt-1 shrink-0 text-brand-gold" />
              </Link>
              {desc(featured) && (
                <p className="mt-1 line-clamp-3 whitespace-pre-line text-sm leading-relaxed text-white/85 md:text-base">
                  {desc(featured)}
                </p>
              )}
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <BookButton name={title(featured)} kind="offer" label={t("bookCta")} variant="gold" className="w-full sm:w-auto" />
                <Link
                  href={`/offers/${featured.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/40 bg-white/10 px-4 py-2.5 text-sm font-bold text-white backdrop-blur-md transition-colors hover:bg-white/20"
                >
                  {t("details")} <Arrow size={15} />
                </Link>
                {featured.valid_until && (
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/80">
                    <CalendarClock size={15} className="text-brand-gold" />
                    {t("validUntil")} {formatDate(featured.valid_until, locale)}
                  </span>
                )}
              </div>
            </div>
          </div>

          {rest.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2">
              {rest.map((offer) => (
                <div
                  key={offer.id}
                  data-reveal="bottom"
                  className="revealed group relative flex min-h-[22rem] flex-col overflow-hidden rounded-[1.75rem] border border-brand-line bg-brand-teal shadow-card transition-all duration-300 hover:-translate-y-2 hover:shadow-[var(--shadow-lifted)]"
                >
                  {offer.image_url ? (
                    <Image
                      src={offer.image_url}
                      alt={title(offer)}
                      fill
                      sizes="(min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-teal via-brand-teal-mid to-brand-aqua">
                      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
                      <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-brand-gold/25 blur-2xl" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/90 via-brand-ink/45 to-brand-ink/5" />

                  {badge(offer) && (
                    <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-brand-gold/80 bg-brand-ink/60 px-3.5 py-2 text-xs font-extrabold uppercase tracking-wide text-brand-gold shadow-[var(--shadow-lifted)] backdrop-blur-md">
                      <BadgePercent size={13} />
                      <span className="max-w-[10rem] truncate">{badge(offer)}</span>
                    </div>
                  )}

                  <div className="relative z-10 mt-auto flex flex-col gap-1.5 p-5 text-white md:p-6">
                    <Link
                      href={`/offers/${offer.slug}`}
                      className="inline-flex items-start gap-2 underline-offset-4 transition-colors hover:text-brand-gold group-hover:underline"
                    >
                      <h4 className="font-display text-xl font-bold leading-snug md:text-2xl">{title(offer)}</h4>
                      <Arrow size={18} className="mt-1 shrink-0 text-brand-gold" />
                    </Link>
                    {desc(offer) && (
                      <p className="mt-1 line-clamp-2 whitespace-pre-line text-sm leading-relaxed text-white/85">
                        {desc(offer)}
                      </p>
                    )}
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <BookButton name={title(offer)} kind="offer" label={t("bookCta")} className="w-full sm:w-auto" />
                      <Link
                        href={`/offers/${offer.slug}`}
                        className="inline-flex items-center gap-1.5 text-sm font-bold text-white/90 underline underline-offset-4 transition-colors hover:text-brand-gold"
                      >
                        {t("details")} <Arrow size={13} />
                      </Link>
                      {offer.valid_until && (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/80">
                          <CalendarClock size={14} className="text-brand-gold" />
                          {formatDate(offer.valid_until, locale)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
