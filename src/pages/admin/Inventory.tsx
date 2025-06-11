
import { useState } from 'react';
import { Plus, Edit, Trash2, Car, Search, Filter, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header from '../../components/Header';
import { mockVehicles } from '../../data/mockData';
import { Vehicle } from '../../types';

const AdminInventory = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('todos');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isAddingVehicle, setIsAddingVehicle] = useState(false);

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = 
      vehicle.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.modelo.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filterStatus === 'todos' ||
      (filterStatus === 'disponible' && !vehicle.enSubasta && !vehicle.apartado) ||
      (filterStatus === 'subasta' && vehicle.enSubasta) ||
      (filterStatus === 'apartado' && vehicle.apartado);

    return matchesSearch && matchesFilter;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(price);
  };

  const getStatusBadge = (vehicle: Vehicle) => {
    if (vehicle.apartado) {
      return <Badge className="bg-yellow-500">Apartado</Badge>;
    }
    if (vehicle.enSubasta) {
      return <Badge className="bg-red-500">En Subasta</Badge>;
    }
    return <Badge className="bg-green-500">Disponible</Badge>;
  };

  const handleDeleteVehicle = (id: string) => {
    setVehicles(vehicles.filter(v => v.id !== id));
  };

  const VehicleForm = ({ vehicle, onClose }: { vehicle?: Vehicle; onClose: () => void }) => {
    const [formData, setFormData] = useState({
      marca: vehicle?.marca || '',
      modelo: vehicle?.modelo || '',
      año: vehicle?.año || new Date().getFullYear(),
      precio: vehicle?.precio || 0,
      kilometraje: vehicle?.kilometraje || 0,
      transmision: vehicle?.transmision || 'Automática',
      combustible: vehicle?.combustible || 'Gasolina',
      color: vehicle?.color || '',
      descripcion: vehicle?.descripcion || '',
      imagen: vehicle?.imagen || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // TODO: Save vehicle logic
      console.log('Saving vehicle:', formData);
      onClose();
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Marca</label>
            <Input 
              value={formData.marca}
              onChange={(e) => setFormData({...formData, marca: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Modelo</label>
            <Input 
              value={formData.modelo}
              onChange={(e) => setFormData({...formData, modelo: e.target.value})}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Año</label>
            <Input 
              type="number"
              value={formData.año}
              onChange={(e) => setFormData({...formData, año: parseInt(e.target.value)})}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Precio</label>
            <Input 
              type="number"
              value={formData.precio}
              onChange={(e) => setFormData({...formData, precio: parseInt(e.target.value)})}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Kilometraje</label>
            <Input 
              type="number"
              value={formData.kilometraje}
              onChange={(e) => setFormData({...formData, kilometraje: parseInt(e.target.value)})}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Transmisión</label>
            <Select value={formData.transmision} onValueChange={(value) => setFormData({...formData, transmision: value as any})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Manual">Manual</SelectItem>
                <SelectItem value="Automática">Automática</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Combustible</label>
            <Select value={formData.combustible} onValueChange={(value) => setFormData({...formData, combustible: value as any})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Gasolina">Gasolina</SelectItem>
                <SelectItem value="Diesel">Diesel</SelectItem>
                <SelectItem value="Híbrido">Híbrido</SelectItem>
                <SelectItem value="Eléctrico">Eléctrico</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Color</label>
          <Input 
            value={formData.color}
            onChange={(e) => setFormData({...formData, color: e.target.value})}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">URL de Imagen</label>
          <Input 
            value={formData.imagen}
            onChange={(e) => setFormData({...formData, imagen: e.target.value})}
            placeholder="https://..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Descripción</label>
          <textarea 
            className="w-full p-2 border rounded-md"
            rows={3}
            value={formData.descripcion}
            onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
          />
        </div>

        <div className="flex space-x-2 pt-4">
          <Button type="submit" className="btn-premium">
            {vehicle ? 'Actualizar' : 'Agregar'} Vehículo
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </form>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      {/* Admin Header */}
      <div className="bg-automotive-gradient text-white py-8">
        <div className="container">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Gestión de Inventario</h1>
              <p className="text-gray-200 mt-2">Administra todos los vehículos del sistema</p>
            </div>
            <Dialog open={isAddingVehicle} onOpenChange={setIsAddingVehicle}>
              <DialogTrigger asChild>
                <Button className="bg-white text-automotive-blue hover:bg-gray-100">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Vehículo
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Agregar Nuevo Vehículo</DialogTitle>
                </DialogHeader>
                <VehicleForm onClose={() => setIsAddingVehicle(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="container py-8 space-y-6">
        {/* Controls */}
        <Card className="border-0 shadow-lg automotive-card">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-3 flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar por marca o modelo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-80"
                  />
                </div>
                
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los estados</SelectItem>
                    <SelectItem value="disponible">Disponibles</SelectItem>
                    <SelectItem value="subasta">En Subasta</SelectItem>
                    <SelectItem value="apartado">Apartados</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="text-sm text-muted-foreground">
                {filteredVehicles.length} de {vehicles.length} vehículos
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vehicles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map((vehicle) => (
            <Card key={vehicle.id} className="border-0 shadow-lg automotive-card overflow-hidden">
              <div className="relative">
                <img
                  src={vehicle.imagen}
                  alt={`${vehicle.marca} ${vehicle.modelo}`}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 left-3">
                  {getStatusBadge(vehicle)}
                </div>
              </div>
              
              <CardContent className="p-4 space-y-3">
                <div>
                  <h3 className="font-bold text-lg text-automotive-carbon">
                    {vehicle.marca} {vehicle.modelo}
                  </h3>
                  <p className="text-automotive-gold font-semibold">
                    {formatPrice(vehicle.precio)}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                  <div>Año: {vehicle.año}</div>
                  <div>KM: {vehicle.kilometraje.toLocaleString()}</div>
                  <div>Transmisión: {vehicle.transmision}</div>
                  <div>Combustible: {vehicle.combustible}</div>
                </div>

                <div className="flex space-x-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedVehicle(vehicle)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Editar Vehículo</DialogTitle>
                      </DialogHeader>
                      <VehicleForm 
                        vehicle={vehicle} 
                        onClose={() => {}} 
                      />
                    </DialogContent>
                  </Dialog>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteVehicle(vehicle.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredVehicles.length === 0 && (
          <div className="text-center py-12">
            <div className="space-y-4">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                <Car className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600">
                No se encontraron vehículos
              </h3>
              <p className="text-gray-500">
                Intenta ajustar tus filtros de búsqueda o agrega un nuevo vehículo.
              </p>
              <Button onClick={() => setIsAddingVehicle(true)} className="btn-premium">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Primer Vehículo
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Vehicle Detail Dialog */}
      <Dialog open={!!selectedVehicle} onOpenChange={() => setSelectedVehicle(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalles del Vehículo</DialogTitle>
          </DialogHeader>
          {selectedVehicle && (
            <div className="space-y-4">
              <img
                src={selectedVehicle.imagen}
                alt={`${selectedVehicle.marca} ${selectedVehicle.modelo}`}
                className="w-full h-64 object-cover rounded-lg"
              />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><strong>Marca:</strong> {selectedVehicle.marca}</div>
                <div><strong>Modelo:</strong> {selectedVehicle.modelo}</div>
                <div><strong>Año:</strong> {selectedVehicle.año}</div>
                <div><strong>Precio:</strong> {formatPrice(selectedVehicle.precio)}</div>
                <div><strong>Kilometraje:</strong> {selectedVehicle.kilometraje.toLocaleString()} km</div>
                <div><strong>Color:</strong> {selectedVehicle.color}</div>
                <div><strong>Transmisión:</strong> {selectedVehicle.transmision}</div>
                <div><strong>Combustible:</strong> {selectedVehicle.combustible}</div>
              </div>
              <div>
                <strong>Descripción:</strong>
                <p className="mt-1 text-sm text-muted-foreground">{selectedVehicle.descripcion}</p>
              </div>
              <div>
                <strong>Estado:</strong>
                <div className="mt-1">{getStatusBadge(selectedVehicle)}</div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminInventory;
