
import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '../components/Header';
import VehicleCard from '../components/VehicleCard';
import FilterSidebar from '../components/FilterSidebar';
import { mockVehicles } from '../data/mockData';
import { FilterOptions } from '../types';

const VentaDirecta = () => {
  const [searchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({});

  // Filtrar solo vehículos que NO están en subasta
  const ventaDirectaVehicles = useMemo(() => {
    return mockVehicles.filter(vehicle => !vehicle.enSubasta);
  }, []);

  const filteredVehicles = useMemo(() => {
    return ventaDirectaVehicles.filter(vehicle => {
      // Filtro por marca
      if (filters.marca && vehicle.marca !== filters.marca) return false;
      
      // Filtro por precio
      if (filters.precioMin && vehicle.precio < filters.precioMin) return false;
      if (filters.precioMax && vehicle.precio > filters.precioMax) return false;
      
      // Filtro por año
      if (filters.añoMin && vehicle.año < filters.añoMin) return false;
      if (filters.añoMax && vehicle.año > filters.añoMax) return false;
      
      // Filtro por kilometraje
      if (filters.kilometrajeMax && vehicle.kilometraje > filters.kilometrajeMax) return false;
      
      // Filtro por transmisión
      if (filters.transmision && vehicle.transmision !== filters.transmision) return false;
      
      // Filtro por combustible
      if (filters.combustible && vehicle.combustible !== filters.combustible) return false;

      // Filtro por URL params (tipo de vehículo)
      const filterParam = searchParams.get('filter');
      if (filterParam) {
        // Aquí puedes agregar lógica para filtrar por tipo de vehículo
        // Por ahora solo filtramos si el modelo contiene el tipo
        const searchTerm = filterParam.toLowerCase();
        const vehicleInfo = `${vehicle.marca} ${vehicle.modelo}`.toLowerCase();
        if (!vehicleInfo.includes(searchTerm)) return false;
      }
      
      return true;
    });
  }, [ventaDirectaVehicles, filters, searchParams]);

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-automotive-gradient text-white py-12">
        <div className="container">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-4">Venta Directa</h1>
              <p className="text-xl text-gray-200">
                Compra tu vehículo seminuevo al mejor precio, sin subastas
              </p>
              <div className="mt-4 flex items-center space-x-4 text-gray-200">
                <div className="flex items-center space-x-2">
                  <ShoppingCart className="h-5 w-5" />
                  <span>{filteredVehicles.length} vehículos disponibles</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="flex gap-8">
          {/* Sidebar Filter */}
          <div className="hidden lg:block">
            <FilterSidebar
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
              isOpen={true}
              onClose={() => {}}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-6">
              <Button
                variant="outline"
                onClick={() => setIsFilterOpen(true)}
                className="flex items-center space-x-2"
              >
                <Filter className="h-4 w-4" />
                <span>Filtros</span>
              </Button>
            </div>

            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-automotive-carbon">
                Vehículos en Venta Directa
              </h2>
              <div className="text-muted-foreground">
                {filteredVehicles.length} resultados
              </div>
            </div>

            {/* Vehicles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredVehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>

            {/* No Results */}
            {filteredVehicles.length === 0 && (
              <div className="text-center py-12">
                <div className="space-y-4">
                  <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                    <ShoppingCart className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-600">
                    No se encontraron vehículos
                  </h3>
                  <p className="text-gray-500">
                    Intenta ajustar tus filtros de búsqueda.
                  </p>
                  <Button onClick={handleClearFilters} variant="outline">
                    Limpiar Filtros
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Sidebar */}
      <FilterSidebar
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
      />
    </div>
  );
};

export default VentaDirecta;
