import { supabase } from '@/supabase'

export interface FlightLookupResult {
  airlineName: string
  flightNumber: string
  departure: {
    airport: string
    date: string
    time: string
  }
  arrival: {
    airport: string
    date: string
    time: string
  }
}

interface FlightLookupResponse {
  flights?: FlightLookupResult[]
  error?: string
}

async function getFunctionErrorMessage(error: unknown): Promise<string> {
  const context = (error as { context?: Response })?.context

  if (context instanceof Response) {
    try {
      const body = (await context.clone().json()) as FlightLookupResponse
      if (body.error) return body.error
    } catch {
      // Keep the SDK error message when the function did not return JSON.
    }
  }

  return error instanceof Error ? error.message : 'No se pudo consultar el vuelo'
}

export async function lookupFlight(
  flightNumber: string,
  departureDate: string
): Promise<FlightLookupResult[]> {
  const { data, error } = await supabase.functions.invoke<FlightLookupResponse>('flight-lookup', {
    body: {
      flightNumber: flightNumber.trim().toUpperCase(),
      departureDate,
    },
  })

  if (error) {
    throw new Error(await getFunctionErrorMessage(error))
  }

  if (data?.error) {
    throw new Error(data.error)
  }

  return data?.flights || []
}
