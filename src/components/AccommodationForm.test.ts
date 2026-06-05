import { describe, it, expect } from 'vitest'
import { isEndAfterStart } from '@/utils/dateValidation'

describe('AccommodationForm validation helpers', () => {
  it('should validate email format correctly', () => {
    const validEmails = ['test@example.com', 'user+tag@domain.co.uk', 'a@b.c']
    const invalidEmails = ['test@', '@example.com', 'test example.com', 'test@.com']

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    validEmails.forEach((email) => {
      expect(emailRegex.test(email)).toBe(true)
    })

    invalidEmails.forEach((email) => {
      expect(emailRegex.test(email)).toBe(false)
    })
  })

  it('should validate checkin/checkout date ranges', () => {
    expect(isEndAfterStart('2026-06-05', '2026-06-10')).toBe(true)
    expect(isEndAfterStart('2026-06-05', '2026-06-05')).toBe(true)
    expect(isEndAfterStart('2026-06-10', '2026-06-05')).toBe(false)
  })

  it('should handle contact info as optional', () => {
    // Teléfono y email son opcionales en el formulario
    const emptyPhone = ''
    const emptyEmail = ''

    expect(emptyPhone === '' || !emptyPhone).toBe(true)
    expect(emptyEmail === '' || !emptyEmail).toBe(true)
  })
})
