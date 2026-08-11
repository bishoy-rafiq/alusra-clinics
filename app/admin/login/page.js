"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Mail, Lock, Loader2, ShieldCheck, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) {
        setError("بيانات الدخول غير صحيحة. تحقق من البريد الإلكتروني وكلمة المرور.");
        return;
      }
      router.replace(searchParams.get("next") || "/admin");
      router.refresh();
    } catch {
      setError("لم يتم ربط Supabase بعد. أضف بيانات الاتصال في ملف .env.local أولاً (راجع README).");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-brand-ink px-4" dir="rtl">
      <div className="absolute inset-0 bg-mesh opacity-70" />
      <div className="absolute -start-24 top-1/3 h-72 w-72 rounded-full bg-brand-teal/40 blur-[110px]" />
      <div className="absolute -end-20 bottom-1/4 h-72 w-72 rounded-full bg-brand-gold/25 blur-[110px]" />

      <div className="relative w-full max-w-sm">
        <div className="rounded-3xl border border-white/15 bg-white/95 p-8 shadow-[var(--shadow-lifted)] backdrop-blur-xl">
          <div className="mb-6 flex flex-col items-center gap-3 text-center">
            <Image
              src="/images/logo.png"
              alt="Alusra Clinics"
              width={120}
              height={40}
              className="h-9 w-auto opacity-90"
            />
            <p className="font-display text-lg font-extrabold text-brand-ink">لوحة تحكم عيادات الأسرة</p>
            <p className="text-sm text-brand-slate">سجّل الدخول لإدارة العروض والخدمات والأطباء</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-brand-ink">البريد الإلكتروني</label>
              <div className="relative">
                <Mail size={16} className="pointer-events-none absolute start-3.5 top-1/2 -translate-y-1/2 text-brand-slate/50" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-brand-line bg-white py-2.5 pe-4 ps-10 text-sm outline-none transition focus:border-brand-aqua focus:ring-2 focus:ring-brand-aqua/20"
                  placeholder="admin@alusraclinics.com"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-brand-ink">كلمة المرور</label>
              <div className="relative">
                <Lock size={16} className="pointer-events-none absolute start-3.5 top-1/2 -translate-y-1/2 text-brand-slate/50" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-brand-line bg-white py-2.5 pe-4 ps-10 text-sm outline-none transition focus:border-brand-aqua focus:ring-2 focus:ring-brand-aqua/20"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <p className="flex items-start gap-2 rounded-xl bg-red-50 px-3 py-2.5 text-xs font-semibold leading-relaxed text-red-600">
                <AlertCircle size={14} className="mt-0.5 shrink-0" /> {error}
              </p>
            )}

            <button type="submit" disabled={loading} className="btn btn-primary w-full justify-center">
              {loading ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
              {loading ? "جاري الدخول..." : "تسجيل الدخول"}
            </button>
          </form>
        </div>

        <p className="mt-4 text-center text-xs text-white/50">
          منطقة محمية — الوصول مخصّص لفريق إدارة العيادة.
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
