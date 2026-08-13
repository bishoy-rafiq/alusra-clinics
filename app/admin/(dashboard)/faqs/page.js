import { getTranslations } from "next-intl/server";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import FaqsManager from "@/components/admin/FaqsManager";
import { adminGetFaqs } from "@/lib/data/admin";
import { getAdminLocale } from "@/lib/admin-locale-server";

export default async function AdminFaqsPage() {
  const locale = await getAdminLocale();
  const t = await getTranslations({ locale, namespace: "admin" });
  const items = await adminGetFaqs();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow={t("pages.faqs.eyebrow")}
        title={t("pages.faqs.title")}
        subtitle={t("pages.faqs.subtitle")}
      />
      <FaqsManager items={items} />
    </div>
  );
}
