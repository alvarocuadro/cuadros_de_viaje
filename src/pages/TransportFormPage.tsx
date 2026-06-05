import { useNavigate, useParams } from 'react-router-dom'
import { Container, Box, Typography, Paper, Alert } from '@mui/material'
import { useState } from 'react'
import { TransportForm } from '@/components/TransportForm'
import { createTransporte, updateTransporte } from '@/services/itemsService'
import { useSnackbar } from '@/context/SnackbarContext'
import type { ItemTransporte } from '@/types/items'

export function TransportFormPage() {
  const navigate = useNavigate()
  const { viajeId, itemId } = useParams<{ viajeId: string; itemId?: string }>()
  const snackbar = useSnackbar()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (item: Omit<ItemTransporte, 'id' | 'created_at' | 'updated_at'>) => {
    if (!viajeId) return

    setLoading(true)
    setError(null)

    try {
      const { viaje_id, ...itemWithoutViajeId } = item

      if (itemId) {
        const response = await updateTransporte(itemId, itemWithoutViajeId)
        if (!response.success) {
          const errorMsg = response.error?.message || 'Error al actualizar'
          setError(errorMsg)
          snackbar.showError(errorMsg)
          return
        }
        snackbar.showSuccess('Transporte actualizado correctamente')
      } else {
        const response = await createTransporte(viajeId, itemWithoutViajeId)
        if (!response.success) {
          const errorMsg = response.error?.message || 'Error al crear'
          setError(errorMsg)
          snackbar.showError(errorMsg)
          return
        }
        snackbar.showSuccess('Transporte creado correctamente')
      }

      navigate(`/trips/${viajeId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  if (!viajeId) {
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
          {itemId ? 'Editar transporte' : 'Agregar transporte'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Paper sx={{ p: 3 }}>
          <TransportForm
            onSubmit={handleSubmit}
            onCancel={() => navigate(`/trips/${viajeId}`)}
            loading={loading}
          />
        </Paper>
      </Box>
    </Container>
  )
}
