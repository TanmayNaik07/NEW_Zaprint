-- RUN THIS ENTIRE FILE IN SUPABASE SQL EDITOR NOW
-- This will create the 4-table shop structure and add sample data

-- Get your user ID first
DO $$
DECLARE
  my_user_id uuid;
  shop_id uuid;
BEGIN
  -- Get the first user (or you can replace with your actual user ID)
  SELECT id INTO my_user_id FROM auth.users LIMIT 1;
  
  IF my_user_id IS NULL THEN
    RAISE EXCEPTION 'No users found. Please sign up first.';
  END IF;
  
  RAISE NOTICE 'Using user ID: %', my_user_id;
  
  -- Insert a test shop
  INSERT INTO shops (owner_id, shop_name, phone, location, description, start_time, end_time, status, is_onboarded)
  VALUES (
    my_user_id,
    'QuickPrint Downtown',
    '+1-555-0123',
    '123 Main St, Downtown',
    'Fast and reliable printing services',
    '09:00:00',
    '18:00:00',
    'open',
    true
  )
  RETURNING id INTO shop_id;
  
  RAISE NOTICE 'Created shop with ID: %', shop_id;
  
  -- Insert services for the shop
  INSERT INTO shop_services (shop_id, service_name, price) VALUES
    (shop_id, 'B&W Print', 0.10),
    (shop_id, 'Color Print', 0.50),
    (shop_id, 'Binding', 2.00),
    (shop_id, 'Lamination', 1.50);
  
  -- Insert resources
  INSERT INTO shop_resources (shop_id, resource_name) VALUES
    (shop_id, 'A4 Paper'),
    (shop_id, 'Letter Paper'),
    (shop_id, 'Cardstock');
  
  -- Insert printers
  INSERT INTO shop_printers (shop_id, printer_name, printer_type, supported_services, supported_sizes, status, last_heartbeat)
  VALUES
    (shop_id, 'HP LaserJet Pro', 'Laser', ARRAY['B&W Print'], ARRAY['A4', 'Letter'], 'online', now()),
    (shop_id, 'Canon PIXMA', 'Inkjet', ARRAY['Color Print'], ARRAY['A4', 'Letter'], 'online', now());
  
  RAISE NOTICE 'Shop setup complete!';
END $$;

-- Verify
SELECT 
  s.shop_name,
  s.status,
  s.is_onboarded,
  COUNT(DISTINCT sv.id) as services_count,
  COUNT(DISTINCT sr.id) as resources_count,
  COUNT(DISTINCT sp.id) as printers_count
FROM shops s
LEFT JOIN shop_services sv ON s.id = sv.shop_id
LEFT JOIN shop_resources sr ON s.id = sr.shop_id
LEFT JOIN shop_printers sp ON s.id = sp.shop_id
GROUP BY s.id, s.shop_name, s.status, s.is_onboarded;
