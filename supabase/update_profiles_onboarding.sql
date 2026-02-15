-- Add structured address columns to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS flat_no text,
ADD COLUMN IF NOT EXISTS area text,
ADD COLUMN IF NOT EXISTS town text,
ADD COLUMN IF NOT EXISTS city text,
ADD COLUMN IF NOT EXISTS state text,
ADD COLUMN IF NOT EXISTS pincode text;

-- Make existing address/phone nullable if they aren't already (for transitional period)
ALTER TABLE public.profiles ALTER COLUMN address DROP NOT NULL;
ALTER TABLE public.profiles ALTER COLUMN phone_number DROP NOT NULL;

-- Update the handle_new_user function to ONLY set basic info
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    new.id,
    new.email,
    COALESCE(NULLIF(new.raw_user_meta_data->>'name', ''), 'New User'),
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
