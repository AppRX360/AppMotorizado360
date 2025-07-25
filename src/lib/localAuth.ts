// Sistema de autenticación local ultra-simplificado
import { MockUser, MockMotorizado } from '../data/mockData'

// Estado global simple en memoria
let currentUser: MockUser | null = null
let currentMotorizado: MockMotorizado | null = null

export const localAuth = {
  // Obtener sesión actual
  getCurrentSession: () => {
    console.log('🔍 getCurrentSession llamado, usuario actual:', currentUser)
    return currentUser
  },

  // Obtener motorizado actual
  getCurrentMotorizado: () => {
    console.log('🔍 getCurrentMotorizado llamado, motorizado actual:', currentMotorizado)
    return currentMotorizado
  },

  // Iniciar sesión - SIEMPRE exitoso
  signIn: async (email: string, password: string) => {
    console.log('🔐 LocalAuth.signIn iniciado con:', { email, password })
    
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

    console.log('✅ LocalAuth.signIn completado exitosamente')
    console.log('👤 Usuario creado:', currentUser)
    console.log('🏍️ Motorizado creado:', currentMotorizado)

    return {
      success: true,
      user: currentUser,
      motorizado: currentMotorizado
    }
  },

  // Registrarse
  signUp: async (email: string, password: string, motorizadoData: any) => {
    console.log('📝 LocalAuth.signUp iniciado con:', { email, motorizadoData })
    
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

    console.log('✅ LocalAuth.signUp completado exitosamente')
    console.log('👤 Usuario registrado:', currentUser)
    console.log('🏍️ Motorizado registrado:', currentMotorizado)

    return {
      success: true,
      user: currentUser,
      motorizado: currentMotorizado
    }
  },

  // Cerrar sesión
  signOut: async () => {
    console.log('🚪 LocalAuth.signOut iniciado')
    
    currentUser = null
    currentMotorizado = null
    
    console.log('✅ LocalAuth.signOut completado')
    return { success: true }
  },

  // Actualizar disponibilidad
  updateDisponibilidad: async (estado: 'disponible' | 'ocupado' | 'desconectado') => {
    console.log('🔄 LocalAuth.updateDisponibilidad iniciado con estado:', estado)
    
    if (!currentMotorizado) {
      console.log('❌ No hay motorizado logueado')
      return { success: false, error: 'No hay motorizado logueado' }
    }

    currentMotorizado = {
      ...currentMotorizado,
      estado_disponibilidad: estado,
      updated_at: new Date().toISOString()
    }

    console.log('✅ LocalAuth.updateDisponibilidad completado')
    console.log('🔄 Nuevo estado:', currentMotorizado.estado_disponibilidad)

    return {
      success: true,
      motorizado: currentMotorizado
    }
  }
}