import { getTranslations } from "next-intl/server";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import OffersManager from "@/components/admin/OffersManager";
import { adminGetOffers } from "@/lib/data/admin";
import { getAdminLocale } from "@/lib/admin-locale-server";

export default async function AdminOffersPage() {
  const locale = await getAdminLocale();
  const t = await getTranslations({ locale, namespace: "admin" });
  const offers = await adminGetOffers();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow={t("pages.offers.eyebrow")}
        title={t("pages.offers.title")}
        subtitle={t("pages.offers.subtitle")}
      />
      <OffersManager items={offers} />
    </div>
  );
}
