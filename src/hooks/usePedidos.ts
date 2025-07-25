import { useState, useEffect } from 'react'
import { mockSupabase, updateLocalAsignacion, removeLocalAsignacion, addLocalEntrega } from '../lib/mockSupabase'
import { MockAsignacion } from '../data/mockData'
import { useAuth } from './useAuth'

export function usePedidos() {
  const { motorizado } = useAuth()
  const [asignaciones, setAsignaciones] = useState<MockAsignacion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (motorizado) {
      fetchAsignaciones()
      subscribeToAsignaciones()
    }
  }, [motorizado])

  const fetchAsignaciones = async () => {
    if (!motorizado) return

    try {
      const { data, error } = await mockSupabase
        .from('asignaciones')
        .select(`
          *,
          pedidos (*)
        `)
        .eq('motorizado_id', motorizado.id)
        .in('estado', ['pendiente', 'aceptado'])
        .order('created_at', { ascending: false })

      if (error) throw error
      setAsignaciones(data || [])
    } catch (error) {
      console.error('Error fetching asignaciones:', error)
    } finally {
      setLoading(false)
    }
  }

  const subscribeToAsignaciones = () => {
    if (!motorizado) return

    const subscription = mockSupabase
      .channel('asignaciones_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'asignaciones',
          filter: `motorizado_id=eq.${motorizado.id}`,
        },
        () => {
          fetchAsignaciones()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }

  const aceptarAsignacion = async (asignacionId: string) => {
    try {
      const { error } = await mockSupabase
        .from('asignaciones')
        .update({
          estado: 'aceptado',
          fecha_respuesta: new Date().toISOString(),
        })
        .eq('id', asignacionId)

      if (error) throw error

      // También actualizar el estado del pedido
      const asignacion = asignaciones.find(a => a.id === asignacionId)
      if (asignacion) {
        await mockSupabase
          .from('pedidos')
          .update({ estado: 'aceptado' })
          .eq('id', asignacion.pedido_id)
      }

      fetchAsignaciones()
      return { success: true }
    } catch (error) {
      console.error('Error accepting assignment:', error)
      return { success: false, error }
    }
  }

  const rechazarAsignacion = async (asignacionId: string, notas?: string) => {
    try {
      updateLocalAsignacion(asignacionId, {
        estado: 'rechazado',
        fecha_respuesta: new Date().toISOString(),
        notas
      })
      
      // Simular delay y remover de la lista local
      setTimeout(() => {
        removeLocalAsignacion(asignacionId)
        fetchAsignaciones()
      }, 500)
      
      return { success: true }
    } catch (error) {
      console.error('Error rejecting assignment:', error)
      return { success: false, error }
    }
  }

  const actualizarEstadoPedido = async (pedidoId: string, nuevoEstado: string) => {
    try {
      const { error } = await mockSupabase
        .from('asignaciones')
        .update({ estado: nuevoEstado })
        .eq('id', pedidoId)

      if (error) throw error

      fetchAsignaciones()
      return { success: true }
    } catch (error) {
      console.error('Error updating order status:', error)
      return { success: false, error }
    }
  }

  const completarEntrega = async (asignacionId: string, entregaData: any) => {
    try {
      // Marcar asignación como completada
      updateLocalAsignacion(asignacionId, {
        estado: 'completado',
        fecha_completado: new Date().toISOString()
      })

      // Actualizar estado del pedido y crear entrega
      const asignacion = asignaciones.find(a => a.id === asignacionId)
      if (asignacion && asignacion.pedidos) {
        // Actualizar estado del pedido
        asignacion.pedidos.estado = 'entregado'
        
        // Crear registro de entrega
        const nuevaEntrega = {
          id: `entrega-${Date.now()}`,
          motorizado_id: motorizado!.id,
          pedido_id: asignacion.pedido_id,
          asignacion_id: asignacionId,
          fecha_entrega: new Date().toISOString(),
          created_at: new Date().toISOString(),
          pedidos: asignacion.pedidos,
          ...entregaData
        }
        
        addLocalEntrega(nuevaEntrega)
      }
      
      // Remover de asignaciones activas
      setTimeout(() => {
        removeLocalAsignacion(asignacionId)
        fetchAsignaciones()
      }, 1000)

      return { success: true }
    } catch (error) {
      console.error('Error completing delivery:', error)
      return { success: false, error }
    }
  }

  return {
    asignaciones,
    loading,
    aceptarAsignacion,
    rechazarAsignacion,
    actualizarEstadoPedido,
    completarEntrega,
  }
}