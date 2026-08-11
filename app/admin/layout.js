import { Cairo } from "next/font/google";
import "../globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata = {
  title: "لوحة تحكم عيادات الأسرة",
  icons: {
    icon: "/favicon.svg",
  },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body className="bg-brand-mist antialiased" style={{ fontFamily: "var(--font-cairo)" }}>
        {children}
      </body>
    </html>
  );
}
