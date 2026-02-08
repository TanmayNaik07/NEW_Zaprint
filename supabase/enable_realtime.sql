-- Enable realtime for the orders table
begin;
  -- Check if the publication exists, if not create it (standard supabase setup usually has it)
  -- This part is usually implicit but ensuring the table is added is key.
  
  -- Add orders table to the supabase_realtime publication
  alter publication supabase_realtime add table orders;
  
  -- Ensure RLS allows the necessary operations (already seemingly done but good to verify)
  -- The user must be able to SELECT their own rows for realtime to send them.
commit;
