
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useImageUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadImage = async (file: File): Promise<string | null> => {
    if (!file) return null;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Validar el archivo
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor selecciona solo archivos de imagen');
        return null;
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB
        toast.error('La imagen no puede ser mayor a 5MB');
        return null;
      }

      // Generar nombre único para el archivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `vehicles/${fileName}`;

      console.log('Uploading file to path:', filePath);

      // Subir archivo a Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('vehicle-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        toast.error('Error al subir la imagen: ' + uploadError.message);
        return null;
      }

      console.log('File uploaded successfully');

      // Obtener URL pública
      const { data } = supabase.storage
        .from('vehicle-images')
        .getPublicUrl(filePath);

      console.log('Public URL generated:', data.publicUrl);

      setUploadProgress(100);
      toast.success('Imagen subida exitosamente');
      return data.publicUrl;

    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al procesar la imagen');
      return null;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const uploadMultipleImages = async (files: FileList): Promise<string[]> => {
    const urls: string[] = [];
    
    for (let i = 0; i < files.length; i++) {
      setUploadProgress((i / files.length) * 100);
      const url = await uploadImage(files[i]);
      if (url) {
        urls.push(url);
      }
    }
    
    return urls;
  };

  return {
    uploadImage,
    uploadMultipleImages,
    isUploading,
    uploadProgress
  };
};
