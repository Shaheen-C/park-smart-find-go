
-- Create a table for parking space reviews and ratings
CREATE TABLE public.parking_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  parking_space_id UUID REFERENCES public.parking_spaces(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, parking_space_id) -- Prevent duplicate reviews from same user
);

-- Add RLS policies for reviews
ALTER TABLE public.parking_reviews ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view all reviews (public)
CREATE POLICY "Anyone can view reviews" 
  ON public.parking_reviews 
  FOR SELECT 
  USING (true);

-- Policy: Authenticated users can create reviews
CREATE POLICY "Authenticated users can create reviews" 
  ON public.parking_reviews 
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own reviews
CREATE POLICY "Users can update their own reviews" 
  ON public.parking_reviews 
  FOR UPDATE 
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own reviews
CREATE POLICY "Users can delete their own reviews" 
  ON public.parking_reviews 
  FOR DELETE 
  TO authenticated
  USING (auth.uid() = user_id);

-- Add columns to parking_spaces for aggregated rating data
ALTER TABLE public.parking_spaces 
ADD COLUMN average_rating NUMERIC(3,2) DEFAULT 0,
ADD COLUMN total_reviews INTEGER DEFAULT 0;

-- Create function to update parking space rating statistics
CREATE OR REPLACE FUNCTION update_parking_space_rating_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the parking space statistics
  UPDATE public.parking_spaces 
  SET 
    average_rating = (
      SELECT COALESCE(AVG(rating::NUMERIC), 0)
      FROM public.parking_reviews 
      WHERE parking_space_id = COALESCE(NEW.parking_space_id, OLD.parking_space_id)
    ),
    total_reviews = (
      SELECT COUNT(*)
      FROM public.parking_reviews 
      WHERE parking_space_id = COALESCE(NEW.parking_space_id, OLD.parking_space_id)
    )
  WHERE id = COALESCE(NEW.parking_space_id, OLD.parking_space_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update rating stats
CREATE TRIGGER update_parking_rating_stats_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.parking_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_parking_space_rating_stats();

-- Create admin users table for admin access control
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN DEFAULT true
);

-- Add RLS for admin users table
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Only allow admins to view admin users (bootstrapped manually)
CREATE POLICY "Only admins can view admin users" 
  ON public.admin_users 
  FOR ALL 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE user_id = auth.uid() AND is_active = true
    )
  );
