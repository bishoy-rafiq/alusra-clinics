import { getTranslations } from "next-intl/server";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import SubscribersManager from "@/components/admin/SubscribersManager";
import { adminGetSubscribers, adminGetOffers } from "@/lib/data/admin";
import { getAdminLocale } from "@/lib/admin-locale-server";

export default async function AdminSubscribersPage() {
  const locale = await getAdminLocale();
  const t = await getTranslations({ locale, namespace: "admin" });
  const [subscribers, offers] = await Promise.all([
    adminGetSubscribers(),
    adminGetOffers(),
  ]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow={t("pages.subscribers.eyebrow")}
        title={t("pages.subscribers.title")}
        subtitle={t("pages.subscribers.subtitle")}
      />
      <SubscribersManager items={subscribers} offers={offers} />
    </div>
  );
}
