import { describe, expect, it } from 'vitest'
import { searchAirlines, searchAirports } from './aviationSearch'

describe('aviationSearch', () => {
  it('busca aerolíneas por código IATA y devuelve el nombre para guardar', () => {
    const result = searchAirlines('AR')

    expect(result[0]).toMatchObject({
      id: 'AR',
      label: 'Aerolineas Argentinas',
      value: 'Aerolineas Argentinas',
    })
  })

  it('busca aeropuertos por código IATA y devuelve código y ciudad para guardar', () => {
    const result = searchAirports('EZE')

    expect(result[0].id).toBe('EZE')
    expect(result[0].value).toContain('EZE -')
  })

  it('no devuelve sugerencias para búsquedas de menos de dos caracteres', () => {
    expect(searchAirlines('a')).toEqual([])
    expect(searchAirports('e')).toEqual([])
  })
})
