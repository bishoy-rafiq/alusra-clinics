import { getTranslations, getLocale } from "next-intl/server";
import Image from "next/image";
import { MapPin, Phone, Mail, Star } from "lucide-react";
import { FaInstagram, FaSnapchat, FaWhatsapp } from "react-icons/fa6";
import SectionHeading from "@/components/ui/SectionHeading";
import { getSettings } from "@/lib/data";

export default async function ContactSection() {
  const locale = await getLocale();
  const t = await getTranslations("contact");
  const settings = await getSettings();
  const address = locale === "ar" ? settings.address_ar : settings.address_en;

  const items = [
    { icon: MapPin, label: t("address"), value: address, href: settings.maps_url, accent: "from-brand-teal to-brand-teal-mid" },
    { icon: Phone, label: t("phone"), value: settings.phone, href: `tel:${settings.phone}`, accent: "from-brand-teal-mid to-brand-aqua" },
    { icon: FaWhatsapp, label: t("whatsapp"), value: settings.phone, href: settings.whatsapp_url, accent: "from-brand-aqua to-[#25d366]" },
    { icon: Mail, label: t("email"), value: settings.email, href: `mailto:${settings.email}`, accent: "from-brand-navy to-brand-teal" },
  ];

  const socials = [
    { name: "Instagram", href: settings.instagram_url, Icon: FaInstagram },
    { name: "Snapchat", href: settings.snapchat_url, Icon: FaSnapchat },
  ].filter((s) => s.href);

  return (
    <section className="bg-gradient-brand relative overflow-hidden text-white" id="contact">
      <div className="pointer-events-none absolute -start-24 -top-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -end-24 -bottom-24 h-80 w-80 rounded-full bg-brand-gold/20 blur-3xl" />

      <div className="container-brand section-y relative grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]">
        {/* Visual */}
        <div data-reveal="bottom" className="revealed relative mx-auto w-full max-w-md">
          <div className="img-frame aspect-[4/4.6] w-full">
            <Image
              src="/images/alusra-clinics.jpeg"
              alt=""
              fill
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/50 via-transparent to-transparent" />
          </div>
          <div className="glass absolute -bottom-5 start-5 flex items-center gap-3 rounded-2xl px-4 py-3 shadow-[var(--shadow-lifted)]">
            <span className="flex gap-0.5 text-brand-gold">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={15} fill="currentColor" strokeWidth={1} />
              ))}
            </span>
            <p className="text-sm font-bold text-brand-ink">4.6 · {locale === "ar" ? "تقييم جوجل" : "Google rating"}</p>
          </div>
        </div>

        {/* Info */}
        <div data-reveal="bottom" className="revealed">
          <SectionHeading eyebrow={t("eyebrow")} title={t("title")} light />
          <p className="mt-4 max-w-md text-white/70">
            {locale === "ar"
              ? "يسعدنا استقبالكم في عيادات الأسرة. اختر وسيلة التواصل الأنسب لك وسنرد عليك بأسرع وقت."
              : "We'd love to welcome you at Alusra Clinics. Pick the channel that suits you best and we'll reply as soon as possible."}
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {items.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-white/30 hover:bg-white/15"
              >
                <span className={`icon-chip flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${item.accent} shadow-[var(--shadow-lifted)]`}>
                  <item.icon size={20} />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wide text-white/55">{item.label}</p>
                  <p className="mt-0.5 truncate text-sm font-semibold">{item.value}</p>
                </div>
              </a>
            ))}
          </div>

          <div className="mt-8 flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-widest text-white/60">
              {locale === "ar" ? "تابعنا على" : "Follow us"}
            </span>
            <span className="h-px w-8 bg-white/25" />
            {socials.map(({ name, href, Icon }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={name}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition duration-300 hover:-translate-y-1 hover:border-brand-gold hover:bg-brand-gold hover:text-brand-ink"
              >
                <Icon size={19} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
