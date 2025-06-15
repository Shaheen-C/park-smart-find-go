import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface ParkingSpace {
  id: string;
  space_name: string;
  location: string;
  price_per_hour: number;
  capacity: number;
  available_spaces: number;
  description: string;
  vehicle_types: string[];
  vehicle_counts: { [key: string]: number };
  amenities: string[];
  contact_phone: string;
  contact_email: string;
  created_at: string;
  image_urls: string[];
  additional_charges?: string;
  is_active: boolean;
}

export const useListingActions = () => {
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const deleteListing = async (id: string, listings: ParkingSpace[], setListings: (listings: ParkingSpace[]) => void) => {
    if (!user) {
      console.log("No user found for delete operation");
      toast({
        title: "Error",
        description: "You must be logged in to delete listings",
        variant: "destructive",
      });
      return;
    }

    setActionLoading(id);
    try {
      console.log("Starting delete operation for space:", id, "user:", user.id);
      
      // First, check if there are any active (non-cancelled) reservations for this parking space
      const { data: reservations, error: reservationsError } = await supabase
        .from("parking_reservations")
        .select("id")
        .eq("parking_space_id", id)
        .neq("reservation_status", "cancelled");

      if (reservationsError) {
        console.error("Error checking reservations:", reservationsError);
        throw new Error("Failed to check existing reservations");
      }

      if (reservations && reservations.length > 0) {
        console.log(`Found ${reservations.length} active reservations for this parking space`);
        toast({
          title: "Cannot Delete",
          description: `This parking space has ${reservations.length} active reservation(s). Please wait for them to complete or contact the users to cancel before deletion.`,
          variant: "destructive",
        });
        return;
      }

      // If no active reservations, proceed with deletion
      const { error: deleteError } = await supabase
        .from("parking_spaces")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (deleteError) {
        console.error("Error deleting listing:", deleteError);
        throw deleteError;
      }

      console.log("Delete successful, updating local state");
      setListings(listings.filter(listing => listing.id !== id));
      toast({
        title: "Success",
        description: "Parking space deleted successfully",
      });
    } catch (error) {
      console.error("Error in delete operation:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to delete parking space";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean, listings: ParkingSpace[], setListings: (listings: ParkingSpace[]) => void) => {
    if (!user) {
      console.log("No user found for toggle operation");
      toast({
        title: "Error",
        description: "You must be logged in to modify listings",
        variant: "destructive",
      });
      return;
    }

    setActionLoading(id);
    try {
      console.log("Starting toggle operation for space:", id, "from", currentStatus, "to", !currentStatus, "user:", user.id);
      
      const newStatus = !currentStatus;
      const { error: updateError } = await supabase
        .from("parking_spaces")
        .update({ is_active: newStatus })
        .eq("id", id)
        .eq("user_id", user.id);

      if (updateError) {
        console.error("Error updating listing:", updateError);
        throw updateError;
      }

      console.log("Toggle successful, updating local state");
      setListings(listings.map(listing => 
        listing.id === id ? { ...listing, is_active: newStatus } : listing
      ));
      
      toast({
        title: "Success",
        description: `Parking space ${newStatus ? 'activated' : 'deactivated'} successfully`,
      });
    } catch (error) {
      console.error("Error in toggle operation:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to update parking space status";
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
    deleteListing,
    toggleActive,
  };
};
