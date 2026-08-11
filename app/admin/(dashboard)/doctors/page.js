import AdminPageHeader from "@/components/admin/AdminPageHeader";
import DoctorsManager from "@/components/admin/DoctorsManager";
import { adminGetDoctors } from "@/lib/data/admin";

export default async function AdminDoctorsPage() {
  const doctors = await adminGetDoctors();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="الأطباء"
        title="إدارة الأطباء"
        subtitle="إدارة فريق الأطباء الظاهر في صفحة «أطباؤنا»."
      />
      <DoctorsManager items={doctors} />
    </div>
  );
}
