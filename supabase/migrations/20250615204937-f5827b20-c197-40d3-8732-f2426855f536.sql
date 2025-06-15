
-- Add proper foreign key constraint with CASCADE delete option
ALTER TABLE public.parking_reservations 
DROP CONSTRAINT IF EXISTS parking_reservations_parking_space_id_fkey;

ALTER TABLE public.parking_reservations 
ADD CONSTRAINT parking_reservations_parking_space_id_fkey 
FOREIGN KEY (parking_space_id) 
REFERENCES public.parking_spaces(id) 
ON DELETE CASCADE;
