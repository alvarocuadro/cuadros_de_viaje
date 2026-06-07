export type TipoTransporte = 'avión' | 'tren' | 'micro'
export type TipoHospedaje = 'hotel' | 'airbnb' | 'posada' | 'hostel' | 'casa de familia' | 'otro'

export interface DatosReserva {
  reservado_por_agencia: boolean
  nombre_agencia?: string
  codigos_reserva: string[]
  url_reserva?: string
  comentarios?: string
}

export interface ItemTransporte {
  id: string
  viaje_id: string
  tipo: TipoTransporte
  compañia: string
  origen: string
  destino: string
  fecha_salida: string
  hora_salida: string
  fecha_llegada: string
  hora_llegada: string
  numero_servicio: string
  numero_reserva?: string
  asiento?: string
  datos_reserva: DatosReserva
  created_at: string
  updated_at: string
}

export interface ItemHospedaje {
  id: string
  viaje_id: string
  tipo: TipoHospedaje
  nombre: string
  fecha_checkin: string
  fecha_checkout: string
  dirección: string
  teléfono?: string
  email?: string
  numero_reserva?: string
  datos_reserva: DatosReserva
  created_at: string
  updated_at: string
}

export interface ItemAgenda {
  tipo: 'transporte' | 'hospedaje'
  fecha_inicio: string
  datos: ItemTransporte | ItemHospedaje
}
