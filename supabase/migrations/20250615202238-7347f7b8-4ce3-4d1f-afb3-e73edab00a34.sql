
-- Add a cancelled_at column to track when reservations were cancelled
ALTER TABLE public.parking_reservations 
ADD COLUMN cancelled_at TIMESTAMP WITH TIME ZONE;

-- Update the reservation_status check constraint to include 'cancelled'
ALTER TABLE public.parking_reservations 
DROP CONSTRAINT IF EXISTS parking_reservations_reservation_status_check;

ALTER TABLE public.parking_reservations 
ADD CONSTRAINT parking_reservations_reservation_status_check 
CHECK (reservation_status IN ('pending', 'confirmed', 'cancelled', 'completed'));

-- Create an index for better performance on cancelled reservations
CREATE INDEX idx_parking_reservations_cancelled_at ON public.parking_reservations (cancelled_at);
