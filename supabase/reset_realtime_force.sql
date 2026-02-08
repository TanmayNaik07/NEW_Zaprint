-- Forcefully reset Realtime for orders
begin;
  -- Remove table from publication
  alter publication supabase_realtime drop table orders;
  
  -- Re-add table to publication
  alter publication supabase_realtime add table orders;
  
  -- Ensure Replica Identity is FULL (records all columns on update)
  alter table orders replica identity full;
  
  -- Verify RLS is enabled
  alter table orders enable row level security;
  
  -- Verify Policies exist (just a check select)
  select count(*) from pg_policies where tablename = 'orders';
commit;
