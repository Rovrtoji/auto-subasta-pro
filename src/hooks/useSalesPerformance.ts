
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useSalesPerformance = () => {
  return useQuery({
    queryKey: ['sales-performance'],
    queryFn: async () => {
      // Obtener datos de ventas por mes
      const { data: salesData, error } = await supabase
        .from('vehicles')
        .select('precio, created_at, apartado, en_subasta')
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Procesar datos para el gráfico
      const monthlyData = salesData?.reduce((acc: any[], vehicle) => {
        const date = new Date(vehicle.created_at);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        const existingMonth = acc.find(item => item.mes === monthKey);
        
        if (existingMonth) {
          existingMonth.inventario += 1;
          if (vehicle.apartado) {
            existingMonth.ventas += 1;
            existingMonth.ingresos += Number(vehicle.precio);
          }
          if (vehicle.en_subasta) {
            existingMonth.subastas += 1;
          }
        } else {
          acc.push({
            mes: monthKey,
            inventario: 1,
            ventas: vehicle.apartado ? 1 : 0,
            subastas: vehicle.en_subasta ? 1 : 0,
            ingresos: vehicle.apartado ? Number(vehicle.precio) : 0
          });
        }
        
        return acc;
      }, []) || [];

      // Formatear datos para mostrar los últimos 6 meses
      const last6Months = monthlyData.slice(-6).map(item => ({
        ...item,
        mesFormateado: new Date(item.mes + '-01').toLocaleDateString('es-MX', { 
          month: 'short', 
          year: 'numeric' 
        })
      }));

      return last6Months;
    },
  });
};
