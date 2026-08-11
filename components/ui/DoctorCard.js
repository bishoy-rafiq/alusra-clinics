import Image from "next/image";
import { Stethoscope } from "lucide-react";
import { getTranslations } from "next-intl/server";
import BookButton from "@/components/ui/BookButton";

export default async function DoctorCard({ doctor, locale, compact = false }) {
  const t = await getTranslations("doctors");
  const name = locale === "ar" ? doctor.name_ar : doctor.name_en;
  const specialty = locale === "ar" ? doctor.specialty_ar : doctor.specialty_en;
  const bio = locale === "ar" ? doctor.bio_ar : doctor.bio_en;
  const initial = (n = "") => n.replace(/^د\.?\s*/, "").charAt(0) || "؟";

  return (
    <div
      data-reveal="bottom"
      className="revealed group relative flex min-h-[26rem] flex-col overflow-hidden rounded-[1.5rem] border border-brand-line bg-brand-teal shadow-card transition-all duration-300 hover:-translate-y-2 hover:shadow-[var(--shadow-lifted)]"
    >
      {doctor.photo_url ? (
        <Image
          src={doctor.photo_url}
          alt={name}
          fill
          sizes="(min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-brand-teal via-brand-teal-mid to-brand-aqua">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-brand-gold/25 blur-2xl" />
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/90 via-brand-ink/45 to-brand-ink/5" />

      <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-[0.7rem] font-extrabold uppercase tracking-wide text-brand-teal shadow-[var(--shadow-soft)] backdrop-blur-sm">
        <Stethoscope size={12} />
        <span className="max-w-[10rem] truncate">{specialty}</span>
      </div>

      <div className="relative z-10 mt-auto flex flex-col gap-1.5 p-5 text-white md:p-6">
        <h3 className="font-display text-xl font-bold leading-snug">{name}</h3>
        <p className="text-sm font-semibold text-brand-gold">{specialty}</p>
        {!compact && bio && (
          <p className="mt-2 line-clamp-3 whitespace-pre-line text-sm leading-relaxed text-white/85">{bio}</p>
        )}
        <div className="mt-4">
          <BookButton
            name={name}
            kind="doctor"
            label={t("book")}
            variant="gold"
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
