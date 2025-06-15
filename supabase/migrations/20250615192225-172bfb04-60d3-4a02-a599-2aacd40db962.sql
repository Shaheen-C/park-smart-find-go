
-- Add columns to parking_spaces table for cash payment option
ALTER TABLE public.parking_spaces 
ADD COLUMN accepts_cash_on_arrival BOOLEAN DEFAULT false;

-- Create a table for parking reservations/bookings
CREATE TABLE public.parking_reservations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  parking_space_id UUID REFERENCES public.parking_spaces(id) NOT NULL,
  estimated_arrival_time TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_hours INTEGER NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cash_on_arrival', 'online')),
  reservation_status TEXT NOT NULL DEFAULT 'pending' CHECK (reservation_status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  contact_phone TEXT NOT NULL,
  vehicle_type TEXT NOT NULL,
  vehicle_number TEXT,
  special_instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.parking_reservations ENABLE ROW LEVEL SECURITY;

-- Policy for users to view their own reservations
CREATE POLICY "Users can view their own reservations" 
  ON public.parking_reservations 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Policy for parking space owners to view reservations for their spaces
CREATE POLICY "Owners can view reservations for their spaces" 
  ON public.parking_reservations 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.parking_spaces 
      WHERE id = parking_space_id AND user_id = auth.uid()
    )
  );

-- Policy for users to create reservations
CREATE POLICY "Users can create reservations" 
  ON public.parking_reservations 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Policy for users to update their own reservations
CREATE POLICY "Users can update their own reservations" 
  ON public.parking_reservations 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Policy for parking space owners to update reservations for their spaces
CREATE POLICY "Owners can update reservations for their spaces" 
  ON public.parking_reservations 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.parking_spaces 
      WHERE id = parking_space_id AND user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_parking_reservations_user_id ON public.parking_reservations (user_id);
CREATE INDEX idx_parking_reservations_parking_space_id ON public.parking_reservations (parking_space_id);
CREATE INDEX idx_parking_reservations_arrival_time ON public.parking_reservations (estimated_arrival_time);
