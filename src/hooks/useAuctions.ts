
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';

type Auction = Tables<'auctions'>;
type AuctionInsert = TablesInsert<'auctions'>;
type Bid = Tables<'bids'>;
type BidInsert = TablesInsert<'bids'>;

export const useAuctions = () => {
  return useQuery({
    queryKey: ['auctions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('auctions')
        .select(`
          *,
          vehicles (*)
        `)
        .eq('activa', true)
        .order('fecha_fin', { ascending: true });

      if (error) throw error;
      return data;
    },
  });
};

export const useAuction = (id: string) => {
  return useQuery({
    queryKey: ['auction', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('auctions')
        .select(`
          *,
          vehicles (*),
          bids (*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
};

export const useCreateBid = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bid: BidInsert) => {
      console.log('Creating bid with data:', bid);
      
      // Validar que tenemos los datos necesarios
      if (!bid.user_id || !bid.auction_id || !bid.cantidad) {
        throw new Error('Datos de puja incompletos');
      }

      const { data, error } = await supabase
        .from('bids')
        .insert(bid)
        .select()
        .single();

      if (error) {
        console.error('Error creating bid:', error);
        throw error;
      }

      // Actualizar el precio actual de la subasta
      const { error: updateError } = await supabase
        .from('auctions')
        .update({ precio_actual: bid.cantidad })
        .eq('id', bid.auction_id);

      if (updateError) {
        console.error('Error updating auction price:', updateError);
        throw updateError;
      }

      return data;
    },
    onSuccess: (data) => {
      console.log('Bid created successfully:', data);
      queryClient.invalidateQueries({ queryKey: ['auctions'] });
      queryClient.invalidateQueries({ queryKey: ['auction', data.auction_id] });
    },
    onError: (error) => {
      console.error('Bid creation failed:', error);
    },
  });
};
