import { describe, it, expect, beforeEach } from 'vitest'
import {
  isFutureOrToday,
  isEndAfterStart,
  validateTransportDates,
  validateAccommodationDates,
  isValidHHmm,
  canEditDateField,
} from './dateValidation'
import dayjs from 'dayjs'

describe('dateValidation', () => {
  let today: string
  let tomorrow: string
  let yesterday: string

  beforeEach(() => {
    today = dayjs().format('YYYY-MM-DD')
    tomorrow = dayjs().add(1, 'day').format('YYYY-MM-DD')
    yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD')
  })

  describe('isFutureOrToday', () => {
    it('retorna true para fecha futura', () => {
      expect(isFutureOrToday(tomorrow)).toBe(true)
    })

    it('retorna true para fecha de hoy', () => {
      expect(isFutureOrToday(today)).toBe(true)
    })

    it('retorna false para fecha pasada', () => {
      expect(isFutureOrToday(yesterday)).toBe(false)
    })

    it('retorna true para null o undefined', () => {
      expect(isFutureOrToday(null)).toBe(true)
      expect(isFutureOrToday(undefined)).toBe(true)
    })
  })

  describe('isEndAfterStart', () => {
    it('retorna true cuando fin es posterior a inicio', () => {
      expect(isEndAfterStart(today, tomorrow)).toBe(true)
    })

    it('retorna true cuando fin es igual a inicio', () => {
      expect(isEndAfterStart(today, today)).toBe(true)
    })

    it('retorna false cuando fin es anterior a inicio', () => {
      expect(isEndAfterStart(tomorrow, today)).toBe(false)
    })

    it('retorna true cuando alguna fecha es null', () => {
      expect(isEndAfterStart(null, tomorrow)).toBe(true)
      expect(isEndAfterStart(today, null)).toBe(true)
      expect(isEndAfterStart(null, null)).toBe(true)
    })
  })

  describe('isValidHHmm', () => {
    it('acepta formato HH:mm válido', () => {
      expect(isValidHHmm('14:30')).toBe(true)
      expect(isValidHHmm('00:00')).toBe(true)
      expect(isValidHHmm('23:59')).toBe(true)
    })

    it('rechaza formato inválido', () => {
      expect(isValidHHmm('24:00')).toBe(false)
      expect(isValidHHmm('14:60')).toBe(false)
      expect(isValidHHmm('2:30')).toBe(false)
      expect(isValidHHmm('14-30')).toBe(false)
      expect(isValidHHmm('14:3')).toBe(false)
    })
  })

  describe('validateTransportDates', () => {
    it('valida viaje válido', () => {
      const result = validateTransportDates(today, '14:30', tomorrow, '15:45')
      expect(result.valid).toBe(true)
    })

    it('rechaza cuando falta algún campo', () => {
      const result = validateTransportDates('', '14:30', tomorrow, '15:45')
      expect(result.valid).toBe(false)
      expect(result.error).toContain('obligatorios')
    })

    it('rechaza fecha de salida pasada', () => {
      const result = validateTransportDates(yesterday, '14:30', today, '15:45')
      expect(result.valid).toBe(false)
      expect(result.error).toContain('salida')
    })

    it('rechaza cuando llegada es anterior a salida', () => {
      const result = validateTransportDates(tomorrow, '14:30', today, '15:45')
      expect(result.valid).toBe(false)
      expect(result.error).toContain('llegada')
    })

    it('rechaza hora de salida inválida', () => {
      const result = validateTransportDates(today, '24:00', tomorrow, '15:45')
      expect(result.valid).toBe(false)
      expect(result.error).toContain('salida')
    })

    it('rechaza hora de llegada inválida', () => {
      const result = validateTransportDates(today, '14:30', tomorrow, '25:00')
      expect(result.valid).toBe(false)
      expect(result.error).toContain('llegada')
    })
  })

  describe('validateAccommodationDates', () => {
    it('valida hospedaje válido', () => {
      const result = validateAccommodationDates(today, tomorrow)
      expect(result.valid).toBe(true)
    })

    it('rechaza cuando falta alguna fecha', () => {
      const result = validateAccommodationDates('', tomorrow)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('obligatorias')
    })

    it('rechaza checkout anterior a checkin', () => {
      const result = validateAccommodationDates(tomorrow, today)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('check-out')
    })

    it('rechaza checkin en fecha pasada', () => {
      const result = validateAccommodationDates(yesterday, tomorrow)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('check-in')
    })

    it('acepta checkin hoy y checkout mañana', () => {
      const result = validateAccommodationDates(today, tomorrow)
      expect(result.valid).toBe(true)
    })
  })

  describe('canEditDateField', () => {
    it('permite editar fecha futura', () => {
      expect(canEditDateField(tomorrow)).toBe(true)
    })

    it('permite editar fecha de hoy', () => {
      expect(canEditDateField(today)).toBe(true)
    })

    it('bloquea edición de fecha pasada', () => {
      expect(canEditDateField(yesterday)).toBe(false)
    })

    it('permite edición cuando fecha es null', () => {
      expect(canEditDateField(null)).toBe(true)
    })
  })
})
