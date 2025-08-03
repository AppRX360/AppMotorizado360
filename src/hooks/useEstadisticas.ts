import { useState, useEffect } from 'react'
import { MockEstadisticas, MockEntrega, mockEstadisticasHoy, mockEntregas } from '../data/mockData'
import { useSimpleAuth } from './useSimpleAuth'

// Estado local para estadísticas
let localEstadisticas: MockEstadisticas = { ...mockEstadisticasHoy }
let localEntregas: MockEntrega[] = [...mockEntregas]

export function useEstadisticas() {
  const { motorizado } = useSimpleAuth()
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
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Actualizar motorizado_id en las estadísticas locales
      const estadisticasActualizadas = {
        ...localEstadisticas,
        motorizado_id: motorizado.id
      }
      
      setEstadisticasHoy(estadisticasActualizadas)
    } catch (error) {
      console.error('Error fetching statistics:', error)
    }
  }

  const fetchHistorialEntregas = async () => {
    if (!motorizado) return

    try {
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 400))
      
      // Filtrar entregas del motorizado actual
      const motorizadoEntregas = localEntregas.filter(
        e => e.motorizado_id === motorizado.id
      )
      
      setHistorialEntregas(motorizadoEntregas)
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
        ...estadisticasHoy,
        total_entregas: estadisticasHoy.total_entregas + 1,
        total_ganado: estadisticasHoy.total_ganado + nuevaEntrega.valor_ganado,
        tiempo_total_trabajo: estadisticasHoy.tiempo_total_trabajo + nuevaEntrega.tiempo_total,
        distancia_total: estadisticasHoy.distancia_total + (nuevaEntrega.distancia || 0),
        rating_promedio: nuevaEntrega.rating_cliente 
          ? ((estadisticasHoy.rating_promedio * estadisticasHoy.total_entregas) + nuevaEntrega.rating_cliente) / (estadisticasHoy.total_entregas + 1)
          : estadisticasHoy.rating_promedio,
        updated_at: new Date().toISOString()
      }

      localEstadisticas = nuevasEstadisticas
      setEstadisticasHoy(nuevasEstadisticas)

    } catch (error) {
      console.error('Error updating statistics:', error)
    }
  }

  const refetch = () => {
    fetchEstadisticasHoy()
    fetchHistorialEntregas()
  }

  return {
    estadisticasHoy,
    historialEntregas,
    loading,
    actualizarEstadisticas,
    refetch
  }
}