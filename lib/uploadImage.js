import { createClient } from "@/lib/supabase/client";
import { compressImage } from "@/lib/imageCompress";

/**
 * Storage keys must be ASCII-only — Supabase rejects Unicode keys with 400
 * "InvalidKey" (e.g. Arabic filenames from mobile uploads). Strip everything
 * non-ASCII and keep latin letters, digits and safe separators.
 */
export function sanitizeStorageKey(str) {
  return (
    String(str || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9._-]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 120) || "image"
  );
}

/**
 * Upload an image to Supabase Storage (bucket: media) and return its public URL.
 * - Compresses to JPEG first (keeps uploads light).
 * - Uses an ASCII-only storage key so any filename works from any device.
 * - NO upsert header: `upsert: true` triggers an RLS violation (403 AccessDenied)
 *   even for authenticated admins, so we must let the append policy apply.
 */
export async function uploadImageToStorage(file, folder = "uploads") {
  const fileToUpload = await compressImage(file);
  const baseName = sanitizeStorageKey(fileToUpload.name.replace(/\.(jpe?g|png|webp)$/i, ""));
  const path = `${folder}/${Date.now()}-${baseName}.jpg`;

  const supabase = createClient();
  const { error } = await supabase.storage
    .from("media")
    .upload(path, fileToUpload, { contentType: "image/jpeg" });
  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from("media").getPublicUrl(path);
  return data.publicUrl;
}