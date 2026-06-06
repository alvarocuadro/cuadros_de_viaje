import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Button } from './Button'

describe('Button', () => {
  it('usa customVariant para estilos sin enviarlo al DOM', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined)

    render(<Button variant="secondary">Cancelar</Button>)

    expect(screen.getByRole('button', { name: 'Cancelar' })).not.toHaveAttribute('customVariant')
    expect(consoleError).not.toHaveBeenCalled()
    consoleError.mockRestore()
  })
})
