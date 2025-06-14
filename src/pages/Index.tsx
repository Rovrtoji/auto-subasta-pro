import { useState, useMemo } from 'react';
import { Filter, Grid, List, Search, Gavel, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Header from '../components/Header';
import VehicleCard from '../components/VehicleCard';
import FilterSidebar from '../components/FilterSidebar';
import AppointmentForm from '../components/AppointmentForm';
import ReservationForm from '../components/ReservationForm';
import AuctionTimer from '../components/AuctionTimer';
import { mockVehicles, mockAuctions } from '../data/mockData';
import { FilterOptions, Vehicle } from '../types';
import PaymentModal from '../components/PaymentModal';

const Index = () => {
  const [filters, setFilters] = useState<FilterOptions>({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [appointmentVehicle, setAppointmentVehicle] = useState<Vehicle | null>(null);
  const [reservationVehicle, setReservationVehicle] = useState<Vehicle | null>(null);
  const [paymentVehicle, setPaymentVehicle] = useState<Vehicle | null>(null);

  // Filter vehicles based on filters and search
  const filteredVehicles = useMemo(() => {
    return mockVehicles.filter(vehicle => {
      // Search term filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matches = 
          vehicle.marca.toLowerCase().includes(searchLower) ||
          vehicle.modelo.toLowerCase().includes(searchLower) ||
          vehicle.color.toLowerCase().includes(searchLower);
        if (!matches) return false;
      }

      // Brand filter
      if (filters.marca && vehicle.marca !== filters.marca) return false;

      // Year filter
      if (filters.añoMin && vehicle.año < filters.añoMin) return false;
      if (filters.añoMax && vehicle.año > filters.añoMax) return false;

      // Price filter
      if (filters.precioMin && vehicle.precio < filters.precioMin) return false;
      if (filters.precioMax && vehicle.precio > filters.precioMax) return false;

      // Kilometers filter
      if (filters.kilometrajeMax && vehicle.kilometraje > filters.kilometrajeMax) return false;

      // Transmission filter
      if (filters.transmision && vehicle.transmision !== filters.transmision) return false;

      // Fuel type filter
      if (filters.combustible && vehicle.combustible !== filters.combustible) return false;

      return true;
    });
  }, [filters, searchTerm]);

  const auctionVehicles = filteredVehicles.filter(v => v.enSubasta);
  const regularVehicles = filteredVehicles.filter(v => !v.enSubasta);

  const handleScheduleAppointment = (vehicleId: string) => {
    const vehicle = mockVehicles.find(v => v.id === vehicleId);
    if (vehicle) {
      setAppointmentVehicle(vehicle);
    }
  };

  const handleReserveVehicle = (vehicleId: string) => {
    const vehicle = mockVehicles.find(v => v.id === vehicleId);
    if (vehicle && !vehicle.apartado) {
      setReservationVehicle(vehicle);
    }
  };

  const handlePaymentModal = (vehicleId: string) => {
    const vehicle = mockVehicles.find(v => v.id === vehicleId);
    if (vehicle && !vehicle.apartado) {
      setPaymentVehicle(vehicle);
    }
  };

  const handleBidOnAuction = (vehicleId: string) => {
    console.log('Bidding on vehicle:', vehicleId);
    // TODO: Implement bid functionality
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length + (searchTerm ? 1 : 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-automotive-gradient text-white py-16">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold">
              Encuentra tu Auto
              <span className="block text-automotive-gold">Seminuevo Perfecto</span>
            </h1>
            <p className="text-xl text-gray-200">
              Descubre una amplia selección de vehículos seminuevos de calidad premium. 
              Apartados, citas y subastas en tiempo real.
            </p>
            
            {/* Hero Search */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar marca, modelo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/90 border-0 text-gray-900"
                />
              </div>
              <Button className="bg-automotive-gold hover:bg-automotive-gold/90 text-white">
                Buscar
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container py-8">
        <div className="flex">
          {/* Filter Sidebar */}
          <FilterSidebar
            filters={filters}
            onFiltersChange={setFilters}
            onClearFilters={clearFilters}
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
          />
          
          {/* Backdrop for mobile */}
          {isFilterOpen && (
            <div 
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setIsFilterOpen(false)}
            />
          )}

          {/* Main Content */}
          <div className="flex-1 lg:ml-6 space-y-6">
            {/* Controls Bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setIsFilterOpen(true)}
                  className="lg:hidden"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros
                  {activeFiltersCount > 0 && (
                    <Badge variant="destructive" className="ml-2">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {filteredVehicles.length} vehículos encontrados
                  </span>
                  {activeFiltersCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      Limpiar filtros
                    </Button>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Auction Section */}
            {auctionVehicles.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Gavel className="h-5 w-5 text-automotive-blue" />
                  <h2 className="text-2xl font-bold text-automotive-carbon">Subastas Activas</h2>
                  <Badge variant="destructive" className="animate-pulse">En Vivo</Badge>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {auctionVehicles.map((vehicle) => {
                    const auction = mockAuctions.find(a => a.vehicleId === vehicle.id);
                    return (
                      <div key={vehicle.id} className="space-y-4">
                        <VehicleCard
                          vehicle={vehicle}
                          showAuctionInfo={true}
                          onBid={handleBidOnAuction}
                        />
                        {auction && (
                          <AuctionTimer
                            endDate={auction.fechaFin}
                            currentPrice={auction.precioActual}
                            participants={auction.participantes.length}
                            vehicleId={vehicle.id}
                            onBid={() => handleBidOnAuction(vehicle.id)}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Regular Vehicles Section */}
            {regularVehicles.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-automotive-blue" />
                  <h2 className="text-2xl font-bold text-automotive-carbon">Vehículos Disponibles</h2>
                </div>
                
                <div className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                    : 'grid-cols-1'
                }`}>
                  {regularVehicles.map((vehicle) => (
                    <VehicleCard
                      key={vehicle.id}
                      vehicle={vehicle}
                      onReserve={handleReserveVehicle}
                      onSchedule={handleScheduleAppointment}
                      onPayment={handlePaymentModal}
                    />
                  ))}
                </div>
              </section>
            )}

            {filteredVehicles.length === 0 && (
              <div className="text-center py-12">
                <div className="space-y-4">
                  <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                    <Search className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-600">
                    No se encontraron vehículos
                  </h3>
                  <p className="text-gray-500">
                    Intenta ajustar tus filtros de búsqueda o explora nuestra selección completa.
                  </p>
                  <Button onClick={clearFilters}>
                    Ver todos los vehículos
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Appointment Dialog */}
      <Dialog open={!!appointmentVehicle} onOpenChange={() => setAppointmentVehicle(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Agendar Cita</DialogTitle>
          </DialogHeader>
          {appointmentVehicle && (
            <AppointmentForm
              vehicleId={appointmentVehicle.id}
              vehicleName={`${appointmentVehicle.marca} ${appointmentVehicle.modelo}`}
              onClose={() => setAppointmentVehicle(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Reservation Dialog */}
      <Dialog open={!!reservationVehicle} onOpenChange={() => setReservationVehicle(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Apartar Vehículo</DialogTitle>
          </DialogHeader>
          {reservationVehicle && (
            <ReservationForm
              vehicleId={reservationVehicle.id}
              vehicleName={`${reservationVehicle.marca} ${reservationVehicle.modelo}`}
              vehiclePrice={reservationVehicle.precio}
              onClose={() => setReservationVehicle(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Payment Modal */}
      {paymentVehicle && (
        <PaymentModal
          isOpen={!!paymentVehicle}
          onClose={() => setPaymentVehicle(null)}
          vehicleId={paymentVehicle.id}
          vehicleName={`${paymentVehicle.marca} ${paymentVehicle.modelo}`}
          vehiclePrice={paymentVehicle.precio}
        />
      )}
    </div>
  );
};

export default Index;
