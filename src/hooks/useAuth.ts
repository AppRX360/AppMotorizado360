import { useState, useEffect } from 'react'
import { localAuth } from '../lib/localAuth'
import { MockUser, MockMotorizado } from '../data/mockData'

export function useAuth() {
  const [user, setUser] = useState<MockUser | null>(null)
  const [motorizado, setMotorizado] = useState<MockMotorizado | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar si hay una sesión activa al cargar
    const currentUser = localAuth.getCurrentSession()
    const currentMotorizado = localAuth.getCurrentMotorizado()
    
    if (currentUser && currentMotorizado) {
      setUser(currentUser)
      setMotorizado(currentMotorizado)
    }
    
    setLoading(false)
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const result = await localAuth.signIn(email, password)
      
      if (result.success) {
        setUser(result.user!)
        setMotorizado(result.motorizado!)
        return { data: { user: result.user }, error: null }
      } else {
        return { data: { user: null }, error: { message: result.error } }
      }
    } catch (error) {
      console.error('Error in signIn:', error)
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
      
      if (result.success) {
        setUser(result.user!)
        setMotorizado(result.motorizado!)
        return { data: { user: result.user }, error: null }
      } else {
        return { data: { user: null }, error: { message: result.error } }
      }
    } catch (error) {
      console.error('Error in signUp:', error)
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
      console.error('Error in signOut:', error)
      return { error: { message: 'Error al cerrar sesión' } }
    }
  }

  const updateDisponibilidad = async (estado: 'disponible' | 'ocupado' | 'desconectado') => {
    try {
      const result = await localAuth.updateDisponibilidad(estado)
      
      if (result.success) {
        setMotorizado(result.motorizado!)
        return { data: result.motorizado, error: null }
      } else {
        return { data: null, error: { message: result.error } }
      }
    } catch (error) {
      console.error('Error updating disponibilidad:', error)
      return { data: null, error: { message: 'Error al actualizar estado' } }
    }
  }

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