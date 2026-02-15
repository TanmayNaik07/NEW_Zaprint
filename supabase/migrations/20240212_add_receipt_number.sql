
-- Add receipt_number to orders table
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS receipt_number text;

-- Create a function to generate a unique receipt number
CREATE OR REPLACE FUNCTION generate_receipt_number()
RETURNS TRIGGER AS $$
DECLARE
  new_receipt_number text;
  exists_count int;
BEGIN
  LOOP
    -- Generate a random string of 8 characters (uppercase letters and numbers)
    new_receipt_number := upper(substring(md5(random()::text) from 1 for 8));
    
    -- Check if it exists
    SELECT count(*) INTO exists_count FROM public.orders WHERE receipt_number = new_receipt_number;
    
    -- If unique, modify the new record and exit loop
    IF exists_count = 0 THEN
      NEW.receipt_number := new_receipt_number;
      EXIT;
    END IF;
  END LOOP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically set receipt_number on insert
DROP TRIGGER IF EXISTS set_receipt_number ON public.orders;

CREATE TRIGGER set_receipt_number
BEFORE INSERT ON public.orders
FOR EACH ROW
WHEN (NEW.receipt_number IS NULL)
EXECUTE FUNCTION generate_receipt_number();

-- Backfill existing orders with receipt numbers
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN SELECT id FROM public.orders WHERE receipt_number IS NULL LOOP
    UPDATE public.orders
    SET receipt_number = upper(substring(md5(random()::text) from 1 for 8))
    WHERE id = r.id;
  END LOOP;
END $$;
