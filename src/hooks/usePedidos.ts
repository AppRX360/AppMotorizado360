import { useState, useEffect } from 'react'
import { MockAsignacion, mockAsignaciones } from '../data/mockData'
import { useAuth } from './useAuth'

// Estado local para pedidos
let localAsignaciones: MockAsignacion[] = [...mockAsignaciones]

export function usePedidos() {
  const { motorizado } = useAuth()
  const [asignaciones, setAsignaciones] = useState<MockAsignacion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (motorizado) {
      fetchAsignaciones()
    }
  }, [motorizado])

  const fetchAsignaciones = async () => {
    if (!motorizado) return

    try {
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Filtrar asignaciones del motorizado actual
      const motorizadoAsignaciones = localAsignaciones.filter(
        a => a.motorizado_id === motorizado.id && 
        ['pendiente', 'aceptado'].includes(a.estado)
      )
      
      setAsignaciones(motorizadoAsignaciones)
    } catch (error) {
      console.error('Error fetching asignaciones:', error)
    } finally {
      setLoading(false)
    }
  }

  const aceptarAsignacion = async (asignacionId: string) => {
    try {
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 400))
      
      // Actualizar asignación local
      const asignacionIndex = localAsignaciones.findIndex(a => a.id === asignacionId)
      if (asignacionIndex !== -1) {
        localAsignaciones[asignacionIndex] = {
          ...localAsignaciones[asignacionIndex],
          estado: 'aceptado',
          fecha_respuesta: new Date().toISOString()
        }
        
        // También actualizar el estado del pedido
        if (localAsignaciones[asignacionIndex].pedidos) {
          localAsignaciones[asignacionIndex].pedidos!.estado = 'aceptado'
        }
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
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Actualizar asignación local
      const asignacionIndex = localAsignaciones.findIndex(a => a.id === asignacionId)
      if (asignacionIndex !== -1) {
        localAsignaciones[asignacionIndex] = {
          ...localAsignaciones[asignacionIndex],
          estado: 'rechazado',
          fecha_respuesta: new Date().toISOString(),
          notas
        }
      }
      
      // Remover de la lista después de un delay
      setTimeout(() => {
        localAsignaciones = localAsignaciones.filter(a => a.id !== asignacionId)
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
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 400))
      
      // Actualizar estado del pedido
      localAsignaciones.forEach(asignacion => {
        if (asignacion.pedidos?.id === pedidoId) {
          asignacion.pedidos.estado = nuevoEstado as any
        }
      })

      fetchAsignaciones()
      return { success: true }
    } catch (error) {
      console.error('Error updating order status:', error)
      return { success: false, error }
    }
  }

  const completarEntrega = async (asignacionId: string, entregaData: any) => {
    try {
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Marcar asignación como completada
      const asignacionIndex = localAsignaciones.findIndex(a => a.id === asignacionId)
      if (asignacionIndex !== -1) {
        localAsignaciones[asignacionIndex] = {
          ...localAsignaciones[asignacionIndex],
          estado: 'completado',
          fecha_completado: new Date().toISOString()
        }
        
        // Actualizar estado del pedido
        if (localAsignaciones[asignacionIndex].pedidos) {
          localAsignaciones[asignacionIndex].pedidos!.estado = 'entregado'
        }
      }
      
      // Remover de asignaciones activas después de un delay
      setTimeout(() => {
        localAsignaciones = localAsignaciones.filter(a => a.id !== asignacionId)
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