
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ParkingSpaceData {
  spaceName: string;
  location: string;
  description: string;
  pricePerHour: string;
  capacity: string;
  amenities: string[];
  vehicleTypes: string[];
  contactPhone: string;
  contactEmail: string;
  additionalCharges?: string;
  imageUrls?: string[];
}

export const parkingService = {
  async createParkingSpace(data: ParkingSpaceData) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You must be logged in to list a parking space");
        return { success: false, error: "Not authenticated" };
      }

      const { error } = await supabase
        .from('parking_spaces')
        .insert({
          user_id: user.id,
          space_name: data.spaceName,
          location: data.location,
          description: data.description,
          price_per_hour: parseFloat(data.pricePerHour),
          capacity: parseInt(data.capacity),
          amenities: data.amenities,
          vehicle_types: data.vehicleTypes,
          contact_phone: data.contactPhone,
          contact_email: data.contactEmail,
          additional_charges: data.additionalCharges || null,
          image_urls: data.imageUrls || []
        });

      if (error) {
        console.error("Error creating parking space:", error);
        toast.error("Failed to create parking space listing");
        return { success: false, error };
      }

      toast.success("Parking space listed successfully!");
      return { success: true };
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred");
      return { success: false, error };
    }
  },

  async getParkingSpaces() {
    try {
      const { data, error } = await supabase
        .from('parking_spaces')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching parking spaces:", error);
        return { data: [], error };
      }

      return { data: data || [], error: null };
    } catch (error) {
      console.error("Unexpected error:", error);
      return { data: [], error };
    }
  }
};
