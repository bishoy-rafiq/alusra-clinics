"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function readBeforeAfterForm(formData) {
  return {
    title_ar: formData.get("title_ar")?.toString() || "",
    title_en: formData.get("title_en")?.toString() || "",
    description_ar: formData.get("description_ar")?.toString() || "",
    description_en: formData.get("description_en")?.toString() || "",
    before_image: formData.get("before_image")?.toString() || null,
    after_image: formData.get("after_image")?.toString() || null,
    related_service_id: formData.get("related_service_id")?.toString() || null,
    sort_order: Number(formData.get("sort_order")?.toString() || 0),
    active: formData.get("active") === "on",
  };
}

export async function createBeforeAfterCase(formData) {
  const supabase = await createClient();
  const values = readBeforeAfterForm(formData);

  const { error } = await supabase.from("before_after_cases").insert(values);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/before-after");
  revalidatePath("/[locale]", "layout");
}

export async function updateBeforeAfterCase(formData) {
  const supabase = await createClient();
  const values = readBeforeAfterForm(formData);
  const id = formData.get("id");

  const { error } = await supabase.from("before_after_cases").update(values).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/before-after");
  revalidatePath("/[locale]", "layout");
}

export async function deleteBeforeAfterCase(formData) {
  const id = formData.get("id");
  const supabase = await createClient();
  await supabase.from("before_after_cases").delete().eq("id", id);

  revalidatePath("/admin/before-after");
  revalidatePath("/[locale]", "layout");
}
