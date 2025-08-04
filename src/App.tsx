import React, { useState } from 'react'
import { 
  LogIn, 
  Loader2, 
  Eye, 
  EyeOff,
  Bell, 
  BellRing, 
  Package2, 
  AlertCircle,
  RefreshCw,
  TrendingUp,
  Navigation
} from 'lucide-react'
import { Header } from './components/Layout/Header'
import { BottomNavigation } from './components/Layout/BottomNavigation'
import { StatsCards } from './components/Dashboard/StatsCards'
import { PedidoCard } from './components/Pedidos/PedidoCard'
import { EntregaCard } from './components/Historial/EntregaCard'
import { mockAsignaciones, mockEstadisticasHoy, mockEntregas } from './data/mockData'

// Estado global simple para autenticación
let isLoggedIn = false
let currentUser = {
  id: 'user-123',
  email: 'test@email.com',
  nombre: 'Carlos Rodríguez',
  telefono: '+57 300 123 4567',
  rating: 4.8,
  total_entregas: 247,
  estado_disponibilidad: 'disponible' as const
}

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('test@email.com')
  const [password, setPassword] = useState('123456')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('🚀 Iniciando login directo...')
    
    setLoading(true)
    
    // Simular delay mínimo
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Login SIEMPRE exitoso
    isLoggedIn = true
    console.log('✅ Login exitoso - Usuario autenticado')
    
    setLoading(false)
    onLogin()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Bienvenido</h1>
          <p className="text-gray-600">Inicia sesión en tu cuenta de motorizado</p>
          
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
            <p className="font-bold mb-2">🔧 SISTEMA DIRECTO</p>
            <p className="mb-1"><strong>Email:</strong> test@email.com</p>
            <p className="mb-1"><strong>Contraseña:</strong> 123456</p>
            <p className="text-xs mt-2 text-green-600">
              ✅ Login garantizado - Solo haz clic en "Iniciar sesión"
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="test@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="123456"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Iniciando sesión...
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                Iniciar sesión
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

function MainApp() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [asignaciones] = useState(mockAsignaciones)
  const [estadisticas] = useState(mockEstadisticasHoy)
  const [entregas] = useState(mockEntregas)

  const notificacionesPendientes = asignaciones.filter(a => a.estado === 'pendiente').length

  const handleSignOut = () => {
    console.log('🚪 Cerrando sesión...')
    isLoggedIn = false
    window.location.reload()
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Resumen del día</h2>
              <StatsCards estadisticas={estadisticas} />
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Pedidos activos</h2>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                  {asignaciones.length} activos
                </span>
              </div>

              {asignaciones.length === 0 ? (
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
                      onAceptar={() => console.log('Aceptar', asignacion.id)}
                      onRechazar={() => console.log('Rechazar', asignacion.id)}
                      onActualizarEstado={() => console.log('Actualizar estado')}
                      onCompletar={() => console.log('Completar')}
                    />
                  ))}
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

            {asignaciones.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg">
                <Package2 className="w-16 h-16 text-gray-400 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">No hay pedidos activos</h3>
                <p className="text-gray-600 mb-4">Cuando recibas nuevas asignaciones aparecerán aquí</p>
              </div>
            ) : (
              <div className="space-y-4">
                {asignaciones.map((asignacion) => (
                  <PedidoCard
                    key={asignacion.id}
                    asignacion={asignacion}
                    onAceptar={() => console.log('Aceptar', asignacion.id)}
                    onRechazar={() => console.log('Rechazar', asignacion.id)}
                    onActualizarEstado={() => console.log('Actualizar estado')}
                    onCompletar={() => console.log('Completar')}
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
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Rendimiento de hoy
                </h3>
                <StatsCards estadisticas={estadisticas} />
              </div>

              <div className="bg-white rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Información general</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{currentUser.total_entregas}</p>
                    <p className="text-sm text-gray-600">Entregas totales</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-yellow-600">⭐ {currentUser.rating}/5</p>
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

            {entregas.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg">
                <Package2 className="w-16 h-16 text-gray-400 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">No hay entregas realizadas</h3>
                <p className="text-gray-600">Cuando completes tu primera entrega aparecerá aquí</p>
              </div>
            ) : (
              <div className="space-y-4">
                {entregas.map((entrega) => (
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
      {/* Header simplificado */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <Navigation className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  {currentUser.nombre}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-800">
                    {currentUser.estado_disponibilidad}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-right mr-3">
                <div className="text-sm font-medium text-gray-900">
                  ⭐ {currentUser.rating}/5.0
                </div>
                <div className="text-xs text-gray-500">
                  {currentUser.total_entregas} entregas
                </div>
              </div>

              <button
                onClick={handleSignOut}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Cerrar sesión"
              >
                <LogIn className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>
      
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

function App() {
  const [loggedIn, setLoggedIn] = useState(isLoggedIn)

  console.log('🎯 App renderizado - Estado de login:', loggedIn)

  if (!loggedIn) {
    console.log('🚪 Mostrando pantalla de login')
    return <LoginScreen onLogin={() => setLoggedIn(true)} />
  }

  console.log('✅ Usuario logueado - Mostrando aplicación principal')
  return <MainApp />
}

export default App