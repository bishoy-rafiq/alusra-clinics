"use server";

import { revalidatePath } from "next/cache";
import { invalidateDataCache } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";

export async function deleteSubscriber(formData) {
  const id = formData.get("id");
  const supabase = await createClient();
  await supabase.from("offer_subscribers").delete().eq("id", id);

  revalidatePath("/admin/subscribers");
  invalidateDataCache();
}
