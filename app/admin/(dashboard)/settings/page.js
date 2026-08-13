import { Building2, Share2, FileText, Images } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { adminGetSettings } from "@/lib/data/admin";
import { fallbackSettings } from "@/lib/data/fallback";
import SettingsForm from "@/components/admin/SettingsForm";
import SectionImagesManager from "@/components/admin/SectionImagesManager";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { getAdminLocale } from "@/lib/admin-locale-server";

export default async function AdminSettingsPage() {
  const locale = await getAdminLocale();
  const t = await getTranslations({ locale, namespace: "admin" });
  const settings = (await adminGetSettings()) || fallbackSettings;

  const NAV = [
    { href: "#section-clinic", label: t("settings.sections.clinic.title"), icon: Building2 },
    { href: "#section-social", label: t("settings.sections.social.title"), icon: Share2 },
    { href: "#section-about", label: t("settings.sections.about.title"), icon: FileText },
    { href: "#section-images", label: t("images.title"), icon: Images },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow={t("pages.settings.eyebrow")}
        title={t("pages.settings.title")}
        subtitle={t("pages.settings.subtitle")}
      />

      <nav className="mx-auto flex w-full max-w-4xl flex-wrap items-center gap-2">
        {NAV.map(({ href, label, icon: Icon }) => (
          <a
            key={href}
            href={href}
            className="inline-flex items-center gap-1.5 rounded-full border border-brand-line bg-white px-3.5 py-2 text-xs font-bold text-brand-slate shadow-[var(--shadow-soft)] transition hover:border-brand-aqua hover:text-brand-teal"
          >
            <Icon size={13} />
            {label}
          </a>
        ))}
      </nav>

      <div className="mx-auto w-full max-w-4xl space-y-5">
        <SettingsForm settings={settings} />

        <SectionImagesManager
          aboutImages={settings.about_images ?? fallbackSettings.about_images}
          contactImages={settings.contact_images ?? fallbackSettings.contact_images}
        />
      </div>
    </div>
  );
}
