"use client";

import { useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import ImageZoom from "./ImageZoom";

export default function OfferGallery({ images = [], alt }) {
  const t = useTranslations("offers");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const base = Array.isArray(images) ? images : [];
  const imgs = base.filter(Boolean);

  const [index, setIndex] = useState(0);
  if (imgs.length === 0) return null;

  const count = imgs.length;
  const current = imgs[Math.min(index, count - 1)];
  const showNav = count > 1;

  const prevImg = () => setIndex((i) => (i - 1 + count) % count);
  const nextImg = () => setIndex((i) => (i + 1) % count);
  const PrevIcon = isRtl ? ChevronRight : ChevronLeft;
  const NextIcon = isRtl ? ChevronLeft : ChevronRight;

  return (
    <div>
      <div className="relative aspect-[3/4] max-h-[72vh] w-full overflow-hidden rounded-[1.6rem] bg-brand-mist">
        <ImageZoom src={current} alt={alt}>
          <Image
            src={current}
            alt={alt}
            fill
            priority
            sizes="(min-width: 1024px) 45vw, 90vw"
            className="object-contain"
          />

          <span className="pointer-events-none absolute bottom-4 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-white/25 bg-brand-ink/70 px-4 py-2 text-xs font-extrabold text-white backdrop-blur-md transition-colors duration-300 group-hover/zoom:bg-brand-ink/90">
            <ZoomIn size={14} className="text-brand-gold" />
            {t("openImageHint")}
          </span>
        </ImageZoom>

        {showNav && (
          <>
            <button
              type="button"
              onClick={prevImg}
              aria-label={t("prevImage")}
              className="absolute start-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-brand-ink/60 p-2 text-white backdrop-blur-md transition-colors hover:bg-brand-ink"
            >
              <PrevIcon size={20} />
            </button>
            <button
              type="button"
              onClick={nextImg}
              aria-label={t("nextImage")}
              className="absolute end-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-brand-ink/60 p-2 text-white backdrop-blur-md transition-colors hover:bg-brand-ink"
            >
              <NextIcon size={20} />
            </button>
            <span className="absolute bottom-4 end-4 z-10 rounded-full bg-brand-ink/70 px-3 py-1 text-xs font-extrabold text-white backdrop-blur-md">
              {index + 1} / {count}
            </span>
          </>
        )}
      </div>

      {showNav && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {imgs.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={t("openImageIndex", { index: i + 1 })}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                i === index ? "border-brand-gold" : "border-white/70 opacity-60 hover:opacity-100"
              }`}
            >
              <Image src={src} alt="" fill sizes="64px" className="object-cover" />
              {i === 0 && (
                <span className="absolute inset-x-0 bottom-0 bg-brand-gold text-center text-[9px] font-extrabold text-brand-ink">
                  {t("coverBadge")}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}