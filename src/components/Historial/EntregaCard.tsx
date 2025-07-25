import React from 'react'
import { 
  Calendar, 
  Clock, 
  DollarSign, 
  MapPin, 
  Star,
  Package
} from 'lucide-react'
import { Entrega } from '../../lib/supabase'

interface EntregaCardProps {
  entrega: Entrega
}

export function EntregaCard({ entrega }: EntregaCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString))
  }

  const pedido = entrega.pedidos!

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-blue-600" />
          <span className="font-semibold text-gray-900">#{pedido.numero_pedido}</span>
        </div>
        <div className="flex items-center gap-1 text-green-600">
          <DollarSign className="w-4 h-4" />
          <span className="font-semibold">{formatCurrency(entrega.valor_ganado)}</span>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(entrega.fecha_entrega)}</span>
        </div>

        <div className="flex items-center gap-2 text-gray-600">
          <MapPin className="w-4 h-4" />
          <div className="flex-1 min-w-0">
            <p className="font-medium">{pedido.cliente_nombre}</p>
            <p className="text-xs text-gray-500 truncate">
              {pedido.direccion_entrega?.direccion}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{formatTime(entrega.tiempo_total)}</span>
          </div>

          {entrega.distancia && (
            <div className="flex items-center gap-1 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{entrega.distancia.toFixed(1)} km</span>
            </div>
          )}
        </div>

        {entrega.rating_cliente && (
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-gray-600">{entrega.rating_cliente}/5</span>
            {entrega.comentario_cliente && (
              <span className="text-xs text-gray-500 italic ml-2">
                "{entrega.comentario_cliente}"
              </span>
            )}
          </div>
        )}

        <div className="pt-2 border-t border-gray-100">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Valor pedido: {formatCurrency(pedido.valor_pedido)}</span>
            <span className="capitalize">Pago: {pedido.metodo_pago}</span>
          </div>
        </div>
      </div>
    </div>
  )
}