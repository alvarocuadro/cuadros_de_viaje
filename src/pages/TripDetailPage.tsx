import { useNavigate, useParams } from 'react-router-dom'
import {
  Container,
  Box,
  Typography,
  Alert,
  Fab,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
} from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import { useState, useEffect } from 'react'
import { useTrips } from '@/context/TripsContext'
import { getTransporte, deleteTransporte } from '@/services/itemsService'
import { TransportItem } from '@/components/TransportItem'
import { EmptyState } from '@/components/EmptyState'
import { formatDate } from '@/utils/formatters'
import type { ItemTransporte } from '@/types/items'

export function TripDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { viajes } = useTrips()
  const [items, setItems] = useState<ItemTransporte[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<ItemTransporte | null>(null)
  const [deleting, setDeleting] = useState(false)

  const viaje = id ? viajes.find((v) => v.id === id) : undefined

  useEffect(() => {
    if (!id) {
      setError('Viaje no encontrado')
      return
    }

    const loadItems = async () => {
      setLoading(true)
      setError(null)
      const response = await getTransporte(id)
      if (response.success && response.data) {
        setItems(response.data)
      } else {
        setError(response.error?.message || 'Error al cargar los ítems')
      }
      setLoading(false)
    }

    loadItems()
  }, [id])

  const handleAddMenuOpen = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget)
  }

  const handleAddMenuClose = () => {
    setAnchorEl(null)
  }

  const handleAddTransporte = () => {
    handleAddMenuClose()
    navigate(`/trips/${id}/transport/new`)
  }

  const handleEditTransporte = (item: ItemTransporte) => {
    navigate(`/trips/${id}/transport/${item.id}/edit`)
  }

  const handleDeleteTransporte = (item: ItemTransporte) => {
    setItemToDelete(item)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return

    setDeleting(true)
    const response = await deleteTransporte(itemToDelete.id)
    setDeleting(false)

    if (response.success) {
      setItems(items.filter((i) => i.id !== itemToDelete.id))
      setDeleteDialogOpen(false)
      setItemToDelete(null)
    } else {
      setError(response.error?.message || 'Error al eliminar')
    }
  }

  if (!id || !viaje) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4 }}>
          <Alert severity="error">Viaje no encontrado</Alert>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 3, mb: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ mb: 1 }}>
            {viaje.nombre}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {viaje.destinos.join(' • ')}
          </Typography>
          {(viaje.fecha_inicio || viaje.fecha_fin) && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {viaje.fecha_inicio && formatDate(viaje.fecha_inicio)}
              {viaje.fecha_inicio && viaje.fecha_fin && ' a '}
              {viaje.fecha_fin && formatDate(viaje.fecha_fin)}
            </Typography>
          )}
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Typography variant="h6" sx={{ mb: 2, mt: 3 }}>
          Agenda
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : items.length === 0 ? (
          <EmptyState
            title="Sin ítems"
            description="Agrega transporte u hospedaje para organizar tu viaje"
            icon="📋"
          />
        ) : (
          items.map((item) => (
            <TransportItem
              key={item.id}
              item={item}
              onEdit={handleEditTransporte}
              onDelete={handleDeleteTransporte}
            />
          ))
        )}
      </Box>

      <Fab
        color="primary"
        aria-label="add"
        onClick={handleAddMenuOpen}
        sx={{
          position: 'fixed',
          bottom: { xs: 80, sm: 32 },
          right: 16,
        }}
      >
        <AddIcon />
      </Fab>

      <Menu
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={handleAddMenuClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <MenuItem onClick={handleAddTransporte}>Agregar Transporte</MenuItem>
        <MenuItem disabled>Agregar Hospedaje (próximamente)</MenuItem>
      </Menu>

      <Dialog open={deleteDialogOpen} onClose={() => !deleting && setDeleteDialogOpen(false)}>
        <DialogTitle>Eliminar Ítem</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que querés eliminar este ítem? Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={deleting}>
            Cancelar
          </Button>
          <Button onClick={handleConfirmDelete} color="error" disabled={deleting}>
            {deleting ? <CircularProgress size={24} /> : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}
