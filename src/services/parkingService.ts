
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { imageUploadService } from "./imageUploadService";

export interface ParkingSpaceData {
  spaceName: string;
  location: string;
  preciseLocation?: string;
  description: string;
  pricePerHour: string;
  capacity: string;
  amenities: string[];
  vehicleTypes: string[];
  vehicleCounts?: { [key: string]: number };
  contactPhone: string;
  contactEmail: string;
  additionalCharges?: string;
  images?: File[];
}

export const parkingService = {
  async createParkingSpace(data: ParkingSpaceData) {
    try {
      console.log("Creating parking space with data:", data);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error("User not authenticated");
        toast.error("You must be logged in to list a parking space");
        return { success: false, error: "Not authenticated" };
      }

      console.log("User authenticated, ID:", user.id);

      // Upload images first if provided
      let imageUrls: string[] = [];
      if (data.images && data.images.length > 0) {
        console.log("Starting image upload process with", data.images.length, "images");
        
        try {
          imageUrls = await imageUploadService.uploadImages(data.images);
          console.log("Image upload completed. URLs received:", imageUrls);
          
          if (imageUrls.length === 0) {
            console.error("No images were successfully uploaded");
            toast.error("Failed to upload images. Please try again.");
            return { success: false, error: "Image upload failed" };
          }
          
          if (imageUrls.length < data.images.length) {
            console.warn(`Only ${imageUrls.length} out of ${data.images.length} images uploaded successfully`);
            toast.error(`Only ${imageUrls.length} out of ${data.images.length} images uploaded successfully`);
          }
        } catch (uploadError) {
          console.error("Image upload service error:", uploadError);
          toast.error("Failed to upload images. Please try again.");
          return { success: false, error: "Image upload failed" };
        }
      }

      console.log("Proceeding to create parking space record...");

      const capacity = parseInt(data.capacity);
      
      // Calculate total available spaces from vehicle counts if provided
      const totalAvailableSpaces = data.vehicleCounts 
        ? Object.values(data.vehicleCounts).reduce((sum, count) => sum + count, 0)
        : capacity;

      const { error } = await supabase
        .from('parking_spaces')
        .insert({
          user_id: user.id,
          space_name: data.spaceName,
          location: data.location,
          precise_location: data.preciseLocation || null,
          description: data.description,
          price_per_hour: parseFloat(data.pricePerHour),
          capacity: capacity,
          available_spaces: totalAvailableSpaces,
          amenities: data.amenities,
          vehicle_types: data.vehicleTypes,
          vehicle_counts: data.vehicleCounts || {},
          contact_phone: data.contactPhone,
          contact_email: data.contactEmail,
          additional_charges: data.additionalCharges || null,
          image_urls: imageUrls
        });

      if (error) {
        console.error("Error creating parking space:", error);
        toast.error("Failed to create parking space listing");
        return { success: false, error };
      }

      console.log("Parking space created successfully!");
      toast.success("Parking space listed successfully!");
      return { success: true };
    } catch (error) {
      console.error("Unexpected error in createParkingSpace:", error);
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
  },

  async getParkingSpaceById(id: string) {
    try {
      const { data, error } = await supabase
        .from('parking_spaces')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .maybeSingle();

      if (error) {
        console.error("Error fetching parking space:", error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error("Unexpected error:", error);
      return { data: null, error };
    }
  }
};
