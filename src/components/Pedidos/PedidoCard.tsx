import React, { useState } from 'react'
import { 
  MapPin, 
  Phone, 
  Clock, 
  DollarSign, 
  Check, 
  X, 
  Navigation,
  AlertTriangle,
  Package
} from 'lucide-react'
import { Asignacion } from '../../lib/supabase'

interface PedidoCardProps {
  asignacion: Asignacion
  onAceptar: (id: string) => void
  onRechazar: (id: string, notas?: string) => void
  onActualizarEstado: (pedidoId: string, nuevoEstado: string) => void
  onCompletar: (id: string, datos: any) => void
}

export function PedidoCard({ 
  asignacion, 
  onAceptar, 
  onRechazar, 
  onActualizarEstado, 
  onCompletar 
}: PedidoCardProps) {
  const [showDetails, setShowDetails] = useState(false)
  const [loading, setLoading] = useState(false)
  const [rechazarNotas, setRechazarNotas] = useState('')
  const [showRechazarModal, setShowRechazarModal] = useState(false)

  const pedido = asignacion.pedidos!
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getPriorityColor = (prioridad: string) => {
    switch (prioridad) {
      case 'urgente': return 'bg-red-100 text-red-800 border-red-200'
      case 'alta': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'normal': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'baja': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'pendiente': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'aceptado': return 'bg-green-100 text-green-800 border-green-200'
      case 'en_camino': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'entregado': return 'bg-purple-100 text-purple-800 border-purple-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const handleAceptar = async () => {
    setLoading(true)
    await onAceptar(asignacion.id)
    setLoading(false)
  }

  const handleRechazar = async () => {
    setLoading(true)
    await onRechazar(asignacion.id, rechazarNotas)
    setShowRechazarModal(false)
    setRechazarNotas('')
    setLoading(false)
  }

  const handleCambiarEstado = async (nuevoEstado: string) => {
    setLoading(true)
    await onActualizarEstado(pedido.id, nuevoEstado)
    setLoading(false)
  }

  const handleCompletar = async () => {
    setLoading(true)
    await onCompletar(asignacion.id, {
      tiempo_total: 30, // Calcular tiempo real
      valor_ganado: pedido.valor_domicilio,
      distancia: 5, // Calcular distancia real
    })
    setLoading(false)
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-gray-900">#{pedido.numero_pedido}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(pedido.prioridad)}`}>
                {pedido.prioridad}
              </span>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getEstadoColor(pedido.estado)}`}>
              {pedido.estado.replace('_', ' ')}
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-700">
              <MapPin className="w-4 h-4 text-gray-400" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{pedido.cliente_nombre}</p>
                <p className="text-xs text-gray-500 truncate">
                  {pedido.direccion_entrega?.direccion || 'Dirección no especificada'}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1 text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{pedido.tiempo_estimado} min</span>
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <DollarSign className="w-4 h-4" />
                <span className="font-semibold">{formatCurrency(pedido.valor_domicilio)}</span>
              </div>
            </div>

            <button
              onClick={() => setShowDetails(!showDetails)}
              className="w-full text-blue-600 hover:text-blue-700 text-sm font-medium py-2"
            >
              {showDetails ? 'Ocultar detalles' : 'Ver detalles'}
            </button>

            {showDetails && (
              <div className="border-t pt-3 space-y-2 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Cliente:</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span>{pedido.cliente_nombre}</span>
                    <a 
                      href={`tel:${pedido.cliente_telefono}`}
                      className="p-1 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
                    >
                      <Phone className="w-3 h-3" />
                    </a>
                  </div>
                </div>
                
                <div>
                  <span className="font-medium text-gray-700">Dirección de entrega:</span>
                  <p className="text-gray-600 mt-1">{pedido.direccion_entrega?.direccion}</p>
                  {pedido.direccion_entrega?.referencia && (
                    <p className="text-gray-500 text-xs mt-1">
                      Ref: {pedido.direccion_entrega.referencia}
                    </p>
                  )}
                </div>

                <div>
                  <span className="font-medium text-gray-700">Valor del pedido:</span>
                  <p className="text-gray-600">{formatCurrency(pedido.valor_pedido)}</p>
                </div>

                <div>
                  <span className="font-medium text-gray-700">Método de pago:</span>
                  <p className="text-gray-600 capitalize">{pedido.metodo_pago}</p>
                </div>

                {pedido.notas && (
                  <div>
                    <span className="font-medium text-gray-700">Notas:</span>
                    <p className="text-gray-600">{pedido.notas}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Botones de acción según el estado */}
          <div className="flex gap-2 mt-4">
            {asignacion.estado === 'pendiente' && (
              <>
                <button
                  onClick={handleAceptar}
                  disabled={loading}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Aceptar
                </button>
                <button
                  onClick={() => setShowRechazarModal(true)}
                  disabled={loading}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Rechazar
                </button>
              </>
            )}

            {asignacion.estado === 'aceptado' && pedido.estado === 'aceptado' && (
              <button
                onClick={() => handleCambiarEstado('en_camino')}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Navigation className="w-4 h-4" />
                Ir a recoger
              </button>
            )}

            {asignacion.estado === 'aceptado' && pedido.estado === 'en_camino' && (
              <button
                onClick={handleCompletar}
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                Marcar como entregado
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modal de rechazo */}
      {showRechazarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <h3 className="text-lg font-semibold">Rechazar pedido</h3>
            </div>
            
            <p className="text-gray-600 mb-4">
              ¿Estás seguro de que quieres rechazar este pedido? Puedes agregar una nota opcional.
            </p>

            <textarea
              value={rechazarNotas}
              onChange={(e) => setRechazarNotas(e.target.value)}
              placeholder="Motivo del rechazo (opcional)"
              className="w-full p-3 border border-gray-300 rounded-lg resize-none"
              rows={3}
            />

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setShowRechazarModal(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleRechazar}
                disabled={loading}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Confirmar rechazo
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}