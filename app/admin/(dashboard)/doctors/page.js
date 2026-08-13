import { getTranslations } from "next-intl/server";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import DoctorsManager from "@/components/admin/DoctorsManager";
import { adminGetDoctors } from "@/lib/data/admin";
import { getAdminLocale } from "@/lib/admin-locale-server";

export default async function AdminDoctorsPage() {
  const locale = await getAdminLocale();
  const t = await getTranslations({ locale, namespace: "admin" });
  const doctors = await adminGetDoctors();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow={t("pages.doctors.eyebrow")}
        title={t("pages.doctors.title")}
        subtitle={t("pages.doctors.subtitle")}
      />
      <DoctorsManager items={doctors} />
    </div>
  );
}
