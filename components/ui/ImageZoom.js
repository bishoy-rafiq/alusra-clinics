"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { ZoomIn, ZoomOut, RotateCcw, Maximize2, X } from "lucide-react";

export default function ImageZoom({ src, alt, children, className = "" }) {
  const [open, setOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const closeBtnRef = useRef(null);
  const t = useTranslations("offers");

  const openViewer = () => {
    setScale(1);
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();

    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const stepZoom = (dir) =>
    setScale((s) => Math.max(1, Math.min(3, +(s + dir * 0.5).toFixed(2))));

  const trigger = children ? (
    <button
      type="button"
      onClick={openViewer}
      aria-label={t("openImage")}
      className="group/zoom relative block h-full w-full cursor-zoom-in text-start"
    >
      {children}
    </button>
  ) : (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        openViewer();
      }}
      aria-label={t("openImage")}
      className={className}
    >
      <ZoomIn size={16} />
    </button>
  );

  return (
    <>
      {trigger}

      {open &&
        createPortal(
          <div
            className="offer-backdrop fixed inset-0 z-[200] flex flex-col bg-black/95 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label={alt}
            onClick={() => setOpen(false)}
          >
            <div
              className="offer-dialog flex max-h-full flex-1 flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between gap-4 px-4 py-3 md:px-6">
                <p className="truncate text-sm font-bold text-white/90">{alt}</p>
                <button
                  ref={closeBtnRef}
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label={t("close")}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-colors hover:border-brand-gold hover:bg-brand-gold hover:text-brand-ink"
                >
                  <X size={18} />
                </button>
              </div>

              <div
                className="relative flex flex-1 items-center justify-center overflow-hidden px-4 pb-2"
                onClick={() => setScale((s) => (s > 1 ? 1 : 1.75))}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={alt}
                  className="max-h-full max-w-full rounded-xl object-contain shadow-2xl transition-transform duration-300 ease-out"
                  style={{ transform: `scale(${scale})` }}
                />
              </div>

              <div className="flex items-center justify-center gap-2 px-4 py-4 md:gap-3">
                <LightboxBtn onClick={() => stepZoom(-1)} label={t("zoomOut")}>
                  <ZoomOut size={17} />
                </LightboxBtn>
                <span className="w-12 text-center text-sm font-bold text-white/80">
                  {Math.round(scale * 100)}%
                </span>
                <LightboxBtn onClick={() => stepZoom(1)} label={t("zoomIn")}>
                  <ZoomIn size={17} />
                </LightboxBtn>
                <span className="mx-1 h-6 w-px bg-white/15" />
                <LightboxBtn onClick={() => setScale(1)} label={t("resetZoom")}>
                  <RotateCcw size={16} />
                </LightboxBtn>
                <a
                  href={src}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={t("openNewTab")}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-colors hover:border-brand-gold hover:bg-brand-gold hover:text-brand-ink"
                >
                  <Maximize2 size={16} />
                </a>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

function LightboxBtn({ onClick, label, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-colors hover:border-brand-gold hover:bg-brand-gold hover:text-brand-ink"
    >
      {children}
    </button>
  );
}