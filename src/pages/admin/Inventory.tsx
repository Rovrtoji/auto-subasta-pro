
import { useState } from 'react';
import { useVehicles, useCreateVehicle, useUpdateVehicle, useInventoryStats } from '@/hooks/useVehicles';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Edit, BarChart3, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import ImageUploader from '@/components/ImageUploader';

const AdminInventory = () => {
  const { data: vehicles = [], isLoading } = useVehicles();
  const { data: stats } = useInventoryStats();
  const { profile } = useAuth();
  const createVehicle = useCreateVehicle();
  const updateVehicle = useUpdateVehicle();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<any>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [caracteristicas, setCaracteristicas] = useState<string[]>(['']);

  const form = useForm({
    defaultValues: {
      marca: '',
      modelo: '',
      año: new Date().getFullYear(),
      kilometraje: 0,
      precio: 0,
      transmision: 'Manual',
      combustible: 'Gasolina',
      color: '',
      descripcion: '',
      estado_general: 'Bueno',
      en_subasta: false,
      apartado: false
    }
  });

  const onSubmit = async (data: any) => {
    try {
      const vehicleData = {
        ...data,
        imagen: imageUrls[0] || '',
        imagenes: imageUrls,
        caracteristicas: caracteristicas.filter(feature => feature.trim() !== '')
      };

      if (editingVehicle) {
        await updateVehicle.mutateAsync({
          id: editingVehicle.id,
          updates: { ...vehicleData, imageUrls: imageUrls }
        });
        toast.success('Vehículo actualizado exitosamente');
      } else {
        await createVehicle.mutateAsync({
          ...vehicleData,
          imageUrls: imageUrls
        });
        toast.success('Vehículo creado exitosamente');
      }
      setIsDialogOpen(false);
      setEditingVehicle(null);
      form.reset();
      setImageUrls([]);
      setCaracteristicas(['']);
    } catch (error) {
      toast.error('Error al procesar el vehículo');
      console.error(error);
    }
  };

  const handleEdit = (vehicle: any) => {
    setEditingVehicle(vehicle);
    form.reset(vehicle);
    setImageUrls(vehicle.imagenes?.length > 0 ? vehicle.imagenes : []);
    setCaracteristicas(vehicle.caracteristicas?.length > 0 ? vehicle.caracteristicas : ['']);
    setIsDialogOpen(true);
  };

  const addCaracteristica = () => {
    setCaracteristicas([...caracteristicas, '']);
  };

  const removeCaracteristica = (index: number) => {
    setCaracteristicas(caracteristicas.filter((_, i) => i !== index));
  };

  const updateCaracteristica = (index: number, value: string) => {
    const newFeatures = [...caracteristicas];
    newFeatures[index] = value;
    setCaracteristicas(newFeatures);
  };

  const handleNewVehicle = () => {
    setEditingVehicle(null);
    form.reset();
    setImageUrls([]);
    setCaracteristicas(['']);
    setIsDialogOpen(true);
  };

  // Verificar si el usuario es admin o ejecutivo
  if (!profile || !['admin', 'ejecutivo'].includes(profile.rol)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-gray-600">
              No tienes permisos para acceder a esta página.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Cargando inventario...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Estadísticas del Inventario */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Vehículos</p>
                  <p className="text-2xl font-bold">{stats.total_vehiculos}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Disponibles</p>
                <p className="text-2xl font-bold text-green-600">{stats.vehiculos_disponibles}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Apartados</p>
                <p className="text-2xl font-bold text-red-600">{stats.vehiculos_apartados}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div>
                <p className="text-sm font-medium text-gray-600">En Subasta</p>
                <p className="text-2xl font-bold text-purple-600">{stats.vehiculos_en_subasta}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Valor Total</p>
                <p className="text-lg font-bold text-blue-600">
                  ${Number(stats.valor_total_inventario).toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestión de Inventario</h1>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleNewVehicle} className="bg-automotive-blue hover:bg-automotive-blue/80">
              <Plus className="h-4 w-4 mr-2" />
              Agregar Vehículo
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingVehicle ? 'Editar Vehículo' : 'Agregar Nuevo Vehículo'}
              </DialogTitle>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Información Básica */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Información Básica</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="marca"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Marca *</FormLabel>
                          <FormControl>
                            <Input placeholder="Ej: Toyota, Ford, Honda" {...field} />
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
                          <FormLabel>Modelo *</FormLabel>
                          <FormControl>
                            <Input placeholder="Ej: Camry, Focus, Civic" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="año"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Año *</FormLabel>
                          <FormControl>
                            <Input type="number" min="1950" max={new Date().getFullYear() + 1} {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
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
                          <FormLabel>Precio (MXN) *</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" step="0.01" placeholder="150000" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))} />
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
                          <FormLabel>Kilometraje *</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" placeholder="50000" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="transmision"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Transmisión *</FormLabel>
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
                          <FormLabel>Combustible *</FormLabel>
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
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="color"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Color *</FormLabel>
                          <FormControl>
                            <Input placeholder="Ej: Blanco, Negro, Azul" {...field} />
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
                          <FormLabel>Estado General *</FormLabel>
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
                </div>

                {/* Descripción */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Descripción</h3>
                  <FormField
                    control={form.control}
                    name="descripcion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descripción del vehículo</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe el vehículo, su estado, historial, mantenimiento, etc."
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Subida de Imágenes */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Imágenes del Vehículo</h3>
                  <ImageUploader
                    images={imageUrls}
                    onImagesChange={setImageUrls}
                    maxImages={10}
                  />
                </div>

                {/* Características */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Características</h3>
                  <div className="space-y-3">
                    {caracteristicas.map((feature, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder="Ej: Aire acondicionado, Sistema de navegación, Cámara trasera"
                          value={feature}
                          onChange={(e) => updateCaracteristica(index, e.target.value)}
                          className="flex-1"
                        />
                        {caracteristicas.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeCaracteristica(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addCaracteristica}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar característica
                    </Button>
                  </div>
                </div>

                {/* Estado del Vehículo */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Estado del Vehículo</h3>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="en_subasta"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              Vehículo en subasta
                            </FormLabel>
                            <p className="text-sm text-muted-foreground">
                              El vehículo aparecerá en la sección de subastas
                            </p>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="apartado"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              Vehículo apartado
                            </FormLabel>
                            <p className="text-sm text-muted-foreground">
                              El vehículo ya está reservado por un cliente
                            </p>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={createVehicle.isPending || updateVehicle.isPending}>
                  {editingVehicle ? 'Actualizar' : 'Crear'} Vehículo
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vehículos en Inventario ({vehicles.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehículo</TableHead>
                <TableHead>Año</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Kilometraje</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Destino</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      {vehicle.imagen && (
                        <img 
                          src={vehicle.imagen} 
                          alt={`${vehicle.marca} ${vehicle.modelo}`}
                          className="w-12 h-12 object-cover rounded"
                        />
                      )}
                      <div>
                        <div className="font-medium">{vehicle.marca} {vehicle.modelo}</div>
                        <div className="text-sm text-gray-500">{vehicle.color}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{vehicle.año}</TableCell>
                  <TableCell>${vehicle.precio.toLocaleString()}</TableCell>
                  <TableCell>{vehicle.kilometraje.toLocaleString()} km</TableCell>
                  <TableCell>
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                      vehicle.apartado ? 'bg-red-100 text-red-800' :
                      vehicle.en_subasta ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {vehicle.apartado ? 'Apartado' : 
                       vehicle.en_subasta ? 'En Subasta' : 'Disponible'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                      vehicle.en_subasta ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {vehicle.en_subasta ? 'Subasta' : 'Venta Directa'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(vehicle)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminInventory;
