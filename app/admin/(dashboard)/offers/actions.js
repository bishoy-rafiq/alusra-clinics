"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function slugify(text) {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/(^-|-$)/g, "");
}

function readOfferForm(formData) {
  return {
    title_ar: formData.get("title_ar")?.toString() || "",
    title_en: formData.get("title_en")?.toString() || "",
    description_ar: formData.get("description_ar")?.toString() || "",
    description_en: formData.get("description_en")?.toString() || "",
    badge_ar: formData.get("badge_ar")?.toString() || "",
    badge_en: formData.get("badge_en")?.toString() || "",
    image_url: formData.get("image_url")?.toString() || null,
    valid_until: formData.get("valid_until")?.toString() || null,
    active: formData.get("active") === "on",
  };
}

export async function createOffer(formData) {
  const supabase = await createClient();
  const values = readOfferForm(formData);
  const slug = `${slugify(values.title_en || values.title_ar)}-${Date.now().toString(36)}`;

  const { error } = await supabase.from("offers").insert({ ...values, slug });
  if (error) throw new Error(error.message);

  revalidatePath("/admin/offers");
  revalidatePath("/[locale]", "layout");
}

export async function updateOffer(formData) {
  const supabase = await createClient();
  const values = readOfferForm(formData);
  const id = formData.get("id");

  const { error } = await supabase.from("offers").update(values).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/offers");
  revalidatePath("/[locale]", "layout");
}

export async function deleteOffer(formData) {
  const id = formData.get("id");
  const supabase = await createClient();
  await supabase.from("offers").delete().eq("id", id);

  revalidatePath("/admin/offers");
  revalidatePath("/[locale]", "layout");
}
