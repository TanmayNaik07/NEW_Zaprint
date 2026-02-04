
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  full_name text,
  avatar_url text,
  updated_at timestamp with time zone,
  
  constraint username_length check (char_length(full_name) >= 3)
);

-- SHOPS (Vendors)
create table if not exists public.shops (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  address text not null,
  phone text,
  image_url text,
  is_open boolean default true,
  price_bw_per_page numeric not null,
  price_color_per_page numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  owner_id uuid references auth.users -- Optional: link to a user who owns the shop
);

-- ORDER STATUS ENUM
create type order_status as enum ('pending', 'processing', 'printing', 'completed', 'cancelled');

-- ORDERS
create table if not exists public.orders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  shop_id uuid references public.shops(id) not null,
  status order_status default 'pending',
  total_amount numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ORDER ITEMS / FILES
create table if not exists public.order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  file_url text not null,
  file_name text not null,
  file_type text, -- pdf, docx, etc
  color_mode text check (color_mode in ('bw', 'color')),
  copies integer default 1,
  pages_per_sheet integer default 1, -- 1, 2, 4
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS POLICIES
alter table public.profiles enable row level security;
alter table public.shops enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Profiles: Public read, Self update
create policy "Public profiles are viewable by everyone." on public.profiles for select using (true);
create policy "Users can insert their own profile." on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on public.profiles for update using (auth.uid() = id);

-- Shops: Public read, Admin write (simplified: currently manual insert or by owner)
create policy "Shops are viewable by everyone." on public.shops for select using (true);

-- Orders: Users see their own, Shop owners see orders for their shop
create policy "Users can view own orders." on public.orders for select using (auth.uid() = user_id);
create policy "Users can create orders." on public.orders for insert with check (auth.uid() = user_id);

-- Order Items: Same as orders
create policy "Users can view own order items." on public.order_items for select using (
  exists ( select 1 from public.orders where orders.id = order_items.order_id and orders.user_id = auth.uid() )
);
create policy "Users can create order items." on public.order_items for insert with check (
  exists ( select 1 from public.orders where orders.id = order_items.order_id and orders.user_id = auth.uid() )
);

-- BUCKETS (Storage)
insert into storage.buckets (id, name, public) values ('documents', 'documents', false) on conflict (id) do nothing;

-- Storage Policies
create policy "Authenticated users can upload documents." on storage.objects for insert to authenticated with check ( bucket_id = 'documents' );
create policy "Users can view own documents." on storage.objects for select to authenticated using ( bucket_id = 'documents' and auth.uid() = owner );
