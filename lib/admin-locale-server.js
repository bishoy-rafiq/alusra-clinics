import { cookies } from "next/headers";
import { ADMIN_LOCALE_COOKIE, normalizeAdminLocale } from "./admin-locale";

export async function getAdminLocale() {
  const store = await cookies();
  return normalizeAdminLocale(store.get(ADMIN_LOCALE_COOKIE)?.value);
}
