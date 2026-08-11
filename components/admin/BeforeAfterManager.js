"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Images, Loader2, Inbox } from "lucide-react";
import AdminDialog from "./AdminDialog";
import ConfirmDialog from "./ConfirmDialog";
import AdminField from "./AdminField";
import StatusBadge from "./StatusBadge";
import SearchBox from "./SearchBox";
import ImageUploader from "./ImageUploader";
import {
  createBeforeAfterCase,
  updateBeforeAfterCase,
  deleteBeforeAfterCase,
} from "@/app/admin/(dashboard)/before-after/actions";

function imagesLabel(item) {
  if (item.before_image && item.after_image) return "قبل وبعد";
  if (item.before_image) return "قبل فقط";
  if (item.after_image) return "بعد فقط";
  return "بدون صور";
}

export default function BeforeAfterManager({ items, services = [] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const submittingRef = useRef(false);

  const serviceName = (id) => services.find((s) => s.id === id)?.name_ar || "بدون ربط";

  const filtered = useMemo(() => {
    const nameById = new Map(services.map((s) => [s.id, s.name_ar]));
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((c) =>
      [c.title_ar, c.title_en, c.related_service_id && nameById.get(c.related_service_id)]
        .filter(Boolean)
        .some((v) => v.toLowerCase().includes(q))
    );
  }, [items, search, services]);

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
        if (editing) await updateBeforeAfterCase(fd);
        else await createBeforeAfterCase(fd);
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
        <SearchBox value={search} onChange={setSearch} placeholder="ابحث في الحالات..." />
        <button onClick={openCreate} className="btn btn-primary shrink-0">
          <Plus size={16} /> حالة جديدة
        </button>
      </div>

      <div className="flex items-center gap-2 text-xs font-semibold text-brand-slate">
        <span className="rounded-full bg-brand-teal px-2.5 py-1 text-white">{count}</span>
        حالة
      </div>

      <div className="space-y-3">
        {filtered.map((item) => (
          <div key={item.id} className="admin-row">
            <span className="admin-row-icon bg-amber-50 text-amber-600">
              <Images size={19} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-brand-ink">{item.title_ar}</p>
              <p className="mt-0.5 truncate text-xs text-brand-slate">
                الخدمة: {serviceName(item.related_service_id)}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5">
                <StatusBadge active={item.active} />
                <span className="text-xs font-medium text-brand-slate">{imagesLabel(item)}</span>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <button
                onClick={() => openEdit(item)}
                className="admin-icon-btn text-brand-teal hover:bg-brand-mist"
                title="تعديل"
                aria-label={`تعديل ${item.title_ar}`}
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={() => setDeleting(item)}
                className="admin-icon-btn text-red-500 hover:bg-red-50"
                title="حذف"
                aria-label={`حذف ${item.title_ar}`}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {!count && (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-brand-line bg-white/60 py-14 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-mist text-brand-teal">
            <Inbox size={24} />
          </span>
          <div>
            <p className="text-sm font-bold text-brand-ink">
              {search ? "لا توجد نتائج مطابقة" : "لا توجد حالات بعد"}
            </p>
            <p className="mt-1 text-xs text-brand-slate">
              {search ? "جرّب كلمة بحث أخرى." : "ابدأ بإضافة أول حالة عبر زر «حالة جديدة»."}
            </p>
          </div>
        </div>
      )}

      <AdminDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? "تعديل الحالة" : "حالة جديدة"}
        subtitle={editing ? "حدّث بيانات الحالة ثم احفظ." : "أضف حالة قبل وبعد جديدة."}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminField label="العنوان (عربي)">
              <input name="title_ar" required defaultValue={editing?.title_ar} className="admin-input" />
            </AdminField>
            <AdminField label="Title (English)">
              <input name="title_en" required defaultValue={editing?.title_en} className="admin-input" />
            </AdminField>
            <AdminField label="الوصف (عربي)" className="sm:col-span-2">
              <textarea name="description_ar" defaultValue={editing?.description_ar} className="admin-textarea" />
            </AdminField>
            <AdminField label="Description (English)" className="sm:col-span-2">
              <textarea name="description_en" defaultValue={editing?.description_en} className="admin-textarea" />
            </AdminField>
            <AdminField
              label="الخدمة المرتبطة"
              className="sm:col-span-2"
              hint="إن ربطت الحالة بخدمة، ستظهر أيضاً داخل صفحة الخدمة نفسها."
            >
              <select
                name="related_service_id"
                defaultValue={editing?.related_service_id || ""}
                className="admin-select"
              >
                <option value="">— بدون ربط (تظهر في الرئيسية فقط) —</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name_ar} — {service.name_en}
                  </option>
                ))}
              </select>
            </AdminField>
            <AdminField label="صورة «قبل»">
              <ImageUploader name="before_image" defaultValue={editing?.before_image} folder="before-after" />
            </AdminField>
            <AdminField label="صورة «بعد»">
              <ImageUploader name="after_image" defaultValue={editing?.after_image} folder="before-after" />
            </AdminField>
            <AdminField label="ترتيب العرض">
              <input type="number" name="sort_order" defaultValue={editing?.sort_order ?? 0} className="admin-input" />
            </AdminField>
            <AdminField label="ظهور الحالة">
              <label className="flex h-10 items-center gap-2 rounded-xl border border-brand-line bg-white px-3 text-sm font-semibold text-brand-ink">
                <input type="checkbox" name="active" defaultChecked={editing?.active ?? true} className="h-4 w-4 accent-brand-teal" />
                مفعّل وظاهر في الموقع
              </label>
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
              {editing ? "حفظ التعديلات" : "إضافة الحالة"}
            </button>
          </div>
        </form>
      </AdminDialog>

      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        title="حذف الحالة"
        message={`هل أنت متأكد من حذف حالة «${deleting?.title_ar}»؟ لا يمكن التراجع عن هذا الإجراء.`}
        action={deleteBeforeAfterCase}
        id={deleting?.id}
      />
    </div>
  );
}
