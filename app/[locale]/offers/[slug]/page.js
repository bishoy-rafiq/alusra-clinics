import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { CalendarClock, BadgePercent, ArrowLeft, ArrowRight } from "lucide-react";
import BookButton from "@/components/ui/BookButton";
import OfferCard from "@/components/ui/OfferCard";
import OfferSubscribe from "@/components/OfferSubscribe";
import OfferGallery from "@/components/ui/OfferGallery";
import TrustStrip from "@/components/home/TrustStrip";
import { getOffers, getOfferBySlug } from "@/lib/data";
import { offerImages, offerCover } from "@/lib/offerImages";
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
      image: offerCover(offer) || "/images/logo.png",
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
  const images = offerImages(offer);
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

      <section className="relative overflow-hidden bg-mesh border-b border-brand-line/70">
        <div className="container-brand relative grid gap-10 py-12 md:py-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:items-center">
          <div className="mx-auto w-full max-w-lg lg:mx-0">
            <div className="relative overflow-hidden rounded-[2rem] border border-white bg-white p-2 shadow-card">
              {images.length ? (
                <OfferGallery images={images} alt={title} />
              ) : (
                <div className="relative flex aspect-[3/4] max-h-[72vh] w-full items-center justify-center overflow-hidden rounded-[1.6rem] bg-gradient-brand">
                  <BadgePercent size={72} className="text-white/70" />
                </div>
              )}
            </div>
          </div>

          <div>
            <Link
              href="/offers"
              className="group inline-flex items-center gap-2 text-sm font-bold text-brand-teal transition-colors hover:text-brand-aqua"
            >
              <BackIcon size={16} className="transition-transform group-hover:-translate-x-1" />
              {t("backToOffers")}
            </Link>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              {badge && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-gold-soft px-3.5 py-1.5 text-xs font-extrabold text-amber-700">
                  <BadgePercent size={12} className="text-brand-gold" />
                  {badge}
                </span>
              )}
              {offer.valid_until && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-mist px-3.5 py-1.5 text-xs font-extrabold text-brand-slate">
                  <CalendarClock size={12} className="text-brand-gold" />
                  {t("validUntil")} {formatDate(offer.valid_until, locale)}
                </span>
              )}
            </div>

            <h1 className="mt-4 font-display text-3xl font-extrabold leading-tight text-brand-ink md:text-5xl">{title}</h1>

            <p className="mt-5 max-w-xl whitespace-pre-line text-base leading-relaxed text-brand-slate">
              {description || t("subtitle")}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <BookButton name={title} kind="offer" label={t("book")} className="min-w-56" />
              <Link
                href="/offers"
                className="btn border border-brand-teal/30 bg-brand-mist text-brand-teal hover:border-brand-teal hover:bg-brand-teal hover:text-white"
              >
                {t("viewAll")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <TrustStrip />

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