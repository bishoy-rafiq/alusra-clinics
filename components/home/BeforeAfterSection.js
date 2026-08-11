import { getTranslations, getLocale } from "next-intl/server";
import SectionHeading from "@/components/ui/SectionHeading";
import BeforeAfter from "@/components/ui/BeforeAfter";
import { getBeforeAfterCases } from "@/lib/data";

export default async function BeforeAfterSection() {
  const locale = await getLocale();
  const t = await getTranslations("beforeAfter");
  const cases = await getBeforeAfterCases({ activeOnly: true });

  return (
    <section className="section-y bg-paper" id="results">
      <div className="container-brand">
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} align="center" />

        {cases.length ? (
          <div className="mx-auto mt-12 grid max-w-5xl gap-10 md:grid-cols-2">
            {cases
              .filter((c) => c.before_image && c.after_image)
              .map((c) => {
                const title = locale === "ar" ? c.title_ar : c.title_en;
                const description = locale === "ar" ? c.description_ar : c.description_en;
                return (
                  <figure key={c.id} data-reveal="bottom" className="revealed">
                    <BeforeAfter
                      before={c.before_image}
                      after={c.after_image}
                      alt={title}
                      labelBefore={t("before")}
                      labelAfter={t("after")}
                      hint={t("drag")}
                    />
                    <figcaption className="mt-5 text-center">
                      <h3 className="font-display text-lg font-bold text-brand-ink">{title}</h3>
                      {description && <p className="mt-1 text-sm text-brand-slate">{description}</p>}
                    </figcaption>
                  </figure>
                );
              })}
          </div>
        ) : (
          <p className="mt-10 text-center text-brand-slate">{t("empty")}</p>
        )}

        <p className="mx-auto mt-10 max-w-2xl text-center text-xs leading-relaxed text-brand-slate">
          {t("note")}
        </p>
      </div>
    </section>
  );
}
