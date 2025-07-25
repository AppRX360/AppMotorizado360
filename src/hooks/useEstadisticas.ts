import { useState, useEffect } from 'react'
import { mockSupabase, updateLocalEstadisticas, getLocalData } from '../lib/mockSupabase'
import { MockEstadisticas, MockEntrega } from '../data/mockData'
import { useAuth } from './useAuth'

export function useEstadisticas() {
  const { motorizado } = useAuth()
  const [estadisticasHoy, setEstadisticasHoy] = useState<MockEstadisticas | null>(null)
  const [historialEntregas, setHistorialEntregas] = useState<MockEntrega[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (motorizado) {
      fetchEstadisticasHoy()
      fetchHistorialEntregas()
    }
  }, [motorizado])

  const fetchEstadisticasHoy = async () => {
    if (!motorizado) return

    try {
      const hoy = new Date().toISOString().split('T')[0]
      
      const { data, error } = await mockSupabase
        .from('estadisticas_motorizado')
        .select('*')
        .eq('motorizado_id', motorizado.id)
        .eq('fecha', hoy)
        .single()

      if (error && error.code === 'PGRST116') {
        // No existe registro para hoy, crear uno
        const { data: newData, error: insertError } = await mockSupabase
          .from('estadisticas_motorizado')
          .insert({
            motorizado_id: motorizado.id,
            fecha: hoy,
          })
          .select()
          .single()

        if (insertError) throw insertError
        setEstadisticasHoy(newData)
      } else if (error) {
        throw error
      } else {
        setEstadisticasHoy(data)
      }
    } catch (error) {
      console.error('Error fetching statistics:', error)
    }
  }

  const fetchHistorialEntregas = async () => {
    if (!motorizado) return

    try {
      const { data, error } = await mockSupabase
        .from('entregas')
        .select(`
          *,
          pedidos (*)
        `)
        .eq('motorizado_id', motorizado.id)
        .order('fecha_entrega', { ascending: false })
        .limit(50)
        .then((result: any) => {
          if (result.data) {
            setHistorialEntregas(result.data)
          }
        })

      // También obtener datos locales actualizados
      const localData = getLocalData()
      setHistorialEntregas(localData.entregas)
    } catch (error) {
      console.error('Error fetching delivery history:', error)
    } finally {
      setLoading(false)
    }
  }

  const actualizarEstadisticas = async (nuevaEntrega: {
    valor_ganado: number
    tiempo_total: number
    distancia?: number
    rating_cliente?: number
  }) => {
    if (!motorizado || !estadisticasHoy) return

    try {
      const nuevasEstadisticas = {
        total_entregas: estadisticasHoy.total_entregas + 1,
        total_ganado: estadisticasHoy.total_ganado + nuevaEntrega.valor_ganado,
        tiempo_total_trabajo: estadisticasHoy.tiempo_total_trabajo + nuevaEntrega.tiempo_total,
        distancia_total: estadisticasHoy.distancia_total + (nuevaEntrega.distancia || 0),
        rating_promedio: nuevaEntrega.rating_cliente 
          ? ((estadisticasHoy.rating_promedio * estadisticasHoy.total_entregas) + nuevaEntrega.rating_cliente) / (estadisticasHoy.total_entregas + 1)
          : estadisticasHoy.rating_promedio
      }

      updateLocalEstadisticas(nuevasEstadisticas)
      setEstadisticasHoy({ ...estadisticasHoy, ...nuevasEstadisticas })

    } catch (error) {
      console.error('Error updating statistics:', error)
    }
  }

  return {
    estadisticasHoy,
    historialEntregas,
    loading,
    actualizarEstadisticas,
    refetch: () => {
      fetchEstadisticasHoy()
      fetchHistorialEntregas()
    }
  }
}