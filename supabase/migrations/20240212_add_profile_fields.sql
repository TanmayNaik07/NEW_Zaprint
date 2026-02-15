
-- Add new columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone_number text,
ADD COLUMN IF NOT EXISTS flat_no text,
ADD COLUMN IF NOT EXISTS area text,
ADD COLUMN IF NOT EXISTS town text,
ADD COLUMN IF NOT EXISTS city text,
ADD COLUMN IF NOT EXISTS state text,
ADD COLUMN IF NOT EXISTS pincode text;

-- Add checking constraint for phone number length if needed, but text is fine for flexible input
-- validation should happen on application layer primarily.
