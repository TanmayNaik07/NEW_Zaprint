# Database Migration Guide

## ⚠️ Important: Run Scripts in Order

If you're seeing "Error fetching shops" or "Error fetching orders" errors, you need to run **both** SQL scripts:

1. **First**: Run [`migration.sql`](file:///c:/Users/rushi/Desktop/NEW_Zaprint/supabase/migration.sql) (profile setup)
2. **Then**: Run [`fix_rls_policies.sql`](file:///c:/Users/rushi/Desktop/NEW_Zaprint/supabase/fix_rls_policies.sql) (fix RLS errors)

---

## Step 1: Run the Profile Migration Script

1. Go to your **Supabase Dashboard**
2. Navigate to **SQL Editor** (left sidebar)
3. Click **New Query**
4. Copy and paste the contents of [`migration.sql`](file:///c:/Users/rushi/Desktop/NEW_Zaprint/supabase/migration.sql)
5. Click **Run** or press `Ctrl+Enter`

### Step 2: Fix RLS Policies (Important!)

1. Stay in **SQL Editor**
2. Click **New Query**
3. Copy and paste the contents of [`fix_rls_policies.sql`](file:///c:/Users/rushi/Desktop/NEW_Zaprint/supabase/fix_rls_policies.sql)
4. Click **Run** or press `Ctrl+Enter`

This fixes the "Error fetching shops" and "Error fetching orders" console errors.

---

## What These Migrations Do

✅ **Fixes Profile Creation**
- Updates the trigger function to handle email verification
- Adds `ON CONFLICT` handling to prevent duplicate errors
- Ensures profiles are created even after email verification
- Sets default role to `'customer'` (users who order prints)

✅ **Updates RLS Policies**
- Authenticated users can view all profiles (needed for displaying user info in orders)
- Users can only insert/update their own profile
- More secure than public access

✅ **Backfills Existing Users**
- Creates profiles for any existing auth users who don't have one
- Useful if you already have test accounts

### Profile Table Schema

```sql
- id: uuid (references auth.users)
- email: text
- name: text (user's full name)
- role: text ('customer' or 'shop')
- created_at: timestamp
```

### Step 2: Test the Flow

1. **Sign up** with a new email
2. **Check your email** for verification link
3. **Click the verification link**
4. **Log in** to the app
5. **Verify** your profile was created (check Supabase → Table Editor → profiles)

### Verification

After running the migration, you should see:
- ✅ Trigger function `handle_new_user()` exists
- ✅ Trigger `on_auth_user_created` is active
- ✅ RLS policies updated on `profiles` table
- ✅ Any existing users now have profiles

### Troubleshooting

**If profiles still aren't created:**
1. Check Supabase logs: Dashboard → Logs → Postgres Logs
2. Verify the trigger exists: SQL Editor → run `SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';`
3. Check for errors in the function

**If you get RLS policy errors:**
- The migration drops and recreates policies, so this should be fixed
- Verify RLS is enabled: `SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'profiles';`

## Changes Made

### Files Updated
- ✅ [`supabase/schema.sql`](file:///c:/Users/rushi/Desktop/NEW_Zaprint/supabase/schema.sql) - Updated trigger and RLS policies
- ✅ [`app/dashboard/orders/page.tsx`](file:///c:/Users/rushi/Desktop/NEW_Zaprint/app/dashboard/orders/page.tsx) - Changed empty state to "No orders yet"

### New File
- ✅ [`supabase/migration.sql`](file:///c:/Users/rushi/Desktop/NEW_Zaprint/supabase/migration.sql) - Complete migration script to run
