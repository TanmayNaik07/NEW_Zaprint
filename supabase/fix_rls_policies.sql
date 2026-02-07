-- Fix RLS Policies for Shops and Orders
-- Run this AFTER running the main migration.sql
-- This fixes the "Error fetching shops" and "Error fetching orders" issues

-- ============================================
-- SHOPS TABLE RLS POLICIES
-- ============================================

-- Drop existing shop policies
DROP POLICY IF EXISTS "Shops are viewable by everyone." ON public.shops;

-- Allow anyone (authenticated or not) to view shops
CREATE POLICY "Shops are viewable by everyone"
  ON public.shops
  FOR SELECT
  USING (true);

-- ============================================
-- ORDERS TABLE RLS POLICIES
-- ============================================

-- Drop existing order policies
DROP POLICY IF EXISTS "Users can view own orders." ON public.orders;
DROP POLICY IF EXISTS "Users can create orders." ON public.orders;

-- Allow users to view their own orders
CREATE POLICY "Users can view own orders"
  ON public.orders
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow users to create their own orders
CREATE POLICY "Users can create orders"
  ON public.orders
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- ORDER ITEMS TABLE RLS POLICIES
-- ============================================

-- Drop existing order item policies
DROP POLICY IF EXISTS "Users can view own order items." ON public.order_items;
DROP POLICY IF EXISTS "Users can create order items." ON public.order_items;

-- Allow users to view order items for their own orders
CREATE POLICY "Users can view own order items"
  ON public.order_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- Allow users to create order items for their own orders
CREATE POLICY "Users can create order items"
  ON public.order_items
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- Verify RLS is enabled on all tables
ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Success message
SELECT 'RLS policies fixed! Shops and orders should now be accessible.' AS status;
