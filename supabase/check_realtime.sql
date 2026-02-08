-- Check if orders table is in the publication
select * from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'orders';

-- Check RLS policies on orders
select * from pg_policies where tablename = 'orders';
