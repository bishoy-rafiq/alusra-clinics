import { getTranslations, getLocale } from "next-intl/server";
import { ChevronDown, MessageCircle } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { getSettings } from "@/lib/data";

export async function getFaqItems() {
  const t = await getTranslations("faq");
  return Array.from({ length: 5 }, (_, i) => ({
    question: t(`q${i + 1}`),
    answer: t(`a${i + 1}`),
  }));
}

export default async function FaqSection() {
  const locale = await getLocale();
  const t = await getTranslations("faq");
  const settings = await getSettings();
  const waLink = buildWhatsAppLink({ locale, kind: "general" });
  const items = await getFaqItems();

  return (
    <section className="section-y" id="faq">
      <div className="container-brand grid gap-12 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <SectionHeading eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />
          <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-8">
            <MessageCircle size={17} />
            {t("cta")}
          </a>
        </div>

        <div className="space-y-3">
          {items.map((item, i) => (
            <details key={i} className="group card-brand p-5 open:bg-white">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-base font-bold text-brand-ink">
                {item.question}
                <ChevronDown
                  size={18}
                  className="shrink-0 text-brand-teal transition-transform duration-300 group-open:rotate-180"
                />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-brand-slate">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
