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

function readServiceForm(formData) {
  return {
    category: formData.get("category")?.toString() || "dentistry",
    name_ar: formData.get("name_ar")?.toString() || "",
    name_en: formData.get("name_en")?.toString() || "",
    excerpt_ar: formData.get("excerpt_ar")?.toString() || "",
    excerpt_en: formData.get("excerpt_en")?.toString() || "",
    description_ar: formData.get("description_ar")?.toString() || "",
    description_en: formData.get("description_en")?.toString() || "",
    icon: formData.get("icon")?.toString() || "sparkles",
    image_url: formData.get("image_url")?.toString() || null,
    sort_order: Number(formData.get("sort_order")) || 0,
    active: formData.get("active") === "on",
  };
}

export async function createService(formData) {
  const supabase = await createClient();
  const values = readServiceForm(formData);
  const slug = `${slugify(values.name_en || values.name_ar)}`;

  const { error } = await supabase.from("services").insert({ ...values, slug });
  if (error) throw new Error(error.message);

  revalidatePath("/admin/services");
  revalidatePath("/[locale]", "layout");
}

export async function updateService(formData) {
  const supabase = await createClient();
  const values = readServiceForm(formData);
  const id = formData.get("id");

  const { error } = await supabase.from("services").update(values).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/services");
  revalidatePath("/[locale]", "layout");
}

export async function deleteService(formData) {
  const id = formData.get("id");
  const supabase = await createClient();
  await supabase.from("services").delete().eq("id", id);

  revalidatePath("/admin/services");
  revalidatePath("/[locale]", "layout");
}
