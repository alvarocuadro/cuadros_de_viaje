import { useState } from 'react'
import { Add as AddIcon } from '@mui/icons-material'
import { Box, CircularProgress, IconButton, Tooltip } from '@mui/material'
import { Input, DateInput, Button } from '@/components/ui'
import { DestinationAutocomplete } from '@/components/DestinationAutocomplete'
import {
  isEndAfterStart,
  isFutureOrToday,
  isWithinTwoYears,
  getMaxTripYearsMessage,
  getMinDate,
  getMaxDate,
} from '@/utils/dateValidation'
import type { ViajeConItems } from '@/types/trips'

interface TripFormProps {
  initialData?: ViajeConItems
  onSubmit: (
    nombre: string,
    destinos: string[],
    fecha_inicio?: string,
    fecha_fin?: string
  ) => Promise<void>
  onCancel: () => void
  loading?: boolean
}

export function TripForm({ initialData, onSubmit, onCancel, loading = false }: TripFormProps) {
  const [nombre, setNombre] = useState(initialData?.nombre || '')
  const [destinos, setDestinos] = useState<string[]>(initialData?.destinos || [])
  const [destinoInput, setDestinoInput] = useState('')
  const [fecha_inicio, setFechaInicio] = useState(initialData?.fecha_inicio || '')
  const [fecha_fin, setFechaFin] = useState(
    initialData?.fecha_fin || initialData?.fecha_inicio || ''
  )
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!nombre.trim()) newErrors.nombre = 'El nombre es requerido'
    if (destinos.length === 0) newErrors.destinos = 'Agregá al menos un destino'

    if (fecha_inicio && !isFutureOrToday(fecha_inicio)) {
      newErrors.fecha_inicio = 'La fecha de inicio no puede ser pasada'
    }

    if (fecha_fin && !isFutureOrToday(fecha_fin)) {
      newErrors.fecha_fin = 'La fecha de fin no puede ser pasada'
    }

    if (fecha_inicio && !isWithinTwoYears(fecha_inicio)) {
      newErrors.fecha_inicio = `La fecha de inicio ${getMaxTripYearsMessage()}`
    }

    if (fecha_fin && !isWithinTwoYears(fecha_fin)) {
      newErrors.fecha_fin = `La fecha de fin ${getMaxTripYearsMessage()}`
    }

    if (fecha_inicio && fecha_fin && !isEndAfterStart(fecha_inicio, fecha_fin)) {
      newErrors.fecha_fin = 'La fecha de fin debe ser igual o posterior a la de inicio'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAddDestino = (value = destinoInput) => {
    const normalizedValue = value.trim()

    if (normalizedValue && !destinos.includes(normalizedValue)) {
      setDestinos([...destinos, normalizedValue])
      setDestinoInput('')
      if (errors.destinos) {
        setErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors.destinos
          return newErrors
        })
      }
    } else if (normalizedValue) {
      setDestinoInput('')
    }
  }

  const handleRemoveDestino = (index: number) => {
    setDestinos(destinos.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    await onSubmit(nombre, destinos, fecha_inicio || undefined, fecha_fin || undefined)
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
    >
      {/* Trip Name */}
      <Input
        fullWidth
        label="Nombre del viaje"
        placeholder="P. ej. San Francisco 2025"
        value={nombre}
        onChange={(e) => {
          setNombre(e.target.value)
          if (errors.nombre) {
            setErrors((prev) => {
              const newErrors = { ...prev }
              delete newErrors.nombre
              return newErrors
            })
          }
        }}
        error={!!errors.nombre}
        helperText={errors.nombre}
        disabled={loading}
      />

      {/* Destinations Section */}
      <Box>
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            mb: destinos.length > 0 ? 2 : 0,
            alignItems: 'flex-start',
          }}
        >
          <DestinationAutocomplete
            value={destinoInput}
            onChange={setDestinoInput}
            onAdd={handleAddDestino}
            disabled={loading}
            error={!!errors.destinos}
            helperText={errors.destinos}
          />
          <Tooltip title="Agregar destino">
            <span>
              <IconButton
                aria-label="Agregar destino"
                onClick={() => handleAddDestino()}
                disabled={loading || !destinoInput.trim()}
                sx={{
                  width: 48,
                  height: 48,
                  flexShrink: 0,
                  color: 'primary.main',
                  border: '1px solid',
                  borderColor: 'divider',
                  backgroundColor: 'background.paper',
                  '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <AddIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Box>

        {/* Destination Chips */}
        {destinos.length > 0 && (
          <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', mb: 1.5 }}>
            {destinos.map((destino, i) => (
              <Box
                key={i}
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.75,
                  px: 1.5,
                  py: 0.75,
                  borderRadius: 'var(--border-radius-pill)',
                  backgroundColor: 'var(--color-surface-sunken)',
                  fontSize: '12.5px',
                  fontWeight: 500,
                  color: 'var(--color-fg2)',
                  border: '1px solid var(--color-border-subtle)',
                  whiteSpace: 'nowrap',
                }}
              >
                {destino}
                <button
                  type="button"
                  onClick={() => handleRemoveDestino(i)}
                  disabled={loading}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    padding: 0,
                    color: 'var(--color-fg3)',
                    fontSize: '18px',
                    opacity: loading ? 0.5 : 1,
                    lineHeight: 1,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  ×
                </button>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {/* Date Section */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
        <DateInput
          label="Fecha de inicio"
          value={fecha_inicio}
          onChange={(newValue) => {
            setFechaInicio(newValue)
            const nextFechaFin =
              newValue && (!fecha_fin || !isEndAfterStart(newValue, fecha_fin))
                ? newValue
                : fecha_fin
            if (nextFechaFin !== fecha_fin) setFechaFin(nextFechaFin)

            const newErrors = { ...errors }
            if (!newValue) {
              delete newErrors.fecha_inicio
            } else if (!isWithinTwoYears(newValue)) {
              newErrors.fecha_inicio = getMaxTripYearsMessage()
            } else if (!isFutureOrToday(newValue)) {
              newErrors.fecha_inicio = 'La fecha no puede ser pasada'
            } else {
              delete newErrors.fecha_inicio
            }
            if (nextFechaFin && isEndAfterStart(newValue, nextFechaFin)) {
              delete newErrors.fecha_fin
            }
            setErrors(newErrors)
          }}
          error={!!errors.fecha_inicio}
          helperText={errors.fecha_inicio}
          disabled={loading}
          fullWidth
          min={getMinDate()}
          max={getMaxDate()}
        />
        <DateInput
          label="Fecha de fin"
          value={fecha_fin}
          onChange={(newValue) => {
            setFechaFin(newValue)

            const newErrors = { ...errors }
            if (!newValue) {
              delete newErrors.fecha_fin
            } else if (!isWithinTwoYears(newValue)) {
              newErrors.fecha_fin = getMaxTripYearsMessage()
            } else if (!isFutureOrToday(newValue)) {
              newErrors.fecha_fin = 'La fecha no puede ser pasada'
            } else if (fecha_inicio && !isEndAfterStart(fecha_inicio, newValue)) {
              newErrors.fecha_fin = 'Debe ser igual o posterior a la fecha de inicio'
            } else {
              delete newErrors.fecha_fin
            }
            setErrors(newErrors)
          }}
          error={!!errors.fecha_fin}
          helperText={errors.fecha_fin}
          disabled={loading}
          fullWidth
          min={fecha_inicio || getMinDate()}
          max={getMaxDate()}
        />
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', pt: 1 }}>
        <Button
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
          sx={{ minWidth: '120px' }}
        >
          Cancelar
        </Button>
        <Button
          variant="primary"
          type="submit"
          disabled={loading}
          sx={{ minWidth: '120px', position: 'relative' }}
        >
          {loading ? (
            <CircularProgress size={20} sx={{ position: 'absolute' }} />
          ) : initialData ? (
            'Actualizar'
          ) : (
            'Crear'
          )}
        </Button>
      </Box>
    </Box>
  )
}
