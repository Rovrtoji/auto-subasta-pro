
import { useState } from 'react';
import { Gavel, Clock, Users, TrendingUp, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '../components/Header';
import VehicleCard from '../components/VehicleCard';
import AuctionTimer from '../components/AuctionTimer';
import { mockVehicles, mockAuctions } from '../data/mockData';

const Auctions = () => {
  const [filter, setFilter] = useState<'todas' | 'activas' | 'finalizando'>('todas');

  const auctionVehicles = mockVehicles.filter(v => v.enSubasta);
  const activeAuctions = mockAuctions.filter(a => a.activa);

  const filteredAuctions = activeAuctions.filter(auction => {
    if (filter === 'activas') return auction.activa;
    if (filter === 'finalizando') {
      const timeLeft = +auction.fechaFin - +new Date();
      return timeLeft < 2 * 60 * 60 * 1000; // Less than 2 hours
    }
    return true;
  });

  const handleBidOnAuction = (vehicleId: string) => {
    console.log('Bidding on vehicle:', vehicleId);
    // TODO: Implement bid functionality
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-red-600 to-red-800 text-white py-16">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="flex items-center justify-center space-x-3">
              <Gavel className="h-12 w-12" />
              <h1 className="text-4xl md:text-6xl font-bold">
                Subastas en Vivo
              </h1>
            </div>
            <p className="text-xl text-gray-100">
              Participa en subastas de vehículos seminuevos y consigue las mejores ofertas
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Tiempo Real</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Múltiples Participantes</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4" />
                <span>Mejores Precios</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container py-8 space-y-8">
        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-automotive-blue" />
            <h2 className="text-xl font-semibold">Filtrar Subastas</h2>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filter === 'todas' ? 'default' : 'outline'}
              onClick={() => setFilter('todas')}
              size="sm"
            >
              Todas ({activeAuctions.length})
            </Button>
            <Button
              variant={filter === 'activas' ? 'default' : 'outline'}
              onClick={() => setFilter('activas')}
              size="sm"
            >
              Activas ({activeAuctions.filter(a => a.activa).length})
            </Button>
            <Button
              variant={filter === 'finalizando' ? 'default' : 'outline'}
              onClick={() => setFilter('finalizando')}
              size="sm"
            >
              <Clock className="h-4 w-4 mr-1" />
              Finalizando Pronto
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-md border">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Gavel className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Subastas Activas</p>
                <p className="text-2xl font-bold text-gray-900">{activeAuctions.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Participantes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {activeAuctions.reduce((acc, auction) => acc + auction.participantes.length, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Valor Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Intl.NumberFormat('es-MX', {
                    style: 'currency',
                    currency: 'MXN',
                    maximumFractionDigits: 0
                  }).format(activeAuctions.reduce((acc, auction) => acc + auction.precioActual, 0))}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Finalizando Hoy</p>
                <p className="text-2xl font-bold text-gray-900">
                  {activeAuctions.filter(a => {
                    const timeLeft = +a.fechaFin - +new Date();
                    return timeLeft < 24 * 60 * 60 * 1000;
                  }).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Auctions Grid */}
        <div className="space-y-6">
          {filteredAuctions.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredAuctions.map((auction) => {
                const vehicle = auctionVehicles.find(v => v.id === auction.vehicleId);
                if (!vehicle) return null;

                return (
                  <div key={auction.id} className="space-y-4">
                    <VehicleCard
                      vehicle={vehicle}
                      showAuctionInfo={true}
                      onBid={handleBidOnAuction}
                    />
                    <AuctionTimer
                      endDate={auction.fechaFin}
                      currentPrice={auction.precioActual}
                      participants={auction.participantes.length}
                      vehicleId={vehicle.id}
                      onBid={() => handleBidOnAuction(vehicle.id)}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="space-y-4">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                  <Gavel className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-600">
                  No hay subastas activas
                </h3>
                <p className="text-gray-500">
                  Revisa más tarde o explora nuestros vehículos disponibles.
                </p>
                <Button onClick={() => window.location.href = '/'}>
                  Ver Vehículos Disponibles
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* How It Works */}
        <section className="bg-white rounded-lg shadow-md p-8 space-y-6">
          <h3 className="text-2xl font-bold text-center text-automotive-carbon">
            ¿Cómo Funcionan las Subastas?
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-3">
              <div className="mx-auto w-16 h-16 bg-automotive-blue rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h4 className="font-semibold">Regístrate</h4>
              <p className="text-sm text-gray-600">
                Crea tu cuenta y verifica tu identidad para participar en las subastas.
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="mx-auto w-16 h-16 bg-automotive-gold rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h4 className="font-semibold">Haz tu Puja</h4>
              <p className="text-sm text-gray-600">
                Observa el tiempo restante y realiza tu puja. Recibe notificaciones en tiempo real.
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="mx-auto w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h4 className="font-semibold">¡Gana!</h4>
              <p className="text-sm text-gray-600">
                Si tu puja es la más alta al finalizar, ¡el vehículo es tuyo!
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Auctions;
