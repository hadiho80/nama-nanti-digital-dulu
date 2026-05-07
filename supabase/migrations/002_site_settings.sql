create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_by uuid references public.profiles(id) on delete set null,
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;

drop policy if exists "settings readable by everyone" on public.site_settings;
create policy "settings readable by everyone"
on public.site_settings
for select
using (true);

drop policy if exists "settings manageable by admin" on public.site_settings;
create policy "settings manageable by admin"
on public.site_settings
for all
using (
  exists (
    select 1 from public.profiles
    where id = auth.uid()
      and role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.profiles
    where id = auth.uid()
      and role = 'admin'
  )
);

insert into public.site_settings (key, value)
values
  ('contact', '{}'::jsonb),
  ('password_policy', '{"enabled": true, "minLength": 8, "requireLetter": false, "requireNumber": false, "requireSymbol": false}'::jsonb),
  ('content', '{}'::jsonb)
on conflict (key) do nothing;
