import { useState } from 'react';
import { useVehicles } from '@/hooks/useVehicles';
import { useCreateAuction } from '@/hooks/useCreateAuction';
import Header from '@/components/Header';
import AdminHeader from '@/components/AdminHeader';
import AuctionVehicleForm from '@/components/AuctionVehicleForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, DollarSign, Car, Search, Plus } from 'lucide-react';
import { toast } from 'sonner';

const AuctionInventory = () => {
  const { data: vehicles = [], isLoading } = useVehicles();
  const createAuction = useCreateAuction();
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [auctionData, setAuctionData] = useState({
    precioInicial: '',
    fechaInicio: '',
    fechaFin: '',
  });

  // Filtrar vehículos disponibles para subasta (no apartados, no en subasta)
  const availableVehicles = vehicles.filter(vehicle => 
    !vehicle.apartado && 
    !vehicle.en_subasta &&
    (vehicle.marca?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     vehicle.modelo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     vehicle.año?.toString().includes(searchTerm))
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleCreateAuction = async () => {
    if (!selectedVehicle || !auctionData.precioInicial || !auctionData.fechaInicio || !auctionData.fechaFin) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    const now = new Date();
    const fechaInicio = new Date(auctionData.fechaInicio);
    const fechaFin = new Date(auctionData.fechaFin);

    if (fechaInicio < now) {
      toast.error('La fecha de inicio debe ser futura');
      return;
    }

    if (fechaFin <= fechaInicio) {
      toast.error('La fecha de fin debe ser posterior a la fecha de inicio');
      return;
    }

    try {
      await createAuction.mutateAsync({
        vehicleId: selectedVehicle.id,
        precioInicial: parseFloat(auctionData.precioInicial),
        fechaInicio,
        fechaFin,
      });

      setSelectedVehicle(null);
      setAuctionData({
        precioInicial: '',
        fechaInicio: '',
        fechaFin: '',
      });
      toast.success('Subasta creada exitosamente');
    } catch (error) {
      console.error('Error creating auction:', error);
      toast.error('Error al crear la subasta');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Cargando inventario...</div>
        </div>
      </div>
    );
  }

  const headerStats = [
    { label: 'Total Vehículos', value: vehicles.length },
    { label: 'Disponibles para Subasta', value: availableVehicles.length },
    { label: 'En Subasta', value: vehicles.filter(v => v.en_subasta).length }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <AdminHeader 
        title="Inventario para Subastas"
        subtitle="Gestiona vehículos destinados a subastas y crea nuevas subastas"
        stats={headerStats}
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <Button 
                onClick={() => setShowCreateForm(true)}
                className="bg-automotive-blue hover:bg-automotive-blue/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Crear Vehículo y Subasta
              </Button>
            </div>
          </div>
        </div>

        {/* Búsqueda */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por marca, modelo o año..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Vehículos</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{vehicles.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Disponibles para Subasta</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{availableVehicles.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Subasta</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {vehicles.filter(v => v.en_subasta).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Vehículos */}
        {availableVehicles.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500 text-lg mb-4">
                No hay vehículos disponibles para subasta en este momento.
              </p>
              <Button 
                onClick={() => setShowCreateForm(true)}
                className="bg-automotive-blue hover:bg-automotive-blue/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Crear Primer Vehículo
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableVehicles.map((vehicle) => {
              const imageUrl = vehicle.imagenes?.[0] || vehicle.imagen || '/placeholder.svg';
              
              return (
                <Card key={vehicle.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img
                      src={imageUrl}
                      alt={`${vehicle.marca} ${vehicle.modelo}`}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        console.log('Image failed to load:', imageUrl);
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                    <Badge className="absolute top-2 right-2 bg-green-500">
                      Disponible
                    </Badge>
                  </div>
                  
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold mb-2">
                      {vehicle.marca} {vehicle.modelo} {vehicle.año}
                    </h3>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Precio:</span>
                        <span className="font-medium">
                          {formatPrice(vehicle.precio)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Kilometraje:</span>
                        <span>{vehicle.kilometraje?.toLocaleString()} km</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Estado:</span>
                        <span>{vehicle.estado_general}</span>
                      </div>
                    </div>

                    <Button 
                      onClick={() => setSelectedVehicle(vehicle)}
                      className="w-full bg-automotive-blue hover:bg-automotive-blue/90"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Crear Subasta
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal para crear vehículo y subasta */}
      <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <AuctionVehicleForm 
            onClose={() => setShowCreateForm(false)}
            onSuccess={() => setShowCreateForm(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Modal para crear subasta */}
      <Dialog open={!!selectedVehicle} onOpenChange={() => setSelectedVehicle(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Crear Nueva Subasta</DialogTitle>
          </DialogHeader>
          {selectedVehicle && (
            <div className="space-y-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold">
                  {selectedVehicle.marca} {selectedVehicle.modelo}
                </h3>
                <p className="text-muted-foreground">{selectedVehicle.año}</p>
                <p className="text-sm text-gray-600">
                  Precio actual: {formatPrice(selectedVehicle.precio)}
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="precioInicial">Precio Inicial de Subasta (MXN)</Label>
                <Input
                  id="precioInicial"
                  type="number"
                  placeholder="Ej. 150000"
                  value={auctionData.precioInicial}
                  onChange={(e) => setAuctionData(prev => ({
                    ...prev,
                    precioInicial: e.target.value
                  }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fechaInicio">Fecha y Hora de Inicio</Label>
                <Input
                  id="fechaInicio"
                  type="datetime-local"
                  value={auctionData.fechaInicio}
                  onChange={(e) => setAuctionData(prev => ({
                    ...prev,
                    fechaInicio: e.target.value
                  }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fechaFin">Fecha y Hora de Fin</Label>
                <Input
                  id="fechaFin"
                  type="datetime-local"
                  value={auctionData.fechaFin}
                  onChange={(e) => setAuctionData(prev => ({
                    ...prev,
                    fechaFin: e.target.value
                  }))}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setSelectedVehicle(null)}
                >
                  Cancelar
                </Button>
                <Button 
                  className="flex-1 bg-automotive-blue hover:bg-automotive-blue/90"
                  onClick={handleCreateAuction}
                  disabled={createAuction.isPending}
                >
                  {createAuction.isPending ? 'Creando...' : 'Crear Subasta'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AuctionInventory;
