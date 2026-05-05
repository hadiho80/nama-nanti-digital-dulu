create type public.user_role as enum ('client', 'worker', 'admin');
create type public.request_status as enum (
  'submitted',
  'reviewing',
  'negotiating',
  'waiting_approval',
  'approved',
  'waiting_payment',
  'working',
  'waiting_client',
  'revision',
  'waiting_final_payment',
  'done',
  'cancelled'
);

create type public.offer_status as enum (
  'draft',
  'sent',
  'accepted',
  'rejected',
  'expired',
  'cancelled'
);

create type public.payment_status as enum (
  'unpaid',
  'partial',
  'paid',
  'refunded',
  'cancelled'
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.user_role not null default 'client',
  full_name text,
  username text unique,
  phone text,
  email text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.service_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  examples text[],
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.requests (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.profiles(id) on delete set null,
  assigned_worker_id uuid references public.profiles(id) on delete set null,
  category_id uuid references public.service_categories(id) on delete set null,
  title text not null,
  description text not null,
  detail_type text,
  budget_range text,
  budget_amount numeric(12,2),
  currency text not null default 'IDR',
  expected_deadline date,
  status public.request_status not null default 'submitted',
  source text not null default 'website',
  contact_name text,
  contact_email text,
  contact_phone text,
  internal_note text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.request_files (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.requests(id) on delete cascade,
  uploaded_by uuid references public.profiles(id) on delete set null,
  bucket text not null,
  path text not null,
  file_name text not null,
  mime_type text,
  file_size bigint,
  file_kind text not null default 'attachment',
  created_at timestamptz not null default now()
);

create table public.offers (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.requests(id) on delete cascade,
  worker_id uuid not null references public.profiles(id) on delete cascade,
  price numeric(12,2) not null,
  currency text not null default 'IDR',
  estimated_days int,
  scope text not null,
  revision_count int not null default 1,
  payment_terms text,
  status public.offer_status not null default 'sent',
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.requests(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  is_internal boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.status_history (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.requests(id) on delete cascade,
  changed_by uuid references public.profiles(id) on delete set null,
  from_status public.request_status,
  to_status public.request_status not null,
  note text,
  created_at timestamptz not null default now()
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.requests(id) on delete cascade,
  offer_id uuid references public.offers(id) on delete set null,
  amount numeric(12,2) not null,
  currency text not null default 'IDR',
  status public.payment_status not null default 'unpaid',
  method text not null default 'manual_transfer',
  proof_file_id uuid references public.request_files(id) on delete set null,
  external_provider text,
  external_payment_id text,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, email, full_name, phone)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'phone'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

insert into public.service_categories (name, slug, description, examples, sort_order)
values
  ('Web', 'web', 'Website, landing page, dashboard, toko online sederhana.', array['Landing page', 'Company profile', 'Katalog produk', 'Dashboard admin'], 1),
  ('Mobile Apps', 'mobile-apps', 'Aplikasi mobile sederhana, prototype, dan integrasi API.', array['Prototype app', 'Android sederhana', 'UI mobile', 'Bug fixing'], 2),
  ('Desktop Apps', 'desktop-apps', 'Aplikasi desktop dan tools lokal.', array['Aplikasi kasir', 'Tools input data', 'Inventory lokal'], 3),
  ('Dokumen & Office', 'office', 'Bantuan Word, Excel, PowerPoint, PDF, dan dokumen kerja.', array['Excel formula', 'PowerPoint deck', 'Rapikan Word', 'Format PDF'], 4),
  ('Automation & Data', 'automation-data', 'Automation, data cleaning, scraping, dan integrasi sederhana.', array['Google Sheets automation', 'Web scraping', 'Auto laporan'], 5),
  ('Desain Digital Ringan', 'desain-digital', 'Desain ringan untuk kebutuhan digital.', array['Banner', 'Poster', 'UI mockup'], 6),
  ('Lainnya', 'lainnya', 'Request lain yang belum masuk kategori.', array['Konsultasi', 'Custom request'], 7)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  examples = excluded.examples,
  sort_order = excluded.sort_order,
  is_active = true;

alter table public.profiles enable row level security;
alter table public.requests enable row level security;
alter table public.request_files enable row level security;
alter table public.offers enable row level security;
alter table public.messages enable row level security;
alter table public.status_history enable row level security;
alter table public.payments enable row level security;
alter table public.service_categories enable row level security;

create or replace function public.is_staff(user_id uuid)
returns boolean
language sql
stable
security definer
as $$
  select exists (
    select 1
    from public.profiles
    where id = user_id
      and role in ('worker', 'admin')
  );
$$;

create policy "categories readable by everyone"
on public.service_categories
for select
using (is_active = true);

create policy "profiles can read own profile"
on public.profiles
for select
using (auth.uid() = id or public.is_staff(auth.uid()));

create policy "profiles can update own profile"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "clients and staff can read requests"
on public.requests
for select
using (client_id = auth.uid() or public.is_staff(auth.uid()));

create policy "clients and staff can create requests"
on public.requests
for insert
with check (client_id = auth.uid() or public.is_staff(auth.uid()));

create policy "staff can update requests"
on public.requests
for update
using (public.is_staff(auth.uid()))
with check (public.is_staff(auth.uid()));

create policy "files visible to related users"
on public.request_files
for select
using (
  public.is_staff(auth.uid())
  or exists (
    select 1 from public.requests r
    where r.id = request_files.request_id
      and r.client_id = auth.uid()
  )
);

create policy "files insertable by related users"
on public.request_files
for insert
with check (
  public.is_staff(auth.uid())
  or exists (
    select 1 from public.requests r
    where r.id = request_files.request_id
      and r.client_id = auth.uid()
  )
);

create policy "offers visible to related users"
on public.offers
for select
using (
  public.is_staff(auth.uid())
  or exists (
    select 1 from public.requests r
    where r.id = offers.request_id
      and r.client_id = auth.uid()
  )
);

create policy "staff can manage offers"
on public.offers
for all
using (public.is_staff(auth.uid()))
with check (public.is_staff(auth.uid()));

create policy "messages visible to related users"
on public.messages
for select
using (
  public.is_staff(auth.uid())
  or exists (
    select 1 from public.requests r
    where r.id = messages.request_id
      and r.client_id = auth.uid()
  )
);

create policy "related users can send messages"
on public.messages
for insert
with check (
  sender_id = auth.uid()
  and (
    public.is_staff(auth.uid())
    or exists (
      select 1 from public.requests r
      where r.id = messages.request_id
        and r.client_id = auth.uid()
    )
  )
);

create policy "status history visible to related users"
on public.status_history
for select
using (
  public.is_staff(auth.uid())
  or exists (
    select 1 from public.requests r
    where r.id = status_history.request_id
      and r.client_id = auth.uid()
  )
);

create policy "staff can insert status history"
on public.status_history
for insert
with check (public.is_staff(auth.uid()));

create policy "payments visible to related users"
on public.payments
for select
using (
  public.is_staff(auth.uid())
  or exists (
    select 1 from public.requests r
    where r.id = payments.request_id
      and r.client_id = auth.uid()
  )
);

create policy "staff can manage payments"
on public.payments
for all
using (public.is_staff(auth.uid()))
with check (public.is_staff(auth.uid()));

create policy "request file objects readable by owner folder and staff"
on storage.objects
for select
using (
  bucket_id = 'request-files'
  and (
    public.is_staff(auth.uid())
    or (storage.foldername(name))[1] = auth.uid()::text
  )
);

create policy "request file objects uploadable by owner folder and staff"
on storage.objects
for insert
with check (
  bucket_id = 'request-files'
  and (
    public.is_staff(auth.uid())
    or (storage.foldername(name))[1] = auth.uid()::text
  )
);

create policy "deliverable objects readable by staff"
on storage.objects
for select
using (
  bucket_id = 'deliverables'
  and public.is_staff(auth.uid())
);

create policy "deliverable objects manageable by staff"
on storage.objects
for all
using (
  bucket_id = 'deliverables'
  and public.is_staff(auth.uid())
)
with check (
  bucket_id = 'deliverables'
  and public.is_staff(auth.uid())
);
