"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Stethoscope, Loader2, Inbox } from "lucide-react";
import AdminDialog from "./AdminDialog";
import ConfirmDialog from "./ConfirmDialog";
import AdminField from "./AdminField";
import StatusBadge from "./StatusBadge";
import SearchBox from "./SearchBox";
import ImageUploader from "./ImageUploader";
import { ICONS } from "@/lib/icon-map";
import { createService, updateService, deleteService } from "@/app/admin/(dashboard)/services/actions";

const CATEGORY_NAMES = {
  dentistry: "طب الأسنان",
  dermatology: "الجلدية",
};

export default function ServicesManager({ items, categories = [] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const submittingRef = useRef(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((s) =>
      [s.name_ar, s.name_en, s.excerpt_ar, s.excerpt_en]
        .filter(Boolean)
        .some((v) => v.toLowerCase().includes(q))
    );
  }, [items, search]);

  function openCreate() {
    setEditing(null);
    setError("");
    setFormOpen(true);
  }

  function openEdit(item) {
    setEditing(item);
    setError("");
    setFormOpen(true);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (submittingRef.current) return;
    submittingRef.current = true;
    const fd = new FormData(e.currentTarget);
    if (editing) fd.set("id", editing.id);
    startTransition(async () => {
      try {
        if (editing) await updateService(fd);
        else await createService(fd);
        setFormOpen(false);
        router.refresh();
      } catch (err) {
        setError(
          err?.message
            ? `تعذّر الحفظ: ${err.message}`
            : "تعذّر الحفظ. تأكد من اتصال Supabase وحاول مرة أخرى."
        );
      } finally {
        submittingRef.current = false;
      }
    });
  }

  const count = filtered.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBox value={search} onChange={setSearch} placeholder="ابحث في الخدمات..." />
        <button onClick={openCreate} className="btn btn-primary shrink-0">
          <Plus size={16} /> خدمة جديدة
        </button>
      </div>

      <div className="flex items-center gap-2 text-xs font-semibold text-brand-slate">
        <span className="rounded-full bg-brand-teal px-2.5 py-1 text-white">{count}</span>
        خدمة
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((service) => {
          const Icon = ICONS[service.icon] || Stethoscope;
          return (
            <div key={service.id} className="admin-row flex-col items-stretch">
              <div className="flex items-center gap-3">
                <span className="admin-row-icon bg-brand-mist text-brand-teal">
                  <Icon size={19} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-brand-ink">{service.name_ar}</p>
                  <p className="mt-0.5 truncate text-xs text-brand-slate">{service.name_en}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between gap-2 border-t border-brand-line/70 pt-3">
                <div className="flex items-center gap-2">
                  <StatusBadge active={service.active} activeLabel="مفعّلة" inactiveLabel="متوقفة" />
                  <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-brand-teal ring-1 ring-brand-line">
                    {CATEGORY_NAMES[service.category] || service.category}
                  </span>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    onClick={() => openEdit(service)}
                    className="admin-icon-btn text-brand-teal hover:bg-brand-mist"
                    title="تعديل"
                    aria-label={`تعديل ${service.name_ar}`}
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => setDeleting(service)}
                    className="admin-icon-btn text-red-500 hover:bg-red-50"
                    title="حذف"
                    aria-label={`حذف ${service.name_ar}`}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {!count && (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-brand-line bg-white/60 py-14 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-mist text-brand-teal">
            <Inbox size={24} />
          </span>
          <div>
            <p className="text-sm font-bold text-brand-ink">
              {search ? "لا توجد نتائج مطابقة" : "لا توجد خدمات بعد"}
            </p>
            <p className="mt-1 text-xs text-brand-slate">
              {search ? "جرّب كلمة بحث أخرى." : "ابدأ بإضافة أول خدمة عبر زر «خدمة جديدة»."}
            </p>
          </div>
        </div>
      )}

      <AdminDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? "تعديل الخدمة" : "خدمة جديدة"}
        subtitle={editing ? "حدّث بيانات الخدمة ثم احفظ." : "أضف خدمة جديدة لتظهر في الموقع."}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminField label="الاسم (عربي)">
              <input name="name_ar" required defaultValue={editing?.name_ar} className="admin-input" />
            </AdminField>
            <AdminField label="Name (English)">
              <input name="name_en" required defaultValue={editing?.name_en} className="admin-input" />
            </AdminField>
            <AdminField label="التخصص">
              <select name="category" defaultValue={editing?.category || "dentistry"} className="admin-select">
                {categories.length ? (
                  categories.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name_ar} / {c.name_en}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="dentistry">طب الأسنان / Dentistry</option>
                    <option value="dermatology">الجلدية / Dermatology</option>
                  </>
                )}
              </select>
            </AdminField>
            <AdminField label="الأيقونة">
              <select name="icon" defaultValue={editing?.icon || "sparkles"} className="admin-select">
                {Object.keys(ICONS).map((key) => (
                  <option key={key} value={key}>{key}</option>
                ))}
              </select>
            </AdminField>
            <AdminField label="مقتطف قصير (عربي)">
              <input name="excerpt_ar" defaultValue={editing?.excerpt_ar} className="admin-input" />
            </AdminField>
            <AdminField label="Short excerpt (English)">
              <input name="excerpt_en" defaultValue={editing?.excerpt_en} className="admin-input" />
            </AdminField>
            <AdminField label="الوصف الكامل (عربي)" className="sm:col-span-2">
              <textarea name="description_ar" defaultValue={editing?.description_ar} className="admin-textarea" />
            </AdminField>
            <AdminField label="Full description (English)" className="sm:col-span-2">
              <textarea name="description_en" defaultValue={editing?.description_en} className="admin-textarea" />
            </AdminField>
            <AdminField label="ترتيب العرض">
              <input type="number" name="sort_order" defaultValue={editing?.sort_order ?? 0} className="admin-input" />
            </AdminField>
            <AdminField label="ظهور الخدمة">
              <label className="flex h-10 items-center gap-2 rounded-xl border border-brand-line bg-white px-3 text-sm font-semibold text-brand-ink">
                <input type="checkbox" name="active" defaultChecked={editing?.active ?? true} className="h-4 w-4 accent-brand-teal" />
                مفعّلة وظاهرة في الموقع
              </label>
            </AdminField>
            <AdminField label="صورة الخدمة (اختياري)" className="sm:col-span-2">
              <ImageUploader name="image_url" defaultValue={editing?.image_url} folder="services" />
            </AdminField>
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 px-3 py-2.5 text-xs font-semibold text-red-600">{error}</p>
          )}

          <div className="flex items-center justify-end gap-2 border-t border-brand-line pt-4">
            <button type="button" onClick={() => setFormOpen(false)} className="admin-btn-ghost">
              إلغاء
            </button>
            <button type="submit" disabled={pending} className="btn btn-primary">
              {pending && <Loader2 size={15} className="animate-spin" />}
              {editing ? "حفظ التعديلات" : "إضافة الخدمة"}
            </button>
          </div>
        </form>
      </AdminDialog>

      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        title="حذف الخدمة"
        message={`هل أنت متأكد من حذف خدمة «${deleting?.name_ar}»؟ لا يمكن التراجع عن هذا الإجراء.`}
        action={deleteService}
        id={deleting?.id}
      />
    </div>
  );
}
