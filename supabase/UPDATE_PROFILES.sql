-- 1. Add columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS address text,
ADD COLUMN IF NOT EXISTS phone_number text;

-- 2. Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, address, phone_number, avatar_url)
  VALUES (
    new.id,
    new.email,
    -- Ensure full_name is at least 3 chars to satisfy constraint, or default to 'New User'
    COALESCE(NULLIF(new.raw_user_meta_data->>'name', ''), 'New User'),
    new.raw_user_meta_data->>'address',
    new.raw_user_meta_data->>'phone_number',
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Create Trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Verify
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles';
