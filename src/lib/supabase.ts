// Tipos de datos para la aplicación (mantenemos compatibilidad)
export interface Motorizado {
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

export interface Pedido {
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

export interface Asignacion {
  id: string
  pedido_id: string
  motorizado_id: string
  estado: 'pendiente' | 'aceptado' | 'rechazado' | 'completado' | 'cancelado'
  fecha_asignacion: string
  fecha_respuesta?: string
  fecha_completado?: string
  notas?: string
  created_at: string
  pedidos?: Pedido
}

export interface Entrega {
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
  pedidos?: Pedido
  pedidos?: Pedido
}

export interface EstadisticasMotorizado {
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

// Re-exportar el mock como supabase para compatibilidad
export { mockSupabase as supabase } from './mockSupabase'