
-- Create a function to update available spaces when reservation is created
CREATE OR REPLACE FUNCTION public.update_available_spaces_on_reservation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Decrease available spaces when a reservation is confirmed
  IF NEW.reservation_status = 'confirmed' THEN
    UPDATE public.parking_spaces 
    SET available_spaces = available_spaces - 1
    WHERE id = NEW.parking_space_id 
      AND available_spaces > 0;
  END IF;
  
  -- If reservation is cancelled, increase available spaces back
  IF OLD.reservation_status = 'confirmed' AND NEW.reservation_status = 'cancelled' THEN
    UPDATE public.parking_spaces 
    SET available_spaces = available_spaces + 1
    WHERE id = NEW.parking_space_id 
      AND available_spaces < capacity;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for INSERT operations (new reservations)
CREATE TRIGGER trigger_update_spaces_on_insert
  AFTER INSERT ON public.parking_reservations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_available_spaces_on_reservation();

-- Create trigger for UPDATE operations (status changes)
CREATE TRIGGER trigger_update_spaces_on_update
  AFTER UPDATE ON public.parking_reservations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_available_spaces_on_reservation();
