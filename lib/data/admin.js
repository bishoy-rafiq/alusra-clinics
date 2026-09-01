import { createClient } from "@/lib/supabase/server";
import { fallbackSettings } from "./fallback";

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
export const adminGetFaqs = () => fetchAll("faqs", "sort_order");
export const adminGetSubscribers = () => fetchAll("offer_subscribers");

export async function adminGetServiceSubTypes(serviceId) {
  if (!serviceId) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("parent_service_id", serviceId)
    .order("sort_order", { ascending: true });
  if (error) return [];
  return data || [];
}

export async function adminGetById(table, id) {
  const supabase = await createClient();
  const { data } = await supabase.from(table).select("*").eq("id", id).maybeSingle();
  return data;
}

export async function adminGetSettings() {
  const supabase = await createClient();
  const { data } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
  if (!data) return fallbackSettings;
  return { ...fallbackSettings, ...data };
}
