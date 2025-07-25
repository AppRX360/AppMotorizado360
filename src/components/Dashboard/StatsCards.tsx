import React from 'react'
import { 
  DollarSign, 
  Package, 
  Clock, 
  Star,
  TrendingUp,
  MapPin
} from 'lucide-react'
import { EstadisticasMotorizado } from '../../lib/supabase'

interface StatsCardsProps {
  estadisticas?: EstadisticasMotorizado | null
}

export function StatsCards({ estadisticas }: StatsCardsProps) {
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

  const cards = [
    {
      title: 'Ganancias del día',
      value: formatCurrency(estadisticas?.total_ganado || 0),
      icon: DollarSign,
      color: 'text-green-600 bg-green-100',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Entregas realizadas',
      value: estadisticas?.total_entregas || 0,
      icon: Package,
      color: 'text-blue-600 bg-blue-100',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Tiempo trabajado',
      value: formatTime(estadisticas?.tiempo_total_trabajo || 0),
      icon: Clock,
      color: 'text-purple-600 bg-purple-100',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Rating promedio',
      value: `${estadisticas?.rating_promedio?.toFixed(1) || '5.0'}/5`,
      icon: Star,
      color: 'text-yellow-600 bg-yellow-100',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Distancia total',
      value: `${estadisticas?.distancia_total?.toFixed(1) || '0'} km`,
      icon: MapPin,
      color: 'text-indigo-600 bg-indigo-100',
      bgColor: 'bg-indigo-50',
    },
    {
      title: 'Promedio por entrega',
      value: formatCurrency(
        estadisticas && estadisticas.total_entregas > 0 
          ? estadisticas.total_ganado / estadisticas.total_entregas 
          : 0
      ),
      icon: TrendingUp,
      color: 'text-teal-600 bg-teal-100',
      bgColor: 'bg-teal-50',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <div
            key={index}
            className={`${card.bgColor} rounded-xl p-4 border border-opacity-20`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`w-8 h-8 rounded-lg ${card.color} flex items-center justify-center`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <p className="text-sm text-gray-600">{card.title}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}