import { describe, it, expect } from 'vitest'
import { isEndAfterStart } from '@/utils/dateValidation'

describe('TransportForm validation helpers', () => {
  it('should validate HH:mm format correctly', () => {
    const validHours = ['00:00', '12:30', '23:59', '08:45']
    const invalidHours = ['24:00', '12:60', '1:30', '12:3', 'abc:de']

    const regex = /^([0-1]\d|2[0-3]):[0-5]\d$/

    validHours.forEach((hour) => {
      expect(regex.test(hour)).toBe(true)
    })

    invalidHours.forEach((hour) => {
      expect(regex.test(hour)).toBe(false)
    })
  })

  it('should validate date ranges correctly', () => {
    expect(isEndAfterStart('2026-06-05', '2026-06-10')).toBe(true)
    expect(isEndAfterStart('2026-06-05', '2026-06-05')).toBe(true)
    expect(isEndAfterStart('2026-06-10', '2026-06-05')).toBe(false)
  })
})
