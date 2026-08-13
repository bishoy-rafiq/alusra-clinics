-- ============================================================================
-- Alusra Clinics — Supabase schema
-- Run this once in the Supabase SQL editor (or via `supabase db push`).
-- Safe to re-run: every statement is guarded with IF NOT EXISTS / OR REPLACE.
-- ============================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- service_categories
-- ---------------------------------------------------------------------------
create table if not exists service_categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name_ar text not null,
  name_en text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- services
-- ---------------------------------------------------------------------------
create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  category text not null references service_categories(slug) on update cascade,
  name_ar text not null,
  name_en text not null,
  excerpt_ar text,
  excerpt_en text,
  description_ar text,
  description_en text,
  icon text,
  image_url text,
  active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- offers
-- ---------------------------------------------------------------------------
create table if not exists offers (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title_ar text not null,
  title_en text not null,
  description_ar text,
  description_en text,
  badge_ar text,
  badge_en text,
  image_url text,
  discount_label text,
  valid_until date,
  related_service_id uuid references services(id) on delete set null,
  active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- doctors
-- ---------------------------------------------------------------------------
create table if not exists doctors (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name_ar text not null,
  name_en text not null,
  specialty_ar text,
  specialty_en text,
  bio_ar text,
  bio_en text,
  photo_url text,
  active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


-- ---------------------------------------------------------------------------
-- site_settings  (single row: id = 1)
-- ---------------------------------------------------------------------------
create table if not exists site_settings (
  id int primary key default 1,
  clinic_name_ar text not null default 'عيادات الأسرة',
  clinic_name_en text not null default 'Alusra Clinics',
  phone text,
  whatsapp_number text,
  email text,
  address_ar text,
  address_en text,
  working_hours_ar text,
  working_hours_en text,
  maps_url text,
  instagram_url text,
  snapchat_url text,
  x_url text,
  facebook_url text,
  tiktok_url text,
  youtube_url text,
  telegram_url text,
  linkedin_url text,
  threads_url text,
  google_place_id text,
  about_title_ar text,
  about_title_en text,
  about_text_ar text,
  about_text_en text,
  about_images jsonb,
  contact_images jsonb,
  updated_at timestamptz not null default now(),
  constraint single_row check (id = 1)
);
insert into site_settings (id) values (1) on conflict (id) do nothing;

-- Add columns that were introduced after the table was first created, so
-- re-running this schema file on an existing database upgrades it in place.
alter table site_settings add column if not exists working_hours_ar text;
alter table site_settings add column if not exists working_hours_en text;
alter table site_settings add column if not exists tiktok_url text;
alter table site_settings add column if not exists youtube_url text;
alter table site_settings add column if not exists telegram_url text;
alter table site_settings add column if not exists linkedin_url text;
alter table site_settings add column if not exists threads_url text;
alter table site_settings add column if not exists about_images jsonb;
alter table site_settings add column if not exists contact_images jsonb;

-- ---------------------------------------------------------------------------
-- before_after_cases  (before/after result showcase, managed from admin)
-- ---------------------------------------------------------------------------
create table if not exists before_after_cases (
  id uuid primary key default gen_random_uuid(),
  related_service_id uuid references services(id) on delete set null,
  title_ar text not null default '',
  title_en text not null default '',
  description_ar text default '',
  description_en text default '',
  before_image text,
  after_image text,
  sort_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- offer_subscribers  (offer interest subscriptions collected on the public site)
-- ---------------------------------------------------------------------------
create table if not exists offer_subscribers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text not null,
  interests text[] not null default '{}', -- e.g. {'dentistry','dermatology'}
  consent boolean not null default false, -- agreed to receive WhatsApp offers
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- faqs  (frequently asked questions shown on the home page, managed from admin)
-- ---------------------------------------------------------------------------
create table if not exists faqs (
  id uuid primary key default gen_random_uuid(),
  question_ar text not null default '',
  question_en text not null default '',
  answer_ar text not null default '',
  answer_en text not null default '',
  sort_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- updated_at trigger helper
-- ---------------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

do $$
declare
  t text;
begin
  foreach t in array array['services','offers','doctors','site_settings','before_after_cases','offer_subscribers','faqs'] loop
    execute format('drop trigger if exists trg_set_updated_at on %I;', t);
    execute format('create trigger trg_set_updated_at before update on %I for each row execute function set_updated_at();', t);
  end loop;
end $$;

-- ============================================================================
-- Row Level Security
-- Public (anon) visitors may only READ published/active rows.
-- Any authenticated user (i.e. an admin you create in Supabase Auth) may
-- read + write everything. There is no public sign-up page in the app, so
-- "authenticated" effectively means "an admin you created yourself".
-- ============================================================================

alter table service_categories enable row level security;
alter table services enable row level security;
alter table offers enable row level security;
alter table doctors enable row level security;
alter table site_settings enable row level security;
alter table before_after_cases enable row level security;
alter table offer_subscribers enable row level security;
alter table faqs enable row level security;

-- service_categories
drop policy if exists "public read categories" on service_categories;
create policy "public read categories" on service_categories for select using (true);
drop policy if exists "admin write categories" on service_categories;
create policy "admin write categories" on service_categories for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- services
drop policy if exists "public read active services" on services;
create policy "public read active services" on services for select using (active = true or auth.role() = 'authenticated');
drop policy if exists "admin write services" on services;
create policy "admin write services" on services for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- offers
drop policy if exists "public read active offers" on offers;
create policy "public read active offers" on offers for select using (active = true or auth.role() = 'authenticated');
drop policy if exists "admin write offers" on offers;
create policy "admin write offers" on offers for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- doctors
drop policy if exists "public read active doctors" on doctors;
create policy "public read active doctors" on doctors for select using (active = true or auth.role() = 'authenticated');
drop policy if exists "admin write doctors" on doctors;
create policy "admin write doctors" on doctors for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- blog_posts (table & policies) removed with the blog feature

-- testimonials
drop policy if exists "public read published testimonials" on testimonials;
create policy "public read published testimonials" on testimonials for select using (published = true or auth.role() = 'authenticated');
drop policy if exists "admin write testimonials" on testimonials;
create policy "admin write testimonials" on testimonials for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- site_settings
drop policy if exists "public read settings" on site_settings;
create policy "public read settings" on site_settings for select using (true);
drop policy if exists "admin write settings" on site_settings;
create policy "admin write settings" on site_settings for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- before_after_cases
drop policy if exists "public read active before/after" on before_after_cases;
create policy "public read active before/after" on before_after_cases for select using (active = true or auth.role() = 'authenticated');
drop policy if exists "admin write before/after" on before_after_cases;
create policy "admin write before/after" on before_after_cases for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- offer_subscribers — anyone can subscribe (INSERT); only admins can read/delete
drop policy if exists "public subscribe to offers" on offer_subscribers;
create policy "public subscribe to offers" on offer_subscribers for insert with check (true);
drop policy if exists "admin read subscribers" on offer_subscribers;
create policy "admin read subscribers" on offer_subscribers for select using (auth.role() = 'authenticated');
drop policy if exists "admin delete subscribers" on offer_subscribers;
create policy "admin delete subscribers" on offer_subscribers for delete using (auth.role() = 'authenticated');

-- faqs
drop policy if exists "public read active faqs" on faqs;
create policy "public read active faqs" on faqs for select using (active = true or auth.role() = 'authenticated');
drop policy if exists "admin write faqs" on faqs;
create policy "admin write faqs" on faqs for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ============================================================================
-- Storage bucket for uploaded images (offers, services, doctors)
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- Refresh the PostgREST schema cache so new/updated columns are immediately
-- visible to the API. Run this any time you add or change columns and then
-- get "Could not find the '...' column ... in the schema cache" errors.
notify pgrst, 'reload schema';

drop policy if exists "public read media" on storage.objects;
create policy "public read media" on storage.objects for select using (bucket_id = 'media');

drop policy if exists "admin upload media" on storage.objects;
create policy "admin upload media" on storage.objects for insert with check (bucket_id = 'media' and auth.role() = 'authenticated');

drop policy if exists "admin update media" on storage.objects;
create policy "admin update media" on storage.objects for update using (bucket_id = 'media' and auth.role() = 'authenticated');

drop policy if exists "admin delete media" on storage.objects;
create policy "admin delete media" on storage.objects for delete using (bucket_id = 'media' and auth.role() = 'authenticated');
