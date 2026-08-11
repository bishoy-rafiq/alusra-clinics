# Alusra Clinics (عيادات الأسرة)

A bilingual (Arabic/English) website for **Alusra Clinics** — dental and
dermatology clinics in Hafr Al-Batin, Saudi Arabia — built with **Next.js 16,
Tailwind CSS v4, Supabase**, and **next-intl**. It includes a fully-featured
Arabic-language admin control panel, WhatsApp-based booking across the site,
live Google Maps reviews, and a strong SEO + AI-answer-engine (AEO) foundation.

---

## Table of contents

1. [Overview](#overview)
2. [Features](#features)
3. [Tech stack](#tech-stack)
4. [Project structure](#project-structure)
5. [Public website](#public-website)
6. [Admin control panel](#admin-control-panel)
7. [Data layer & Supabase](#data-layer--supabase)
8. [Internationalization & routing](#internationalization--routing)
9. [WhatsApp booking](#whatsapp-booking)
10. [Google Maps reviews](#google-maps-reviews)
11. [SEO & AI (AEO)](#seo--ai-aeo)
12. [Environment variables](#environment-variables)
13. [Getting started](#getting-started)
14. [Database setup](#database-setup)
15. [Creating your first admin login](#creating-your-first-admin-login)
16. [Available scripts](#available-scripts)
17. [Deployment](#deployment)

---

## Overview

This is a ground-up rebuild of the clinic's previous website. Visitors get a
modern, mobile-first, RTL/LTR site where every service, offer, and doctor has a
"Book" button that opens **WhatsApp** with a pre-filled message. The clinic's
own staff manage all content — offers, services, doctors, before/after results,
and contact details — from a password-protected Arabic admin panel backed by
Supabase.

A key design goal: **the site must never look empty.** Until Supabase is
connected, the site automatically serves built-in demo content so the design
can be previewed immediately. Once connected, everything is editable in real
time from `/admin`.

---

## Features

**Public site**
- Fully bilingual **Arabic / English** with RTL and LTR layouts, `hreflang`
  alternates between languages, and a language switcher
- Homepage with hero, trust indicators, offers, services, before/after slider,
  about, how-booking-works, doctors, live reviews, **FAQ**, and contact
- Service pages with per-service before/after results
- WhatsApp booking everywhere (`wa.me` deep links with context-aware, localized
  messages)
- Sticky mobile booking bar and floating WhatsApp button
- Demo-content fallback so the site is previewable before Supabase is configured

**Admin control panel (`/admin`)**
- Arabic UI (the clinic's operating language)
- Protected by Supabase Auth — no public sign-up page
- CRUD for offers, services, doctors, before/after cases
- Manage reviews, clinic info, WhatsApp number, social links, and About text
- Image upload to Supabase Storage (`media` bucket)
- Dashboard with stats, quick actions, and site preview links

**SEO & AEO**
- Locale-aware canonical + `hreflang` on every page
- JSON-LD structured data: `MedicalClinic`, `WebSite`, `MedicalProcedure`,
  `Physician`, `SpecialAnnouncement`, `FAQPage`, `BreadcrumbList`
- Dynamic `sitemap.xml` (with images), `robots.txt`, and `llms.txt`
- See [SEO & AI (AEO)](#seo--ai-aeo) for the full picture.

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | **Next.js 16** (App Router, Turbopack) |
| Styling | **Tailwind CSS v4** (CSS-first theme in `app/globals.css`) |
| Database & Auth | **Supabase** (Postgres, Row Level Security, Auth, Storage) |
| i18n | **next-intl** (`/ar`, `/en` routing, RTL/LTR, `hreflang`) |
| Icons | **lucide-react**, **react-icons** |
| Fonts | Google Fonts via `next/font` — **Cairo** (Arabic + Latin), **Fraunces** (display) |
| Charts/UX | none — native `<details>` for FAQ, native slider component for before/after |

---

## Project structure

```
alusra-clinics/
├── app/
│   ├── [locale]/                  # Public bilingual site
│   │   ├── layout.js              # Root layout: fonts, header/footer, JSON-LD, metadata
│   │   ├── page.js                # Homepage (all home sections + FAQ schema)
│   │   ├── about/page.js          # About page (reuses home sections)
│   │   ├── contact/page.js        # Contact page (reuses home sections)
│   │   ├── services/page.js       # Services list by category (Dentistry / Dermatology)
│   │   ├── services/[slug]/page.js# Individual service detail + before/after results
│   │   ├── doctors/page.js        # Medical team listing (+ Physician JSON-LD)
│   │   └── offers/page.js         # Active promotions (+ SpecialAnnouncement JSON-LD)
│   ├── admin/                     # Control panel (Arabic, auth-gated, not localized)
│   │   ├── layout.js              # Admin root: fonts, noindex robots
│   │   ├── login/page.js          # Email/password sign-in
│   │   └── (dashboard)/
│   │       ├── layout.js          # Sidebar + mobile nav + logout
│   │       ├── page.js            # Stats dashboard, quick actions, preview links
│   │       ├── offers/            # page.js + actions.js (Server Actions CRUD)
│   │       ├── services/          #   "
│   │       ├── doctors/           #   "
│   │       ├── before-after/      #   "
│   │       └── settings/          #   "
│   ├── globals.css                # Tailwind v4 theme + design system classes
│   ├── robots.js                  # robots.txt (allows site, disallows /admin)
│   └── sitemap.js                 # Dynamic sitemap.xml (both locales + images)
├── components/
│   ├── home/                      # Homepage sections
│   │   ├── Hero.js                #   Hero with stats, WhatsApp/Map CTAs
│   │   ├── TrustStrip.js          #   Insurance / sterilization / experience badges
│   │   ├── OffersSection.js       #   Latest offers
│   │   ├── ServicesSection.js     #   Services grouped by specialty
│   │   ├── BeforeAfterSection.js  #   Drag-to-compare before/after showcase
│   │   ├── AboutSection.js        #   About text from settings
│   │   ├── HowItWorks.js          #   3-step WhatsApp booking explainer
│   │   ├── DoctorsSection.js      #   Team cards
│   │   ├── ReviewsSection.js      #   Live Google reviews + manual testimonials
│   │   ├── FaqSection.js          #   Bilingual FAQ accordion (native <details>)
│   │   └── ContactSection.js      #   Address, phone, WhatsApp, Maps link
│   ├── layout/
│   │   ├── Header.js              # Main nav + language switcher + mobile menu
│   │   ├── Footer.js
│   │   ├── WhatsAppFloat.js       # Floating WhatsApp button
│   │   ├── StickyBookBar.js       # Sticky bottom "Book" bar on mobile
│   │   └── LanguageSwitch.js
│   ├── ui/
│   │   ├── BookButton.js          # WhatsApp booking button (service/offer/doctor)
│   │   ├── PageHeader.js          # Page title/eyebrow/subtitle header
│   │   ├── SectionHeading.js
│   │   ├── OfferCard.js
│   │   ├── DoctorCard.js
│   │   └── BeforeAfter.js         # Drag slider comparing before/after images
│   └── admin/
│       ├── AdminNav.js            # Sidebar/mobile nav, user chip, logout
│       ├── AdminPageHeader.js
│       ├── AdminDialog.js         # Modal wrapper
│       ├── AdminField.js          # Labeled form field
│       ├── SearchBox.js
│       ├── StatusBadge.js         # Active / inactive pill
│       ├── ConfirmDialog.js       # Delete confirmation
│       ├── ImageUploader.js       # Upload to Supabase Storage
│       ├── ServicesManager.js     # List + create/edit/delete services
│       ├── DoctorsManager.js
│       ├── OffersManager.js
│       └── BeforeAfterManager.js
├── i18n/
│   ├── routing.js                 # Locales, default locale, pathnames
│   ├── navigation.js              # next-intl Link/router helpers
│   └── request.js                 # Loads messages/{locale}.json per request
├── lib/
│   ├── seo.js                     # JSON-LD builders + canonical/hreflang helper
│   ├── whatsapp.js                # wa.me deep-link builder with localized templates
│   ├── googlePlaces.js            # Live Google Places API (New) reviews fetcher
│   ├── format.js                  # Date + locale-aware field pickers
│   ├── icon-map.js                # Service icon → lucide component map
│   ├── service-image-map.js       # Service slug → default image fallback map
│   ├── data/
│   │   ├── index.js               # Public data fetchers (with demo fallback)
│   │   ├── admin.js               # Admin-panel fetchers (no fallback)
│   │   └── fallback.js            # Demo content shown before Supabase is set up
│   └── supabase/
│       ├── server.js              # Supabase client for Server Components
│       ├── client.js              # Supabase client for Client Components
│       └── middleware.js          # Auth-session refresh helper
├── messages/
│   ├── en.json                    # English UI strings + meta + FAQ content
│   └── ar.json                    # Arabic UI strings + meta + FAQ content
├── public/
│   ├── images/                    # Static brand and service imagery
│   ├── favicon.svg
│   └── llms.txt                   # Plain-language summary for AI assistants
├── supabase/
│   ├── schema.sql                 # Tables, RLS policies, storage bucket, triggers
│   └── seed.sql                   # Starter content (real services)
├── proxy.js                       # Middleware: admin auth guard + intl routing
├── next.config.mjs                # next-intl plugin + Supabase image domains
├── eslint.config.mjs
├── jsconfig.json                  # Path alias @/*
└── package.json
```

---

## Public website

### Routes

| Route | Content |
|---|---|
| `/ar` · `/en` | Homepage — hero, trust, offers, services, before/after, about, how it works, doctors, reviews, FAQ, contact |
| `/ar/services` · `/en/services` | All services grouped by category (Dentistry / Dermatology) |
| `/ar/services/[slug]` · `/en/services/[slug]` | Service detail + its before/after results |
| `/ar/doctors` · `/en/doctors` | Medical team |
| `/ar/offers` · `/en/offers` | Current active promotions |
| `/ar/about` · `/en/about` | About (reuses homepage `AboutSection` + `DoctorsSection`) |
| `/ar/contact` · `/en/contact` | Contact details + location (reuses homepage sections) |
| `/sitemap.xml` · `/robots.txt` | Generated for search engines |

### Homepage sections (in render order)

1. **Hero** — headline, WhatsApp / Call / Get-Directions CTAs, clinic stats
2. **TrustStrip** — insurance accepted, sterilized tools, modern technology,
   certified specialists, 20+ years, free consultation
3. **OffersSection** — latest offers (link to `/offers`)
4. **ServicesSection** — grouped by specialty
5. **BeforeAfterSection** — drag-to-compare results
6. **AboutSection** — About text (editable in `/admin/settings`)
7. **HowItWorks** — 3-step WhatsApp booking
8. **DoctorsSection** — team cards
9. **ReviewsSection** — live Google reviews or manual testimonials
10. **FaqSection** — bilingual accordion (also feeds `FAQPage` JSON-LD)
11. **ContactSection** — contact info + Maps

---

## Admin control panel

Located at **`/admin`** (Arabic UI, intentionally **not** localized). All routes
except `/admin/login` require an authenticated Supabase user. The guard lives in
[`proxy.js`](proxy.js): unauthenticated visitors are redirected to
`/admin/login?next=...`, and logged-in users are bounced away from the login
page. The admin root layout also sets `robots: noindex`.

### What you can manage

| Section | Route | Notes |
|---|---|---|
| Dashboard | `/admin` | Counts of active/total items, quick actions, site preview |
| Offers | `/admin/offers` | Title/description/badge (AR+EN), image, validity, active toggle |
| Services | `/admin/services` | Name/excerpt/description (AR+EN), icon, image, category, ordering |
| Doctors | `/admin/doctors` | Name/specialty/bio (AR+EN), photo, active, ordering |
| Before / After | `/admin/before-after` | Title/description (AR+EN), before & after images, linked service |
| Settings | `/admin/settings` | Clinic name, phone, WhatsApp number, email, address, Maps URL, socials, About text |

### How CRUD works

Each section has a Server Actions file (`actions.js`) using `"use server"`.
Actions validate the form, upsert via Supabase, and call
`revalidatePath` so the public site and admin list refresh instantly. Forms
and lists are client components under `components/admin/`. Images are uploaded
through [`ImageUploader.js`](components/admin/ImageUploader.js) to the `media`
Supabase Storage bucket.

**Creating accounts:** there is no public sign-up. Create staff accounts in
Supabase Dashboard → Authentication → Users → Add user. Any user created there
can sign in at `/admin/login`.

---

## Data layer & Supabase

All public data flows through [`lib/data/index.js`](lib/data/index.js). Every
fetcher:

1. Checks if Supabase env vars are configured (`isSupabaseConfigured()`).
2. If **not** configured → returns demo content from `lib/data/fallback.js`.
3. If configured → queries Supabase and falls back to demo content on any error.

This is why the site renders immediately with no backend.

### Tables (`supabase/schema.sql`)

| Table | Purpose |
|---|---|
| `service_categories` | Dentistry / Dermatology (and future categories) |
| `services` | Bilingual name, excerpt, description, icon, image, active, order |
| `offers` | Bilingual title/description/badge, image, validity, discount label |
| `doctors` | Bilingual name, specialty, bio, photo |
| `testimonials` | Manually curated reviews (fallback when Places API is off) |
| `site_settings` | Single row (`id = 1`): clinic identity, contact, socials, About |
| `before_after_cases` | Bilingual title/description + before & after images, linked service |

### Security

- **Row Level Security (RLS)** is enabled on every table.
- Public visitors can only **read** published/active rows (`active = true` or
  `published = true`).
- Any **authenticated** user (an admin you created) can read + write everything.
- Storage bucket `media` is public for reads; uploads/updates/deletes require
  authentication.
- A `set_updated_at()` trigger keeps `updated_at` fresh on write tables.

Run `supabase/schema.sql` then `supabase/seed.sql` once in the Supabase SQL
editor (or via the Supabase CLI).

---

## Internationalization & routing

- Powered by **next-intl** with `localePrefix: "always"` — URLs are always
  prefixed (`/ar`, `/en`), default locale is Arabic (`/ar`).
- `i18n/request.js` loads `messages/{locale}.json` per request; these files hold
  all UI strings, page meta titles/descriptions, and FAQ content.
- The `<html>` element gets `lang` and `dir` (`rtl`/`ltr`) from the locale.
- Fonts: Cairo (Arabic + Latin) and Fraunces (display headings).
- Navigation uses `Link` from `@/i18n/navigation` so all internal links stay
  locale-aware.
- `proxy.js` middleware picks the locale route for public paths, and the
  `/admin` guard for admin paths.

---

## WhatsApp booking

Everything that can be booked routes through [`lib/whatsapp.js`](lib/whatsapp.js):

- `getWhatsAppNumber()` — reads `NEXT_PUBLIC_WHATSAPP_NUMBER` (falls back to
  `966137233900`).
- `buildWhatsAppLink({ locale, name, kind })` — builds a `wa.me` link with a
  pre-filled message in the visitor's language, naming the exact service, offer,
  or doctor. `kind` selects the message template (`service` | `offer` | `doctor`
  | `general`).

Components using it: `BookButton`, `WhatsAppFloat`, `StickyBookBar`,
`HowItWorks`, `ContactSection`, `FaqSection`. The number can be changed any time
from `/admin/settings` or the env var.

---

## Google Maps reviews

Two sources, in priority order:

1. **Live (recommended)** — set `GOOGLE_PLACES_API_KEY` and `GOOGLE_PLACE_ID`.
   [`lib/googlePlaces.js`](lib/googlePlaces.js) calls the Google Places API
   (New) for the overall rating, review count, and up to 5 reviews (a Google
   limitation). Response is cached with `revalidate: 6h`.
2. **Manual fallback** — without those env vars, the site shows reviews added in
   `/admin` (the `testimonials` table). The listing page shows "Live from
   Google" only when the API is returning data.

---

## SEO & AI (AEO)

The site ships with a strong technical foundation for classic SEO **and** modern
AI-answer-engine optimization (ChatGPT, Perplexity, Google AI Overviews):

- **Metadata** — unique, translated titles/descriptions per page; Open Graph +
  Twitter cards; robots rules (`index, follow`, `max-image-preview: large`).
- **Canonical & hreflang** — every page has a locale-aware canonical URL and
  `alternate hreflang` tags linking each `/ar` page to its `/en` twin plus
  `x-default`. See `localizedAlternates()` in `lib/seo.js`.
- **JSON-LD structured data** (built in `lib/seo.js`, injected per page):
  - `MedicalClinic` + `WebSite` — root layout, on every page
  - `MedicalProcedure` + `BreadcrumbList` — every service page
  - `Physician` — each doctor on `/doctors`
  - `SpecialAnnouncement` — each offer on `/offers`
  - `FAQPage` — homepage, matching the visible FAQ section
- **`sitemap.xml`** (`app/sitemap.js`) — every page in both locales, with
  per-service images and priorities.
- **`robots.txt`** — allows the site, disallows `/admin`.
- **`llms.txt`** (`public/llms.txt`) — a plain-language summary of the business
  for AI assistants that read this emerging convention.
- **AI-answer-friendly content** — the homepage FAQ answers common booking
  questions, and every service page carries schema-typed descriptions.

**An honest note:** no code can *guarantee* rank #1 in Google or in AI answers.
Rankings depend on ongoing, non-code factors — content freshness, real patient
reviews, backlinks, your Google Business Profile, and real-world page speed.
This codebase provides the technical foundation those rankings depend on. The
highest-leverage next steps are: (1) claim and optimize your Google Business
Profile, (2) grow genuine Google reviews, (3) earn links from reputable local
sites.

---

## Environment variables

Create a `.env.local` from `.env.example` (copy `.env.example` → `.env.local`
and fill in the values):

```
# Required for a live, editable site (Supabase)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# Your public site URL — used for canonical URLs, sitemap, JSON-LD
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# WhatsApp Business number used for booking links (digits only, incl. country code)
NEXT_PUBLIC_WHATSAPP_NUMBER=966137233900

# Optional: live Google Maps reviews (Places API New)
GOOGLE_PLACES_API_KEY=...
GOOGLE_PLACE_ID=...
```

> Without Supabase vars the public site still works on demo content. Without the
> Google vars, reviews fall back to the ones you add manually in `/admin`.

---

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env.local
# ...then fill in the values described above

# 3. Set up the database (see below)

# 4. Run locally
npm run dev
```

Visit `http://localhost:3000/ar` (or `/en`) for the site, and `/admin` for the
control panel.

---

## Database setup

1. Create a free project at [supabase.com](https://supabase.com).
2. In **Project Settings → API**, copy the Project URL and the `anon public` key
   into `.env.local`.
3. Open the Supabase **SQL Editor** and run `supabase/schema.sql`, then
   `supabase/seed.sql`. This creates every table, the RLS policies, the `media`
   storage bucket, and seeds the starter services.
4. To enable image uploads, nothing extra is needed — the bucket and policies
   are created by the schema.

---

## Creating your first admin login

1. In Supabase Dashboard → **Authentication → Users → Add user**, create a
   staff account (email + password).
2. Sign in at `/admin/login`.
3. Any user created this way has full read/write access to all tables (RLS
   treats "authenticated" as admin).

---

## Available scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

---

## Deployment

Deploys cleanly to **Vercel** (zero config for Next.js):

1. Push this project to a Git repository.
2. Import it in Vercel.
3. Add the same environment variables from `.env.local` (Supabase URL/key,
   `NEXT_PUBLIC_SITE_URL`, WhatsApp number, and the optional Google keys).
4. Deploy, then add your custom domain in Vercel → Domains.

After deploying, update `NEXT_PUBLIC_SITE_URL` to your real domain so
canonicals, the sitemap, and structured data point at the right place.
