"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import {
  Building2,
  Share2,
  FileText,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Info,
  Save,
} from "lucide-react";
import { updateSettings } from "@/app/admin/(dashboard)/settings/actions";
import AdminSectionCard from "@/components/admin/AdminSectionCard";

function SettingsField({ field, value }) {
  return (
    <div className={field.type === "textarea" ? "md:col-span-2" : "min-w-0"}>
      <label className="admin-label">{field.label}</label>
      {field.type === "textarea" ? (
        <textarea
          className="admin-textarea"
          style={{ minHeight: "9rem" }}
          name={field.name}
          defaultValue={value}
        />
      ) : (
        <input
          type={field.type}
          className="admin-input"
          name={field.name}
          defaultValue={value}
          placeholder={field.placeholder}
        />
      )}
      {field.hint && (
        <p className="mt-1.5 text-[11px] leading-relaxed text-brand-slate/80">{field.hint}</p>
      )}
    </div>
  );
}

export default function SettingsForm({ settings }) {
  const t = useTranslations("admin");
  const [state, formAction, pending] = useActionState(updateSettings, null);

  const SECTIONS = [
    {
      id: "section-clinic",
      index: 1,
      title: t("settings.sections.clinic.title"),
      hint: t("settings.sections.clinic.hint"),
      icon: Building2,
      grid: "md:grid-cols-2",
      fields: [
        { name: "clinic_name_ar", label: t("settings.fields.clinicNameAr"), type: "text" },
        { name: "clinic_name_en", label: t("settings.fields.clinicNameEn"), type: "text" },
        { name: "phone", label: t("settings.fields.phone"), type: "text" },
        { name: "whatsapp_number", label: t("settings.fields.whatsapp"), type: "text", hint: t("settings.fields.whatsappHint"), placeholder: "966XXXXXXXXX" },
        { name: "email", label: t("settings.fields.email"), type: "email" },
        { name: "maps_url", label: t("settings.fields.mapsUrl"), type: "text" },
        { name: "address_ar", label: t("settings.fields.addressAr"), type: "text" },
        { name: "address_en", label: t("settings.fields.addressEn"), type: "text" },
        { name: "working_hours_ar", label: t("settings.fields.hoursAr"), type: "text", hint: t("settings.fields.hoursArHint"), placeholder: "يومياً من 9 صباحاً حتى 12 منتصف الليل" },
        { name: "working_hours_en", label: t("settings.fields.hoursEn"), type: "text", hint: t("settings.fields.hoursEnHint"), placeholder: "Daily 9:00 AM – 12:00 AM" },
      ],
    },
    {
      id: "section-social",
      index: 2,
      title: t("settings.sections.social.title"),
      hint: t("settings.sections.social.hint"),
      icon: Share2,
      grid: "md:grid-cols-2",
      fields: [
        { name: "instagram_url", label: t("settings.fields.instagram"), type: "text", placeholder: "https://instagram.com/..." },
        { name: "snapchat_url", label: t("settings.fields.snapchat"), type: "text", placeholder: "https://snapchat.com/add/..." },
        { name: "x_url", label: t("settings.fields.x"), type: "text", placeholder: "https://x.com/..." },
        { name: "facebook_url", label: t("settings.fields.facebook"), type: "text", placeholder: "https://facebook.com/..." },
        { name: "tiktok_url", label: t("settings.fields.tiktok"), type: "text", placeholder: "https://tiktok.com/..." },
        { name: "youtube_url", label: t("settings.fields.youtube"), type: "text", placeholder: "https://youtube.com/..." },
        { name: "telegram_url", label: t("settings.fields.telegram"), type: "text", placeholder: "https://t.me/..." },
        { name: "linkedin_url", label: t("settings.fields.linkedin"), type: "text", placeholder: "https://linkedin.com/..." },
      ],
    },
    {
      id: "section-about",
      index: 3,
      title: t("settings.sections.about.title"),
      hint: t("settings.sections.about.hint"),
      icon: FileText,
      grid: "md:grid-cols-2",
      fields: [
        { name: "about_title_ar", label: t("settings.fields.aboutTitleAr"), type: "text" },
        { name: "about_title_en", label: t("settings.fields.aboutTitleEn"), type: "text" },
        { name: "about_text_ar", label: t("settings.fields.aboutTextAr"), type: "textarea" },
        { name: "about_text_en", label: t("settings.fields.aboutTextEn"), type: "textarea" },
      ],
    },
  ];

  let statusIcon = Info;
  let statusClass = "text-brand-slate/70";
  let statusText = t("settings.saveHint");
  if (pending) {
    statusIcon = Loader2;
    statusClass = "text-brand-slate";
    statusText = t("settings.saving");
  } else if (state?.ok === true) {
    statusIcon = CheckCircle2;
    statusClass = "text-emerald-600";
    statusText = state.message;
  } else if (state?.ok === false) {
    statusIcon = AlertCircle;
    statusClass = "text-red-600";
    statusText = state.message;
  }
  const StatusIcon = statusIcon;

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="sticky top-14 z-20 rounded-2xl border border-brand-line/80 bg-white/90 px-4 py-3 shadow-[var(--shadow-card)] backdrop-blur-md md:px-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className={`flex min-w-0 items-center gap-2 text-xs font-bold ${statusClass}`}>
            <StatusIcon
              size={15}
              className={`shrink-0 ${pending ? "animate-spin" : ""}`}
            />
            <span className="truncate">{statusText}</span>
          </div>
          <button type="submit" disabled={pending} className="btn btn-primary">
            {pending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {t("settings.save")}
          </button>
        </div>
      </div>

      {SECTIONS.map((section) => (
        <AdminSectionCard
          key={section.id}
          id={section.id}
          index={section.index}
          icon={section.icon}
          title={section.title}
          hint={section.hint}
        >
          <div className={`grid gap-x-5 gap-y-4 ${section.grid}`}>
            {section.fields.map((field) => (
              <SettingsField key={field.name} field={field} value={settings[field.name]} />
            ))}
          </div>
        </AdminSectionCard>
      ))}
    </form>
  );
}
