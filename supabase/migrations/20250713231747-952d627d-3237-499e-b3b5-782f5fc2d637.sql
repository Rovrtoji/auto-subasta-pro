-- Recrear políticas para el bucket vehicle-images
CREATE POLICY "Anyone can view vehicle images" ON storage.objects
FOR SELECT USING (bucket_id = 'vehicle-images');

CREATE POLICY "Authenticated users can upload vehicle images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'vehicle-images');

CREATE POLICY "Users can update their own vehicle images" ON storage.objects
FOR UPDATE USING (bucket_id = 'vehicle-images');

CREATE POLICY "Users can delete their own vehicle images" ON storage.objects
FOR DELETE USING (bucket_id = 'vehicle-images');