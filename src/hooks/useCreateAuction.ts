
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CreateAuctionData {
  vehicleId: string;
  precioInicial: number;
  fechaInicio: Date;
  fechaFin: Date;
}

export const useCreateAuction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (auctionData: CreateAuctionData) => {
      console.log('Creating auction:', auctionData);
      
      // Primero actualizar el vehículo para marcarlo como en subasta
      const { error: vehicleError } = await supabase
        .from('vehicles')
        .update({ en_subasta: true })
        .eq('id', auctionData.vehicleId);

      if (vehicleError) {
        console.error('Error updating vehicle:', vehicleError);
        throw new Error('Error al actualizar el vehículo');
      }

      // Crear la subasta
      const { data, error } = await supabase
        .from('auctions')
        .insert({
          vehicle_id: auctionData.vehicleId,
          precio_inicial: auctionData.precioInicial,
          precio_actual: auctionData.precioInicial,
          fecha_inicio: auctionData.fechaInicio.toISOString(),
          fecha_fin: auctionData.fechaFin.toISOString(),
          activa: true,
          participantes: []
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating auction:', error);
        throw new Error('Error al crear la subasta');
      }

      console.log('Auction created successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auctions'] });
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      toast.success('Subasta creada exitosamente');
    },
    onError: (error: any) => {
      console.error('Create auction error:', error);
      toast.error(error.message || 'Error al crear la subasta');
    },
  });
};
