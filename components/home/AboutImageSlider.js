"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DEFAULT_IMAGES = [
  { src: "/images/alusra-clinics.jpeg", alt: "Alusra Clinics" },
  { src: "/images/clinic-interior.jpg", alt: "Clinic interior" },
  { src: "/images/smile-woman.jpg", alt: "Patient smile" },
];

export default function AboutImageSlider({ images }) {
  const locale = useLocale();
  const isRTL = locale === "ar";

  const list =
    images?.length
      ? images.map((src, i) => ({ src, alt: `Alusra Clinics ${i + 1}` }))
      : DEFAULT_IMAGES;

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setIndex((i) => (i + 1) % list.length), [list.length]);
  const prev = useCallback(
    () => setIndex((i) => (i - 1 + list.length) % list.length),
    [list.length]
  );

  useEffect(() => {
    if (paused || list.length <= 1) return;
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [next, paused, list.length]);

  const active = Math.min(index, list.length - 1);

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative aspect-[4/4.5] overflow-hidden rounded-t-[12rem] rounded-b-[2rem] shadow-[var(--shadow-lifted)] ring-1 ring-white/60">
        {list.map((img, i) => (
          <div
            key={img.src}
            className={`absolute inset-0 transition-opacity duration-700 ease-out ${
              i === active ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={i !== active}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              priority={i === 0}
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/55 via-brand-ink/5 to-transparent" />
          </div>
        ))}
      </div>

      {list.length > 1 && (
        <>
          {/* Prev / next */}
          <button
            type="button"
            onClick={prev}
            aria-label="Previous image"
            className="glass absolute start-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-brand-ink shadow-[var(--shadow-lifted)] transition-colors hover:bg-white"
          >
            {isRTL ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next image"
            className="glass absolute end-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-brand-ink shadow-[var(--shadow-lifted)] transition-colors hover:bg-white"
          >
            {isRTL ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 start-1/2 flex -translate-x-1/2 items-center gap-2 rtl:translate-x-1/2">
            {list.map((img, i) => (
              <button
                key={img.src}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Image ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === active ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
