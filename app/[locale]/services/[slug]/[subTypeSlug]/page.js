import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import BookButton from "@/components/ui/BookButton";
import BeforeAfter from "@/components/ui/BeforeAfter";
import {
  getServiceSubTypes,
  getBeforeAfterCasesByService,
  getServiceSubTypeBySlug,
  getServices,
} from "@/lib/data";
import { getServiceImage } from "@/lib/service-image-map";
import { serviceSchema, webPageSchema, breadcrumbSchema, localizedAlternates, SITE_URL } from "@/lib/seo";

export async function generateMetadata({ params }) {
  const { locale, slug, subTypeSlug } = await params;
  const subType = await getServiceSubTypeBySlug({ parentSlug: slug, subTypeSlug });
  if (!subType) return {};
  const name = locale === "ar" ? subType.name_ar : subType.name_en;
  const excerpt = locale === "ar" ? subType.excerpt_ar : subType.excerpt_en;
  const image = getServiceImage(subType);
  return {
    title: name,
    description: excerpt,
    alternates: localizedAlternates(`/services/${slug}/${subTypeSlug}`, locale),
    openGraph: {
      title: name,
      description: excerpt,
      type: "article",
      images: [{ url: image }],
    },
  };
}

export default async function ServiceSubTypePage({ params }) {
  const { locale, slug, subTypeSlug } = await params;
  const t = await getTranslations("services");
  const subType = await getServiceSubTypeBySlug({ parentSlug: slug, subTypeSlug });
  const parent = (await getServices()).find((s) => s.slug === slug);
  if (!subType) notFound();

  const beforeAfterCases = await getBeforeAfterCasesByService(subType);
  const siblings = parent
    ? await getServiceSubTypes({ serviceId: parent.id, serviceSlug: parent.slug })
    : [];
  const baT = await getTranslations("beforeAfter");
  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;

  const name = locale === "ar" ? subType.name_ar : subType.name_en;
  const parentName = parent ? (locale === "ar" ? parent.name_ar : parent.name_en) : name;
  const excerpt = locale === "ar" ? subType.excerpt_ar : subType.excerpt_en;
  const description = locale === "ar" ? subType.description_ar : subType.description_en;
  const categoryLabel =
    subType.category === "dentistry" ? t("dentistry") : t("dermatology");

  const schema = serviceSchema({
    locale,
    name,
    description,
    url: `${SITE_URL}/${locale}/services/${slug}/${subTypeSlug}`,
    category: categoryLabel,
    image: `${SITE_URL}${getServiceImage(subType)}`,
  });
  const breadcrumb = breadcrumbSchema([
    { name: locale === "ar" ? "الرئيسية" : "Home", url: `${SITE_URL}/${locale}` },
    { name: t("title"), url: `${SITE_URL}/${locale}/services` },
    ...(parent
      ? [{ name: parentName, url: `${SITE_URL}/${locale}/services/${slug}` }]
      : []),
    { name, url: `${SITE_URL}/${locale}/services/${slug}/${subTypeSlug}` },
  ]);

  const serviceWebPage = webPageSchema({
    locale,
    name,
    description: excerpt || description,
    url: `/${locale}/services/${slug}/${subTypeSlug}`,
    mainEntityId: `${SITE_URL}/${locale}/services/${slug}/${subTypeSlug}#service`,
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceWebPage) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <section className="relative overflow-hidden">
        <div className="relative h-64 md:h-80">
          <Image
            src={getServiceImage(subType)}
            alt={name}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/85 via-brand-ink/40 to-brand-ink/20" />
        </div>
        <div className="container-brand absolute inset-x-0 bottom-0 pb-8">
          <div className="mb-3 flex items-center gap-3">
            <Link
              href={`/services/${slug}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm ring-1 ring-white/25 transition hover:bg-white/20"
            >
              <Arrow size={14} /> {parentName}
            </Link>
          </div>
          <p className="eyebrow mb-3 text-brand-gold-soft">{categoryLabel}</p>
          <h1 className="font-display text-3xl font-extrabold text-white md:text-4xl">{name}</h1>
        </div>
      </section>

      <section className="section-y">
        <div className="container-brand grid gap-12 lg:grid-cols-3">
          <div className="prose-brand lg:col-span-2">
            <p className="whitespace-pre-line text-base leading-relaxed text-brand-slate">{description}</p>
          </div>
          <aside className="lg:col-span-1 space-y-6">
            <div className="card-brand sticky top-28 space-y-4 p-7">
              <p className="font-display text-lg font-bold text-brand-ink">{name}</p>
              <p className="mt-2 text-sm leading-relaxed text-brand-slate">{excerpt}</p>
              <BookButton name={name} kind="service" label={t("book")} className="w-full" />
            </div>
          </aside>
        </div>

        {siblings.length > 0 && (
          <div className="container-brand mt-14 border-t border-brand-line pt-10">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-display text-xl font-bold text-brand-ink">
                  {t("typesTitle", { name: parentName })}
                </h2>
                <Link href={`/services/${slug}`} className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-teal">
                  {t("viewAll")} <Arrow size={15} />
                </Link>
              </div>
              <div className="flex flex-wrap gap-3">
                {siblings.map((st) => {
                  const stName = locale === "ar" ? st.name_ar : st.name_en;
                  const isActive = st.slug === subTypeSlug;
                  return (
                    <Link
                      key={st.id}
                      href={`/services/${slug}/${st.slug}`}
                      className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                        isActive
                          ? "bg-brand-teal text-white"
                          : "bg-brand-mist text-brand-ink hover:bg-brand-teal/15"
                      }`}
                    >
                      {stName}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {beforeAfterCases.length > 0 && (
          <div className="container-brand mt-16 border-t border-brand-line pt-12">
            <div className="flex flex-col items-center gap-2 text-center">
              <p className="eyebrow mb-2">{baT("eyebrow")}</p>
              <h2 className="font-display text-2xl font-bold text-brand-ink md:text-3xl">{t("resultsTitle")}</h2>
            </div>

            <div className="mt-8 grid gap-8 sm:grid-cols-2">
              {beforeAfterCases.map((c) => {
                const title = locale === "ar" ? c.title_ar : c.title_en;
                const cDesc = locale === "ar" ? c.description_ar : c.description_en;
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
                      {cDesc && <p className="mt-1 text-sm text-brand-slate">{cDesc}</p>}
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
