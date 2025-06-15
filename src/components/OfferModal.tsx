
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useCreateOffer } from '@/hooks/useOffers';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { DollarSign } from 'lucide-react';
import { toast } from 'sonner';

interface Vehicle {
  id: string;
  marca: string;
  modelo: string;
  año: number;
  precio: number;
  imagen?: string;
}

interface OfferModalProps {
  vehicle: Vehicle;
  isOpen: boolean;
  onClose: () => void;
}

const OfferModal = ({ vehicle, isOpen, onClose }: OfferModalProps) => {
  const { user, profile } = useAuth();
  const createOffer = useCreateOffer();
  const [offerAmount, setOfferAmount] = useState('');
  const [userEmail, setUserEmail] = useState(user?.email || '');
  const [userName, setUserName] = useState(profile?.nombre || '');
  const [userPhone, setUserPhone] = useState(profile?.telefono || '');
  const [message, setMessage] = useState('');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!offerAmount || !userName || !userEmail) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    const amount = parseFloat(offerAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Por favor ingresa un monto válido');
      return;
    }

    try {
      await createOffer.mutateAsync({
        vehicle_id: vehicle.id,
        user_id: user?.id || null,
        user_name: userName,
        user_email: userEmail,
        user_phone: userPhone || null,
        offer_amount: amount,
        message: message || null,
      });

      toast.success('¡Oferta enviada exitosamente!');
      onClose();
      setOfferAmount('');
      setMessage('');
    } catch (error) {
      console.error('Error creating offer:', error);
      toast.error('Error al enviar la oferta');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Hacer Oferta</DialogTitle>
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
            <p className="text-sm text-muted-foreground">
              Precio: {formatPrice(vehicle.precio)}
            </p>
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
              <Label htmlFor="userPhone">Teléfono</Label>
              <Input
                id="userPhone"
                value={userPhone}
                onChange={(e) => setUserPhone(e.target.value)}
                placeholder="Tu número de teléfono"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="offerAmount">Tu oferta (MXN) *</Label>
              <Input
                id="offerAmount"
                type="number"
                value={offerAmount}
                onChange={(e) => setOfferAmount(e.target.value)}
                placeholder="Ingresa tu oferta"
                min="1"
                step="1000"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Mensaje (opcional)</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Mensaje adicional..."
                rows={3}
              />
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
                disabled={createOffer.isPending}
              >
                <DollarSign className="h-4 w-4 mr-2" />
                {createOffer.isPending ? 'Enviando...' : 'Enviar Oferta'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OfferModal;
