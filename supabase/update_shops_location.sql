-- Add structured location columns to shops table
ALTER TABLE public.shops
ADD COLUMN IF NOT EXISTS city text,
ADD COLUMN IF NOT EXISTS pincode text;

-- Update existing shops with dummy data if needed (optional)
-- UPDATE public.shops SET city = 'Mumbai', pincode = '400050' WHERE city IS NULL;
