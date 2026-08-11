import { getTranslations, getLocale } from "next-intl/server";
import { FaWhatsapp } from "react-icons/fa6";
import { ListChecks, MessageCircle, CalendarCheck } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { getSettings } from "@/lib/data";

export default async function HowItWorks() {
  const locale = await getLocale();
  const t = await getTranslations("how");
  const settings = await getSettings();
  const waLink = buildWhatsAppLink({ locale, kind: "general" });

  const steps = [
    { icon: ListChecks, title: t("step1Title"), desc: t("step1Desc") },
    { icon: MessageCircle, title: t("step2Title"), desc: t("step2Desc") },
    { icon: CalendarCheck, title: t("step3Title"), desc: t("step3Desc") },
  ];

  return (
    <section className="section-y bg-brand-teal text-white" id="how">
      <div className="container-brand">
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} light align="center" />

        <div className="relative mx-auto mt-14 grid max-w-4xl gap-10 sm:grid-cols-3">
          <div className="pointer-events-none absolute inset-x-16 top-9 hidden border-t-2 border-dashed border-white/20 sm:block" />
          {steps.map((step, i) => (
            <div key={i} data-reveal="bottom" className="revealed relative text-center">
              <div className="relative mx-auto flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/25 backdrop-blur-sm">
                <step.icon size={26} className="text-brand-gold" />
                <span className="absolute -end-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#c9a24b] to-[#dcbc6f] text-xs font-extrabold text-brand-ink shadow-glow">
                  {i + 1}
                </span>
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold">{step.title}</h3>
              <p className="mx-auto mt-2 max-w-[15rem] text-sm leading-relaxed text-white/70">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn btn-gold">
            <FaWhatsapp size={18} />
            {t("cta")}
          </a>
        </div>
      </div>
    </section>
  );
}
