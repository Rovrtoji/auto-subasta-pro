
import { useState, useEffect } from 'react';
import { useAuctions } from '@/hooks/useAuctions';
import { useCreateBid } from '@/hooks/useAuctions';
import Header from '@/components/Header';
import VehicleCard from '@/components/VehicleCard';
import AuctionTimer from '@/components/AuctionTimer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Clock, Users, TrendingUp, DollarSign } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

const Auctions = () => {
  const { data: auctions = [], isLoading } = useAuctions();
  const createBid = useCreateBid();
  const [selectedAuction, setSelectedAuction] = useState<any>(null);
  const [bidAmount, setBidAmount] = useState('');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      maximumFractionDigits: 0
    }).format(price);
  };

  const handlePlaceBid = async () => {
    if (!selectedAuction || !bidAmount) {
      toast.error('Por favor ingresa un monto válido');
      return;
    }

    const amount = parseFloat(bidAmount);
    if (amount <= selectedAuction.precio_actual) {
      toast.error(`La puja debe ser mayor a ${formatPrice(selectedAuction.precio_actual)}`);
      return;
    }

    try {
      await createBid.mutateAsync({
        auction_id: selectedAuction.id,
        cantidad: amount,
        user_id: 'temp-user-id', // TODO: Replace with actual user ID when auth is implemented
        user_name: 'Usuario Anónimo', // TODO: Replace with actual user name
      });
      
      toast.success('¡Puja realizada exitosamente!');
      setSelectedAuction(null);
      setBidAmount('');
    } catch (error) {
      console.error('Error placing bid:', error);
      toast.error('Error al realizar la puja');
    }
  };

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
            Encuentra ofertas increíbles y puja por el auto de tus sueños.
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
              <Card key={auction.id} className="overflow-hidden hover:shadow-lg transition-shadow">
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
                        {formatPrice(auction.precio_inicial)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Puja actual:</span>
                      <span className="font-bold text-green-600">
                        {formatPrice(auction.precio_actual)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Participantes:</span>
                      <span>{auction.participantes?.length || 0}</span>
                    </div>
                  </div>

                  <AuctionTimer endTime={new Date(auction.fecha_fin)} />
                  
                  <div className="mt-4 flex gap-2">
                    <Button 
                      onClick={() => setSelectedAuction(auction)}
                      className="flex-1 bg-automotive-blue hover:bg-automotive-blue/90"
                    >
                      <DollarSign className="h-4 w-4 mr-2" />
                      Pujar
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Ver Detalles
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Bid Modal */}
      <Dialog open={!!selectedAuction} onOpenChange={() => setSelectedAuction(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Realizar Puja</DialogTitle>
          </DialogHeader>
          {selectedAuction && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold">
                  {selectedAuction.vehicles?.marca} {selectedAuction.vehicles?.modelo}
                </h3>
                <p className="text-muted-foreground">{selectedAuction.vehicles?.año}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Puja actual:</span>
                  <span className="font-bold text-green-600">
                    {formatPrice(selectedAuction.precio_actual)}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Mínimo siguiente:</span>
                  <span>{formatPrice(selectedAuction.precio_actual + 1000)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Tu puja (MXN)</label>
                <Input
                  type="number"
                  placeholder={`Mínimo ${selectedAuction.precio_actual + 1000}`}
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  min={selectedAuction.precio_actual + 1000}
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setSelectedAuction(null)}
                >
                  Cancelar
                </Button>
                <Button 
                  className="flex-1 bg-automotive-blue hover:bg-automotive-blue/90"
                  onClick={handlePlaceBid}
                  disabled={createBid.isPending}
                >
                  {createBid.isPending ? 'Pujando...' : 'Confirmar Puja'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Auctions;
