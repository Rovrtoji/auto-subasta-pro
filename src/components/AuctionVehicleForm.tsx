
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
import { Label } from '@/components/ui/label';
import { useCreateVehicle } from '@/hooks/useVehicles';
import { useCreateAuction } from '@/hooks/useCreateAuction';
import { useImageUpload } from '@/hooks/useImageUpload';
import ImageUploader from '@/components/ImageUploader';
import { toast } from 'sonner';
import { Loader2, Calendar, DollarSign } from 'lucide-react';

const auctionVehicleSchema = z.object({
  // Datos del vehículo
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
  // Datos de la subasta
  precioInicial: z.number().min(1, 'El precio inicial debe ser mayor a 0'),
  fechaInicio: z.string().min(1, 'La fecha de inicio es requerida'),
  fechaFin: z.string().min(1, 'La fecha de fin es requerida'),
});

type AuctionVehicleFormData = z.infer<typeof auctionVehicleSchema>;

interface AuctionVehicleFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const AuctionVehicleForm = ({ onClose, onSuccess }: AuctionVehicleFormProps) => {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [step, setStep] = useState<'vehicle' | 'auction'>('vehicle');
  const [createdVehicle, setCreatedVehicle] = useState<any>(null);
  
  const { uploadMultipleImages, isUploading } = useImageUpload();
  const createVehicle = useCreateVehicle();
  const createAuction = useCreateAuction();

  const form = useForm<AuctionVehicleFormData>({
    resolver: zodResolver(auctionVehicleSchema),
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
      precioInicial: 0,
      fechaInicio: '',
      fechaFin: '',
    },
  });

  const onSubmit = async (data: AuctionVehicleFormData) => {
    try {
      if (step === 'vehicle') {
        // Crear el vehículo primero
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
          en_subasta: false, // Se marcará como true cuando se cree la subasta
          apartado: false,
          imageUrls: uploadedImages,
        };

        const vehicle = await createVehicle.mutateAsync(vehicleData);
        setCreatedVehicle(vehicle);
        setStep('auction');
        toast.success('Vehículo creado. Ahora configura la subasta.');
      } else {
        // Crear la subasta
        const now = new Date();
        const fechaInicio = new Date(data.fechaInicio);
        const fechaFin = new Date(data.fechaFin);

        if (fechaInicio < now) {
          toast.error('La fecha de inicio debe ser futura');
          return;
        }

        if (fechaFin <= fechaInicio) {
          toast.error('La fecha de fin debe ser posterior a la fecha de inicio');
          return;
        }

        await createAuction.mutateAsync({
          vehicleId: createdVehicle.id,
          precioInicial: data.precioInicial,
          fechaInicio,
          fechaFin,
        });

        toast.success('Vehículo y subasta creados exitosamente');
        onSuccess?.();
        onClose();
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al procesar la solicitud');
    }
  };

  const handleImagesChange = (images: string[]) => {
    setUploadedImages(images);
  };

  const goBack = () => {
    setStep('vehicle');
    setCreatedVehicle(null);
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {step === 'vehicle' ? (
            <>
              <DollarSign className="h-5 w-5" />
              Paso 1: Agregar Vehículo
            </>
          ) : (
            <>
              <Calendar className="h-5 w-5" />
              Paso 2: Configurar Subasta
            </>
          )}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {step === 'vehicle' 
            ? 'Ingresa los datos del vehículo que se subastará'
            : 'Configura los parámetros de la subasta'
          }
        </p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {step === 'vehicle' ? (
              <>
                {/* Formulario del Vehículo */}
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
                        <FormLabel>Precio Base (MXN)</FormLabel>
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
              </>
            ) : (
              <>
                {/* Configuración de la Subasta */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">
                    {createdVehicle?.marca} {createdVehicle?.modelo}
                  </h3>
                  <p className="text-gray-600">Año: {createdVehicle?.año}</p>
                  <p className="text-gray-600">Precio base: ${createdVehicle?.precio?.toLocaleString()}</p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={form.control}
                    name="precioInicial"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Precio Inicial de Subasta (MXN)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="Ej. 150000"
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
                    name="fechaInicio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fecha y Hora de Inicio</FormLabel>
                        <FormControl>
                          <Input type="datetime-local" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fechaFin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fecha y Hora de Fin</FormLabel>
                        <FormControl>
                          <Input type="datetime-local" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </>
            )}

            <div className="flex gap-3 justify-end">
              <Button type="button" variant="outline" onClick={step === 'auction' ? goBack : onClose}>
                {step === 'auction' ? 'Volver' : 'Cancelar'}
              </Button>
              <Button 
                type="submit" 
                disabled={createVehicle.isPending || createAuction.isPending || isUploading}
                className="btn-premium"
              >
                {(createVehicle.isPending || createAuction.isPending) && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                {step === 'vehicle' ? 'Continuar a Subasta' : 'Crear Subasta'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AuctionVehicleForm;
