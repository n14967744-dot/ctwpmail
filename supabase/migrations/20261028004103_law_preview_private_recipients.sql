create table public.law_preview_recipients (
  id text primary key check (id ~ '^LAW-[0-9]{3}$'),
  dataset text not null default 'law-map-form-10-v1' check (dataset = 'law-map-form-10-v1'),
  slug text not null unique,
  name text not null,
  practice text not null,
  address text not null,
  city text not null,
  state text not null,
  zip text not null,
  source_url text not null,
  checked_date date not null,
  source_record_id uuid not null,
  source_dataset_id text not null
);
alter table public.law_preview_recipients enable row level security;
revoke all on public.law_preview_recipients from public, anon, authenticated;
grant select on public.law_preview_recipients to service_role;
comment on table public.law_preview_recipients is 'Private projection of ten existing research records for a protected law-page test. No mail approval or customer status is implied.';
