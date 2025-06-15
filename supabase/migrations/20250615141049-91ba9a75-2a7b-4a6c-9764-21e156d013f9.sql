
-- Add new columns to parking_spaces table for vehicle counts and precise location
ALTER TABLE public.parking_spaces 
ADD COLUMN vehicle_counts JSONB DEFAULT '{}',
ADD COLUMN precise_location TEXT,
ADD COLUMN latitude DECIMAL(10, 8),
ADD COLUMN longitude DECIMAL(11, 8);

-- Update the existing records to have empty vehicle_counts
UPDATE public.parking_spaces 
SET vehicle_counts = '{}' 
WHERE vehicle_counts IS NULL;
