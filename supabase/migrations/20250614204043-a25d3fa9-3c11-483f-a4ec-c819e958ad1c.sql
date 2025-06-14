
-- Crear bucket para imágenes de vehículos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('vehicle-images', 'vehicle-images', true);

-- Políticas para el bucket vehicle-images
CREATE POLICY "Anyone can view vehicle images" ON storage.objects
FOR SELECT USING (bucket_id = 'vehicle-images');

CREATE POLICY "Authenticated users can upload vehicle images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'vehicle-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own vehicle images" ON storage.objects
FOR UPDATE USING (bucket_id = 'vehicle-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can delete their own vehicle images" ON storage.objects
FOR DELETE USING (bucket_id = 'vehicle-images' AND auth.role() = 'authenticated');
