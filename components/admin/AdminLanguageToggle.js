"use client";

import { useState, useTransition } from "react";
import { useRouter as useNextRouter } from "next/navigation";
import { useRouter as useI18nRouter, usePathname } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import {
  ADMIN_LOCALE_COOKIE,
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

export default function AdminLanguageToggle({ mode = "cookie" }) {
  const t = useTranslations("language");
  const intlLocale = useLocale();
  const nextRouter = useNextRouter();
  const i18nRouter = useI18nRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [cookieLocale, setCookieLocaleState] = useState(readCookieLocale);

  const locale = mode === "url" ? intlLocale : cookieLocale;
  const nextLocale = locale === "ar" ? "en" : "ar";

  function handleToggle() {
    if (mode === "url") {
      startTransition(() => {
        i18nRouter.replace(pathname, { locale: nextLocale });
      });
      return;
    }
    setCookieLocale(nextLocale);
    setCookieLocaleState(nextLocale);
    nextRouter.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isPending}
      aria-label={locale === "ar" ? "Switch to English" : "التبديل إلى العربية"}
      className="lang-toggle"
      data-locale={locale}
      title={t("switchLabel")}
    >
      <span className="lang-toggle-thumb">{locale === "ar" ? "EN" : "AR"}</span>
      <span className="sr-only">{locale === "ar" ? "عربي" : "English"}</span>
      <span
        aria-hidden="true"
        className="lang-toggle-label"
        style={{
          position: "absolute",
          insetInlineEnd: locale === "ar" ? "0.55rem" : "auto",
          insetInlineStart: locale === "en" ? "0.5rem" : "auto",
        }}
      >
        {locale === "ar" ? "AR" : "EN"}
      </span>
    </button>
  );
}
