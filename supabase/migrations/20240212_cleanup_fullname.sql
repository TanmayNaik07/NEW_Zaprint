
-- Drop full_name column if it exists to clean up
ALTER TABLE public.profiles 
DROP COLUMN IF EXISTS full_name;

-- Ensure name column exists (it should based on schema provided, but for safety)
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS name text;
