import { useState } from 'react'
import {
  Box,
  TextField,
  Button,
  CircularProgress,
  MenuItem,
  Typography,
} from '@mui/material'
import { DateInput } from '@/components/ui'
import { isEndAfterStart, isWithinTwoYears, getMaxTripYearsMessage, getMinDate, getMaxDate, isFutureOrToday } from '@/utils/dateValidation'
import { BookingDataFields } from './BookingDataFields'
import type { ItemTransporte, TipoTransporte, DatosReserva } from '@/types/items'

const TIPOS_TRANSPORTE: TipoTransporte[] = ['avión', 'tren', 'micro']
const REGEX_HH_MM = /^([0-1]\d|2[0-3]):[0-5]\d$/

interface TransportFormProps {
  initialData?: ItemTransporte
  onSubmit: (item: Omit<ItemTransporte, 'id' | 'created_at' | 'updated_at'>) => Promise<void>
  onCancel: () => void
  loading?: boolean
}

export function TransportForm({ initialData, onSubmit, onCancel, loading = false }: TransportFormProps) {
  const [tipo, setTipo] = useState<TipoTransporte>(initialData?.tipo || 'avión')
  const [compañia, setCompania] = useState(initialData?.compañia || '')
  const [origen, setOrigen] = useState(initialData?.origen || '')
  const [destino, setDestino] = useState(initialData?.destino || '')
  const [fechaSalida, setFechaSalida] = useState(initialData?.fecha_salida || '')
  const [horaSalida, setHoraSalida] = useState(initialData?.hora_salida || '')
  const [fechaLlegada, setFechaLlegada] = useState(initialData?.fecha_llegada || '')
  const [horaLlegada, setHoraLlegada] = useState(initialData?.hora_llegada || '')
  const [numeroServicio, setNumeroServicio] = useState(initialData?.numero_servicio || '')
  const [numeroReserva, setNumeroReserva] = useState(initialData?.numero_reserva || '')
  const [asiento, setAsiento] = useState(initialData?.asiento || '')
  const [datosReserva, setDatosReserva] = useState<DatosReserva>(
    initialData?.datos_reserva || {
      reservado_por_agencia: false,
      codigos_reserva: [],
    },
  )
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!compañia.trim()) newErrors.compañia = 'Compañía requerida'
    if (!origen.trim()) newErrors.origen = 'Origen requerido'
    if (!destino.trim()) newErrors.destino = 'Destino requerido'
    if (!fechaSalida) newErrors.fechaSalida = 'Fecha de salida requerida'
    if (!horaSalida) newErrors.horaSalida = 'Hora de salida requerida'
    if (!REGEX_HH_MM.test(horaSalida)) newErrors.horaSalida = 'Formato: HH:mm'
    if (!fechaLlegada) newErrors.fechaLlegada = 'Fecha de llegada requerida'
    if (!horaLlegada) newErrors.horaLlegada = 'Hora de llegada requerida'
    if (!REGEX_HH_MM.test(horaLlegada)) newErrors.horaLlegada = 'Formato: HH:mm'
    if (!numeroServicio.trim()) newErrors.numeroServicio = 'Número de servicio requerido'
    if (!numeroReserva.trim()) newErrors.numeroReserva = 'Número de reserva requerido'

    if (fechaSalida && !isWithinTwoYears(fechaSalida)) {
      newErrors.fechaSalida = getMaxTripYearsMessage()
    } else if (fechaSalida && !isFutureOrToday(fechaSalida)) {
      newErrors.fechaSalida = 'La fecha no puede ser pasada'
    }

    if (fechaLlegada && !isWithinTwoYears(fechaLlegada)) {
      newErrors.fechaLlegada = getMaxTripYearsMessage()
    } else if (fechaLlegada && !isFutureOrToday(fechaLlegada)) {
      newErrors.fechaLlegada = 'La fecha no puede ser pasada'
    }

    if (fechaSalida && fechaLlegada && !isEndAfterStart(fechaSalida, fechaLlegada)) {
      newErrors.fechaLlegada = 'Debe ser igual o posterior a la salida'
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

    const item: Omit<ItemTransporte, 'id' | 'created_at' | 'updated_at'> = {
      viaje_id: initialData?.viaje_id || '',
      tipo,
      compañia: compañia.trim(),
      origen: origen.trim(),
      destino: destino.trim(),
      fecha_salida: fechaSalida,
      hora_salida: horaSalida,
      fecha_llegada: fechaLlegada,
      hora_llegada: horaLlegada,
      numero_servicio: numeroServicio.trim(),
      numero_reserva: numeroReserva.trim(),
      asiento: asiento.trim() || undefined,
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
        label="Tipo de Transporte"
        value={tipo}
        onChange={(e) => setTipo(e.target.value as TipoTransporte)}
        disabled={loading}
        sx={{ mb: 2 }}
      >
        {TIPOS_TRANSPORTE.map((t) => (
          <MenuItem key={t} value={t}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        fullWidth
        label="Compañía"
        value={compañia}
        onChange={(e) => {
          setCompania(e.target.value)
          clearError('compañia')
        }}
        error={!!errors.compañia}
        helperText={errors.compañia}
        disabled={loading}
        sx={{ mb: 2 }}
      />

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
        <TextField
          label="Origen"
          value={origen}
          onChange={(e) => {
            setOrigen(e.target.value)
            clearError('origen')
          }}
          error={!!errors.origen}
          helperText={errors.origen}
          disabled={loading}
        />
        <TextField
          label="Destino"
          value={destino}
          onChange={(e) => {
            setDestino(e.target.value)
            clearError('destino')
          }}
          error={!!errors.destino}
          helperText={errors.destino}
          disabled={loading}
        />
      </Box>

      <Typography variant="subtitle2" sx={{ mt: 3, mb: 1 }}>
        Salida
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
        <DateInput
          label="Fecha"
          value={fechaSalida}
          onChange={(newValue) => {
            setFechaSalida(newValue)

            const newErrors = { ...errors }
            if (!newValue) {
              delete newErrors.fechaSalida
            } else if (!isWithinTwoYears(newValue)) {
              newErrors.fechaSalida = getMaxTripYearsMessage()
            } else if (!isFutureOrToday(newValue)) {
              newErrors.fechaSalida = 'La fecha no puede ser pasada'
            } else {
              delete newErrors.fechaSalida
            }
            setErrors(newErrors)
          }}
          error={!!errors.fechaSalida}
          helperText={errors.fechaSalida}
          disabled={loading}
          fullWidth
          min={getMinDate()}
          max={getMaxDate()}
        />
        <TextField
          label="Hora"
          value={horaSalida}
          onChange={(e) => {
            setHoraSalida(e.target.value)
            clearError('horaSalida')
          }}
          error={!!errors.horaSalida}
          helperText={errors.horaSalida}
          disabled={loading}
          placeholder="HH:mm"
        />
      </Box>

      <Typography variant="subtitle2" sx={{ mt: 3, mb: 1 }}>
        Llegada
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
        <DateInput
          label="Fecha"
          value={fechaLlegada}
          onChange={(newValue) => {
            setFechaLlegada(newValue)

            const newErrors = { ...errors }
            if (!newValue) {
              delete newErrors.fechaLlegada
            } else if (!isWithinTwoYears(newValue)) {
              newErrors.fechaLlegada = getMaxTripYearsMessage()
            } else if (!isFutureOrToday(newValue)) {
              newErrors.fechaLlegada = 'La fecha no puede ser pasada'
            } else if (fechaSalida && !isEndAfterStart(fechaSalida, newValue)) {
              newErrors.fechaLlegada = 'Debe ser igual o posterior a la salida'
            } else {
              delete newErrors.fechaLlegada
            }
            setErrors(newErrors)
          }}
          error={!!errors.fechaLlegada}
          helperText={errors.fechaLlegada}
          disabled={loading}
          fullWidth
          min={getMinDate()}
          max={getMaxDate()}
        />
        <TextField
          label="Hora"
          value={horaLlegada}
          onChange={(e) => {
            setHoraLlegada(e.target.value)
            clearError('horaLlegada')
          }}
          error={!!errors.horaLlegada}
          helperText={errors.horaLlegada}
          disabled={loading}
          placeholder="HH:mm"
        />
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
        <TextField
          label="Número de Servicio"
          value={numeroServicio}
          onChange={(e) => {
            setNumeroServicio(e.target.value)
            clearError('numeroServicio')
          }}
          error={!!errors.numeroServicio}
          helperText={errors.numeroServicio}
          disabled={loading}
        />
        <TextField
          label="Número de Reserva"
          value={numeroReserva}
          onChange={(e) => {
            setNumeroReserva(e.target.value)
            clearError('numeroReserva')
          }}
          error={!!errors.numeroReserva}
          helperText={errors.numeroReserva}
          disabled={loading}
        />
      </Box>

      <TextField
        fullWidth
        label="Asiento (opcional)"
        value={asiento}
        onChange={(e) => setAsiento(e.target.value)}
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
