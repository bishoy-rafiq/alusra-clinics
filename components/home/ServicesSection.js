import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import SectionHeading from "@/components/ui/SectionHeading";
import ServiceCard from "@/components/ui/ServiceCard";
import { getServices } from "@/lib/data";

export default async function ServicesSection() {
  const locale = await getLocale();
  const t = await getTranslations("services");
  const services = await getServices();

  return (
    <section className="section-y bg-white" id="services">
      <div className="container-brand">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />
          <Link href="/services" className="btn btn-outline">
            {t("viewAll")}
          </Link>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.slice(0, 20).map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}
