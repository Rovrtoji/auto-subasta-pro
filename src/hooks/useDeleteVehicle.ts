
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useDeleteVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vehicleId: string) => {
      console.log('Deleting vehicle:', vehicleId);
      
      // Eliminar imágenes relacionadas primero
      const { error: imagesError } = await supabase
        .from('vehicle_images')
        .delete()
        .eq('vehicle_id', vehicleId);

      if (imagesError) {
        console.error('Error deleting vehicle images:', imagesError);
        throw new Error('Error al eliminar las imágenes del vehículo');
      }

      // Eliminar historial de estado
      const { error: historyError } = await supabase
        .from('vehicle_status_history')
        .delete()
        .eq('vehicle_id', vehicleId);

      if (historyError) {
        console.error('Error deleting vehicle history:', historyError);
        // No lanzar error aquí, solo log
      }

      // Eliminar el vehículo
      const { error: vehicleError } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', vehicleId);

      if (vehicleError) {
        console.error('Error deleting vehicle:', vehicleError);
        throw new Error('Error al eliminar el vehículo');
      }

      console.log('Vehicle deleted successfully');
      return vehicleId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      toast.success('Vehículo eliminado exitosamente');
    },
    onError: (error: any) => {
      console.error('Delete vehicle error:', error);
      toast.error(error.message || 'Error al eliminar el vehículo');
    },
  });
};
