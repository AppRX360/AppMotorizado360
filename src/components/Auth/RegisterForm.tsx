import React, { useState } from 'react'
import { UserPlus, Loader2, Eye, EyeOff, Recycle as Motorcycle } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

interface RegisterFormProps {
  onToggleMode: () => void
}

export function RegisterForm({ onToggleMode }: RegisterFormProps) {
  const { signUp } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nombre: '',
    telefono: '',
    documento: '',
    placa_vehiculo: '',
    tipo_vehiculo: 'motocicleta',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { email, password, ...motorizadoData } = formData
      const { error } = await signUp(email, password, {
        ...motorizadoData,
        estado_disponibilidad: 'desconectado',
        rating: 5.0,
        total_entregas: 0,
        activo: true,
      })

      if (error) {
        setError(error.message)
      }
    } catch (error) {
      setError('Error inesperado. Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Crear cuenta</h1>
          <p className="text-gray-600">Regístrate como motorizado</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre completo
              </label>
              <input
                name="nombre"
                type="text"
                value={formData.nombre}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono
              </label>
              <input
                name="telefono"
                type="tel"
                value={formData.telefono}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Documento de identidad
            </label>
            <input
              name="documento"
              type="text"
              value={formData.documento}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Placa del vehículo
              </label>
              <input
                name="placa_vehiculo"
                type="text"
                value={formData.placa_vehiculo}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm uppercase"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de vehículo
              </label>
              <div className="relative">
                <Motorcycle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  name="tipo_vehiculo"
                  value={formData.tipo_vehiculo}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                >
                  <option value="motocicleta">Motocicleta</option>
                  <option value="bicicleta">Bicicleta</option>
                  <option value="carro">Carro</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Correo electrónico
            </label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creando cuenta...
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                Crear cuenta
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <button
              onClick={onToggleMode}
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Inicia sesión
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}