"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Tag,
  Stethoscope,
  Users,
  Settings,
  LogOut,
  ImageIcon,
  ShieldCheck,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const NAV = [
  { href: "/admin", label: "نظرة عامة", icon: LayoutDashboard, exact: true },
  { href: "/admin/offers", label: "العروض", icon: Tag },
  { href: "/admin/services", label: "الخدمات", icon: Stethoscope },
  { href: "/admin/doctors", label: "الأطباء", icon: Users },
  { href: "/admin/before-after", label: "قبل وبعد", icon: ImageIcon },
  { href: "/admin/settings", label: "الإعدادات", icon: Settings },
];

function useActive() {
  const pathname = usePathname();
  return (item) => (item.exact ? pathname === item.href : pathname.startsWith(item.href));
}

export function AdminSidebarNav() {
  const isActive = useActive();

  return (
    <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
      <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">القائمة الرئيسية</p>
      {NAV.map((item) => {
        const active = isActive(item);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`admin-sidebar-link ${active ? "is-active" : ""}`}
          >
            <span className="admin-sidebar-ic">
              <item.icon size={15} />
            </span>
            <span className="flex-1">{item.label}</span>
            {active && <span className="h-1.5 w-1.5 rounded-full bg-brand-aqua" />}
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminMobileNav() {
  const isActive = useActive();

  return (
    <nav className="flex gap-1.5 overflow-x-auto border-b border-brand-line bg-white px-3 py-2.5 md:hidden">
      {NAV.map((item) => {
        const active = isActive(item);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-2 text-xs font-bold transition-all ${
              active
                ? "bg-brand-teal text-white shadow-[0_6px_16px_-6px_rgba(12,74,71,0.55)]"
                : "bg-brand-mist text-brand-slate hover:bg-brand-line"
            }`}
          >
            <item.icon size={13} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminLogoutButton({ variant = "dark" }) {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className={
        variant === "light"
          ? "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-brand-slate transition-colors hover:bg-brand-mist hover:text-brand-ink"
          : "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-semibold text-white/55 transition-colors hover:bg-red-500/15 hover:text-red-300"
      }
    >
      <LogOut size={15} /> تسجيل الخروج
    </button>
  );
}



export function AdminUserChip({ email }) {
  const initial = email?.charAt(0)?.toUpperCase() || "أ";
  return (
    <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2.5 ring-1 ring-white/10">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-aqua to-brand-teal font-display text-sm font-bold text-white">
        {initial}
      </span>
      <div className="min-w-0">
        <p className="flex items-center gap-1 text-xs font-bold text-white/90">
          <ShieldCheck size={12} className="text-brand-aqua" /> المدير
        </p>
        <p className="truncate text-[11px] text-white/45">{email}</p>
      </div>
    </div>
  );
}
