
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const imageUploadService = {
  async uploadImages(images: File[]): Promise<string[]> {
    console.log("Starting image upload process...");
    console.log("Number of images to upload:", images.length);
    
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error("User not authenticated");
      toast.error("You must be logged in to upload images");
      return [];
    }
    
    const uploadedUrls: string[] = [];
    
    for (const image of images) {
      try {
        console.log("Processing image:", image.name, "Size:", image.size, "Type:", image.type);
        
        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!validTypes.includes(image.type)) {
          console.error('Invalid file type:', image.type);
          toast.error(`Invalid file type for ${image.name}. Please use JPG or PNG.`);
          continue;
        }

        // Validate file size (10MB limit)
        if (image.size > 10 * 1024 * 1024) {
          console.error('File too large:', image.size);
          toast.error(`File ${image.name} is too large. Maximum size is 10MB.`);
          continue;
        }
        
        // Generate unique filename with user folder structure
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2);
        const fileExtension = image.name.split('.').pop()?.toLowerCase();
        const fileName = `${user.id}/parking-${timestamp}-${randomString}.${fileExtension}`;
        
        console.log(`Uploading image: ${fileName}`);
        
        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
          .from('parking-images')
          .upload(fileName, image, {
            cacheControl: '3600',
            upsert: false
          });

        if (error) {
          console.error('Upload error details:', error);
          console.error('Error message:', error.message);
          
          // More specific error handling
          if (error.message.includes('The resource was not found')) {
            toast.error('Storage bucket not found. Please contact support.');
          } else if (error.message.includes('Duplicate')) {
            toast.error(`File with similar name already exists. Please try again.`);
          } else {
            toast.error(`Failed to upload ${image.name}: ${error.message}`);
          }
          continue;
        }

        console.log("Upload successful, data:", data);

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('parking-images')
          .getPublicUrl(fileName);

        console.log(`Upload successful, public URL: ${publicUrl}`);
        
        // Validate that the URL is properly formed
        if (!publicUrl || !publicUrl.includes('supabase')) {
          console.error('Invalid public URL generated:', publicUrl);
          toast.error(`Invalid URL generated for ${image.name}`);
          continue;
        }
        
        uploadedUrls.push(publicUrl);
        toast.success(`Successfully uploaded ${image.name}`);
        
      } catch (error) {
        console.error('Unexpected upload error for', image.name, ':', error);
        toast.error(`Unexpected error uploading ${image.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
    
    console.log("Upload process completed. Total successful uploads:", uploadedUrls.length);
    console.log("Generated URLs:", uploadedUrls);
    
    return uploadedUrls;
  }
};
