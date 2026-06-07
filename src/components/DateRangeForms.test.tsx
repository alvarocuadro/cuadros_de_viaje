import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { TripForm } from './TripForm'
import { TransportForm } from './TransportForm'
import { AccommodationForm } from './AccommodationForm'

vi.mock('@/components/ui', async () => {
  const actual = await vi.importActual<typeof import('@/components/ui')>('@/components/ui')

  return {
    ...actual,
    DateInput: ({
      label,
      value,
      min,
      onChange,
    }: {
      label: string
      value: string
      min: string
      onChange: (value: string) => void
    }) => (
      <input
        aria-label={label}
        data-min={min}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    ),
  }
})

describe('date range forms', () => {
  it('selecciona fecha de fin y actualiza su mínimo desde el inicio del viaje', () => {
    render(<TripForm onSubmit={vi.fn()} onCancel={vi.fn()} />)

    fireEvent.change(screen.getByLabelText('Fecha de inicio'), {
      target: { value: '2026-08-20' },
    })

    const endDate = screen.getByLabelText('Fecha de fin')
    expect(endDate).toHaveValue('2026-08-20')
    expect(endDate).toHaveAttribute('data-min', '2026-08-20')
  })

  it('selecciona fecha de llegada y actualiza su mínimo desde la salida', () => {
    render(<TransportForm onSubmit={vi.fn()} onCancel={vi.fn()} />)

    const dateInputs = screen.getAllByLabelText('Fecha')
    fireEvent.change(dateInputs[0], { target: { value: '2026-08-20' } })

    expect(dateInputs[1]).toHaveValue('2026-08-20')
    expect(dateInputs[1]).toHaveAttribute('data-min', '2026-08-20')
  })

  it('selecciona check-out y actualiza su mínimo desde check-in', () => {
    render(<AccommodationForm onSubmit={vi.fn()} onCancel={vi.fn()} />)

    fireEvent.change(screen.getByLabelText('Check-in'), {
      target: { value: '2026-08-20' },
    })

    const checkout = screen.getByLabelText('Check-out')
    expect(checkout).toHaveValue('2026-08-20')
    expect(checkout).toHaveAttribute('data-min', '2026-08-20')
  })
})
