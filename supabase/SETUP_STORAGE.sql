-- STORAGE SETUP (SAFE VERSION)
-- Run this in Supabase SQL Editor

-- 1. Create the 'documents' bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents', 
  'documents', 
  false, 
  10485760, -- 10MB limit
  ARRAY['image/png', 'image/jpeg', 'image/webp', 'application/pdf']
)
ON CONFLICT (id) DO UPDATE SET 
  public = false,
  allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/webp', 'application/pdf'];

-- SKIPPING ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY; 
-- (It is already enabled by default on Supabase storage)

-- 2. Create Policies

-- Allow authenticated users to upload documents
DROP POLICY IF EXISTS "Authenticated users can upload documents" ON storage.objects;
CREATE POLICY "Authenticated users can upload documents"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'documents');

-- Allow users to view their own uploaded files
DROP POLICY IF EXISTS "Users can view own documents" ON storage.objects;
CREATE POLICY "Users can view own documents"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'documents' AND auth.uid() = owner);

-- Allow authenticated users to view all documents in this bucket (for simplicity)
DROP POLICY IF EXISTS "Authenticated users can view documents" ON storage.objects;
CREATE POLICY "Authenticated users can view documents"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'documents');

-- Verify
SELECT * FROM storage.buckets WHERE id = 'documents';
