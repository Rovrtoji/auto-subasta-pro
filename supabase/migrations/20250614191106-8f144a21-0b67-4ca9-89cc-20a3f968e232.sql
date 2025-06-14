
-- Crear función de seguridad para obtener el rol del usuario actual
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT rol FROM public.profiles WHERE id = auth.uid();
$$;

-- Recrear las políticas sin recursión
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.get_current_user_role() IN ('admin', 'ejecutivo'));

-- Actualizar políticas de vehículos para usar la función
DROP POLICY IF EXISTS "Only admins can modify vehicles" ON public.vehicles;

CREATE POLICY "Only admins can modify vehicles" ON public.vehicles
  FOR ALL USING (public.get_current_user_role() IN ('admin', 'ejecutivo'));

-- Actualizar políticas de subastas
DROP POLICY IF EXISTS "Only admins can modify auctions" ON public.auctions;

CREATE POLICY "Only admins can modify auctions" ON public.auctions
  FOR ALL USING (public.get_current_user_role() IN ('admin', 'ejecutivo'));

-- Actualizar políticas de citas para admins
DROP POLICY IF EXISTS "Admins can view all appointments" ON public.appointments;

CREATE POLICY "Admins can view all appointments" ON public.appointments
  FOR SELECT USING (public.get_current_user_role() IN ('admin', 'ejecutivo'));

-- Actualizar políticas de reservas para admins
DROP POLICY IF EXISTS "Admins can view all reservations" ON public.reservations;

CREATE POLICY "Admins can view all reservations" ON public.reservations
  FOR SELECT USING (public.get_current_user_role() IN ('admin', 'ejecutivo'));
