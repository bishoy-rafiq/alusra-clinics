"use client";

import { useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import AdminDialog from "./AdminDialog";

export default function ConfirmDialog({ open, onClose, title, message, action, id }) {
  const router = useRouter();
  const t = useTranslations("admin");
  const [pending, startTransition] = useTransition();
  const deletingRef = useRef(false);

  function handleDelete() {
    if (deletingRef.current) return;
    deletingRef.current = true;
    const fd = new FormData();
    fd.set("id", id);
    startTransition(async () => {
      try {
        await action(fd);
        onClose();
        router.refresh();
      } catch {
        onClose();
        router.refresh();
      } finally {
        deletingRef.current = false;
      }
    });
  }

  return (
    <AdminDialog open={open} onClose={onClose} title={title} size="sm">
      <div className="flex items-start gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600">
          <AlertTriangle size={20} />
        </span>
        <p className="pt-1 text-sm leading-relaxed text-brand-slate">{message}</p>
      </div>
      <div className="mt-6 flex items-center justify-end gap-2 border-t border-brand-line pt-4">
        <button type="button" onClick={onClose} disabled={pending} className="admin-btn-ghost">
          {t("common.cancel")}
        </button>
        <button type="button" onClick={handleDelete} disabled={pending} className="admin-btn-danger">
          {pending ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
          {pending ? t("common.deleting") : t("common.deleteForever")}
        </button>
      </div>
    </AdminDialog>
  );
}
