
-- Create a table for parking space listings
CREATE TABLE public.parking_spaces (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  space_name TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  price_per_hour DECIMAL(10,2) NOT NULL,
  capacity INTEGER NOT NULL,
  amenities TEXT[] DEFAULT '{}',
  vehicle_types TEXT[] DEFAULT '{}',
  contact_phone TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  additional_charges TEXT,
  image_urls TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.parking_spaces ENABLE ROW LEVEL SECURITY;

-- Policy for users to view all active parking spaces (for search functionality)
CREATE POLICY "Anyone can view active parking spaces" 
  ON public.parking_spaces 
  FOR SELECT 
  USING (is_active = true);

-- Policy for users to insert their own parking spaces
CREATE POLICY "Users can create their own parking spaces" 
  ON public.parking_spaces 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Policy for users to update their own parking spaces
CREATE POLICY "Users can update their own parking spaces" 
  ON public.parking_spaces 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Policy for users to delete their own parking spaces
CREATE POLICY "Users can delete their own parking spaces" 
  ON public.parking_spaces 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create an index for faster location-based searches
CREATE INDEX idx_parking_spaces_location ON public.parking_spaces USING gin(to_tsvector('english', location));

-- Create an index for active spaces
CREATE INDEX idx_parking_spaces_active ON public.parking_spaces (is_active);
