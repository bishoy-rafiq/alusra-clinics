import { getTranslations, getLocale } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Mail, Phone, MapPin, ChevronRight } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { getSocialLinks } from "@/lib/socials";
import OfferSubscribeDialog from "@/components/OfferSubscribeDialog";

export default async function Footer({ settings, services }) {
  const locale = await getLocale();
  const t = await getTranslations("footer");
  const tNav = await getTranslations("nav");

  const dentistry = (services || []).filter((s) => s.category === "dentistry");
  const dermatology = (services || []).filter((s) => s.category === "dermatology");
  const name = (s) => (locale === "ar" ? s.name_ar : s.name_en);
  const clinicName = locale === "ar" ? settings?.clinic_name_ar : settings?.clinic_name_en;
  const address = locale === "ar" ? settings?.address_ar : settings?.address_en;
  const Arrow = ChevronRight;
  const waLink = buildWhatsAppLink({ locale, kind: "general", number: settings?.whatsapp_number });
  const socials = getSocialLinks(settings);

  return (
    <footer className="relative overflow-hidden bg-brand-ink text-white/80">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-gold to-transparent" />
      <div className="pointer-events-none absolute -end-32 -top-32 h-80 w-80 rounded-full bg-brand-teal/25 blur-3xl" />

      {/* Conversion CTA band */}
      <div className="relative border-b border-white/8">
        <div className="container-brand flex flex-col items-center justify-between gap-6 py-12 text-center md:flex-row md:text-start">
          <div>
            <p className="font-display text-2xl font-semibold text-white md:text-3xl">
              {locale === "ar" ? "جاهز لزيارتنا؟ احجز موعدك الآن" : "Ready to visit us? Book now"}
            </p>
            <p className="mt-2 text-sm text-white/55">
              {locale === "ar" ? "فريقنا جاهز للرد على استفساراتك وتحديد الوقت المناسب لك." : "Our team is ready to answer your questions and find the best time for you."}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn btn-gold">
              <FaWhatsapp size={18} />
              {locale === "ar" ? "احجز عبر واتساب" : "Book on WhatsApp"}
            </a>
            <OfferSubscribeDialog buttonClassName="btn btn-outline" />
          </div>
        </div>
      </div>

      <div className="container-brand relative grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1fr] lg:py-20">
        <div className="space-y-5">
          <Image src="/images/logo-light.png" alt={clinicName || "Alusra Clinics"} width={136} height={46} className="h-10 w-auto" />
          <p className="max-w-xs text-sm leading-relaxed text-white/55">{t("aboutText")}</p>
          <div className="space-y-3 text-sm">
            <a href={`mailto:${settings?.email}`} className="group flex items-center gap-3 text-white/70 transition hover:text-brand-aqua">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/8 text-brand-aqua">
                <Mail size={16} />
              </span>
              {settings?.email}
            </a>
            <a href={`tel:${settings?.phone}`} className="group flex items-center gap-3 text-white/70 transition hover:text-brand-aqua">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/8 text-brand-aqua">
                <Phone size={16} />
              </span>
              {settings?.phone}
            </a>
            <a href={settings?.maps_url} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 text-white/70 transition hover:text-brand-aqua">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/8 text-brand-aqua">
                <MapPin size={16} />
              </span>
              {address}
            </a>
          </div>
        </div>

        <div>
          <p className="mb-4 text-sm font-bold uppercase tracking-wide text-white">{t("dentistry")}</p>
          <ul className="space-y-2.5">
            {dentistry.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="group flex items-center gap-1.5 text-sm text-white/55 transition hover:text-brand-aqua">
                  <Arrow size={13} className={`transition-transform ${locale === "ar" ? "group-hover:-translate-x-0.5" : "group-hover:translate-x-0.5"}`} />
                  {name(s)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-4 text-sm font-bold uppercase tracking-wide text-white">{t("dermatology")}</p>
          <ul className="space-y-2.5">
            {dermatology.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="group flex items-center gap-1.5 text-sm text-white/55 transition hover:text-brand-aqua">
                  <Arrow size={13} className={`transition-transform ${locale === "ar" ? "group-hover:-translate-x-0.5" : "group-hover:translate-x-0.5"}`} />
                  {name(s)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-4 text-sm font-bold uppercase tracking-wide text-white">{t("quickLinks")}</p>
          <ul className="space-y-2.5">
            <li><Link href="/doctors" className="text-sm text-white/55 hover:text-brand-aqua">{tNav("doctors")}</Link></li>
            <li><Link href="/offers" className="text-sm text-white/55 hover:text-brand-aqua">{tNav("offers")}</Link></li>
            <li><Link href="/about" className="text-sm text-white/55 hover:text-brand-aqua">{tNav("about")}</Link></li>
            <li><Link href="/contact" className="text-sm text-white/55 hover:text-brand-aqua">{tNav("contact")}</Link></li>
          </ul>

          <div className="mt-6 flex flex-wrap gap-3">
            {socials.map(({ name: socialName, href, Icon }) => (
              <a key={socialName} href={href} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 text-white/70 transition hover:border-brand-aqua hover:bg-brand-aqua/10 hover:text-brand-aqua" aria-label={socialName}>
                <Icon size={17} />
              </a>
            ))}
            {(settings?.whatsapp_number || settings?.phone) && (
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 text-white/70 transition hover:border-brand-aqua hover:bg-brand-aqua/10 hover:text-brand-aqua" aria-label="Whatsapp">
                <FaWhatsapp size={17} />
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-white/8">
        <div className="container-brand flex flex-col items-center justify-between gap-3 py-6 pb-24 text-xs text-white/40 md:flex-row md:pb-6">
          <p>© {new Date().getFullYear()} {t("madeFor")} — {t("rights")}</p>
          <p className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" />
            {locale === "ar" ? "حفر الباطن، المملكة العربية السعودية" : "Hafr Al-Batin, Saudi Arabia"}
          </p>
        </div>
      </div>
    </footer>
  );
}
