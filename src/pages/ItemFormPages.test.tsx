import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  getHospedajeById,
  getTransporteById,
} from '@/services/itemsService'
import { AccommodationFormPage } from './AccommodationFormPage'
import { TransportFormPage } from './TransportFormPage'
import type { ItemHospedaje, ItemTransporte } from '@/types/items'

const params = vi.hoisted(() => ({ viajeId: 'trip-1', itemId: 'item-1' }))

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  useParams: () => params,
}))

vi.mock('@/context/SnackbarContext', () => ({
  useSnackbar: () => ({
    showSuccess: vi.fn(),
    showError: vi.fn(),
  }),
}))

vi.mock('@/services/itemsService', () => ({
  createTransporte: vi.fn(),
  updateTransporte: vi.fn(),
  getTransporteById: vi.fn(),
  createHospedaje: vi.fn(),
  updateHospedaje: vi.fn(),
  getHospedajeById: vi.fn(),
}))

const getTransporteByIdMock = vi.mocked(getTransporteById)
const getHospedajeByIdMock = vi.mocked(getHospedajeById)

const transport: ItemTransporte = {
  id: 'item-1',
  viaje_id: 'trip-1',
  tipo: 'avión',
  compañia: 'LATAM Airlines',
  origen: 'EZE - Buenos Aires',
  destino: 'SCL - Santiago',
  fecha_salida: '2026-08-20',
  hora_salida: '10:30',
  fecha_llegada: '2026-08-20',
  hora_llegada: '12:45',
  numero_servicio: 'LA8180',
  numero_reserva: 'ABC123',
  asiento: '12A',
  datos_reserva: {
    reservado_por_agencia: true,
    nombre_agencia: 'Agencia Uno',
    codigos_reserva: ['ABC123'],
    comentarios: 'Ventana',
  },
  created_at: '2026-06-01T00:00:00Z',
  updated_at: '2026-06-01T00:00:00Z',
}

const accommodation: ItemHospedaje = {
  id: 'item-1',
  viaje_id: 'trip-1',
  tipo: 'hotel',
  nombre: 'Hotel Central',
  fecha_checkin: '2026-08-20',
  fecha_checkout: '2026-08-25',
  dirección: 'Calle Principal 123',
  teléfono: '+54 11 1234-5678',
  email: 'hotel@example.com',
  numero_reserva: 'HOTEL123',
  datos_reserva: {
    reservado_por_agencia: false,
    codigos_reserva: [],
    comentarios: 'Desayuno incluido',
  },
  created_at: '2026-06-01T00:00:00Z',
  updated_at: '2026-06-01T00:00:00Z',
}

describe('item edit pages', () => {
  beforeEach(() => {
    getTransporteByIdMock.mockReset()
    getHospedajeByIdMock.mockReset()
  })

  it('precarga todos los datos principales del transporte', async () => {
    getTransporteByIdMock.mockResolvedValue({ success: true, data: transport })

    render(<TransportFormPage />)

    expect(await screen.findByDisplayValue('LATAM Airlines')).toBeInTheDocument()
    expect(screen.getByDisplayValue('EZE - Buenos Aires')).toBeInTheDocument()
    expect(screen.getByDisplayValue('SCL - Santiago')).toBeInTheDocument()
    expect(screen.getByDisplayValue('LA8180')).toBeInTheDocument()
    expect(screen.getByDisplayValue('ABC123')).toBeInTheDocument()
    expect(screen.getByDisplayValue('12A')).toBeInTheDocument()
    expect(getTransporteByIdMock).toHaveBeenCalledWith('trip-1', 'item-1')
  })

  it('precarga todos los datos principales del hospedaje', async () => {
    getHospedajeByIdMock.mockResolvedValue({ success: true, data: accommodation })

    render(<AccommodationFormPage />)

    expect(await screen.findByDisplayValue('Hotel Central')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Calle Principal 123')).toBeInTheDocument()
    expect(screen.getByDisplayValue('+54 11 1234-5678')).toBeInTheDocument()
    expect(screen.getByDisplayValue('hotel@example.com')).toBeInTheDocument()
    expect(screen.getByDisplayValue('HOTEL123')).toBeInTheDocument()
    expect(getHospedajeByIdMock).toHaveBeenCalledWith('trip-1', 'item-1')
  })
})
