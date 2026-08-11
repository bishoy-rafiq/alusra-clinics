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
-- testimonials  (manually curated Google Maps reviews, or live via Places API)
-- ---------------------------------------------------------------------------
create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  author_name text not null,
  rating int not null check (rating between 1 and 5),
  text_ar text,
  text_en text,
  source text not null default 'manual', -- 'manual' | 'google'
  avatar_url text,
  published boolean not null default true,
  created_at timestamptz not null default now()
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
  maps_url text,
  instagram_url text,
  snapchat_url text,
  x_url text,
  facebook_url text,
  google_place_id text,
  about_title_ar text,
  about_title_en text,
  about_text_ar text,
  about_text_en text,
  updated_at timestamptz not null default now(),
  constraint single_row check (id = 1)
);
insert into site_settings (id) values (1) on conflict (id) do nothing;

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
  foreach t in array array['services','offers','doctors','site_settings','before_after_cases'] loop
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
alter table testimonials enable row level security;
alter table site_settings enable row level security;
alter table before_after_cases enable row level security;

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

-- ============================================================================
-- Storage bucket for uploaded images (offers, services, doctors)
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "public read media" on storage.objects;
create policy "public read media" on storage.objects for select using (bucket_id = 'media');

drop policy if exists "admin upload media" on storage.objects;
create policy "admin upload media" on storage.objects for insert with check (bucket_id = 'media' and auth.role() = 'authenticated');

drop policy if exists "admin update media" on storage.objects;
create policy "admin update media" on storage.objects for update using (bucket_id = 'media' and auth.role() = 'authenticated');

drop policy if exists "admin delete media" on storage.objects;
create policy "admin delete media" on storage.objects for delete using (bucket_id = 'media' and auth.role() = 'authenticated');
