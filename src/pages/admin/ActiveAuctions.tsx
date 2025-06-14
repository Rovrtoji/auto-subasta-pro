
import { useState } from 'react';
import { Clock, ArrowLeft, Plus, Calendar, DollarSign, Users, Eye, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import Header from '../../components/Header';
import { useAuctions } from '@/hooks/useAuctions';
import { useVehicles } from '@/hooks/useVehicles';

const AdminActiveAuctions = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAuction, setSelectedAuction] = useState<any>(null);
  const [newAuction, setNewAuction] = useState({
    vehicleId: '',
    precioInicial: '',
    fechaInicio: undefined as Date | undefined,
    horaInicio: '',
    fechaFin: undefined as Date | undefined,
    horaFin: ''
  });

  const { data: auctions, isLoading: auctionsLoading } = useAuctions();
  const { data: vehicles, isLoading: vehiclesLoading } = useVehicles();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeRemaining = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return 'Finalizada';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getStatusBadge = (auction: any) => {
    const now = new Date();
    const start = new Date(auction.fecha_inicio);
    const end = new Date(auction.fecha_fin);
    
    if (now < start) {
      return <Badge variant="outline">Programada</Badge>;
    } else if (now >= start && now <= end && auction.activa) {
      return <Badge className="bg-red-500 animate-pulse">En Vivo</Badge>;
    } else {
      return <Badge variant="secondary">Finalizada</Badge>;
    }
  };

  const availableVehicles = vehicles?.filter(vehicle => 
    !vehicle.apartado && !vehicle.en_subasta
  ) || [];

  const handleCreateAuction = () => {
    // TODO: Implementar creación de subasta
    console.log('Creating auction:', newAuction);
    setShowCreateModal(false);
    setNewAuction({
      vehicleId: '',
      precioInicial: '',
      fechaInicio: undefined,
      horaInicio: '',
      fechaFin: undefined,
      horaFin: ''
    });
  };

  if (auctionsLoading || vehiclesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Header />
        <div className="container py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center space-y-2">
              <Clock className="h-8 w-8 text-automotive-blue mx-auto animate-pulse" />
              <p>Cargando subastas...</p>
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
                  <Clock className="h-8 w-8" />
                  Subastas Activas
                </h1>
                <p className="text-gray-200 mt-2">Gestiona y programa subastas de vehículos</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{auctions?.filter(a => a.activa).length || 0}</div>
                  <div className="text-sm text-gray-200">Activas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{auctions?.length || 0}</div>
                  <div className="text-sm text-gray-200">Total</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Quick Actions */}
        <Card className="border-0 shadow-lg automotive-card mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Gestión de Subastas</span>
              <Button 
                onClick={() => setShowCreateModal(true)}
                className="btn-premium"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nueva Subasta
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600">
                  {auctions?.filter(a => {
                    const now = new Date();
                    const start = new Date(a.fecha_inicio);
                    const end = new Date(a.fecha_fin);
                    return now >= start && now <= end && a.activa;
                  }).length || 0}
                </div>
                <div className="text-sm text-muted-foreground">En Vivo</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {auctions?.filter(a => {
                    const now = new Date();
                    const start = new Date(a.fecha_inicio);
                    return now < start;
                  }).length || 0}
                </div>
                <div className="text-sm text-muted-foreground">Programadas</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {auctions?.filter(a => {
                    const now = new Date();
                    const end = new Date(a.fecha_fin);
                    return now > end;
                  }).length || 0}
                </div>
                <div className="text-sm text-muted-foreground">Finalizadas</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-automotive-blue">
                  {availableVehicles.length}
                </div>
                <div className="text-sm text-muted-foreground">Vehículos Disponibles</div>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Auctions Table */}
        <Card className="border-0 shadow-lg automotive-card">
          <CardHeader>
            <CardTitle>
              Lista de Subastas ({auctions?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehículo</TableHead>
                  <TableHead>Precio Inicial/Actual</TableHead>
                  <TableHead>Inicio</TableHead>
                  <TableHead>Fin</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Tiempo Restante</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auctions?.map((auction) => {
                  const vehicle = auction.vehicles;
                  return (
                    <TableRow key={auction.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <img
                            src={vehicle?.imagen || '/placeholder.svg'}
                            alt={`${vehicle?.marca} ${vehicle?.modelo}`}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                          <div>
                            <p className="font-semibold">
                              {vehicle?.marca} {vehicle?.modelo}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {vehicle?.año} • {vehicle?.color}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Inicial: {formatPrice(auction.precio_inicial)}
                          </p>
                          <p className="font-bold text-automotive-gold">
                            Actual: {formatPrice(auction.precio_actual)}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {formatDateTime(auction.fecha_inicio)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {formatDateTime(auction.fecha_fin)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(auction)}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-medium">
                          {getTimeRemaining(auction.fecha_fin)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedAuction(auction)}
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
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Create Auction Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Crear Nueva Subasta</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vehicle">Vehículo</Label>
                <Select value={newAuction.vehicleId} onValueChange={(value) => 
                  setNewAuction({...newAuction, vehicleId: value})
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar vehículo" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableVehicles.map((vehicle) => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.marca} {vehicle.modelo} {vehicle.año}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="precio">Precio Inicial</Label>
                <Input
                  id="precio"
                  type="number"
                  placeholder="Precio inicial"
                  value={newAuction.precioInicial}
                  onChange={(e) => setNewAuction({...newAuction, precioInicial: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Fecha de Inicio</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !newAuction.fechaInicio && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {newAuction.fechaInicio ? (
                        format(newAuction.fechaInicio, "PPP", { locale: es })
                      ) : (
                        <span>Seleccionar fecha</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={newAuction.fechaInicio}
                      onSelect={(date) => setNewAuction({...newAuction, fechaInicio: date})}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="horaInicio">Hora de Inicio</Label>
                <Input
                  id="horaInicio"
                  type="time"
                  value={newAuction.horaInicio}
                  onChange={(e) => setNewAuction({...newAuction, horaInicio: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Fecha de Fin</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !newAuction.fechaFin && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {newAuction.fechaFin ? (
                        format(newAuction.fechaFin, "PPP", { locale: es })
                      ) : (
                        <span>Seleccionar fecha</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={newAuction.fechaFin}
                      onSelect={(date) => setNewAuction({...newAuction, fechaFin: date})}
                      disabled={(date) => date < new Date() || (newAuction.fechaInicio && date <= newAuction.fechaInicio)}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="horaFin">Hora de Fin</Label>
                <Input
                  id="horaFin"
                  type="time"
                  value={newAuction.horaFin}
                  onChange={(e) => setNewAuction({...newAuction, horaFin: e.target.value})}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateAuction} className="btn-premium">
                Crear Subasta
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Auction Details Modal */}
      <Dialog open={!!selectedAuction} onOpenChange={() => setSelectedAuction(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Detalles de la Subasta</DialogTitle>
          </DialogHeader>
          {selectedAuction && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <img
                    src={selectedAuction.vehicles?.imagen || '/placeholder.svg'}
                    alt={`${selectedAuction.vehicles?.marca} ${selectedAuction.vehicles?.modelo}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold">
                      {selectedAuction.vehicles?.marca} {selectedAuction.vehicles?.modelo}
                    </h3>
                    <p className="text-muted-foreground">{selectedAuction.vehicles?.año}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Precio Inicial</p>
                      <p className="text-lg text-automotive-blue">
                        {formatPrice(selectedAuction.precio_inicial)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Precio Actual</p>
                      <p className="text-lg font-bold text-automotive-gold">
                        {formatPrice(selectedAuction.precio_actual)}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(selectedAuction)}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium">Fecha y Hora de Inicio</p>
                  <p>{formatDateTime(selectedAuction.fecha_inicio)}</p>
                </div>
                <div>
                  <p className="font-medium">Fecha y Hora de Fin</p>
                  <p>{formatDateTime(selectedAuction.fecha_fin)}</p>
                </div>
              </div>

              <div>
                <p className="font-medium mb-2">Tiempo Restante</p>
                <div className="text-2xl font-bold text-red-600">
                  {getTimeRemaining(selectedAuction.fecha_fin)}
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline">
                  Ver Pujas
                </Button>
                <Button className="btn-premium">
                  Ir a Subasta
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminActiveAuctions;
