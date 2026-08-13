import { getTranslations } from "next-intl/server";
import ContactSection from "@/components/home/ContactSection";
import ReviewsSection from "@/components/home/ReviewsSection";
import { contactPageSchema, localizedAlternates, pageOpenGraph } from "@/lib/seo";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  const title = t("title");
  const description = t("description");
  return {
    title,
    description,
    alternates: localizedAlternates("/contact", locale),
    ...pageOpenGraph({ locale, title, description, path: "/contact" }),
  };
}

export default async function ContactPage({ params }) {
  const { locale } = await params;
  const schema = contactPageSchema({ locale, url: `/${locale}/contact` });
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <ContactSection />
      <ReviewsSection />
    </>
  );
}
