export default function AdminField({ label, hint, className, children }) {
  return (
    <div className={className}>
      <label className="admin-label">{label}</label>
      {children}
      {hint && <p className="mt-1 text-xs text-brand-slate">{hint}</p>}
    </div>
  );
}
