import { useState, useEffect } from 'react'
import { localAuth } from '../lib/localAuth'
import { MockUser, MockMotorizado } from '../data/mockData'

export function useAuth() {
  const [user, setUser] = useState<MockUser | null>(null)
  const [motorizado, setMotorizado] = useState<MockMotorizado | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('🔍 Verificando sesión existente...')
    
    // Verificar si hay una sesión activa al cargar
    const currentUser = localAuth.getCurrentSession()
    const currentMotorizado = localAuth.getCurrentMotorizado()
    
    if (currentUser && currentMotorizado) {
      console.log('✅ Sesión encontrada:', currentUser.email)
      setUser(currentUser)
      setMotorizado(currentMotorizado)
    } else {
      console.log('❌ No hay sesión activa')
    }
    
    setLoading(false)
  }, [])

  const signIn = async (email: string, password: string) => {
    console.log('🔐 Iniciando signIn con:', email)
    
    try {
      const result = await localAuth.signIn(email, password)
      
      console.log('📊 Resultado del login:', result)
      
      if (result.success && result.user && result.motorizado) {
        setUser(result.user)
        setMotorizado(result.motorizado)
        console.log('✅ Estado actualizado en useAuth')
        return { data: { user: result.user }, error: null }
      } else {
        console.log('❌ Login falló:', result)
        return { data: { user: null }, error: { message: 'Error en login' } }
      }
    } catch (error) {
      console.error('💥 Error en signIn:', error)
      return { data: { user: null }, error: { message: 'Error de conexión' } }
    }
  }

  const signUp = async (
    email: string, 
    password: string, 
    motorizadoData: Omit<MockMotorizado, 'id' | 'user_id' | 'created_at' | 'updated_at'>
  ) => {
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
      console.error('Error en signUp:', error)
      return { data: { user: null }, error: { message: 'Error de conexión' } }
    }
  }

  const signOut = async () => {
    try {
      await localAuth.signOut()
      setUser(null)
      setMotorizado(null)
      return { error: null }
    } catch (error) {
      console.error('Error en signOut:', error)
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

  console.log('🎯 Estado actual useAuth:', { user: user?.email, motorizado: motorizado?.nombre, loading })

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