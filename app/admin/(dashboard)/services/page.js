import { getTranslations } from "next-intl/server";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import ServicesManager from "@/components/admin/ServicesManager";
import { adminGetServices, adminGetServiceCategories } from "@/lib/data/admin";
import { getAdminLocale } from "@/lib/admin-locale-server";

export default async function AdminServicesPage() {
  const locale = await getAdminLocale();
  const t = await getTranslations({ locale, namespace: "admin" });
  const [services, categories] = await Promise.all([adminGetServices(), adminGetServiceCategories()]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow={t("pages.services.eyebrow")}
        title={t("pages.services.title")}
        subtitle={t("pages.services.subtitle")}
      />
      <ServicesManager items={services} categories={categories} />
    </div>
  );
}
