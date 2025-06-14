
import { useState, useEffect } from 'react';
import { Clock, Users, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface AuctionTimerProps {
  endTime: Date;
}

const AuctionTimer = ({ endTime }: AuctionTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = +endTime - +new Date();
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

  const hasEnded = timeLeft.dias === 0 && timeLeft.horas === 0 && timeLeft.minutos === 0 && timeLeft.segundos === 0;

  return (
    <Card className="mt-4">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-automotive-blue">
          <Clock className="h-5 w-5" />
          <span>Tiempo Restante</span>
          {hasEnded && (
            <Badge variant="secondary">
              Finalizada
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!hasEnded ? (
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="p-2 bg-gray-50 rounded-lg">
              <p className="text-lg font-bold">{timeLeft.dias}</p>
              <p className="text-xs text-muted-foreground">Días</p>
            </div>
            <div className="p-2 bg-gray-50 rounded-lg">
              <p className="text-lg font-bold">{timeLeft.horas}</p>
              <p className="text-xs text-muted-foreground">Horas</p>
            </div>
            <div className="p-2 bg-gray-50 rounded-lg">
              <p className="text-lg font-bold">{timeLeft.minutos}</p>
              <p className="text-xs text-muted-foreground">Min</p>
            </div>
            <div className="p-2 bg-gray-50 rounded-lg">
              <p className="text-lg font-bold">{timeLeft.segundos}</p>
              <p className="text-xs text-muted-foreground">Seg</p>
            </div>
          </div>
        ) : (
          <div className="text-center p-4 bg-gray-100 rounded-lg">
            <p className="text-lg font-semibold text-gray-600">Subasta Finalizada</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AuctionTimer;
