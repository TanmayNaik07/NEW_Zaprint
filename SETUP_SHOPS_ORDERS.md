# Quick Setup: Shops and Orders

## Step 1: Update Shops Schema

Run this in Supabase SQL Editor:

```bash
File: supabase/update_shops_schema.sql
```

This will:
- Create the 4-table shop structure (shops, shop_services, shop_resources, shop_printers)
- Add RLS policies
- Insert 1 sample shop with services

## Step 2: Update Orders Schema

Run this in Supabase SQL Editor:

```bash
File: supabase/orders_schema.sql
```

This will:
- Create orders and order_items tables
- Add proper RLS policies for users and shop owners
- Fix the "Error fetching orders" issue

## Step 3: Verify

1. Go to `/dashboard/shops` - You should see "QuickPrint Downtown"
2. Go to `/dashboard/orders` - Error should be gone (will show "No orders yet")
3. Try placing a test order

## What's Fixed

### Shops
- ✅ 4-table structure as per shop-prompt.md
- ✅ Sample data included
- ✅ RLS policies for authenticated users

### Orders
- ✅ Proper foreign key to auth.users
- ✅ RLS policies allow users to see their own orders
- ✅ Shop owners can see orders for their shops
- ✅ Indexes for performance

## Adding More Shops

See the SQL at the bottom of `update_shops_schema.sql` for examples.
