import { beforeEach, describe, expect, it, vi } from 'vitest'
import { supabase } from '@/supabase'
import { lookupFlight } from './flightLookupService'

vi.mock('@/supabase', () => ({
  supabase: {
    functions: {
      invoke: vi.fn(),
    },
  },
}))

const invokeMock = vi.mocked(supabase.functions.invoke)

describe('lookupFlight', () => {
  beforeEach(() => {
    invokeMock.mockReset()
  })

  it('normaliza el número de vuelo e invoca la Edge Function', async () => {
    const flights = [
      {
        airlineName: 'LATAM Airlines',
        flightNumber: 'LA8180',
        departure: { airport: 'EZE - Buenos Aires', date: '2026-06-20', time: '10:00' },
        arrival: { airport: 'SCL - Santiago', date: '2026-06-20', time: '12:15' },
      },
    ]
    invokeMock.mockResolvedValue({ data: { flights }, error: null })

    await expect(lookupFlight(' la8180 ', '2026-06-20')).resolves.toEqual(flights)
    expect(invokeMock).toHaveBeenCalledWith('flight-lookup', {
      body: { flightNumber: 'LA8180', departureDate: '2026-06-20' },
    })
  })

  it('propaga el mensaje devuelto por la función', async () => {
    invokeMock.mockResolvedValue({ data: { error: 'Vuelo no encontrado' }, error: null })

    await expect(lookupFlight('LA8180', '2026-06-20')).rejects.toThrow('Vuelo no encontrado')
  })
})
