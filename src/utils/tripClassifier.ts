import type { Viaje, EstadoViaje } from '@/types/trips'
import dayjs from 'dayjs'

export function clasificarViaje(viaje: Viaje): EstadoViaje {
  const hoy = dayjs().startOf('day')

  if (!viaje.fecha_inicio || !viaje.fecha_fin) {
    return 'futuro'
  }

  const inicio = dayjs(viaje.fecha_inicio).startOf('day')
  const fin = dayjs(viaje.fecha_fin).startOf('day')

  if (hoy.isAfter(fin)) {
    return 'pasado'
  }

  if (hoy.isBefore(inicio)) {
    return 'futuro'
  }

  return 'actual'
}
