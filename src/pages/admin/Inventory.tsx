import { useState } from 'react';
import { useVehicles, useUpdateVehicle } from '@/hooks/useVehicles';
import { useDeleteVehicle } from '@/hooks/useDeleteVehicle';
import Header from '@/components/Header';
import AdminHeader from '@/components/AdminHeader';
import VehicleForm from '@/components/VehicleForm';
import VehicleEditForm from '@/components/VehicleEditForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Car, Plus, Search, MoreVertical, Edit, Trash2, Package, DollarSign, Clock, Eye } from 'lucide-react';
import { toast } from 'sonner';

const Inventory = () => {
  const { data: vehicles = [], isLoading } = useVehicles();
  const updateVehicle = useUpdateVehicle();
  const deleteVehicle = useDeleteVehicle();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<any>(null);

  // Filtrar solo vehículos de venta directa (no en subasta)
  const directSaleVehicles = vehicles.filter(vehicle => !vehicle.en_subasta);

  const filteredVehicles = directSaleVehicles.filter(vehicle =>
    vehicle.marca?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.modelo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.año?.toString().includes(searchTerm)
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleStatusChange = async (vehicleId: string, newStatus: string) => {
    try {
      const updates = {
        apartado: newStatus === 'apartado',
      };
      
      await updateVehicle.mutateAsync({ id: vehicleId, updates });
      toast.success('Estado actualizado exitosamente');
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Error al actualizar el estado');
    }
  };

  const handleDelete = async (vehicleId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este vehículo?')) {
      try {
        await deleteVehicle.mutateAsync(vehicleId);
        toast.success('Vehículo eliminado exitosamente');
      } catch (error) {
        console.error('Error deleting vehicle:', error);
        toast.error('Error al eliminar el vehículo');
      }
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

  const availableVehicles = directSaleVehicles.filter(v => !v.apartado);
  const reservedVehicles = directSaleVehicles.filter(v => v.apartado);

  const headerStats = [
    { label: 'Total Venta Directa', value: directSaleVehicles.length },
    { label: 'Disponibles', value: availableVehicles.length },
    { label: 'Apartados', value: reservedVehicles.length }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <AdminHeader 
        title="Inventario - Venta Directa"
        subtitle="Gestiona vehículos disponibles para venta directa"
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
                Agregar Vehículo
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
              <CardTitle className="text-sm font-medium">Total Venta Directa</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{directSaleVehicles.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Disponibles</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{availableVehicles.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Apartados</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{reservedVehicles.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Vehículos */}
        {filteredVehicles.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500 text-lg mb-4">
                {searchTerm ? 'No se encontraron vehículos que coincidan con tu búsqueda.' : 'No hay vehículos de venta directa en el inventario.'}
              </p>
              {!searchTerm && (
                <Button 
                  onClick={() => setShowCreateForm(true)}
                  className="bg-automotive-blue hover:bg-automotive-blue/90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Primer Vehículo
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map((vehicle) => {
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
                    <Badge 
                      className={`absolute top-2 right-2 ${
                        vehicle.apartado ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                    >
                      {vehicle.apartado ? 'Apartado' : 'Disponible'}
                    </Badge>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 left-2 h-8 w-8 p-0 bg-white/80 hover:bg-white"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        <DropdownMenuItem onClick={() => setEditingVehicle(vehicle)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleStatusChange(
                            vehicle.id, 
                            vehicle.apartado ? 'disponible' : 'apartado'
                          )}
                        >
                          <Clock className="h-4 w-4 mr-2" />
                          {vehicle.apartado ? 'Marcar Disponible' : 'Marcar Apartado'}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(vehicle.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold mb-2">
                      {vehicle.marca} {vehicle.modelo} {vehicle.año}
                    </h3>
                    
                    <div className="space-y-2">
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
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Transmisión:</span>
                        <span>{vehicle.transmision}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal para crear vehículo */}
      <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <VehicleForm 
            onClose={() => setShowCreateForm(false)}
            onSuccess={() => setShowCreateForm(false)}
            forAuction={false}
          />
        </DialogContent>
      </Dialog>

      {/* Modal para editar vehículo */}
      <Dialog open={!!editingVehicle} onOpenChange={() => setEditingVehicle(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {editingVehicle && (
            <VehicleEditForm 
              vehicle={editingVehicle}
              onClose={() => setEditingVehicle(null)}
              onSuccess={() => setEditingVehicle(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Inventory;
