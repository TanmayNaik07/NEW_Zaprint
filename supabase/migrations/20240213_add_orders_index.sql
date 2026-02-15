-- Add index on user_id for faster filtering by user
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);

-- Add index on created_at for faster sorting
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- Add composite index for common query pattern (user_id + created_at)
CREATE INDEX IF NOT EXISTS idx_orders_user_created ON orders(user_id, created_at DESC);
