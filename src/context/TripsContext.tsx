import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import type { Viaje, ViajeConItems, ViajeAgrupado } from '@/types/trips'
import { clasificarViaje } from '@/utils/tripClassifier'
import { getViajes, createViaje, updateViaje, deleteViaje } from '@/services/tripsService'
import { useAuth } from './AuthContext'

interface TripsContextType {
  viajes: ViajeConItems[]
  agrupados: ViajeAgrupado
  loading: boolean
  error: string | null
  createTrip: (nombre: string, destinos: string[], fecha_inicio?: string, fecha_fin?: string) => Promise<void>
  updateTrip: (id: string, updates: Partial<Viaje>) => Promise<void>
  deleteTrip: (id: string) => Promise<void>
  refetch: () => Promise<void>
}

const TripsContext = createContext<TripsContextType | undefined>(undefined)

export function TripsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [viajes, setViajes] = useState<ViajeConItems[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadTrips = useCallback(async () => {
    if (!user?.id) return

    setLoading(true)
    setError(null)

    const result = await getViajes(user.id)

    if (result.success && result.data) {
      const viajesConEstado: ViajeConItems[] = result.data.map((viaje) => ({
        ...viaje,
        estado: clasificarViaje(viaje),
        items_transporte: [],
        items_hospedaje: [],
      }))
      setViajes(viajesConEstado)
    } else {
      setError(result.error?.message || 'Error al cargar viajes')
    }

    setLoading(false)
  }, [user?.id])

  useEffect(() => {
    loadTrips()
  }, [loadTrips])

  const createTrip = async (
    nombre: string,
    destinos: string[],
    fecha_inicio?: string,
    fecha_fin?: string,
  ) => {
    if (!user?.id) return

    const newViaje: Omit<Viaje, 'id' | 'usuario_id' | 'created_at' | 'updated_at'> = {
      nombre,
      destinos,
      fecha_inicio: fecha_inicio || null,
      fecha_fin: fecha_fin || null,
    }

    const optimisticViaje: ViajeConItems = {
      id: `temp-${Date.now()}`,
      usuario_id: user.id,
      ...newViaje,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      estado: clasificarViaje(newViaje as Viaje),
      items_transporte: [],
      items_hospedaje: [],
    }

    setViajes((prev) => [optimisticViaje, ...prev])

    const result = await createViaje(user.id, newViaje)

    if (result.success && result.data) {
      setViajes((prev) =>
        prev.map((v) =>
          v.id === optimisticViaje.id
            ? {
                ...result.data!,
                estado: clasificarViaje(result.data!),
                items_transporte: [],
                items_hospedaje: [],
              }
            : v,
        ),
      )
    } else {
      setViajes((prev) => prev.filter((v) => v.id !== optimisticViaje.id))
      setError(result.error?.message || 'Error al crear viaje')
    }
  }

  const updateTrip = async (id: string, updates: Partial<Viaje>) => {
    if (!user?.id) return

    const prevViajes = viajes
    setViajes((prev) =>
      prev.map((v) =>
        v.id === id
          ? {
              ...v,
              ...updates,
              estado: clasificarViaje({ ...v, ...updates } as Viaje),
            }
          : v,
      ),
    )

    const result = await updateViaje(id, user.id, updates)

    if (!result.success) {
      setViajes(prevViajes)
      setError(result.error?.message || 'Error al actualizar viaje')
    }
  }

  const deleteTrip = async (id: string) => {
    if (!user?.id) return

    const prevViajes = viajes
    setViajes((prev) => prev.filter((v) => v.id !== id))

    const result = await deleteViaje(id, user.id)

    if (!result.success) {
      setViajes(prevViajes)
      setError(result.error?.message || 'Error al eliminar viaje')
    }
  }

  const refetch = async () => {
    await loadTrips()
  }

  const agrupados: ViajeAgrupado = {
    pasados: viajes.filter((v) => v.estado === 'pasado'),
    actuales: viajes.filter((v) => v.estado === 'actual'),
    futuros: viajes.filter((v) => v.estado === 'futuro'),
  }

  return (
    <TripsContext.Provider value={{ viajes, agrupados, loading, error, createTrip, updateTrip, deleteTrip, refetch }}>
      {children}
    </TripsContext.Provider>
  )
}

export function useTrips() {
  const context = useContext(TripsContext)
  if (!context) {
    throw new Error('useTrips debe usarse dentro de TripsProvider')
  }
  return context
}
