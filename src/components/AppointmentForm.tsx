
import { useState } from 'react';
import { Calendar, Clock, User, Mail, Phone, MessageSquare, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface AppointmentFormProps {
  vehicleId: string;
  vehicleName: string;
  onClose?: () => void;
}

const AppointmentForm = ({ vehicleId, vehicleName, onClose }: AppointmentFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    fecha: '',
    hora: '',
    mensaje: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', 
    '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast({
      title: "¡Cita Agendada!",
      description: `Tu cita para el ${vehicleName} ha sido confirmada para el ${formData.fecha} a las ${formData.hora}.`,
    });

    setIsSubmitting(false);
    onClose?.();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = formData.nombre && formData.email && formData.telefono && formData.fecha && formData.hora;

  // Generate next 14 days for date selection
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      // Skip Sundays
      if (date.getDay() !== 0) {
        dates.push(date.toISOString().split('T')[0]);
      }
    }
    return dates;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto border-0 shadow-xl automotive-card">
      <CardHeader className="text-center pb-4">
        <CardTitle className="flex items-center justify-center space-x-2 text-automotive-blue">
          <Calendar className="h-5 w-5" />
          <span>Agendar Cita</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-2">
          Para: <span className="font-semibold text-automotive-carbon">{vehicleName}</span>
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

          {/* Date and Time Selection */}
          <div className="space-y-3">
            <div>
              <Label className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Fecha</span>
              </Label>
              <Select value={formData.fecha} onValueChange={(value) => handleInputChange('fecha', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Selecciona una fecha" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border z-50">
                  {getAvailableDates().map((date) => (
                    <SelectItem key={date} value={date}>
                      {formatDate(date)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Hora</span>
              </Label>
              <Select value={formData.hora} onValueChange={(value) => handleInputChange('hora', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Selecciona una hora" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border z-50">
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Message */}
          <div>
            <Label htmlFor="mensaje" className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4" />
              <span>Mensaje (Opcional)</span>
            </Label>
            <Textarea
              id="mensaje"
              value={formData.mensaje}
              onChange={(e) => handleInputChange('mensaje', e.target.value)}
              placeholder="¿Hay algo específico que te gustaría saber sobre el vehículo?"
              className="mt-1 min-h-[80px]"
            />
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full btn-premium"
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Agendando...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Confirmar Cita
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

export default AppointmentForm;
