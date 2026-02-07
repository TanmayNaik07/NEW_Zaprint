shops table:
create table public.shops (
  id uuid not null default gen_random_uuid (),
  owner_id uuid not null,
  shop_name text not null,
  phone text not null,
  location text not null,
  description text null,
  image_url text null,
  start_time time without time zone not null,
  end_time time without time zone not null,
  non_working_days text[] null default '{}'::text[],
  status text not null default 'closed'::text,
  is_onboarded boolean not null default false,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint shops_pkey primary key (id),
  constraint shops_owner_id_fkey foreign KEY (owner_id) references auth.users (id) on delete CASCADE,
  constraint shops_status_check check (
    (
      status = any (
        array['open'::text, 'closed'::text, 'error'::text]
      )
    )
  )
) TABLESPACE pg_default;

shop_services:
create table public.shop_services (
  id uuid not null default gen_random_uuid (),
  shop_id uuid not null,
  service_name text not null,
  price numeric(10, 2) not null,
  created_at timestamp with time zone null default now(),
  constraint shop_services_pkey primary key (id),
  constraint shop_services_shop_id_service_name_key unique (shop_id, service_name),
  constraint shop_services_shop_id_fkey foreign KEY (shop_id) references shops (id) on delete CASCADE,
  constraint shop_services_price_check check ((price >= (0)::numeric))
) TABLESPACE pg_default;

shop_resources:
create table public.shop_resources (
  id uuid not null default gen_random_uuid (),
  shop_id uuid not null,
  resource_name text not null,
  created_at timestamp with time zone null default now(),
  constraint shop_resources_pkey primary key (id),
  constraint shop_resources_shop_id_resource_name_key unique (shop_id, resource_name),
  constraint shop_resources_shop_id_fkey foreign KEY (shop_id) references shops (id) on delete CASCADE
) TABLESPACE pg_default;

shop_printers:
create table public.shop_printers (
  id uuid not null default gen_random_uuid (),
  shop_id uuid not null,
  printer_name text not null,
  printer_type text not null,
  supported_services text[] not null,
  supported_sizes text[] not null,
  status text not null default 'offline'::text,
  last_heartbeat timestamp with time zone null,
  created_at timestamp with time zone null default now(),
  constraint shop_printers_pkey primary key (id),
  constraint shop_printers_shop_id_fkey foreign KEY (shop_id) references shops (id) on delete CASCADE,
  constraint shop_printers_status_check check (
    (
      status = any (
        array['online'::text, 'offline'::text, 'error'::text]
      )
    )
  )
) TABLESPACE pg_default;

So there are total 4 tables related to shop