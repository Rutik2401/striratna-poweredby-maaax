-- =============================================
-- brand_settings — single-row table for admin-editable
-- site-wide configuration (WhatsApp number, Instagram URL,
-- delivery rates, contact info). Read by everyone, written
-- only by authenticated admins.
-- Safe to re-run (idempotent).
-- =============================================

create table if not exists brand_settings (
  id                       int primary key default 1 check (id = 1),
  whatsapp_number          text not null,
  instagram_url            text,
  contact_email            text,
  address                  text,
  free_delivery_threshold  numeric not null default 999,
  delivery_charge          numeric not null default 99,
  inquiry_message          text,
  updated_at               timestamptz not null default now()
);

-- Keep updated_at fresh automatically
create or replace function brand_settings_touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists brand_settings_touch on brand_settings;
create trigger brand_settings_touch
  before update on brand_settings
  for each row execute function brand_settings_touch_updated_at();

alter table brand_settings enable row level security;

drop policy if exists "Anyone can read brand_settings" on brand_settings;
create policy "Anyone can read brand_settings"
  on brand_settings for select using (true);

drop policy if exists "Admin can update brand_settings" on brand_settings;
create policy "Admin can update brand_settings"
  on brand_settings for update using (auth.role() = 'authenticated');

drop policy if exists "Admin can insert brand_settings" on brand_settings;
create policy "Admin can insert brand_settings"
  on brand_settings for insert with check (auth.role() = 'authenticated');

-- Seed the single row if it doesn't exist yet
insert into brand_settings (
  id, whatsapp_number, instagram_url, contact_email, address,
  free_delivery_threshold, delivery_charge, inquiry_message
) values (
  1,
  '919579393985',
  'https://instagram.com/striratna_poweredby_maaax',
  'contact@striratna.in',
  'Shop No. 1/1, Sai Sharan Complex, Pune-Solapur Road, Hadapsar, Pune - 411028',
  999,
  99,
  'Hi! I would like to know more about your jewellery collection.'
)
on conflict (id) do nothing;
