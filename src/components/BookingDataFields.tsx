import { useState } from 'react'
import {
  Box,
  TextField,
  FormControlLabel,
  Checkbox,
  Chip,
  Button,
  Typography,
  IconButton,
} from '@mui/material'
import { OpenInNew as OpenInNewIcon } from '@mui/icons-material'
import type { DatosReserva } from '@/types/items'

interface BookingDataFieldsProps {
  value: DatosReserva
  onChange: (datos: DatosReserva) => void
  disabled?: boolean
}

export function BookingDataFields({ value, onChange, disabled = false }: BookingDataFieldsProps) {
  const [codigoInput, setCodigoInput] = useState('')

  const handleToggleAgencia = (checked: boolean) => {
    onChange({
      ...value,
      reservado_por_agencia: checked,
      nombre_agencia: checked ? value.nombre_agencia || '' : undefined,
    })
  }

  const handleNombreAgencia = (nombre: string) => {
    onChange({ ...value, nombre_agencia: nombre })
  }

  const handleAddCodigo = () => {
    if (codigoInput.trim() && !value.codigos_reserva.includes(codigoInput.trim())) {
      onChange({
        ...value,
        codigos_reserva: [...value.codigos_reserva, codigoInput.trim()],
      })
      setCodigoInput('')
    }
  }

  const handleRemoveCodigo = (codigo: string) => {
    onChange({
      ...value,
      codigos_reserva: value.codigos_reserva.filter((c) => c !== codigo),
    })
  }

  const handleUrlChange = (url: string) => {
    onChange({ ...value, url_reserva: url })
  }

  const handleComentariosChange = (comentarios: string) => {
    onChange({ ...value, comentarios })
  }

  return (
    <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e0e0e0' }}>
      <Typography variant="subtitle2" sx={{ mb: 2 }}>
        Datos de Reserva
      </Typography>

      <Box sx={{ mb: 2 }}>
        <FormControlLabel
          control={<Checkbox checked={value.reservado_por_agencia} onChange={(e) => handleToggleAgencia(e.target.checked)} disabled={disabled} />}
          label="Reservado por agencia"
        />
        {value.reservado_por_agencia && (
          <TextField
            fullWidth
            label="Nombre de la agencia"
            value={value.nombre_agencia || ''}
            onChange={(e) => handleNombreAgencia(e.target.value)}
            disabled={disabled}
            size="small"
            sx={{ mt: 1 }}
          />
        )}
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="caption" sx={{ display: 'block', mb: 1 }}>
          Códigos de Reserva
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
          <TextField
            size="small"
            placeholder="Agregar código"
            value={codigoInput}
            onChange={(e) => setCodigoInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleAddCodigo()
              }
            }}
            disabled={disabled}
            fullWidth
          />
          <Button variant="outlined" onClick={handleAddCodigo} disabled={disabled || !codigoInput.trim()}>
            +
          </Button>
        </Box>
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
          {value.codigos_reserva.map((codigo) => (
            <Chip
              key={codigo}
              label={codigo}
              onDelete={() => handleRemoveCodigo(codigo)}
              disabled={disabled}
              size="small"
            />
          ))}
        </Box>
      </Box>

      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          label="URL de Reserva"
          value={value.url_reserva || ''}
          onChange={(e) => handleUrlChange(e.target.value)}
          disabled={disabled}
          size="small"
          placeholder="https://..."
          InputProps={{
            endAdornment: value.url_reserva ? (
              <IconButton
                size="small"
                component="a"
                href={value.url_reserva}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ mr: -1 }}
              >
                <OpenInNewIcon fontSize="small" />
              </IconButton>
            ) : null,
          }}
        />
      </Box>

      <TextField
        fullWidth
        multiline
        rows={2}
        label="Comentarios (opcional)"
        value={value.comentarios || ''}
        onChange={(e) => handleComentariosChange(e.target.value)}
        disabled={disabled}
        size="small"
      />
    </Box>
  )
}
