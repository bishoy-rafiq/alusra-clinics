import { getTranslations, getLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import BookButton from "@/components/ui/BookButton";
import BeforeAfter from "@/components/ui/BeforeAfter";
import { getServices, getServiceBySlug, getBeforeAfterCasesByService } from "@/lib/data";
import { getServiceImage } from "@/lib/service-image-map";
import { serviceSchema, breadcrumbSchema, localizedAlternates, SITE_URL } from "@/lib/seo";
import { routing } from "@/i18n/routing";

export async function generateStaticParams() {
  const services = await getServices();
  return routing.locales.flatMap((locale) => services.map((s) => ({ locale, slug: s.slug })));
}

export async function generateMetadata({ params }) {
  const { locale, slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return {};
  const name = locale === "ar" ? service.name_ar : service.name_en;
  const excerpt = locale === "ar" ? service.excerpt_ar : service.excerpt_en;
  const image = getServiceImage(service);
  return {
    title: name,
    description: excerpt,
    alternates: localizedAlternates(`/services/${slug}`, locale),
    openGraph: {
      title: name,
      description: excerpt,
      type: "article",
      images: [{ url: image }],
    },
  };
}

export default async function ServiceDetailPage({ params }) {
  const { locale, slug } = await params;
  const t = await getTranslations("services");
  const service = await getServiceBySlug(slug);
  if (!service) notFound();

  const beforeAfterCases = await getBeforeAfterCasesByService(service);  const baT = await getTranslations("beforeAfter");
  const excerpt = locale === "ar" ? service.excerpt_ar : service.excerpt_en;
  const name = locale === "ar" ? service.name_ar : service.name_en;
  const description = locale === "ar" ? service.description_ar : service.description_en;
  const categoryLabel = service.category === "dentistry" ? t("dentistry") : t("dermatology");

  const schema = serviceSchema({
    locale,
    name,
    description,
    url: `${SITE_URL}/${locale}/services/${slug}`,
    category: categoryLabel,
    image: `${SITE_URL}${getServiceImage(service)}`,
  });
  const breadcrumb = breadcrumbSchema([
    { name: locale === "ar" ? "الرئيسية" : "Home", url: `${SITE_URL}/${locale}` },
    { name: t("title"), url: `${SITE_URL}/${locale}/services` },
    { name, url: `${SITE_URL}/${locale}/services/${slug}` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <section className="relative overflow-hidden">
        <div className="relative h-64 md:h-80">
          <Image
            src={getServiceImage(service)}
            alt={name}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/85 via-brand-ink/40 to-brand-ink/20" />
        </div>
        <div className="container-brand absolute inset-x-0 bottom-0 pb-8">
          <p className="eyebrow mb-3 text-brand-gold-soft">{categoryLabel}</p>
          <h1 className="font-display text-3xl font-extrabold text-white md:text-4xl">{name}</h1>
        </div>
      </section>

      <section className="section-y">
        <div className="container-brand grid gap-12 lg:grid-cols-3">
          <div className="prose-brand lg:col-span-2">
            <p className="whitespace-pre-line text-base leading-relaxed text-brand-slate">{description}</p>
          </div>
          <aside className="lg:col-span-1">
            <div className="card-brand sticky top-28 space-y-4 p-7">
              <p className="font-display text-lg font-bold text-brand-ink">{name}</p>
                <p className="mt-2 text-sm leading-relaxed text-brand-slate">{excerpt}</p>
              <BookButton name={name} kind="service" label={t("book")} className="w-full" />
            </div>
          </aside>
        </div>

        {beforeAfterCases.length > 0 && (
          <div className="container-brand mt-16 border-t border-brand-line pt-12">
              <div className="flex flex-col items-center gap-2 text-center">
                <p className="eyebrow mb-2">{baT("eyebrow")}</p>
                <h2 className="font-display text-2xl font-bold text-brand-ink md:text-3xl">{t("resultsTitle")}</h2>
              </div>
 
            <div className="mt-8 grid gap-8 sm:grid-cols-2">
              {beforeAfterCases.map((c) => {
                const title = locale === "ar" ? c.title_ar : c.title_en;
                const description = locale === "ar" ? c.description_ar : c.description_en;
                return (
                  <figure key={c.id}>
                    <BeforeAfter
                      before={c.before_image}
                      after={c.after_image}
                      alt={title}
                      labelBefore={baT("before")}
                      labelAfter={baT("after")}
                      hint={baT("drag")}
                    />
                    <figcaption className="mt-4 text-center">
                      <h3 className="font-display text-lg font-bold text-brand-ink">{title}</h3>
                      {description && <p className="mt-1 text-sm text-brand-slate">{description}</p>}
                    </figcaption>
                  </figure>
                );
              })}
            </div>
            <p className="mt-8 text-center text-xs text-brand-slate">{baT("note")}</p>
          </div>
        )}
      </section>
    </>
  );
}
