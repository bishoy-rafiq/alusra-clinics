import AdminPageHeader from "@/components/admin/AdminPageHeader";
import OffersManager from "@/components/admin/OffersManager";
import { adminGetOffers } from "@/lib/data/admin";

export default async function AdminOffersPage() {
  const offers = await adminGetOffers();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="العروض"
        title="إدارة العروض"
        subtitle="إضافة وتعديل وحذف عروض الموقع من خلال النوافذ المنبثقة."
      />
      <OffersManager items={offers} />
    </div>
  );
}
