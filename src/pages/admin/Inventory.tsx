
import { useState } from 'react';
import { Car, Plus, Filter, Search, Edit, Trash2, Eye, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Header from '../../components/Header';
import VehicleForm from '../../components/VehicleForm';
import { useVehicles } from '@/hooks/useVehicles';

const AdminInventory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  const { data: vehicles, isLoading, refetch } = useVehicles();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      maximumFractionDigits: 0
    }).format(price);
  };

  const filteredVehicles = vehicles?.filter(vehicle => {
    const matchesSearch = 
      vehicle.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.color.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterStatus === 'all') return matchesSearch;
    if (filterStatus === 'disponible') return matchesSearch && !vehicle.apartado && !vehicle.en_subasta;
    if (filterStatus === 'apartado') return matchesSearch && vehicle.apartado;
    if (filterStatus === 'subasta') return matchesSearch && vehicle.en_subasta;
    
    return matchesSearch;
  }) || [];

  const getStatusBadge = (vehicle: any) => {
    if (vehicle.apartado) {
      return <Badge className="bg-yellow-500">Apartado</Badge>;
    }
    if (vehicle.en_subasta) {
      return <Badge className="bg-red-500">En Subasta</Badge>;
    }
    return <Badge className="bg-green-500">Disponible</Badge>;
  };

  const handleCreateSuccess = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Header />
        <div className="container py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center space-y-2">
              <Car className="h-8 w-8 text-automotive-blue mx-auto animate-pulse" />
              <p>Cargando inventario...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      {/* Header */}
      <div className="bg-automotive-gradient text-white py-8">
        <div className="container">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => window.location.href = '/admin'}
                variant="ghost"
                className="text-white hover:bg-white/20 p-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-3">
                  <Car className="h-8 w-8" />
                  Gestión de Inventario
                </h1>
                <p className="text-gray-200 mt-2">Administra todos los vehículos del inventario</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{vehicles?.length || 0}</div>
              <div className="text-sm text-gray-200">Vehículos Totales</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Controls */}
        <Card className="border-0 shadow-lg automotive-card mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Filtros y Búsqueda</span>
              <Button 
                className="btn-premium"
                onClick={() => setShowCreateForm(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Vehículo
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por marca, modelo o color..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterStatus === 'all' ? 'default' : 'outline'}
                  onClick={() => setFilterStatus('all')}
                  size="sm"
                >
                  Todos
                </Button>
                <Button
                  variant={filterStatus === 'disponible' ? 'default' : 'outline'}
                  onClick={() => setFilterStatus('disponible')}
                  size="sm"
                >
                  Disponibles
                </Button>
                <Button
                  variant={filterStatus === 'apartado' ? 'default' : 'outline'}
                  onClick={() => setFilterStatus('apartado')}
                  size="sm"
                >
                  Apartados
                </Button>
                <Button
                  variant={filterStatus === 'subasta' ? 'default' : 'outline'}
                  onClick={() => setFilterStatus('subasta')}
                  size="sm"
                >
                  En Subasta
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vehicles Table */}
        <Card className="border-0 shadow-lg automotive-card">
          <CardHeader>
            <CardTitle>
              Inventario ({filteredVehicles.length} vehículos)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehículo</TableHead>
                  <TableHead>Detalles</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVehicles.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <img
                          src={vehicle.imagen || '/placeholder.svg'}
                          alt={`${vehicle.marca} ${vehicle.modelo}`}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div>
                          <p className="font-semibold">
                            {vehicle.marca} {vehicle.modelo}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {vehicle.año} • {vehicle.color}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm space-y-1">
                        <p><span className="font-medium">KM:</span> {vehicle.kilometraje?.toLocaleString()}</p>
                        <p><span className="font-medium">Transmisión:</span> {vehicle.transmision}</p>
                        <p><span className="font-medium">Combustible:</span> {vehicle.combustible}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-right">
                        <p className="text-lg font-bold text-automotive-gold">
                          {formatPrice(vehicle.precio)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(vehicle)}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedVehicle(vehicle)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Vehicle Details Modal */}
      <Dialog open={!!selectedVehicle} onOpenChange={() => setSelectedVehicle(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalles del Vehículo</DialogTitle>
          </DialogHeader>
          {selectedVehicle && (
            <div className="space-y-4">
              <div className="aspect-video w-full overflow-hidden rounded-lg">
                <img
                  src={selectedVehicle.imagen || '/placeholder.svg'}
                  alt={`${selectedVehicle.marca} ${selectedVehicle.modelo}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-lg">
                    {selectedVehicle.marca} {selectedVehicle.modelo}
                  </h3>
                  <p className="text-muted-foreground">{selectedVehicle.año}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-automotive-gold">
                    {formatPrice(selectedVehicle.precio)}
                  </p>
                  {getStatusBadge(selectedVehicle)}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <p><span className="font-medium">Kilometraje:</span> {selectedVehicle.kilometraje?.toLocaleString()} km</p>
                  <p><span className="font-medium">Transmisión:</span> {selectedVehicle.transmision}</p>
                  <p><span className="font-medium">Combustible:</span> {selectedVehicle.combustible}</p>
                </div>
                <div className="space-y-2">
                  <p><span className="font-medium">Color:</span> {selectedVehicle.color}</p>
                  <p><span className="font-medium">Estado:</span> {selectedVehicle.estado_general}</p>
                </div>
              </div>
              {selectedVehicle.descripcion && (
                <div>
                  <h4 className="font-medium mb-2">Descripción</h4>
                  <p className="text-sm text-muted-foreground">{selectedVehicle.descripcion}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Vehicle Modal */}
      <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <VehicleForm 
            onClose={() => setShowCreateForm(false)} 
            onSuccess={handleCreateSuccess}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminInventory;
