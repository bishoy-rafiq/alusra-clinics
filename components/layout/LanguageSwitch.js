"use client";

import { useTransition } from "react";
import { Lock, Unlock } from "lucide-react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

/**
 * A pill-shaped toggle styled like a lock/unlock switch: AR is the
 * "locked" (default/original) state, EN is "unlocked". Swaps locale
 * while preserving the current page, so both language versions of every
 * URL stay crawlable and linked via hreflang.
 */
export default function LanguageSwitch({ variant = "surface" }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const nextLocale = locale === "ar" ? "en" : "ar";

  function handleToggle() {
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isPending}
      aria-label={locale === "ar" ? "Switch to English" : "التبديل إلى العربية"}
      className="lang-toggle"
      data-locale={locale}
      data-variant={variant}
    >
      <span className="lang-toggle-thumb">
        {locale === "ar" ? "EN" : "AR"}
      </span>
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
