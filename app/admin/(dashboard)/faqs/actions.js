"use server";

import { revalidatePath } from "next/cache";
import { invalidateDataCache } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";

function readFaqForm(formData) {
  return {
    question_ar: formData.get("question_ar")?.toString() || "",
    question_en: formData.get("question_en")?.toString() || "",
    answer_ar: formData.get("answer_ar")?.toString() || "",
    answer_en: formData.get("answer_en")?.toString() || "",
    sort_order: Number(formData.get("sort_order")?.toString() || 0),
    active: formData.get("active") === "on",
  };
}

export async function createFaq(formData) {
  const supabase = await createClient();
  const values = readFaqForm(formData);

  const { error } = await supabase.from("faqs").insert(values);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/faqs");
  revalidatePath("/[locale]", "layout");
  invalidateDataCache();
}

export async function updateFaq(formData) {
  const supabase = await createClient();
  const values = readFaqForm(formData);
  const id = formData.get("id");

  const { error } = await supabase.from("faqs").update(values).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/faqs");
  revalidatePath("/[locale]", "layout");
  invalidateDataCache();
}

export async function deleteFaq(formData) {
  const id = formData.get("id");
  const supabase = await createClient();
  await supabase.from("faqs").delete().eq("id", id);

  revalidatePath("/admin/faqs");
  revalidatePath("/[locale]", "layout");
  invalidateDataCache();
}
