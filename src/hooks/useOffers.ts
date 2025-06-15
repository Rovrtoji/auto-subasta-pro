
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';

type Offer = Tables<'offers'>;
type OfferInsert = TablesInsert<'offers'>;

export const useCreateOffer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (offer: OfferInsert) => {
      const { data, error } = await supabase
        .from('offers')
        .insert(offer)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers'] });
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });
};

export const useVehicleOffers = (vehicleId: string) => {
  return useQuery({
    queryKey: ['offers', vehicleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('offers')
        .select('*')
        .eq('vehicle_id', vehicleId)
        .order('offer_amount', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!vehicleId,
  });
};
