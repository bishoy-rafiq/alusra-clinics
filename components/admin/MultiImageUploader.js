"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ImagePlus, Loader2, X, ChevronUp, ChevronDown, Star } from "lucide-react";
import { uploadImageToStorage } from "@/lib/uploadImage";

export default function MultiImageUploader({ name = "images", defaultImages = [], folder = "uploads" }) {
  const t = useTranslations("admin");
  const [images, setImages] = useState(() =>
    Array.isArray(defaultImages) ? defaultImages.filter(Boolean) : []
  );
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  async function uploadSelected(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    setError("");
    const added = [];
    try {
      for (const file of files) {
        const publicUrl = await uploadImageToStorage(file, folder);
        added.push(publicUrl);
      }
      setImages((prev) => [...prev, ...added]);
    } catch (err) {
      console.error("MULTI_IMG_UPLOAD_THREW:", err);
      setError(err?.message || t("image.uploadError"));
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function move(index, dir) {
    setImages((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function remove(index) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div>
      <input type="hidden" name={name} value={JSON.stringify(images)} />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((src, i) => (
          <div
            key={src + i}
            className="relative aspect-[4/3] overflow-hidden rounded-xl border border-brand-line bg-brand-mist"
          >
            <Image src={src} alt="" fill sizes="(min-width: 1024px) 180px, 45vw" className="object-cover" />

            <span className="absolute start-2 top-2 flex items-center gap-1 rounded-full bg-brand-ink/70 px-2 py-1 text-[10px] font-extrabold text-white">
              {i + 1}
              {i === 0 && <Star size={10} className="text-brand-gold" />}
            </span>

            {i === 0 && (
              <span className="absolute bottom-2 start-2 rounded-full bg-brand-gold px-2 py-0.5 text-[10px] font-extrabold text-brand-ink">
                {t("image.coverBadge")}
              </span>
            )}

            <div className="absolute end-2 top-2 flex flex-col gap-1">
              <button
                type="button"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                aria-label={t("image.moveUp")}
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/90 text-brand-ink shadow-sm transition-colors hover:bg-brand-gold disabled:opacity-40"
              >
                <ChevronUp size={13} />
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === images.length - 1}
                aria-label={t("image.moveDown")}
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/90 text-brand-ink shadow-sm transition-colors hover:bg-brand-gold disabled:opacity-40"
              >
                <ChevronDown size={13} />
              </button>
            </div>

            <button
              type="button"
              onClick={() => remove(i)}
              aria-label={t("image.removeImage")}
              className="absolute bottom-2 end-2 flex h-7 w-7 items-center justify-center rounded-lg bg-white/90 text-red-500 shadow-sm transition-colors hover:bg-red-500 hover:text-white"
            >
              <X size={13} />
            </button>
          </div>
        ))}

        <label className="flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-brand-line text-brand-slate transition hover:border-brand-aqua hover:text-brand-aqua">
          {uploading ? <Loader2 size={20} className="animate-spin" /> : <ImagePlus size={20} />}
          <span className="px-2 text-center text-xs font-semibold">
            {uploading ? t("image.uploading") : t("image.addMore")}
          </span>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={uploadSelected}
            disabled={uploading}
          />
        </label>
      </div>

      {error && <p className="mt-2 text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}