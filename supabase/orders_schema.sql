-- Orders Table Schema and RLS Policies
-- Run this in Supabase SQL Editor

-- ============================================
-- DROP EXISTING ORDERS TABLES (if needed to recreate)
-- ============================================

DROP TABLE IF EXISTS public.order_items CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TYPE IF EXISTS order_status CASCADE;

-- ============================================
-- CREATE ORDER STATUS ENUM
-- ============================================

CREATE TYPE order_status AS ENUM ('pending', 'processing', 'printing', 'completed', 'cancelled');

-- ============================================
-- CREATE ORDERS TABLE
-- ============================================

CREATE TABLE public.orders (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  shop_id uuid NOT NULL,
  status order_status NOT NULL DEFAULT 'pending',
  total_amount numeric(10, 2) NOT NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT orders_pkey PRIMARY KEY (id),
  CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE,
  CONSTRAINT orders_shop_id_fkey FOREIGN KEY (shop_id) REFERENCES shops (id) ON DELETE CASCADE
) TABLESPACE pg_default;

-- ============================================
-- CREATE ORDER ITEMS TABLE
-- ============================================

CREATE TABLE public.order_items (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL,
  file_url text NOT NULL,
  file_name text NOT NULL,
  file_type text NULL,
  color_mode text NULL,
  copies integer NOT NULL DEFAULT 1,
  pages_per_sheet integer NOT NULL DEFAULT 1,
  created_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT order_items_pkey PRIMARY KEY (id),
  CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE,
  CONSTRAINT order_items_color_mode_check CHECK (color_mode = ANY (ARRAY['bw'::text, 'color'::text])),
  CONSTRAINT order_items_copies_check CHECK (copies >= 1),
  CONSTRAINT order_items_pages_per_sheet_check CHECK (pages_per_sheet = ANY (ARRAY[1, 2, 4]))
) TABLESPACE pg_default;

-- ============================================
-- CREATE INDEXES
-- ============================================

CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_shop_id ON public.orders(shop_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);

-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- ============================================
-- CREATE RLS POLICIES FOR ORDERS
-- ============================================

-- Users can view their own orders
CREATE POLICY "Users can view own orders"
  ON public.orders
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can create their own orders
CREATE POLICY "Users can create orders"
  ON public.orders
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own orders (e.g., cancel)
CREATE POLICY "Users can update own orders"
  ON public.orders
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Shop owners can view orders for their shops
CREATE POLICY "Shop owners can view shop orders"
  ON public.orders
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM shops
      WHERE shops.id = orders.shop_id
      AND shops.owner_id = auth.uid()
    )
  );

-- Shop owners can update orders for their shops (change status)
CREATE POLICY "Shop owners can update shop orders"
  ON public.orders
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM shops
      WHERE shops.id = orders.shop_id
      AND shops.owner_id = auth.uid()
    )
  );

-- ============================================
-- CREATE RLS POLICIES FOR ORDER ITEMS
-- ============================================

-- Users can view items for their own orders
CREATE POLICY "Users can view own order items"
  ON public.order_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Users can create items for their own orders
CREATE POLICY "Users can create order items"
  ON public.order_items
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Shop owners can view items for their shop orders
CREATE POLICY "Shop owners can view shop order items"
  ON public.order_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      JOIN shops ON shops.id = orders.shop_id
      WHERE orders.id = order_items.order_id
      AND shops.owner_id = auth.uid()
    )
  );

-- ============================================
-- VERIFICATION
-- ============================================

SELECT 'Orders schema created successfully!' AS status;

-- Test query to verify structure
SELECT 
  table_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name IN ('orders', 'order_items')
ORDER BY table_name, ordinal_position;
