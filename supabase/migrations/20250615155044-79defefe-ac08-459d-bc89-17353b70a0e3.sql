
-- Create the parking-images storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('parking-images', 'parking-images', true);

-- Create policy to allow authenticated users to upload images
CREATE POLICY "Allow authenticated users to upload parking images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'parking-images' 
  AND auth.role() = 'authenticated'
);

-- Create policy to allow public read access to parking images
CREATE POLICY "Allow public read access to parking images" ON storage.objects
FOR SELECT USING (bucket_id = 'parking-images');

-- Create policy to allow users to update their own parking images
CREATE POLICY "Allow users to update their own parking images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'parking-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
) WITH CHECK (
  bucket_id = 'parking-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Create policy to allow users to delete their own parking images
CREATE POLICY "Allow users to delete their own parking images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'parking-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
