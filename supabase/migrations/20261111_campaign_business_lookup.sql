-- PROPOSED. NOT APPLIED. Review before running on the CTWP HQ database.
--
-- What it does: adds one read-only function the landing page calls to look a business up by its slug.
-- Why a function: the ctwp_campaign schema is deliberately not exposed through the Data API, and the
-- businesses table says never to send a whole row to a browser. This returns six display fields only,
-- for businesses marked selected, and only the server (service role) may call it.
-- It changes no existing table and stores nothing.

create or replace function public.campaign_business(p_slug text)
returns table (slug text, name text, niche text, subgroup text, address text, logo_url text)
language sql
stable
security definer
set search_path = ''
as $$
  select b.slug,
         b.business_name,
         b.niche,
         b.business_subgroup,
         b.mailing_address,
         case when b.logo_choice = 'Use logo' then b.reviewed_logo_url end
  from ctwp_campaign.businesses b
  where b.slug = p_slug
    and b.selection_status = 'selected'
  limit 1
$$;

revoke all on function public.campaign_business(text) from public, anon, authenticated;
grant execute on function public.campaign_business(text) to service_role;

comment on function public.campaign_business(text) is
  'Landing page lookup: display fields for one selected campaign business, by slug. Server-side only.';

-- To undo: drop function public.campaign_business(text);
