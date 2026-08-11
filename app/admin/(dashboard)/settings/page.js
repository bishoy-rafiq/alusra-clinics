import { Building2, Share2, FileText } from "lucide-react";
import { adminGetSettings } from "@/lib/data/admin";
import { fallbackSettings } from "@/lib/data/fallback";
import { updateSettings } from "./actions";
import AdminPageHeader from "@/components/admin/AdminPageHeader";

const SECTIONS = [
  {
    title: "بيانات العيادة",
    icon: Building2,
    hint: "الاسم ورقم الهاتف والواتساب والعنوان.",
    grid: "md:grid-cols-2",
    fields: [
      { name: "clinic_name_ar", label: "اسم العيادة (عربي)", type: "text" },
      { name: "clinic_name_en", label: "Clinic name (English)", type: "text" },
      { name: "phone", label: "رقم الهاتف", type: "text" },
      { name: "whatsapp_number", label: "رقم واتساب الحجز", type: "text", hint: "أرقام فقط، بمفتاح الدولة", placeholder: "966XXXXXXXXX" },
      { name: "email", label: "البريد الإلكتروني", type: "email" },
      { name: "maps_url", label: "رابط خرائط جوجل", type: "text" },
      { name: "address_ar", label: "العنوان (عربي)", type: "text" },
      { name: "address_en", label: "Address (English)", type: "text" },
    ],
  },
  {
    title: "التواصل الاجتماعي و Google",
    icon: Share2,
    hint: "روابط صفحاتك الخارجية ومعرّف جوجل.",
    grid: "md:grid-cols-2",
    fields: [
      { name: "instagram_url", label: "رابط إنستغرام", type: "text" },
      { name: "snapchat_url", label: "رابط سناب شات", type: "text" },
      { name: "x_url", label: "رابط X (تويتر)", type: "text" },
      { name: "facebook_url", label: "رابط فيسبوك", type: "text" },
      { name: "google_place_id", label: "Google Place ID", type: "text", hint: "لعرض تقييمات جوجل تلقائياً", placeholder: "ChIJ..." },
    ],
  },
  {
    title: "نبذة عن العيادة",
    icon: FileText,
    hint: "تظهر في الصفحة الرئيسية وصفحة من نحن.",
    grid: "md:grid-cols-2",
    fields: [
      { name: "about_title_ar", label: "عنوان النبذة (عربي)", type: "text" },
      { name: "about_title_en", label: "About title (English)", type: "text" },
      { name: "about_text_ar", label: "نص النبذة (عربي)", type: "textarea" },
      { name: "about_text_en", label: "About text (English)", type: "textarea" },
    ],
  },
];

function SettingsField({ field, value }) {
  return (
    <div className={field.type === "textarea" ? "md:col-span-2" : ""}>
      <label className="admin-label">{field.label}</label>
      {field.type === "textarea" ? (
        <textarea
          className="admin-textarea"
          style={{ minHeight: "9rem" }}
          name={field.name}
          defaultValue={value}
        />
      ) : (
        <input
          type={field.type}
          className="admin-input"
          name={field.name}
          defaultValue={value}
          placeholder={field.placeholder}
        />
      )}
      {field.hint && <p className="mt-1 text-xs text-brand-slate">{field.hint}</p>}
    </div>
  );
}

export default async function AdminSettingsPage() {
  const settings = (await adminGetSettings()) || fallbackSettings;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="الإعدادات"
        title="الإعدادات العامة"
        subtitle="بيانات التواصل، رقم واتساب الحجز، وروابط التواصل الاجتماعي، ونص «نبذة عنا»."
      />

      <form action={updateSettings} className="mx-auto max-w-4xl space-y-6">
        {SECTIONS.map((section) => (
          <div key={section.title} className="admin-fieldset overflow-hidden p-0">
            <div className="flex items-center gap-3 border-b border-brand-line bg-gradient-to-b from-brand-mist/80 to-transparent px-5 py-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-brand-teal shadow-sm ring-1 ring-brand-line">
                <section.icon size={18} />
              </span>
              <div>
                <p className="text-sm font-bold text-brand-ink">{section.title}</p>
                <p className="text-xs text-brand-slate">{section.hint}</p>
              </div>
            </div>
            <div className={`grid gap-x-5 gap-y-4 p-5 ${section.grid}`}>
              {section.fields.map((field) => (
                <SettingsField key={field.name} field={field} value={settings[field.name]} />
              ))}
            </div>
          </div>
        ))}

        <div className="flex justify-end">
          <button type="submit" className="btn btn-primary">
            حفظ الإعدادات
          </button>
        </div>
      </form>
    </div>
  );
}
