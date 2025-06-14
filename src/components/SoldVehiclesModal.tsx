
import { useState } from 'react';
import { FileExcel, Car, Calendar, DollarSign, User, Phone, Mail } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useVehicles } from '@/hooks/useVehicles';
import * as XLSX from 'xlsx';

interface SoldVehiclesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SoldVehiclesModal = ({ isOpen, onClose }: SoldVehiclesModalProps) => {
  const { data: vehicles, isLoading } = useVehicles();

  const soldVehicles = vehicles?.filter(vehicle => vehicle.apartado) || [];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX');
  };

  const exportToExcel = () => {
    const exportData = soldVehicles.map(vehicle => ({
      'ID': vehicle.id,
      'Marca': vehicle.marca,
      'Modelo': vehicle.modelo,
      'Año': vehicle.año,
      'Color': vehicle.color,
      'Kilometraje': vehicle.kilometraje,
      'Transmisión': vehicle.transmision,
      'Combustible': vehicle.combustible,
      'Precio': vehicle.precio,
      'Estado General': vehicle.estado_general,
      'Fecha de Venta': formatDate(vehicle.updated_at),
      'Descripción': vehicle.descripcion || 'N/A',
      'Características': vehicle.caracteristicas?.join(', ') || 'N/A'
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Vehículos Vendidos');

    // Ajustar ancho de columnas
    const colWidths = [
      { wch: 30 }, // ID
      { wch: 15 }, // Marca
      { wch: 15 }, // Modelo
      { wch: 8 },  // Año
      { wch: 12 }, // Color
      { wch: 12 }, // Kilometraje
      { wch: 12 }, // Transmisión
      { wch: 12 }, // Combustible
      { wch: 15 }, // Precio
      { wch: 15 }, // Estado General
      { wch: 15 }, // Fecha de Venta
      { wch: 30 }, // Descripción
      { wch: 40 }  // Características
    ];
    worksheet['!cols'] = colWidths;

    const fileName = `vehiculos_vendidos_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Car className="h-5 w-5 text-green-600" />
              <span>Vehículos Vendidos</span>
            </DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center h-32">
            <div className="text-center space-y-2">
              <Car className="h-8 w-8 text-automotive-blue mx-auto animate-pulse" />
              <p>Cargando vehículos...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Car className="h-5 w-5 text-green-600" />
              <span>Vehículos Vendidos ({soldVehicles.length})</span>
            </div>
            <Button
              onClick={exportToExcel}
              className="btn-premium"
              disabled={soldVehicles.length === 0}
            >
              <FileExcel className="h-4 w-4 mr-2" />
              Exportar a Excel
            </Button>
          </DialogTitle>
        </DialogHeader>

        {soldVehicles.length === 0 ? (
          <div className="text-center py-8">
            <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              No hay vehículos vendidos
            </h3>
            <p className="text-gray-500">
              Los vehículos vendidos aparecerán aquí una vez que se realicen las primeras ventas.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-green-50 to-automotive-gold/10 p-4 rounded-lg border">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="font-medium">Ingresos Totales:</span>
                  <span className="text-green-600 font-bold">
                    {formatPrice(soldVehicles.reduce((sum, v) => sum + Number(v.precio), 0))}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Car className="h-4 w-4 text-automotive-blue" />
                  <span className="font-medium">Vehículos Vendidos:</span>
                  <span className="text-automotive-blue font-bold">{soldVehicles.length}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-automotive-gold" />
                  <span className="font-medium">Precio Promedio:</span>
                  <span className="text-automotive-gold font-bold">
                    {formatPrice(soldVehicles.reduce((sum, v) => sum + Number(v.precio), 0) / soldVehicles.length)}
                  </span>
                </div>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehículo</TableHead>
                  <TableHead>Detalles</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha de Venta</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {soldVehicles.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <img
                          src={vehicle.imagen || '/placeholder.svg'}
                          alt={`${vehicle.marca} ${vehicle.modelo}`}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div>
                          <p className="font-semibold">
                            {vehicle.marca} {vehicle.modelo}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {vehicle.año} • {vehicle.color}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm space-y-1">
                        <p><span className="font-medium">KM:</span> {vehicle.kilometraje?.toLocaleString()}</p>
                        <p><span className="font-medium">Transmisión:</span> {vehicle.transmision}</p>
                        <p><span className="font-medium">Combustible:</span> {vehicle.combustible}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">
                          {formatPrice(vehicle.precio)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-green-500 hover:bg-green-600">
                        Vendido
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{formatDate(vehicle.updated_at)}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SoldVehiclesModal;
