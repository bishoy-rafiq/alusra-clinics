export default function AdminSectionCard({
  id,
  index,
  icon: Icon,
  title,
  hint,
  footer,
  children,
}) {
  return (
    <section
      id={id}
      className="scroll-mt-36 overflow-hidden rounded-2xl border border-brand-line bg-white shadow-[var(--shadow-soft)]"
    >
      <header className="flex items-center gap-3.5 border-b border-brand-line bg-gradient-to-r from-brand-mist/90 to-white/40 px-5 py-4 md:px-6">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-teal to-[#0a3a38] text-white shadow-sm">
          <Icon size={18} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-2 text-sm font-bold text-brand-ink">
            {index != null && (
              <span className="font-mono text-[11px] font-extrabold tracking-wider text-brand-aqua">
                {String(index).padStart(2, "0")}
              </span>
            )}
            <span className="truncate">{title}</span>
          </p>
          <p className="mt-0.5 text-xs leading-relaxed text-brand-slate">{hint}</p>
        </div>
      </header>

      <div className="p-5 md:p-6">{children}</div>

      {footer && (
        <footer className="flex items-center justify-end gap-3 border-t border-brand-line bg-brand-mist/40 px-5 py-3.5 md:px-6">
          {footer}
        </footer>
      )}
    </section>
  );
}
