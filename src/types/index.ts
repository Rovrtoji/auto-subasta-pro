
export interface Vehicle {
  id: string;
  marca: string;
  modelo: string;
  año: number;
  kilometraje: number;
  precio: number;
  transmision: 'Manual' | 'Automática';
  combustible: 'Gasolina' | 'Diesel' | 'Híbrido' | 'Eléctrico';
  color: string;
  imagen: string;
  imagenes: string[];
  descripcion: string;
  caracteristicas: string[];
  enSubasta: boolean;
  apartado: boolean;
  fechaCreacion: Date;
  estadoGeneral: 'Excelente' | 'Muy Bueno' | 'Bueno' | 'Regular';
}

export interface Auction {
  id: string;
  vehicleId: string;
  precioInicial: number;
  precioActual: number;
  fechaInicio: Date;
  fechaFin: Date;
  participantes: string[];
  pujas: Bid[];
  activa: boolean;
}

export interface Bid {
  id: string;
  auctionId: string;
  userId: string;
  userName: string;
  cantidad: number;
  fecha: Date;
}

export interface Appointment {
  id: string;
  vehicleId: string;
  clienteNombre: string;
  clienteEmail: string;
  clienteTelefono: string;
  fecha: Date;
  hora: string;
  mensaje?: string;
  estado: 'Pendiente' | 'Confirmada' | 'Completada' | 'Cancelada';
}

export interface Reservation {
  id: string;
  vehicleId: string;
  clienteNombre: string;
  clienteEmail: string;
  clienteTelefono: string;
  fechaApartado: Date;
  montoSeña: number;
  estado: 'Activa' | 'Vencida' | 'Completada';
}

export interface User {
  id: string;
  email: string;
  nombre: string;
  telefono?: string;
  rol: 'cliente' | 'admin' | 'ejecutivo';
  fechaRegistro: Date;
}

export interface DashboardStats {
  totalVehiculos: number;
  vehiculosVendidos: number;
  vehiculosEnSubasta: number;
  vehiculosApartados: number;
  ventasDelMes: number;
  ingresosTotales: number;
}

export interface FilterOptions {
  marca?: string;
  añoMin?: number;
  añoMax?: number;
  precioMin?: number;
  precioMax?: number;
  kilometrajeMax?: number;
  transmision?: string;
  combustible?: string;
}
