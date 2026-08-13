const FALLBACK_SERVICE_IMAGE = "/images/hero.jpeg";

const SERVICE_IMAGES = {
  orthodontics: "/images/hero.jpeg",
  "gum-treatment": "/images/hero.jpeg",
  "cosmetic-dentistry": "/images/hero.jpeg",
  "pediatric-dentistry": "/images/hero.jpeg",
  "root-canal": "/images/hero.jpeg",
  "dental-implants": "/images/hero.jpeg",
  "skin-care": "/images/hero.jpeg",
  "acne-treatment": "/images/hero.jpeg",
  "skin-rejuvenation": "/images/hero.jpeg",
  "other-skin-conditions": "/images/hero.jpeg",
};

const CATEGORY_IMAGES = {
  dentistry: "/images/hero.jpeg",
  dermatology: "/images/hero.jpeg",
};

export function getServiceImage(service) {
  if (service?.image_url) return service.image_url;
  return (
    SERVICE_IMAGES[service.slug] ||
    CATEGORY_IMAGES[service.category] ||
    FALLBACK_SERVICE_IMAGE
  );
}
