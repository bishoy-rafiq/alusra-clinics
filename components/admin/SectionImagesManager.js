"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ImagePlus, Loader2, X, Images, CheckCircle2, AlertCircle, Save } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { compressImage, isHighResImage } from "@/lib/imageCompress";
import { saveSectionImages } from "@/app/admin/(dashboard)/settings/actions";
import AdminSectionCard from "@/components/admin/AdminSectionCard";

function ImageList({ urls, onRemove, onUpload, uploading, addLabel, removeLabel }) {
  return (
    <div className="flex flex-wrap gap-3">
      {urls.map((url) => (
        <div
          key={url}
          className="group relative h-32 w-32 overflow-hidden rounded-2xl border border-brand-line shadow-soft"
        >
          <Image src={url} alt="" fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
          <button
            type="button"
            onClick={() => onRemove(url)}
            aria-label={removeLabel}
            className="absolute end-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white transition hover:scale-110 hover:bg-red-600"
          >
            <X size={14} />
          </button>
        </div>
      ))}
      <label className="flex h-32 w-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-brand-line text-brand-slate transition hover:border-brand-aqua hover:text-brand-aqua hover:bg-brand-mist/50">
        {uploading ? <Loader2 size={20} className="animate-spin" /> : <ImagePlus size={20} />}
        <span className="px-2 text-center text-[11px] font-semibold">
          {uploading ? "" : addLabel}
        </span>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          disabled={uploading}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onUpload(file);
            e.target.value = "";
          }}
        />
      </label>
    </div>
  );
}

export default function SectionImagesManager({ aboutImages = [], contactImages = [] }) {
  const t = useTranslations("admin");
  const [about, setAbout] = useState(aboutImages);
  const [contact, setContact] = useState(contactImages);
  const [uploading, setUploading] = useState(null);
  const [state, setState] = useState(null);
  const [pending, startTransition] = useTransition();

  async function handleUpload(target, file) {
    if (!file || uploading) return;
    setUploading(target);
    setState(null);
    try {
      const fileToUpload = isHighResImage(file) ? await compressImage(file) : file;
      const supabase = createClient();
      const path = `sections/${Date.now()}-${fileToUpload.name.replace(/\s+/g, "-")}`;
      const { error } = await supabase.storage.from("media").upload(path, fileToUpload, { upsert: true });
      if (error) throw error;
      const { data } = supabase.storage.from("media").getPublicUrl(path);
      if (target === "contact") setContact((c) => [...c, data.publicUrl]);
      else setAbout((a) => [...a, data.publicUrl]);
    } catch {
      setState({ ok: false, message: t("image.uploadError") });
    } finally {
      setUploading(null);
    }
  }

  function save() {
    startTransition(async () => {
      const res = await saveSectionImages({ aboutImages: about, contactImages: contact });
      setState(res);
    });
  }

  return (
    <AdminSectionCard
      id="section-images"
      index={4}
      icon={Images}
      title={t("images.title")}
      hint={t("images.hint")}
      footer={
        <>
          {state?.ok === false && (
            <span className="me-auto flex min-w-0 items-center gap-1.5 text-xs font-semibold text-red-600">
              <AlertCircle size={14} className="shrink-0" />
              <span className="truncate">{state.message}</span>
            </span>
          )}
          {state?.ok === true && (
            <span className="me-auto flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
              <CheckCircle2 size={14} className="shrink-0" />
              {state.message}
            </span>
          )}
          <button type="button" onClick={save} disabled={pending || uploading} className="btn btn-primary">
            {pending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {t("settings.save")}
          </button>
        </>
      }
    >
      <div className="space-y-6">
        <div>
          <p className="text-sm font-bold text-brand-ink">{t("images.aboutTitle")}</p>
          <p className="mt-1 text-xs text-brand-slate">{t("images.aboutHint")}</p>
          <div className="mt-3">
            <ImageList
              urls={about}
              onRemove={(url) => setAbout((a) => a.filter((x) => x !== url))}
              onUpload={(file) => handleUpload("about", file)}
              uploading={uploading === "about"}
              addLabel={t("images.add")}
              removeLabel={t("images.remove")}
            />
          </div>
        </div>

        <div className="border-t border-brand-line pt-6">
          <p className="text-sm font-bold text-brand-ink">{t("images.contactTitle")}</p>
          <p className="mt-1 text-xs text-brand-slate">{t("images.contactHint")}</p>
          <div className="mt-3">
            <ImageList
              urls={contact}
              onRemove={(url) => setContact((c) => c.filter((x) => x !== url))}
              onUpload={(file) => handleUpload("contact", file)}
              uploading={uploading === "contact"}
              addLabel={t("images.add")}
              removeLabel={t("images.remove")}
            />
          </div>
        </div>
      </div>
    </AdminSectionCard>
  );
}
