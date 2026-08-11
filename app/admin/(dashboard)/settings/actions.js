"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateSettings(formData) {
  const supabase = await createClient();

  const values = {
    clinic_name_ar: formData.get("clinic_name_ar")?.toString() || "",
    clinic_name_en: formData.get("clinic_name_en")?.toString() || "",
    phone: formData.get("phone")?.toString() || "",
    whatsapp_number: formData.get("whatsapp_number")?.toString() || "",
    email: formData.get("email")?.toString() || "",
    address_ar: formData.get("address_ar")?.toString() || "",
    address_en: formData.get("address_en")?.toString() || "",
    maps_url: formData.get("maps_url")?.toString() || "",
    instagram_url: formData.get("instagram_url")?.toString() || "",
    snapchat_url: formData.get("snapchat_url")?.toString() || "",
    x_url: formData.get("x_url")?.toString() || "",
    facebook_url: formData.get("facebook_url")?.toString() || "",
    google_place_id: formData.get("google_place_id")?.toString() || "",
    about_title_ar: formData.get("about_title_ar")?.toString() || "",
    about_title_en: formData.get("about_title_en")?.toString() || "",
    about_text_ar: formData.get("about_text_ar")?.toString() || "",
    about_text_en: formData.get("about_text_en")?.toString() || "",
  };

  const { error } = await supabase.from("site_settings").update(values).eq("id", 1);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/settings");
  revalidatePath("/[locale]", "layout");
}
