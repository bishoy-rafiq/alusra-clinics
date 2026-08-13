"use server";

import { revalidatePath } from "next/cache";
import { invalidateDataCache } from "@/lib/data";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { ADMIN_LOCALE_COOKIE, normalizeAdminLocale } from "@/lib/admin-locale";

function isTableNotFound(error) {
  return error?.code === "42P01" || /does not exist/i.test(error?.message || "");
}

function messages(locale) {
  const t =
    locale === "ar"
      ? {
          connect: "تعذّر الاتصال بقاعدة البيانات. تأكد من إعداد Supabase.",
          tableMissing: "جدول site_settings غير موجود بعد — شغّل supabase/schema.sql أولاً.",
          saveFailed: (message) => `تعذّر الحفظ: ${message}`,
          saved: "تم حفظ الإعدادات بنجاح.",
        }
      : {
          connect: "Could not connect to the database. Make sure Supabase is set up.",
          tableMissing: "The site_settings table does not exist yet — run supabase/schema.sql first.",
          saveFailed: (message) => `Could not save: ${message}`,
          saved: "Settings saved successfully.",
        };
  return t;
}

export async function updateSettings(prevState, formData) {
  const cookieStore = await cookies();
  const locale = normalizeAdminLocale(cookieStore.get(ADMIN_LOCALE_COOKIE)?.value);
  const t = messages(locale);

  let supabase;
  try {
    supabase = await createClient();
  } catch {
    return { ok: false, message: t.connect };
  }

  const values = {
    clinic_name_ar: formData.get("clinic_name_ar")?.toString() || "",
    clinic_name_en: formData.get("clinic_name_en")?.toString() || "",
    phone: formData.get("phone")?.toString() || "",
    whatsapp_number: formData.get("whatsapp_number")?.toString() || "",
    email: formData.get("email")?.toString() || "",
    address_ar: formData.get("address_ar")?.toString() || "",
    address_en: formData.get("address_en")?.toString() || "",
    working_hours_ar: formData.get("working_hours_ar")?.toString() || "",
    working_hours_en: formData.get("working_hours_en")?.toString() || "",
    maps_url: formData.get("maps_url")?.toString() || "",
    instagram_url: formData.get("instagram_url")?.toString() || "",
    snapchat_url: formData.get("snapchat_url")?.toString() || "",
    x_url: formData.get("x_url")?.toString() || "",
    facebook_url: formData.get("facebook_url")?.toString() || "",
    tiktok_url: formData.get("tiktok_url")?.toString() || "",
    youtube_url: formData.get("youtube_url")?.toString() || "",
    telegram_url: formData.get("telegram_url")?.toString() || "",
    linkedin_url: formData.get("linkedin_url")?.toString() || "",
    about_title_ar: formData.get("about_title_ar")?.toString() || "",
    about_title_en: formData.get("about_title_en")?.toString() || "",
    about_text_ar: formData.get("about_text_ar")?.toString() || "",
    about_text_en: formData.get("about_text_en")?.toString() || "",
  };

  const { error } = await supabase.from("site_settings").update(values).eq("id", 1);

  if (error) {
    if (isTableNotFound(error)) {
      return {
        ok: false,
        message: t.tableMissing,
      };
    }
    return { ok: false, message: t.saveFailed(error.message) };
  }

  revalidatePath("/admin/settings");
  revalidatePath("/[locale]", "layout");
  invalidateDataCache();
  return { ok: true, message: t.saved };
}

export async function saveSectionImages({ aboutImages, contactImages } = {}) {
  const cookieStore = await cookies();
  const locale = normalizeAdminLocale(cookieStore.get(ADMIN_LOCALE_COOKIE)?.value);
  const t = messages(locale);

  let supabase;
  try {
    supabase = await createClient();
  } catch {
    return { ok: false, message: t.connect };
  }

  const { error } = await supabase
    .from("site_settings")
    .update({
      about_images: Array.isArray(aboutImages) ? aboutImages : [],
      contact_images: Array.isArray(contactImages) ? contactImages : [],
    })
    .eq("id", 1);

  if (error) {
    if (isTableNotFound(error)) {
      return { ok: false, message: t.tableMissing };
    }
    return { ok: false, message: t.saveFailed(error.message) };
  }

  revalidatePath("/admin/settings");
  revalidatePath("/[locale]", "layout");
  invalidateDataCache();
  return { ok: true, message: t.saved };
}
