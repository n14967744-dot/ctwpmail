-- Neon project ctwp-mail, database "mail". Applied November 11, 2026.
-- Photos a visitor adds after sending a quote request (copier label, serial number).
-- Kept in the database, not on a public URL. Shrunk in the browser before upload (about 1600px, JPEG).
create table if not exists public.landing_request_photos (
  id bigint generated always as identity primary key,
  request_id bigint not null references public.landing_requests(id) on delete cascade,
  content_type text not null,
  bytes bytea not null,
  created_at timestamptz not null default now()
);
