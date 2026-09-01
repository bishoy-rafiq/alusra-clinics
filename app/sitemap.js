import { getServices, getServiceSubTypes } from "@/lib/data";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/seo";
import { getServiceImage } from "@/lib/service-image-map";

export default async function sitemap() {
  const services = await getServices();

  const staticPaths = ["", "/about", "/contact", "/services", "/doctors", "/offers"];
  const servicePaths = [];
  for (const s of services) {
    servicePaths.push({
      path: `/services/${s.slug}`,
      images: [{ loc: `${SITE_URL}${getServiceImage(s)}` }],
    });
    const subTypes = await getServiceSubTypes({ serviceId: s.id, serviceSlug: s.slug });
    for (const st of subTypes) {
      servicePaths.push({
        path: `/services/${s.slug}/${st.slug}`,
        images: [{ loc: `${SITE_URL}${getServiceImage(st)}` }],
      });
    }
  }

  const allPaths = [...staticPaths.map((path) => ({ path })), ...servicePaths];

  return allPaths.flatMap(({ path, images }) =>
    routing.locales.map((locale) => ({
      url: `${SITE_URL}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency: path === "" ? "weekly" : "monthly",
      priority: path === "" ? 1 : path === "/services" ? 0.9 : 0.8,
      alternates: {
        languages: {
          ...Object.fromEntries(routing.locales.map((l) => [l, `${SITE_URL}/${l}${path}`])),
          "x-default": `${SITE_URL}/ar${path}`,
        },
      },
      ...(images ? { images } : {}),
    }))
  );
}
