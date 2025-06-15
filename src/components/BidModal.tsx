
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useCreateBid } from '@/hooks/useAuctions';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { DollarSign, Clock } from 'lucide-react';
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
  const [userEmail, setUserEmail] = useState(user?.email || '');
  const [userName, setUserName] = useState(profile?.nombre || '');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bidAmount || !userName || !userEmail) {
      toast.error('Por favor completa todos los campos requeridos');
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
        user_id: user?.id || null,
        user_name: userName,
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userName">Nombre *</Label>
              <Input
                id="userName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Tu nombre completo"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="userEmail">Email *</Label>
              <Input
                id="userEmail"
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="tu@email.com"
                required
              />
            </div>

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
                {createBid.isPending ? 'Enviando...' : 'Enviar Oferta'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BidModal;
