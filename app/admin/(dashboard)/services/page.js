import AdminPageHeader from "@/components/admin/AdminPageHeader";
import ServicesManager from "@/components/admin/ServicesManager";
import { adminGetServices, adminGetServiceCategories } from "@/lib/data/admin";

export default async function AdminServicesPage() {
  const [services, categories] = await Promise.all([adminGetServices(), adminGetServiceCategories()]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="الخدمات"
        title="إدارة الخدمات"
        subtitle="إدارة خدمات طب الأسنان والجلدية الظاهرة في الموقع."
      />
      <ServicesManager items={services} categories={categories} />
    </div>
  );
}
