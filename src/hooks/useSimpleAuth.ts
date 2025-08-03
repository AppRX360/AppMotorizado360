import { useState, useEffect } from 'react'
import { simpleAuth } from '../lib/simpleAuth'

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

export function useSimpleAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [motorizado, setMotorizado] = useState<Motorizado | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('🔍 useSimpleAuth: Verificando sesión existente...')
    
    // Verificar si hay una sesión activa
    const currentUser = simpleAuth.getCurrentUser()
    const currentMotorizado = simpleAuth.getCurrentMotorizado()
    
    console.log('📊 useSimpleAuth: Sesión encontrada:', { currentUser, currentMotorizado })
    
    if (currentUser && currentMotorizado) {
      console.log('✅ useSimpleAuth: Sesión válida, estableciendo estado')
      setUser(currentUser)
      setMotorizado(currentMotorizado)
    } else {
      console.log('❌ useSimpleAuth: No hay sesión activa')
    }
    
    setLoading(false)
    console.log('🏁 useSimpleAuth: Inicialización completada')
  }, [])

  const signIn = async (email: string, password: string) => {
    console.log('🔐 useSimpleAuth.signIn iniciado con:', { email, password })
    
    try {
      const result = await simpleAuth.login(email, password)
      
      if (result.success && result.user && result.motorizado) {
        console.log('✅ useSimpleAuth: Login exitoso, actualizando estado')
        setUser(result.user)
        setMotorizado(result.motorizado)
        return { data: { user: result.user }, error: null }
      } else {
        console.log('❌ useSimpleAuth: Login falló')
        return { data: { user: null }, error: { message: 'Error en login' } }
      }
    } catch (error) {
      console.error('💥 useSimpleAuth.signIn error:', error)
      return { data: { user: null }, error: { message: 'Error de conexión' } }
    }
  }

  const signOut = async () => {
    console.log('🚪 useSimpleAuth.signOut iniciado')
    
    try {
      await simpleAuth.logout()
      setUser(null)
      setMotorizado(null)
      console.log('✅ useSimpleAuth.signOut completado')
      return { error: null }
    } catch (error) {
      console.error('Error en signOut:', error)
      return { error: { message: 'Error al cerrar sesión' } }
    }
  }

  const updateDisponibilidad = async (estado: 'disponible' | 'ocupado' | 'desconectado') => {
    try {
      const result = await simpleAuth.updateDisponibilidad(estado)
      
      if (result.success && result.motorizado) {
        setMotorizado(result.motorizado)
        return { data: result.motorizado, error: null }
      } else {
        return { data: null, error: { message: result.error || 'Error al actualizar estado' } }
      }
    } catch (error) {
      console.error('Error updating disponibilidad:', error)
      return { data: null, error: { message: 'Error al actualizar estado' } }
    }
  }

  // Log del estado actual
  useEffect(() => {
    console.log('🎯 useSimpleAuth - Estado actual:')
    console.log('  - Loading:', loading)
    console.log('  - User:', user?.email || 'null')
    console.log('  - Motorizado:', motorizado?.nombre || 'null')
  }, [user, motorizado, loading])

  return {
    user,
    motorizado,
    loading,
    signIn,
    signOut,
    updateDisponibilidad,
  }
}