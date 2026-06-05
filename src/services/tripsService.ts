import { supabase } from '@/supabase'
import type { Viaje } from '@/types/trips'

export interface TripError {
  code: string
  message: string
}

export interface TripResponse<T = void> {
  success: boolean
  error?: TripError
  data?: T
}

export async function getViajes(usuarioId: string): Promise<TripResponse<Viaje[]>> {
  try {
    const { data, error } = await supabase
      .from('viajes')
      .select('*')
      .eq('usuario_id', usuarioId)
      .order('fecha_inicio', { ascending: false, nullsFirst: false })

    if (error) {
      return {
        success: false,
        error: { code: error.code || 'query_error', message: error.message },
      }
    }

    return {
      success: true,
      data: (data || []) as Viaje[],
    }
  } catch (err) {
    return {
      success: false,
      error: {
        code: 'unknown_error',
        message: err instanceof Error ? err.message : 'Error desconocido',
      },
    }
  }
}

export async function getViajeById(viajeId: string, usuarioId: string): Promise<TripResponse<Viaje>> {
  try {
    const { data, error } = await supabase
      .from('viajes')
      .select('*')
      .eq('id', viajeId)
      .eq('usuario_id', usuarioId)
      .single()

    if (error) {
      return {
        success: false,
        error: { code: error.code || 'query_error', message: error.message },
      }
    }

    return {
      success: true,
      data: data as Viaje,
    }
  } catch (err) {
    return {
      success: false,
      error: {
        code: 'unknown_error',
        message: err instanceof Error ? err.message : 'Error desconocido',
      },
    }
  }
}

export async function createViaje(
  usuarioId: string,
  viaje: Omit<Viaje, 'id' | 'usuario_id' | 'created_at' | 'updated_at'>,
): Promise<TripResponse<Viaje>> {
  try {
    const { data, error } = await supabase
      .from('viajes')
      .insert([
        {
          usuario_id: usuarioId,
          ...viaje,
        },
      ])
      .select()
      .single()

    if (error) {
      return {
        success: false,
        error: { code: error.code || 'insert_error', message: error.message },
      }
    }

    return {
      success: true,
      data: data as Viaje,
    }
  } catch (err) {
    return {
      success: false,
      error: {
        code: 'unknown_error',
        message: err instanceof Error ? err.message : 'Error desconocido',
      },
    }
  }
}

export async function updateViaje(
  viajeId: string,
  usuarioId: string,
  updates: Partial<Omit<Viaje, 'id' | 'usuario_id' | 'created_at' | 'updated_at'>>,
): Promise<TripResponse<Viaje>> {
  try {
    const { data, error } = await supabase
      .from('viajes')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', viajeId)
      .eq('usuario_id', usuarioId)
      .select()
      .single()

    if (error) {
      return {
        success: false,
        error: { code: error.code || 'update_error', message: error.message },
      }
    }

    return {
      success: true,
      data: data as Viaje,
    }
  } catch (err) {
    return {
      success: false,
      error: {
        code: 'unknown_error',
        message: err instanceof Error ? err.message : 'Error desconocido',
      },
    }
  }
}

export async function deleteViaje(viajeId: string, usuarioId: string): Promise<TripResponse> {
  try {
    const { error } = await supabase.from('viajes').delete().eq('id', viajeId).eq('usuario_id', usuarioId)

    if (error) {
      return {
        success: false,
        error: { code: error.code || 'delete_error', message: error.message },
      }
    }

    return { success: true }
  } catch (err) {
    return {
      success: false,
      error: {
        code: 'unknown_error',
        message: err instanceof Error ? err.message : 'Error desconocido',
      },
    }
  }
}
