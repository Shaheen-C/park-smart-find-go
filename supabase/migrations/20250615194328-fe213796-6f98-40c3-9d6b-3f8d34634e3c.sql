
-- Add payment tracking columns to parking_reservations table
ALTER TABLE public.parking_reservations 
ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT,
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'processing', 'succeeded', 'failed', 'cancelled'));

-- Update existing records to have proper payment status
UPDATE public.parking_reservations 
SET payment_status = 'pending' 
WHERE payment_status IS NULL;
