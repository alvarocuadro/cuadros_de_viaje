import { useNavigate, useParams } from 'react-router-dom'
import { Container, Box, Typography, Paper, Alert } from '@mui/material'
import { useState } from 'react'
import { TripForm } from '@/components/TripForm'
import { useTrips } from '@/context/TripsContext'
import { useSnackbar } from '@/context/SnackbarContext'

export function TripFormPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { viajes, createTrip, updateTrip, loading, error: contextError } = useTrips()
  const snackbar = useSnackbar()
  const [loading_form, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const trip = id ? viajes.find((v) => v.id === id) : undefined

  const handleSubmit = async (nombre: string, destinos: string[], fecha_inicio?: string, fecha_fin?: string) => {
    setLoading(true)
    setError(null)

    try {
      if (id && trip) {
        await updateTrip(id, { nombre, destinos, fecha_inicio: fecha_inicio || null, fecha_fin: fecha_fin || null })
        snackbar.showSuccess('Viaje actualizado correctamente')
      } else {
        await createTrip(nombre, destinos, fecha_inicio, fecha_fin)
        snackbar.showSuccess('Viaje creado correctamente')
      }
      navigate('/dashboard')
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al guardar el viaje'
      setError(errorMsg)
      snackbar.showError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  if (id && !trip) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 4 }}>
          <Alert severity="error">Viaje no encontrado</Alert>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 3, mb: 3 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>
          {id ? 'Editar viaje' : 'Crear nuevo viaje'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {contextError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {contextError}
          </Alert>
        )}

        <Paper sx={{ p: 3 }}>
          <TripForm
            initialData={trip}
            onSubmit={handleSubmit}
            onCancel={() => navigate('/dashboard')}
            loading={loading_form || loading}
          />
        </Paper>
      </Box>
    </Container>
  )
}
