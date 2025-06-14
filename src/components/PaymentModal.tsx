
import { useState } from 'react';
import { CreditCard, Building2, X, CheckCircle, Copy } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleName: string;
  vehiclePrice: number;
  vehicleId: string;
}

const PaymentModal = ({ isOpen, onClose, vehicleName, vehiclePrice, vehicleId }: PaymentModalProps) => {
  const { toast } = useToast();
  const [selectedMethod, setSelectedMethod] = useState<'transfer' | 'card' | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(price);
  };

  const depositAmount = Math.round(vehiclePrice * 0.1); // 10% para apartar

  const bankInfo = {
    bank: "Banco Nacional",
    account: "1234567890123456",
    clabe: "012345678901234567",
    beneficiary: "AUTOMOTRIZ SEMINUEVOS SA DE CV"
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado al portapapeles",
      description: "La información ha sido copiada correctamente.",
    });
  };

  const handleCardPayment = () => {
    // Aquí se integrará con Stripe o el procesador de pagos
    toast({
      title: "Procesando pago",
      description: "Redirigiendo al procesador de pagos...",
    });
    // Simular redirección
    setTimeout(() => onClose(), 2000);
  };

  const handleTransferConfirmation = () => {
    toast({
      title: "Información enviada",
      description: "Hemos registrado tu solicitud de apartado. Te contactaremos pronto.",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-automotive-gold" />
            <span>Apartar Vehículo</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Vehicle Info */}
          <div className="bg-gradient-to-r from-automotive-blue/10 to-automotive-gold/10 p-4 rounded-lg">
            <h3 className="font-semibold text-automotive-carbon mb-2">{vehicleName}</h3>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Precio total:</span>
              <span className="text-lg font-bold text-automotive-gold">{formatPrice(vehiclePrice)}</span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-sm text-muted-foreground">Monto para apartar:</span>
              <span className="text-xl font-bold text-automotive-blue">{formatPrice(depositAmount)}</span>
            </div>
          </div>

          {/* Payment Method Selection */}
          {!selectedMethod && (
            <div className="space-y-4">
              <h4 className="font-semibold text-center">Selecciona tu método de pago</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card 
                  className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-automotive-blue"
                  onClick={() => setSelectedMethod('transfer')}
                >
                  <CardHeader className="text-center pb-2">
                    <Building2 className="h-8 w-8 mx-auto text-automotive-blue mb-2" />
                    <CardTitle className="text-lg">Transferencia Bancaria</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Realiza tu pago mediante transferencia SPEI
                    </p>
                    <Badge variant="outline" className="mt-2">Sin comisión</Badge>
                  </CardContent>
                </Card>

                <Card 
                  className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-automotive-gold"
                  onClick={() => setSelectedMethod('card')}
                >
                  <CardHeader className="text-center pb-2">
                    <CreditCard className="h-8 w-8 mx-auto text-automotive-gold mb-2" />
                    <CardTitle className="text-lg">Tarjeta de Crédito/Débito</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Pago inmediato y seguro con tu tarjeta
                    </p>
                    <Badge variant="outline" className="mt-2">Pago instantáneo</Badge>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Transfer Details */}
          {selectedMethod === 'transfer' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Datos para transferencia</h4>
                <Button variant="ghost" size="sm" onClick={() => setSelectedMethod(null)}>
                  <X className="h-4 w-4" />
                  Cambiar método
                </Button>
              </div>
              
              <Card>
                <CardContent className="p-4 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Banco</label>
                      <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <span className="font-medium">{bankInfo.bank}</span>
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(bankInfo.bank)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Cuenta</label>
                      <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <span className="font-mono">{bankInfo.account}</span>
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(bankInfo.account)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">CLABE</label>
                      <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <span className="font-mono">{bankInfo.clabe}</span>
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(bankInfo.clabe)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Beneficiario</label>
                      <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <span className="font-medium">{bankInfo.beneficiary}</span>
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(bankInfo.beneficiary)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-automotive-blue/10 p-3 rounded-lg">
                    <p className="text-sm font-medium text-automotive-blue">
                      Monto a transferir: {formatPrice(depositAmount)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Concepto: Apartado vehículo {vehicleId} - {vehicleName}
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  • Una vez realizada la transferencia, envía el comprobante por WhatsApp
                </p>
                <p className="text-sm text-muted-foreground">
                  • El apartado será válido por 7 días naturales
                </p>
                <p className="text-sm text-muted-foreground">
                  • Te contactaremos para confirmar tu apartado
                </p>
              </div>
              
              <Button onClick={handleTransferConfirmation} className="w-full btn-premium">
                Confirmar solicitud de apartado
              </Button>
            </div>
          )}

          {/* Card Payment */}
          {selectedMethod === 'card' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Pago con tarjeta</h4>
                <Button variant="ghost" size="sm" onClick={() => setSelectedMethod(null)}>
                  <X className="h-4 w-4" />
                  Cambiar método
                </Button>
              </div>
              
              <Card>
                <CardContent className="p-6 text-center space-y-4">
                  <CreditCard className="h-12 w-12 mx-auto text-automotive-gold" />
                  <div>
                    <h5 className="font-semibold">Pago seguro con tarjeta</h5>
                    <p className="text-sm text-muted-foreground">
                      Serás redirigido a nuestro procesador de pagos seguro
                    </p>
                  </div>
                  <div className="bg-automotive-gold/10 p-3 rounded-lg">
                    <p className="font-semibold text-automotive-gold">
                      Total a pagar: {formatPrice(depositAmount)}
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Button onClick={handleCardPayment} className="w-full btn-premium">
                <CreditCard className="h-4 w-4 mr-2" />
                Proceder al pago
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
