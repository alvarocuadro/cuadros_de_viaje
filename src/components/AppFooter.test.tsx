import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AppFooter } from './AppFooter'

describe('AppFooter', () => {
  it('muestra el año actual, la licencia no comercial y el enlace al repositorio', () => {
    render(<AppFooter />)

    expect(screen.getByText(new RegExp(`${new Date().getFullYear()}`))).toBeInTheDocument()
    expect(screen.getByText(/uso exclusivo no comercial/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /polyform noncommercial 1\.0\.0/i })).toHaveAttribute(
      'href',
      'https://github.com/alvarocuadro/cuadros_de_viaje/blob/main/LICENSE'
    )
    expect(
      screen.getByRole('link', { name: /clonar cuadros de viaje desde github/i })
    ).toHaveAttribute('href', 'https://github.com/alvarocuadro/cuadros_de_viaje')
  })
})
