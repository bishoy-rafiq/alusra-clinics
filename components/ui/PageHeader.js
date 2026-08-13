export default function PageHeader({ eyebrow, title, subtitle, align = "start", actions }) {
  const content = (
    <>
      {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
      {title && (
        <h1 className="font-display text-3xl font-extrabold leading-tight text-brand-ink md:text-5xl">
          {title}
        </h1>
      )}
      {subtitle && <p className="mt-4 text-base leading-relaxed text-brand-slate md:text-lg">{subtitle}</p>}
    </>
  );

  return (
    <section className="bg-mesh border-b border-brand-line/70">
      <div className="container-brand py-14 md:py-20">
        {actions ? (
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">{content}</div>
            <div className="shrink-0 pb-1">{actions}</div>
          </div>
        ) : (
          <div className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}>{content}</div>
        )}
      </div>
    </section>
  );
}
