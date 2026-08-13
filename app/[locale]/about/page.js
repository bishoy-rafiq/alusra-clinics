import AboutSection from "@/components/home/AboutSection";
import DoctorsSection from "@/components/home/DoctorsSection";
import { getTranslations } from "next-intl/server";
import { aboutPageSchema, localizedAlternates, pageOpenGraph } from "@/lib/seo";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  const title = t("eyebrow");
  const description = t("description");
  return {
    title,
    description,
    alternates: localizedAlternates("/about", locale),
    ...pageOpenGraph({ locale, title, description, path: "/about" }),
  };
}

export default async function AboutPage({ params }) {
  const { locale } = await params;
  const schema = aboutPageSchema({ locale, url: `/${locale}/about` });
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <AboutSection />
      <DoctorsSection />
    </>
  );
}
