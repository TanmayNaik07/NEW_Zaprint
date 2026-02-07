# Quick Setup Guide

## Issue 1: Email Verification ✅ Already Implemented!

The email verification is **already coded and working**. You just need to enable it in Supabase:

### Steps to Enable Email Verification:

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard/project/mrqsiucmkonrfmikecxm
2. **Navigate to**: Authentication → Providers (left sidebar)
3. **Click on**: Email provider
4. **Scroll down** to find "Confirm email" toggle
5. **Enable** the toggle
6. **Click Save**

That's it! Now when users sign up:
- ✅ They'll receive a verification email
- ✅ They must click the link to verify
- ✅ Only then can they log in

---

## Issue 2: Shops Not Fetching - RLS Policy Fix

The shops aren't loading because the Row Level Security (RLS) policy needs to be updated.

### Quick Fix - Run This SQL:

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard/project/mrqsiucmkonrfmikecxm
2. **Navigate to**: SQL Editor (left sidebar)
3. **Click**: New Query
4. **Copy and paste** the following SQL:

```sql
-- Fix Shops RLS Policy
DROP POLICY IF EXISTS "Shops are viewable by everyone." ON public.shops;

CREATE POLICY "Shops are viewable by everyone"
  ON public.shops
  FOR SELECT
  USING (true);
```

5. **Click Run** (or press Ctrl+Enter)

### Verify It Worked:

After running the SQL, refresh your dashboard shops page. You should now see all the shops!

---

## Alternative: Run Complete RLS Fix Script

If you want to fix all RLS policies at once (shops, orders, order items), you can run the complete script:

1. Open `supabase/fix_rls_policies.sql` in your project
2. Copy the entire contents
3. Paste into Supabase SQL Editor
4. Run it

This will fix:
- ✅ Shops viewing
- ✅ Orders viewing/creation
- ✅ Order items viewing/creation

---

## Testing After Setup

### Test Email Verification:
1. Go to http://localhost:3000/signup
2. Create account with real email
3. Check email for verification link
4. Click link → should redirect to login
5. Login → access dashboard

### Test Shops Fetching:
1. Go to http://localhost:3000/dashboard/shops
2. You should see all shops from the database
3. No more "Error fetching shops" in console

---

## Summary

**For Email Verification**: Just enable the toggle in Supabase settings (takes 30 seconds)

**For Shops Fetching**: Run the SQL query above in Supabase SQL Editor (takes 1 minute)

Both issues will be resolved!
