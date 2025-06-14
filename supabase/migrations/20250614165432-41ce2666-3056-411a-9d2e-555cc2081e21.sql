
-- Crear tabla de perfiles de usuario
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  telefono TEXT,
  rol TEXT NOT NULL DEFAULT 'cliente' CHECK (rol IN ('cliente', 'admin', 'ejecutivo')),
  fecha_registro TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Crear tabla de vehículos
CREATE TABLE public.vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  marca TEXT NOT NULL,
  modelo TEXT NOT NULL,
  año INTEGER NOT NULL,
  kilometraje INTEGER NOT NULL DEFAULT 0,
  precio DECIMAL(12,2) NOT NULL,
  transmision TEXT NOT NULL CHECK (transmision IN ('Manual', 'Automática')),
  combustible TEXT NOT NULL CHECK (combustible IN ('Gasolina', 'Diesel', 'Híbrido', 'Eléctrico')),
  color TEXT NOT NULL,
  imagen TEXT,
  imagenes TEXT[] DEFAULT '{}',
  descripcion TEXT,
  caracteristicas TEXT[] DEFAULT '{}',
  en_subasta BOOLEAN NOT NULL DEFAULT FALSE,
  apartado BOOLEAN NOT NULL DEFAULT FALSE,
  estado_general TEXT NOT NULL DEFAULT 'Bueno' CHECK (estado_general IN ('Excelente', 'Muy Bueno', 'Bueno', 'Regular')),
  fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Crear tabla de subastas
CREATE TABLE public.auctions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  precio_inicial DECIMAL(12,2) NOT NULL,
  precio_actual DECIMAL(12,2) NOT NULL,
  fecha_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
  fecha_fin TIMESTAMP WITH TIME ZONE NOT NULL,
  participantes UUID[] DEFAULT '{}',
  activa BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Crear tabla de pujas
CREATE TABLE public.bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auction_id UUID NOT NULL REFERENCES public.auctions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  cantidad DECIMAL(12,2) NOT NULL,
  fecha TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Crear tabla de citas
CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  cliente_nombre TEXT NOT NULL,
  cliente_email TEXT NOT NULL,
  cliente_telefono TEXT NOT NULL,
  fecha DATE NOT NULL,
  hora TIME NOT NULL,
  mensaje TEXT,
  estado TEXT NOT NULL DEFAULT 'Pendiente' CHECK (estado IN ('Pendiente', 'Confirmada', 'Completada', 'Cancelada')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Crear tabla de reservas/apartados
CREATE TABLE public.reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  cliente_nombre TEXT NOT NULL,
  cliente_email TEXT NOT NULL,
  cliente_telefono TEXT NOT NULL,
  fecha_apartado TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  monto_seña DECIMAL(12,2) NOT NULL,
  estado TEXT NOT NULL DEFAULT 'Activa' CHECK (estado IN ('Activa', 'Vencida', 'Completada')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Habilitar Row Level Security (RLS) en todas las tablas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auctions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para perfiles (los usuarios pueden ver y editar su propio perfil)
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Políticas RLS para vehículos (públicos para lectura, solo admins pueden modificar)
CREATE POLICY "Anyone can view vehicles" ON public.vehicles
  FOR SELECT USING (true);

CREATE POLICY "Only admins can modify vehicles" ON public.vehicles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND rol IN ('admin', 'ejecutivo')
    )
  );

-- Políticas RLS para subastas (públicas para lectura, solo admins pueden crear/modificar)
CREATE POLICY "Anyone can view auctions" ON public.auctions
  FOR SELECT USING (true);

CREATE POLICY "Only admins can modify auctions" ON public.auctions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND rol IN ('admin', 'ejecutivo')
    )
  );

-- Políticas RLS para pujas (usuarios autenticados pueden crear, todos pueden ver)
CREATE POLICY "Anyone can view bids" ON public.bids
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create bids" ON public.bids
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Políticas RLS para citas (usuarios pueden crear, admins pueden ver todas)
CREATE POLICY "Anyone can create appointments" ON public.appointments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all appointments" ON public.appointments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND rol IN ('admin', 'ejecutivo')
    )
  );

-- Políticas RLS para reservas (usuarios pueden crear, admins pueden ver todas)
CREATE POLICY "Anyone can create reservations" ON public.reservations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all reservations" ON public.reservations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND rol IN ('admin', 'ejecutivo')
    )
  );

-- Función para crear perfil automáticamente cuando se registra un usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, nombre, rol)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nombre', NEW.email),
    'cliente'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para crear perfil automáticamente
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at en todas las tablas
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER vehicles_updated_at BEFORE UPDATE ON public.vehicles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER auctions_updated_at BEFORE UPDATE ON public.auctions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER appointments_updated_at BEFORE UPDATE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER reservations_updated_at BEFORE UPDATE ON public.reservations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
