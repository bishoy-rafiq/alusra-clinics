"use server";

import { revalidatePath } from "next/cache";
import { invalidateDataCache } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";

function slugify(text) {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/(^-|-$)/g, "");
}

function readDoctorForm(formData) {
  return {
    name_ar: formData.get("name_ar")?.toString() || "",
    name_en: formData.get("name_en")?.toString() || "",
    specialty_ar: formData.get("specialty_ar")?.toString() || "",
    specialty_en: formData.get("specialty_en")?.toString() || "",
    bio_ar: formData.get("bio_ar")?.toString() || "",
    bio_en: formData.get("bio_en")?.toString() || "",
    photo_url: formData.get("photo_url")?.toString() || null,
    sort_order: Number(formData.get("sort_order")) || 0,
    active: formData.get("active") === "on",
  };
}

export async function createDoctor(formData) {
  const supabase = await createClient();
  const values = readDoctorForm(formData);
  const slug = `${slugify(values.name_en || values.name_ar)}-${Date.now().toString(36)}`;

  const { error } = await supabase.from("doctors").insert({ ...values, slug });
  if (error) throw new Error(error.message);

  revalidatePath("/admin/doctors");
  revalidatePath("/[locale]", "layout");
  invalidateDataCache();
}

export async function updateDoctor(formData) {
  const supabase = await createClient();
  const values = readDoctorForm(formData);
  const id = formData.get("id");

  const { error } = await supabase.from("doctors").update(values).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/doctors");
  revalidatePath("/[locale]", "layout");
  invalidateDataCache();
}

export async function deleteDoctor(formData) {
  const id = formData.get("id");
  const supabase = await createClient();
  await supabase.from("doctors").delete().eq("id", id);

  revalidatePath("/admin/doctors");
  revalidatePath("/[locale]", "layout");
  invalidateDataCache();
}
