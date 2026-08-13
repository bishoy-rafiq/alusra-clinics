import { getTranslations } from "next-intl/server";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import BeforeAfterManager from "@/components/admin/BeforeAfterManager";
import { adminGetBeforeAfterCases, adminGetServices } from "@/lib/data/admin";
import { getAdminLocale } from "@/lib/admin-locale-server";

export default async function AdminBeforeAfterPage() {
  const locale = await getAdminLocale();
  const t = await getTranslations({ locale, namespace: "admin" });
  const [items, services] = await Promise.all([adminGetBeforeAfterCases(), adminGetServices()]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow={t("pages.beforeAfter.eyebrow")}
        title={t("pages.beforeAfter.title")}
        subtitle={t("pages.beforeAfter.subtitle")}
      />
      <BeforeAfterManager items={items} services={services} />
    </div>
  );
}
