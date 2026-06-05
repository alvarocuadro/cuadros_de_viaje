import { describe, it, expect, beforeEach } from 'vitest'
import { clasificarViaje } from './tripClassifier'
import type { Viaje } from '@/types/trips'
import dayjs from 'dayjs'

describe('tripClassifier', () => {
  let today: string

  beforeEach(() => {
    today = dayjs().format('YYYY-MM-DD')
  })

  it('clasifica viaje futuro correctamente', () => {
    const viaje: Viaje = {
      id: '1',
      usuario_id: 'user1',
      nombre: 'Test',
      destinos: [],
      fecha_inicio: dayjs().add(10, 'days').format('YYYY-MM-DD'),
      fecha_fin: dayjs().add(15, 'days').format('YYYY-MM-DD'),
      created_at: today,
      updated_at: today,
    }
    expect(clasificarViaje(viaje)).toBe('futuro')
  })

  it('clasifica viaje actual correctamente', () => {
    const viaje: Viaje = {
      id: '1',
      usuario_id: 'user1',
      nombre: 'Test',
      destinos: [],
      fecha_inicio: dayjs().subtract(5, 'days').format('YYYY-MM-DD'),
      fecha_fin: dayjs().add(5, 'days').format('YYYY-MM-DD'),
      created_at: today,
      updated_at: today,
    }
    expect(clasificarViaje(viaje)).toBe('actual')
  })

  it('clasifica viaje pasado correctamente', () => {
    const viaje: Viaje = {
      id: '1',
      usuario_id: 'user1',
      nombre: 'Test',
      destinos: [],
      fecha_inicio: dayjs().subtract(15, 'days').format('YYYY-MM-DD'),
      fecha_fin: dayjs().subtract(10, 'days').format('YYYY-MM-DD'),
      created_at: today,
      updated_at: today,
    }
    expect(clasificarViaje(viaje)).toBe('pasado')
  })

  it('clasifica como futuro cuando inicio = hoy', () => {
    const viaje: Viaje = {
      id: '1',
      usuario_id: 'user1',
      nombre: 'Test',
      destinos: [],
      fecha_inicio: today,
      fecha_fin: dayjs().add(5, 'days').format('YYYY-MM-DD'),
      created_at: today,
      updated_at: today,
    }
    expect(clasificarViaje(viaje)).toBe('actual')
  })

  it('clasifica como pasado cuando fin = hoy', () => {
    const viaje: Viaje = {
      id: '1',
      usuario_id: 'user1',
      nombre: 'Test',
      destinos: [],
      fecha_inicio: dayjs().subtract(5, 'days').format('YYYY-MM-DD'),
      fecha_fin: today,
      created_at: today,
      updated_at: today,
    }
    expect(clasificarViaje(viaje)).toBe('actual')
  })

  it('clasifica como futuro cuando no tiene fechas', () => {
    const viaje: Viaje = {
      id: '1',
      usuario_id: 'user1',
      nombre: 'Test',
      destinos: [],
      fecha_inicio: null,
      fecha_fin: null,
      created_at: today,
      updated_at: today,
    }
    expect(clasificarViaje(viaje)).toBe('futuro')
  })

  it('clasifica como futuro cuando solo tiene fecha_inicio', () => {
    const viaje: Viaje = {
      id: '1',
      usuario_id: 'user1',
      nombre: 'Test',
      destinos: [],
      fecha_inicio: dayjs().add(10, 'days').format('YYYY-MM-DD'),
      fecha_fin: null,
      created_at: today,
      updated_at: today,
    }
    expect(clasificarViaje(viaje)).toBe('futuro')
  })

  it('clasifica como futuro cuando solo tiene fecha_fin', () => {
    const viaje: Viaje = {
      id: '1',
      usuario_id: 'user1',
      nombre: 'Test',
      destinos: [],
      fecha_inicio: null,
      fecha_fin: dayjs().add(10, 'days').format('YYYY-MM-DD'),
      created_at: today,
      updated_at: today,
    }
    expect(clasificarViaje(viaje)).toBe('futuro')
  })
})
