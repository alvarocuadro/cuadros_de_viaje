const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AeroDataBoxAirport {
  iata?: string
  icao?: string
  name?: string
  municipalityName?: string
}

interface AeroDataBoxTime {
  local?: string
  utc?: string
}

interface AeroDataBoxMovement {
  airport?: AeroDataBoxAirport
  scheduledTime?: AeroDataBoxTime
  scheduledTimeLocal?: string
  scheduledTimeUtc?: string
}

interface AeroDataBoxFlight {
  number?: string
  airline?: {
    name?: string
  }
  departure?: AeroDataBoxMovement
  arrival?: AeroDataBoxMovement
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

function formatAirport(airport?: AeroDataBoxAirport): string {
  if (!airport) return ''

  const code = airport.iata || airport.icao || ''
  const place = airport.municipalityName || airport.name || ''
  return code && place ? `${code} - ${place}` : code || place
}

function formatLocalDateTime(movement?: AeroDataBoxMovement): { date: string; time: string } {
  const value =
    movement?.scheduledTime?.local ||
    movement?.scheduledTimeLocal ||
    movement?.scheduledTime?.utc ||
    movement?.scheduledTimeUtc ||
    ''
  const match = value.match(/^(\d{4}-\d{2}-\d{2})[T ](\d{2}:\d{2})/)

  return {
    date: match?.[1] || '',
    time: match?.[2] || '',
  }
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Método no permitido' }, 405)
  }

  try {
    const { flightNumber, departureDate } = await request.json()

    if (
      typeof flightNumber !== 'string' ||
      !/^[A-Z0-9]{2,3}\s?\d{1,4}[A-Z]?$/.test(flightNumber.trim().toUpperCase()) ||
      typeof departureDate !== 'string' ||
      !/^\d{4}-\d{2}-\d{2}$/.test(departureDate)
    ) {
      return jsonResponse({ error: 'Número de vuelo o fecha inválidos' }, 400)
    }

    const apiKey = Deno.env.get('AERODATABOX_RAPIDAPI_KEY')
    const apiHost = Deno.env.get('AERODATABOX_RAPIDAPI_HOST') || 'aerodatabox.p.rapidapi.com'
    const baseUrl = Deno.env.get('AERODATABOX_BASE_URL') || 'https://aerodatabox.p.rapidapi.com/'

    if (!apiKey) {
      return jsonResponse({ error: 'AeroDataBox no está configurado' }, 500)
    }

    const normalizedFlightNumber = flightNumber.replace(/\s+/g, '').toUpperCase()
    const url = new URL(
      `flights/number/${encodeURIComponent(normalizedFlightNumber)}/${departureDate}`,
      baseUrl
    )
    url.searchParams.set('withAircraftImage', 'false')
    url.searchParams.set('withLocation', 'false')
    url.searchParams.set('withFlightPlan', 'false')

    const response = await fetch(url, {
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': apiHost,
      },
    })

    if (!response.ok) {
      const details = await response.text()
      console.error(`AeroDataBox ${response.status}: ${details}`)

      if (response.status === 404) {
        return jsonResponse({ error: 'No encontramos ese vuelo para la fecha indicada' }, 404)
      }

      if (response.status === 401 || response.status === 403) {
        return jsonResponse({ error: 'AeroDataBox rechazó la credencial configurada' }, 502)
      }

      return jsonResponse({ error: 'No se pudo consultar AeroDataBox' }, 502)
    }

    const data = (await response.json()) as AeroDataBoxFlight[]
    const flights = data
      .map((flight) => {
        const departureTime = formatLocalDateTime(flight.departure)
        const arrivalTime = formatLocalDateTime(flight.arrival)

        return {
          airlineName: flight.airline?.name || '',
          flightNumber: flight.number || normalizedFlightNumber,
          departure: {
            airport: formatAirport(flight.departure?.airport),
            ...departureTime,
          },
          arrival: {
            airport: formatAirport(flight.arrival?.airport),
            ...arrivalTime,
          },
        }
      })
      .filter((flight) => flight.departure.airport && flight.arrival.airport)

    return jsonResponse({ flights })
  } catch (error) {
    console.error(error)
    return jsonResponse({ error: 'No se pudo procesar la consulta del vuelo' }, 500)
  }
})
