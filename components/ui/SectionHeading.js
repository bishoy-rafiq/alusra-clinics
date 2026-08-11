export default function SectionHeading({ eyebrow, title, subtitle, align = "start", light = false }) {
  return (
    <div className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      {title && (
        <h2 className={`font-display text-3xl font-bold leading-tight md:text-4xl ${light ? "text-white" : "text-brand-ink"}`}>
          {title}
        </h2>
      )}
      {subtitle && (
        <p className={`mt-4 text-base leading-relaxed ${light ? "text-white/70" : "text-brand-slate"}`}>{subtitle}</p>
      )}
    </div>
  );
}
