-- Comprehensive index migration for performance optimization
-- Note: CONCURRENTLY removed as it cannot run inside a transaction block (typical in SQL editors)

-- Drop existing indexes if they exist to avoid conflicts
DROP INDEX IF EXISTS idx_orders_user_created;
DROP INDEX IF EXISTS idx_orders_user_id;
DROP INDEX IF EXISTS idx_orders_shop_id;
DROP INDEX IF EXISTS idx_orders_status;
DROP INDEX IF EXISTS idx_orders_created_at;
DROP INDEX IF EXISTS idx_order_items_order_id;

-- Create optimized indexes for orders table
-- Composite index for the most common query pattern (filtering by user + sorting by date)
CREATE INDEX IF NOT EXISTS idx_orders_user_created 
ON public.orders (user_id, created_at DESC);

-- Individual indexes for other common queries
CREATE INDEX IF NOT EXISTS idx_orders_shop_id 
ON public.orders (shop_id);

CREATE INDEX IF NOT EXISTS idx_orders_status 
ON public.orders (status);

-- Index for order_items lookups
CREATE INDEX IF NOT EXISTS idx_order_items_order_id 
ON public.order_items (order_id);

-- Analyze tables to update statistics
ANALYZE public.orders;
ANALYZE public.order_items;
