"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ImagePlus, Loader2, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ImageUploader({ name, defaultValue, folder = "uploads" }) {
  const t = useTranslations("admin");
  const [url, setUrl] = useState(defaultValue || "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");

    try {
      const supabase = createClient();
      const path = `${folder}/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
      const { error: uploadError } = await supabase.storage.from("media").upload(path, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from("media").getPublicUrl(path);
      setUrl(data.publicUrl);
    } catch {
      setError("uploadError");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <input type="hidden" name={name} value={url} />
      {url ? (
        <div className="relative h-40 w-40 overflow-hidden rounded-2xl border border-brand-line">
          <Image src={url} alt="" fill className="object-cover" />
          <button
            type="button"
            onClick={() => setUrl("")}
            className="absolute end-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white"
            aria-label={t("common.close")}
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <label className="flex h-40 w-40 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-brand-line text-brand-slate transition hover:border-brand-aqua hover:text-brand-aqua">
          {uploading ? <Loader2 size={22} className="animate-spin" /> : <ImagePlus size={22} />}
          <span className="text-xs font-semibold">{uploading ? t("image.uploading") : t("image.upload")}</span>
          <input type="file" accept="image/*" className="hidden" onChange={handleChange} disabled={uploading} />
        </label>
      )}
      {error === "uploadError" && <p className="mt-2 text-xs font-medium text-red-600">{t("image.uploadError")}</p>}
    </div>
  );
}
