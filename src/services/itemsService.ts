import { supabase } from '@/supabase'
import type { ItemTransporte, ItemHospedaje } from '@/types/items'

export interface ItemResponse<T = void> {
  success: boolean
  error?: { code: string; message: string }
  data?: T
}

export async function createTransporte(
  viajeId: string,
  item: Omit<ItemTransporte, 'id' | 'viaje_id' | 'created_at' | 'updated_at'>,
): Promise<ItemResponse<ItemTransporte>> {
  try {
    const { data, error } = await supabase
      .from('items_transporte')
      .insert([{ viaje_id: viajeId, ...item }])
      .select()
      .single()

    if (error) {
      return {
        success: false,
        error: { code: error.code || 'insert_error', message: error.message },
      }
    }

    return { success: true, data: data as ItemTransporte }
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

export async function updateTransporte(
  itemId: string,
  updates: Partial<Omit<ItemTransporte, 'id' | 'viaje_id' | 'created_at' | 'updated_at'>>,
): Promise<ItemResponse<ItemTransporte>> {
  try {
    const { data, error } = await supabase
      .from('items_transporte')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', itemId)
      .select()
      .single()

    if (error) {
      return {
        success: false,
        error: { code: error.code || 'update_error', message: error.message },
      }
    }

    return { success: true, data: data as ItemTransporte }
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

export async function deleteTransporte(itemId: string): Promise<ItemResponse> {
  try {
    const { error } = await supabase.from('items_transporte').delete().eq('id', itemId)

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

export async function getTransporte(viajeId: string): Promise<ItemResponse<ItemTransporte[]>> {
  try {
    const { data, error } = await supabase
      .from('items_transporte')
      .select('*')
      .eq('viaje_id', viajeId)
      .order('fecha_salida', { ascending: true })
      .order('hora_salida', { ascending: true })

    if (error) {
      return {
        success: false,
        error: { code: error.code || 'query_error', message: error.message },
      }
    }

    return { success: true, data: (data || []) as ItemTransporte[] }
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

export async function createHospedaje(
  viajeId: string,
  item: Omit<ItemHospedaje, 'id' | 'viaje_id' | 'created_at' | 'updated_at'>,
): Promise<ItemResponse<ItemHospedaje>> {
  try {
    const { data, error } = await supabase
      .from('items_hospedaje')
      .insert([{ viaje_id: viajeId, ...item }])
      .select()
      .single()

    if (error) {
      return {
        success: false,
        error: { code: error.code || 'insert_error', message: error.message },
      }
    }

    return { success: true, data: data as ItemHospedaje }
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

export async function updateHospedaje(
  itemId: string,
  updates: Partial<Omit<ItemHospedaje, 'id' | 'viaje_id' | 'created_at' | 'updated_at'>>,
): Promise<ItemResponse<ItemHospedaje>> {
  try {
    const { data, error } = await supabase
      .from('items_hospedaje')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', itemId)
      .select()
      .single()

    if (error) {
      return {
        success: false,
        error: { code: error.code || 'update_error', message: error.message },
      }
    }

    return { success: true, data: data as ItemHospedaje }
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

export async function deleteHospedaje(itemId: string): Promise<ItemResponse> {
  try {
    const { error } = await supabase.from('items_hospedaje').delete().eq('id', itemId)

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

export async function getHospedaje(viajeId: string): Promise<ItemResponse<ItemHospedaje[]>> {
  try {
    const { data, error } = await supabase
      .from('items_hospedaje')
      .select('*')
      .eq('viaje_id', viajeId)
      .order('fecha_checkin', { ascending: true })

    if (error) {
      return {
        success: false,
        error: { code: error.code || 'query_error', message: error.message },
      }
    }

    return { success: true, data: (data || []) as ItemHospedaje[] }
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
