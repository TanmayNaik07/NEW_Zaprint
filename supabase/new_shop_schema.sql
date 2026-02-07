-- New Shop Schema Migration
-- This replaces the old shops table with a new 4-table structure
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/mrqsiucmkonrfmikecxm/sql

-- ============================================
-- DROP OLD SCHEMA (if exists)
-- ============================================

-- Drop old policies first
DROP POLICY IF EXISTS "Shops are viewable by everyone." ON public.shops;
DROP POLICY IF EXISTS "Shops are viewable by everyone" ON public.shops;

-- Drop old table (this will cascade to related tables)
DROP TABLE IF EXISTS public.shops CASCADE;

-- ============================================
-- CREATE NEW TABLES
-- ============================================

-- 1. SHOPS TABLE
CREATE TABLE public.shops (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  shop_name text NOT NULL,
  phone text NOT NULL,
  location text NOT NULL,
  description text NULL,
  image_url text NULL,
  start_time time without time zone NOT NULL,
  end_time time without time zone NOT NULL,
  non_working_days text[] NULL DEFAULT '{}'::text[],
  status text NOT NULL DEFAULT 'closed'::text,
  is_onboarded boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT shops_pkey PRIMARY KEY (id),
  CONSTRAINT shops_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES auth.users (id) ON DELETE CASCADE,
  CONSTRAINT shops_status_check CHECK (
    status = ANY (ARRAY['open'::text, 'closed'::text, 'error'::text])
  )
) TABLESPACE pg_default;

-- 2. SHOP SERVICES TABLE
CREATE TABLE public.shop_services (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  shop_id uuid NOT NULL,
  service_name text NOT NULL,
  price numeric(10, 2) NOT NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT shop_services_pkey PRIMARY KEY (id),
  CONSTRAINT shop_services_shop_id_service_name_key UNIQUE (shop_id, service_name),
  CONSTRAINT shop_services_shop_id_fkey FOREIGN KEY (shop_id) REFERENCES shops (id) ON DELETE CASCADE,
  CONSTRAINT shop_services_price_check CHECK (price >= 0::numeric)
) TABLESPACE pg_default;

-- 3. SHOP RESOURCES TABLE
CREATE TABLE public.shop_resources (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  shop_id uuid NOT NULL,
  resource_name text NOT NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT shop_resources_pkey PRIMARY KEY (id),
  CONSTRAINT shop_resources_shop_id_resource_name_key UNIQUE (shop_id, resource_name),
  CONSTRAINT shop_resources_shop_id_fkey FOREIGN KEY (shop_id) REFERENCES shops (id) ON DELETE CASCADE
) TABLESPACE pg_default;

-- 4. SHOP PRINTERS TABLE
CREATE TABLE public.shop_printers (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  shop_id uuid NOT NULL,
  printer_name text NOT NULL,
  printer_type text NOT NULL,
  supported_services text[] NOT NULL,
  supported_sizes text[] NOT NULL,
  status text NOT NULL DEFAULT 'offline'::text,
  last_heartbeat timestamp with time zone NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT shop_printers_pkey PRIMARY KEY (id),
  CONSTRAINT shop_printers_shop_id_fkey FOREIGN KEY (shop_id) REFERENCES shops (id) ON DELETE CASCADE,
  CONSTRAINT shop_printers_status_check CHECK (
    status = ANY (ARRAY['online'::text, 'offline'::text, 'error'::text])
  )
) TABLESPACE pg_default;

-- ============================================
-- CREATE INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX idx_shops_status ON public.shops(status);
CREATE INDEX idx_shops_is_onboarded ON public.shops(is_onboarded);
CREATE INDEX idx_shop_services_shop_id ON public.shop_services(shop_id);
CREATE INDEX idx_shop_resources_shop_id ON public.shop_resources(shop_id);
CREATE INDEX idx_shop_printers_shop_id ON public.shop_printers(shop_id);
CREATE INDEX idx_shop_printers_status ON public.shop_printers(status);

-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================

ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shop_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shop_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shop_printers ENABLE ROW LEVEL SECURITY;

-- ============================================
-- CREATE RLS POLICIES
-- ============================================

-- Shops: Viewable by authenticated users
CREATE POLICY "Shops are viewable by authenticated users"
  ON public.shops
  FOR SELECT
  TO authenticated
  USING (true);

-- Shop Services: Viewable by authenticated users
CREATE POLICY "Shop services are viewable by authenticated users"
  ON public.shop_services
  FOR SELECT
  TO authenticated
  USING (true);

-- Shop Resources: Viewable by authenticated users
CREATE POLICY "Shop resources are viewable by authenticated users"
  ON public.shop_resources
  FOR SELECT
  TO authenticated
  USING (true);

-- Shop Printers: Viewable by authenticated users
CREATE POLICY "Shop printers are viewable by authenticated users"
  ON public.shop_printers
  FOR SELECT
  TO authenticated
  USING (true);

-- ============================================
-- INSERT SAMPLE DATA FOR TESTING
-- ============================================

-- Insert a test shop (you'll need to replace the owner_id with a real user ID)
DO $$
DECLARE
  test_shop_id uuid;
  test_user_id uuid;
BEGIN
  -- Get a user ID (first user in the system)
  SELECT id INTO test_user_id FROM auth.users LIMIT 1;
  
  IF test_user_id IS NOT NULL THEN
    -- Insert test shop
    INSERT INTO public.shops (
      owner_id, shop_name, phone, location, description, 
      start_time, end_time, non_working_days, status, is_onboarded
    ) VALUES (
      test_user_id,
      'QuickPrint Downtown',
      '+1-555-0123',
      '123 Main St, Downtown',
      'Fast and reliable printing services in the heart of downtown',
      '09:00:00',
      '18:00:00',
      ARRAY['Sunday'],
      'open',
      true
    ) RETURNING id INTO test_shop_id;

    -- Insert services
    INSERT INTO public.shop_services (shop_id, service_name, price) VALUES
      (test_shop_id, 'B&W Print', 0.10),
      (test_shop_id, 'Color Print', 0.50),
      (test_shop_id, 'Binding', 2.00),
      (test_shop_id, 'Lamination', 1.50);

    -- Insert resources
    INSERT INTO public.shop_resources (shop_id, resource_name) VALUES
      (test_shop_id, 'A4 Paper'),
      (test_shop_id, 'Letter Paper'),
      (test_shop_id, 'Cardstock'),
      (test_shop_id, 'Glossy Paper');

    -- Insert printers
    INSERT INTO public.shop_printers (
      shop_id, printer_name, printer_type, 
      supported_services, supported_sizes, status, last_heartbeat
    ) VALUES
      (
        test_shop_id, 
        'HP LaserJet Pro M404dn', 
        'Laser',
        ARRAY['B&W Print'],
        ARRAY['A4', 'Letter', 'Legal'],
        'online',
        now()
      ),
      (
        test_shop_id,
        'Canon PIXMA G6020',
        'Inkjet',
        ARRAY['Color Print'],
        ARRAY['A4', 'Letter'],
        'online',
        now()
      );

    RAISE NOTICE 'Sample shop created with ID: %', test_shop_id;
  ELSE
    RAISE NOTICE 'No users found. Please create a user first.';
  END IF;
END $$;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check if tables were created
SELECT 'Tables created successfully!' AS status;

-- View sample data
SELECT 
  s.shop_name,
  s.status,
  COUNT(DISTINCT sv.id) as services_count,
  COUNT(DISTINCT sr.id) as resources_count,
  COUNT(DISTINCT sp.id) as printers_count
FROM shops s
LEFT JOIN shop_services sv ON s.id = sv.shop_id
LEFT JOIN shop_resources sr ON s.id = sr.shop_id
LEFT JOIN shop_printers sp ON s.id = sp.shop_id
GROUP BY s.id, s.shop_name, s.status;
