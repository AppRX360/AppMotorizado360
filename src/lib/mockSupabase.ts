// Mock de Supabase para desarrollo local
import { 
  mockUser, 
  mockMotorizado, 
  mockAsignaciones, 
  mockEntregas, 
  mockEstadisticasHoy,
  MockUser,
  MockMotorizado,
  MockAsignacion,
  MockEntrega,
  MockEstadisticas
} from '../data/mockData'

// Estado local para simular la base de datos
let localUser: MockUser | null = null
let localMotorizado: MockMotorizado | null = null
let localAsignaciones: MockAsignacion[] = [...mockAsignaciones]
let localEntregas: MockEntrega[] = [...mockEntregas]
let localEstadisticas: MockEstadisticas = { ...mockEstadisticasHoy }

// Simular delay de red
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Mock del cliente de Supabase
export const mockSupabase = {
  auth: {
    getSession: async () => {
      await delay(500)
      return {
        data: {
          session: localUser ? {
            user: localUser,
            access_token: 'mock-token'
          } : null
        }
      }
    },

    onAuthStateChange: (callback: (event: string, session: any) => void) => {
      // Simular cambio de estado inmediato
      setTimeout(() => {
        callback('SIGNED_IN', localUser ? { user: localUser } : null)
      }, 100)

      return {
        data: {
          subscription: {
            unsubscribe: () => {}
          }
        }
      }
    },

 signInWithPassword: async ({ email, password }: { email: string, password: string }) => {
  await delay(1000)
  
  // Simular login exitoso con credenciales de ejemplo
  if (email === 'carlosr@email.com' && password === '123') {
    localUser = mockUser
    localMotorizado = mockMotorizado
    return { data: { user: mockUser }, error: null }
  }
  
  return { 
    data: { user: null }, 
    error: { message: 'Credenciales inválidas' } 
  }
}



    signUp: async ({ email, password }: { email: string, password: string }) => {
      await delay(1500)
      
      // Simular registro exitoso
      const newUser = {
        id: user-${Date.now()},
        email
      }
      
      localUser = newUser
      return { data: { user: newUser }, error: null }
    },

    signOut: async () => {
      await delay(500)
      localUser = null
      localMotorizado = null
      return { error: null }
    }
  },

  from: (table: string) => ({
    select: (columns: string = '*') => ({
      eq: (column: string, value: any) => ({
        single: async () => {
          await delay(300)
          
          if (table === 'motorizados' && column === 'user_id') {
            return { data: localMotorizado, error: null }
          }
          
          if (table === 'estadisticas_motorizado' && column === 'motorizado_id') {
            return { data: localEstadisticas, error: null }
          }
          
          return { data: null, error: { code: 'PGRST116' } }
        },

        order: (orderColumn: string, options?: any) => ({
          limit: (limitCount: number) => ({
            then: async (callback: (result: any) => void) => {
              await delay(400)
              
              if (table === 'entregas') {
                callback({ data: localEntregas.slice(0, limitCount), error: null })
              }
            }
          })
        })
      }),

      in: (column: string, values: string[]) => ({
        order: (orderColumn: string, options?: any) => ({
          then: async (callback: (result: any) => void) => {
            await delay(400)
            
            if (table === 'asignaciones') {
              callback({ data: localAsignaciones, error: null })
            }
          }
        })
      })
    }),

    insert: (data: any) => ({
      select: () => ({
        single: async () => {
          await delay(600)
          
          if (table === 'motorizados') {
            const newMotorizado = {
              id: `motorizado-${Date.now()}`,
              user_id: localUser?.id || '',
              ...data,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
            localMotorizado = newMotorizado
            return { data: newMotorizado, error: null }
          }
          
          if (table === 'estadisticas_motorizado') {
            const newStats = {
              id: `stats-${Date.now()}`,
              ...data,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
            localEstadisticas = newStats
            return { data: newStats, error: null }
          }
          
          if (table === 'entregas') {
            const newEntrega = {
              id: `entrega-${Date.now()}`,
              ...data,
              created_at: new Date().toISOString()
            }
            localEntregas.unshift(newEntrega)
            return { data: newEntrega, error: null }
          }
          
          return { data: null, error: null }
        }
      })
    }),

    update: (data: any) => ({
      eq: (column: string, value: any) => ({
        select: () => ({
          single: async () => {
            await delay(400)
            
            if (table === 'motorizados' && localMotorizado) {
              localMotorizado = { ...localMotorizado, ...data, updated_at: new Date().toISOString() }
              return { data: localMotorizado, error: null }
            }
            
            if (table === 'asignaciones') {
              const asignacionIndex = localAsignaciones.findIndex(a => a.id === value)
              if (asignacionIndex !== -1) {
                localAsignaciones[asignacionIndex] = { 
                  ...localAsignaciones[asignacionIndex], 
                  ...data 
                }
                return { data: localAsignaciones[asignacionIndex], error: null }
              }
            }
            
            if (table === 'pedidos') {
              // Actualizar el estado del pedido en las asignaciones
              localAsignaciones.forEach(asignacion => {
                if (asignacion.pedidos?.id === value) {
                  asignacion.pedidos = { ...asignacion.pedidos, ...data }
                }
              })
              return { data: null, error: null }
            }
            
            if (table === 'estadisticas_motorizado') {
              localEstadisticas = { ...localEstadisticas, ...data, updated_at: new Date().toISOString() }
              return { data: localEstadisticas, error: null }
            }
            
            return { data: null, error: null }
          }
        }),

        then: async (callback: (result: any) => void) => {
          await delay(400)
          callback({ data: null, error: null })
        }
      })
    })
  }),

  channel: (channelName: string) => ({
    on: (event: string, config: any, callback: () => void) => ({
      subscribe: () => ({
        unsubscribe: () => {}
      })
    })
  })
}

// Funciones auxiliares para manipular datos locales
export const updateLocalAsignacion = (id: string, updates: Partial<MockAsignacion>) => {
  const index = localAsignaciones.findIndex(a => a.id === id)
  if (index !== -1) {
    localAsignaciones[index] = { ...localAsignaciones[index], ...updates }
  }
}

export const removeLocalAsignacion = (id: string) => {
  localAsignaciones = localAsignaciones.filter(a => a.id !== id)
}

export const addLocalEntrega = (entrega: MockEntrega) => {
  localEntregas.unshift(entrega)
}

export const updateLocalEstadisticas = (updates: Partial<MockEstadisticas>) => {
  localEstadisticas = { ...localEstadisticas, ...updates }
}

export const getLocalData = () => ({
  user: localUser,
  motorizado: localMotorizado,
  asignaciones: localAsignaciones,
  entregas: localEntregas,
  estadisticas: localEstadisticas
})