-- EMERGENCY FIX: REMOVE SIGNUP TRIGGER
-- Run this in Supabase SQL Editor to stop the "Database error"

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- We will handle profile creation on the client side or via a different method
-- to ensure signups are not blocked.
