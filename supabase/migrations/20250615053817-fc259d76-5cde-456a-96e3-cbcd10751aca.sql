
-- Crear tabla para almacenar ofertas de usuarios
CREATE TABLE public.offers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  user_phone TEXT,
  offer_amount NUMERIC NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Agregar trigger para updated_at
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.offers
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Agregar índices para mejorar performance
CREATE INDEX idx_offers_vehicle_id ON public.offers(vehicle_id);
CREATE INDEX idx_offers_user_id ON public.offers(user_id);
CREATE INDEX idx_offers_status ON public.offers(status);

-- Habilitar RLS
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para que los usuarios puedan ver y crear sus propias ofertas
CREATE POLICY "Users can view all offers" ON public.offers
  FOR SELECT USING (true);

CREATE POLICY "Users can create offers" ON public.offers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own offers" ON public.offers
  FOR UPDATE USING (auth.uid() = user_id);
