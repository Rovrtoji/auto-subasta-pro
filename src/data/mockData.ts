
import { Vehicle, Auction, DashboardStats } from '../types';

export const mockVehicles: Vehicle[] = [
  {
    id: '1',
    marca: 'Toyota',
    modelo: 'Camry',
    año: 2022,
    kilometraje: 15000,
    precio: 580000,
    transmision: 'Automática',
    combustible: 'Gasolina',
    color: 'Blanco Perla',
    imagen: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=600&fit=crop',
    imagenes: [
      'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&h=600&fit=crop'
    ],
    descripcion: 'Toyota Camry en excelente estado, con mantenimientos al día y garantía extendida.',
    caracteristicas: ['Aire Acondicionado', 'Dirección Hidráulica', 'Bolsas de Aire', 'ABS', 'Bluetooth'],
    enSubasta: false,
    apartado: false,
    fechaCreacion: new Date('2024-01-15'),
    estadoGeneral: 'Excelente'
  },
  {
    id: '2',
    marca: 'Honda',
    modelo: 'Civic',
    año: 2021,
    kilometraje: 25000,
    precio: 420000,
    transmision: 'Manual',
    combustible: 'Gasolina',
    color: 'Azul Metálico',
    imagen: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&h=600&fit=crop',
    imagenes: [
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop'
    ],
    descripcion: 'Honda Civic deportivo con excelente rendimiento de combustible.',
    caracteristicas: ['Sistema de Sonido Premium', 'Cámara Trasera', 'Sensores de Reversa', 'Bluetooth'],
    enSubasta: true,
    apartado: false,
    fechaCreacion: new Date('2024-01-20'),
    estadoGeneral: 'Muy Bueno'
  },
  {
    id: '3',
    marca: 'BMW',
    modelo: 'Serie 3',
    año: 2020,
    kilometraje: 35000,
    precio: 750000,
    transmision: 'Automática',
    combustible: 'Gasolina',
    color: 'Negro',
    imagen: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop',
    imagenes: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1556189250-72ba954cfc2b?w=800&h=600&fit=crop'
    ],
    descripcion: 'BMW Serie 3 de lujo con todas las comodidades y tecnología de punta.',
    caracteristicas: ['Asientos de Cuero', 'Techo Solar', 'Sistema de Navegación', 'Control de Crucero'],
    enSubasta: false,
    apartado: true,
    fechaCreacion: new Date('2024-01-25'),
    estadoGeneral: 'Excelente'
  },
  {
    id: '4',
    marca: 'Nissan',
    modelo: 'Sentra',
    año: 2023,
    kilometraje: 8000,
    precio: 380000,
    transmision: 'Automática',
    combustible: 'Gasolina',
    color: 'Rojo',
    imagen: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800&h=600&fit=crop',
    imagenes: [
      'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1571607388263-1044f9ea01dd?w=800&h=600&fit=crop'
    ],
    descripcion: 'Nissan Sentra prácticamente nuevo, ideal para ciudad.',
    caracteristicas: ['Pantalla Táctil', 'Android Auto', 'Apple CarPlay', 'Sensores de Estacionamiento'],
    enSubasta: true,
    apartado: false,
    fechaCreacion: new Date('2024-02-01'),
    estadoGeneral: 'Excelente'
  },
  {
    id: '5',
    marca: 'Mercedes-Benz',
    modelo: 'Clase C',
    año: 2021,
    kilometraje: 20000,
    precio: 950000,
    transmision: 'Automática',
    combustible: 'Gasolina',
    color: 'Plata',
    imagen: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop',
    imagenes: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1617654112368-307921291f42?w=800&h=600&fit=crop'
    ],
    descripcion: 'Mercedes-Benz Clase C de lujo premium con tecnología avanzada.',
    caracteristicas: ['Asientos Ventilados', 'Sistema MBUX', 'Asistente de Conducción', 'Sonido Burmester'],
    enSubasta: false,
    apartado: false,
    fechaCreacion: new Date('2024-02-05'),
    estadoGeneral: 'Excelente'
  },
  {
    id: '6',
    marca: 'Volkswagen',
    modelo: 'Jetta',
    año: 2022,
    kilometraje: 12000,
    precio: 450000,
    transmision: 'Automática',
    combustible: 'Gasolina',
    color: 'Gris',
    imagen: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop',
    imagenes: [
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600013068500-52b1c3097b42?w=800&h=600&fit=crop'
    ],
    descripcion: 'Volkswagen Jetta confiable y económico con garantía vigente.',
    caracteristicas: ['Climatizador Automático', 'Faros LED', 'Pantalla Digital', 'USB múltiples'],
    enSubasta: true,
    apartado: false,
    fechaCreacion: new Date('2024-02-10'),
    estadoGeneral: 'Muy Bueno'
  }
];

export const mockAuctions: Auction[] = [
  {
    id: '1',
    vehicleId: '2',
    precioInicial: 380000,
    precioActual: 410000,
    fechaInicio: new Date('2024-06-10'),
    fechaFin: new Date('2024-06-15T18:00:00'),
    participantes: ['user1', 'user2', 'user3'],
    pujas: [],
    activa: true
  },
  {
    id: '2',
    vehicleId: '4',
    precioInicial: 350000,
    precioActual: 365000,
    fechaInicio: new Date('2024-06-11'),
    fechaFin: new Date('2024-06-16T20:00:00'),
    participantes: ['user2', 'user4'],
    pujas: [],
    activa: true
  },
  {
    id: '3',
    vehicleId: '6',
    precioInicial: 420000,
    precioActual: 435000,
    fechaInicio: new Date('2024-06-09'),
    fechaFin: new Date('2024-06-14T16:00:00'),
    participantes: ['user1', 'user3', 'user5'],
    pujas: [],
    activa: true
  }
];

export const mockDashboardStats: DashboardStats = {
  totalVehiculos: 6,
  vehiculosVendidos: 12,
  vehiculosEnSubasta: 3,
  vehiculosApartados: 1,
  ventasDelMes: 8,
  ingresosTotales: 4800000
};

export const marcas = [
  'Toyota', 'Honda', 'BMW', 'Mercedes-Benz', 'Nissan', 'Volkswagen', 
  'Audi', 'Ford', 'Chevrolet', 'Hyundai', 'Kia', 'Mazda'
];

export const años = Array.from({ length: 15 }, (_, i) => new Date().getFullYear() - i);
