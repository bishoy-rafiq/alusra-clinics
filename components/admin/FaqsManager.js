"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Plus, Pencil, Trash2, HelpCircle, Loader2, Inbox } from "lucide-react";
import AdminDialog from "./AdminDialog";
import ConfirmDialog from "./ConfirmDialog";
import AdminField from "./AdminField";
import StatusBadge from "./StatusBadge";
import SearchBox from "./SearchBox";
import { createFaq, updateFaq, deleteFaq } from "@/app/admin/(dashboard)/faqs/actions";

export default function FaqsManager({ items }) {
  const t = useTranslations("admin");
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
    return items.filter((f) =>
      [f.question_ar, f.question_en, f.answer_ar, f.answer_en]
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
        if (editing) await updateFaq(fd);
        else await createFaq(fd);
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
        <SearchBox value={search} onChange={setSearch} placeholder={t("faqs.search")} />
        <button onClick={openCreate} className="btn btn-primary shrink-0">
          <Plus size={16} /> {t("faqs.add")}
        </button>
      </div>

      <div className="flex items-center gap-2 text-xs font-semibold text-brand-slate">
        <span className="rounded-full bg-brand-teal px-2.5 py-1 text-white">{count}</span>
        {t("faqs.countLabel")}
      </div>

      <div className="space-y-3">
        {filtered.map((item) => (
          <div key={item.id} className="admin-row">
            <span className="admin-row-icon bg-brand-mist text-brand-teal">
              <HelpCircle size={19} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-brand-ink">{item.question_ar}</p>
              <p className="mt-0.5 truncate text-xs text-brand-slate">{item.answer_ar}</p>
              <div className="mt-2">
                <StatusBadge active={item.active} />
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <button
                onClick={() => openEdit(item)}
                className="admin-icon-btn text-brand-teal hover:bg-brand-mist"
                title={t("common.edit")}
                aria-label={t("common.editLabel", { name: item.question_ar })}
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={() => setDeleting(item)}
                className="admin-icon-btn text-red-500 hover:bg-red-50"
                title={t("common.delete")}
                aria-label={t("common.deleteLabel", { name: item.question_ar })}
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
              {search ? t("common.noResults") : t("faqs.emptyTitle")}
            </p>
            <p className="mt-1 text-xs text-brand-slate">
              {search ? t("common.tryDifferent") : t("faqs.emptyDesc")}
            </p>
          </div>
        </div>
      )}

      <AdminDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? t("faqs.dialogEditTitle") : t("faqs.dialogCreateTitle")}
        subtitle={editing ? t("faqs.dialogEditSubtitle") : t("faqs.dialogCreateSubtitle")}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminField label={t("faqs.fields.questionAr")}>
              <input name="question_ar" required defaultValue={editing?.question_ar} className="admin-input" />
            </AdminField>
            <AdminField label={t("faqs.fields.questionEn")}>
              <input name="question_en" required defaultValue={editing?.question_en} className="admin-input" />
            </AdminField>
            <AdminField label={t("faqs.fields.answerAr")} className="sm:col-span-2">
              <textarea name="answer_ar" required defaultValue={editing?.answer_ar} className="admin-textarea" />
            </AdminField>
            <AdminField label={t("faqs.fields.answerEn")} className="sm:col-span-2">
              <textarea name="answer_en" required defaultValue={editing?.answer_en} className="admin-textarea" />
            </AdminField>
            <AdminField label={t("faqs.fields.sortOrder")}>
              <input type="number" name="sort_order" defaultValue={editing?.sort_order ?? 0} className="admin-input" />
            </AdminField>
            <AdminField label={t("faqs.fields.visibility")}>
              <label className="flex h-10 items-center gap-2 rounded-xl border border-brand-line bg-white px-3 text-sm font-semibold text-brand-ink">
                <input type="checkbox" name="active" defaultChecked={editing?.active ?? true} className="h-4 w-4 accent-brand-teal" />
                {t("faqs.fields.visible")}
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
              {editing ? t("common.saveChanges") : t("faqs.add")}
            </button>
          </div>
        </form>
      </AdminDialog>

      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        title={t("faqs.deleteTitle")}
        message={t("faqs.deleteMessage", { name: deleting?.question_ar })}
        action={deleteFaq}
        id={deleting?.id}
      />
    </div>
  );
}
