import { useNavigate, useParams } from 'react-router-dom'
import { Container, Box, Typography, Paper, Alert, CircularProgress } from '@mui/material'
import { useEffect, useState } from 'react'
import { TransportForm } from '@/components/TransportForm'
import {
  createTransporte,
  getTransporteById,
  updateTransporte,
} from '@/services/itemsService'
import { useSnackbar } from '@/context/SnackbarContext'
import type { ItemTransporte } from '@/types/items'

export function TransportFormPage() {
  const navigate = useNavigate()
  const { viajeId, itemId } = useParams<{ viajeId: string; itemId?: string }>()
  const snackbar = useSnackbar()
  const [loading, setLoading] = useState(false)
  const [loadingItem, setLoadingItem] = useState(Boolean(itemId))
  const [initialData, setInitialData] = useState<ItemTransporte>()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!viajeId || !itemId) {
      setLoadingItem(false)
      return
    }

    let active = true

    const loadItem = async () => {
      setLoadingItem(true)
      setError(null)
      const response = await getTransporteById(viajeId, itemId)

      if (!active) return

      if (response.success && response.data) {
        setInitialData(response.data)
      } else {
        setError(response.error?.message || 'No se pudo cargar el transporte')
      }
      setLoadingItem(false)
    }

    loadItem()

    return () => {
      active = false
    }
  }, [itemId, viajeId])

  const handleSubmit = async (item: Omit<ItemTransporte, 'id' | 'created_at' | 'updated_at'>) => {
    if (!viajeId) return

    setLoading(true)
    setError(null)

    try {
      const itemWithoutViajeId = Object.fromEntries(
        Object.entries(item).filter(([key]) => key !== 'viaje_id'),
      ) as Omit<typeof item, 'viaje_id'>

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

        {loadingItem ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : itemId && !initialData ? null : (
          <Paper sx={{ p: 3 }}>
            <TransportForm
              initialData={initialData}
              onSubmit={handleSubmit}
              onCancel={() => navigate(`/trips/${viajeId}`)}
              loading={loading}
            />
          </Paper>
        )}
      </Box>
    </Container>
  )
}
