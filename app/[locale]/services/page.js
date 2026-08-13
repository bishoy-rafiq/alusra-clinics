import { getTranslations, getLocale } from "next-intl/server";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import PageHeader from "@/components/ui/PageHeader";
import BookButton from "@/components/ui/BookButton";
import { getServices, getServiceCategories } from "@/lib/data";
import { getServiceImage } from "@/lib/service-image-map";
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
  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;

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
                {items.map((service) => {
                  const name = locale === "ar" ? service.name_ar : service.name_en;
                  const excerpt = locale === "ar" ? service.excerpt_ar : service.excerpt_en;
                  return (
                    <div key={service.id} className="card-brand group relative flex flex-col p-6">
                      <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-teal via-brand-teal-mid to-brand-gold opacity-40 transition-opacity duration-300 group-hover:opacity-100" />
                      <div className="flex items-start justify-between gap-3">
                        <Link href={`/services/${service.slug}`} className="relative block h-14 w-14 shrink-0 overflow-hidden rounded-2xl shadow-[var(--shadow-soft)] ring-1 ring-brand-line transition duration-300 group-hover:shadow-[var(--shadow-lifted)]">
                          <Image
                            src={getServiceImage(service)}
                            alt={name}
                            fill
                            sizes="56px"
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </Link>
                        <span className="rounded-full bg-brand-gold-soft px-2.5 py-1 text-[0.65rem] font-extrabold uppercase tracking-wide text-brand-gold">
                          {service.category === "dentistry" ? t("dentistry") : t("dermatology")}
                        </span>
                      </div>
                      <h3 className="mt-5 font-display text-lg font-bold text-brand-ink transition-colors group-hover:text-brand-teal">
                        <Link href={`/services/${service.slug}`}>{name}</Link>
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-brand-slate">{excerpt}</p>
                      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
                        <Link
                          href={`/services/${service.slug}`}
                          className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-teal transition group-hover:gap-2.5 group-hover:text-brand-aqua"
                        >
                          {t("readMore")} <Arrow size={15} />
                        </Link>
                        <BookButton name={name} kind="service" label={t("book")} className="px-4 py-2.5 text-sm" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}
