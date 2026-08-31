"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Loader2, BadgeCheck, Send, User, Mail, Phone, Sparkles, Check } from "lucide-react";
import { subscribeToOffers } from "@/lib/actions/offerSubscribe";

const INTERESTS = [
  { value: "dentistry", labelKey: "interestDentistry" },
  { value: "dermatology", labelKey: "interestDermatology" },
];
const BOTH = "both";

export default function OfferSubscribe({ variant = "card" }) {
  const t = useTranslations("subscribe");
  const glass = variant === "glass";
  const bare = variant === "bare";
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [selected, setSelected] = useState([]);
  const [pending, startTransition] = useTransition();

  const containerCls = bare
    ? ""
    : glass
      ? "glass rounded-[1.75rem] p-6 shadow-[var(--shadow-lifted)] md:p-7"
      : "rounded-[1.75rem] border border-brand-line bg-white p-6 shadow-[var(--shadow-lifted)] md:p-7";

  const inputCls =
    "w-full rounded-xl border border-brand-line bg-white px-3.5 py-2.5 text-sm font-medium text-brand-ink placeholder-brand-slate/60 outline-none transition focus:border-brand-aqua focus:ring-2 focus:ring-brand-aqua/15";

  const labelCls = "mb-1.5 block text-xs font-bold text-brand-ink";

  function toggleInterest(value) {
    if (value === BOTH) {
      setSelected((prev) =>
        prev.length === 2 ? [] : ["dentistry", "dermatology"]
      );
      return;
    }
    setSelected((prev) => {
      const all = ["dentistry", "dermatology"].includes(value) ? [value] : [value];
      return prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, ...all].slice(0, 2);
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (pending) return;
    setError("");
    if (selected.length < 1 || selected.length > 2) {
      setError(t("error.interests"));
      setStatus("error");
      return;
    }
    const form = e.currentTarget;
    const fd = new FormData(form);
    fd.delete("interests");
    selected.forEach((value) => fd.append("interests", value));
    startTransition(async () => {
      try {
        const res = await subscribeToOffers(fd);
        if (res?.ok) {
          setStatus("success");
          setSelected([]);
          form.reset();
        } else {
          setStatus("error");
          setError(t(`error.${res?.error || "generic"}`));
        }
      } catch {
        setStatus("error");
        setError(t("error.generic"));
      }
    });
  }

  const chipCls = (active) =>
    `flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-bold transition cursor-pointer ${
      active
        ? "border-brand-teal bg-brand-teal text-white"
        : "border-brand-line bg-white text-brand-ink hover:border-brand-aqua"
    }`;

  if (status === "success") {
    return (
      <div className={`${containerCls} flex flex-col items-center gap-2 text-center`} role="status">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-brand text-white">
          <BadgeCheck size={26} />
        </span>
        <p className="font-display text-xl font-bold text-brand-ink">{t("successTitle")}</p>
        <p className="max-w-xs text-sm leading-relaxed text-brand-slate">{t("successText")}</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-2 text-xs font-bold text-brand-gold underline-offset-4 hover:underline"
        >
          {t("again")}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={containerCls}>
      {!bare && (
        <div className={`flex items-center gap-2 ${glass ? "text-brand-gold" : "text-brand-teal"}`}>
          <Sparkles size={15} />
          <span className="text-[0.7rem] font-extrabold uppercase tracking-widest">{t("eyebrow")}</span>
        </div>
      )}
      {!bare && <h3 className="mt-2 font-display text-xl font-bold text-brand-ink">{t("title")}</h3>}
      {!bare && <p className="mt-1 text-xs leading-relaxed text-brand-slate">{t("subtitle")}</p>}

      <div className={bare ? "space-y-4" : "mt-5 space-y-4"}>
        <div className="relative">
          <label className={labelCls}>{t("nameLabel")}</label>
          <span className="pointer-events-none absolute end-3 top-[2.35rem] text-brand-gold">
            <User size={15} />
          </span>
          <input name="name" required placeholder={t("namePlaceholder")} className={inputCls} />
        </div>

        <div className="relative">
          <label className={labelCls}>{t("emailLabel")}</label>
          <span className="pointer-events-none absolute end-3 top-[2.35rem] text-brand-gold">
            <Mail size={15} />
          </span>
          <input name="email" type="email" placeholder={t("emailPlaceholder")} className={inputCls} />
        </div>

        <div className="relative">
          <label className={labelCls}>{t("phoneLabel")}</label>
          <span className="pointer-events-none absolute end-3 top-[2.35rem] text-brand-gold">
            <Phone size={15} />
          </span>
          <input name="phone" required inputMode="tel" placeholder={t("phonePlaceholder")} className={inputCls} />
        </div>

        <div>
          <span className={labelCls}>{t("interestsLabel")}</span>
          <div className="flex flex-wrap gap-2">
            {INTERESTS.map((interest) => {
              const active = selected.includes(interest.value);
              return (
                <button
                  key={interest.value}
                  type="button"
                  onClick={() => toggleInterest(interest.value)}
                  aria-pressed={active}
                  className={chipCls(active)}
                >
                  <span
                    className={`flex h-4 w-4 items-center justify-center rounded-full border transition ${
                      active ? "border-white/70" : "border-brand-line"
                    }`}
                  >
                    {active && <Check size={10} strokeWidth={3.5} />}
                  </span>
                  {t(interest.labelKey)}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => toggleInterest(BOTH)}
              aria-pressed={selected.length === 2}
              className={chipCls(selected.length === 2)}
            >
              <span
                className={`flex h-4 w-4 items-center justify-center rounded-full border transition ${
                  selected.length === 2 ? "border-white/70" : "border-brand-line"
                }`}
              >
                {selected.length === 2 && <Check size={10} strokeWidth={3.5} />}
              </span>
              {t("interestBoth")}
            </button>
          </div>
        </div>

        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-brand-line bg-brand-mist/60 p-3.5 transition hover:border-brand-aqua">
          <input
            type="checkbox"
            name="consent"
            required
            className="mt-0.5 h-4 w-4 shrink-0 accent-brand-teal"
          />
          <span className="text-xs leading-relaxed text-brand-slate">{t("consentLabel")}</span>
        </label>

        {status === "error" && error && (
          <p className="rounded-xl bg-red-50 px-3 py-2.5 text-xs font-semibold text-red-600 ring-1 ring-red-100">
            {error}
          </p>
        )}

        <button type="submit" disabled={pending} className="btn btn-whatsapp w-full">
          {pending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          {pending ? "..." : t("submit")}
        </button>

        <p className="text-center text-[0.68rem] leading-relaxed text-brand-slate">{t("privacy")}</p>
      </div>
    </form>
  );
}
