import { getTranslations, getLocale } from "next-intl/server";
import Image from "next/image";
import { CheckCircle2, Award } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { getSettings } from "@/lib/data";

export default async function AboutSection() {
  const locale = await getLocale();
  const t = await getTranslations("about");
  const settings = await getSettings();

  const title = locale === "ar" ? settings.about_title_ar : settings.about_title_en;
  const text = locale === "ar" ? settings.about_text_ar : settings.about_text_en;

  const highlights =
    locale === "ar"
      ? ["رعاية صحية عالية الجودة", "تقنيات حديثة وأدوات متقدمة", "أطباء ذوو خبرة عالية", "بيئة مريحة وداعمة"]
      : ["High quality health care", "Modern technology & advanced tools", "Highly experienced doctors", "A comfortable, supportive environment"];

  return (
    <section className="section-y bg-brand-mist" id="about">
      <div className="container-brand grid gap-14 lg:grid-cols-2 lg:items-center">
        {/* Photography */}
        <div data-reveal="bottom" className="revealed relative">
          <div className="img-frame aspect-[4/3.4] w-full">
            <Image
              src="/images/alusra-clinics.jpeg"
              alt=""
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/40 via-transparent to-transparent" />
          </div>

          {/* Floating experience badge */}
          <div className="glass absolute -bottom-6 start-6 flex items-center gap-3 rounded-2xl px-5 py-4 shadow-[var(--shadow-lifted)]">
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

          {/* Floating rating card */}
          <div className="glass absolute -top-6 end-6 hidden items-center gap-2 rounded-2xl px-4 py-3 shadow-[var(--shadow-lifted)] sm:flex">
            <span className="text-brand-gold">★★★★★</span>
            <p className="text-sm font-bold text-brand-ink">4.6</p>
          </div>
        </div>

        {/* Copy */}
        <div data-reveal="bottom" className="revealed">
          <SectionHeading eyebrow={t("eyebrow")} title={title} />
          <p className="mt-6 whitespace-pre-line text-base leading-relaxed text-brand-slate">{text}</p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {highlights.map((h) => (
              <li key={h} className="flex items-center gap-2.5 rounded-xl border border-brand-line bg-white px-4 py-3 text-sm font-semibold text-brand-ink shadow-soft">
                <CheckCircle2 size={18} className="shrink-0 text-brand-aqua" /> {h}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
