import { useTranslations } from "next-intl";

export default function StatusBadge({ active, activeLabel, inactiveLabel }) {
  const t = useTranslations("admin");
  const on = activeLabel || t("common.active");
  const off = inactiveLabel || t("common.inactive");
  return (
    <span className={`admin-pill ${active ? "admin-pill--on" : "admin-pill--off"}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {active ? on : off}
    </span>
  );
}
