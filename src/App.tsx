import React, { useState, useEffect } from 'react'
import { useAuth } from './hooks/useAuth'
import { usePedidos } from './hooks/usePedidos'
import { useEstadisticas } from './hooks/useEstadisticas'
import { LoginForm } from './components/Auth/LoginForm'
import { RegisterForm } from './components/Auth/RegisterForm'
import { Header } from './components/Layout/Header'
import { BottomNavigation } from './components/Layout/BottomNavigation'
import { StatsCards } from './components/Dashboard/StatsCards'
import { PedidoCard } from './components/Pedidos/PedidoCard'
import { EntregaCard } from './components/Historial/EntregaCard'
import { 
  Bell, 
  BellRing, 
  Package2, 
  AlertCircle,
  RefreshCw,
  TrendingUp
} from 'lucide-react'

function App() {
  const { user, motorizado, loading } = useAuth()
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [activeTab, setActiveTab] = useState('dashboard')

  // Log del estado de autenticación para debugging
  useEffect(() => {
    console.log('🎯 App.tsx - Estado de autenticación:')
    console.log('  - Loading:', loading)
    console.log('  - User:', user?.email || 'null')
    console.log('  - Motorizado:', motorizado?.nombre || 'null')
  }, [user, motorizado, loading])

  const { 
    asignaciones, 
    loading: pedidosLoading, 
    aceptarAsignacion, 
    rechazarAsignacion, 
    actualizarEstadoPedido, 
    completarEntrega 
  } = usePedidos()

  const { 
    estadisticasHoy, 
    historialEntregas, 
    loading: estadisticasLoading,
    refetch: refetchEstadisticas 
  } = useEstadisticas()

  // Calcular notificaciones pendientes
  const notificacionesPendientes = asignaciones.filter(a => a.estado === 'pendiente').length

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
          <p className="text-gray-600">Cargando aplicación...</p>
          <p className="text-xs text-gray-500 mt-2">Verificando autenticación...</p>
        </div>
      </div>
    )
  }

  console.log('🔍 App.tsx - Evaluando condición de autenticación:', { user: !!user, motorizado: !!motorizado })

  if (!user || !motorizado) {
    console.log('🚪 App.tsx - Mostrando formulario de autenticación')
    return authMode === 'login' ? (
      <LoginForm onToggleMode={() => setAuthMode('register')} />
    ) : (
      <RegisterForm onToggleMode={() => setAuthMode('login')} />
    )
  }

  console.log('✅ App.tsx - Usuario autenticado, mostrando aplicación principal')

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Resumen del día</h2>
              <StatsCards estadisticas={estadisticasHoy} />
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Pedidos activos</h2>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                  {asignaciones.length} activos
                </span>
              </div>

              {pedidosLoading ? (
                <div className="text-center py-8">
                  <RefreshCw className="w-6 h-6 animate-spin text-blue-600 mx-auto mb-2" />
                  <p className="text-gray-600">Cargando pedidos...</p>
                </div>
              ) : asignaciones.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg">
                  <Package2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No hay pedidos activos</h3>
                  <p className="text-gray-600">Cuando tengas nuevas asignaciones aparecerán aquí</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {asignaciones.slice(0, 3).map((asignacion) => (
                    <PedidoCard
                      key={asignacion.id}
                      asignacion={asignacion}
                      onAceptar={aceptarAsignacion}
                      onRechazar={rechazarAsignacion}
                      onActualizarEstado={actualizarEstadoPedido}
                      onCompletar={completarEntrega}
                    />
                  ))}
                  {asignaciones.length > 3 && (
                    <button
                      onClick={() => setActiveTab('pedidos')}
                      className="w-full py-3 text-blue-600 hover:text-blue-700 font-medium text-center border border-blue-200 hover:border-blue-300 rounded-lg transition-colors"
                    >
                      Ver todos los pedidos ({asignaciones.length})
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )

      case 'pedidos':
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Mis pedidos</h2>
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                {asignaciones.length} activos
              </span>
            </div>

            {pedidosLoading ? (
              <div className="text-center py-12">
                <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
                <p className="text-gray-600">Cargando pedidos...</p>
              </div>
            ) : asignaciones.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg">
                <Package2 className="w-16 h-16 text-gray-400 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">No hay pedidos activos</h3>
                <p className="text-gray-600 mb-4">Cuando recibas nuevas asignaciones aparecerán aquí</p>
                <div className="text-sm text-gray-500">
                  Asegúrate de estar en estado "Disponible" para recibir pedidos
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {asignaciones.map((asignacion) => (
                  <PedidoCard
                    key={asignacion.id}
                    asignacion={asignacion}
                    onAceptar={aceptarAsignacion}
                    onRechazar={rechazarAsignacion}
                    onActualizarEstado={actualizarEstadoPedido}
                    onCompletar={completarEntrega}
                  />
                ))}
              </div>
            )}
          </div>
        )

      case 'estadisticas':
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Estadísticas</h2>
              <button
                onClick={refetchEstadisticas}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Rendimiento de hoy
                </h3>
                <StatsCards estadisticas={estadisticasHoy} />
              </div>

              <div className="bg-white rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Información general</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{motorizado.total_entregas}</p>
                    <p className="text-sm text-gray-600">Entregas totales</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-yellow-600">⭐ {motorizado.rating}/5</p>
                    <p className="text-sm text-gray-600">Rating general</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'historial':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Historial de entregas</h2>

            {estadisticasLoading ? (
              <div className="text-center py-12">
                <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
                <p className="text-gray-600">Cargando historial...</p>
              </div>
            ) : historialEntregas.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg">
                <Package2 className="w-16 h-16 text-gray-400 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">No hay entregas realizadas</h3>
                <p className="text-gray-600">Cuando completes tu primera entrega aparecerá aquí</p>
              </div>
            ) : (
              <div className="space-y-4">
                {historialEntregas.map((entrega) => (
                  <EntregaCard key={entrega.id} entrega={entrega} />
                ))}
              </div>
            )}
          </div>
        )

      case 'notificaciones':
        const asignacionesPendientes = asignaciones.filter(a => a.estado === 'pendiente')
        
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Notificaciones</h2>
              {notificacionesPendientes > 0 && (
                <span className="bg-red-100 text-red-800 text-sm font-medium px-3 py-1 rounded-full">
                  {notificacionesPendientes} nuevas
                </span>
              )}
            </div>

            {asignacionesPendientes.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg">
                <Bell className="w-16 h-16 text-gray-400 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">No hay notificaciones</h3>
                <p className="text-gray-600">Cuando recibas nuevas asignaciones aparecerán aquí</p>
              </div>
            ) : (
              <div className="space-y-4">
                {asignacionesPendientes.map((asignacion) => (
                  <div key={asignacion.id} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <BellRing className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">Nueva asignación</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Pedido #{asignacion.pedidos?.numero_pedido} - {asignacion.pedidos?.cliente_nombre}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(asignacion.fecha_asignacion).toLocaleTimeString('es-CO')}
                        </p>
                      </div>
                      <AlertCircle className="w-5 h-5 text-yellow-600" />
                    </div>
                  </div>
                ))}
                
                <div className="text-center py-4">
                  <button
                    onClick={() => setActiveTab('pedidos')}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                  >
                    Ver todos los pedidos
                  </button>
                </div>
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pb-20 px-4 py-6 max-w-md mx-auto">
        {renderContent()}
      </main>

      <BottomNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        notificationCount={notificacionesPendientes}
      />
    </div>
  )
}

export default App