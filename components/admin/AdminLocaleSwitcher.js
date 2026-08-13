"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Languages } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  ADMIN_LOCALE_COOKIE,
  ADMIN_LOCALES,
  ADMIN_DEFAULT_LOCALE,
  normalizeAdminLocale,
} from "@/lib/admin-locale";

function readCookieLocale() {
  if (typeof document === "undefined") return ADMIN_DEFAULT_LOCALE;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${ADMIN_LOCALE_COOKIE}=`));
  return normalizeAdminLocale(match?.split("=")[1]);
}

function setCookieLocale(next) {
  document.cookie = `${ADMIN_LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
}

export default function AdminLocaleSwitcher({ variant = "light" }) {
  const t = useTranslations("language");
  const router = useRouter();
  const [locale, setLocale] = useState(readCookieLocale);

  function switchTo(next) {
    if (next === locale) return;
    setCookieLocale(next);
    setLocale(next);
    router.refresh();
  }

  const base =
    variant === "dark"
      ? "border border-white/15 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
      : "border border-brand-line bg-white text-brand-slate hover:bg-brand-mist";

  return (
    <div
      role="group"
      aria-label={t("switchLabel")}
      className="flex items-center gap-1 rounded-xl p-1"
    >
      <Languages size={14} className={variant === "dark" ? "text-white/40" : "text-brand-slate/50"} />
      {ADMIN_LOCALES.map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => switchTo(code)}
          aria-pressed={locale === code}
          className={`rounded-lg px-2.5 py-1.5 text-xs font-bold transition ${
            locale === code
              ? "bg-brand-teal text-white shadow-[0_4px_12px_-4px_rgba(12,74,71,0.6)]"
              : `${base} hover:shadow-sm`
          }`}
        >
          {t(code)}
        </button>
      ))}
    </div>
  );
}
