// Sistema de autenticación local para desarrollo
import { MockUser, MockMotorizado, mockMotorizado } from '../data/mockData'

// Estado local de autenticación
let currentUser: MockUser | null = null
let currentMotorizado: MockMotorizado | null = null

// Usuarios predefinidos para desarrollo
const localUsers = [
  {
    id: 'user-123',
    email: 'test@email.com',
    password: '123456'
  },
  {
    id: 'user-456',
    email: 'motorizado@ejemplo.com',
    password: 'password'
  }
]

export const localAuth = {
  // Obtener sesión actual
  getCurrentSession: () => {
    return currentUser
  },

  // Obtener motorizado actual
  getCurrentMotorizado: () => {
    return currentMotorizado
  },

  // Iniciar sesión
  signIn: async (email: string, password: string) => {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 800))

    // Validaciones básicas
    if (!email || !email.includes('@')) {
      return {
        success: false,
        error: 'Email debe ser válido'
      }
    }

    if (!password || password.length < 6) {
      return {
        success: false,
        error: 'Contraseña debe tener mínimo 6 caracteres'
      }
    }

    // Buscar usuario o crear uno nuevo
    let foundUser = localUsers.find(u => u.email === email && u.password === password)
    
    if (!foundUser) {
      // Para desarrollo, crear usuario automáticamente
      foundUser = {
        id: `user-${Date.now()}`,
        email,
        password
      }
      localUsers.push(foundUser)
    }

    // Establecer usuario actual
    currentUser = {
      id: foundUser.id,
      email: foundUser.email
    }

    // Crear/obtener motorizado
    currentMotorizado = {
      ...mockMotorizado,
      id: `motorizado-${foundUser.id}`,
      user_id: foundUser.id,
      nombre: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1)
    }

    return {
      success: true,
      user: currentUser,
      motorizado: currentMotorizado
    }
  },

  // Registrarse
  signUp: async (email: string, password: string, motorizadoData: any) => {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 1200))

    // Validaciones básicas
    if (!email || !email.includes('@')) {
      return {
        success: false,
        error: 'Email debe ser válido'
      }
    }

    if (!password || password.length < 6) {
      return {
        success: false,
        error: 'Contraseña debe tener mínimo 6 caracteres'
      }
    }

    // Verificar si el usuario ya existe
    const existingUser = localUsers.find(u => u.email === email)
    if (existingUser) {
      return {
        success: false,
        error: 'Este email ya está registrado'
      }
    }

    // Crear nuevo usuario
    const newUser = {
      id: `user-${Date.now()}`,
      email,
      password
    }
    localUsers.push(newUser)

    // Establecer usuario actual
    currentUser = {
      id: newUser.id,
      email: newUser.email
    }

    // Crear motorizado
    currentMotorizado = {
      id: `motorizado-${newUser.id}`,
      user_id: newUser.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      rating: 5.0,
      total_entregas: 0,
      activo: true,
      ...motorizadoData
    }

    return {
      success: true,
      user: currentUser,
      motorizado: currentMotorizado
    }
  },

  // Cerrar sesión
  signOut: async () => {
    await new Promise(resolve => setTimeout(resolve, 300))
    currentUser = null
    currentMotorizado = null
    return { success: true }
  },

  // Actualizar disponibilidad del motorizado
  updateDisponibilidad: async (estado: 'disponible' | 'ocupado' | 'desconectado') => {
    if (!currentMotorizado) {
      return { success: false, error: 'No hay motorizado logueado' }
    }

    await new Promise(resolve => setTimeout(resolve, 400))

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