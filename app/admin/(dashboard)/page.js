import Link from "next/link";
import {
  Tag,
  Stethoscope,
  Users,
  Settings,
  Plus,
  ArrowUpRight,
  Globe,
  ImageIcon,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import {
  adminGetOffers,
  adminGetServices,
  adminGetDoctors,
  adminGetBeforeAfterCases,
} from "@/lib/data/admin";
import { isSupabaseConfigured } from "@/lib/data";

const statStyles = {
  rose: { chip: "bg-rose-50 text-rose-600", bar: "from-rose-400 to-pink-500" },
  teal: { chip: "bg-brand-mist text-brand-teal", bar: "from-teal-400 to-emerald-500" },
  violet: { chip: "bg-violet-50 text-violet-600", bar: "from-violet-400 to-purple-500" },
  amber: { chip: "bg-amber-50 text-amber-600", bar: "from-amber-400 to-orange-500" },
};

export default async function AdminDashboard() {
  const configured = isSupabaseConfigured();
  const [offers, services, doctors, beforeAfter] = configured
    ? await Promise.all([
        adminGetOffers(),
        adminGetServices(),
        adminGetDoctors(),
        adminGetBeforeAfterCases(),
      ])
    : [[], [], [], []];

  const stats = [
    {
      key: "offers",
      label: "العروض",
      active: offers.filter((o) => o.active).length,
      total: offers.length,
      icon: Tag,
      tone: statStyles.rose,
    },
    {
      key: "services",
      label: "الخدمات",
      active: services.filter((s) => s.active).length,
      total: services.length,
      icon: Stethoscope,
      tone: statStyles.teal,
    },
    {
      key: "doctors",
      label: "الأطباء",
      active: doctors.filter((d) => d.active).length,
      total: doctors.length,
      icon: Users,
      tone: statStyles.violet,
    },
    {
      key: "beforeAfter",
      label: "حالات قبل وبعد",
      active: beforeAfter.filter((b) => b.active).length,
      total: beforeAfter.length,
      icon: ImageIcon,
      tone: statStyles.amber,
    },
  ];

  const quickActions = [
    { href: "/admin/offers", label: "عرض جديد", icon: Tag, tint: "bg-rose-50 text-rose-600" },
    { href: "/admin/services", label: "خدمة جديدة", icon: Stethoscope, tint: "bg-brand-mist text-brand-teal" },
    { href: "/admin/doctors", label: "إضافة طبيب", icon: Users, tint: "bg-violet-50 text-violet-600" },
    { href: "/admin/before-after", label: "حالة قبل وبعد", icon: ImageIcon, tint: "bg-amber-50 text-amber-600" },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-teal via-brand-teal-mid to-brand-navy p-6 text-white shadow-[var(--shadow-lifted)] md:p-8">
        <div className="bg-mesh absolute inset-0 opacity-60" />
        <div className="relative">
          <span className="eyebrow eyebrow--light">
            <Sparkles size={13} /> لوحة التحكم
          </span>
          <h1 className="mt-3 font-display text-2xl font-extrabold md:text-3xl">مرحباً بك 👋</h1>
          <p className="mt-1.5 max-w-xl text-sm text-white/70">
            إدارة محتوى موقع عيادات الأسرة من مكان واحد — العروض والخدمات والأطباء ونتائج المرضى.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-2.5">
            <Link href="/admin/offers" className="btn btn-gold">
              <Plus size={16} /> إضافة عرض
            </Link>
            <a
              href="/ar"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost-light"
            >
              <Globe size={16} /> عرض الموقع
            </a>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.key} href={`/admin/${stat.key === "beforeAfter" ? "before-after" : stat.key}`} className="admin-stat">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-brand-slate">{stat.label}</p>
                <p className="mt-2 flex items-baseline gap-1">
                  <span className="font-display text-4xl font-extrabold tracking-tight text-brand-ink">
                    {stat.active}
                  </span>
                  <span className="text-xs font-bold text-brand-slate/70">/ {stat.total} إجمالي</span>
                </p>
              </div>
              <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${stat.tone.chip}`}>
                <stat.icon size={20} />
              </span>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2">
              <span className={`h-1.5 w-20 overflow-hidden rounded-full bg-brand-mist`}>
                <span
                  className={`block h-full rounded-full bg-gradient-to-r ${stat.tone.bar}`}
                  style={{ width: stat.total ? `${Math.round((stat.active / stat.total) * 100)}%` : "0%" }}
                />
              </span>
              <span className="flex items-center gap-1 text-[11px] font-bold text-brand-teal">
                <ArrowUpRight size={12} /> فتح
              </span>
            </div>
          </Link>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-brand-line bg-white p-6 shadow-[var(--shadow-soft)]">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-brand-ink">إجراءات سريعة</h2>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-mist text-brand-teal">
              <TrendingUp size={16} />
            </span>
          </div>
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {quickActions.map((action) => (
              <Link
                key={action.href + action.label}
                href={action.href}
                className="group flex items-center gap-3 rounded-2xl border border-brand-line bg-white p-3.5 transition-all hover:-translate-y-0.5 hover:border-brand-aqua/50 hover:shadow-[var(--shadow-soft)]"
              >
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${action.tint}`}>
                  <action.icon size={17} />
                </span>
                <span className="text-sm font-bold text-brand-ink">{action.label}</span>
                <ArrowUpRight size={14} className="ms-auto text-brand-slate/50 transition-colors group-hover:text-brand-aqua" />
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-brand-line bg-white p-6 shadow-[var(--shadow-soft)]">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-brand-ink">معاينة الموقع</h2>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-mist text-brand-teal">
              <Globe size={16} />
            </span>
          </div>
          <p className="mt-1 text-sm text-brand-slate">اطّلع على الموقع كما يظهر للزوار.</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <a href="/ar" target="_blank" rel="noopener noreferrer" className="btn btn-outline">
              <Globe size={15} /> عرض الموقع بالعربية
            </a>
            <a href="/en" target="_blank" rel="noopener noreferrer" className="btn btn-outline">
              <Globe size={15} /> English
            </a>
          </div>
          <div className="mt-5 rounded-2xl bg-gradient-to-br from-brand-gold-soft to-transparent p-4 ring-1 ring-brand-gold/30">
            <p className="text-xs font-bold text-amber-800">إدارة المحتوى</p>
            <p className="mt-1 text-xs leading-relaxed text-amber-700/80">
              جميع التعديلات تُحفظ فوراً وتظهر على الموقع العام. استخدم أيقونة الإعدادات لتعديل رقم
              الواتساب وبيانات التواصل.
            </p>
          </div>
        </div>
      </section>

      {!configured && (
        <section className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <Settings size={18} className="mt-0.5 shrink-0" />
          <p>
            Supabase غير مُهيّأ بعد — تعرض لوحة التحكم بيانات تجريبية فقط. أضف
            <code className="mx-1 rounded bg-white px-1.5 py-0.5 text-xs">NEXT_PUBLIC_SUPABASE_URL</code>
            و
            <code className="mx-1 rounded bg-white px-1.5 py-0.5 text-xs">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>
            في ملف <code className="mx-1 rounded bg-white px-1.5 py-0.5 text-xs">.env.local</code> لتفعيل الإضافة والتعديل.
          </p>
        </section>
      )}
    </div>
  );
}
