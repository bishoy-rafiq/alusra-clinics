import { createClient } from "@/lib/supabase/server";
import {
  fallbackServices,
  fallbackServiceCategories,
  fallbackOffers,
  fallbackDoctors,
  fallbackTestimonials,
  fallbackSettings,
  fallbackBeforeAfter,
} from "./fallback";

export function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

async function safeQuery(run, fallbackValue) {
  if (!isSupabaseConfigured()) return fallbackValue;
  try {
    const supabase = await createClient();
    const { data, error } = await run(supabase);
    if (error || !data) return fallbackValue;
    return data;
  } catch {
    return fallbackValue;
  }
}

export async function getServiceCategories() {
  return safeQuery(
    (supabase) => supabase.from("service_categories").select("*").order("sort_order"),
    fallbackServiceCategories
  );
}

export async function getServices({ category } = {}) {
  const data = await safeQuery((supabase) => {
    let query = supabase.from("services").select("*").eq("active", true).order("sort_order");
    if (category) query = query.eq("category", category);
    return query;
  }, category ? fallbackServices.filter((s) => s.category === category) : fallbackServices);
  return data;
}

export async function getServiceBySlug(slug) {
  const data = await safeQuery(
    (supabase) => supabase.from("services").select("*").eq("slug", slug).eq("active", true).maybeSingle(),
    fallbackServices.find((s) => s.slug === slug) || null
  );
  return Array.isArray(data) ? data[0] || null : data;
}

export async function getOffers({ activeOnly = true } = {}) {
  return safeQuery((supabase) => {
    let query = supabase.from("offers").select("*").order("created_at", { ascending: false });
    if (activeOnly) query = query.eq("active", true);
    return query;
  }, activeOnly ? fallbackOffers.filter((o) => o.active) : fallbackOffers);
}

export async function getOfferBySlug(slug) {
  const data = await safeQuery(
    (supabase) => supabase.from("offers").select("*").eq("slug", slug).maybeSingle(),
    fallbackOffers.find((o) => o.slug === slug) || null
  );
  return Array.isArray(data) ? data[0] || null : data;
}

export async function getDoctors({ activeOnly = true } = {}) {
  return safeQuery((supabase) => {
    let query = supabase.from("doctors").select("*").order("sort_order");
    if (activeOnly) query = query.eq("active", true);
    return query;
  }, activeOnly ? fallbackDoctors.filter((d) => d.active) : fallbackDoctors);
}

export async function getDoctorBySlug(slug) {
  const data = await safeQuery(
    (supabase) => supabase.from("doctors").select("*").eq("slug", slug).maybeSingle(),
    fallbackDoctors.find((d) => d.slug === slug) || null
  );
  return Array.isArray(data) ? data[0] || null : data;
}

export async function getTestimonials() {
  return safeQuery(
    (supabase) => supabase.from("testimonials").select("*").eq("published", true).order("created_at", { ascending: false }),
    fallbackTestimonials
  );
}

export async function getBeforeAfterCases({ activeOnly = true } = {}) {
  return safeQuery((supabase) => {
    let query = supabase.from("before_after_cases").select("*").order("sort_order");
    if (activeOnly) query = query.eq("active", true);
    return query;
  }, activeOnly ? fallbackBeforeAfter.filter((c) => c.active) : fallbackBeforeAfter);
}

export async function getBeforeAfterCasesByService(service, { activeOnly = true } = {}) {
  if (!service?.id) return [];

  const fallbackMatches = fallbackBeforeAfter.filter(
    (c) => c.related_service_slug === service.slug && (!activeOnly || c.active)
  );

  return safeQuery((supabase) => {
    let query = supabase
      .from("before_after_cases")
      .select("*")
      .eq("related_service_id", service.id)
      .order("sort_order");
    if (activeOnly) query = query.eq("active", true);
    return query;
  }, fallbackMatches);
}

export async function getSettings() {
  const data = await safeQuery(
    (supabase) => supabase.from("site_settings").select("*").eq("id", 1).maybeSingle(),
    fallbackSettings
  );
  return { ...fallbackSettings, ...(Array.isArray(data) ? data[0] : data) };
}
