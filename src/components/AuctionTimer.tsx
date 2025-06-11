
import { useState, useEffect } from 'react';
import { Clock, Users, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface AuctionTimerProps {
  endDate: Date;
  currentPrice: number;
  participants: number;
  onBid?: () => void;
  vehicleId: string;
}

const AuctionTimer = ({ endDate, currentPrice, participants, onBid, vehicleId }: AuctionTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = +endDate - +new Date();
    let timeLeft = {
      dias: 0,
      horas: 0,
      minutos: 0,
      segundos: 0
    };

    if (difference > 0) {
      timeLeft = {
        dias: Math.floor(difference / (1000 * 60 * 60 * 24)),
        horas: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutos: Math.floor((difference / 1000 / 60) % 60),
        segundos: Math.floor((difference / 1000) % 60)
      };
    }

    return timeLeft;
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(price);
  };

  const isExpiringSoon = timeLeft.dias === 0 && timeLeft.horas < 2;
  const hasEnded = timeLeft.dias === 0 && timeLeft.horas === 0 && timeLeft.minutos === 0 && timeLeft.segundos === 0;

  return (
    <Card className="border-0 shadow-lg automotive-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-automotive-blue">
          <Clock className="h-5 w-5" />
          <span>Subasta en Vivo</span>
          {isExpiringSoon && !hasEnded && (
            <Badge variant="destructive" className="animate-pulse">
              ¡Termina Pronto!
            </Badge>
          )}
          {hasEnded && (
            <Badge variant="secondary">
              Finalizada
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Current Price */}
        <div className="text-center p-4 bg-gradient-to-r from-automotive-blue/10 to-automotive-gold/10 rounded-lg">
          <p className="text-sm text-muted-foreground mb-1">Precio Actual</p>
          <p className="text-3xl font-bold text-automotive-gold">{formatPrice(currentPrice)}</p>
        </div>

        {/* Timer */}
        {!hasEnded ? (
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="p-2 bg-automotive-carbon/5 rounded-lg">
              <p className="text-lg font-bold text-automotive-carbon">{timeLeft.dias}</p>
              <p className="text-xs text-muted-foreground">Días</p>
            </div>
            <div className="p-2 bg-automotive-carbon/5 rounded-lg">
              <p className="text-lg font-bold text-automotive-carbon">{timeLeft.horas}</p>
              <p className="text-xs text-muted-foreground">Horas</p>
            </div>
            <div className="p-2 bg-automotive-carbon/5 rounded-lg">
              <p className="text-lg font-bold text-automotive-carbon">{timeLeft.minutos}</p>
              <p className="text-xs text-muted-foreground">Min</p>
            </div>
            <div className="p-2 bg-automotive-carbon/5 rounded-lg">
              <p className="text-lg font-bold text-automotive-carbon">{timeLeft.segundos}</p>
              <p className="text-xs text-muted-foreground">Seg</p>
            </div>
          </div>
        ) : (
          <div className="text-center p-4 bg-gray-100 rounded-lg">
            <p className="text-lg font-semibold text-gray-600">Subasta Finalizada</p>
          </div>
        )}

        {/* Participants */}
        <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-automotive-blue" />
            <span className="text-sm font-medium">Participantes</span>
          </div>
          <Badge variant="outline">{participants}</Badge>
        </div>

        {/* Bid Button */}
        {!hasEnded && (
          <Button 
            onClick={onBid}
            className="w-full btn-premium"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Hacer Puja
          </Button>
        )}

        {/* Recent Activity */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Actividad Reciente</h4>
          <div className="space-y-1 text-xs">
            <p className="flex justify-between">
              <span>Usuario★★★★☆</span>
              <span className="font-medium">{formatPrice(currentPrice)}</span>
            </p>
            <p className="flex justify-between">
              <span>Usuario★★★☆☆</span>
              <span className="font-medium">{formatPrice(currentPrice - 5000)}</span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuctionTimer;
