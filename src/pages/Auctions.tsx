
import { useState, useEffect } from 'react';
import { useAuctions } from '@/hooks/useAuctions';
import Header from '@/components/Header';
import VehicleCard from '@/components/VehicleCard';
import AuctionTimer from '@/components/AuctionTimer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, TrendingUp } from 'lucide-react';

const Auctions = () => {
  const { data: auctions = [], isLoading } = useAuctions();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Cargando subastas...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Subastas Activas</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Participa en nuestras emocionantes subastas de vehículos. 
            Encuentra ofertas increíbles y puја por el auto de tus sueños.
          </p>
        </div>

        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Subastas Activas</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{auctions.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Terminan Hoy</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {auctions.filter(auction => {
                    const today = new Date().toDateString();
                    const auctionEnd = new Date(auction.fecha_fin).toDateString();
                    return today === auctionEnd;
                  }).length}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Participantes</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {auctions.reduce((total, auction) => 
                    total + (auction.participantes?.length || 0), 0
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {auctions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No hay subastas activas en este momento.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {auctions.map((auction) => (
              <Card key={auction.id} className="overflow-hidden">
                <div className="relative">
                  <img
                    src={auction.vehicles?.imagen || '/placeholder.svg'}
                    alt={`${auction.vehicles?.marca} ${auction.vehicles?.modelo}`}
                    className="w-full h-48 object-cover"
                  />
                  <Badge className="absolute top-2 right-2 bg-red-500">
                    Subasta
                  </Badge>
                </div>
                
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-2">
                    {auction.vehicles?.marca} {auction.vehicles?.modelo} {auction.vehicles?.año}
                  </h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Precio inicial:</span>
                      <span className="font-medium">
                        ${auction.precio_inicial.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Puja actual:</span>
                      <span className="font-bold text-green-600">
                        ${auction.precio_actual.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Participantes:</span>
                      <span>{auction.participantes?.length || 0}</span>
                    </div>
                  </div>

                  <AuctionTimer endTime={new Date(auction.fecha_fin)} />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Auctions;
