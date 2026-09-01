export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://alusraclinics.com";
export const CLINIC_PHONE = "+966137233900";
export const CLINIC_EMAIL = "info@alusraclinics.com";

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

/** Opening-hours spec matching the clinic's published hours (daily 9 AM – 12 AM). */
export function clinicOpeningHours(settings = {}) {
  const custom = settings?.opening_hours;
  if (Array.isArray(custom) && custom.length) return custom;
  return DAYS_OF_WEEK.map((day) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: day,
    opens: "09:00",
    closes: "24:00",
  }));
}

export const CLINIC_NAME = {
  ar: "عيادات الأسرة",
  en: "Alusra Clinics",
};

export const CLINIC_ABOUT = {
  ar: "عيادات أسنان وجلدية في حفر الباطن، المملكة العربية السعودية، تقدم رعاية متخصصة في طب الأسنان والجلدية منذ أكثر من عشرين عاماً. الحجز عبر واتساب.",
  en: "Dental and dermatology clinics in Hafr Al-Batin, Saudi Arabia, providing specialized dentistry and dermatology care for over twenty years. Booking is available via WhatsApp.",
};

/**
 * Build the canonical + hreflang alternates object used by every page's
 * generateMetadata, so each /ar page links to its /en twin (and vice versa).
 * `path` is the locale-less route, e.g. "/services/orthodontics".
 */
export function localizedAlternates(path, locale) {
  const withSlash = path.startsWith("/") ? path : `/${path}`;
  const base = path === "/" || withSlash === "/" ? "" : withSlash;
  return {
    canonical: `/${locale}${base}`,
    languages: {
      ar: `/ar${base}`,
      en: `/en${base}`,
      "x-default": `/ar${base}`,
    },
  };
}

export function localize(locale, value) {
  return typeof value === "object" && value !== null && value[locale] ? value[locale] : value;
}

/**
 * Core MedicalClinic / Dentist structured data, reused on every page via
 * the root layout so search engines and AI answer engines (ChatGPT,
 * Perplexity, Google AI Overviews, etc.) can reliably identify who the
 * business is, what it offers, and how to book — this is the foundation
 * of both classic SEO and modern "AEO" (answer engine optimization).
 */
export function organizationSchema(locale, settings = {}, opts = {}) {
  const name = CLINIC_NAME[locale] || CLINIC_NAME.en;
  const description = CLINIC_ABOUT[locale] || CLINIC_ABOUT.en;
  const services = Array.isArray(opts.services) ? opts.services : [];

  const schema = {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    "@id": `${SITE_URL}/#organization`,
    name,
    alternateName: "Alusra Clinics / عيادات الأسرة",
    description,
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.png`,
    image: [`${SITE_URL}/images/logo.png`, `${SITE_URL}/images/hero.jpeg`],
    telephone: CLINIC_PHONE,
    email: CLINIC_EMAIL,
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address_street || undefined,
      addressLocality: "Hafr Al-Batin",
      addressRegion: "Eastern Province",
      addressCountry: "SA",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: settings.latitude || undefined,
      longitude: settings.longitude || undefined,
    },
    hasMap: settings.maps_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Alusra Clinics Hafr Al-Batin")}`,
    medicalSpecialty: ["Dentistry", "Dermatology"],
    openingHoursSpecification: clinicOpeningHours(settings),
    priceRange: "SAR",
    currenciesAccepted: "SAR",
    paymentAccepted: "Cash, Credit Card, Mada, Insurance",
    areaServed: {
      "@type": "City",
      name: "Hafr Al-Batin",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: CLINIC_PHONE,
        contactType: "appointments",
        availableLanguage: ["ar", "en"],
        areaServed: "SA",
      },
      ...(settings?.whatsapp_number
        ? [
            {
              "@type": "ContactPoint",
              telephone: settings.whatsapp_number,
              contactType: "customer support",
              availableLanguage: ["ar", "en"],
              areaServed: "SA",
              url: `https://wa.me/${settings.whatsapp_number.replace(/\D/g, "")}`,
            },
          ]
        : []),
    ],
    sameAs: [
      settings.instagram_url,
      settings.snapchat_url,
      settings.facebook_url,
      settings.tiktok_url,
      settings.youtube_url,
      settings.telegram_url,
      settings.linkedin_url,
      settings.threads_url,
      settings.x_url,
    ].filter(Boolean),
  };

  if (settings?.google_place_id) {
    schema.googlePlaceId = settings.google_place_id;
    schema.hasMap =
      settings.maps_url ||
      `https://www.google.com/maps/place/?q=place_id:${settings.google_place_id}`;
  }

  const ratingValue = settings?.aggregateRating?.ratingValue;
  const reviewCount = settings?.aggregateRating?.reviewCount;
  if (ratingValue && Number(reviewCount) > 0) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: Number(ratingValue),
      reviewCount: Number(reviewCount),
      bestRating: 5,
      worstRating: 1,
    };
  }

  if (settings?.reviews?.length) {
    schema.review = settings.reviews
      .filter((r) => r.author)
      .slice(0, 5)
      .map((r) => ({
        "@type": "Review",
        author: { "@type": "Person", name: r.author },
        ...(r.rating ? { reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5 } } : {}),
        ...(r.text ? { reviewBody: r.text } : {}),
      }));
  }

  const aeoOffer = (s) => ({
    "@type": "Offer",
    itemOffered: {
      "@type": "Service",
      name: localize(locale, { ar: s.name_ar, en: s.name_en }),
      ...(s.description
        ? { description: localize(locale, { ar: s.description_ar, en: s.description_en }) }
        : {}),
      url: `${SITE_URL}/${locale}/services/${s.slug}`,
    },
  });

  schema.hasOfferCatalog = {
    "@type": "OfferCatalog",
    name: locale === "ar" ? "خدمات العيادة" : "Clinic services",
    itemListElement: services.length
      ? services.map(aeoOffer)
      : [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: locale === "ar" ? "طب الأسنان" : "Dentistry",
              url: `${SITE_URL}/${locale}/services`,
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: locale === "ar" ? "الأمراض الجلدية" : "Dermatology",
              url: `${SITE_URL}/${locale}/services`,
            },
          },
        ],
  };

  return schema;
}

/** WebSite schema so engines also index the site as a whole, per language. */
export function websiteSchema(locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/${locale}/#website`,
    url: `${SITE_URL}/${locale}`,
    name: CLINIC_NAME[locale] || CLINIC_NAME.en,
    description: CLINIC_ABOUT[locale] || CLINIC_ABOUT.en,
    inLanguage: locale,
    publisher: { "@id": `${SITE_URL}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: `https://www.google.com/search?q={search_term_string}+site:${SITE_URL}`,
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * WebPage structured data that marks each page's main entity and exposes a
 * "speakable" section for voice assistants / answer engines (AEO). Every
 * detail page injects this alongside its MedicalProcedure / Physician /
 * SpecialAnnouncement entity so engines connect the page and the entity.
 */
export function webPageSchema({ locale, name, description, url, mainEntityId, speakable = false }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE_URL}${url}#webpage`,
    url: `${SITE_URL}${url}`,
    name,
    ...(description ? { description } : {}),
    inLanguage: locale,
    isPartOf: {
      "@id": `${SITE_URL}/${locale}/#website`,
    },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: `${SITE_URL}/images/logo.png`,
    },
    ...(mainEntityId ? { mainEntity: { "@id": mainEntityId } } : {}),
  };
  if (speakable) {
    schema.speakable = {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".speakable"],
    };
  }
  return schema;
}

export function breadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function serviceSchema({ locale, name, description, url, category, image }) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    "@id": `${SITE_URL}${url}#service`,
    name,
    description,
    url,
    ...(category ? { procedureType: category } : {}),
    ...(image ? { image: image } : {}),
    provider: { "@id": `${SITE_URL}/#organization` },
    inLanguage: locale,
  };
}

/** Physician schema for the medical team — currently missing, README promised it. */
export function physicianSchema({ locale, doctor, url }) {
  const name = localize(locale, { ar: doctor.name_ar, en: doctor.name_en });
  const specialty = localize(locale, { ar: doctor.specialty_ar, en: doctor.specialty_en });
  const bio = localize(locale, { ar: doctor.bio_ar, en: doctor.bio_en });

  return {
    "@context": "https://schema.org",
    "@type": "Physician",
    "@id": `${SITE_URL}${url}#physician`,
    name,
    ...(bio ? { description: bio } : {}),
    ...(doctor.photo_url ? { image: doctor.photo_url } : {}),
    ...(specialty ? { medicalSpecialty: specialty } : {}),
    url: `${SITE_URL}${url}`,
    worksFor: { "@id": `${SITE_URL}/#organization` },
    inLanguage: locale,
  };
}

/** Offer / SpecialAnnouncement structured data for the promotions page. */
export function offerSchema({ locale, offer, url }) {
  const name = localize(locale, { ar: offer.title_ar, en: offer.title_en });
  const description = localize(locale, { ar: offer.description_ar, en: offer.description_en });

  return {
    "@context": "https://schema.org",
    "@type": "SpecialAnnouncement",
    "@id": `${SITE_URL}${url}#offer`,
    name,
    description,
    url: `${SITE_URL}${url}`,
    ...(offer.image_url ? { image: offer.image_url } : {}),
    announcementLocation: { "@id": `${SITE_URL}/#organization` },
    provider: { "@id": `${SITE_URL}/#organization` },
    category: "https://www.w3.org/ns/activitystreams#Offer",
    ...(offer.valid_until ? { expirationDate: offer.valid_until } : {}),
  };
}

export function faqSchema(items, speakable = true) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE_URL}/#faq`,
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
  if (speakable && items.length) {
    schema.speakable = {
      "@type": "SpeakableSpecification",
      cssSelector: ["#faq"],
    };
  }
  return schema;
}

/** ItemList schema for list pages (services, etc.). */
export function itemListSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: item.url,
    })),
  };
}

/** AboutPage schema so answer engines understand the about page's purpose. */
export function aboutPageSchema({ locale, url }) {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    url: `${SITE_URL}${url}`,
    name: CLINIC_NAME[locale] || CLINIC_NAME.en,
    description: CLINIC_ABOUT[locale] || CLINIC_ABOUT.en,
    inLanguage: locale,
    mainEntity: { "@id": `${SITE_URL}/#organization` },
  };
}

/** ContactPage schema for the contact page. */
export function contactPageSchema({ locale, url }) {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    url: `${SITE_URL}${url}`,
    name: locale === "ar" ? "تواصل معنا" : "Contact us",
    inLanguage: locale,
    mainEntity: { "@id": `${SITE_URL}/#organization` },
  };
}

/**
 * OpenGraph + Twitter metadata for subpages so shared links render rich
 * cards with the page's own title/description instead of the site default.
 */
export function pageOpenGraph({ locale, title, description, path, image = "/images/logo.png" }) {
  const base = path === "/" || path === "" ? "" : path.startsWith("/") ? path : `/${path}`;
  return {
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${locale}${base}`,
      siteName: CLINIC_NAME[locale] || CLINIC_NAME.en,
      locale: locale === "ar" ? "ar_SA" : "en_US",
      type: "website",
      images: [{ url: `${SITE_URL}${image}` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE_URL}${image}`],
    },
  };
}
