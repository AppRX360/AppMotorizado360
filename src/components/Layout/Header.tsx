import React from 'react'
import { 
  LogOut, 
  User, 
  Settings,
  CircleDot,
  Navigation
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

export function Header() {
  const { motorizado, signOut, updateDisponibilidad } = useAuth()

  const handleSignOut = async () => {
    await signOut()
  }

  const handleEstadoChange = async (nuevoEstado: 'disponible' | 'ocupado' | 'desconectado') => {
    await updateDisponibilidad(nuevoEstado)
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'disponible': return 'text-green-600 bg-green-100'
      case 'ocupado': return 'text-yellow-600 bg-yellow-100'
      case 'desconectado': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getEstadoText = (estado: string) => {
    switch (estado) {
      case 'disponible': return 'Disponible'
      case 'ocupado': return 'Ocupado'
      case 'desconectado': return 'Desconectado'
      default: return 'Desconectado'
    }
  }

  if (!motorizado) return null

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <Navigation className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                {motorizado.nombre}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <CircleDot className={`w-3 h-3 ${motorizado.estado_disponibilidad === 'disponible' ? 'text-green-500' : motorizado.estado_disponibilidad === 'ocupado' ? 'text-yellow-500' : 'text-gray-500'}`} />
                <select
                  value={motorizado.estado_disponibilidad}
                  onChange={(e) => handleEstadoChange(e.target.value as 'disponible' | 'ocupado' | 'desconectado')}
                  className={`text-xs font-medium px-2 py-1 rounded-full border-0 ${getEstadoColor(motorizado.estado_disponibilidad)}`}
                >
                  <option value="disponible">Disponible</option>
                  <option value="ocupado">Ocupado</option>
                  <option value="desconectado">Desconectado</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right mr-3">
              <div className="text-sm font-medium text-gray-900">
                ⭐ {motorizado.rating}/5.0
              </div>
              <div className="text-xs text-gray-500">
                {motorizado.total_entregas} entregas
              </div>
            </div>

            <button
              onClick={handleSignOut}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Cerrar sesión"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}