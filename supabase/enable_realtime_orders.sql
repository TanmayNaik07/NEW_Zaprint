-- Enable Realtime for orders table
begin;
  -- Check if table is already in publication, if not add it
  -- Note: This usually requires superuser or replication role, but users can often run it in SQL Editor
  alter publication supabase_realtime add table orders;
commit;
