-- ============================================
-- FEEDBACK / TESTIMONIALS TABLE
-- Run this in Supabase SQL Editor
-- ============================================

CREATE TABLE IF NOT EXISTS public.feedback (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  user_name text NOT NULL,
  user_role text DEFAULT '',
  rating integer NOT NULL DEFAULT 5,
  message text NOT NULL,
  is_approved boolean NOT NULL DEFAULT false,
  is_featured boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT feedback_pkey PRIMARY KEY (id),
  CONSTRAINT feedback_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE,
  CONSTRAINT feedback_rating_check CHECK (rating >= 1 AND rating <= 5),
  CONSTRAINT feedback_message_length CHECK (char_length(message) >= 10)
) TABLESPACE pg_default;

-- ============================================
-- CREATE INDEXES
-- ============================================

CREATE INDEX idx_feedback_user_id ON public.feedback(user_id);
CREATE INDEX idx_feedback_is_featured ON public.feedback(is_featured) WHERE is_featured = true;
CREATE INDEX idx_feedback_is_approved ON public.feedback(is_approved);
CREATE INDEX idx_feedback_created_at ON public.feedback(created_at DESC);

-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================

ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES FOR FEEDBACK
-- ============================================

-- Anyone can read approved/featured feedback (for landing page)
CREATE POLICY "Anyone can view featured feedback"
  ON public.feedback
  FOR SELECT
  TO anon, authenticated
  USING (is_featured = true AND is_approved = true);

-- Authenticated users can view their own feedback
CREATE POLICY "Users can view own feedback"
  ON public.feedback
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Authenticated users can submit feedback
CREATE POLICY "Users can submit feedback"
  ON public.feedback
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own feedback (edit their review)
CREATE POLICY "Users can update own feedback"
  ON public.feedback
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own feedback
CREATE POLICY "Users can delete own feedback"
  ON public.feedback
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================
-- ADMIN ACCESS POLICIES
-- We use a service role key on the server side for admin operations.
-- The admin email check is done at the application level.
-- For admin to view ALL feedback, we create a policy that allows
-- the admin email to see everything. We'll use a postgres function.
-- ============================================

-- Function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN (
    SELECT email = 'zaprint.official@gmail.com'
    FROM auth.users
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admin can view ALL feedback
CREATE POLICY "Admin can view all feedback"
  ON public.feedback
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- Admin can update any feedback (approve/feature)
CREATE POLICY "Admin can update any feedback"
  ON public.feedback
  FOR UPDATE
  TO authenticated
  USING (public.is_admin());

-- Admin can delete any feedback
CREATE POLICY "Admin can delete any feedback"
  ON public.feedback
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- ============================================
-- ADMIN POLICIES FOR OTHER TABLES
-- Allow admin to view ALL orders and shops
-- ============================================

-- Admin can view all orders
CREATE POLICY "Admin can view all orders"
  ON public.orders
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- Admin can view all order items
CREATE POLICY "Admin can view all order items"
  ON public.order_items
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- Admin can view all profiles
CREATE POLICY "Admin can view all profiles"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- ============================================
-- VERIFICATION
-- ============================================

SELECT 'Feedback schema and admin policies created successfully!' AS status;
