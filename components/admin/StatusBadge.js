export default function StatusBadge({ active, activeLabel = "مفعّل", inactiveLabel = "متوقف" }) {
  return (
    <span className={`admin-pill ${active ? "admin-pill--on" : "admin-pill--off"}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {active ? activeLabel : inactiveLabel}
    </span>
  );
}
