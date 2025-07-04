
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCreateVehicle } from '@/hooks/useVehicles';
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
});

type VehicleFormData = z.infer<typeof vehicleSchema>;

interface VehicleFormProps {
  onClose: () => void;
  onSuccess?: () => void;
  forAuction?: boolean;
}

const VehicleForm = ({ onClose, onSuccess, forAuction = false }: VehicleFormProps) => {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const { uploadMultipleImages, isUploading } = useImageUpload();
  const createVehicle = useCreateVehicle();

  const form = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      marca: '',
      modelo: '',
      año: new Date().getFullYear(),
      kilometraje: 0,
      precio: 0,
      transmision: '',
      combustible: '',
      color: '',
      estado_general: 'Bueno',
      descripcion: '',
    },
  });

  const onSubmit = async (data: VehicleFormData) => {
    try {
      console.log('Form data:', data);
      console.log('Uploaded images:', uploadedImages);
      console.log('For auction:', forAuction);
      
      const vehicleData = {
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
        en_subasta: false, // Los vehículos se crean siempre como no en subasta inicialmente
        apartado: false,
        imageUrls: uploadedImages,
      };

      console.log('Vehicle data to submit:', vehicleData);

      await createVehicle.mutateAsync(vehicleData);
      
      const message = forAuction 
        ? 'Vehículo creado exitosamente. Ahora puedes crear una subasta para este vehículo.'
        : 'Vehículo creado exitosamente para venta directa';
      
      toast.success(message);
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error creating vehicle:', error);
      toast.error('Error al crear el vehículo');
    }
  };

  const handleImagesChange = (images: string[]) => {
    console.log('Images changed:', images);
    setUploadedImages(images);
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>
          {forAuction ? 'Agregar Vehículo para Subasta' : 'Agregar Vehículo - Venta Directa'}
        </CardTitle>
        {forAuction && (
          <p className="text-sm text-muted-foreground">
            Este vehículo será agregado al inventario y estará disponible para crear subastas.
          </p>
        )}
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                disabled={createVehicle.isPending || isUploading}
                className="btn-premium"
              >
                {createVehicle.isPending && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                {forAuction ? 'Crear Vehículo para Subasta' : 'Crear Vehículo'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default VehicleForm;
