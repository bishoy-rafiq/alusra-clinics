// Falls back to the clinic's current WhatsApp Business number so booking
// links work out of the box; override with NEXT_PUBLIC_WHATSAPP_NUMBER.
const DEFAULT_WHATSAPP_NUMBER = "966137233900";

export function getWhatsAppNumber() {
  const raw = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || DEFAULT_WHATSAPP_NUMBER;
  return raw.replace(/[^\d]/g, "");
}

const templates = {
  ar: {
    service: (name) => `مرحباً 👋، أرغب في حجز موعد لخدمة: ${name}`,
    offer: (name) => `مرحباً 👋، أرغب في الاستفسار والحجز للعرض: ${name}`,
    doctor: (name) => `مرحباً 👋، أرغب في حجز موعد مع: ${name}`,
    general: () => `مرحباً 👋، أرغب في التواصل مع عيادات الأسرة`,
  },
  en: {
    service: (name) => `Hello 👋, I'd like to book an appointment for: ${name}`,
    offer: (name) => `Hello 👋, I'd like to ask about and book the offer: ${name}`,
    doctor: (name) => `Hello 👋, I'd like to book an appointment with: ${name}`,
    general: () => `Hello 👋, I'd like to get in touch with Alusra Clinics`,
  },
};

/**
 * Builds a wa.me deep link that opens WhatsApp with a pre-filled message,
 * in the visitor's current language, naming the service/offer/doctor.
 */
export function buildWhatsAppLink({ locale = "ar", name, kind = "general" } = {}) {
  const number = getWhatsAppNumber();
  const dict = templates[locale] || templates.ar;
  const builder = dict[kind] || dict.general;
  const message = name ? builder(name) : dict.general();
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
