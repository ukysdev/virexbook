create table if not exists public.user_settings (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  preferred_language text not null default 'de',
  theme text not null default 'system' check (theme in ('system', 'light', 'dark')),
  autoplay_audio boolean not null default false,
  email_notifications boolean not null default true,
  marketing_emails boolean not null default false,
  analytics_enabled boolean not null default true,
  public_profile boolean not null default true,
  show_reading_activity boolean not null default true,
  mature_content boolean not null default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.user_settings enable row level security;

create policy "user_settings_select_own"
on public.user_settings
for select
using (auth.uid() = user_id);

create policy "user_settings_insert_own"
on public.user_settings
for insert
with check (auth.uid() = user_id);

create policy "user_settings_update_own"
on public.user_settings
for update
using (auth.uid() = user_id);
