import React, { useState } from 'react'
import { LogIn, Loader2, Eye, EyeOff } from 'lucide-react'
import { useSimpleAuth } from '../../hooks/useSimpleAuth'

interface SimpleLoginFormProps {
  onToggleMode?: () => void
}

export function SimpleLoginForm({ onToggleMode }: SimpleLoginFormProps) {
  const { signIn } = useSimpleAuth()
  const [email, setEmail] = useState('test@email.com')
  const [password, setPassword] = useState('123456')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('🚀 SimpleLoginForm.handleSubmit iniciado')
    console.log('📝 Datos del formulario:', { email, password })
    
    setLoading(true)
    setError('')

    try {
      console.log('📞 Llamando a useSimpleAuth.signIn...')
      const result = await signIn(email, password)
      console.log('📋 Resultado de useSimpleAuth.signIn:', result)

      if (result.error) {
        console.log('❌ Error en login:', result.error.message)
        setError(result.error.message)
      } else if (result.data?.user) {
        console.log('✅ Login exitoso en SimpleLoginForm para:', result.data.user.email)
        // El hook manejará la actualización del estado
      } else {
        console.log('⚠️ Resultado inesperado:', result)
        setError('Resultado inesperado del login')
      }
    } catch (err) {
      console.error('💥 Error capturado en SimpleLoginForm.handleSubmit:', err)
      setError('Error inesperado. Intenta nuevamente.')
    } finally {
      setLoading(false)
      console.log('🏁 SimpleLoginForm.handleSubmit completado')
    }
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
          
          {/* Información de desarrollo */}
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
            <p className="font-bold mb-2">🔧 SISTEMA LOCAL SIMPLIFICADO</p>
            <p className="mb-1"><strong>Email:</strong> test@email.com</p>
            <p className="mb-1"><strong>Contraseña:</strong> 123456</p>
            <p className="text-xs mt-2 text-green-600">
              ✅ Login automático - Cualquier credencial funciona
            </p>
            <p className="text-xs mt-1 text-green-600">
              🔍 Abre la consola (F12) para ver logs detallados
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

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm font-medium">❌ {error}</p>
            </div>
          )}

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

        {onToggleMode && (
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              ¿No tienes cuenta?{' '}
              <button
                onClick={onToggleMode}
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                Regístrate aquí
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}