
-- Add available_spaces column to track current availability
ALTER TABLE public.parking_spaces 
ADD COLUMN available_spaces INTEGER DEFAULT NULL;

-- Update existing records to set available_spaces equal to capacity by default
UPDATE public.parking_spaces 
SET available_spaces = capacity 
WHERE available_spaces IS NULL;

-- Add constraint to ensure available_spaces doesn't exceed capacity
ALTER TABLE public.parking_spaces 
ADD CONSTRAINT check_available_spaces_valid 
CHECK (available_spaces >= 0 AND available_spaces <= capacity);
