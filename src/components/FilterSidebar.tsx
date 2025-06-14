
import { useState, useMemo } from 'react';
import { Search, Filter, X, Car, DollarSign, Calendar, Fuel, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { FilterOptions } from '../types';
import { useVehicles } from '../hooks/useVehicles';

interface FilterSidebarProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onClearFilters: () => void;
  isOpen: boolean;
  onClose: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const FilterSidebar = ({ 
  filters, 
  onFiltersChange, 
  onClearFilters, 
  isOpen, 
  onClose,
  searchTerm,
  onSearchChange 
}: FilterSidebarProps) => {
  const { data: vehicles = [] } = useVehicles();
  
  // Generate dynamic options from actual vehicle data
  const dynamicOptions = useMemo(() => {
    const marcas = [...new Set(vehicles.map(v => v.marca))].sort();
    const años = [...new Set(vehicles.map(v => v.año))].sort((a, b) => b - a);
    const transmisiones = [...new Set(vehicles.map(v => v.transmision))].sort();
    const combustibles = [...new Set(vehicles.map(v => v.combustible))].sort();
    
    const precios = vehicles.map(v => v.precio).filter(p => p > 0);
    const kilometrajes = vehicles.map(v => v.kilometraje).filter(k => k > 0);
    
    const maxPrecio = precios.length > 0 ? Math.max(...precios) : 2000000;
    const maxKilometraje = kilometrajes.length > 0 ? Math.max(...kilometrajes) : 200000;
    const minAño = años.length > 0 ? Math.min(...años) : 2010;
    const maxAño = años.length > 0 ? Math.max(...años) : new Date().getFullYear();

    return {
      marcas,
      años,
      transmisiones,
      combustibles,
      maxPrecio,
      maxKilometraje,
      minAño,
      maxAño
    };
  }, [vehicles]);

  const [priceRange, setPriceRange] = useState([
    filters.precioMin || 0, 
    filters.precioMax || dynamicOptions.maxPrecio
  ]);
  const [yearRange, setYearRange] = useState([
    filters.añoMin || dynamicOptions.minAño, 
    filters.añoMax || dynamicOptions.maxAño
  ]);
  const [kmRange, setKmRange] = useState([
    0, 
    filters.kilometrajeMax || dynamicOptions.maxKilometraje
  ]);

  const handlePriceChange = (values: number[]) => {
    setPriceRange(values);
    onFiltersChange({
      ...filters,
      precioMin: values[0],
      precioMax: values[1]
    });
  };

  const handleYearChange = (values: number[]) => {
    setYearRange(values);
    onFiltersChange({
      ...filters,
      añoMin: values[0],
      añoMax: values[1]
    });
  };

  const handleKmChange = (values: number[]) => {
    setKmRange(values);
    onFiltersChange({
      ...filters,
      kilometrajeMax: values[1]
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatKm = (km: number) => {
    return new Intl.NumberFormat('es-MX').format(km) + ' km';
  };

  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-80 bg-background border-r border-border transform transition-transform duration-300 ease-in-out ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    } lg:translate-x-0 lg:static lg:z-auto`}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-automotive-blue" />
            <h2 className="font-semibold text-lg">Filtros</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="lg:hidden">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Filters Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Search */}
          <div className="space-y-2">
            <Label className="flex items-center space-x-2">
              <Search className="h-4 w-4" />
              <span>Buscar</span>
            </Label>
            <Input
              placeholder="Marca, modelo, color..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full"
            />
          </div>

          <Separator />

          {/* Brand Filter */}
          <div className="space-y-2">
            <Label className="flex items-center space-x-2">
              <Car className="h-4 w-4" />
              <span>Marca</span>
            </Label>
            <Select 
              value={filters.marca || 'all'} 
              onValueChange={(value) => 
                onFiltersChange({ ...filters, marca: value === 'all' ? undefined : value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Todas las marcas" />
              </SelectTrigger>
              <SelectContent className="bg-background border border-border z-50">
                <SelectItem value="all">Todas las marcas</SelectItem>
                {dynamicOptions.marcas.map((marca) => (
                  <SelectItem key={marca} value={marca}>{marca}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Price Range */}
          <div className="space-y-3">
            <Label className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4" />
              <span>Precio</span>
            </Label>
            <div className="px-2">
              <Slider
                value={priceRange}
                onValueChange={handlePriceChange}
                max={dynamicOptions.maxPrecio}
                min={0}
                step={50000}
                className="w-full"
              />
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{formatPrice(priceRange[0])}</span>
              <span>{formatPrice(priceRange[1])}</span>
            </div>
          </div>

          {/* Year Range */}
          <div className="space-y-3">
            <Label className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Año</span>
            </Label>
            <div className="px-2">
              <Slider
                value={yearRange}
                onValueChange={handleYearChange}
                max={dynamicOptions.maxAño}
                min={dynamicOptions.minAño}
                step={1}
                className="w-full"
              />
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{yearRange[0]}</span>
              <span>{yearRange[1]}</span>
            </div>
          </div>

          {/* Kilometers */}
          <div className="space-y-3">
            <Label>Kilometraje máximo</Label>
            <div className="px-2">
              <Slider
                value={kmRange}
                onValueChange={handleKmChange}
                max={dynamicOptions.maxKilometraje}
                min={0}
                step={10000}
                className="w-full"
              />
            </div>
            <div className="text-center text-sm text-muted-foreground">
              Hasta {formatKm(kmRange[1])}
            </div>
          </div>

          {/* Transmission */}
          <div className="space-y-2">
            <Label className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Transmisión</span>
            </Label>
            <Select 
              value={filters.transmision || 'all'} 
              onValueChange={(value) => 
                onFiltersChange({ ...filters, transmision: value === 'all' ? undefined : value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Cualquiera" />
              </SelectTrigger>
              <SelectContent className="bg-background border border-border z-50">
                <SelectItem value="all">Cualquiera</SelectItem>
                {dynamicOptions.transmisiones.map((transmision) => (
                  <SelectItem key={transmision} value={transmision}>{transmision}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Fuel Type */}
          <div className="space-y-2">
            <Label className="flex items-center space-x-2">
              <Fuel className="h-4 w-4" />
              <span>Combustible</span>
            </Label>
            <Select 
              value={filters.combustible || 'all'} 
              onValueChange={(value) => 
                onFiltersChange({ ...filters, combustible: value === 'all' ? undefined : value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Cualquiera" />
              </SelectTrigger>
              <SelectContent className="bg-background border border-border z-50">
                <SelectItem value="all">Cualquiera</SelectItem>
                {dynamicOptions.combustibles.map((combustible) => (
                  <SelectItem key={combustible} value={combustible}>{combustible}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={onClearFilters}
          >
            Limpiar Filtros
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
