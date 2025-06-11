
import { useState } from 'react';
import { MapPin, DollarSign, User, Mail, Phone, CreditCard, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface ReservationFormProps {
  vehicleId: string;
  vehicleName: string;
  vehiclePrice: number;
  onClose?: () => void;
}

const ReservationForm = ({ vehicleId, vehicleName, vehiclePrice, onClose }: ReservationFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    montoSeña: Math.round(vehiclePrice * 0.1) // 10% default
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(price);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    toast({
      title: "¡Vehículo Apartado!",
      description: `El ${vehicleName} ha sido apartado exitosamente con una seña de ${formatPrice(formData.montoSeña)}.`,
    });

    setIsSubmitting(false);
    onClose?.();
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = formData.nombre && formData.email && formData.telefono && formData.montoSeña > 0;
  const minDeposit = Math.round(vehiclePrice * 0.05); // 5% minimum
  const maxDeposit = Math.round(vehiclePrice * 0.5); // 50% maximum

  return (
    <Card className="w-full max-w-md mx-auto border-0 shadow-xl automotive-card">
      <CardHeader className="text-center pb-4">
        <CardTitle className="flex items-center justify-center space-x-2 text-automotive-blue">
          <MapPin className="h-5 w-5" />
          <span>Apartar Vehículo</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-2">
          <span className="font-semibold text-automotive-carbon">{vehicleName}</span>
        </p>
        <p className="text-lg font-bold text-automotive-gold">
          {formatPrice(vehiclePrice)}
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Personal Information */}
          <div className="space-y-3">
            <div>
              <Label htmlFor="nombre" className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Nombre Completo</span>
              </Label>
              <Input
                id="nombre"
                type="text"
                value={formData.nombre}
                onChange={(e) => handleInputChange('nombre', e.target.value)}
                placeholder="Tu nombre completo"
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="email" className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>Email</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="tu@email.com"
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="telefono" className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>Teléfono</span>
              </Label>
              <Input
                id="telefono"
                type="tel"
                value={formData.telefono}
                onChange={(e) => handleInputChange('telefono', e.target.value)}
                placeholder="(55) 1234-5678"
                className="mt-1"
                required
              />
            </div>
          </div>

          {/* Deposit Amount */}
          <div className="space-y-3">
            <div>
              <Label htmlFor="montoSeña" className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4" />
                <span>Monto de Seña</span>
              </Label>
              <Input
                id="montoSeña"
                type="number"
                value={formData.montoSeña}
                onChange={(e) => handleInputChange('montoSeña', parseInt(e.target.value) || 0)}
                min={minDeposit}
                max={maxDeposit}
                className="mt-1"
                required
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Mínimo: {formatPrice(minDeposit)}</span>
                <span>Máximo: {formatPrice(maxDeposit)}</span>
              </div>
            </div>

            {/* Quick Amount Buttons */}
            <div className="grid grid-cols-3 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleInputChange('montoSeña', Math.round(vehiclePrice * 0.05))}
                className="text-xs"
              >
                5%
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleInputChange('montoSeña', Math.round(vehiclePrice * 0.1))}
                className="text-xs"
              >
                10%
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleInputChange('montoSeña', Math.round(vehiclePrice * 0.2))}
                className="text-xs"
              >
                20%
              </Button>
            </div>
          </div>

          {/* Terms */}
          <div className="p-3 bg-accent/50 rounded-lg text-xs text-muted-foreground space-y-1">
            <p className="font-medium">Términos del Apartado:</p>
            <ul className="space-y-0.5 list-disc list-inside">
              <li>El apartado tiene vigencia de 7 días naturales</li>
              <li>La seña no es reembolsable</li>
              <li>Se aplica al precio final del vehículo</li>
            </ul>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full btn-premium"
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <CreditCard className="h-4 w-4 mr-2 animate-pulse" />
                Procesando...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Apartar con {formatPrice(formData.montoSeña)}
              </>
            )}
          </Button>

          {onClose && (
            <Button 
              type="button" 
              variant="outline" 
              className="w-full"
              onClick={onClose}
            >
              Cancelar
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default ReservationForm;
