import { useState } from 'react'
import {
  Box,
  TextField,
  Button,
  Chip,
  Typography,
  CircularProgress,
} from '@mui/material'
import { isEndAfterStart, isFutureOrToday } from '@/utils/dateValidation'
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
    <Box component="form" onSubmit={handleSubmit}>
      <TextField
        fullWidth
        label="Nombre del viaje"
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
        sx={{ mb: 2 }}
      />

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Destinos
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
          <TextField
            size="small"
            placeholder="Agregar destino"
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
          />
          <Button variant="outlined" onClick={handleAddDestino} disabled={loading || !destinoInput.trim()}>
            +
          </Button>
        </Box>
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1 }}>
          {destinos.map((destino, i) => (
            <Chip
              key={i}
              label={destino}
              onDelete={() => handleRemoveDestino(i)}
              disabled={loading}
            />
          ))}
        </Box>
        {errors.destinos && <Typography color="error" variant="caption">{errors.destinos}</Typography>}
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
        <TextField
          type="date"
          label="Fecha de inicio"
          value={fecha_inicio}
          onChange={(e) => {
            setFechaInicio(e.target.value)
            if (errors.fecha_inicio) {
              setErrors((prev) => {
                const newErrors = { ...prev }
                delete newErrors.fecha_inicio
                return newErrors
              })
            }
          }}
          error={!!errors.fecha_inicio}
          helperText={errors.fecha_inicio}
          disabled={loading}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          type="date"
          label="Fecha de fin"
          value={fecha_fin}
          onChange={(e) => {
            setFechaFin(e.target.value)
            if (errors.fecha_fin) {
              setErrors((prev) => {
                const newErrors = { ...prev }
                delete newErrors.fecha_fin
                return newErrors
              })
            }
          }}
          error={!!errors.fecha_fin}
          helperText={errors.fecha_fin}
          disabled={loading}
          InputLabelProps={{ shrink: true }}
        />
      </Box>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button
          fullWidth
          variant="contained"
          type="submit"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : initialData ? 'Actualizar' : 'Crear'}
        </Button>
        <Button fullWidth variant="outlined" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
      </Box>
    </Box>
  )
}
