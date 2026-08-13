"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
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

export default function BeforeAfterManager({ items, services = [] }) {
  const t = useTranslations("admin");
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const submittingRef = useRef(false);

  function imagesLabel(item) {
    if (item.before_image && item.after_image) return t("beforeAfter.imagesLabel.both");
    if (item.before_image) return t("beforeAfter.imagesLabel.before");
    if (item.after_image) return t("beforeAfter.imagesLabel.after");
    return t("beforeAfter.imagesLabel.none");
  }

  const serviceName = (id) =>
    services.find((s) => s.id === id)?.name_ar || t("beforeAfter.noService");

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
            ? t("common.saveFailed", { message: err.message })
            : t("common.saveFailedGeneric")
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
        <SearchBox value={search} onChange={setSearch} placeholder={t("beforeAfter.search")} />
        <button onClick={openCreate} className="btn btn-primary shrink-0">
          <Plus size={16} /> {t("beforeAfter.add")}
        </button>
      </div>

      <div className="flex items-center gap-2 text-xs font-semibold text-brand-slate">
        <span className="rounded-full bg-brand-teal px-2.5 py-1 text-white">{count}</span>
        {t("beforeAfter.countLabel")}
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
                {t("beforeAfter.serviceLabel", { name: serviceName(item.related_service_id) })}
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
                title={t("common.edit")}
                aria-label={t("common.editLabel", { name: item.title_ar })}
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={() => setDeleting(item)}
                className="admin-icon-btn text-red-500 hover:bg-red-50"
                title={t("common.delete")}
                aria-label={t("common.deleteLabel", { name: item.title_ar })}
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
              {search ? t("common.noResults") : t("beforeAfter.emptyTitle")}
            </p>
            <p className="mt-1 text-xs text-brand-slate">
              {search ? t("common.tryDifferent") : t("beforeAfter.emptyDesc")}
            </p>
          </div>
        </div>
      )}

      <AdminDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? t("beforeAfter.dialogEditTitle") : t("beforeAfter.dialogCreateTitle")}
        subtitle={editing ? t("beforeAfter.dialogEditSubtitle") : t("beforeAfter.dialogCreateSubtitle")}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminField label={t("beforeAfter.fields.titleAr")}>
              <input name="title_ar" required defaultValue={editing?.title_ar} className="admin-input" />
            </AdminField>
            <AdminField label={t("beforeAfter.fields.titleEn")}>
              <input name="title_en" required defaultValue={editing?.title_en} className="admin-input" />
            </AdminField>
            <AdminField label={t("beforeAfter.fields.descAr")} className="sm:col-span-2">
              <textarea name="description_ar" defaultValue={editing?.description_ar} className="admin-textarea" />
            </AdminField>
            <AdminField label={t("beforeAfter.fields.descEn")} className="sm:col-span-2">
              <textarea name="description_en" defaultValue={editing?.description_en} className="admin-textarea" />
            </AdminField>
            <AdminField
              label={t("beforeAfter.fields.service")}
              className="sm:col-span-2"
              hint={t("beforeAfter.fields.serviceHint")}
            >
              <select
                name="related_service_id"
                defaultValue={editing?.related_service_id || ""}
                className="admin-select"
              >
                <option value="">{t("beforeAfter.fields.noLink")}</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name_ar} — {service.name_en}
                  </option>
                ))}
              </select>
            </AdminField>
            <AdminField label={t("beforeAfter.fields.beforeImage")}>
              <ImageUploader name="before_image" defaultValue={editing?.before_image} folder="before-after" />
            </AdminField>
            <AdminField label={t("beforeAfter.fields.afterImage")}>
              <ImageUploader name="after_image" defaultValue={editing?.after_image} folder="before-after" />
            </AdminField>
            <AdminField label={t("beforeAfter.fields.sortOrder")}>
              <input type="number" name="sort_order" defaultValue={editing?.sort_order ?? 0} className="admin-input" />
            </AdminField>
            <AdminField label={t("beforeAfter.fields.visibility")}>
              <label className="flex h-10 items-center gap-2 rounded-xl border border-brand-line bg-white px-3 text-sm font-semibold text-brand-ink">
                <input type="checkbox" name="active" defaultChecked={editing?.active ?? true} className="h-4 w-4 accent-brand-teal" />
                {t("beforeAfter.fields.visible")}
              </label>
            </AdminField>
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 px-3 py-2.5 text-xs font-semibold text-red-600">{error}</p>
          )}

          <div className="flex items-center justify-end gap-2 border-t border-brand-line pt-4">
            <button type="button" onClick={() => setFormOpen(false)} className="admin-btn-ghost">
              {t("common.cancel")}
            </button>
            <button type="submit" disabled={pending} className="btn btn-primary">
              {pending && <Loader2 size={15} className="animate-spin" />}
              {editing ? t("common.saveChanges") : t("beforeAfter.add")}
            </button>
          </div>
        </form>
      </AdminDialog>

      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        title={t("beforeAfter.deleteTitle")}
        message={t("beforeAfter.deleteMessage", { name: deleting?.title_ar })}
        action={deleteBeforeAfterCase}
        id={deleting?.id}
      />
    </div>
  );
}
