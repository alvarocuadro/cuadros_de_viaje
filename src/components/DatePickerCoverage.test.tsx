import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { AccommodationForm } from './AccommodationForm'
import { TransportForm } from './TransportForm'
import { TripForm } from './TripForm'

describe('date picker coverage', () => {
  it.each([
    ['viaje', <TripForm onSubmit={vi.fn()} onCancel={vi.fn()} />],
    ['transporte', <TransportForm onSubmit={vi.fn()} onCancel={vi.fn()} />],
    ['hospedaje', <AccommodationForm onSubmit={vi.fn()} onCancel={vi.fn()} />],
  ])('usa selectores controlados en el formulario de %s', (_, form) => {
    const { container } = render(form)

    expect(screen.getAllByRole('button', { name: /abrir calendario/i })).toHaveLength(2)
    expect(container.querySelector('input[type="date"]')).not.toBeInTheDocument()
  })
})
