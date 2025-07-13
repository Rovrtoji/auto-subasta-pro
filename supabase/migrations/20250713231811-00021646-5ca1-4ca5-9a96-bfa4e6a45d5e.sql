-- Permitir subida de imágenes sin autenticación para vehículos
DROP POLICY IF EXISTS "Authenticated users can upload vehicle images" ON storage.objects;

CREATE POLICY "Anyone can upload vehicle images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'vehicle-images');

DROP POLICY IF EXISTS "Users can update their own vehicle images" ON storage.objects;

CREATE POLICY "Anyone can update vehicle images" ON storage.objects
FOR UPDATE USING (bucket_id = 'vehicle-images');

DROP POLICY IF EXISTS "Users can delete their own vehicle images" ON storage.objects;

CREATE POLICY "Anyone can delete vehicle images" ON storage.objects
FOR DELETE USING (bucket_id = 'vehicle-images');