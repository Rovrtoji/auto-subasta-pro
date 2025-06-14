
import { useState } from 'react';
import { useVehicles, useCreateVehicle, useUpdateVehicle } from '@/hooks/useVehicles';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Plus, Edit, Eye } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

const AdminInventory = () => {
  const { data: vehicles = [], isLoading } = useVehicles();
  const { profile } = useAuth();
  const createVehicle = useCreateVehicle();
  const updateVehicle = useUpdateVehicle();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<any>(null);

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
      estado_general: 'Bueno'
    }
  });

  const onSubmit = async (data: any) => {
    try {
      if (editingVehicle) {
        await updateVehicle.mutateAsync({
          id: editingVehicle.id,
          updates: data
        });
        toast.success('Vehículo actualizado exitosamente');
      } else {
        await createVehicle.mutateAsync(data);
        toast.success('Vehículo creado exitosamente');
      }
      setIsDialogOpen(false);
      setEditingVehicle(null);
      form.reset();
    } catch (error) {
      toast.error('Error al procesar el vehículo');
      console.error(error);
    }
  };

  const handleEdit = (vehicle: any) => {
    setEditingVehicle(vehicle);
    form.reset(vehicle);
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestión de Inventario</h1>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-automotive-blue hover:bg-automotive-blue/80">
              <Plus className="h-4 w-4 mr-2" />
              Agregar Vehículo
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingVehicle ? 'Editar Vehículo' : 'Agregar Nuevo Vehículo'}
              </DialogTitle>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="marca"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Marca</FormLabel>
                        <FormControl>
                          <Input {...field} />
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
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="año"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Año</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
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
                        <FormLabel>Precio</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="kilometraje"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kilometraje</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                        </FormControl>
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
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{vehicle.marca} {vehicle.modelo}</div>
                      <div className="text-sm text-gray-500">{vehicle.color}</div>
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
