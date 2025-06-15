
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useCreateBid } from '@/hooks/useAuctions';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DollarSign, Clock, User, Mail } from 'lucide-react';
import { toast } from 'sonner';

interface Vehicle {
  id: string;
  marca: string;
  modelo: string;
  año: number;
  precio: number;
  imagen?: string;
}

interface BidModalProps {
  vehicle: Vehicle;
  auction: any;
  isOpen: boolean;
  onClose: () => void;
}

const BidModal = ({ vehicle, auction, isOpen, onClose }: BidModalProps) => {
  const { user, profile } = useAuth();
  const createBid = useCreateBid();
  const [bidAmount, setBidAmount] = useState('');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Debes iniciar sesión para participar en la subasta');
      return;
    }

    if (!bidAmount) {
      toast.error('Por favor ingresa un monto para tu oferta');
      return;
    }

    const amount = parseFloat(bidAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Por favor ingresa un monto válido');
      return;
    }

    if (amount <= auction?.precio_actual) {
      toast.error(`Tu oferta debe ser mayor a ${formatPrice(auction?.precio_actual || 0)}`);
      return;
    }

    try {
      await createBid.mutateAsync({
        auction_id: auction.id,
        user_id: user.id,
        user_name: profile?.nombre || user.email || 'Usuario',
        cantidad: amount,
      });

      toast.success('¡Oferta enviada exitosamente!');
      onClose();
      setBidAmount('');
    } catch (error) {
      console.error('Error creating bid:', error);
      toast.error('Error al enviar la oferta');
    }
  };

  const currentPrice = auction?.precio_actual || vehicle.precio;
  const minBid = currentPrice + 1000; // Incremento mínimo de $1,000

  // Si no hay usuario autenticado, mostrar mensaje
  if (!user) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-automotive-gold" />
              Iniciar Sesión Requerido
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 text-center">
            <p className="text-muted-foreground">
              Debes iniciar sesión para participar en las subastas
            </p>
            <Button 
              onClick={onClose}
              className="w-full bg-automotive-blue hover:bg-automotive-blue/90"
            >
              Entendido
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-automotive-gold" />
            Participar en Subasta
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-center">
            <img
              src={vehicle.imagen || '/placeholder.svg'}
              alt={`${vehicle.marca} ${vehicle.modelo}`}
              className="w-full h-32 object-cover rounded-lg mb-2"
            />
            <h3 className="text-lg font-semibold">
              {vehicle.marca} {vehicle.modelo} {vehicle.año}
            </h3>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>La subasta termina pronto</span>
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Precio actual:</span>
              <span className="font-bold text-automotive-gold">
                {formatPrice(currentPrice)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Oferta mínima:</span>
              <span className="font-semibold text-green-600">
                {formatPrice(minBid)}
              </span>
            </div>
          </div>

          {/* Información del usuario (solo lectura) */}
          <div className="bg-blue-50 p-3 rounded-lg space-y-2">
            <h4 className="text-sm font-medium text-automotive-blue">Datos del participante:</h4>
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-automotive-blue" />
              <span>{profile?.nombre || user.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-automotive-blue" />
              <span>{user.email}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bidAmount">Tu oferta (MXN) *</Label>
              <Input
                id="bidAmount"
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                placeholder={`Mínimo: ${formatPrice(minBid)}`}
                min={minBid}
                step="1000"
                required
                className="text-lg font-semibold"
              />
              <p className="text-xs text-muted-foreground">
                Tu oferta debe ser mayor a {formatPrice(currentPrice)}
              </p>
            </div>

            <div className="flex gap-2">
              <Button 
                type="button"
                variant="outline" 
                className="flex-1"
                onClick={onClose}
              >
                Cancelar
              </Button>
              <Button 
                type="submit"
                className="flex-1 bg-automotive-blue hover:bg-automotive-blue/90"
                disabled={createBid.isPending}
              >
                <DollarSign className="h-4 w-4 mr-2" />
                {createBid.isPending ? 'Enviando...' : 'Pujar'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BidModal;
