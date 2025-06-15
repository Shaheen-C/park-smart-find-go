
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const imageUploadService = {
  async uploadImages(images: File[]): Promise<string[]> {
    const uploadedUrls: string[] = [];
    
    for (const image of images) {
      try {
        // Generate unique filename
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2);
        const fileExtension = image.name.split('.').pop();
        const fileName = `parking-${timestamp}-${randomString}.${fileExtension}`;
        
        console.log(`Uploading image: ${fileName}`);
        
        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
          .from('parking-images')
          .upload(fileName, image, {
            cacheControl: '3600',
            upsert: false
          });

        if (error) {
          console.error('Upload error:', error);
          toast.error(`Failed to upload ${image.name}`);
          continue;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('parking-images')
          .getPublicUrl(fileName);

        console.log(`Upload successful, URL: ${publicUrl}`);
        uploadedUrls.push(publicUrl);
        
      } catch (error) {
        console.error('Unexpected upload error:', error);
        toast.error(`Unexpected error uploading ${image.name}`);
      }
    }
    
    return uploadedUrls;
  }
};
