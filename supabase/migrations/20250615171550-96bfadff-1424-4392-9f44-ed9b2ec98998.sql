
-- Tabla de rooms de chat
CREATE TABLE public.chat_rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabla de mensajes
CREATE TABLE public.chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  sender TEXT NOT NULL, -- "admin" o "client"
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  client_name TEXT NOT NULL
);

ALTER TABLE public.chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Políticas básicas: acceso libre (ajusta después según necesidad de autenticación)
CREATE POLICY "Public can read rooms" ON public.chat_rooms FOR SELECT USING (true);
CREATE POLICY "Public can create room" ON public.chat_rooms FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can read messages" ON public.chat_messages FOR SELECT USING (true);
CREATE POLICY "Public can write message" ON public.chat_messages FOR INSERT WITH CHECK (true);
