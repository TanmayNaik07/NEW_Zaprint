-- Force refresh the realtime publication configuration
begin;
  -- Remove and re-add orders to the publication to clear any stale state
  alter publication supabase_realtime drop table orders;
  alter publication supabase_realtime add table orders;
  
  -- Set Replica Identity to Full to ensure we get the full old record on updates (good for debugging)
  alter table orders replica identity full;
commit;

-- Build a test diagnostic helper to see if we can trigger an event manually?
-- (Not possible via SQL directly to force a websocket push, but the above should reset it)
