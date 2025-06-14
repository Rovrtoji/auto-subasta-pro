
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';

type Reservation = Tables<'reservations'>;
type ReservationInsert = TablesInsert<'reservations'>;

export const useCreateReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reservation: ReservationInsert) => {
      const { data, error } = await supabase
        .from('reservations')
        .insert(reservation)
        .select()
        .single();

      if (error) throw error;

      // Marcar el vehículo como apartado
      const { error: updateError } = await supabase
        .from('vehicles')
        .update({ apartado: true })
        .eq('id', reservation.vehicle_id);

      if (updateError) throw updateError;

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });
};

export const useReservations = () => {
  return useQuery({
    queryKey: ['reservations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reservations')
        .select(`
          *,
          vehicles (marca, modelo, año)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};
