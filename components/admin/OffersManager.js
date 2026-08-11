"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Tag, Calendar, Loader2, Inbox } from "lucide-react";
import AdminDialog from "./AdminDialog";
import ConfirmDialog from "./ConfirmDialog";
import AdminField from "./AdminField";
import StatusBadge from "./StatusBadge";
import SearchBox from "./SearchBox";
import ImageUploader from "./ImageUploader";
import { formatDate } from "@/lib/format";
import { createOffer, updateOffer, deleteOffer } from "@/app/admin/(dashboard)/offers/actions";

export default function OffersManager({ items }) {
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
    return items.filter((o) =>
      [o.title_ar, o.title_en, o.badge_ar, o.badge_en]
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
        if (editing) await updateOffer(fd);
        else await createOffer(fd);
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
        <SearchBox
          value={search}
          onChange={setSearch}
          placeholder="ابحث في العروض..."
        />
        <button onClick={openCreate} className="btn btn-primary shrink-0">
          <Plus size={16} /> عرض جديد
        </button>
      </div>

      <div className="flex items-center gap-2 text-xs font-semibold text-brand-slate">
        <span className="rounded-full bg-brand-teal px-2.5 py-1 text-white">{count}</span>
        عرض
      </div>

      <div className="space-y-3">
        {filtered.map((offer) => (
          <div key={offer.id} className="admin-row">
            <span className="admin-row-icon bg-rose-50 text-rose-600">
              <Tag size={19} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="truncate text-sm font-bold text-brand-ink">{offer.title_ar}</p>
                {offer.badge_ar && (
                  <span className="rounded-full bg-brand-gold-soft px-2 py-0.5 text-[10px] font-extrabold text-amber-700">
                    {offer.badge_ar}
                  </span>
                )}
              </div>
              <p className="mt-0.5 truncate text-xs text-brand-slate">{offer.title_en}</p>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5">
                <StatusBadge active={offer.active} />
                {offer.valid_until && (
                  <span className="flex items-center gap-1.5 text-xs text-brand-slate">
                    <Calendar size={12} /> ساري حتى {formatDate(offer.valid_until)}
                  </span>
                )}
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <button
                onClick={() => openEdit(offer)}
                className="admin-icon-btn text-brand-teal hover:bg-brand-mist"
                title="تعديل"
                aria-label={`تعديل ${offer.title_ar}`}
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={() => setDeleting(offer)}
                className="admin-icon-btn text-red-500 hover:bg-red-50"
                title="حذف"
                aria-label={`حذف ${offer.title_ar}`}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}

        {!count && (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-brand-line bg-white/60 py-14 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-mist text-brand-teal">
              <Inbox size={24} />
            </span>
            <div>
              <p className="text-sm font-bold text-brand-ink">
                {search ? "لا توجد نتائج مطابقة" : "لا توجد عروض بعد"}
              </p>
              <p className="mt-1 text-xs text-brand-slate">
                {search ? "جرّب كلمة بحث أخرى." : "ابدأ بإضافة أول عرض عبر زر «عرض جديد»."}
              </p>
            </div>
          </div>
        )}
      </div>

      <AdminDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? "تعديل العرض" : "عرض جديد"}
        subtitle={editing ? "حدّث بيانات العرض ثم احفظ." : "أضف عرضاً جديداً ليظهر في الموقع."}
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
            <AdminField label="وسم (عربي)" hint="مثال: خصم 20٪">
              <input name="badge_ar" defaultValue={editing?.badge_ar} className="admin-input" />
            </AdminField>
            <AdminField label="Badge (English)">
              <input name="badge_en" defaultValue={editing?.badge_en} className="admin-input" />
            </AdminField>
            <AdminField label="ساري حتى (اختياري)">
              <input type="date" name="valid_until" defaultValue={editing?.valid_until?.slice(0, 10)} className="admin-input" />
            </AdminField>
            <AdminField label="ظهور العرض">
              <label className="flex h-10 items-center gap-2 rounded-xl border border-brand-line bg-white px-3 text-sm font-semibold text-brand-ink">
                <input type="checkbox" name="active" defaultChecked={editing?.active ?? true} className="h-4 w-4 accent-brand-teal" />
                مفعّل وظاهر في الموقع
              </label>
            </AdminField>
            <AdminField label="صورة العرض (اختياري)" className="sm:col-span-2">
              <ImageUploader name="image_url" defaultValue={editing?.image_url} folder="offers" />
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
              {editing ? "حفظ التعديلات" : "إضافة العرض"}
            </button>
          </div>
        </form>
      </AdminDialog>

      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        title="حذف العرض"
        message={`هل أنت متأكد من حذف عرض «${deleting?.title_ar}»؟ لا يمكن التراجع عن هذا الإجراء.`}
        action={deleteOffer}
        id={deleting?.id}
      />
    </div>
  );
}
