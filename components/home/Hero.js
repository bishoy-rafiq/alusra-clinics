"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Phone, Star, ShieldCheck, BadgeCheck, ArrowUpRight, ArrowLeft, Sparkles, ArrowRight } from "lucide-react";
import { FaWhatsapp, FaInstagram, FaSnapchat,  } from "react-icons/fa6";
import { buildWhatsAppLink } from "@/lib/whatsapp";

function GoldStars() {
  return (
    <div className="flex gap-0.5 text-brand-gold">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={15} fill="currentColor" strokeWidth={1} />
      ))}
    </div>
  );
}

export default function Hero({ settings }) {
  const t = useTranslations("hero");
  const locale = useLocale();
  const waLink = buildWhatsAppLink({ locale, kind: "general" });

  const socials = [
    { name: "Instagram", href: settings?.instagram_url, Icon: FaInstagram },
    { name: "Snapchat", href: settings?.snapchat_url, Icon: FaSnapchat },
  ].filter((s) => s.href);

  const [before, highlight, after] = (t("title") || "").split("%highlight%");

  return (
    <section className="relative overflow-hidden" id="home">
      {/* Background photo: clinic building on phone, hero on big screens */}
      <div className="absolute inset-0">
        <Image
          src="/images/alusra-clinics.jpeg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover md:hidden"
        />
        <Image
          src="/images/hero.jpeg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="hidden object-cover md:block"
        />
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 bg-brand-ink/45 md:hidden" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-brand-paper/90 to-transparent" />
      </div>

      <div className="container-brand relative grid gap-12 pb-16 pt-14 md:pt-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:pb-24 lg:pt-28">
        {/* Copy */}
        <div data-reveal="bottom" className="revealed max-w-xl text-white">
          <p className="eyebrow eyebrow--light mb-5">
            <BadgeCheck size={14} /> {t("eyebrow")}
          </p>
          <h1 className="font-display text-[2.6rem] font-semibold leading-[1.3] md:text-6xl lg:text-[3rem]">
            {before}
            {highlight && <em className="text-gradient-gold not-italic">{highlight}</em>}
            {after}
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-white/80">{t("subtitle")}</p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a href="#services" rel="noopener noreferrer" className="btn btn-primary">
           {locale === "ar" ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
              {t("seeServices")}
            </a>
                   <a        href="#offers"
        aria-label={t("seeOffers")} className="btn btn-outline">
              <Sparkles size={18} />
              {t("seeOffers")}
            </a>
          </div>

          {/* Trust chips */}
          <div className="mt-10 flex flex-wrap gap-3">
            <span className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur-sm">
              <Star size={15} className="text-brand-gold" fill="currentColor" />
              4.6 · <span className="text-white/70">{t("statRating")}</span>
            </span>
            <span className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur-sm">
              <ShieldCheck size={15} className="text-brand-gold" />
              {t("statFree")}
            </span>
            <span className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur-sm">
              <BadgeCheck size={15} className="text-brand-gold" />
              20+ {t("statYears")}
            </span>
          </div>

          {/* Socials */}
          {socials.length > 0 && (
            <div className="mt-9 flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-widest text-white/80">
                {t("followUs")}
              </span>
              <span className="h-px w-8 bg-white/60" />
              <div className="flex items-center gap-2">
                {socials.map(({ name, href, Icon }) => (
                  <a
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={name}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/85 backdrop-blur-sm transition duration-300 hover:-translate-y-0.5 hover:border-brand-gold hover:bg-brand-gold hover:text-brand-ink"
                  >
                    <Icon size={17} />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Booking card */}
        <div data-reveal="bottom" className="revealed mx-auto w-full max-w-sm">
          <div className="glass rounded-[1.75rem] p-7 shadow-[var(--shadow-lifted)]">
            <div className="flex items-center gap-3">
              <span className="icon-chip flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-brand text-white">
                <Phone size={20} />
              </span>
              <div>

                <p className="font-display text-lg font-semibold text-brand-ink">
                  {locale === "ar" ? "احجز استشارتك الآن" : "Book your consultation"}
                </p>
                <p className="text-xs font-semibold text-brand-slate">
                  {locale === "ar" ? "رد سريع خلال دقائق" : "Fast reply within minutes"}
                </p>
              </div>
            </div>
                <div className="flex items-center gap-1 mt-4">
                          <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp w-full"
              >
                <FaWhatsapp size={18} />
                {t("ctaWhatsapp")}
              </a>
                </div>
            <div className="mt-6 flex items-center justify-between gap-3 border-t border-brand-line pt-5">
              <div>
                <GoldStars />
                <p className="mt-1 text-xs font-semibold text-brand-slate">
                  4.6 · {locale === "ar" ? "تقييم جوجل" : "Google rating"}
                </p>
              </div>
              {settings?.maps_url && (
                <a
                  href={settings.maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 rounded-full bg-brand-teal px-4 py-2 text-xs font-bold text-white transition hover:bg-brand-teal-mid"
                >
                  {locale === "ar" ? "على الخريطة" : "On the map"}
                  <ArrowUpRight size={14} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll down indicator */}
      <a
        href="#offers"
        aria-label={t("scroll")}
        className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1.5 text-white/80 transition-colors hover:text-brand-gold md:flex"
      >
        <span className="flex h-9 w-6 items-start justify-center rounded-full border-2 border-current p-1.5">
          <span className="h-2 w-1 animate-bounce rounded-full bg-current" />
        </span>
        <span className="text-[0.65rem] font-bold uppercase tracking-widest">{t("scroll")}</span>
      </a>
    </section>
  );
}
