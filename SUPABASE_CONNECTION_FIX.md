# 🔴 Supabase Connection Error - URGENT FIX

## Problem
You're getting "Failed to fetch" error when trying to sign up. This means your app can't connect to Supabase.

## Root Cause
Your `.env` file has **incorrect Supabase credentials**. The `NEXT_PUBLIC_SUPABASE_ANON_KEY` format is wrong.

## Current (WRONG) `.env`:
```
NEXT_PUBLIC_SUPABASE_URL=https://mrqsiucmkonrfmikecxm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_ANe0mP7x-nWbn0lh7VShDg_1-m5O8Gy
```

❌ The anon key format `sb_publishable_...` is **incorrect**

## How to Fix

### Step 1: Get Correct Credentials

1. Go to your **Supabase Dashboard**: https://supabase.com/dashboard
2. Select your project: `mrqsiucmkonrfmikecxm`
3. Click **Settings** (gear icon in sidebar)
4. Click **API** in the settings menu
5. Find the **Project API keys** section

### Step 2: Copy the Correct Keys

You need TWO keys:

1. **Project URL** - Should look like: `https://mrqsiucmkonrfmikecxm.supabase.co`
2. **anon public** key - This is a **LONG JWT token** (looks like: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

⚠️ **IMPORTANT**: The anon key should be a very long string (hundreds of characters), NOT `sb_publishable_...`

### Step 3: Update Your `.env` File

Replace the contents of `.env` with:

```env
NEXT_PUBLIC_SUPABASE_URL=https://mrqsiucmkonrfmikecxm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<paste your actual anon public key here>
```

### Step 4: Restart Dev Server

After updating `.env`:
1. Stop the dev server (`Ctrl+C` in terminal)
2. Run `npm run dev` again
3. Try signing up again

## What the Anon Key Should Look Like

✅ **Correct format**: 
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ycXNpdWNta29ucmZtaWtlY3htIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODk1MjM0NTYsImV4cCI6MjAwNTA5OTQ1Nn0.xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
(This is just an example - yours will be different)

❌ **Wrong format**: 
```
sb_publishable_ANe0mP7x-nWbn0lh7VShDg_1-m5O8Gy
```

## After Fixing

Once you have the correct credentials:
1. ✅ Signup should work
2. ✅ Login should work
3. ✅ Database queries should work
4. ✅ No more "Failed to fetch" errors

---

**Need help finding the keys?** Check the Supabase dashboard under Settings → API
