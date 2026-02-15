-- Add full_name column if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS full_name text;

-- Optional: copy data from 'name' if it exists and full_name is empty
-- DO $$
-- BEGIN
--     IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'name') THEN
--         UPDATE public.profiles SET full_name = name WHERE full_name IS NULL;
--     END IF;
-- END $$;
