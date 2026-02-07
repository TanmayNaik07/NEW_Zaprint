-- FIX RLS POLICIES TO ALLOW PUBLIC READ
-- Run this in Supabase SQL Editor

-- 1. Drop existing restrictive policies
DROP POLICY IF EXISTS "Shops are viewable by authenticated users" ON public.shops;
DROP POLICY IF EXISTS "Shop services are viewable by authenticated users" ON public.shop_services;
DROP POLICY IF EXISTS "Shop resources are viewable by authenticated users" ON public.shop_resources;
DROP POLICY IF EXISTS "Shop printers are viewable by authenticated users" ON public.shop_printers;

-- 2. Create PUBLIC read policies (allow anon access)
CREATE POLICY "Shops are viewable by everyone"
  ON public.shops
  FOR SELECT
  USING (true);

CREATE POLICY "Shop services are viewable by everyone"
  ON public.shop_services
  FOR SELECT
  USING (true);

CREATE POLICY "Shop resources are viewable by everyone"
  ON public.shop_resources
  FOR SELECT
  USING (true);

CREATE POLICY "Shop printers are viewable by everyone"
  ON public.shop_printers
  FOR SELECT
  USING (true);

-- 3. Verify
SELECT count(*) as shop_count FROM shops;
