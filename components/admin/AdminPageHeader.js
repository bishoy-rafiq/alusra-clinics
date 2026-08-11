export default function AdminPageHeader({ eyebrow, title, subtitle, actions }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-brand-ink md:text-3xl">
          {title}
        </h1>
        {subtitle && <p className="mt-1 text-sm text-brand-slate">{subtitle}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
