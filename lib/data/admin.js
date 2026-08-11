import { createClient } from "@/lib/supabase/server";

async function fetchAll(table, orderBy = "created_at") {
  const supabase = await createClient();
  const { data, error } = await supabase.from(table).select("*").order(orderBy, { ascending: false });
  if (error) return [];
  return data || [];
}

export const adminGetOffers = () => fetchAll("offers");
export const adminGetServices = () => fetchAll("services", "sort_order");
export const adminGetDoctors = () => fetchAll("doctors", "sort_order");
export const adminGetTestimonials = () => fetchAll("testimonials");
export const adminGetServiceCategories = () => fetchAll("service_categories", "sort_order");
export const adminGetBeforeAfterCases = () => fetchAll("before_after_cases", "sort_order");

export async function adminGetById(table, id) {
  const supabase = await createClient();
  const { data } = await supabase.from(table).select("*").eq("id", id).maybeSingle();
  return data;
}

export async function adminGetSettings() {
  const supabase = await createClient();
  const { data } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
  return data;
}
