# 🔧 Quick Fix for Console Errors

## Problem
You're seeing these errors in the console:
- ❌ `Error fetching shops: {}`
- ❌ `Error fetching orders: {}`

## Solution
These errors are caused by **RLS (Row Level Security) policies** blocking access to the `shops` and `orders` tables.

## Fix Steps

### 1. Run Profile Migration (if not done already)
Open Supabase Dashboard → SQL Editor → Run [`migration.sql`](file:///c:/Users/rushi/Desktop/NEW_Zaprint/supabase/migration.sql)

### 2. Run RLS Fix Script ⚡
Open Supabase Dashboard → SQL Editor → Run [`fix_rls_policies.sql`](file:///c:/Users/rushi/Desktop/NEW_Zaprint/supabase/fix_rls_policies.sql)

## What the Fix Does

✅ **Shops Table**
- Allows everyone (even unauthenticated users) to view shops
- Fixes "Error fetching shops"

✅ **Orders Table**  
- Allows authenticated users to view their own orders
- Allows users to create orders
- Fixes "Error fetching orders"

✅ **Order Items Table**
- Proper policies for viewing/creating order items

## After Running

1. Refresh your app (hard refresh: `Ctrl+Shift+R`)
2. Check console - errors should be gone
3. Shops page should load
4. Orders page should work

---

**Full documentation**: See [`MIGRATION_GUIDE.md`](file:///c:/Users/rushi/Desktop/NEW_Zaprint/MIGRATION_GUIDE.md)
