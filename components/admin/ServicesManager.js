"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Plus, Pencil, Trash2, Stethoscope, Layers, Loader2, Inbox } from "lucide-react";
import AdminDialog from "./AdminDialog";
import ConfirmDialog from "./ConfirmDialog";
import AdminField from "./AdminField";
import StatusBadge from "./StatusBadge";
import SearchBox from "./SearchBox";
import ImageUploader from "./ImageUploader";
import { ICONS } from "@/lib/icon-map";
import {
  createService,
  updateService,
  deleteService,
  createServiceSubType,
  updateServiceSubType,
  deleteServiceSubType,
} from "@/app/admin/(dashboard)/services/actions";

export default function ServicesManager({ items, categories = [] }) {
  const t = useTranslations("admin");
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const submittingRef = useRef(false);

  const [typesOf, setTypesOf] = useState(null);
  const [subFormOpen, setSubFormOpen] = useState(false);
  const [subEditing, setSubEditing] = useState(null);
  const [subDeleting, setSubDeleting] = useState(null);
  const [subError, setSubError] = useState("");
  const [subPending, startSubTransition] = useTransition();
  const subSubmittingRef = useRef(false);

  const categoryName = (slug) =>
    categories.find((c) => c.slug === slug)?.name_ar ||
    (slug === "dentistry" || slug === "dermatology" ? t(`services.categories.${slug}`) : slug);

  const topLevel = useMemo(() => items.filter((s) => !s.parent_service_id), [items]);
  const subTypesOf = useMemo(
    () => (id) => items.filter((s) => s.parent_service_id === id),
    [items]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return topLevel;
    return topLevel.filter((s) =>
      [s.name_ar, s.name_en, s.excerpt_ar, s.excerpt_en]
        .filter(Boolean)
        .some((v) => v.toLowerCase().includes(q))
    );
  }, [topLevel, search]);

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
            ? t("common.saveFailed", { message: err.message })
            : t("common.saveFailedGeneric")
        );
      } finally {
        submittingRef.current = false;
      }
    });
  }

  function openSubCreate() {
    setSubEditing(null);
    setSubError("");
    setSubFormOpen(true);
  }

  function openSubEdit(item) {
    setSubEditing(item);
    setSubError("");
    setSubFormOpen(true);
  }

  function handleSubSubmit(e) {
    e.preventDefault();
    if (subSubmittingRef.current) return;
    subSubmittingRef.current = true;
    const fd = new FormData(e.currentTarget);
    fd.set("parent_service_id", typesOf.id);
    fd.set("category", typesOf.category);
    if (subEditing) fd.set("id", subEditing.id);
    startSubTransition(async () => {
      try {
        if (subEditing) await updateServiceSubType(fd);
        else await createServiceSubType(fd);
        setSubFormOpen(false);
        router.refresh();
      } catch (err) {
        setSubError(
          err?.message
            ? t("common.saveFailed", { message: err.message })
            : t("common.saveFailedGeneric")
        );
      } finally {
        subSubmittingRef.current = false;
      }
    });
  }

  const count = filtered.length;
  const subList = typesOf ? subTypesOf(typesOf.id) : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBox value={search} onChange={setSearch} placeholder={t("services.search")} />
        <button onClick={openCreate} className="btn btn-primary shrink-0">
          <Plus size={16} /> {t("services.add")}
        </button>
      </div>

      <div className="flex items-center gap-2 text-xs font-semibold text-brand-slate">
        <span className="rounded-full bg-brand-teal px-2.5 py-1 text-white">{count}</span>
        {t("services.countLabel")}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((service) => {
          const Icon = ICONS[service.icon] || Stethoscope;
          const typeCount = subTypesOf(service.id).length;
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
                  <StatusBadge active={service.active} activeLabel={t("common.activeFem")} inactiveLabel={t("common.inactiveFem")} />
                  <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-brand-teal ring-1 ring-brand-line">
                    {categoryName(service.category)}
                  </span>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    onClick={() => setTypesOf(service)}
                    className="admin-icon-btn bg-brand-mist text-brand-ink hover:bg-brand-teal hover:text-white"
                    title={t("services.typesButton")}
                    aria-label={t("services.typesLabel", { name: service.name_ar })}
                  >
                    <Layers size={15} />
                    <span className="text-[10px] font-extrabold">{typeCount}</span>
                  </button>
                  <button
                    onClick={() => openEdit(service)}
                    className="admin-icon-btn text-brand-teal hover:bg-brand-mist"
                    title={t("common.edit")}
                    aria-label={t("common.editLabel", { name: service.name_ar })}
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => setDeleting(service)}
                    className="admin-icon-btn text-red-500 hover:bg-red-50"
                    title={t("common.delete")}
                    aria-label={t("common.deleteLabel", { name: service.name_ar })}
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
              {search ? t("common.noResults") : t("services.emptyTitle")}
            </p>
            <p className="mt-1 text-xs text-brand-slate">
              {search ? t("common.tryDifferent") : t("services.emptyDesc")}
            </p>
          </div>
        </div>
      )}

      <AdminDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? t("services.dialogEditTitle") : t("services.dialogCreateTitle")}
        subtitle={editing ? t("services.dialogEditSubtitle") : t("services.dialogCreateSubtitle")}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminField label={t("services.fields.nameAr")}>
              <input name="name_ar" required defaultValue={editing?.name_ar} className="admin-input" />
            </AdminField>
            <AdminField label={t("services.fields.nameEn")}>
              <input name="name_en" required defaultValue={editing?.name_en} className="admin-input" />
            </AdminField>
            <AdminField label={t("services.fields.category")}>
              <select name="category" defaultValue={editing?.category || "dentistry"} className="admin-select">
                {categories.length ? (
                  categories.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name_ar} / {c.name_en}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="dentistry">
                      {t("services.categories.dentistry")} / Dentistry
                    </option>
                    <option value="dermatology">
                      {t("services.categories.dermatology")} / Dermatology
                    </option>
                  </>
                )}
              </select>
            </AdminField>
            <AdminField label={t("services.fields.icon")}>
              <select name="icon" defaultValue={editing?.icon || "sparkles"} className="admin-select">
                {Object.keys(ICONS).map((key) => (
                  <option key={key} value={key}>{key}</option>
                ))}
              </select>
            </AdminField>
            <AdminField label={t("services.fields.excerptAr")}>
              <input name="excerpt_ar" defaultValue={editing?.excerpt_ar} className="admin-input" />
            </AdminField>
            <AdminField label={t("services.fields.excerptEn")}>
              <input name="excerpt_en" defaultValue={editing?.excerpt_en} className="admin-input" />
            </AdminField>
            <AdminField label={t("services.fields.fullDescAr")} className="sm:col-span-2">
              <textarea name="description_ar" defaultValue={editing?.description_ar} className="admin-textarea" />
            </AdminField>
            <AdminField label={t("services.fields.fullDescEn")} className="sm:col-span-2">
              <textarea name="description_en" defaultValue={editing?.description_en} className="admin-textarea" />
            </AdminField>
            <AdminField label={t("services.fields.sortOrder")}>
              <input type="number" name="sort_order" defaultValue={editing?.sort_order ?? 0} className="admin-input" />
            </AdminField>
            <AdminField label={t("services.fields.visibility")}>
              <label className="flex h-10 items-center gap-2 rounded-xl border border-brand-line bg-white px-3 text-sm font-semibold text-brand-ink">
                <input type="checkbox" name="active" defaultChecked={editing?.active ?? true} className="h-4 w-4 accent-brand-teal" />
                {t("services.fields.visible")}
              </label>
            </AdminField>
            <AdminField label={t("services.fields.image")} className="sm:col-span-2">
              <ImageUploader name="image_url" defaultValue={editing?.image_url} folder="services" />
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
              {editing ? t("common.saveChanges") : t("services.add")}
            </button>
          </div>
        </form>
      </AdminDialog>

      <AdminDialog
        open={Boolean(typesOf)}
        onClose={() => setTypesOf(null)}
        title={t("services.typesDialogTitle", { name: typesOf?.name_ar || "" })}
        subtitle={t("services.typesDialogSubtitle")}
        size="lg"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-semibold text-brand-slate">
              <span className="rounded-full bg-brand-teal px-2.5 py-1 text-white">{subList.length}</span>{" "}
              {t("services.typesCountLabel")}
            </p>
            <button onClick={openSubCreate} className="btn btn-primary px-3 py-2 text-xs">
              <Plus size={14} /> {t("services.typesAdd")}
            </button>
          </div>

          <div className="space-y-3">
            {subList.map((sub) => {
              const Icon = ICONS[sub.icon] || Stethoscope;
              return (
                <div key={sub.id} className="admin-row">
                  <span className="admin-row-icon bg-brand-mist text-brand-teal">
                    <Icon size={16} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-brand-ink">{sub.name_ar}</p>
                    <p className="mt-0.5 truncate text-xs text-brand-slate">{sub.name_en}</p>
                    <div className="mt-2">
                      <StatusBadge active={sub.active} />
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      onClick={() => openSubEdit(sub)}
                      className="admin-icon-btn text-brand-teal hover:bg-brand-mist"
                      title={t("common.edit")}
                      aria-label={t("common.editLabel", { name: sub.name_ar })}
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => setSubDeleting(sub)}
                      className="admin-icon-btn text-red-500 hover:bg-red-50"
                      title={t("common.delete")}
                      aria-label={t("common.deleteLabel", { name: sub.name_ar })}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {!subList.length && (
            <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-brand-line bg-white/60 px-4 py-10 text-center">
              <p className="text-sm font-bold text-brand-ink">{t("services.typesEmptyTitle")}</p>
              <p className="text-xs text-brand-slate">{t("services.typesEmptyDesc")}</p>
            </div>
          )}
        </div>
      </AdminDialog>

      <AdminDialog
        open={subFormOpen}
        onClose={() => setSubFormOpen(false)}
        title={subEditing ? t("services.typesEditTitle") : t("services.typesCreateTitle")}
        subtitle={subEditing ? t("services.typesEditSubtitle") : t("services.typesCreateSubtitle")}
        size="lg"
      >
        <form onSubmit={handleSubSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminField label={t("services.fields.nameAr")}>
              <input name="name_ar" required defaultValue={subEditing?.name_ar} className="admin-input" />
            </AdminField>
            <AdminField label={t("services.fields.nameEn")}>
              <input name="name_en" required defaultValue={subEditing?.name_en} className="admin-input" />
            </AdminField>
            <AdminField label={t("services.fields.icon")}>
              <select name="icon" defaultValue={subEditing?.icon || "sparkles"} className="admin-select">
                {Object.keys(ICONS).map((key) => (
                  <option key={key} value={key}>{key}</option>
                ))}
              </select>
            </AdminField>
            <AdminField label={t("services.fields.excerptAr")}>
              <input name="excerpt_ar" defaultValue={subEditing?.excerpt_ar} className="admin-input" />
            </AdminField>
            <AdminField label={t("services.fields.excerptEn")}>
              <input name="excerpt_en" defaultValue={subEditing?.excerpt_en} className="admin-input" />
            </AdminField>
            <AdminField label={t("services.fields.fullDescAr")} className="sm:col-span-2">
              <textarea name="description_ar" defaultValue={subEditing?.description_ar} className="admin-textarea" />
            </AdminField>
            <AdminField label={t("services.fields.fullDescEn")} className="sm:col-span-2">
              <textarea name="description_en" defaultValue={subEditing?.description_en} className="admin-textarea" />
            </AdminField>
            <AdminField label={t("services.fields.sortOrder")}>
              <input type="number" name="sort_order" defaultValue={subEditing?.sort_order ?? 0} className="admin-input" />
            </AdminField>
            <AdminField label={t("services.fields.visibility")}>
              <label className="flex h-10 items-center gap-2 rounded-xl border border-brand-line bg-white px-3 text-sm font-semibold text-brand-ink">
                <input type="checkbox" name="active" defaultChecked={subEditing?.active ?? true} className="h-4 w-4 accent-brand-teal" />
                {t("services.fields.visible")}
              </label>
            </AdminField>
            <AdminField label={t("services.fields.image")} className="sm:col-span-2">
              <ImageUploader name="image_url" defaultValue={subEditing?.image_url} folder="services" />
            </AdminField>
          </div>

          {subError && (
            <p className="rounded-xl bg-red-50 px-3 py-2.5 text-xs font-semibold text-red-600">{subError}</p>
          )}

          <div className="flex items-center justify-end gap-2 border-t border-brand-line pt-4">
            <button type="button" onClick={() => setSubFormOpen(false)} className="admin-btn-ghost">
              {t("common.cancel")}
            </button>
            <button type="submit" disabled={subPending} className="btn btn-primary">
              {subPending && <Loader2 size={15} className="animate-spin" />}
              {subEditing ? t("common.saveChanges") : t("services.typesAdd")}
            </button>
          </div>
        </form>
      </AdminDialog>

      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        title={t("services.deleteTitle")}
        message={t("services.deleteMessage", { name: deleting?.name_ar })}
        action={deleteService}
        id={deleting?.id}
      />

      <ConfirmDialog
        open={Boolean(subDeleting)}
        onClose={() => setSubDeleting(null)}
        title={t("services.typesDeleteTitle")}
        message={t("services.typesDeleteMessage", { name: subDeleting?.name_ar })}
        action={deleteServiceSubType}
        id={subDeleting?.id}
      />
    </div>
  );
}