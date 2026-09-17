import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { CalendarClock, BadgePercent, ArrowLeft, ArrowRight, ZoomIn } from "lucide-react";
import BookButton from "@/components/ui/BookButton";
import OfferCard from "@/components/ui/OfferCard";
import OfferSubscribe from "@/components/OfferSubscribe";
import ImageZoom from "@/components/ui/ImageZoom";
import { getOffers, getOfferBySlug } from "@/lib/data";
import { offerSchema, breadcrumbSchema, localizedAlternates, pageOpenGraph, webPageSchema, SITE_URL } from "@/lib/seo";
import { routing } from "@/i18n/routing";
import { formatDate } from "@/lib/format";

export async function generateStaticParams() {
  const offers = await getOffers();
  return routing.locales.flatMap((locale) => offers.map((o) => ({ locale, slug: o.slug })));
}

export async function generateMetadata({ params }) {
  const { locale, slug } = await params;
  const offer = await getOfferBySlug(slug);
  if (!offer) return {};
  const name = locale === "ar" ? offer.title_ar : offer.title_en;
  const description = locale === "ar" ? offer.description_ar : offer.description_en;
  return {
    title: name,
    description,
    alternates: localizedAlternates(`/offers/${slug}`, locale),
    ...pageOpenGraph({
      locale,
      title: name,
      description,
      path: `/offers/${slug}`,
      image: offer.image_url || "/images/logo.png",
    }),
  };
}

export default async function OfferDetailPage({ params }) {
  const { locale, slug } = await params;
  const t = await getTranslations("offers");
  const offer = await getOfferBySlug(slug);
  if (!offer) notFound();

  const isAr = locale === "ar";
  const title = isAr ? offer.title_ar : offer.title_en;
  const description = isAr ? offer.description_ar : offer.description_en;
  const badge = isAr ? offer.badge_ar : offer.badge_en;
  const allOffers = await getOffers({ activeOnly: true });
  const related = allOffers.filter((o) => o.id !== offer.id).slice(0, 3);

  const schema = offerSchema({ locale, offer, url: `/${locale}/offers/${slug}` });
  const breadcrumb = breadcrumbSchema([
    { name: isAr ? "الرئيسية" : "Home", url: `${SITE_URL}/${locale}` },
    { name: t("title"), url: `${SITE_URL}/${locale}/offers` },
    { name: title, url: `${SITE_URL}/${locale}/offers/${slug}` },
  ]);

  const offerWebPage = webPageSchema({
    locale,
    name: title,
    description: isAr ? offer.description_ar : offer.description_en,
    url: `/${locale}/offers/${slug}`,
    mainEntityId: `${SITE_URL}/${locale}/offers/${slug}#offer`,
  });

  const BackIcon = isAr ? ArrowRight : ArrowLeft;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(offerWebPage) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-brand opacity-60" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.14),transparent_55%)]" />

        <div className="container-brand relative grid gap-8 py-10 md:py-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:items-center">
          <div className="mx-auto w-full max-w-lg lg:mx-0">
            <div className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-brand-ink/95 shadow-[var(--shadow-lifted)]">
              <div className="relative aspect-[3/4] max-h-[72vh] w-full">
                {offer.image_url ? (
                  <ImageZoom src={offer.image_url} alt={title}>
                    <Image
                      src={offer.image_url}
                      alt={title}
                      fill
                      priority
                      sizes="(min-width: 1024px) 45vw, 90vw"
                      className="object-contain"
                    />

                    <span className="pointer-events-none absolute inset-0" />
                    <span className="pointer-events-none absolute bottom-4 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-white/25 bg-black/40 px-4 py-2 text-xs font-extrabold text-white backdrop-blur-md transition-colors duration-300 group-hover/zoom:bg-black/60">
                      <ZoomIn size={14} className="text-brand-gold" />
                      {t("openImageHint")}
                    </span>
                  </ImageZoom>
                ) : (
                  <div className="relative flex h-full w-full items-center justify-center bg-gradient-brand">
                    <BadgePercent size={72} className="text-white/70" />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <Link
              href="/offers"
              className="group inline-flex items-center gap-2 text-sm font-bold text-white/90 transition-colors hover:text-white"
            >
              <BackIcon size={16} className="transition-transform group-hover:-translate-x-1" />
              {t("backToOffers")}
            </Link>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              {badge && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/20 px-3.5 py-1.5 text-xs font-extrabold text-white backdrop-blur-md">
                  <BadgePercent size={12} className="text-brand-gold" />
                  {badge}
                </span>
              )}
              {offer.valid_until && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/20 px-3.5 py-1.5 text-xs font-extrabold text-white/95 backdrop-blur-md">
                  <CalendarClock size={12} className="text-brand-gold" />
                  {t("validUntil")} {formatDate(offer.valid_until, locale)}
                </span>
              )}
            </div>

            <h1 className="mt-4 font-display text-3xl font-extrabold text-white md:text-5xl">{title}</h1>

            <div className="mt-6 max-w-xl">
              {description ? (
                <p className="whitespace-pre-line text-base leading-relaxed text-white/90">{description}</p>
              ) : (
                <p className="text-base leading-relaxed text-white/90">{t("subtitle")}</p>
              )}
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <BookButton name={title} kind="offer" label={t("book")} className="min-w-56" />
              <Link
                href="/offers"
                className="btn border border-white/30 bg-white/10 text-white backdrop-blur-md hover:border-white hover:bg-white hover:text-brand-ink"
              >
                {t("viewAll")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="container-brand">
          <h2 className="font-display text-2xl font-bold text-brand-ink md:text-3xl">
            {isAr ? "تفاصيل العرض" : "About this offer"}
          </h2>
          <p className="mt-4 max-w-3xl whitespace-pre-line text-base leading-relaxed text-brand-slate">
            {description || t("subtitle")}
          </p>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <div className="card-brand lg:col-span-2">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <p className="font-display text-lg font-bold text-brand-ink">{title}</p>
                {badge && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-gold-soft px-3 py-1.5 text-xs font-extrabold text-amber-700">
                    <BadgePercent size={13} className="text-brand-gold" />
                    {badge}
                  </span>
                )}
              </div>
              <div className="mt-6 max-w-sm">
                <BookButton name={title} kind="offer" label={t("book")} className="w-full" />
              </div>
            </div>

            <aside className="lg:col-span-1">
              <div className="card-brand sticky top-28 space-y-5 p-7">
                <p className="font-display text-lg font-bold leading-snug text-brand-ink">{title}</p>
                {offer.valid_until && (
                  <p className="inline-flex items-center gap-2 text-sm font-semibold text-brand-slate">
                    <CalendarClock size={15} className="text-brand-gold" />
                    {t("validUntil")} {formatDate(offer.valid_until, locale)}
                  </p>
                )}
                <BookButton name={title} kind="offer" label={t("book")} className="w-full" />
              </div>
            </aside>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section-y border-t border-brand-line bg-brand-mist pt-12 md:pt-16">
          <div className="container-brand">
            <h2 className="font-display text-2xl font-bold text-brand-ink md:text-3xl">{t("moreOffers")}</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((o, i) => (
                <OfferCard key={o.id} offer={o} locale={locale} t={t} featured={i === 0} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section-y">
        <div className="container-brand">
          <div className="mx-auto max-w-3xl">
            <OfferSubscribe />
          </div>
        </div>
      </section>
    </>
  );
}