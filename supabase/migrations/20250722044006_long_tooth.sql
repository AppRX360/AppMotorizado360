/*
  # Esquema completo para App Motorizado

  1. Nuevas Tablas
    - `motorizados` - Información específica del motorizado
    - `pedidos` - Información de pedidos
    - `asignaciones` - Asignaciones de pedidos a motorizados
    - `entregas` - Historial de entregas completadas
    - `estadisticas_motorizado` - Estadísticas diarias del motorizado

  2. Seguridad
    - RLS habilitado en todas las tablas
    - Políticas para que cada motorizado solo vea sus datos
    - Políticas de inserción y actualización apropiadas
*/

-- Tabla de motorizados
CREATE TABLE IF NOT EXISTS motorizados (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre text NOT NULL,
  telefono text NOT NULL,
  documento text UNIQUE NOT NULL,
  placa_vehiculo text NOT NULL,
  tipo_vehiculo text NOT NULL DEFAULT 'motocicleta',
  estado_disponibilidad text NOT NULL DEFAULT 'desconectado' CHECK (estado_disponibilidad IN ('disponible', 'ocupado', 'desconectado')),
  ubicacion_actual jsonb,
  rating decimal(2,1) DEFAULT 5.0,
  total_entregas integer DEFAULT 0,
  activo boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabla de pedidos
CREATE TABLE IF NOT EXISTS pedidos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numero_pedido text UNIQUE NOT NULL,
  cliente_nombre text NOT NULL,
  cliente_telefono text NOT NULL,
  direccion_recogida jsonb NOT NULL,
  direccion_entrega jsonb NOT NULL,
  descripcion text,
  valor_pedido decimal(10,2) NOT NULL,
  valor_domicilio decimal(10,2) NOT NULL,
  metodo_pago text NOT NULL DEFAULT 'efectivo',
  notas text,
  estado text NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'asignado', 'aceptado', 'en_camino', 'entregado', 'cancelado')),
  prioridad text DEFAULT 'normal' CHECK (prioridad IN ('baja', 'normal', 'alta', 'urgente')),
  tiempo_estimado integer DEFAULT 30,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabla de asignaciones
CREATE TABLE IF NOT EXISTS asignaciones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id uuid REFERENCES pedidos(id) ON DELETE CASCADE,
  motorizado_id uuid REFERENCES motorizados(id) ON DELETE CASCADE,
  estado text NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'aceptado', 'rechazado', 'completado', 'cancelado')),
  fecha_asignacion timestamptz DEFAULT now(),
  fecha_respuesta timestamptz,
  fecha_completado timestamptz,
  notas text,
  created_at timestamptz DEFAULT now()
);

-- Tabla de entregas (historial)
CREATE TABLE IF NOT EXISTS entregas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  motorizado_id uuid REFERENCES motorizados(id) ON DELETE CASCADE,
  pedido_id uuid REFERENCES pedidos(id) ON DELETE CASCADE,
  asignacion_id uuid REFERENCES asignaciones(id) ON DELETE CASCADE,
  tiempo_total integer NOT NULL, -- en minutos
  distancia decimal(5,2), -- en km
  valor_ganado decimal(10,2) NOT NULL,
  rating_cliente integer CHECK (rating_cliente BETWEEN 1 AND 5),
  comentario_cliente text,
  fecha_entrega timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Tabla de estadísticas diarias
CREATE TABLE IF NOT EXISTS estadisticas_motorizado (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  motorizado_id uuid REFERENCES motorizados(id) ON DELETE CASCADE,
  fecha date NOT NULL,
  total_entregas integer DEFAULT 0,
  total_ganado decimal(10,2) DEFAULT 0,
  tiempo_total_trabajo integer DEFAULT 0, -- en minutos
  distancia_total decimal(10,2) DEFAULT 0, -- en km
  rating_promedio decimal(2,1) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(motorizado_id, fecha)
);

-- Índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_motorizados_user_id ON motorizados(user_id);
CREATE INDEX IF NOT EXISTS idx_motorizados_estado ON motorizados(estado_disponibilidad);
CREATE INDEX IF NOT EXISTS idx_pedidos_estado ON pedidos(estado);
CREATE INDEX IF NOT EXISTS idx_asignaciones_motorizado_estado ON asignaciones(motorizado_id, estado);
CREATE INDEX IF NOT EXISTS idx_entregas_motorizado_fecha ON entregas(motorizado_id, fecha_entrega);
CREATE INDEX IF NOT EXISTS idx_estadisticas_motorizado_fecha ON estadisticas_motorizado(motorizado_id, fecha);

-- Habilitar RLS
ALTER TABLE motorizados ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE asignaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE entregas ENABLE ROW LEVEL SECURITY;
ALTER TABLE estadisticas_motorizado ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para motorizados
CREATE POLICY "Motorizados pueden ver su propio perfil"
  ON motorizados FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Motorizados pueden actualizar su propio perfil"
  ON motorizados FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Permitir insertar nuevo motorizado"
  ON motorizados FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Políticas RLS para pedidos (solo ver pedidos asignados)
CREATE POLICY "Motorizados ven pedidos asignados"
  ON pedidos FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT pedido_id FROM asignaciones a
      JOIN motorizados m ON a.motorizado_id = m.id
      WHERE m.user_id = auth.uid()
    )
  );

CREATE POLICY "Motorizados pueden actualizar estado de pedidos asignados"
  ON pedidos FOR UPDATE
  TO authenticated
  USING (
    id IN (
      SELECT pedido_id FROM asignaciones a
      JOIN motorizados m ON a.motorizado_id = m.id
      WHERE m.user_id = auth.uid() AND a.estado = 'aceptado'
    )
  );

-- Políticas RLS para asignaciones
CREATE POLICY "Motorizados ven sus asignaciones"
  ON asignaciones FOR SELECT
  TO authenticated
  USING (
    motorizado_id IN (
      SELECT id FROM motorizados WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Motorizados pueden actualizar sus asignaciones"
  ON asignaciones FOR UPDATE
  TO authenticated
  USING (
    motorizado_id IN (
      SELECT id FROM motorizados WHERE user_id = auth.uid()
    )
  );

-- Políticas RLS para entregas
CREATE POLICY "Motorizados ven su historial de entregas"
  ON entregas FOR SELECT
  TO authenticated
  USING (
    motorizado_id IN (
      SELECT id FROM motorizados WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Permitir insertar entregas propias"
  ON entregas FOR INSERT
  TO authenticated
  WITH CHECK (
    motorizado_id IN (
      SELECT id FROM motorizados WHERE user_id = auth.uid()
    )
  );

-- Políticas RLS para estadísticas
CREATE POLICY "Motorizados ven sus estadísticas"
  ON estadisticas_motorizado FOR SELECT
  TO authenticated
  USING (
    motorizado_id IN (
      SELECT id FROM motorizados WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Permitir insertar/actualizar estadísticas propias"
  ON estadisticas_motorizado FOR ALL
  TO authenticated
  USING (
    motorizado_id IN (
      SELECT id FROM motorizados WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    motorizado_id IN (
      SELECT id FROM motorizados WHERE user_id = auth.uid()
    )
  );

-- Funciones para actualizar timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para actualizar updated_at
CREATE TRIGGER update_motorizados_updated_at
    BEFORE UPDATE ON motorizados
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pedidos_updated_at
    BEFORE UPDATE ON pedidos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_estadisticas_updated_at
    BEFORE UPDATE ON estadisticas_motorizado
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();