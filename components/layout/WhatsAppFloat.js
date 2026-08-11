"use client";

import { FaWhatsapp } from "react-icons/fa6";
import { useTranslations } from "next-intl";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export default function WhatsAppFloat({ locale }) {
  const t = useTranslations("common");
  const href = buildWhatsAppLink({ locale, kind: "general" });

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("whatsappFloat")}
      className="fixed bottom-6 z-50 hidden h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-[0_16px_40px_-10px_rgba(37,211,102,0.6)] transition hover:scale-105 end-6 lg:flex"
    >
      <FaWhatsapp size={28} />
    </a>
  );
}
