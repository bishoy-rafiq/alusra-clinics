import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["ar", "en"],
  defaultLocale: "ar",
  localePrefix: "always",
  localeDetection: false,
  pathnames: {
    "/": "/",
    "/about": { ar: "/about", en: "/about" },
    "/contact": { ar: "/contact", en: "/contact" },
    "/services": { ar: "/services", en: "/services" },
    "/offers": { ar: "/offers", en: "/offers" },
    "/doctors": { ar: "/doctors", en: "/doctors" },
  },
});
