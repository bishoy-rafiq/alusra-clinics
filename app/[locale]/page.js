import { getTranslations } from "next-intl/server";
import { getSettings } from "@/lib/data";
import Hero from "@/components/home/Hero";
import TrustStrip from "@/components/home/TrustStrip";
import OffersSection from "@/components/home/OffersSection";
import ServicesSection from "@/components/home/ServicesSection";
import BeforeAfterSection from "@/components/home/BeforeAfterSection";
import AboutSection from "@/components/home/AboutSection";
import HowItWorks from "@/components/home/HowItWorks";
import DoctorsSection from "@/components/home/DoctorsSection";
import ReviewsSection from "@/components/home/ReviewsSection";
import ContactSection from "@/components/home/ContactSection";
import FaqSection, { getFaqItems } from "@/components/home/FaqSection";
import { localizedAlternates, faqSchema, webPageSchema, pageOpenGraph, SITE_URL, CLINIC_NAME, CLINIC_ABOUT } from "@/lib/seo";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const description = t("description");
  return {
    title: t("title"),
    description,
    alternates: localizedAlternates("/", locale),
    ...pageOpenGraph({ locale, title: t("title"), description, path: "/" }),
  };
}

export default async function HomePage({ params }) {
  const { locale } = await params;
  const settings = await getSettings();
  const faqItems = await getFaqItems();
  const homeSchema = webPageSchema({
    locale,
    name: CLINIC_NAME[locale] || CLINIC_NAME.en,
    description: CLINIC_ABOUT[locale] || CLINIC_ABOUT.en,
    url: `/${locale}`,
    mainEntityId: `${SITE_URL}/#organization`,
    speakable: true,
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(faqItems)) }} />
      <Hero settings={settings} />
      <TrustStrip />
      <OffersSection />
      <ServicesSection />
      <BeforeAfterSection />
      <AboutSection />
      <HowItWorks />
      <DoctorsSection />
      <ReviewsSection />
      <FaqSection />
      <ContactSection />
    </>
  );
}
