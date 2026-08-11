import { Cairo, Fraunces } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppFloat from "@/components/layout/WhatsAppFloat";
import StickyBookBar from "@/components/layout/StickyBookBar";
import { organizationSchema, websiteSchema, SITE_URL } from "@/lib/seo";
import { getSettings, getServices } from "@/lib/data";
import "../globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-cairo",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: t("title"),
      template: `%s | ${locale === "ar" ? "عيادات الأسرة" : "Alusra Clinics"}`,
    },
    description: t("description"),
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
    },
    icons: {
      icon: "/favicon.svg",
      apple: "/favicon.svg",
    },
    alternates: {
      canonical: `/${locale}`,
      languages: {
        ar: "/ar",
        en: "/en",
        "x-default": "/ar",
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `${SITE_URL}/${locale}`,
      siteName: locale === "ar" ? "عيادات الأسرة" : "Alusra Clinics",
      locale: locale === "ar" ? "ar_SA" : "en_US",
      type: "website",
      images: [
        { url: "/images/hero.jpeg", width: 1200, height: 630, alt: locale === "ar" ? "عيادات الأسرة" : "Alusra Clinics" },
        { url: "/images/logo.png", width: 512, height: 512 },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: ["/images/hero.jpeg"],
    },
    keywords: ["Alusra Clinics", "عيادات الأسرة", "dentist Hafr Al-Batin", "طب أسنان حفر الباطن", "dermatologist Hafr Al-Batin", "عيادة جلدية حفر الباطن"],
  };
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();
  const [settings, services] = await Promise.all([getSettings(), getServices()]);
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir} className={`${cairo.variable} ${fraunces.variable}`}>
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema(locale, settings)) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema(locale)) }}
        />
        <NextIntlClientProvider messages={messages}>
          <Header settings={settings} services={services} />
          <main>{children}</main>
          <Footer settings={settings} services={services} />
          <WhatsAppFloat locale={locale} />
          <StickyBookBar settings={settings} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
