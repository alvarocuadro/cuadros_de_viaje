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
import { getTransporte, deleteTransporte, getHospedaje, deleteHospedaje } from '@/services/itemsService'
import { TransportItem } from '@/components/TransportItem'
import { AccommodationItem } from '@/components/AccommodationItem'
import { EmptyState } from '@/components/EmptyState'
import { TripDetailSkeleton } from '@/components/SkeletonLoader'
import { formatDate } from '@/utils/formatters'
import { useSnackbar } from '@/context/SnackbarContext'
import type { ItemTransporte, ItemHospedaje, ItemAgenda } from '@/types/items'

export function TripDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { viajes } = useTrips()
  const snackbar = useSnackbar()
  const [agenda, setAgenda] = useState<ItemAgenda[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<{ tipo: 'transporte' | 'hospedaje'; id: string } | null>(null)
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
      try {
        const [transportRes, hospedajeRes] = await Promise.all([getTransporte(id), getHospedaje(id)])

        const items: ItemAgenda[] = []

        if (transportRes.success && transportRes.data) {
          transportRes.data.forEach((item) => {
            items.push({
              tipo: 'transporte',
              fecha_inicio: item.fecha_salida,
              datos: item,
            })
          })
        }

        if (hospedajeRes.success && hospedajeRes.data) {
          hospedajeRes.data.forEach((item) => {
            items.push({
              tipo: 'hospedaje',
              fecha_inicio: item.fecha_checkin,
              datos: item,
            })
          })
        }

        items.sort((a, b) => a.fecha_inicio.localeCompare(b.fecha_inicio))
        setAgenda(items)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar los ítems')
      } finally {
        setLoading(false)
      }
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

  const handleAddHospedaje = () => {
    handleAddMenuClose()
    navigate(`/trips/${id}/accommodation/new`)
  }

  const handleEditTransporte = (item: ItemTransporte) => {
    navigate(`/trips/${id}/transport/${item.id}/edit`)
  }

  const handleEditHospedaje = (item: ItemHospedaje) => {
    navigate(`/trips/${id}/accommodation/${item.id}/edit`)
  }

  const handleDeleteItem = (tipo: 'transporte' | 'hospedaje', itemId: string) => {
    setItemToDelete({ tipo, id: itemId })
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return

    setDeleting(true)
    const response =
      itemToDelete.tipo === 'transporte' ? await deleteTransporte(itemToDelete.id) : await deleteHospedaje(itemToDelete.id)
    setDeleting(false)

    if (response.success) {
      setAgenda(agenda.filter((a) => !(a.tipo === itemToDelete.tipo && a.datos.id === itemToDelete.id)))
      setDeleteDialogOpen(false)
      setItemToDelete(null)
      snackbar.showSuccess('Ítem eliminado correctamente')
    } else {
      const errorMsg = response.error?.message || 'Error al eliminar'
      setError(errorMsg)
      snackbar.showError(errorMsg)
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
          <TripDetailSkeleton />
        ) : agenda.length === 0 ? (
          <EmptyState
            title="Sin ítems"
            description="Agrega transporte u hospedaje para organizar tu viaje"
            icon="📋"
          />
        ) : (
          agenda.map((item) =>
            item.tipo === 'transporte' ? (
              <TransportItem
                key={item.datos.id}
                item={item.datos as ItemTransporte}
                onEdit={handleEditTransporte}
                onDelete={(i) => handleDeleteItem('transporte', i.id)}
              />
            ) : (
              <AccommodationItem
                key={item.datos.id}
                item={item.datos as ItemHospedaje}
                onEdit={handleEditHospedaje}
                onDelete={(i) => handleDeleteItem('hospedaje', i.id)}
              />
            ),
          )
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
        <MenuItem onClick={handleAddHospedaje}>Agregar Hospedaje</MenuItem>
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
