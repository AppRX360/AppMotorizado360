// Sistema de autenticación local simplificado
import { MockUser, MockMotorizado } from '../data/mockData'

// Estado global simple
let isLoggedIn = false
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

  // Iniciar sesión - SIEMPRE exitoso para desarrollo
  signIn: async (email: string, password: string) => {
    console.log('Intentando login con:', email, password)
    
    // Simular delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // Validaciones mínimas
    if (!email || !email.includes('@')) {
      return {
        success: false,
        error: 'Email debe contener @'
      }
    }

    if (!password || password.length < 6) {
      return {
        success: false,
        error: 'Contraseña debe tener mínimo 6 caracteres'
      }
    }

    // SIEMPRE crear usuario exitosamente
    const userId = `user-${Date.now()}`
    
    currentUser = {
      id: userId,
      email: email
    }

    currentMotorizado = {
      id: `motorizado-${userId}`,
      user_id: userId,
      nombre: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
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

    isLoggedIn = true

    console.log('Login exitoso:', currentUser, currentMotorizado)

    return {
      success: true,
      user: currentUser,
      motorizado: currentMotorizado
    }
  },

  // Registrarse
  signUp: async (email: string, password: string, motorizadoData: any) => {
    console.log('Intentando registro con:', email, motorizadoData)
    
    await new Promise(resolve => setTimeout(resolve, 800))

    if (!email || !email.includes('@')) {
      return {
        success: false,
        error: 'Email debe contener @'
      }
    }

    if (!password || password.length < 6) {
      return {
        success: false,
        error: 'Contraseña debe tener mínimo 6 caracteres'
      }
    }

    const userId = `user-${Date.now()}`
    
    currentUser = {
      id: userId,
      email: email
    }

    currentMotorizado = {
      id: `motorizado-${userId}`,
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

    isLoggedIn = true

    return {
      success: true,
      user: currentUser,
      motorizado: currentMotorizado
    }
  },

  // Cerrar sesión
  signOut: async () => {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    currentUser = null
    currentMotorizado = null
    isLoggedIn = false
    
    return { success: true }
  },

  // Actualizar disponibilidad
  updateDisponibilidad: async (estado: 'disponible' | 'ocupado' | 'desconectado') => {
    if (!currentMotorizado) {
      return { success: false, error: 'No hay motorizado logueado' }
    }

    await new Promise(resolve => setTimeout(resolve, 300))

    currentMotorizado = {
      ...currentMotorizado,
      estado_disponibilidad: estado,
      updated_at: new Date().toISOString()
    }

    return {
      success: true,
      motorizado: currentMotorizado
    }
  },

  // Estado de login
  isAuthenticated: () => isLoggedIn
}