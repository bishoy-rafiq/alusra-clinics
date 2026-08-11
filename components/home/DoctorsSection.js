import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import SectionHeading from "@/components/ui/SectionHeading";
import DoctorCard from "@/components/ui/DoctorCard";
import { getDoctors } from "@/lib/data";

export default async function DoctorsSection() {
  const locale = await getLocale();
  const t = await getTranslations("doctors");
  const doctors = await getDoctors();

  if (!doctors?.length) return null;

  return (
    <section className="section-y bg-white" id="doctors">
      <div className="container-brand">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />
          <Link href="/doctors" className="btn btn-outline">
            {t("viewAll")}
          </Link>
        </div>

            <div className="mt-12 grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
          {doctors.slice(0, 4).map((doctor) => (
                <DoctorCard key={doctor.id} doctor={doctor} locale={locale} />
          ))}
        </div>
      </div>
    </section>
  );
}
