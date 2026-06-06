import { describe, expect, it } from 'vitest'
import { getUserInitials } from './userInitials'

describe('getUserInitials', () => {
  it('devuelve la primera letra del nombre y del apellido', () => {
    expect(getUserInitials('Lucía', 'Gómez')).toBe('LG')
  })

  it('ignora espacios al inicio', () => {
    expect(getUserInitials('  María', '  Pérez')).toBe('MP')
  })

  it('usa la inicial disponible o un fallback', () => {
    expect(getUserInitials('Ana', '')).toBe('A')
    expect(getUserInitials('', '')).toBe('?')
  })
})
