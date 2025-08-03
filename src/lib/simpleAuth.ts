// Sistema de autenticación ultra-simple
interface User {
  id: string
  email: string
}

interface Motorizado {
  id: string
  user_id: string
  nombre: string
  telefono: string
  documento: string
  placa_vehiculo: string
  tipo_vehiculo: string
  estado_disponibilidad: 'disponible' | 'ocupado' | 'desconectado'
  rating: number
  total_entregas: number
  activo: boolean
  created_at: string
  updated_at: string
}

// Estado global simple
let currentUser: User | null = null
let currentMotorizado: Motorizado | null = null

export const simpleAuth = {
  // Obtener usuario actual
  getCurrentUser: () => currentUser,
  
  // Obtener motorizado actual
  getCurrentMotorizado: () => currentMotorizado,

  // Login - SIEMPRE exitoso
  login: async (email: string, password: string) => {
    console.log('🔐 SimpleAuth: Iniciando login con', { email, password })
    
    // Simular delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // Crear usuario y motorizado automáticamente
    currentUser = {
      id: 'user-123',
      email: email
    }

    currentMotorizado = {
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
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    console.log('✅ SimpleAuth: Login exitoso')
    console.log('👤 Usuario:', currentUser)
    console.log('🏍️ Motorizado:', currentMotorizado)

    return {
      success: true,
      user: currentUser,
      motorizado: currentMotorizado
    }
  },

  // Logout
  logout: async () => {
    console.log('🚪 SimpleAuth: Cerrando sesión')
    currentUser = null
    currentMotorizado = null
    return { success: true }
  },

  // Actualizar disponibilidad
  updateDisponibilidad: async (estado: 'disponible' | 'ocupado' | 'desconectado') => {
    if (!currentMotorizado) {
      return { success: false, error: 'No hay motorizado logueado' }
    }

    currentMotorizado = {
      ...currentMotorizado,
      estado_disponibilidad: estado,
      updated_at: new Date().toISOString()
    }

    return {
      success: true,
      motorizado: currentMotorizado
    }
  }
}