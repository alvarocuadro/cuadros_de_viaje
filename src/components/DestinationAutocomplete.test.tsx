import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { searchLocations } from '@/services/locationService'
import { DestinationAutocomplete } from './DestinationAutocomplete'

vi.mock('@/services/locationService', () => ({
  searchLocations: vi.fn(),
}))

const searchLocationsMock = vi.mocked(searchLocations)

function AutocompleteHarness({ onAdd }: { onAdd: (value: string) => void }) {
  const [value, setValue] = useState('')

  return (
    <DestinationAutocomplete
      value={value}
      onChange={setValue}
      onAdd={(newValue) => {
        onAdd(newValue)
        setValue('')
      }}
    />
  )
}

describe('DestinationAutocomplete', () => {
  beforeEach(() => {
    searchLocationsMock.mockReset()
  })

  it('busca y agrega una ubicación seleccionada', async () => {
    const user = userEvent.setup()
    const onAdd = vi.fn()
    searchLocationsMock.mockResolvedValue([
      { id: 'cordoba-ar', label: 'Córdoba, Argentina', detail: 'Córdoba' },
    ])
    render(<AutocompleteHarness onAdd={onAdd} />)

    await user.type(screen.getByRole('combobox', { name: 'Destinos' }), 'cord')
    await user.click(await screen.findByText('Córdoba, Argentina'))

    expect(searchLocationsMock).toHaveBeenCalledWith('cord', expect.any(AbortSignal))
    expect(onAdd).toHaveBeenCalledWith('Córdoba, Argentina')
  })

  it('permite agregar un destino de texto libre con Enter', async () => {
    const user = userEvent.setup()
    const onAdd = vi.fn()
    searchLocationsMock.mockResolvedValue([])
    render(<AutocompleteHarness onAdd={onAdd} />)

    const input = screen.getByRole('combobox', { name: 'Destinos' })
    await user.type(input, 'Lugar inventado')
    await user.keyboard('{Enter}')

    expect(onAdd).toHaveBeenCalledWith('Lugar inventado')
  })
})
