
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useVehicles = () => {
  return useQuery({
    queryKey: ['vehicles'],
    queryFn: async () => {
      console.log('Fetching vehicles...');
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching vehicles:', error);
        throw new Error('Error al cargar los vehículos');
      }

      console.log('Vehicles fetched:', data?.length);
      return data || [];
    },
  });
};

export const useCreateVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vehicleData: any) => {
      console.log('Creating vehicle with data:', vehicleData);
      
      // Preparar los datos del vehículo
      const { imageUrls, ...vehicleFields } = vehicleData;
      
      // Insertar el vehículo
      const { data: vehicle, error: vehicleError } = await supabase
        .from('vehicles')
        .insert({
          ...vehicleFields,
          imagen: imageUrls?.[0] || null,
          imagenes: imageUrls || []
        })
        .select()
        .single();

      if (vehicleError) {
        console.error('Error creating vehicle:', vehicleError);
        throw new Error('Error al crear el vehículo');
      }

      console.log('Vehicle created successfully:', vehicle);
      return vehicle;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      toast.success('Vehículo creado exitosamente');
    },
    onError: (error: any) => {
      console.error('Create vehicle error:', error);
      toast.error(error.message || 'Error al crear el vehículo');
    },
  });
};

export const useUpdateVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      console.log('Updating vehicle:', id, updates);
      
      // Separar imageUrls del resto de updates
      const { imageUrls, ...vehicleFields } = updates;
      
      // Actualizar el vehículo directamente
      const { data, error } = await supabase
        .from('vehicles')
        .update({
          ...vehicleFields,
          imagen: imageUrls?.[0] || vehicleFields.imagen,
          imagenes: imageUrls || vehicleFields.imagenes || []
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating vehicle:', error);
        throw new Error('Error al actualizar el vehículo');
      }

      console.log('Vehicle updated successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      toast.success('Vehículo actualizado exitosamente');
    },
    onError: (error: any) => {
      console.error('Update vehicle error:', error);
      toast.error(error.message || 'Error al actualizar el vehículo');
    },
  });
};
