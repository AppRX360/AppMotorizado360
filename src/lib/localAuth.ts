// Sistema de autenticación local ultra-simplificado
import { MockUser, MockMotorizado } from '../data/mockData'

// Estado global simple en memoria
let currentUser: MockUser | null = null
let currentMotorizado: MockMotorizado | null = null

export const localAuth = {
  // Obtener sesión actual
  getCurrentSession: () => {
    return currentUser
  },

  // Obtener motorizado actual
  getCurrentMotorizado: () => {
    return currentMotorizado
  },

  // Iniciar sesión - SIEMPRE exitoso
  signIn: async (email: string, password: string) => {
    console.log('🔐 Intentando login con:', email, password)
    
    // Simular delay mínimo
    await new Promise(resolve => setTimeout(resolve, 100))

    // Crear usuario automáticamente
    const userId = 'user-123'
    
    currentUser = {
      id: userId,
      email: email
    }

    currentMotorizado = {
      id: 'motorizado-123',
      user_id: userId,
      nombre: 'Carlos Rodríguez',
      telefono: '+57 300 123 4567',
      documento: '12345678',
      placa_vehiculo: 'ABC123',
      tipo_vehiculo: 'motocicleta',
      estado_disponibilidad: 'disponible',
      ubicacion_actual: null,
      rating: 4.8,
      total_entregas: 247,
      activo: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    console.log('✅ Login exitoso:', currentUser, currentMotorizado)

    return {
      success: true,
      user: currentUser,
      motorizado: currentMotorizado
    }
  },

  // Registrarse
  signUp: async (email: string, password: string, motorizadoData: any) => {
    console.log('📝 Intentando registro con:', email, motorizadoData)
    
    await new Promise(resolve => setTimeout(resolve, 200))

    const userId = 'user-new-123'
    
    currentUser = {
      id: userId,
      email: email
    }

    currentMotorizado = {
      id: 'motorizado-new-123',
      user_id: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      rating: 5.0,
      total_entregas: 0,
      activo: true,
      estado_disponibilidad: 'desconectado',
      ubicacion_actual: null,
      ...motorizadoData
    }

    console.log('✅ Registro exitoso:', currentUser, currentMotorizado)

    return {
      success: true,
      user: currentUser,
      motorizado: currentMotorizado
    }
  },

  // Cerrar sesión
  signOut: async () => {
    console.log('🚪 Cerrando sesión')
    
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

    console.log('🔄 Estado actualizado:', estado)

    return {
      success: true,
      motorizado: currentMotorizado
    }
  }
}