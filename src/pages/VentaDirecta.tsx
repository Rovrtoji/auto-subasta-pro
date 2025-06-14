
import { useState } from 'react';
import { useVehicles } from '@/hooks/useVehicles';
import Header from '@/components/Header';
import VehicleCard from '@/components/VehicleCard';
import FilterSidebar from '@/components/FilterSidebar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';
import { FilterOptions, Vehicle } from '@/types';

const VentaDirecta = () => {
  const { data: vehicles = [], isLoading } = useVehicles();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Convertir los datos de la base de datos al formato esperado por la interfaz
  const mappedVehicles: Vehicle[] = vehicles.map(vehicle => ({
    id: vehicle.id,
    marca: vehicle.marca,
    modelo: vehicle.modelo,
    año: vehicle.año,
    kilometraje: vehicle.kilometraje,
    precio: Number(vehicle.precio),
    transmision: vehicle.transmision as 'Manual' | 'Automática',
    combustible: vehicle.combustible as 'Gasolina' | 'Diesel' | 'Híbrido' | 'Eléctrico',
    color: vehicle.color,
    imagen: vehicle.imagen || '/placeholder.svg',
    imagenes: vehicle.imagenes || [],
    descripcion: vehicle.descripcion || '',
    caracteristicas: vehicle.caracteristicas || [],
    enSubasta: vehicle.en_subasta,
    apartado: vehicle.apartado,
    fechaCreacion: new Date(vehicle.fecha_creacion),
    estadoGeneral: vehicle.estado_general as 'Excelente' | 'Muy Bueno' | 'Bueno' | 'Regular'
  }));

  // Filtrar vehículos que no están en subasta ni apartados
  const availableVehicles = mappedVehicles.filter(vehicle => 
    !vehicle.enSubasta && !vehicle.apartado
  );

  const filteredVehicles = availableVehicles.filter(vehicle => {
    const matchesSearch = 
      vehicle.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.modelo.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesBrand = !filters.marca || vehicle.marca === filters.marca;
    const matchesYear = (!filters.añoMin || vehicle.año >= filters.añoMin) &&
                       (!filters.añoMax || vehicle.año <= filters.añoMax);
    const matchesPrice = (!filters.precioMin || vehicle.precio >= filters.precioMin) &&
                        (!filters.precioMax || vehicle.precio <= filters.precioMax);
    const matchesKm = !filters.kilometrajeMax || vehicle.kilometraje <= filters.kilometrajeMax;
    const matchesTransmission = !filters.transmision || vehicle.transmision === filters.transmision;
    const matchesFuel = !filters.combustible || vehicle.combustible === filters.combustible;

    return matchesSearch && matchesBrand && matchesYear && matchesPrice && 
           matchesKm && matchesTransmission && matchesFuel;
  });

  const clearFilters = () => {
    setFilters({});
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Cargando vehículos...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Venta Directa</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explora nuestra selección de vehículos disponibles para compra inmediata. 
            Todos los vehículos han pasado por rigurosas inspecciones de calidad.
          </p>
        </div>

        <div className="mb-8">
          <div className="flex max-w-md mx-auto gap-2">
            <Input
              type="text"
              placeholder="Buscar por marca o modelo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button className="bg-automotive-blue hover:bg-automotive-blue/80">
              <Search className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden"
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex gap-8">
          <FilterSidebar 
            filters={filters}
            onFiltersChange={setFilters}
            onClearFilters={clearFilters}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />

          <main className="flex-1">
            {filteredVehicles.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  No se encontraron vehículos que coincidan con tu búsqueda.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVehicles.map((vehicle) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default VentaDirecta;
