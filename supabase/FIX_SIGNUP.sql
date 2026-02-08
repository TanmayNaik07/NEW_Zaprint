-- FIX SIGNUP ISSUES
-- Run this in Supabase SQL Editor

-- 1. Ensure columns exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS address text,
ADD COLUMN IF NOT EXISTS phone_number text;

-- 2. Drop existing trigger and function to clean start
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 3. Create robust function
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger 
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, address, phone_number, avatar_url)
  VALUES (
    new.id,
    new.email,
    -- Default to 'New User' if name is missing or empty to satisfy constraint
    COALESCE(NULLIF(new.raw_user_meta_data->>'name', ''), 'New User'),
    new.raw_user_meta_data->>'address',
    new.raw_user_meta_data->>'phone_number',
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error (visible in Supabase logs)
    RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
    -- IMPORTANT: Return new so the user is still created in Auth, even if profile fails
    RETURN new;
END;
$$ LANGUAGE plpgsql;

-- 4. Re-create Trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 5. Grant permissions (just in case)
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON TABLE public.profiles TO postgres, anon, authenticated, service_role;
