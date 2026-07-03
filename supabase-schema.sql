-- ============================================================
-- Osita Portfolio — Full Supabase Schema v2
-- Run the entire file in: Supabase Dashboard > SQL Editor
-- ============================================================


-- ─── STORAGE BUCKET ─────────────────────────────────────────
-- Create a public bucket called "portfolio" for all image uploads
insert into storage.buckets (id, name, public)
values ('portfolio', 'portfolio', true)
on conflict (id) do nothing;

-- Allow public to view/download any file in the bucket
create policy "Public read portfolio storage"
  on storage.objects for select
  using ( bucket_id = 'portfolio' );

-- Allow authenticated users to upload, update, delete files
create policy "Auth upload portfolio storage"
  on storage.objects for insert
  with check ( bucket_id = 'portfolio' AND auth.role() = 'authenticated' );

create policy "Auth update portfolio storage"
  on storage.objects for update
  using ( bucket_id = 'portfolio' AND auth.role() = 'authenticated' );

create policy "Auth delete portfolio storage"
  on storage.objects for delete
  using ( bucket_id = 'portfolio' AND auth.role() = 'authenticated' );


-- ─── SITE SETTINGS ──────────────────────────────────────────
-- Single-row table — holds hero text, images, contact info, footer
create table if not exists public.site_settings (
  id              int primary key default 1 check (id = 1), -- enforce single row
  full_name       text default 'Osita Kingsley Odo',
  headline        text default 'Cybersecurity Analyst • Risk & Privacy',
  hero_tagline    text default 'Cybersecurity • Governance • Privacy',
  hero_headline   text default 'I help organisations strengthen resilience, protect data, and build digital trust.',
  hero_bio        text default 'I am a junior cybersecurity professional with a strong foundation in vulnerability assessment, privacy awareness, and practical security operations.',
  avatar_url      text,   -- header profile photo (storage URL)
  hero_image_url  text,   -- hero portrait photo (storage URL)
  email           text default 'osita.odo@gmail.com',
  linkedin_url    text,
  github_url      text,
  twitter_url     text,
  location        text    default 'Berlin, Germany',
  footer_tagline  text    default 'Building digital trust — one layer at a time.',
  updated_at      timestamptz default now()
);

-- Seed the single row
insert into public.site_settings (id) values (1)
on conflict (id) do nothing;

alter table public.site_settings enable row level security;

create policy "Public read site_settings"
  on public.site_settings for select using (true);

create policy "Auth update site_settings"
  on public.site_settings for update
  using (auth.role() = 'authenticated');


-- ─── EXPERIENCES ────────────────────────────────────────────
create table if not exists public.experiences (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  company     text not null,
  location    text,
  role_type   text default 'professional',
  icon        text default '💼',
  start_date  text,
  end_date    text,
  is_current  boolean default false,
  bullets     text[],
  sort_order  int  default 0,
  created_at  timestamptz default now()
);

alter table public.experiences enable row level security;

create policy "Public read experiences"
  on public.experiences for select using (true);

create policy "Auth write experiences"
  on public.experiences for all
  using (auth.role() = 'authenticated');


-- ─── EVENTS / PROGRAMS ──────────────────────────────────────
create table if not exists public.events (
  id               uuid primary key default gen_random_uuid(),
  title            text not null,
  organiser        text,
  venue            text,
  city             text,
  country          text,
  event_type       text default 'conference',
  icon             text default '🌐',
  event_date       date,
  end_date         date,
  description      text,
  role             text,
  bullets          text[],
  certificate_url  text,
  image_url        text,   -- uploaded event/program photo
  sort_order       int  default 0,
  created_at       timestamptz default now()
);

alter table public.events enable row level security;

create policy "Public read events"
  on public.events for select using (true);

create policy "Auth write events"
  on public.events for all
  using (auth.role() = 'authenticated');


-- ─── EDUCATION ──────────────────────────────────────────────
create table if not exists public.education (
  id           uuid primary key default gen_random_uuid(),
  category     text not null,          -- e.g. "IT & Cybersecurity", "University", "Certificate"
  institution  text not null,
  degree       text,                   -- e.g. "MSc Social Protection"
  field        text,                   -- e.g. "Social Protection"
  start_year   text,
  end_year     text,
  is_current   boolean default false,
  description  text,
  icon         text default '🎓',
  logo_url     text,                   -- institution logo (optional)
  cert_url     text,                   -- certificate/badge URL
  sort_order   int  default 0,
  created_at   timestamptz default now()
);

alter table public.education enable row level security;

create policy "Public read education"
  on public.education for select using (true);

create policy "Auth write education"
  on public.education for all
  using (auth.role() = 'authenticated');


-- ─── SKILLS ─────────────────────────────────────────────────
create table if not exists public.skills (
  id          uuid primary key default gen_random_uuid(),
  category    text not null,     -- e.g. "Security Tools", "Technical Strengths", "Languages"
  name        text not null,     -- the skill tag text
  level       text,              -- Beginner | Intermediate | Advanced | Expert (optional)
  sort_order  int  default 0,
  created_at  timestamptz default now()
);

alter table public.skills enable row level security;

create policy "Public read skills"
  on public.skills for select using (true);

create policy "Auth write skills"
  on public.skills for all
  using (auth.role() = 'authenticated');


-- ─── NOTES ──────────────────────────────────────────────────
-- After running this SQL:
-- 1. Go to Supabase > Storage > portfolio bucket
--    and confirm it was created as public.
-- 2. Go to Authentication > Users > Add User
--    and create the admin account with email + password.
-- 3. Run `npm run dev` and visit /admin/login to test.
