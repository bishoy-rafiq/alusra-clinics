import AboutSection from "@/components/home/AboutSection";
import DoctorsSection from "@/components/home/DoctorsSection";
import { getTranslations } from "next-intl/server";
import { localizedAlternates } from "@/lib/seo";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return {
    title: t("eyebrow"),
    description: t("description"),
    alternates: localizedAlternates("/about", locale),
  };
}

export default function AboutPage() {
  return (
    <>
      <AboutSection />
      <DoctorsSection />
    </>
  );
}
