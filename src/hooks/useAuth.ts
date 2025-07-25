import { useState, useEffect } from 'react'
import { mockSupabase } from '../lib/mockSupabase'
import { MockUser, MockMotorizado } from '../data/mockData'

export function useAuth() {
  const [user, setUser] = useState<MockUser | null>(null)
  const [motorizado, setMotorizado] = useState<MockMotorizado | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Obtener sesión inicial
    mockSupabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchMotorizado(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Escuchar cambios de autenticación
    const { data: { subscription } } = mockSupabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchMotorizado(session.user.id)
      } else {
        setMotorizado(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchMotorizado = async (userId: string) => {
    try {
      const { data, error } = await mockSupabase
        .from('motorizados')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching motorizado:', error)
      } else if (data) {
        setMotorizado(data)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await mockSupabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (data.user && !error) {
        setUser(data.user)
        await fetchMotorizado(data.user.id)
      }
      
      return { data, error }
    } catch (error) {
      console.error('Error in signIn:', error)
      return { data: { user: null }, error: { message: 'Error de conexión' } }
    }
  }

  const signUp = async (email: string, password: string, motorizadoData: Omit<MockMotorizado, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await mockSupabase.auth.signUp({
      email,
      password,
    })

    if (data.user && !error) {
      // Crear perfil de motorizado
      const { error: profileError } = await mockSupabase
        .from('motorizados')
        .insert({
          user_id: data.user.id,
          ...motorizadoData,
        })

      if (profileError) {
        console.error('Error creating motorizado profile:', profileError)
        return { data, error: profileError }
      }
    }

    return { data, error }
  }

  const signOut = async () => {
    const { error } = await mockSupabase.auth.signOut()
    return { error }
  }

  const updateDisponibilidad = async (estado: 'disponible' | 'ocupado' | 'desconectado') => {
    if (!motorizado) return { error: new Error('No motorizado found') }

    const { data, error } = await mockSupabase
      .from('motorizados')
      .update({ estado_disponibilidad: estado })
      .eq('id', motorizado.id)
      .select()
      .single()

    if (!error && data) {
      setMotorizado(data)
    }

    return { data, error }
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