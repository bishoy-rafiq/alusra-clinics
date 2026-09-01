import { getTranslations } from "next-intl/server";
import PageHeader from "@/components/ui/PageHeader";
import ServiceCard from "@/components/ui/ServiceCard";
import { getServices, getServiceCategories } from "@/lib/data";
import { breadcrumbSchema, itemListSchema, localizedAlternates, pageOpenGraph, SITE_URL } from "@/lib/seo";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "services" });
  const title = t("title");
  const description = t("subtitle");
  return {
    title,
    description,
    alternates: localizedAlternates("/services", locale),
    ...pageOpenGraph({ locale, title, description, path: "/services" }),
  };
}

export default async function ServicesPage({ params }) {
  const { locale } = await params;
  const t = await getTranslations("services");
  const [services, categories] = await Promise.all([getServices(), getServiceCategories()]);

  const breadcrumb = breadcrumbSchema([
    { name: locale === "ar" ? "الرئيسية" : "Home", url: `${SITE_URL}/${locale}` },
    { name: t("title"), url: `${SITE_URL}/${locale}/services` },
  ]);

  const itemList = itemListSchema(
    services.map((service) => ({
      name: locale === "ar" ? service.name_ar : service.name_en,
      url: `${SITE_URL}/${locale}/services/${service.slug}`,
    }))
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      {itemList.itemListElement.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
      )}

      <PageHeader eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />

      {categories.map((category) => {
        const items = services.filter((s) => s.category === category.slug);
        if (!items.length) return null;
        const categoryName = locale === "ar" ? category.name_ar : category.name_en;

        return (
          <section key={category.slug} className="section-y">
            <div className="container-brand">
              <h2 className="font-display text-2xl font-bold text-brand-ink md:text-3xl">{categoryName}</h2>
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}
