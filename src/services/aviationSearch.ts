import airlinesData from '@/data/airlines.json'
import airportsData from '@/data/airports.json'

interface Airline {
  name: string
  iata: string
  icao: string
  country: string
}

interface Airport {
  name: string
  iata: string
  icao: string
  municipality: string
  country: string
}

export interface AviationSuggestion {
  id: string
  label: string
  detail: string
  value: string
}

const MAX_RESULTS = 25

function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase()
}

function scoreMatch(query: string, values: string[]): number {
  const normalizedValues = values.map(normalize)

  if (normalizedValues.some((value) => value === query)) return 0
  if (normalizedValues.some((value) => value.startsWith(query))) return 1
  if (normalizedValues.some((value) => value.includes(query))) return 2
  return Number.POSITIVE_INFINITY
}

export function searchAirlines(query: string): AviationSuggestion[] {
  const normalizedQuery = normalize(query.trim())
  if (normalizedQuery.length < 2) return []

  return (airlinesData as Airline[])
    .map((airline) => ({
      airline,
      score: scoreMatch(normalizedQuery, [
        airline.iata,
        airline.icao,
        airline.name,
        airline.country,
      ]),
    }))
    .filter(({ score }) => Number.isFinite(score))
    .sort((a, b) => a.score - b.score || a.airline.name.localeCompare(b.airline.name))
    .slice(0, MAX_RESULTS)
    .map(({ airline }) => ({
      id: airline.iata,
      label: airline.name,
      detail: [airline.iata, airline.icao, airline.country].filter(Boolean).join(' · '),
      value: airline.name,
    }))
}

export function searchAirports(query: string): AviationSuggestion[] {
  const normalizedQuery = normalize(query.trim())
  if (normalizedQuery.length < 2) return []

  return (airportsData as Airport[])
    .map((airport) => ({
      airport,
      score: scoreMatch(normalizedQuery, [
        airport.iata,
        airport.icao,
        airport.name,
        airport.municipality,
        airport.country,
      ]),
    }))
    .filter(({ score }) => Number.isFinite(score))
    .sort((a, b) => a.score - b.score || a.airport.iata.localeCompare(b.airport.iata))
    .slice(0, MAX_RESULTS)
    .map(({ airport }) => ({
      id: airport.iata,
      label: `${airport.iata} · ${airport.name}`,
      detail: [airport.municipality, airport.country].filter(Boolean).join(', '),
      value: `${airport.iata} - ${airport.municipality || airport.name}`,
    }))
}
