
import { Car, Calendar, Gauge, Fuel, Settings, MapPin, Clock, DollarSign } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Vehicle {
  id: string;
  marca: string;
  modelo: string;
  año: number;
  precio: number;
  kilometraje: number;
  transmision: string;
  combustible: string;
  color: string;
  imagen?: string;
  descripcion?: string;
  caracteristicas: string[];
  enSubasta?: boolean;
  apartado?: boolean;
  estadoGeneral?: string;
  estado_general?: string;
  en_subasta?: boolean;
}

interface VehicleCardProps {
  vehicle: Vehicle;
  showAuctionInfo?: boolean;
  onReserve?: (vehicleId: string) => void;
  onSchedule?: (vehicleId: string) => void;
  onBid?: (vehicleId: string) => void;
  onPayment?: (vehicleId: string) => void;
}

const VehicleCard = ({ vehicle, showAuctionInfo = false, onReserve, onSchedule, onBid, onPayment }: VehicleCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(price);
  };

  const formatKilometers = (km: number) => {
    return new Intl.NumberFormat('es-MX').format(km) + ' km';
  };

  const handleApartarClick = () => {
    if (onPayment) {
      onPayment(vehicle.id);
    } else if (onReserve) {
      onReserve(vehicle.id);
    }
  };

  // Handle both database field names and mock data field names
  const isInAuction = vehicle.enSubasta || vehicle.en_subasta;
  const isReserved = vehicle.apartado;
  const condition = vehicle.estadoGeneral || vehicle.estado_general || 'Bueno';
  const features = vehicle.caracteristicas || [];

  return (
    <Card className="card-hover group overflow-hidden border-0 shadow-lg automotive-card">
      <div className="relative overflow-hidden">
        <img
          src={vehicle.imagen || '/placeholder.svg'}
          alt={`${vehicle.marca} ${vehicle.modelo}`}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
        />
        
        {/* Status Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {isInAuction && (
            <Badge className="bg-red-500 hover:bg-red-600 text-white">
              <Clock className="h-3 w-3 mr-1" />
              En Subasta
            </Badge>
          )}
          {isReserved && (
            <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">
              Apartado
            </Badge>
          )}
          <Badge variant="secondary" className="bg-white/90 text-gray-800">
            {condition}
          </Badge>
        </div>

        {/* Year Badge */}
        <div className="absolute top-3 right-3">
          <Badge className="bg-automotive-blue hover:bg-automotive-blue/80 text-white">
            {vehicle.año}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Title and Price */}
        <div className="space-y-2">
          <h3 className="font-bold text-lg text-automotive-carbon group-hover:text-automotive-blue transition-colors">
            {vehicle.marca} {vehicle.modelo}
          </h3>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold text-automotive-gold">
              {formatPrice(vehicle.precio)}
            </p>
            {showAuctionInfo && isInAuction && (
              <Badge variant="destructive" className="animate-pulse">
                <DollarSign className="h-3 w-3 mr-1" />
                Precio Actual
              </Badge>
            )}
          </div>
        </div>

        {/* Vehicle Details Grid */}
        <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Gauge className="h-4 w-4 text-automotive-blue" />
            <span>{formatKilometers(vehicle.kilometraje)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Settings className="h-4 w-4 text-automotive-blue" />
            <span>{vehicle.transmision}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Fuel className="h-4 w-4 text-automotive-blue" />
            <span>{vehicle.combustible}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Car className="h-4 w-4 text-automotive-blue" />
            <span>{vehicle.color}</span>
          </div>
        </div>

        {/* Description */}
        {vehicle.descripcion && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {vehicle.descripcion}
          </p>
        )}

        {/* Features */}
        {features.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {features.slice(0, 3).map((feature, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {feature}
              </Badge>
            ))}
            {features.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{features.length - 3} más
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0 space-y-2">
        {isInAuction ? (
          <div className="w-full space-y-2">
            <Button 
              onClick={() => onBid?.(vehicle.id)}
              className="w-full btn-premium"
              disabled={isReserved}
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Participar en Subasta
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              La subasta termina pronto
            </p>
          </div>
        ) : (
          <div className="w-full grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              onClick={() => onSchedule?.(vehicle.id)}
              className="flex-1 hover:bg-automotive-blue hover:text-white transition-colors"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Agendar
            </Button>
            <Button 
              onClick={handleApartarClick}
              className="flex-1 btn-premium"
              disabled={isReserved}
            >
              <MapPin className="h-4 w-4 mr-2" />
              {isReserved ? 'Apartado' : 'Apartar'}
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default VehicleCard;
