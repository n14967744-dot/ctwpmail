-- Richer landing tracking: landing_events, lead stages, request attribution.

create table if not exists public.landing_events (
  id              bigint generated always as identity primary key,
  lead_id         bigint references public.leads(id) on delete set null,
  slug            text,
  event           text not null check (event in ('visit','form_submit')),
  source          text,
  utm_source      text,
  utm_medium      text,
  utm_campaign    text,
  utm_content     text,
  utm_term        text,
  referrer        text,
  user_agent      text,
  ip_hash         text,
  request_id      text,
  session_id      text,
  device_type     text,
  os              text,
  browser         text,
  screen          text,
  city            text,
  region          text,
  country         text,
  duration_sec    integer,
  max_scroll_pct  integer,
  clicks          jsonb not null default '[]'::jsonb,
  form_started    boolean not null default false,
  form_submitted  boolean not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index if not exists landing_events_slug_created_idx on public.landing_events (slug, created_at desc);
create index if not exists landing_events_lead_idx on public.landing_events (lead_id);
create index if not exists landing_events_session_idx on public.landing_events (session_id, event);

create or replace function public.touch_updated_at() returns trigger
language plpgsql set search_path = public as $$ begin new.updated_at = now(); return new; end $$;
drop trigger if exists landing_events_touch on public.landing_events;
create trigger landing_events_touch before update on public.landing_events
  for each row execute function public.touch_updated_at();

alter table public.landing_events enable row level security;
revoke all on public.landing_events from anon, authenticated;
grant all on public.landing_events to service_role;

-- landing_requests attribution
alter table public.landing_requests
  add column if not exists source  text,
  add column if not exists lead_id bigint references public.leads(id) on delete set null;

-- lead pipeline
alter table public.leads
  add column if not exists mailed_at  timestamptz,
  add column if not exists mail_batch text,
  add column if not exists stage      text,
  add column if not exists stage_at   timestamptz;

create or replace function public.stage_rank(s text) returns int
language sql immutable set search_path = public as $$
  select case s when 'mailed' then 1 when 'scanned' then 2 when 'requested_info' then 3 else 0 end $$;

-- Move a lead forward only; never backward.
create or replace function public.advance_lead_stage(p_slug text, p_stage text) returns void
language sql security definer set search_path = public as $$
  update public.leads set stage = p_stage, stage_at = now()
  where slug = p_slug and public.stage_rank(p_stage) > public.stage_rank(stage) $$;

-- Count a scan (same as increment_qr_scans) and advance stage to 'scanned'.
create or replace function public.log_scan(p_slug text) returns void
language sql security definer set search_path = public as $$
  update public.leads set qr_scans = coalesce(qr_scans,0)+1 where slug = p_slug;
  select public.advance_lead_stage(p_slug, 'scanned'); $$;

revoke execute on function public.advance_lead_stage(text,text) from public, anon, authenticated;
revoke execute on function public.log_scan(text) from public, anon, authenticated;
grant execute on function public.advance_lead_stage(text,text) to service_role;
grant execute on function public.log_scan(text) to service_role;

-- Backfill the test-mailer leads.
update public.leads set mailed_at = coalesce(mailed_at, now()), mail_batch = coalesce(mail_batch, 'test-mailer'),
  stage = 'mailed', stage_at = now()
where id in (1001, 981, 979) and public.stage_rank(stage) < 1;
