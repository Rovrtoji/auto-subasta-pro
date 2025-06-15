
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useUpdateVehicle } from '@/hooks/useVehicles';
import { useImageUpload } from '@/hooks/useImageUpload';
import ImageUploader from '@/components/ImageUploader';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const vehicleSchema = z.object({
  marca: z.string().min(1, 'La marca es requerida'),
  modelo: z.string().min(1, 'El modelo es requerido'),
  año: z.number().min(1900, 'Año inválido').max(new Date().getFullYear() + 1, 'Año inválido'),
  kilometraje: z.number().min(0, 'El kilometraje debe ser positivo'),
  precio: z.number().min(1, 'El precio debe ser mayor a 0'),
  transmision: z.string().min(1, 'La transmisión es requerida'),
  combustible: z.string().min(1, 'El tipo de combustible es requerido'),
  color: z.string().min(1, 'El color es requerido'),
  estado_general: z.string().min(1, 'El estado general es requerido'),
  descripcion: z.string().optional(),
  tipo_venta: z.enum(['venta_directa', 'subasta'], {
    required_error: 'Debes seleccionar el tipo de venta',
  }),
});

type VehicleFormData = z.infer<typeof vehicleSchema>;

interface VehicleEditFormProps {
  vehicle: any;
  onClose: () => void;
  onSuccess?: () => void;
}

const VehicleEditForm = ({ vehicle, onClose, onSuccess }: VehicleEditFormProps) => {
  const [uploadedImages, setUploadedImages] = useState<string[]>(vehicle.imagenes || []);
  const { uploadMultipleImages, isUploading } = useImageUpload();
  const updateVehicle = useUpdateVehicle();

  const form = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      marca: vehicle.marca || '',
      modelo: vehicle.modelo || '',
      año: vehicle.año || new Date().getFullYear(),
      kilometraje: vehicle.kilometraje || 0,
      precio: vehicle.precio || 0,
      transmision: vehicle.transmision || '',
      combustible: vehicle.combustible || '',
      color: vehicle.color || '',
      estado_general: vehicle.estado_general || 'Bueno',
      descripcion: vehicle.descripcion || '',
      tipo_venta: vehicle.en_subasta ? 'subasta' : 'venta_directa',
    },
  });

  const onSubmit = async (data: VehicleFormData) => {
    try {
      console.log('Edit form data:', data);
      console.log('Updated images:', uploadedImages);
      
      const enSubasta = data.tipo_venta === 'subasta';
      
      const vehicleUpdates = {
        marca: data.marca,
        modelo: data.modelo,
        año: data.año,
        kilometraje: data.kilometraje,
        precio: data.precio,
        transmision: data.transmision,
        combustible: data.combustible,
        color: data.color,
        estado_general: data.estado_general,
        descripcion: data.descripcion || '',
        en_subasta: enSubasta,
        apartado: vehicle.apartado, // Mantener el estado actual de apartado
        imageUrls: uploadedImages,
      };

      console.log('Vehicle updates to submit:', vehicleUpdates);

      await updateVehicle.mutateAsync({
        id: vehicle.id,
        updates: vehicleUpdates
      });
      
      toast.success('Vehículo actualizado exitosamente');
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error updating vehicle:', error);
      toast.error('Error al actualizar el vehículo');
    }
  };

  const handleImagesChange = (images: string[]) => {
    console.log('Images changed in edit:', images);
    setUploadedImages(images);
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Editar Vehículo</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Tipo de Venta */}
            <FormField
              control={form.control}
              name="tipo_venta"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Tipo de Venta</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="venta_directa" id="edit_venta_directa" />
                        <Label htmlFor="edit_venta_directa">Venta Directa</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="subasta" id="edit_subasta" />
                        <Label htmlFor="edit_subasta">Subasta</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="marca"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marca</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej. Toyota" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="modelo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modelo</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej. Corolla" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="año"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Año</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="kilometraje"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kilometraje</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="precio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio (MXN)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="transmision"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transmisión</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona transmisión" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Manual">Manual</SelectItem>
                        <SelectItem value="Automática">Automática</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="combustible"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Combustible</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona combustible" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Gasolina">Gasolina</SelectItem>
                        <SelectItem value="Diesel">Diesel</SelectItem>
                        <SelectItem value="Híbrido">Híbrido</SelectItem>
                        <SelectItem value="Eléctrico">Eléctrico</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej. Blanco" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="estado_general"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado General</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona estado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Excelente">Excelente</SelectItem>
                        <SelectItem value="Muy Bueno">Muy Bueno</SelectItem>
                        <SelectItem value="Bueno">Bueno</SelectItem>
                        <SelectItem value="Regular">Regular</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="descripcion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descripción del vehículo..." 
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <label className="block text-sm font-medium mb-2">Imágenes del Vehículo</label>
              <ImageUploader
                images={uploadedImages}
                onImagesChange={handleImagesChange}
                maxImages={5}
              />
              {uploadedImages.length > 0 && (
                <p className="text-sm text-gray-600 mt-2">
                  {uploadedImages.length} imagen(es) subida(s)
                </p>
              )}
            </div>

            <div className="flex gap-3 justify-end">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={updateVehicle.isPending || isUploading}
                className="btn-premium"
              >
                {updateVehicle.isPending && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                Actualizar Vehículo
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default VehicleEditForm;
