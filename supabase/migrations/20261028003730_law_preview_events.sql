-- Isolated law-page testing. No triggers, lead updates, or notification hooks.
create table public.law_preview_events (
  id uuid primary key,
  run_id uuid not null,
  dataset text not null check (dataset = 'law-map-form-10-v1'),
  recipient_id text not null check (recipient_id ~ '^LAW-[0-9]{3}$'),
  slug text not null,
  business text not null,
  source_record_id uuid not null,
  source_dataset_id text not null,
  event_type text not null check (event_type in ('visit', 'form_submit')),
  source text not null check (source in ('qr', 'direct')),
  is_test boolean not null default true check (is_test),
  payload jsonb not null default '{}'::jsonb check (octet_length(payload::text) <= 12000),
  created_at timestamptz not null default now()
);
alter table public.law_preview_events enable row level security;
revoke all on public.law_preview_events from public, anon, authenticated;
grant select, insert on public.law_preview_events to service_role;
create index law_preview_events_run_idx on public.law_preview_events (run_id, created_at);
comment on table public.law_preview_events is 'Test-only visits and form submissions for ten existing law-firm research records. Source UUIDs refer to the consolidated CTWP source archive. Never feed these rows to outreach or sales-stage automation.';
