"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

export default function AdminDialog({
  open,
  onClose,
  title,
  subtitle,
  children,
  size = "md",
}) {
  useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  const maxWidth =
    size === "lg" ? "sm:max-w-2xl" : size === "sm" ? "sm:max-w-sm" : "sm:max-w-lg";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="admin-backdrop absolute inset-0 bg-brand-ink/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={`admin-dialog relative flex max-h-[94dvh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl ${maxWidth}`}
      >
        <header className="flex items-start justify-between gap-4 border-b border-brand-line bg-gradient-to-b from-brand-mist/70 to-transparent px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <h2 className="font-display text-lg font-extrabold text-brand-ink">{title}</h2>
            {subtitle && <p className="mt-0.5 text-xs text-brand-slate">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            aria-label="إغلاق"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-brand-slate shadow-sm ring-1 ring-brand-line transition hover:bg-brand-ink hover:text-white"
          >
            <X size={16} />
          </button>
        </header>
        <div className="admin-dialog-body flex-1 overflow-y-auto px-5 py-5 sm:px-6">{children}</div>
      </div>
    </div>
  );
}
