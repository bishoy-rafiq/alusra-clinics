export const ADMIN_LOCALE_COOKIE = "admin-locale";
export const ADMIN_LOCALES = ["ar", "en"];
export const ADMIN_DEFAULT_LOCALE = "ar";

export function isAdminLocale(value) {
  return ADMIN_LOCALES.includes(value);
}

export function normalizeAdminLocale(value) {
  return isAdminLocale(value) ? value : ADMIN_DEFAULT_LOCALE;
}
