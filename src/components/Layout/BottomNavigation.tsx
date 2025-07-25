import React from 'react'
import { 
  Home, 
  Package, 
  BarChart3, 
  Clock,
  Bell
} from 'lucide-react'

interface BottomNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
  notificationCount?: number
}

export function BottomNavigation({ activeTab, onTabChange, notificationCount = 0 }: BottomNavigationProps) {
  const tabs = [
    { id: 'dashboard', label: 'Inicio', icon: Home },
    { id: 'pedidos', label: 'Pedidos', icon: Package },
    { id: 'estadisticas', label: 'Stats', icon: BarChart3 },
    { id: 'historial', label: 'Historial', icon: Clock },
    { id: 'notificaciones', label: 'Alertas', icon: Bell },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe">
      <div className="grid grid-cols-5">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`flex flex-col items-center justify-center p-3 relative transition-colors ${
              activeTab === id
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <div className="relative">
              <Icon className="w-5 h-5 mb-1" />
              {id === 'notificaciones' && notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </div>
            <span className="text-xs font-medium">{label}</span>
            {activeTab === id && (
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
        ))}
      </div>
    </nav>
  )
}