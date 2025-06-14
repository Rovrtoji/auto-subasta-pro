
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';

type Vehicle = Tables<'vehicles'>;
type VehicleInsert = TablesInsert<'vehicles'>;
type VehicleStatusHistory = Tables<'vehicle_status_history'>;
type VehicleImages = Tables<'vehicle_images'>;

export const useVehicles = () => {
  return useQuery({
    queryKey: ['vehicles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Vehicle[];
    },
  });
};

export const useVehicle = (id: string) => {
  return useQuery({
    queryKey: ['vehicle', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Vehicle;
    },
    enabled: !!id,
  });
};

export const useCreateVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vehicle: VehicleInsert & { imageUrls?: string[] }) => {
      const { imageUrls, ...vehicleData } = vehicle;
      
      // Crear vehículo
      const { data: vehicleResult, error } = await supabase
        .from('vehicles')
        .insert(vehicleData)
        .select()
        .single();

      if (error) throw error;

      // Si hay imágenes, gestionarlas
      if (imageUrls && imageUrls.length > 0) {
        const { error: imageError } = await supabase.rpc('manage_vehicle_images', {
          p_vehicle_id: vehicleResult.id,
          p_images: imageUrls,
          p_primary_image: imageUrls[0]
        });

        if (imageError) {
          console.error('Error managing images:', imageError);
        }
      }

      return vehicleResult;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });
};

export const useUpdateVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Vehicle> & { imageUrls?: string[] } }) => {
      const { imageUrls, ...vehicleUpdates } = updates;
      
      // Actualizar vehículo
      const { data, error } = await supabase
        .from('vehicles')
        .update(vehicleUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Si hay imágenes, gestionarlas
      if (imageUrls && imageUrls.length > 0) {
        const { error: imageError } = await supabase.rpc('manage_vehicle_images', {
          p_vehicle_id: id,
          p_images: imageUrls,
          p_primary_image: imageUrls[0]
        });

        if (imageError) {
          console.error('Error managing images:', imageError);
        }
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });
};

export const useUpdateVehicleStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ vehicleId, newStatus, reason }: { vehicleId: string; newStatus: string; reason?: string }) => {
      const { error } = await supabase.rpc('update_vehicle_status', {
        p_vehicle_id: vehicleId,
        p_nuevo_estado: newStatus,
        p_motivo: reason
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });
};

export const useVehicleStatusHistory = (vehicleId: string) => {
  return useQuery({
    queryKey: ['vehicle-status-history', vehicleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vehicle_status_history')
        .select('*')
        .eq('vehicle_id', vehicleId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as VehicleStatusHistory[];
    },
    enabled: !!vehicleId,
  });
};

export const useVehicleImages = (vehicleId: string) => {
  return useQuery({
    queryKey: ['vehicle-images', vehicleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vehicle_images')
        .select('*')
        .eq('vehicle_id', vehicleId)
        .order('orden', { ascending: true });

      if (error) throw error;
      return data as VehicleImages[];
    },
    enabled: !!vehicleId,
  });
};

export const useInventoryStats = () => {
  return useQuery({
    queryKey: ['inventory-stats'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_inventory_stats');

      if (error) throw error;
      return data[0];
    },
  });
};
