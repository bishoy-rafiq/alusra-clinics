"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Menu, X, ChevronDown, Phone, Clock3, ShieldCheck } from "lucide-react";
import { FaInstagram, FaWhatsapp } from "react-icons/fa6";
import LanguageSwitch from "./LanguageSwitch";
import { buildWhatsAppLink } from "@/lib/whatsapp";

function NavDropdown({ label, items, hrefBase, pathname }) {
  const [open, setOpen] = useState(false);
  const active = (items || []).some((i) => pathname === `${hrefBase}/${i.slug}`);

  if (!items?.length) return null;

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-bold transition ${
          active ? "bg-brand-mist text-brand-teal" : "text-brand-ink/75 hover:text-brand-teal"
        }`}
        aria-expanded={open}
      >
        {label}
        <ChevronDown size={15} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute start-0 top-full z-40 mt-2 min-w-[250px] overflow-hidden rounded-2xl border border-brand-line bg-white p-2 shadow-[var(--shadow-lifted)]">
          <div className="rounded-xl bg-brand-mist/70 px-3.5 py-2 text-xs font-bold uppercase tracking-wide text-brand-slate">
            {label}
          </div>
          {items.map((item) => (
            <Link
              key={item.slug}
              href={`${hrefBase}/${item.slug}`}
              className={`mt-1 flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition hover:bg-brand-mist hover:text-brand-teal ${
                pathname === `${hrefBase}/${item.slug}` ? "text-brand-teal" : "text-brand-ink"
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" />
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function NavLink({ href, children, pathname, exact = false }) {
  const active = exact ? pathname === href : pathname.startsWith(href);
  return (
    <Link
      href={href}
      className={`rounded-full px-3.5 py-2 text-sm font-bold transition ${
        active ? "bg-brand-mist text-brand-teal" : "text-brand-ink/75 hover:text-brand-teal"
      }`}
    >
      {children}
    </Link>
  );
}

export default function Header({ settings, services }) {
  const t = useTranslations("nav");
  const common = useTranslations("common");
  const locale = useLocale();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setMobileOpen(false);
  }

  const dentistryItems = (services || [])
    .filter((s) => s.category === "dentistry")
    .map((s) => ({ slug: s.slug, name: locale === "ar" ? s.name_ar : s.name_en }));
  const dermatologyItems = (services || [])
    .filter((s) => s.category === "dermatology")
    .map((s) => ({ slug: s.slug, name: locale === "ar" ? s.name_ar : s.name_en }));

  const clinicName = locale === "ar" ? settings?.clinic_name_ar : settings?.clinic_name_en;
  const waLink = buildWhatsAppLink({ locale, kind: "general" });

  return (
    <>
      {/* Utility top bar */}
      <div
        className={`hidden bg-brand-teal text-white transition-all duration-300 lg:block ${
          scrolled ? "h-0 overflow-hidden opacity-0" : "opacity-100"
        }`}
      >
        <div className="container-brand flex h-10 items-center justify-between text-xs">
          <div className="flex items-center gap-6">
            <a href={`tel:${settings?.phone}`} className="flex items-center gap-1.5 font-semibold text-white/85 hover:text-brand-gold">
              <Phone size={13} /> {settings?.phone}
            </a>
            <span className="flex items-center gap-1.5 text-white/60">
              <ShieldCheck size={13} className="text-brand-gold" />
              {common("insuranceAccepted")}
            </span>
          </div>
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5 text-white/60">
              <Clock3 size={13} className="text-brand-gold" />
              {common("openDaily")}
            </span>

          </div>
        </div>
      </div>

      <header
        className={`sticky top-0 z-50 border-b transition-all duration-300 ${
          scrolled
            ? "glass border-brand-line shadow-soft"
            : "border-brand-line/70 bg-white/90 backdrop-blur-md"
        }`}
      >
        <div className="container-brand flex h-[4.5rem] items-center justify-between gap-4">
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <Image
              src="/images/logo.png"
              alt={clinicName || "Alusra Clinics"}
              width={300}
              height={200}
              priority
              className="h-10 w-auto"
            />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            <NavLink href="/" exact pathname={pathname}>
              {t("home")}
            </NavLink>
            <NavDropdown label={t("dentistry")} items={dentistryItems} hrefBase="/services" pathname={pathname} />
            <NavDropdown label={t("dermatology")} items={dermatologyItems} hrefBase="/services" pathname={pathname} />
            <NavLink href="/doctors" pathname={pathname}>{t("doctors")}</NavLink>
            <NavLink href="/offers" pathname={pathname}>{t("offers")}</NavLink>
            <NavLink href="/about" pathname={pathname}>{t("about")}</NavLink>
            <NavLink href="/contact" pathname={pathname}>{t("contact")}</NavLink>
          </nav>

          <div className="flex items-center gap-3">
            <LanguageSwitch />
       
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-line text-brand-ink transition hover:border-brand-aqua hover:text-brand-aqua lg:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? common("closeMenu") : common("openMenu")}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile slide-in menu */}
        <div
          className={`fixed inset-0 top-[4.5rem] z-40 transition lg:hidden ${
            mobileOpen ? "pointer-events-auto" : "pointer-events-none"
          }`}
        >
          <div
            className={`absolute inset-0 bg-brand-ink/30 backdrop-blur-sm transition-opacity duration-300 ${
              mobileOpen ? "opacity-100" : "opacity-0"
            }`}
            onClick={() => setMobileOpen(false)}
          />
          <div
            className={`absolute start-0 top-0 flex h-[calc(100dvh-4.5rem)] w-[88%] max-w-sm flex-col overflow-y-auto border-e border-brand-line bg-white shadow-[var(--shadow-lifted)] transition-transform duration-300`}
            style={{
              transform: mobileOpen
                ? "translateX(0)"
                : locale === "ar"
                  ? "translateX(100%)"
                  : "translateX(-100%)",
            }}
          >
            <div className="flex flex-col gap-1 p-4">
              <Link href="/" className="rounded-xl px-3 py-3 text-sm font-bold text-brand-ink hover:bg-brand-mist">
                {t("home")}
              </Link>

              {[["dentistry", dentistryItems], ["dermatology", dermatologyItems]].map(([cat, items]) => (
                <div key={cat} className="mt-2">
                  <p className="flex items-center gap-1.5 px-3 text-xs font-bold uppercase tracking-wide text-brand-teal">
                    {t(cat)}
                  </p>
                  <div className="mt-1 border-s-2 border-brand-mist ps-2">
                    {items.map((item) => (
                      <Link key={item.slug} href={`/services/${item.slug}`} className="block rounded-xl px-3 py-2 text-sm text-brand-slate hover:bg-brand-mist hover:text-brand-teal">
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}

              <div className="mt-3 grid grid-cols-2 gap-1 border-t border-brand-line pt-3">
                <Link href="/doctors" className="rounded-xl px-3 py-3 text-sm font-bold text-brand-ink hover:bg-brand-mist">{t("doctors")}</Link>
                <Link href="/offers" className="rounded-xl px-3 py-3 text-sm font-bold text-brand-ink hover:bg-brand-mist">{t("offers")}</Link>
                <Link href="/about" className="rounded-xl px-3 py-3 text-sm font-bold text-brand-ink hover:bg-brand-mist">{t("about")}</Link>
                <Link href="/contact" className="rounded-xl px-3 py-3 text-sm font-bold text-brand-ink hover:bg-brand-mist">{t("contact")}</Link>
              </div>

              <a
                href={`tel:${settings?.phone}`}
                className="mt-3 flex items-center justify-center gap-2 rounded-full border border-brand-line px-4 py-3 text-sm font-bold text-brand-teal"
              >
                <Phone size={16} /> {settings?.phone}
              </a>
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn btn-gold mt-3 justify-center">
                <FaWhatsapp size={18} />
                {t("bookNow")}
              </a>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
