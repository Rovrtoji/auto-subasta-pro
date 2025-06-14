
-- Crear tabla para tracking de cambios de estado de vehículos
CREATE TABLE public.vehicle_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  estado_anterior TEXT,
  estado_nuevo TEXT NOT NULL,
  motivo TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Crear tabla para gestión de imágenes de vehículos
CREATE TABLE public.vehicle_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  orden INTEGER DEFAULT 0,
  alt_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Actualizar triggers para las nuevas tablas
CREATE TRIGGER vehicle_status_history_updated_at BEFORE UPDATE ON public.vehicle_status_history
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Políticas RLS para vehicle_status_history
ALTER TABLE public.vehicle_status_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view vehicle status history" ON public.vehicle_status_history
  FOR SELECT USING (public.get_current_user_role() IN ('admin', 'ejecutivo'));

CREATE POLICY "Admins can create vehicle status history" ON public.vehicle_status_history
  FOR INSERT WITH CHECK (public.get_current_user_role() IN ('admin', 'ejecutivo'));

-- Políticas RLS para vehicle_images
ALTER TABLE public.vehicle_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view vehicle images" ON public.vehicle_images
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage vehicle images" ON public.vehicle_images
  FOR ALL USING (public.get_current_user_role() IN ('admin', 'ejecutivo'));

-- Función para actualizar estado de vehículo con historial
CREATE OR REPLACE FUNCTION public.update_vehicle_status(
  p_vehicle_id UUID,
  p_nuevo_estado TEXT,
  p_motivo TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_estado_anterior TEXT;
BEGIN
  -- Obtener estado actual
  SELECT 
    CASE 
      WHEN apartado THEN 'Apartado'
      WHEN en_subasta THEN 'En Subasta'
      ELSE 'Disponible'
    END
  INTO v_estado_anterior
  FROM public.vehicles 
  WHERE id = p_vehicle_id;

  -- Actualizar vehículo según el nuevo estado
  IF p_nuevo_estado = 'Apartado' THEN
    UPDATE public.vehicles 
    SET apartado = true, en_subasta = false 
    WHERE id = p_vehicle_id;
  ELSIF p_nuevo_estado = 'En Subasta' THEN
    UPDATE public.vehicles 
    SET en_subasta = true, apartado = false 
    WHERE id = p_vehicle_id;
  ELSE
    UPDATE public.vehicles 
    SET apartado = false, en_subasta = false 
    WHERE id = p_vehicle_id;
  END IF;

  -- Registrar cambio en historial
  INSERT INTO public.vehicle_status_history (
    vehicle_id, 
    estado_anterior, 
    estado_nuevo, 
    motivo, 
    created_by
  ) VALUES (
    p_vehicle_id, 
    v_estado_anterior, 
    p_nuevo_estado, 
    p_motivo, 
    auth.uid()
  );
END;
$$;

-- Función para gestionar imágenes de vehículo
CREATE OR REPLACE FUNCTION public.manage_vehicle_images(
  p_vehicle_id UUID,
  p_images TEXT[],
  p_primary_image TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Eliminar imágenes existentes
  DELETE FROM public.vehicle_images WHERE vehicle_id = p_vehicle_id;
  
  -- Actualizar imagen principal en vehicles
  UPDATE public.vehicles 
  SET 
    imagen = COALESCE(p_primary_image, p_images[1]),
    imagenes = p_images
  WHERE id = p_vehicle_id;
  
  -- Insertar nuevas imágenes
  IF p_images IS NOT NULL AND array_length(p_images, 1) > 0 THEN
    INSERT INTO public.vehicle_images (vehicle_id, url, is_primary, orden)
    SELECT 
      p_vehicle_id,
      unnest(p_images),
      CASE WHEN unnest(p_images) = COALESCE(p_primary_image, p_images[1]) THEN true ELSE false END,
      generate_series(1, array_length(p_images, 1));
  END IF;
END;
$$;

-- Función para obtener estadísticas de inventario
CREATE OR REPLACE FUNCTION public.get_inventory_stats()
RETURNS TABLE (
  total_vehiculos BIGINT,
  vehiculos_disponibles BIGINT,
  vehiculos_apartados BIGINT,
  vehiculos_en_subasta BIGINT,
  valor_total_inventario NUMERIC
)
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT 
    COUNT(*) as total_vehiculos,
    COUNT(*) FILTER (WHERE NOT apartado AND NOT en_subasta) as vehiculos_disponibles,
    COUNT(*) FILTER (WHERE apartado) as vehiculos_apartados,
    COUNT(*) FILTER (WHERE en_subasta) as vehiculos_en_subasta,
    COALESCE(SUM(precio), 0) as valor_total_inventario
  FROM public.vehicles;
$$;
