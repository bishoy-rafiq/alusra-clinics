"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { FaWhatsapp } from "react-icons/fa6";
import {
  Users,
  Trash2,
  Copy,
  Check,
  Inbox,
  Calendar,
  Link2,
  MessageCircle,
  Send,
  ArrowRight,
  X,
} from "lucide-react";
import SearchBox from "./SearchBox";
import ConfirmDialog from "./ConfirmDialog";
import AdminField from "./AdminField";
import { formatDate } from "@/lib/format";
import { deleteSubscriber } from "@/app/admin/(dashboard)/subscribers/actions";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://alusraclinics.com";

function digitsOnly(value) {
  return (value || "").replace(/\D/g, "");
}

function normalizePhone(value) {
  let digits = digitsOnly(value);
  if (digits.startsWith("966")) return digits;
  if (digits.startsWith("0") && digits.length === 10) return `966${digits.slice(1)}`;
  return digits;
}

export default function SubscribersManager({ items, offers }) {
  const t = useTranslations("admin");
  const locale = useLocale();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState("");
  const [, startTransition] = useTransition();
  const deletingRef = useRef(false);
  const [queue, setQueue] = useState([]);
  const [queueIndex, setQueueIndex] = useState(-1);
  const [queueDone, setQueueDone] = useState(false);
  const [queueStopped, setQueueStopped] = useState(false);

  const defaultOffer = offers.find((o) => o.active) || offers[0] || null;
  const [offerId, setOfferId] = useState(defaultOffer?.id || "");
  const [message, setMessage] = useState(() => buildOfferMessage(defaultOffer, t, locale));

  const selectedOffer = offers.find((o) => o.id === offerId) || null;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((s) =>
      [s.name, s.email, s.phone, ...(s.interests || [])]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    );
  }, [items, search]);

  function handleOfferChange(e) {
    const id = e.target.value;
    setOfferId(id);
    setMessage(buildOfferMessage(offers.find((o) => o.id === id) || null, t, locale));
  }

  function waLink(phone) {
    const number = normalizePhone(phone);
    if (!number) return null;
    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  }

  function copyAllLinks() {
    const links = filtered
      .map((s) => waLink(s.phone))
      .filter(Boolean)
      .join("\n");
    if (!links) return;
    navigator.clipboard.writeText(links);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  }

  function copyLink(phone) {
    const link = waLink(phone);
    if (!link) return;
    navigator.clipboard.writeText(link);
    setCopiedPhone(phone);
    setTimeout(() => setCopiedPhone(""), 2000);
  }

  function handleDelete(fd) {
    if (deletingRef.current) return;
    deletingRef.current = true;
    startTransition(async () => {
      try {
        await deleteSubscriber(fd);
        setDeleting(null);
        router.refresh();
      } finally {
        deletingRef.current = false;
      }
    });
  }

  function startQueue() {
    const q = filtered
      .map((s) => ({ name: s.name, phone: s.phone, link: waLink(s.phone) }))
      .filter((x) => x.link);
    if (!q.length) return;
    setQueue(q);
    setQueueIndex(0);
    setQueueDone(false);
    setQueueStopped(false);
    window.open(q[0].link, "_blank", "noopener");
  }

  function openCurrent() {
    const current = queue[queueIndex];
    if (current) window.open(current.link, "_blank", "noopener");
  }

  function nextInQueue() {
    if (queueIndex + 1 >= queue.length) {
      setQueueDone(true);
      return;
    }
    const idx = queueIndex + 1;
    setQueueIndex(idx);
    window.open(queue[idx].link, "_blank", "noopener");
  }

  function finishQueue() {
    setQueueStopped(true);
    setQueueDone(true);
  }

  const current = queue[queueIndex];

  return (
    <div className="space-y-6">
      {/* WhatsApp broadcast panel */}
      <section className="rounded-3xl border border-brand-line bg-white p-5 shadow-[var(--shadow-soft)] md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="flex items-center gap-2 font-display text-base font-bold text-brand-ink">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-mist text-brand-teal">
                <MessageCircle size={17} />
              </span>
              {t("subscribers.broadcastTitle")}
            </h2>
            <p className="mt-1 text-xs text-brand-slate">{t("subscribers.broadcastDesc")}</p>
          </div>
          <span className="admin-pill admin-pill--on">{filtered.length} {t("subscribers.countLabel")}</span>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_1.3fr]">
          <AdminField label={t("subscribers.offerLabel")}>
            <select className="admin-select" value={offerId} onChange={handleOfferChange}>
              <option value="">{t("subscribers.selectPlaceholder")}</option>
              {offers.map((offer) => (
                <option key={offer.id} value={offer.id}>
                  {offer.title_ar || offer.title_en} {offer.active ? "" : t("subscribers.inactive")}
                </option>
              ))}
            </select>
          </AdminField>
          <AdminField label={t("subscribers.messageLabel")} hint={t("subscribers.messageHint")}>
            <textarea
              className="admin-textarea"
              style={{ minHeight: "6.5rem" }}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </AdminField>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={copyAllLinks}
            disabled={!filtered.length}
            className="admin-btn-ghost border border-brand-line bg-white hover:bg-brand-mist"
          >
            {copiedAll ? <Check size={15} className="text-emerald-600" /> : <Copy size={15} />}
            {copiedAll ? t("subscribers.copied") : t("subscribers.copyAll")}
          </button>
          {!selectedOffer && (
            <p className="text-xs font-semibold text-amber-600">{t("subscribers.noOffer")}</p>
          )}
        </div>
      </section>

      {/* Send one by one (WhatsApp) */}
      <section className="rounded-3xl border border-brand-line bg-white p-5 shadow-[var(--shadow-soft)] md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="flex items-center gap-2 font-display text-base font-bold text-brand-ink">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-mist text-brand-teal">
                <Send size={17} />
              </span>
              {t("subscribers.oneByOneTitle")}
            </h2>
            <p className="mt-1 text-xs text-brand-slate">{t("subscribers.oneByOneDesc")}</p>
          </div>
          <span className="admin-pill admin-pill--on">{filtered.length} {t("subscribers.countLabel")}</span>
        </div>

        {queueIndex === -1 ? (
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={startQueue}
              disabled={!filtered.length}
              className="btn btn-primary"
            >
              <Send size={16} />
              {t("subscribers.sendAllOneByOne", { count: filtered.length })}
            </button>
            {!selectedOffer && (
              <p className="text-xs font-semibold text-amber-600">{t("subscribers.noOffer")}</p>
            )}
          </div>
        ) : (
          <div className="mt-4 rounded-2xl border border-brand-line bg-brand-mist/60 p-4">
            {queueDone ? (
              <div className="flex items-center gap-2 text-sm font-bold text-emerald-700">
                <Check size={16} />
                {queueStopped
                  ? t("subscribers.queueStopped", { count: queueIndex + 1 })
                  : t("subscribers.queueDone", { count: queue.length })}
              </div>
            ) : (
              <>
                <p className="text-xs font-semibold text-brand-slate">
                  {t("subscribers.nowSending", { name: current?.name })}
                </p>
                <p className="mt-0.5 text-[11px] text-brand-slate/70">
                  {t("subscribers.progress", { index: queueIndex + 1, total: queue.length })}
                </p>
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white">
                  <div
                    className="h-full rounded-full bg-brand-teal transition-all"
                    style={{ width: `${((queueIndex + 1) / queue.length) * 100}%` }}
                  />
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={openCurrent}
                    className="admin-btn-ghost border border-brand-line bg-white hover:bg-brand-mist"
                  >
                    <MessageCircle size={15} />
                    {t("subscribers.openChat")}
                  </button>
                  <button type="button" onClick={nextInQueue} className="btn btn-primary">
                    {queueIndex + 1 >= queue.length ? <Check size={15} /> : <ArrowRight size={15} />}
                    {queueIndex + 1 >= queue.length ? t("subscribers.doneBtn") : t("subscribers.next")}
                  </button>
                  <button
                    type="button"
                    onClick={finishQueue}
                    className="admin-btn-ghost border border-red-100 bg-red-50 text-red-600 hover:bg-red-100"
                  >
                    <X size={15} />
                    {t("subscribers.finish")}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </section>

      {/* Subscribers list */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBox
          value={search}
          onChange={setSearch}
          placeholder={t("subscribers.search")}
        />
        <div className="flex items-center gap-2 text-xs font-semibold text-brand-slate">
          <span className="rounded-full bg-brand-teal px-2.5 py-1 text-white">{filtered.length}</span>
          {t("subscribers.countLabel")}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((subscriber) => {
          const link = waLink(subscriber.phone);
          const rowCopied = copiedPhone === subscriber.phone;
          return (
            <div key={subscriber.id} className="admin-row">
              <span className="admin-row-icon bg-brand-mist text-brand-teal">
                <Users size={19} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate text-sm font-bold text-brand-ink">{subscriber.name}</p>
                  {(subscriber.interests || []).map((interest) => (
                    <span
                      key={interest}
                      className="rounded-full bg-brand-gold-soft px-2 py-0.5 text-[10px] font-extrabold text-amber-700"
                    >
                      {interest === "dentistry" || interest === "dermatology"
                        ? t(`subscribers.interests.${interest}`)
                        : interest}
                    </span>
                  ))}
                </div>
                <p className="mt-0.5 truncate text-xs text-brand-slate">
                  {[subscriber.phone, subscriber.email].filter(Boolean).join("  ·  ")}
                </p>
                <p className="mt-1 flex items-center gap-1 text-[11px] text-brand-slate/70">
                  <Calendar size={11} />
                  {formatDate(subscriber.created_at, locale)}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                {link && (
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={t("subscribers.waTitle")}
                    aria-label={t("subscribers.waLabel", { name: subscriber.name })}
                    className="admin-icon-btn bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                  >
                    <FaWhatsapp size={16} />
                  </a>
                )}
                <button
                  onClick={() => copyLink(subscriber.phone)}
                  className="admin-icon-btn text-brand-teal hover:bg-brand-mist"
                  title={t("subscribers.copyTitle")}
                >
                  {rowCopied ? <Check size={16} className="text-emerald-600" /> : <Link2 size={16} />}
                </button>
                <button
                  onClick={() => setDeleting(subscriber)}
                  className="admin-icon-btn text-red-500 hover:bg-red-50"
                  title={t("common.delete")}
                  aria-label={t("common.deleteLabel", { name: subscriber.name })}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}

        {!filtered.length && (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-brand-line bg-white/60 py-14 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-mist text-brand-teal">
              <Inbox size={24} />
            </span>
            <div>
              <p className="text-sm font-bold text-brand-ink">
                {search ? t("common.noResults") : t("subscribers.emptyTitle")}
              </p>
              <p className="mt-1 text-xs text-brand-slate">
                {search ? t("common.tryDifferent") : t("subscribers.emptyDesc")}
              </p>
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        title={t("subscribers.deleteTitle")}
        message={t("subscribers.deleteMessage", { name: deleting?.name })}
        action={handleDelete}
        id={deleting?.id}
      />
    </div>
  );
}

function buildOfferMessage(offer, t, locale) {
  const title = offer?.title_ar || offer?.title_en || "";
  const lines = [t("subscribers.message.greeting")];
  if (title) lines.push(title);
  if (offer?.valid_until) {
    lines.push(t("subscribers.message.validUntil", { date: formatDate(offer.valid_until, locale) }));
  }
  lines.push(t("subscribers.message.details", { url: `${SITE_URL}/${locale}/offers` }));
  return lines.join("\n");
}
