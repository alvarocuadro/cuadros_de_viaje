import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { DateInput } from './DateInput'

const defaultProps = {
  label: 'Fecha de inicio',
  min: '2026-06-05',
  max: '2028-06-05',
  onChange: vi.fn(),
}

describe('DateInput', () => {
  it('no permite navegar a un mes anterior al mes mínimo', async () => {
    const user = userEvent.setup()
    render(<DateInput {...defaultProps} value={defaultProps.min} />)

    await user.click(screen.getByRole('button', { name: /abrir calendario/i }))

    expect(screen.getByRole('button', { name: 'Mes anterior' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Mes siguiente' })).toBeEnabled()
  })

  it('no permite navegar a un mes posterior al mes máximo', async () => {
    const user = userEvent.setup()
    render(<DateInput {...defaultProps} value={defaultProps.max} />)

    await user.click(screen.getByRole('button', { name: /abrir calendario/i }))

    expect(screen.getByText('junio de 2028')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Mes anterior' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Mes siguiente' })).toBeDisabled()
  })

  it('permite borrar una fecha seleccionada', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<DateInput {...defaultProps} value={defaultProps.min} onChange={onChange} />)

    await user.click(screen.getByRole('button', { name: /borrar fecha de inicio/i }))

    expect(onChange).toHaveBeenCalledWith('')
    expect(screen.queryByRole('button', { name: 'Mes anterior' })).not.toBeInTheDocument()
  })
})
