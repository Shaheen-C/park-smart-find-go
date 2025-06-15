
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface Reservation {
  id: string;
  parking_space_id: string;
  estimated_arrival_time: string;
  duration_hours: number;
  total_amount: number;
  payment_method: string;
  reservation_status: string;
  contact_phone: string;
  vehicle_type: string;
  vehicle_number: string | null;
  special_instructions: string | null;
  created_at: string;
  cancelled_at: string | null;
  parking_spaces: {
    space_name: string;
    location: string;
  };
}

export const useReservationActions = () => {
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const cancelReservation = async (
    id: string, 
    reservations: Reservation[], 
    setReservations: (reservations: Reservation[]) => void
  ) => {
    if (!user) {
      console.log("No user found for cancel operation");
      toast({
        title: "Error",
        description: "You must be logged in to cancel reservations",
        variant: "destructive",
      });
      return;
    }

    setActionLoading(id);
    try {
      console.log("Starting cancel operation for reservation:", id, "user:", user.id);
      
      const { error: updateError } = await supabase
        .from("parking_reservations")
        .update({ 
          reservation_status: 'cancelled',
          cancelled_at: new Date().toISOString()
        })
        .eq("id", id)
        .eq("user_id", user.id);

      if (updateError) {
        console.error("Error cancelling reservation:", updateError);
        throw updateError;
      }

      console.log("Cancel successful, updating local state");
      setReservations(reservations.map(reservation => 
        reservation.id === id 
          ? { 
              ...reservation, 
              reservation_status: 'cancelled',
              cancelled_at: new Date().toISOString()
            } 
          : reservation
      ));
      
      toast({
        title: "Success",
        description: "Reservation cancelled successfully",
      });
    } catch (error) {
      console.error("Error in cancel operation:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to cancel reservation";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const deleteReservation = async (
    id: string, 
    reservations: Reservation[], 
    setReservations: (reservations: Reservation[]) => void
  ) => {
    if (!user) {
      console.log("No user found for delete operation");
      toast({
        title: "Error",
        description: "You must be logged in to delete reservations",
        variant: "destructive",
      });
      return;
    }

    setActionLoading(id);
    try {
      console.log("Starting delete operation for reservation:", id, "user:", user.id);
      
      const { error: deleteError } = await supabase
        .from("parking_reservations")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (deleteError) {
        console.error("Error deleting reservation:", deleteError);
        throw deleteError;
      }

      console.log("Delete successful, updating local state");
      setReservations(reservations.filter(reservation => reservation.id !== id));
      
      toast({
        title: "Success",
        description: "Reservation deleted successfully",
      });
    } catch (error) {
      console.error("Error in delete operation:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to delete reservation";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  return {
    actionLoading,
    cancelReservation,
    deleteReservation,
  };
};
