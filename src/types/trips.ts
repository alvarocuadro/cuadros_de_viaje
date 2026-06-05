import type { ItemTransporte, ItemHospedaje } from './items'

export type EstadoViaje = 'pasado' | 'actual' | 'futuro'

export interface Viaje {
  id: string
  usuario_id: string
  nombre: string
  destinos: string[]
  fecha_inicio: string | null
  fecha_fin: string | null
  created_at: string
  updated_at: string
}

export interface ViajeConItems extends Viaje {
  estado: EstadoViaje
  items_transporte: ItemTransporte[]
  items_hospedaje: ItemHospedaje[]
}

export interface ViajeAgrupado {
  pasados: ViajeConItems[]
  actuales: ViajeConItems[]
  futuros: ViajeConItems[]
}
