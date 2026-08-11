import { getTranslations } from "next-intl/server";
import { ShieldCheck, Sparkles, Stethoscope, Award, HeartHandshake, BadgeCheck } from "lucide-react";

export default async function TrustStrip() {
  const t = await getTranslations("trust");

  const items = [
    { icon: <ShieldCheck size={18} className="text-brand-gold" />, label: t("insurance") },
    { icon: <Sparkles size={18} className="text-brand-gold" />, label: t("sterile") },
    { icon: <Stethoscope size={18} className="text-brand-gold" />, label: t("technology") },
    { icon: <BadgeCheck size={18} className="text-brand-gold" />, label: t("specialists") },
    { icon: <Award size={18} className="text-brand-gold" />, label: t("experience") },
    { icon: <HeartHandshake size={18} className="text-brand-gold" />, label: t("satisfaction") },
  ];

  return (
    <section aria-label="Trust" className="overflow-hidden border-y border-brand-line/70 bg-white py-5">
      <div className="marquee relative">
        <div className="marquee-track">
          {[...items, ...items].map((item, i) => (
            <span key={i} className="flex items-center gap-2.5 px-7 text-sm font-bold text-brand-ink/70 md:px-10">
              {item.icon}
              {item.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
