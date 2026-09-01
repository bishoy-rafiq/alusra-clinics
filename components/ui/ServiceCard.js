import { getTranslations, getLocale } from "next-intl/server";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import BookButton from "@/components/ui/BookButton";
import { getServiceImage } from "@/lib/service-image-map";

export default async function ServiceCard({ service, href }) {
  const locale = await getLocale();
  const t = await getTranslations("services");
  const name = locale === "ar" ? service.name_ar : service.name_en;
  const excerpt = locale === "ar" ? service.excerpt_ar : service.excerpt_en;
  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;
  const cardHref = href || `/services/${service.slug}`;

  return (
    <div
      data-reveal="bottom"
      className="revealed card-brand group relative flex flex-col p-6"
    >
      <span className="pointer-events-none absolute end-4 top-0 h-1 w-14 rounded-full bg-gradient-to-r from-brand-teal via-brand-teal-mid to-brand-gold opacity-70 shadow-md shadow-brand-teal/30 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="flex items-start justify-between gap-3">
        <Link href={cardHref} className="relative block h-14 w-14 shrink-0 overflow-hidden rounded-2xl shadow-[var(--shadow-soft)] ring-1 ring-brand-line transition duration-300 group-hover:shadow-[var(--shadow-lifted)]">
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

      <h3 className="mt-5 font-display text-xl font-semibold text-brand-ink transition-colors group-hover:text-brand-teal">
        <Link href={cardHref}>{name}</Link>
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-brand-slate">{excerpt}</p>

      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5">
        <Link
          href={cardHref}
          className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-teal transition-all duration-300 group-hover:gap-3 group-hover:text-brand-aqua"
        >
          {t("readMore")} <Arrow size={15} />
        </Link>
        <BookButton name={name} kind="service" label={t("book")} className="px-4 py-2.5 text-sm" />
      </div>
    </div>
  );
}