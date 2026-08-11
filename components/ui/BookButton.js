"use client";

import { FaWhatsapp } from "react-icons/fa6";
import { useLocale, useTranslations } from "next-intl";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export default function BookButton({ name, kind = "service", label, variant = "whatsapp", className = "" }) {
  const locale = useLocale();
  const t = useTranslations("common");
  const href = buildWhatsAppLink({ locale, name, kind });
  const variantClass = variant === "gold" ? "btn btn-gold" : "btn btn-whatsapp";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${variantClass} ${className}`}
    >
      <FaWhatsapp size={17} />
      {label}
    </a>
  );
}
