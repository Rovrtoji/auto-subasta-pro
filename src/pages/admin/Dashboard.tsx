import { Car, TrendingUp, Clock, MapPin, Users, DollarSign, Package, Target } from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '../../components/Header';
import SalesPerformanceChart from '../../components/SalesPerformanceChart';
import SoldVehiclesModal from '../../components/SoldVehiclesModal';
import { mockDashboardStats, mockVehicles, mockAuctions } from '../../data/mockData';

const AdminDashboard = () => {
  const [showSoldVehicles, setShowSoldVehicles] = useState(false);
  const stats = mockDashboardStats;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      maximumFractionDigits: 0
    }).format(price);
  };

  const recentActivity = [
    { id: 1, type: 'sale', message: 'Toyota Camry vendido por $580,000', time: '10 min' },
    { id: 2, type: 'auction', message: 'Nueva puja en Honda Civic: $410,000', time: '15 min' },
    { id: 3, type: 'reservation', message: 'BMW Serie 3 apartado', time: '1 hora' },
    { id: 4, type: 'appointment', message: 'Cita agendada para Nissan Sentra', time: '2 horas' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      {/* Admin Header */}
      <div className="bg-automotive-gradient text-white py-8">
        <div className="container">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Panel Administrativo</h1>
              <p className="text-gray-200 mt-2">Gestión completa de AutoSubastaPro</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-200">Última actualización</p>
              <p className="font-semibold">Hace 5 minutos</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg automotive-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Vehículos</CardTitle>
              <Package className="h-4 w-4 text-automotive-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-automotive-carbon">{stats.totalVehiculos}</div>
              <p className="text-xs text-muted-foreground">En inventario</p>
            </CardContent>
          </Card>

          <Card 
            className="border-0 shadow-lg automotive-card cursor-pointer hover:shadow-xl transition-shadow"
            onClick={() => setShowSoldVehicles(true)}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vendidos</CardTitle>
              <Target className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.vehiculosVendidos}</div>
              <p className="text-xs text-muted-foreground">Este mes: {stats.ventasDelMes}</p>
              <p className="text-xs text-blue-600 mt-1 font-medium">Click para ver detalles</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg automotive-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Subasta</CardTitle>
              <Clock className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.vehiculosEnSubasta}</div>
              <p className="text-xs text-muted-foreground">Activas ahora</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg automotive-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
              <DollarSign className="h-4 w-4 text-automotive-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-automotive-gold">{formatPrice(stats.ingresosTotales)}</div>
              <p className="text-xs text-muted-foreground">Acumulado</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="border-0 shadow-lg automotive-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-automotive-blue" />
              <span>Acciones Rápidas</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button onClick={() => window.location.href = '/admin/inventory'} className="btn-premium h-auto p-4 flex-col space-y-2">
                <Car className="h-8 w-8" />
                <span>Gestionar Inventario</span>
              </Button>
              
              <Button 
                onClick={() => window.location.href = '/admin/auction-inventory'}
                variant="outline" 
                className="h-auto p-4 flex-col space-y-2 hover:bg-automotive-blue hover:text-white"
              >
                <Clock className="h-8 w-8" />
                <span>Inventario Subastas</span>
              </Button>
              
              <Button onClick={() => window.location.href = '/admin/chat-center'} variant="outline" className="h-auto p-4 flex-col space-y-2 hover:bg-automotive-gold hover:text-white">
                <Users className="h-8 w-8" />
                <span>Chat Center</span>
              </Button>
              
              <Button onClick={() => window.location.href = '/admin/calculator'} variant="outline" className="h-auto p-4 flex-col space-y-2 hover:bg-green-600 hover:text-white">
                <DollarSign className="h-8 w-8" />
                <span>Calculadora</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <Card className="border-0 shadow-lg automotive-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-automotive-blue" />
                <span>Actividad Reciente</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 bg-accent/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.type === 'sale' ? 'bg-green-500' :
                        activity.type === 'auction' ? 'bg-red-500' :
                        activity.type === 'reservation' ? 'bg-yellow-500' :
                        'bg-blue-500'
                      }`} />
                      <span className="text-sm">{activity.message}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {activity.time}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Active Auctions */}
          <Card className="border-0 shadow-lg automotive-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-red-600" />
                <span>Subastas Activas</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAuctions.map((auction) => {
                  const vehicle = mockVehicles.find(v => v.id === auction.vehicleId);
                  if (!vehicle) return null;

                  const timeLeft = +auction.fechaFin - +new Date();
                  const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));

                  return (
                    <div key={auction.id} className="flex items-center justify-between p-3 bg-accent/20 rounded-lg">
                      <div>
                        <p className="font-medium">{vehicle.marca} {vehicle.modelo}</p>
                        <p className="text-sm text-muted-foreground">
                          Precio actual: {formatPrice(auction.precioActual)}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant={hoursLeft < 2 ? 'destructive' : 'outline'}>
                          {hoursLeft < 24 ? `${hoursLeft}h restantes` : 'Varios días'}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {auction.participantes.length} participantes
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Chart */}
        <SalesPerformanceChart />
      </div>

      {/* Sold Vehicles Modal */}
      <SoldVehiclesModal 
        isOpen={showSoldVehicles}
        onClose={() => setShowSoldVehicles(false)}
      />
    </div>
  );
};

export default AdminDashboard;
