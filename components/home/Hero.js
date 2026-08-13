"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { BadgeCheck, ArrowLeft, Sparkles, ArrowRight, Heart } from "lucide-react";
import { getSocialLinks } from "@/lib/socials";
import OfferSubscribeDialog from "@/components/OfferSubscribeDialog";

export default function Hero({ settings }) {
  const t = useTranslations("hero");
  const locale = useLocale();

  const socials = getSocialLinks(settings);

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

        {/* Booking card + offer subscription */}
        <div data-reveal="bottom" className="revealed mx-auto w-full max-w-sm space-y-5">
          <div className="glass flex flex-col rounded-[1.75rem] p-7 text-center shadow-[var(--shadow-lifted)]">
            <span className="mx-auto flex items-center gap-2 text-brand-gold">
              <Sparkles size={15} />
              <span className="text-[0.7rem] font-extrabold uppercase tracking-widest">{t("subscribeEyebrow")}</span>
            </span>
            <h3 className="mt-2 font-display text-xl font-bold text-brand-ink">{t("cardTitle")}</h3>
            <p className="mt-1 text-sm leading-relaxed text-brand-slate">{t("cardText")}</p>
            <OfferSubscribeDialog
              autoOpen
              buttonClassName="btn btn-gold mt-6 w-full"
            />
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
