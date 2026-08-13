import { getTranslations, getLocale } from "next-intl/server";
import { HeartPulse, Microscope, Stethoscope, Sparkles, Award, CalendarPlus } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import SectionHeading from "@/components/ui/SectionHeading";
import AboutImageSlider from "@/components/home/AboutImageSlider";
import { getSettings } from "@/lib/data";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export default async function AboutSection() {
  const locale = await getLocale();
  const t = await getTranslations("about");
  const settings = await getSettings();

  const title = locale === "ar" ? settings.about_title_ar : settings.about_title_en;
  const text = locale === "ar" ? settings.about_text_ar : settings.about_text_en;

  const features =
    locale === "ar"
      ? [
          { icon: HeartPulse, label: "رعاية صحية عالية الجودة" },
          { icon: Microscope, label: "تقنيات حديثة وأدوات متقدمة" },
          { icon: Stethoscope, label: "أطباء ذوو خبرة عالية" },
          { icon: Sparkles, label: "بيئة مريحة وداعمة" },
        ]
      : [
          { icon: HeartPulse, label: "High quality health care" },
          { icon: Microscope, label: "Modern technology & tools" },
          { icon: Stethoscope, label: "Highly experienced doctors" },
          { icon: Sparkles, label: "A comfortable, supportive environment" },
        ];

  const whatsappLink = buildWhatsAppLink({ locale, kind: "general", number: settings.whatsapp_number });

  return (
    <section className="section-y relative overflow-hidden bg-brand-mist" id="about">
      {/* Decorative glows */}
      <div aria-hidden className="absolute -start-28 -top-28 h-80 w-80 rounded-full bg-brand-aqua/15 blur-3xl" />
      <div aria-hidden className="absolute -bottom-32 -end-28 h-80 w-80 rounded-full bg-brand-gold/20 blur-3xl" />

      <div className="container-brand relative grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
        {/* Arched photography */}
        <div data-reveal="bottom" className="revealed relative mx-auto w-full max-w-md">
          {/* Offset back panel */}
          <div
            aria-hidden
            className="absolute -inset-2 translate-y-3 rounded-t-[12rem] rounded-b-[2rem] bg-brand-teal/10 md:-inset-3 md:translate-y-4"
          />

          <AboutImageSlider images={settings.about_images} />

          {/* Floating rating chip */}
          <div className="glass absolute -top-5 end-3 hidden items-center gap-2 rounded-2xl px-4 py-3 shadow-[var(--shadow-lifted)] sm:flex">
            <span className="text-brand-gold">★★★★★</span>
            <p className="text-sm font-bold text-brand-ink">4.6</p>
          </div>

          {/* Floating experience badge */}
          <div className="glass absolute -bottom-6 start-1/2 flex w-max -translate-x-1/2 items-center gap-3 rounded-2xl px-5 py-4 shadow-[var(--shadow-lifted)] rtl:translate-x-1/2">
            <span className="icon-chip flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-brand text-white">
              <Award size={22} />
            </span>
            <div>
              <p className="font-display text-2xl font-semibold leading-none text-brand-ink">20+</p>
              <p className="mt-1 text-xs font-bold text-brand-slate">
                {locale === "ar" ? "عاماً من الخبرة" : "years of experience"}
              </p>
            </div>
          </div>
        </div>

        {/* Copy */}
        <div data-reveal="bottom" className="revealed">
          <SectionHeading eyebrow={t("eyebrow")} title={title} />
          <p className="mt-6 whitespace-pre-line text-base leading-relaxed text-brand-slate">{text}</p>

          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {features.map((f) => (
              <li
                key={f.label}
                className="group flex items-center gap-3 rounded-2xl border border-brand-line bg-white p-4 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-brand-teal/40 hover:shadow-[var(--shadow-lifted)]"
              >
                <span className="icon-chip flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-mist text-brand-teal transition-colors duration-300 group-hover:bg-brand-teal group-hover:text-white">
                  <f.icon size={18} />
                </span>
                <p className="text-sm font-semibold leading-snug text-brand-ink">{f.label}</p>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href={`/${locale}/contact`} className="btn btn-primary">
              <CalendarPlus size={18} />
              {t("cta")}
            </a>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
            >
              <FaWhatsapp size={18} />
              {locale === "ar" ? "تواصل عبر واتساب" : "Chat on WhatsApp"}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
