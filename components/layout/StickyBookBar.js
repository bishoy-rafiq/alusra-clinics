"use client";

import { FaWhatsapp } from "react-icons/fa6";
import { Phone } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export default function StickyBookBar({ settings }) {
  const locale = useLocale();
  const t = useTranslations("nav");
  const waLink = buildWhatsAppLink({ locale, kind: "general" });

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-brand-line bg-white/95 px-3 py-2.5 backdrop-blur-md lg:hidden" style={{ paddingBottom: "calc(0.625rem + env(safe-area-inset-bottom))" }}>
      <div className="flex items-center gap-2.5">
        <a href={`tel:${settings?.phone}`} className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full border border-brand-line text-sm font-bold text-brand-teal">
          <Phone size={17} />
          {locale === "ar" ? "اتصال" : "Call"}
        </a>
        <a href={waLink} target="_blank" rel="noopener noreferrer" className="flex h-12 flex-[1.6] items-center justify-center gap-2 rounded-full bg-[#25d366] text-sm font-bold text-white shadow-[0_10px_28px_-10px_rgba(37,211,102,0.7)]">
          <FaWhatsapp size={18} />
          {t("bookNow")}
        </a>
      </div>
    </div>
  );
}
