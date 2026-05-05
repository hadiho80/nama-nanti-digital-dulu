alter table public.offers
add column if not exists estimated_unit text not null default 'hari';
