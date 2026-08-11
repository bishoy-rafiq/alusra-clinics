"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Plus, Pencil, Trash2, User, Loader2, Inbox } from "lucide-react";
import AdminDialog from "./AdminDialog";
import ConfirmDialog from "./ConfirmDialog";
import AdminField from "./AdminField";
import StatusBadge from "./StatusBadge";
import SearchBox from "./SearchBox";
import ImageUploader from "./ImageUploader";
import { createDoctor, updateDoctor, deleteDoctor } from "@/app/admin/(dashboard)/doctors/actions";

export default function DoctorsManager({ items }) {
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
    return items.filter((d) =>
      [d.name_ar, d.name_en, d.specialty_ar, d.specialty_en]
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
        if (editing) await updateDoctor(fd);
        else await createDoctor(fd);
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
        <SearchBox value={search} onChange={setSearch} placeholder="ابحث عن طبيب..." />
        <button onClick={openCreate} className="btn btn-primary shrink-0">
          <Plus size={16} /> إضافة طبيب
        </button>
      </div>

      <div className="flex items-center gap-2 text-xs font-semibold text-brand-slate">
        <span className="rounded-full bg-brand-teal px-2.5 py-1 text-white">{count}</span>
        طبيب
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((doctor) => (
          <div key={doctor.id} className="admin-row">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-brand-teal/10 ring-1 ring-brand-line">
              {doctor.photo_url ? (
                <Image src={doctor.photo_url} alt={doctor.name_ar} fill className="object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-brand-teal/40">
                  <User size={24} />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-brand-ink">{doctor.name_ar}</p>
              <p className="mt-0.5 truncate text-xs text-brand-slate">{doctor.specialty_ar}</p>
              <div className="mt-1.5">
                <StatusBadge active={doctor.active} />
              </div>
            </div>
            <div className="flex shrink-0 flex-col gap-1">
              <button
                onClick={() => openEdit(doctor)}
                className="admin-icon-btn text-brand-teal hover:bg-brand-mist"
                title="تعديل"
                aria-label={`تعديل ${doctor.name_ar}`}
              >
                <Pencil size={15} />
              </button>
              <button
                onClick={() => setDeleting(doctor)}
                className="admin-icon-btn text-red-500 hover:bg-red-50"
                title="حذف"
                aria-label={`حذف ${doctor.name_ar}`}
              >
                <Trash2 size={15} />
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
              {search ? "لا توجد نتائج مطابقة" : "لا يوجد أطباء بعد"}
            </p>
            <p className="mt-1 text-xs text-brand-slate">
              {search ? "جرّب كلمة بحث أخرى." : "ابدأ بإضافة أول طبيب عبر زر «إضافة طبيب»."}
            </p>
          </div>
        </div>
      )}

      <AdminDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? "تعديل بيانات الطبيب" : "إضافة طبيب"}
        subtitle={editing ? "حدّث بيانات الطبيب ثم احفظ." : "أضف طبيباً جديداً ليظهر في صفحة «أطباؤنا»."}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminField label="صورة الطبيب" className="sm:col-span-2">
              <ImageUploader name="photo_url" defaultValue={editing?.photo_url} folder="doctors" />
            </AdminField>
            <AdminField label="الاسم (عربي)">
              <input name="name_ar" required defaultValue={editing?.name_ar} className="admin-input" />
            </AdminField>
            <AdminField label="Name (English)">
              <input name="name_en" required defaultValue={editing?.name_en} className="admin-input" />
            </AdminField>
            <AdminField label="التخصص (عربي)">
              <input name="specialty_ar" defaultValue={editing?.specialty_ar} className="admin-input" />
            </AdminField>
            <AdminField label="Specialty (English)">
              <input name="specialty_en" defaultValue={editing?.specialty_en} className="admin-input" />
            </AdminField>
            <AdminField label="نبذة (عربي)" className="sm:col-span-2">
              <textarea name="bio_ar" defaultValue={editing?.bio_ar} className="admin-textarea" />
            </AdminField>
            <AdminField label="Bio (English)" className="sm:col-span-2">
              <textarea name="bio_en" defaultValue={editing?.bio_en} className="admin-textarea" />
            </AdminField>
            <AdminField label="ترتيب العرض">
              <input type="number" name="sort_order" defaultValue={editing?.sort_order ?? 0} className="admin-input" />
            </AdminField>
            <AdminField label="ظهور الطبيب">
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
              {editing ? "حفظ التعديلات" : "إضافة الطبيب"}
            </button>
          </div>
        </form>
      </AdminDialog>

      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        title="حذف الطبيب"
        message={`هل أنت متأكد من حذف الطبيب «${deleting?.name_ar}»؟ لا يمكن التراجع عن هذا الإجراء.`}
        action={deleteDoctor}
        id={deleting?.id}
      />
    </div>
  );
}
