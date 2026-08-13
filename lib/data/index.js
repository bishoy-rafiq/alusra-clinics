import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import {
  fallbackServices,
  fallbackServiceCategories,
  fallbackOffers,
  fallbackDoctors,
  fallbackTestimonials,
  fallbackSettings,
  fallbackBeforeAfter,
  fallbackFaqs,
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

/* --------------------------------------------------------------------------
   Data cache
   - React's cache() dedupes calls within the same render (the home page asks
     for settings/services/etc. several times — that used to be one Supabase
     round-trip per call).
   - A tiny in-process TTL store avoids repeating queries on every request.
   - Admin save actions call invalidateDataCache() so edits show immediately.
   -------------------------------------------------------------------------- */
const TTL_MS = 30_000;
const store = new Map();

export function invalidateDataCache() {
  store.clear();
}

function ttlCached(key, loader) {
  const run = cache(async (argsKey) => {
    const storeKey = `${key}:${argsKey}`;
    const hit = store.get(storeKey);
    if (hit && Date.now() - hit.at < TTL_MS) return hit.value;

    const promise = Promise.resolve(loader(argsKey ? JSON.parse(argsKey) : undefined)).catch(
      (err) => {
        store.delete(storeKey);
        throw err;
      }
    );
    store.set(storeKey, { at: Date.now(), value: promise });
    return promise;
  });
  return (args) => run(JSON.stringify(args ?? null));
}

/* --------------------------------------------------------------------------
   Public getters
   -------------------------------------------------------------------------- */
export const getServiceCategories = ttlCached("serviceCategories", () =>
  safeQuery(
    (supabase) => supabase.from("service_categories").select("*").order("sort_order"),
    fallbackServiceCategories
  )
);

export const getServices = ttlCached("services", (args) => {
  const { category } = args || {};
  return safeQuery((supabase) => {
    let query = supabase.from("services").select("*").eq("active", true).order("sort_order");
    if (category) query = query.eq("category", category);
    return query;
  }, category ? fallbackServices.filter((s) => s.category === category) : fallbackServices);
});

export const getServiceBySlug = ttlCached("serviceBySlug", async (slug) => {
  const data = await safeQuery(
    (supabase) =>
      supabase.from("services").select("*").eq("slug", slug).eq("active", true).maybeSingle(),
    fallbackServices.find((s) => s.slug === slug) || null
  );
  return Array.isArray(data) ? data[0] || null : data;
});

export const getOffers = ttlCached("offers", (args) => {
  const { activeOnly = true } = args || {};
  return safeQuery((supabase) => {
    let query = supabase.from("offers").select("*").order("created_at", { ascending: false });
    if (activeOnly) query = query.eq("active", true);
    return query;
  }, activeOnly ? fallbackOffers.filter((o) => o.active) : fallbackOffers);
});

export const getOfferBySlug = ttlCached("offerBySlug", async (slug) => {
  const data = await safeQuery(
    (supabase) => supabase.from("offers").select("*").eq("slug", slug).maybeSingle(),
    fallbackOffers.find((o) => o.slug === slug) || null
  );
  return Array.isArray(data) ? data[0] || null : data;
});

export const getDoctors = ttlCached("doctors", (args) => {
  const { activeOnly = true } = args || {};
  return safeQuery((supabase) => {
    let query = supabase.from("doctors").select("*").order("sort_order");
    if (activeOnly) query = query.eq("active", true);
    return query;
  }, activeOnly ? fallbackDoctors.filter((d) => d.active) : fallbackDoctors);
});

export const getDoctorBySlug = ttlCached("doctorBySlug", async (slug) => {
  const data = await safeQuery(
    (supabase) => supabase.from("doctors").select("*").eq("slug", slug).maybeSingle(),
    fallbackDoctors.find((d) => d.slug === slug) || null
  );
  return Array.isArray(data) ? data[0] || null : data;
});

export const getTestimonials = ttlCached("testimonials", () =>
  safeQuery(
    (supabase) =>
      supabase
        .from("testimonials")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false }),
    fallbackTestimonials
  )
);

export const getFaqs = ttlCached("faqs", (args) => {
  const { activeOnly = true } = args || {};
  return safeQuery((supabase) => {
    let query = supabase.from("faqs").select("*").order("sort_order");
    if (activeOnly) query = query.eq("active", true);
    return query;
  }, activeOnly ? fallbackFaqs.filter((f) => f.active) : fallbackFaqs);
});

export const getBeforeAfterCases = ttlCached("beforeAfterCases", (args) => {
  const { activeOnly = true } = args || {};
  return safeQuery((supabase) => {
    let query = supabase.from("before_after_cases").select("*").order("sort_order");
    if (activeOnly) query = query.eq("active", true);
    return query;
  }, activeOnly ? fallbackBeforeAfter.filter((c) => c.active) : fallbackBeforeAfter);
});

export const getBeforeAfterCasesByService = ttlCached("beforeAfterByService", async (args) => {
  const { service, activeOnly = true } = args || {};
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
});

export const getSettings = ttlCached("settings", async () => {
  const data = await safeQuery(
    (supabase) => supabase.from("site_settings").select("*").eq("id", 1).maybeSingle(),
    fallbackSettings
  );
  return { ...fallbackSettings, ...(Array.isArray(data) ? data[0] : data) };
});
