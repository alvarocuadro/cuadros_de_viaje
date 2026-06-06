import { useState } from 'react'
import { Box, Typography, CircularProgress } from '@mui/material'
import { Input, Button } from '@/components/ui'
import { isEndAfterStart, isFutureOrToday, isWithinTwoYears, getMaxTripYearsMessage, getMinDate, getMaxDate } from '@/utils/dateValidation'
import type { ViajeConItems } from '@/types/trips'

interface TripFormProps {
  initialData?: ViajeConItems
  onSubmit: (nombre: string, destinos: string[], fecha_inicio?: string, fecha_fin?: string) => Promise<void>
  onCancel: () => void
  loading?: boolean
}

export function TripForm({ initialData, onSubmit, onCancel, loading = false }: TripFormProps) {
  const [nombre, setNombre] = useState(initialData?.nombre || '')
  const [destinos, setDestinos] = useState<string[]>(initialData?.destinos || [])
  const [destinoInput, setDestinoInput] = useState('')
  const [fecha_inicio, setFechaInicio] = useState(initialData?.fecha_inicio || '')
  const [fecha_fin, setFechaFin] = useState(initialData?.fecha_fin || '')
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

  const handleAddDestino = () => {
    if (destinoInput.trim() && !destinos.includes(destinoInput.trim())) {
      setDestinos([...destinos, destinoInput.trim()])
      setDestinoInput('')
      if (errors.destinos) {
        setErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors.destinos
          return newErrors
        })
      }
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
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
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
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1.5, color: 'text.secondary' }}>
          Destinos
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'flex-start' }}>
          <Input
            placeholder="P. ej. París, Madrid"
            value={destinoInput}
            onChange={(e) => setDestinoInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleAddDestino()
              }
            }}
            disabled={loading}
            fullWidth
            size="small"
            sx={{ mb: 0 }}
          />
          <Button
            variant="secondary"
            onClick={handleAddDestino}
            disabled={loading || !destinoInput.trim()}
            sx={{
              minWidth: '44px !important',
              padding: '12px !important',
              fontSize: '18px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            +
          </Button>
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

        {errors.destinos && (
          <Typography sx={{ color: 'error.main', fontSize: '12px', mt: 0.75 }}>
            {errors.destinos}
          </Typography>
        )}
      </Box>

      {/* Date Section */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
        <Input
          type="date"
          label="Fecha de inicio"
          value={fecha_inicio}
          onChange={(e) => {
            const newValue = e.target.value
            setFechaInicio(newValue)

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
            setErrors(newErrors)
          }}
          error={!!errors.fecha_inicio}
          helperText={errors.fecha_inicio}
          disabled={loading}
          fullWidth
          InputLabelProps={{ shrink: true }}
          inputProps={{ min: getMinDate(), max: getMaxDate() }}
        />
        <Input
          type="date"
          label="Fecha de fin"
          value={fecha_fin}
          onChange={(e) => {
            const newValue = e.target.value
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
          InputLabelProps={{ shrink: true }}
          inputProps={{ min: getMinDate(), max: getMaxDate() }}
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
          ) : (
            initialData ? 'Actualizar' : 'Crear'
          )}
        </Button>
      </Box>
    </Box>
  )
}
