import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import {
  AdminSidebarNav,
  AdminMobileNav,
  AdminLogoutButton,
  AdminUserChip,
} from "@/components/admin/AdminNav";

export default async function DashboardLayout({ children }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-brand-mist">
      <aside className="fixed inset-y-0 right-0 z-40 hidden w-64 flex-col bg-gradient-to-b from-[#0a1f1d] via-brand-ink to-[#0a3a38] text-white shadow-2xl md:flex">
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
          <Image src="/images/logo-light.png" alt="Alusra Clinics" width={110} height={36} className="h-7 w-auto" />
        </div>
        <AdminSidebarNav />
        <div className="space-y-1.5 border-t border-white/10 p-3">
          <AdminUserChip email={user?.email} />
          <AdminLogoutButton />
        </div>
      </aside>

      <div className="flex min-h-screen flex-col md:ms-64">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-brand-line bg-white/85 px-4 py-3 backdrop-blur-md md:px-6">
          <div className="flex items-center gap-2 md:hidden">
            <Image src="/images/logo.png" alt="Alusra Clinics" width={100} height={34} className="h-7 w-auto" />
          </div>
          <div className="hidden items-center gap-2 md:flex">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            <span className="text-xs font-bold text-brand-slate">لوحة تحكم عيادات الأسرة</span>
          </div>

              <AdminLogoutButton variant="light" />
        </header>
        <AdminMobileNav />
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
        <footer className="px-4 py-4 text-center text-[11px] text-brand-slate/70 md:px-6">
          © {new Date().getFullYear()} عيادات الأسرة — لوحة التحكم
        </footer>
      </div>
    </div>
  );
}

function ExternalLinkIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  );
}
