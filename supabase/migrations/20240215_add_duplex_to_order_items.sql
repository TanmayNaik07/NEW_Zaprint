-- Add is_duplex field to order_items table
ALTER TABLE public.order_items 
ADD COLUMN IF NOT EXISTS is_duplex boolean DEFAULT false;

-- Add page_count field to store actual PDF page count
ALTER TABLE public.order_items 
ADD COLUMN IF NOT EXISTS page_count integer DEFAULT 1;

-- Add check constraint to ensure page_count is positive
ALTER TABLE public.order_items 
ADD CONSTRAINT order_items_page_count_check 
CHECK (page_count >= 1);
