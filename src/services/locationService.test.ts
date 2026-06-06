import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { searchLocations } from './locationService'

describe('searchLocations', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_GEOAPIFY_API_KEY', 'test-api-key')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  it('no consulta Geoapify hasta que haya tres caracteres', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    await expect(searchLocations('  ab  ')).resolves.toEqual([])
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('consulta ciudades en español y transforma los resultados', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        results: [
          {
            place_id: 'argentina-cordoba',
            city: 'Córdoba',
            state: 'Córdoba',
            country: 'Argentina',
            result_type: 'city',
            lat: -31.42,
            lon: -64.18,
          },
          {
            place_id: 'spain-cordoba',
            name: 'Córdoba',
            state: 'Andalucía',
            country: 'España',
            result_type: 'city',
            lat: 37.88,
            lon: -4.77,
          },
          {
            place_id: 'argentina',
            name: 'Argentina',
            country: 'Argentina',
            result_type: 'country',
            lat: -34,
            lon: -64,
          },
          {
            place_id: 'cordoba-street',
            name: 'Avenida Córdoba',
            country: 'Argentina',
            result_type: 'street',
            lat: -34.6,
            lon: -58.4,
          },
        ],
      }),
    })
    vi.stubGlobal('fetch', fetchMock)

    await expect(searchLocations('  cordoba  ')).resolves.toEqual([
      { id: 'argentina-cordoba', label: 'Córdoba, Argentina' },
      { id: 'spain-cordoba', label: 'Córdoba, España', detail: 'Andalucía' },
      { id: 'argentina', label: 'Argentina' },
    ])

    const requestUrl = new URL(fetchMock.mock.calls[0][0])
    expect(requestUrl.origin + requestUrl.pathname).toBe('https://api.geoapify.com/v1/geocode/autocomplete')
    expect(requestUrl.searchParams.get('text')).toBe('cordoba')
    expect(requestUrl.searchParams.has('type')).toBe(false)
    expect(requestUrl.searchParams.get('lang')).toBe('es')
    expect(requestUrl.searchParams.get('limit')).toBe('10')
    expect(requestUrl.searchParams.get('apiKey')).toBe('test-api-key')
  })
})
