import AdminPageHeader from "@/components/admin/AdminPageHeader";
import BeforeAfterManager from "@/components/admin/BeforeAfterManager";
import { adminGetBeforeAfterCases, adminGetServices } from "@/lib/data/admin";

export default async function AdminBeforeAfterPage() {
  const [items, services] = await Promise.all([adminGetBeforeAfterCases(), adminGetServices()]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="قبل وبعد"
        title="إدارة الحالات"
        subtitle="حالات «قبل وبعد» المعروضة في قسم النتائج."
      />
      <BeforeAfterManager items={items} services={services} />
    </div>
  );
}
