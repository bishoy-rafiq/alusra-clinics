import { Cairo } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getAdminLocale } from "@/lib/admin-locale-server";
import "../globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-cairo",
  display: "swap",
});

export async function generateMetadata() {
  const locale = await getAdminLocale();
  return {
    title:
      locale === "ar" ? "لوحة تحكم عيادات الأسرة" : "Alusra Clinics Dashboard",
    icons: {
      icon: "/favicon.svg",
    },
    robots: { index: false, follow: false },
  };
}

export default async function AdminRootLayout({ children }) {
  const locale = await getAdminLocale();
  const messages = (await import(`@/messages/${locale}.json`)).default;

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} className={cairo.variable}>
      <body className="bg-brand-mist antialiased" style={{ fontFamily: "var(--font-cairo)" }}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
