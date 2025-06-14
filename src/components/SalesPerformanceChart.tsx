
import { TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import { useSalesPerformance } from '@/hooks/useSalesPerformance';

const chartConfig = {
  ventas: {
    label: "Ventas",
    color: "#2563eb",
  },
  inventario: {
    label: "Inventario",
    color: "#dc2626",
  },
  subastas: {
    label: "Subastas",
    color: "#16a34a",
  },
  ingresos: {
    label: "Ingresos (Miles)",
    color: "#ca8a04",
  },
};

const SalesPerformanceChart = () => {
  const { data: performanceData, isLoading, error } = useSalesPerformance();

  if (isLoading) {
    return (
      <Card className="border-0 shadow-lg automotive-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-automotive-blue" />
            <span>Rendimiento de Ventas</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gradient-to-r from-automotive-blue/10 to-automotive-gold/10 rounded-lg flex items-center justify-center">
            <div className="text-center space-y-2">
              <TrendingUp className="h-12 w-12 text-automotive-blue mx-auto animate-pulse" />
              <p className="text-lg font-semibold text-automotive-carbon">Cargando datos...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !performanceData || performanceData.length === 0) {
    return (
      <Card className="border-0 shadow-lg automotive-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-automotive-blue" />
            <span>Rendimiento de Ventas</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gradient-to-r from-automotive-blue/10 to-automotive-gold/10 rounded-lg flex items-center justify-center">
            <div className="text-center space-y-2">
              <TrendingUp className="h-12 w-12 text-gray-400 mx-auto" />
              <p className="text-lg font-semibold text-automotive-carbon">Sin datos disponibles</p>
              <p className="text-sm text-muted-foreground">Agrega vehículos para ver el rendimiento</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Convertir ingresos a miles para mejor visualización
  const chartData = performanceData.map(item => ({
    ...item,
    ingresosEnMiles: Math.round(item.ingresos / 1000)
  }));

  return (
    <Card className="border-0 shadow-lg automotive-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-automotive-blue" />
          <span>Rendimiento de Ventas</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis 
                dataKey="mesFormateado" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <ChartTooltip 
                content={<ChartTooltipContent />}
                formatter={(value: any, name: string) => {
                  if (name === 'ingresosEnMiles') {
                    return [`$${value}k MXN`, 'Ingresos (Miles)'];
                  }
                  return [value, chartConfig[name as keyof typeof chartConfig]?.label || name];
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="ventas"
                stroke={chartConfig.ventas.color}
                strokeWidth={2}
                dot={{ fill: chartConfig.ventas.color, strokeWidth: 2, r: 4 }}
                name="Ventas"
              />
              <Line
                type="monotone"
                dataKey="inventario"
                stroke={chartConfig.inventario.color}
                strokeWidth={2}
                dot={{ fill: chartConfig.inventario.color, strokeWidth: 2, r: 4 }}
                name="Inventario"
              />
              <Line
                type="monotone"
                dataKey="subastas"
                stroke={chartConfig.subastas.color}
                strokeWidth={2}
                dot={{ fill: chartConfig.subastas.color, strokeWidth: 2, r: 4 }}
                name="Subastas"
              />
              <Line
                type="monotone"
                dataKey="ingresosEnMiles"
                stroke={chartConfig.ingresos.color}
                strokeWidth={2}
                dot={{ fill: chartConfig.ingresos.color, strokeWidth: 2, r: 4 }}
                name="Ingresos (Miles MXN)"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default SalesPerformanceChart;
