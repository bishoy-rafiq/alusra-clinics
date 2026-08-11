const SERVICE_IMAGES = {
  "orthodontics": "/images/svc-braces.jpg",
  "gum-treatment": "/images/clinic-interior.jpg",
  "cosmetic-dentistry": "/images/svc-smile.jpg",
  "pediatric-dentistry": "/images/svc-pediatric.jpg",
  "root-canal": "/images/hero-dentist.jpg",
  "dental-implants": "/images/team-dentists.jpg",
  "skin-care": "/images/svc-facial.jpg",
  "acne-treatment": "/images/derma-skin.jpg",
  "skin-rejuvenation": "/images/svc-spa.jpg",
  "other-skin-conditions": "/images/svc-derm-exam.jpg",
};

const CATEGORY_IMAGES = {
  dentistry: "/images/hero-dentist.jpg",
  dermatology: "/images/derma-skin.jpg",
};

export function getServiceImage(service) {
  if (service?.image_url) return service.image_url;
  return (
    SERVICE_IMAGES[service.slug] ||
    CATEGORY_IMAGES[service.category] ||
    CATEGORY_IMAGES.dentistry
  );
}
