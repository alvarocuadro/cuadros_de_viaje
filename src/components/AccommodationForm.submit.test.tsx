import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { AccommodationForm } from './AccommodationForm'
import type { ItemHospedaje } from '@/types/items'

const accommodationWithoutBookingNumber: ItemHospedaje = {
  id: 'accommodation-1',
  viaje_id: 'trip-1',
  tipo: 'hotel',
  nombre: 'Hotel Central',
  fecha_checkin: '2026-08-20',
  fecha_checkout: '2026-08-25',
  dirección: 'Calle Principal 123',
  datos_reserva: {
    reservado_por_agencia: false,
    codigos_reserva: [],
  },
  created_at: '2026-06-07T00:00:00Z',
  updated_at: '2026-06-07T00:00:00Z',
}

describe('AccommodationForm submission', () => {
  it('permite guardar un hospedaje sin número de reserva', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockResolvedValue(undefined)

    render(
      <AccommodationForm
        initialData={accommodationWithoutBookingNumber}
        onSubmit={onSubmit}
        onCancel={vi.fn()}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Actualizar' }))

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        nombre: 'Hotel Central',
        numero_reserva: undefined,
      }),
    )
  })
})
