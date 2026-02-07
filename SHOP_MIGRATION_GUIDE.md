# Shop Schema Migration Guide

## Overview

This guide explains how to migrate from the old single-table shop schema to the new 4-table schema.

## What Changed

### Old Schema
- Single `shops` table with fields: `name`, `address`, `is_open`, `price_bw_per_page`, `price_color_per_page`

### New Schema
- **4 tables** with proper relationships:
  1. `shops` - Core shop info with operating hours and status
  2. `shop_services` - Service offerings with pricing
  3. `shop_resources` - Available resources (paper types, etc.)
  4. `shop_printers` - Printer information with status tracking

## Migration Steps

### 1. Run Database Migration

1. Open your Supabase project: https://supabase.com/dashboard/project/mrqsiucmkonrfmikecxm/sql
2. Copy the contents of `supabase/new_shop_schema.sql`
3. Paste into the SQL Editor
4. Click "Run"

> **⚠️ WARNING**: This will drop the existing `shops` table and create new tables. Make sure to backup any existing data first!

### 2. Verify Tables Created

Run this query to verify:

```sql
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
```

You should see at least one test shop with services, resources, and printers.

### 3. Test the Application

1. Navigate to `/dashboard/shops`
2. Verify shops display with:
   - Operating hours
   - Service pricing (B&W, Color, etc.)
   - Printer status
   - Open/Closed badge based on time
3. Click on a shop to view details
4. Test the print order flow

## Adding New Shops

To add a new shop with services:

```sql
-- 1. Insert shop
INSERT INTO shops (owner_id, shop_name, phone, location, description, start_time, end_time, status, is_onboarded)
VALUES (
  '<user_id>',
  'My Print Shop',
  '+1-555-1234',
  '456 Market St',
  'Quality printing services',
  '08:00:00',
  '20:00:00',
  'open',
  true
) RETURNING id;

-- 2. Add services (replace <shop_id> with the ID from step 1)
INSERT INTO shop_services (shop_id, service_name, price) VALUES
  ('<shop_id>', 'B&W Print', 0.10),
  ('<shop_id>', 'Color Print', 0.50),
  ('<shop_id>', 'Binding', 2.00);

-- 3. Add resources
INSERT INTO shop_resources (shop_id, resource_name) VALUES
  ('<shop_id>', 'A4 Paper'),
  ('<shop_id>', 'Letter Paper');

-- 4. Add printers
INSERT INTO shop_printers (shop_id, printer_name, printer_type, supported_services, supported_sizes, status)
VALUES
  ('<shop_id>', 'HP LaserJet', 'Laser', ARRAY['B&W Print'], ARRAY['A4', 'Letter'], 'online');
```

## Troubleshooting

### Shops not showing
- Check RLS policies are enabled
- Verify `is_onboarded = true`
- Check browser console for errors

### Services not displaying
- Verify services exist in `shop_services` table
- Check the shop_id foreign key matches

### "No services available" in order form
- Add at least one service to the shop
- Refresh the page

## Code Changes Summary

### Updated Files
1. `lib/types/shop.ts` - New TypeScript types
2. `components/shop-card.tsx` - Uses new schema
3. `app/dashboard/shops/page.tsx` - Fetches with joins
4. `app/dashboard/shops/[id]/print/page.tsx` - Displays services
5. `components/order-form.tsx` - Service-based pricing

### Key Features
- **Dynamic service selection** - Services are loaded from database
- **Time-based open/closed** - Checks operating hours and non-working days
- **Printer status tracking** - Shows online/offline printers
- **Flexible pricing** - Each service has its own price
