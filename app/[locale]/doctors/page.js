import { getTranslations, getLocale } from "next-intl/server";
import PageHeader from "@/components/ui/PageHeader";
import DoctorCard from "@/components/ui/DoctorCard";
import { getDoctors } from "@/lib/data";
import { breadcrumbSchema, physicianSchema, localizedAlternates, SITE_URL } from "@/lib/seo";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "doctors" });
  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: localizedAlternates("/doctors", locale),
  };
}

export default async function DoctorsPage({ params }) {
  const { locale } = await params;
  const t = await getTranslations("doctors");
  const doctors = await getDoctors();

  const breadcrumb = breadcrumbSchema([
    { name: locale === "ar" ? "الرئيسية" : "Home", url: `${SITE_URL}/${locale}` },
    { name: t("title"), url: `${SITE_URL}/${locale}/doctors` },
  ]);

  const physicianSchemas = doctors.map((doctor) =>
    physicianSchema({ locale, doctor, url: `/${locale}/doctors` })
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      {physicianSchemas.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}

      <PageHeader eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />

      <section className="section-y">
        <div className="container-brand">
          {doctors.length ? (
            <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
              {doctors.map((doctor) => (
                <DoctorCard key={doctor.id} doctor={doctor} locale={locale} />
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
