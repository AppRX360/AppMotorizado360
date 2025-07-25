// Datos de ejemplo para desarrollo local
export interface MockUser {
  id: string
  email: string
}

export interface MockMotorizado {
  id: string
  user_id: string
  nombre: string
  telefono: string
  documento: string
  placa_vehiculo: string
  tipo_vehiculo: string
  estado_disponibilidad: 'disponible' | 'ocupado' | 'desconectado'
  ubicacion_actual?: any
  rating: number
  total_entregas: number
  activo: boolean
  created_at: string
  updated_at: string
}

export interface MockPedido {
  id: string
  numero_pedido: string
  cliente_nombre: string
  cliente_telefono: string
  direccion_recogida: any
  direccion_entrega: any
  descripcion?: string
  valor_pedido: number
  valor_domicilio: number
  metodo_pago: string
  notas?: string
  estado: 'pendiente' | 'asignado' | 'aceptado' | 'en_camino' | 'entregado' | 'cancelado'
  prioridad: 'baja' | 'normal' | 'alta' | 'urgente'
  tiempo_estimado: number
  created_at: string
  updated_at: string
}

export interface MockAsignacion {
  id: string
  pedido_id: string
  motorizado_id: string
  estado: 'pendiente' | 'aceptado' | 'rechazado' | 'completado' | 'cancelado'
  fecha_asignacion: string
  fecha_respuesta?: string
  fecha_completado?: string
  notas?: string
  created_at: string
  pedidos?: MockPedido
}

export interface MockEntrega {
  id: string
  motorizado_id: string
  pedido_id: string
  asignacion_id: string
  tiempo_total: number
  distancia?: number
  valor_ganado: number
  rating_cliente?: number
  comentario_cliente?: string
  fecha_entrega: string
  created_at: string
  pedidos?: MockPedido
}

export interface MockEstadisticas {
  id: string
  motorizado_id: string
  fecha: string
  total_entregas: number
  total_ganado: number
  tiempo_total_trabajo: number
  distancia_total: number
  rating_promedio: number
  created_at: string
  updated_at: string
}

// Usuario de ejemplo
export const mockUser: MockUser = {
  id: 'user-123',
  email: 'carlos.rodriguez@email.com'
}

// Motorizado de ejemplo
export const mockMotorizado: MockMotorizado = {
  id: 'motorizado-123',
  user_id: 'user-123',
  nombre: 'Carlos Rodríguez',
  telefono: '+57 300 123 4567',
  documento: '12345678',
  placa_vehiculo: 'ABC123',
  tipo_vehiculo: 'motocicleta',
  estado_disponibilidad: 'disponible',
  rating: 4.8,
  total_entregas: 247,
  activo: true,
  created_at: '2024-01-15T10:00:00Z',
  updated_at: '2024-01-22T14:30:00Z'
}

// Pedidos de ejemplo
export const mockPedidos: MockPedido[] = [
  {
    id: 'pedido-1',
    numero_pedido: 'PED-2024-001',
    cliente_nombre: 'María González',
    cliente_telefono: '+57 301 234 5678',
    direccion_recogida: {
      direccion: 'Restaurante El Buen Sabor - Calle 45 #23-12',
      referencia: 'Local comercial con letrero rojo'
    },
    direccion_entrega: {
      direccion: 'Carrera 15 #67-89, Apartamento 302',
      referencia: 'Edificio azul, portero en recepción'
    },
    descripcion: '1 Pizza grande pepperoni, 2 gaseosas',
    valor_pedido: 45000,
    valor_domicilio: 5000,
    metodo_pago: 'efectivo',
    notas: 'Tocar timbre 3 veces',
    estado: 'pendiente',
    prioridad: 'normal',
    tiempo_estimado: 25,
    created_at: '2024-01-22T15:30:00Z',
    updated_at: '2024-01-22T15:30:00Z'
  },
  {
    id: 'pedido-2',
    numero_pedido: 'PED-2024-002',
    cliente_nombre: 'Juan Pérez',
    cliente_telefono: '+57 302 345 6789',
    direccion_recogida: {
      direccion: 'Farmacia San Jorge - Avenida 80 #45-23'
    },
    direccion_entrega: {
      direccion: 'Calle 72 #34-56, Casa blanca con reja negra',
      referencia: 'Al lado de la panadería'
    },
    valor_pedido: 25000,
    valor_domicilio: 4000,
    metodo_pago: 'tarjeta',
    estado: 'aceptado',
    prioridad: 'alta',
    tiempo_estimado: 15,
    created_at: '2024-01-22T14:45:00Z',
    updated_at: '2024-01-22T15:00:00Z'
  },
  {
    id: 'pedido-3',
    numero_pedido: 'PED-2024-003',
    cliente_nombre: 'Ana Martínez',
    cliente_telefono: '+57 303 456 7890',
    direccion_recogida: {
      direccion: 'Supermercado Éxito - Centro Comercial Plaza'
    },
    direccion_entrega: {
      direccion: 'Transversal 45 #12-34, Torre B, Piso 8',
      referencia: 'Conjunto residencial Los Pinos'
    },
    valor_pedido: 85000,
    valor_domicilio: 6000,
    metodo_pago: 'efectivo',
    notas: 'Llamar al llegar, no hay portero',
    estado: 'en_camino',
    prioridad: 'urgente',
    tiempo_estimado: 35,
    created_at: '2024-01-22T13:20:00Z',
    updated_at: '2024-01-22T14:15:00Z'
  }
]

// Asignaciones de ejemplo
export const mockAsignaciones: MockAsignacion[] = [
  {
    id: 'asignacion-1',
    pedido_id: 'pedido-1',
    motorizado_id: 'motorizado-123',
    estado: 'pendiente',
    fecha_asignacion: '2024-01-22T15:30:00Z',
    created_at: '2024-01-22T15:30:00Z',
    pedidos: mockPedidos[0]
  },
  {
    id: 'asignacion-2',
    pedido_id: 'pedido-2',
    motorizado_id: 'motorizado-123',
    estado: 'aceptado',
    fecha_asignacion: '2024-01-22T14:45:00Z',
    fecha_respuesta: '2024-01-22T15:00:00Z',
    created_at: '2024-01-22T14:45:00Z',
    pedidos: mockPedidos[1]
  },
  {
    id: 'asignacion-3',
    pedido_id: 'pedido-3',
    motorizado_id: 'motorizado-123',
    estado: 'aceptado',
    fecha_asignacion: '2024-01-22T13:20:00Z',
    fecha_respuesta: '2024-01-22T13:25:00Z',
    created_at: '2024-01-22T13:20:00Z',
    pedidos: mockPedidos[2]
  }
]

// Historial de entregas de ejemplo
export const mockEntregas: MockEntrega[] = [
  {
    id: 'entrega-1',
    motorizado_id: 'motorizado-123',
    pedido_id: 'pedido-completed-1',
    asignacion_id: 'asignacion-completed-1',
    tiempo_total: 28,
    distancia: 4.2,
    valor_ganado: 5500,
    rating_cliente: 5,
    comentario_cliente: 'Excelente servicio, muy rápido',
    fecha_entrega: '2024-01-22T12:45:00Z',
    created_at: '2024-01-22T12:45:00Z',
    pedidos: {
      id: 'pedido-completed-1',
      numero_pedido: 'PED-2024-098',
      cliente_nombre: 'Roberto Silva',
      cliente_telefono: '+57 304 567 8901',
      direccion_recogida: { direccion: 'McDonald\'s - Zona Rosa' },
      direccion_entrega: { direccion: 'Calle 85 #15-30' },
      valor_pedido: 32000,
      valor_domicilio: 5500,
      metodo_pago: 'tarjeta',
      estado: 'entregado',
      prioridad: 'normal',
      tiempo_estimado: 30,
      created_at: '2024-01-22T12:00:00Z',
      updated_at: '2024-01-22T12:45:00Z'
    }
  },
  {
    id: 'entrega-2',
    motorizado_id: 'motorizado-123',
    pedido_id: 'pedido-completed-2',
    asignacion_id: 'asignacion-completed-2',
    tiempo_total: 22,
    distancia: 3.1,
    valor_ganado: 4000,
    rating_cliente: 4,
    comentario_cliente: 'Buen servicio',
    fecha_entrega: '2024-01-22T11:30:00Z',
    created_at: '2024-01-22T11:30:00Z',
    pedidos: {
      id: 'pedido-completed-2',
      numero_pedido: 'PED-2024-097',
      cliente_nombre: 'Lucía Herrera',
      cliente_telefono: '+57 305 678 9012',
      direccion_recogida: { direccion: 'Droguería Colsubsidio' },
      direccion_entrega: { direccion: 'Carrera 7 #45-67' },
      valor_pedido: 18000,
      valor_domicilio: 4000,
      metodo_pago: 'efectivo',
      estado: 'entregado',
      prioridad: 'normal',
      tiempo_estimado: 20,
      created_at: '2024-01-22T11:00:00Z',
      updated_at: '2024-01-22T11:30:00Z'
    }
  },
  {
    id: 'entrega-3',
    motorizado_id: 'motorizado-123',
    pedido_id: 'pedido-completed-3',
    asignacion_id: 'asignacion-completed-3',
    tiempo_total: 35,
    distancia: 6.8,
    valor_ganado: 7000,
    rating_cliente: 5,
    comentario_cliente: 'Muy profesional, llegó en tiempo récord',
    fecha_entrega: '2024-01-22T10:15:00Z',
    created_at: '2024-01-22T10:15:00Z',
    pedidos: {
      id: 'pedido-completed-3',
      numero_pedido: 'PED-2024-096',
      cliente_nombre: 'Diego Morales',
      cliente_telefono: '+57 306 789 0123',
      direccion_recogida: { direccion: 'KFC - Centro Andino' },
      direccion_entrega: { direccion: 'Calle 127 #45-89, Conjunto Los Arrayanes' },
      valor_pedido: 58000,
      valor_domicilio: 7000,
      metodo_pago: 'tarjeta',
      estado: 'entregado',
      prioridad: 'alta',
      tiempo_estimado: 40,
      created_at: '2024-01-22T09:30:00Z',
      updated_at: '2024-01-22T10:15:00Z'
    }
  }
]

// Estadísticas del día de ejemplo
export const mockEstadisticasHoy: MockEstadisticas = {
  id: 'stats-today',
  motorizado_id: 'motorizado-123',
  fecha: '2024-01-22',
  total_entregas: 3,
  total_ganado: 16500,
  tiempo_total_trabajo: 85, // 1h 25min
  distancia_total: 14.1,
  rating_promedio: 4.7,
  created_at: '2024-01-22T00:00:00Z',
  updated_at: '2024-01-22T15:30:00Z'
}