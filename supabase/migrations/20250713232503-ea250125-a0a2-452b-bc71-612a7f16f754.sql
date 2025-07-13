-- Crear tabla de profiles para usuarios
CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY,
  nombre TEXT NOT NULL,
  telefono TEXT,
  rol TEXT NOT NULL DEFAULT 'cliente',
  fecha_registro TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tabla de vehículos
CREATE TABLE public.vehicles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  marca TEXT NOT NULL,
  modelo TEXT NOT NULL,
  año INTEGER NOT NULL,
  kilometraje INTEGER NOT NULL DEFAULT 0,
  precio NUMERIC NOT NULL,
  transmision TEXT NOT NULL,
  combustible TEXT NOT NULL,
  color TEXT NOT NULL,
  estado_general TEXT NOT NULL DEFAULT 'Bueno',
  descripcion TEXT,
  imagen TEXT,
  imagenes TEXT[] DEFAULT '{}',
  caracteristicas TEXT[] DEFAULT '{}',
  en_subasta BOOLEAN NOT NULL DEFAULT false,
  apartado BOOLEAN NOT NULL DEFAULT false,
  fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear bucket para imágenes de vehículos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('vehicle-images', 'vehicle-images', true)
ON CONFLICT (id) DO NOTHING;

-- Habilitar RLS en las tablas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "Users can view own profile" ON public.profiles
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = id);

-- Políticas para vehicles
CREATE POLICY "Anyone can view vehicles" ON public.vehicles
FOR SELECT USING (true);

CREATE POLICY "Only admins can modify vehicles" ON public.vehicles
FOR ALL USING (true);

-- Políticas para storage
CREATE POLICY "Anyone can view vehicle images" ON storage.objects
FOR SELECT USING (bucket_id = 'vehicle-images');

CREATE POLICY "Anyone can upload vehicle images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'vehicle-images');

CREATE POLICY "Anyone can update vehicle images" ON storage.objects
FOR UPDATE USING (bucket_id = 'vehicle-images');

CREATE POLICY "Anyone can delete vehicle images" ON storage.objects
FOR DELETE USING (bucket_id = 'vehicle-images');

-- Función para obtener rol del usuario
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT rol FROM public.profiles WHERE id = auth.uid();
$$;

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_vehicles_updated_at
  BEFORE UPDATE ON public.vehicles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();