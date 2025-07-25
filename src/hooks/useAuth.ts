import { useState, useEffect } from 'react'
import { localAuth } from '../lib/localAuth'
import { MockUser, MockMotorizado } from '../data/mockData'

export function useAuth() {
  const [user, setUser] = useState<MockUser | null>(null)
  const [motorizado, setMotorizado] = useState<MockMotorizado | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('🔍 useAuth.useEffect iniciado - Verificando sesión existente...')
    
    // Verificar si hay una sesión activa al cargar
    const currentUser = localAuth.getCurrentSession()
    const currentMotorizado = localAuth.getCurrentMotorizado()
    
    console.log('📊 Sesión encontrada:', { currentUser, currentMotorizado })
    
    if (currentUser && currentMotorizado) {
      console.log('✅ Sesión válida encontrada, estableciendo estado')
      setUser(currentUser)
      setMotorizado(currentMotorizado)
    } else {
      console.log('❌ No hay sesión activa')
    }
    
    setLoading(false)
    console.log('🏁 useAuth.useEffect completado')
  }, [])

  const signIn = async (email: string, password: string) => {
    console.log('🔐 useAuth.signIn iniciado con:', { email, password })
    
    try {
      console.log('📞 Llamando a localAuth.signIn...')
      const result = await localAuth.signIn(email, password)
      
      console.log('📋 Resultado de localAuth.signIn:', result)
      
      if (result.success && result.user && result.motorizado) {
        console.log('✅ Login exitoso, actualizando estado de useAuth')
        setUser(result.user)
        setMotorizado(result.motorizado)
        console.log('🎯 Estado actualizado - Usuario:', result.user.email)
        console.log('🎯 Estado actualizado - Motorizado:', result.motorizado.nombre)
        return { data: { user: result.user }, error: null }
      } else {
        console.log('❌ Login falló:', result)
        return { data: { user: null }, error: { message: 'Error en login' } }
      }
    } catch (error) {
      console.error('💥 Error en useAuth.signIn:', error)
      return { data: { user: null }, error: { message: 'Error de conexión' } }
    }
  }

  const signUp = async (
    email: string, 
    password: string, 
    motorizadoData: Omit<MockMotorizado, 'id' | 'user_id' | 'created_at' | 'updated_at'>
  ) => {
    console.log('📝 useAuth.signUp iniciado')
    
    try {
      const result = await localAuth.signUp(email, password, motorizadoData)
      
      if (result.success && result.user && result.motorizado) {
        setUser(result.user)
        setMotorizado(result.motorizado)
        return { data: { user: result.user }, error: null }
      } else {
        return { data: { user: null }, error: { message: 'Error en registro' } }
      }
    } catch (error) {
      console.error('Error en useAuth.signUp:', error)
      return { data: { user: null }, error: { message: 'Error de conexión' } }
    }
  }

  const signOut = async () => {
    console.log('🚪 useAuth.signOut iniciado')
    
    try {
      await localAuth.signOut()
      setUser(null)
      setMotorizado(null)
      console.log('✅ useAuth.signOut completado')
      return { error: null }
    } catch (error) {
      console.error('Error en useAuth.signOut:', error)
      return { error: { message: 'Error al cerrar sesión' } }
    }
  }

  const updateDisponibilidad = async (estado: 'disponible' | 'ocupado' | 'desconectado') => {
    try {
      const result = await localAuth.updateDisponibilidad(estado)
      
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

  // Log del estado actual cada vez que cambie
  useEffect(() => {
    console.log('🎯 Estado actual de useAuth:')
    console.log('  - Loading:', loading)
    console.log('  - User:', user?.email || 'null')
    console.log('  - Motorizado:', motorizado?.nombre || 'null')
  }, [user, motorizado, loading])

  return {
    user,
    motorizado,
    loading,
    signIn,
    signUp,
    signOut,
    updateDisponibilidad,
  }
}