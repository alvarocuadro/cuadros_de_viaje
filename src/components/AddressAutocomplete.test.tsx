import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { searchAddresses } from '@/services/locationService'
import { AddressAutocomplete } from './AddressAutocomplete'

vi.mock('@/services/locationService', () => ({
  searchAddresses: vi.fn(),
}))

const searchAddressesMock = vi.mocked(searchAddresses)

function AutocompleteHarness() {
  const [value, setValue] = useState('')

  return <AddressAutocomplete value={value} onChange={setValue} />
}

describe('AddressAutocomplete', () => {
  beforeEach(() => {
    searchAddressesMock.mockReset()
  })

  it('busca y completa una dirección seleccionada', async () => {
    const user = userEvent.setup()
    searchAddressesMock.mockResolvedValue([
      {
        id: 'hotel-central',
        label: 'Hotel Central, Avenida Corrientes 1234, Buenos Aires, Argentina',
      },
    ])
    render(<AutocompleteHarness />)

    const input = screen.getByRole('combobox', { name: 'Dirección' })
    await user.type(input, 'Hotel Central')
    await user.click(
      await screen.findByText('Hotel Central, Avenida Corrientes 1234, Buenos Aires, Argentina')
    )

    expect(searchAddressesMock).toHaveBeenCalledWith('Hotel Central', expect.any(AbortSignal))
    expect(input).toHaveValue('Hotel Central, Avenida Corrientes 1234, Buenos Aires, Argentina')
  })

  it('permite ingresar una dirección manualmente', async () => {
    const user = userEvent.setup()
    searchAddressesMock.mockResolvedValue([])
    render(<AutocompleteHarness />)

    const input = screen.getByRole('combobox', { name: 'Dirección' })
    await user.type(input, 'Dirección no registrada 123')

    expect(input).toHaveValue('Dirección no registrada 123')
  })
})
