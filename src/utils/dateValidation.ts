import dayjs from 'dayjs'

export function isFutureOrToday(fecha: string | null | undefined): boolean {
  if (!fecha) return true
  const date = dayjs(fecha).startOf('day')
  const today = dayjs().startOf('day')
  return date.isAfter(today) || date.isSame(today)
}

export function isEndAfterStart(inicio: string | null, fin: string | null): boolean {
  if (!inicio || !fin) return true
  const startDate = dayjs(inicio).startOf('day')
  const endDate = dayjs(fin).startOf('day')
  return endDate.isAfter(startDate) || endDate.isSame(startDate)
}

export function validateTransportDates(
  fecha_salida: string,
  hora_salida: string,
  fecha_llegada: string,
  hora_llegada: string,
): { valid: boolean; error?: string } {
  if (!fecha_salida || !hora_salida || !fecha_llegada || !hora_llegada) {
    return { valid: false, error: 'Todos los campos de fecha y hora son obligatorios' }
  }

  if (!isFutureOrToday(fecha_salida)) {
    return { valid: false, error: 'La fecha de salida no puede ser pasada' }
  }

  if (!isEndAfterStart(fecha_salida, fecha_llegada)) {
    return { valid: false, error: 'La fecha de llegada debe ser igual o posterior a la de salida' }
  }

  if (!isValidHHmm(hora_salida)) {
    return { valid: false, error: 'Formato de hora de salida inválido (HH:mm)' }
  }

  if (!isValidHHmm(hora_llegada)) {
    return { valid: false, error: 'Formato de hora de llegada inválido (HH:mm)' }
  }

  return { valid: true }
}

export function validateAccommodationDates(
  fecha_checkin: string,
  fecha_checkout: string,
): { valid: boolean; error?: string } {
  if (!fecha_checkin || !fecha_checkout) {
    return { valid: false, error: 'Las fechas de check-in y check-out son obligatorias' }
  }

  if (!isFutureOrToday(fecha_checkin)) {
    return { valid: false, error: 'La fecha de check-in no puede ser pasada' }
  }

  if (!isEndAfterStart(fecha_checkin, fecha_checkout)) {
    return { valid: false, error: 'La fecha de check-out debe ser posterior a la de check-in' }
  }

  return { valid: true }
}

export function isValidHHmm(hora: string): boolean {
  const regex = /^([0-1]\d|2[0-3]):[0-5]\d$/
  return regex.test(hora)
}

export function canEditDateField(fecha: string | null | undefined): boolean {
  return isFutureOrToday(fecha)
}
