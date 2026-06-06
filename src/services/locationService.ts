const GEOAPIFY_AUTOCOMPLETE_URL = 'https://api.geoapify.com/v1/geocode/autocomplete'

interface GeoapifyLocation {
  place_id?: string
  name?: string
  city?: string
  state?: string
  country?: string
  result_type?: string
  lat: number
  lon: number
}

interface GeoapifyAutocompleteResponse {
  results?: GeoapifyLocation[]
}

export interface LocationSuggestion {
  id: string
  label: string
  detail?: string
}

function toSuggestion(location: GeoapifyLocation): LocationSuggestion | null {
  if (location.result_type === 'country') {
    const country = location.country || location.name

    return country
      ? {
          id: location.place_id || `${location.lat},${location.lon}`,
          label: country,
        }
      : null
  }

  if (location.result_type && location.result_type !== 'city') {
    return null
  }

  const locality = location.city || location.name

  if (!locality || !location.country) {
    return null
  }

  return {
    id: location.place_id || `${location.lat},${location.lon}`,
    label: `${locality}, ${location.country}`,
    detail: location.state && location.state !== locality ? location.state : undefined,
  }
}

export async function searchLocations(query: string, signal?: AbortSignal): Promise<LocationSuggestion[]> {
  const normalizedQuery = query.trim()
  const apiKey = import.meta.env.VITE_GEOAPIFY_API_KEY

  if (normalizedQuery.length < 3 || !apiKey) {
    return []
  }

  const params = new URLSearchParams({
    text: normalizedQuery,
    lang: 'es',
    limit: '10',
    format: 'json',
    apiKey,
  })

  const response = await fetch(`${GEOAPIFY_AUTOCOMPLETE_URL}?${params}`, { signal })

  if (!response.ok) {
    throw new Error(`Geoapify autocomplete failed with status ${response.status}`)
  }

  const data = (await response.json()) as GeoapifyAutocompleteResponse
  const suggestions = (data.results || [])
    .map(toSuggestion)
    .filter((suggestion): suggestion is LocationSuggestion => suggestion !== null)

  return suggestions
    .filter((suggestion, index) => suggestions.findIndex((candidate) => candidate.id === suggestion.id) === index)
    .slice(0, 6)
}
