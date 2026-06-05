import dayjs from 'dayjs'
import 'dayjs/locale/es'
import type { TipoTransporte, TipoHospedaje } from '@/types/items'

dayjs.locale('es')

export function formatDate(date: string | null | undefined): string {
  if (!date) return '—'
  return dayjs(date).format('D MMM YYYY')
}

export function formatDateTime(date: string | null | undefined, time: string | null | undefined): string {
  if (!date) return '—'
  if (!time) return formatDate(date)
  return dayjs(`${date} ${time}`).format('D MMM HH:mm')
}

export function formatTransportType(tipo: TipoTransporte): string {
  const tipos: Record<TipoTransporte, string> = {
    avión: '✈️ Avión',
    tren: '🚆 Tren',
    micro: '🚌 Micro',
  }
  return tipos[tipo] || tipo
}

export function formatAccomType(tipo: TipoHospedaje): string {
  const tipos: Record<TipoHospedaje, string> = {
    hotel: '🏨 Hotel',
    airbnb: '🏠 Airbnb',
    posada: '🏡 Posada',
    hostel: '🛏️ Hostel',
    'casa de familia': '👨‍👩‍👧 Casa de familia',
    otro: '📍 Otro',
  }
  return tipos[tipo] || tipo
}
