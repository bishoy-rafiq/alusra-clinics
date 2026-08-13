"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Sparkles, Gift, BadgePercent, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import OfferSubscribe from "@/components/OfferSubscribe";

const PERKS = [
  { key: "perkGift", icon: Gift },
  { key: "perkDiscount", icon: BadgePercent },
  { key: "perkTrust", icon: ShieldCheck },
];

export default function OfferSubscribeDialog({
  label,
  buttonClassName = "btn btn-primary",
  autoOpen = false,
}) {
  const t = useTranslations("subscribe");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!autoOpen) return;
    let cancelled = false;
    try {
      if (localStorage.getItem("offer_dialog_seen") === "1") return;
    } catch {}
    const id = setTimeout(() => {
      if (cancelled) return;
      // Delayed open so the page paints before the offer appears.
      setOpen(true);
      try {
        localStorage.setItem("offer_dialog_seen", "1");
      } catch {}
    }, 1400);
    return () => {
      cancelled = true;
      clearTimeout(id);
    };
  }, [autoOpen]);

  useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={buttonClassName}>
        <Sparkles size={18} />
        <span>{label || t("cta")}</span>
      </button>

      {open &&
        createPortal(
          <div
            className="offer-backdrop fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-label={t("dialogTitle")}
          >
            <div
              className="absolute inset-0 bg-brand-ink/60 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <div className="offer-dialog relative flex max-h-[94dvh] w-full max-w-lg flex-col overflow-hidden rounded-[1.75rem] bg-white shadow-[var(--shadow-lifted)]">
              <div className="relative overflow-hidden bg-gradient-to-br from-brand-teal via-brand-teal-mid to-brand-ink px-6 pb-6 pt-8 text-center">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-brand-gold ring-1 ring-white/25">
                  <Sparkles size={26} />
                </span>
                <h2 className="mt-3 font-display text-xl font-bold text-white">{t("dialogTitle")}</h2>
                <p className="mx-auto mt-1 max-w-sm text-sm leading-relaxed text-white/80">
                  {t("dialogSubtitle")}
                </p>
                <div className="mt-5 grid grid-cols-3 gap-2">
                  {PERKS.map(({ key, icon: Icon }) => (
                    <div
                      key={key}
                      className="flex flex-col items-center gap-1.5 rounded-2xl bg-white/10 px-2 py-3 ring-1 ring-white/15"
                    >
                      <Icon size={16} className="text-brand-gold" />
                      <span className="text-[0.68rem] font-bold leading-snug text-white/90">{t(key)}</span>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label={t("close")}
                  className="absolute end-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/80 ring-1 ring-white/20 transition hover:bg-white/20 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6">
                <OfferSubscribe variant="bare" />
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="w-full border-t border-brand-line py-3 text-center text-xs font-bold text-brand-slate transition hover:text-brand-teal"
              >
                {t("skip")}
              </button>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
