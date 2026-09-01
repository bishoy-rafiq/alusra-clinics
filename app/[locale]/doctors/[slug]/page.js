import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Stethoscope, ArrowLeft, ArrowRight } from "lucide-react";
import BookButton from "@/components/ui/BookButton";
import DoctorCard from "@/components/ui/DoctorCard";
import { getDoctors, getDoctorBySlug } from "@/lib/data";
import { physicianSchema, breadcrumbSchema, localizedAlternates, pageOpenGraph, webPageSchema, SITE_URL } from "@/lib/seo";
import { routing } from "@/i18n/routing";

export async function generateStaticParams() {
  const doctors = await getDoctors();
  return routing.locales.flatMap((locale) => doctors.map((d) => ({ locale, slug: d.slug })));
}

export async function generateMetadata({ params }) {
  const { locale, slug } = await params;
  const doctor = await getDoctorBySlug(slug);
  if (!doctor) return {};
  const name = locale === "ar" ? doctor.name_ar : doctor.name_en;
  const specialty = locale === "ar" ? doctor.specialty_ar : doctor.specialty_en;
  const bio = locale === "ar" ? doctor.bio_ar : doctor.bio_en;
  return {
    title: name,
    description: specialty || bio || undefined,
    alternates: localizedAlternates(`/doctors/${slug}`, locale),
    ...pageOpenGraph({
      locale,
      title: name,
      description: specialty || bio || "",
      path: `/doctors/${slug}`,
      image: doctor.photo_url || "/images/logo.png",
    }),
  };
}

export default async function DoctorDetailPage({ params }) {
  const { locale, slug } = await params;
  const t = await getTranslations("doctors");
  const doctor = await getDoctorBySlug(slug);
  if (!doctor) notFound();

  const isAr = locale === "ar";
  const name = isAr ? doctor.name_ar : doctor.name_en;
  const specialty = isAr ? doctor.specialty_ar : doctor.specialty_en;
  const bio = isAr ? doctor.bio_ar : doctor.bio_en;
  const allDoctors = await getDoctors();
  const related = allDoctors.filter((d) => d.id !== doctor.id).slice(0, 3);
  const initial = name?.replace(/^د\.?\s*/, "").charAt(0) || "؟";

  const schema = physicianSchema({ locale, doctor, url: `/${locale}/doctors/${slug}` });
  const breadcrumb = breadcrumbSchema([
    { name: isAr ? "الرئيسية" : "Home", url: `${SITE_URL}/${locale}` },
    { name: t("title"), url: `${SITE_URL}/${locale}/doctors` },
    { name, url: `${SITE_URL}/${locale}/doctors/${slug}` },
  ]);

  const doctorWebPage = webPageSchema({
    locale,
    name,
    description: specialty,
    url: `/${locale}/doctors/${slug}`,
    mainEntityId: `${SITE_URL}/${locale}/doctors/${slug}#physician`,
  });

  const BackIcon = isAr ? ArrowRight : ArrowLeft;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(doctorWebPage) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <section className="section-y border-b border-brand-line/70">
        <div className="container-brand grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link
              href="/doctors"
              className="group mb-6 inline-flex items-center gap-2 text-sm font-bold text-brand-teal transition-colors hover:text-brand-aqua"
            >
              <BackIcon size={16} className="transition-transform group-hover:-translate-x-1" />
              {t("backToDoctors")}
            </Link>

            <div data-reveal="bottom" className="revealed group relative overflow-hidden rounded-[1.85rem]">
              <div className="absolute -inset-px rounded-[1.85rem] bg-gradient-to-br from-brand-teal via-brand-aqua/40 to-brand-gold opacity-70 blur-[2px]" />
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.8rem] border border-white/60 shadow-card">
                {doctor.photo_url ? (
                  <Image
                    src={doctor.photo_url}
                    alt={name}
                    fill
                    priority
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="relative flex h-full w-full items-center justify-center bg-gradient-brand">
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.18),transparent_60%)]" />
                    <span className="flex h-32 w-32 items-center justify-center rounded-full border-2 border-white/40 bg-white/15 font-display text-6xl font-bold text-white/90 backdrop-blur-sm">
                      {initial}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            {specialty && (
              <p className="inline-flex items-center gap-1.5 rounded-full bg-brand-teal px-3.5 py-1.5 text-xs font-extrabold text-white">
                <Stethoscope size={12} />
                {specialty}
              </p>
            )}
            <h1 className="mt-4 font-display text-3xl font-extrabold leading-tight text-brand-ink md:text-5xl">{name}</h1>
            {bio && (
              <p className="mt-6 max-w-2xl whitespace-pre-line text-base leading-relaxed text-brand-slate md:text-lg">
                {bio}
              </p>
            )}

            <div className="mt-8 max-w-sm space-y-3">
              <BookButton name={name} kind="doctor" label={t("book")} className="w-full" />
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section-y">
          <div className="container-brand">
            <h2 className="font-display text-2xl font-bold text-brand-ink md:text-3xl">{t("moreDoctors")}</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((d) => (
                <DoctorCard key={d.id} doctor={d} locale={locale} />
              ))}
            </div>
            <div className="mt-10">
              <Link href="/doctors" className="btn btn-outline">
                {t("viewAll")}
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
}