
-- Enable Realtime for shops, shop_printers, and orders tables

begin;
  -- Check if table is already in publication, if not add it
  -- We use 'drop' then 'add' to be safe or just 'add' and ignore error? 
  -- Safest is just to run the alter command, it usually doesn't fail if already added, 
  -- but if it does, it's idempotent in effect.
  
  -- Enable for shops (for open/close status)
  alter publication supabase_realtime add table shops;
  
  -- Enable for shop_printers (for online/offline status)
  alter publication supabase_realtime add table shop_printers;

  -- Enable for orders (for status updates)
  -- (Might already be enabled, but running it ensures it)
  alter publication supabase_realtime add table orders;
commit;
