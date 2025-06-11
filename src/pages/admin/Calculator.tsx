
import { useState } from 'react';
import { Calculator, TrendingUp, DollarSign, Car, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import Header from '../../components/Header';
import { marcas } from '../../data/mockData';

const AdminCalculator = () => {
  const [formData, setFormData] = useState({
    marca: '',
    modelo: '',
    año: new Date().getFullYear(),
    kilometraje: 50000,
    condicion: 'Bueno',
    precioOriginal: 0
  });

  const [resultado, setResultado] = useState<{
    precioEstimado: number;
    depreciation: number;
    marketFactor: number;
    conditionFactor: number;
    confidence: number;
  } | null>(null);

  const condiciones = [
    { value: 'Excelente', factor: 1.0, description: 'Como nuevo, sin detalles' },
    { value: 'Muy Bueno', factor: 0.9, description: 'Mínimos detalles de uso' },
    { value: 'Bueno', factor: 0.8, description: 'Uso normal, algunos detalles' },
    { value: 'Regular', factor: 0.7, description: 'Detalles visibles, requiere atención' }
  ];

  const calculatePrice = () => {
    if (!formData.marca || !formData.modelo || !formData.año || !formData.precioOriginal) {
      return;
    }

    // Cálculo básico de depreciación
    const añosUso = new Date().getFullYear() - formData.año;
    const depreciacionAnual = 0.15; // 15% anual
    const depreciacionPorKm = formData.kilometraje * 0.001; // $1 por km
    
    // Factor de condición
    const condicionSeleccionada = condiciones.find(c => c.value === formData.condicion);
    const factorCondicion = condicionSeleccionada?.factor || 0.8;
    
    // Factor de marca (premium vs. estándar)
    const marcasPremium = ['BMW', 'Mercedes-Benz', 'Audi', 'Toyota', 'Honda'];
    const factorMarca = marcasPremium.includes(formData.marca) ? 1.1 : 1.0;
    
    // Cálculo final
    let precioBase = formData.precioOriginal;
    precioBase *= Math.pow(1 - depreciacionAnual, añosUso);
    precioBase -= depreciacionPorKm;
    precioBase *= factorCondicion;
    precioBase *= factorMarca;
    
    // Ajuste por mercado (simulado)
    const factorMercado = 0.95 + (Math.random() * 0.1); // Entre 95% y 105%
    precioBase *= factorMercado;
    
    // Nivel de confianza basado en datos disponibles
    const confianza = Math.min(95, 70 + (añosUso < 3 ? 15 : 0) + (formData.kilometraje < 50000 ? 10 : 0));
    
    setResultado({
      precioEstimado: Math.max(precioBase, formData.precioOriginal * 0.3), // Mínimo 30% del valor original
      depreciation: ((formData.precioOriginal - precioBase) / formData.precioOriginal) * 100,
      marketFactor: factorMercado,
      conditionFactor: factorCondicion,
      confidence: confianza
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      maximumFractionDigits: 0
    }).format(price);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return 'text-green-600';
    if (confidence >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      {/* Admin Header */}
      <div className="bg-automotive-gradient text-white py-8">
        <div className="container">
          <div className="flex items-center space-x-3">
            <Calculator className="h-8 w-8" />
            <div>
              <h1 className="text-3xl font-bold">Calculadora de Precios</h1>
              <p className="text-gray-200 mt-2">Estima el valor de reventa de vehículos seminuevos</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calculator Form */}
          <Card className="border-0 shadow-lg automotive-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Car className="h-5 w-5 text-automotive-blue" />
                <span>Datos del Vehículo</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="marca">Marca</Label>
                  <Select value={formData.marca || 'none'} onValueChange={(value) => setFormData({...formData, marca: value === 'none' ? '' : value})}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Seleccionar marca" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border border-border z-50">
                      <SelectItem value="none">Seleccionar marca</SelectItem>
                      {marcas.map((marca) => (
                        <SelectItem key={marca} value={marca}>{marca}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="modelo">Modelo</Label>
                  <Input
                    id="modelo"
                    value={formData.modelo}
                    onChange={(e) => setFormData({...formData, modelo: e.target.value})}
                    placeholder="Ej: Civic, Corolla"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="año">Año</Label>
                  <Input
                    id="año"
                    type="number"
                    min="2010"
                    max={new Date().getFullYear()}
                    value={formData.año}
                    onChange={(e) => setFormData({...formData, año: parseInt(e.target.value)})}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="precio">Precio Original</Label>
                  <Input
                    id="precio"
                    type="number"
                    min="0"
                    value={formData.precioOriginal}
                    onChange={(e) => setFormData({...formData, precioOriginal: parseInt(e.target.value)})}
                    placeholder="Precio cuando era nuevo"
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label className="block mb-3">
                  Kilometraje: {formData.kilometraje.toLocaleString()} km
                </Label>
                <Slider
                  value={[formData.kilometraje]}
                  onValueChange={(values) => setFormData({...formData, kilometraje: values[0]})}
                  max={300000}
                  min={0}
                  step={5000}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>0 km</span>
                  <span>300,000 km</span>
                </div>
              </div>

              <div>
                <Label>Condición General</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {condiciones.map((condicion) => (
                    <Button
                      key={condicion.value}
                      variant={formData.condicion === condicion.value ? 'default' : 'outline'}
                      className="text-left h-auto p-3 flex flex-col items-start"
                      onClick={() => setFormData({...formData, condicion: condicion.value})}
                    >
                      <span className="font-medium">{condicion.value}</span>
                      <span className="text-xs text-muted-foreground mt-1">
                        {condicion.description}
                      </span>
                    </Button>
                  ))}
                </div>
              </div>

              <Button 
                onClick={calculatePrice} 
                className="w-full btn-premium"
                disabled={!formData.marca || !formData.modelo || !formData.precioOriginal}
              >
                <Calculator className="h-4 w-4 mr-2" />
                Calcular Precio Estimado
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="space-y-6">
            {resultado ? (
              <>
                <Card className="border-0 shadow-lg automotive-card">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <DollarSign className="h-5 w-5 text-automotive-gold" />
                      <span>Precio Estimado</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center space-y-4">
                      <div>
                        <p className="text-4xl font-bold text-automotive-gold">
                          {formatPrice(resultado.precioEstimado)}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Precio de reventa estimado
                        </p>
                      </div>

                      <div className="flex items-center justify-center space-x-2">
                        <span className="text-sm">Nivel de confianza:</span>
                        <Badge className={getConfidenceColor(resultado.confidence)}>
                          {resultado.confidence.toFixed(0)}%
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                        <div className="text-center">
                          <p className="text-lg font-semibold">{resultado.depreciation.toFixed(1)}%</p>
                          <p className="text-xs text-muted-foreground">Depreciación</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-semibold">{formatPrice(formData.precioOriginal - resultado.precioEstimado)}</p>
                          <p className="text-xs text-muted-foreground">Pérdida de valor</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg automotive-card">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5 text-automotive-blue" />
                      <span>Análisis Detallado</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-accent/20 rounded-lg">
                        <span className="text-sm">Factor de condición</span>
                        <Badge variant="outline">{(resultado.conditionFactor * 100).toFixed(0)}%</Badge>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 bg-accent/20 rounded-lg">
                        <span className="text-sm">Factor de mercado</span>
                        <Badge variant="outline">{(resultado.marketFactor * 100).toFixed(0)}%</Badge>
                      </div>

                      <div className="flex justify-between items-center p-3 bg-accent/20 rounded-lg">
                        <span className="text-sm">Años de uso</span>
                        <Badge variant="outline">{new Date().getFullYear() - formData.año} años</Badge>
                      </div>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                      <div className="flex items-start space-x-2">
                        <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-medium text-blue-800">Recomendaciones</p>
                          <ul className="mt-1 text-blue-700 space-y-1">
                            <li>• Considera el estado del mercado actual</li>
                            <li>• Verifica el historial de mantenimiento</li>
                            <li>• Revisa precios de vehículos similares</li>
                            <li>• Evalúa la demanda de la marca/modelo</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="border-0 shadow-lg automotive-card">
                <CardContent className="p-8 text-center">
                  <div className="space-y-4">
                    <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                      <Calculator className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-600">
                      Calculadora Lista
                    </h3>
                    <p className="text-gray-500">
                      Completa los datos del vehículo para obtener una estimación de precio de reventa.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Metodología */}
            <Card className="border-0 shadow-lg automotive-card">
              <CardHeader>
                <CardTitle className="text-lg">Metodología de Cálculo</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>• <strong>Depreciación:</strong> 15% anual promedio</p>
                <p>• <strong>Kilometraje:</strong> -$1 peso por km recorrido</p>
                <p>• <strong>Condición:</strong> Factor de 0.7 a 1.0 según estado</p>
                <p>• <strong>Marca:</strong> Factor premium para marcas reconocidas</p>
                <p>• <strong>Mercado:</strong> Variación del ±5% según demanda</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCalculator;
