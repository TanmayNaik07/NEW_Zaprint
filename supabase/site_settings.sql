
-- Site Settings Table for dynamic content
create table if not exists public.site_settings (
  id uuid default uuid_generate_v4() primary key,
  key text unique not null,
  value jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS
alter table public.site_settings enable row level security;
create policy "Site settings are viewable by everyone." on public.site_settings for select using (true);

-- Only allow admins to modify site settings
-- Using the admin email check
create policy "Only admins can update site settings." on public.site_settings 
for all using (
  auth.jwt() ->> 'email' = 'zaprint.official@gmail.com'
) with check (
  auth.jwt() ->> 'email' = 'zaprint.official@gmail.com'
);

-- Insert default values if they don't exist
insert into public.site_settings (key, value) values 
('contact_emails', '["zaprint.official@gmail.com"]'::jsonb),
('terms_of_service', '[]'::jsonb),
('privacy_policy', '[]'::jsonb),
('about_content', '{}'::jsonb)
on conflict (key) do nothing;
