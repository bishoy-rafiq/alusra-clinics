import { getTranslations, getLocale } from "next-intl/server";
import PageHeader from "@/components/ui/PageHeader";
import OfferCard from "@/components/ui/OfferCard";
import { getOffers } from "@/lib/data";
import { breadcrumbSchema, offerSchema, localizedAlternates, SITE_URL } from "@/lib/seo";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "offers" });
  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: localizedAlternates("/offers", locale),
  };
}

export default async function OffersPage({ params }) {
  const { locale } = await params;
  const t = await getTranslations("offers");
  const offers = await getOffers({ activeOnly: true });

  const breadcrumb = breadcrumbSchema([
    { name: locale === "ar" ? "الرئيسية" : "Home", url: `${SITE_URL}/${locale}` },
    { name: t("title"), url: `${SITE_URL}/${locale}/offers` },
  ]);

  const offerSchemas = offers.map((offer) =>
    offerSchema({ locale, offer, url: `/${locale}/offers` })
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      {offerSchemas.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}

      <PageHeader eyebrow={t("eyebrow")} title={t("title")} />

      <section className="section-y">
        <div className="container-brand">
          {offers.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {offers.map((offer, i) => (
                <OfferCard key={offer.id} offer={offer} locale={locale} t={t} featured={i === 0} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-brand-line bg-brand-mist p-12 text-center text-brand-slate">
              {t("empty")}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
