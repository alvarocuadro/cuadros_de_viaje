import { useState } from 'react'
import { Box, TextField, Button, CircularProgress, MenuItem, Typography } from '@mui/material'
import { DateInput } from '@/components/ui'
import {
  isEndAfterStart,
  isWithinTwoYears,
  getMaxTripYearsMessage,
  getMinDate,
  getMaxDate,
  isFutureOrToday,
} from '@/utils/dateValidation'
import { BookingDataFields } from './BookingDataFields'
import { AddressAutocomplete } from './AddressAutocomplete'
import type { ItemHospedaje, TipoHospedaje, DatosReserva } from '@/types/items'

const TIPOS_HOSPEDAJE: TipoHospedaje[] = [
  'hotel',
  'airbnb',
  'posada',
  'hostel',
  'casa de familia',
  'otro',
]

interface AccommodationFormProps {
  initialData?: ItemHospedaje
  onSubmit: (item: Omit<ItemHospedaje, 'id' | 'created_at' | 'updated_at'>) => Promise<void>
  onCancel: () => void
  loading?: boolean
}

export function AccommodationForm({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
}: AccommodationFormProps) {
  const [tipo, setTipo] = useState<TipoHospedaje>(initialData?.tipo || 'hotel')
  const [nombre, setNombre] = useState(initialData?.nombre || '')
  const [fechaCheckin, setFechaCheckin] = useState(initialData?.fecha_checkin || '')
  const [fechaCheckout, setFechaCheckout] = useState(
    initialData?.fecha_checkout || initialData?.fecha_checkin || ''
  )
  const [direccion, setDireccion] = useState(initialData?.dirección || '')
  const [telefono, setTelefono] = useState(initialData?.teléfono || '')
  const [email, setEmail] = useState(initialData?.email || '')
  const [numeroReserva, setNumeroReserva] = useState(initialData?.numero_reserva || '')
  const [datosReserva, setDatosReserva] = useState<DatosReserva>(
    initialData?.datos_reserva || {
      reservado_por_agencia: false,
      codigos_reserva: [],
    }
  )
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!nombre.trim()) newErrors.nombre = 'Nombre requerido'
    if (!fechaCheckin) newErrors.fechaCheckin = 'Fecha de check-in requerida'
    if (!fechaCheckout) newErrors.fechaCheckout = 'Fecha de check-out requerida'
    if (!direccion.trim()) newErrors.direccion = 'Dirección requerida'
    if (fechaCheckin && !isWithinTwoYears(fechaCheckin)) {
      newErrors.fechaCheckin = getMaxTripYearsMessage()
    } else if (fechaCheckin && !isFutureOrToday(fechaCheckin)) {
      newErrors.fechaCheckin = 'La fecha no puede ser pasada'
    }

    if (fechaCheckout && !isWithinTwoYears(fechaCheckout)) {
      newErrors.fechaCheckout = getMaxTripYearsMessage()
    } else if (fechaCheckout && !isFutureOrToday(fechaCheckout)) {
      newErrors.fechaCheckout = 'La fecha no puede ser pasada'
    }

    if (fechaCheckin && fechaCheckout && !isEndAfterStart(fechaCheckin, fechaCheckout)) {
      newErrors.fechaCheckout = 'Debe ser igual o posterior a check-in'
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Email inválido'
    }

    if (datosReserva.reservado_por_agencia && !datosReserva.nombre_agencia?.trim()) {
      newErrors.nombreAgencia = 'Nombre de agencia requerido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    const item: Omit<ItemHospedaje, 'id' | 'created_at' | 'updated_at'> = {
      viaje_id: initialData?.viaje_id || '',
      tipo,
      nombre: nombre.trim(),
      fecha_checkin: fechaCheckin,
      fecha_checkout: fechaCheckout,
      dirección: direccion.trim(),
      teléfono: telefono.trim() || undefined,
      email: email.trim() || undefined,
      numero_reserva: numeroReserva.trim() || undefined,
      datos_reserva: datosReserva,
    }

    await onSubmit(item)
  }

  const clearError = (field: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[field]
      return newErrors
    })
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <TextField
        select
        fullWidth
        label="Tipo de Hospedaje"
        value={tipo}
        onChange={(e) => setTipo(e.target.value as TipoHospedaje)}
        disabled={loading}
        sx={{ mb: 2 }}
      >
        {TIPOS_HOSPEDAJE.map((t) => (
          <MenuItem key={t} value={t}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        fullWidth
        label="Nombre"
        value={nombre}
        onChange={(e) => {
          setNombre(e.target.value)
          clearError('nombre')
        }}
        error={!!errors.nombre}
        helperText={errors.nombre}
        disabled={loading}
        sx={{ mb: 2 }}
      />

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
        <DateInput
          label="Check-in"
          value={fechaCheckin}
          onChange={(newValue) => {
            setFechaCheckin(newValue)
            const nextFechaCheckout =
              newValue && (!fechaCheckout || !isEndAfterStart(newValue, fechaCheckout))
                ? newValue
                : fechaCheckout
            if (nextFechaCheckout !== fechaCheckout) setFechaCheckout(nextFechaCheckout)

            const newErrors = { ...errors }
            if (!newValue) {
              delete newErrors.fechaCheckin
            } else if (!isWithinTwoYears(newValue)) {
              newErrors.fechaCheckin = getMaxTripYearsMessage()
            } else if (!isFutureOrToday(newValue)) {
              newErrors.fechaCheckin = 'La fecha no puede ser pasada'
            } else {
              delete newErrors.fechaCheckin
            }
            if (nextFechaCheckout && isEndAfterStart(newValue, nextFechaCheckout)) {
              delete newErrors.fechaCheckout
            }
            setErrors(newErrors)
          }}
          error={!!errors.fechaCheckin}
          helperText={errors.fechaCheckin}
          disabled={loading}
          fullWidth
          min={getMinDate()}
          max={getMaxDate()}
        />
        <DateInput
          label="Check-out"
          value={fechaCheckout}
          onChange={(newValue) => {
            setFechaCheckout(newValue)

            const newErrors = { ...errors }
            if (!newValue) {
              delete newErrors.fechaCheckout
            } else if (!isWithinTwoYears(newValue)) {
              newErrors.fechaCheckout = getMaxTripYearsMessage()
            } else if (!isFutureOrToday(newValue)) {
              newErrors.fechaCheckout = 'La fecha no puede ser pasada'
            } else if (fechaCheckin && !isEndAfterStart(fechaCheckin, newValue)) {
              newErrors.fechaCheckout = 'Debe ser igual o posterior a check-in'
            } else {
              delete newErrors.fechaCheckout
            }
            setErrors(newErrors)
          }}
          error={!!errors.fechaCheckout}
          helperText={errors.fechaCheckout}
          disabled={loading}
          fullWidth
          min={fechaCheckin || getMinDate()}
          max={getMaxDate()}
        />
      </Box>

      <Box sx={{ mb: 2 }}>
        <AddressAutocomplete
          value={direccion}
          onChange={(newValue) => {
            setDireccion(newValue)
            clearError('direccion')
          }}
          error={!!errors.direccion}
          helperText={errors.direccion}
          disabled={loading}
        />
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
        <TextField
          label="Teléfono (opcional)"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          disabled={loading}
          placeholder="+54..."
        />
        <TextField
          label="Email (opcional)"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            clearError('email')
          }}
          error={!!errors.email}
          helperText={errors.email}
          disabled={loading}
          type="email"
        />
      </Box>

      <TextField
        fullWidth
        label="Número de Reserva (opcional)"
        value={numeroReserva}
        onChange={(e) => setNumeroReserva(e.target.value)}
        disabled={loading}
        sx={{ mb: 2 }}
      />

      <BookingDataFields value={datosReserva} onChange={setDatosReserva} disabled={loading} />

      {errors.nombreAgencia && (
        <Typography color="error" variant="caption" sx={{ display: 'block', mt: 1 }}>
          {errors.nombreAgencia}
        </Typography>
      )}

      <Box sx={{ display: 'flex', gap: 1, mt: 3 }}>
        <Button fullWidth variant="contained" type="submit" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : initialData ? 'Actualizar' : 'Crear'}
        </Button>
        <Button fullWidth variant="outlined" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
      </Box>
    </Box>
  )
}
