import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { lookupFlight } from '@/services/flightLookupService'
import { TransportForm } from './TransportForm'
import type { ItemTransporte } from '@/types/items'

vi.mock('@/services/flightLookupService', () => ({
  lookupFlight: vi.fn(),
}))

const lookupFlightMock = vi.mocked(lookupFlight)

const initialData: ItemTransporte = {
  id: 'transport-1',
  viaje_id: 'trip-1',
  tipo: 'avión',
  compañia: '',
  origen: '',
  destino: '',
  fecha_salida: '2026-06-20',
  hora_salida: '',
  fecha_llegada: '',
  hora_llegada: '',
  numero_servicio: 'LA8180',
  numero_reserva: 'ABC123',
  datos_reserva: {
    reservado_por_agencia: false,
    codigos_reserva: [],
  },
  created_at: '2026-06-01T00:00:00Z',
  updated_at: '2026-06-01T00:00:00Z',
}

describe('TransportForm flight lookup', () => {
  it('completa los datos a partir del número de vuelo y la fecha', async () => {
    const user = userEvent.setup()
    lookupFlightMock.mockResolvedValue([
      {
        airlineName: 'LATAM Airlines',
        flightNumber: 'LA8180',
        departure: {
          airport: 'EZE - Buenos Aires',
          date: '2026-06-20',
          time: '10:30',
        },
        arrival: {
          airport: 'SCL - Santiago',
          date: '2026-06-20',
          time: '12:45',
        },
      },
    ])

    render(<TransportForm initialData={initialData} onSubmit={vi.fn()} onCancel={vi.fn()} />)

    await user.click(screen.getByRole('checkbox', { name: 'Tengo el número de vuelo' }))
    await user.click(screen.getByRole('button', { name: 'Buscar datos del vuelo' }))

    expect(lookupFlightMock).toHaveBeenCalledWith('LA8180', '2026-06-20')
    expect(await screen.findByDisplayValue('LATAM Airlines')).toBeInTheDocument()
    expect(screen.getByDisplayValue('EZE - Buenos Aires')).toBeInTheDocument()
    expect(screen.getByDisplayValue('SCL - Santiago')).toBeInTheDocument()
    expect(screen.getByDisplayValue('10:30')).toBeInTheDocument()
    expect(screen.getByDisplayValue('12:45')).toBeInTheDocument()
  })

  it('mantiene la carga manual cuando no se tiene el número de vuelo', () => {
    render(<TransportForm onSubmit={vi.fn()} onCancel={vi.fn()} />)

    expect(screen.getByRole('textbox', { name: 'Número de vuelo' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Buscar datos del vuelo' })).not.toBeInTheDocument()
  })
})
