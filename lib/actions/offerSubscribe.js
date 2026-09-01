"use server";

import { createClient } from "@/lib/supabase/server";

const ALLOWED_INTERESTS = ["dentistry", "dermatology"];

function normalizePhone(value) {
  return value.replace(/[^\d+]/g, "");
}

function isTableNotFound(error) {
  return error?.code === "42P01" || /does not exist/i.test(error?.message || "");
}

/**
 * Check whether the offer_subscribers table actually exists. If Supabase is
 * configured but the schema hasn't been run yet, the lead should still be
 * accepted via the webhook instead of showing a hard error to the visitor.
 */
async function isOfferSubscribersReady(supabase) {
  const { error } = await supabase.from("offer_subscribers").select("id").limit(1);
  if (!error) return true;
  if (isTableNotFound(error)) return false;
  console.error("offer_subscribers check failed:", error.message);
  return false;
}

/**
 * Saves an offer subscription. The row is always sent to the Google Sheets
 * webhook (if configured) so the clinic keeps a spreadsheet of leads, and is
 * also stored in Supabase when configured so it appears in /admin/subscribers.
 */
export async function subscribeToOffers(formData) {
  try {
  const name = (formData.get("name") || "").toString().trim();
  const email = (formData.get("email") || "").toString().trim();
  const phone = normalizePhone((formData.get("phone") || "").toString());
  const consent = formData.get("consent") === "on";
  const interests = (formData.getAll("interests") || [])
    .map((value) => value.toString())
    .filter((value) => ALLOWED_INTERESTS.includes(value));

  if (!name || !phone) return { ok: false, error: "required" };
  if (!consent) return { ok: false, error: "consent" };
  if (interests.length < 1 || interests.length > 2) {
    return { ok: false, error: "interests" };
  }

  const row = {
    name,
    email,
    phone,
    interests,
    consent: true,
    created_at: new Date().toISOString(),
  };

  const webhook = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (webhook) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      const whRes = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(row),
        redirect: "manual",
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (whRes.status === 302 || whRes.status === 301) {
        console.warn("OFFER_WEBHOOK_REDIRECT:", whRes.status, whRes.headers.get("location"));
      } else if (!whRes.ok) {
        console.warn("OFFER_WEBHOOK_FAILED:", whRes.status, whRes.statusText, (await whRes.text()).slice(0, 300));
      }
    } catch (err) {
      console.error("OFFER_WEBHOOK_THREW:", err && err.stack);
    }
  }

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      const supabase = await createClient();
      if (await isOfferSubscribersReady(supabase)) {
        const { error } = await supabase
          .from("offer_subscribers")
          .insert({ name, email, phone, interests, consent });
        if (error) console.error("Supabase insert failed:", error.message);
      } else {
        console.warn("offer_subscribers table not found — lead kept only in the webhook log.");
      }
    } catch (err) {
      console.error("Supabase insert failed:", err);
    }
  }

  return { ok: true, error: null };
  } catch (err) {
    console.error("OFFER_SUBSCRIBE_ERROR:", err, err && err.stack);
    throw err;
  }
}
