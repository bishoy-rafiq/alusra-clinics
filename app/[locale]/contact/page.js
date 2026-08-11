import { getTranslations } from "next-intl/server";
import ContactSection from "@/components/home/ContactSection";
import ReviewsSection from "@/components/home/ReviewsSection";
import { localizedAlternates } from "@/lib/seo";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: localizedAlternates("/contact", locale),
  };
}

export default function ContactPage() {
  return (
    <>
      <ContactSection />
      <ReviewsSection />
    </>
  );
}
