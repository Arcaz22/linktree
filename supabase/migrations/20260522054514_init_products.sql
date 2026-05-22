create table if not exists public.products (
  id            text primary key,
  name          text not null,
  description   text default '',
  category      text default '',
  image         text default '',
  affiliate_url text not null,
  is_active     boolean default true,
  position      integer default 0,
  created_at    timestamptz default now()
);

alter table public.products enable row level security;

drop policy if exists "Public can read products" on public.products;
create policy "Public can read products"
  on public.products
  for select
  using (true);

drop policy if exists "Anon can write products" on public.products;
create policy "Anon can write products"
  on public.products
  for all
  using (true)
  with check (true);
