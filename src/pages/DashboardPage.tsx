import { useNavigate } from 'react-router-dom'
import { Container, Box, Typography, Fab, Alert } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { useState } from 'react'
import { TripGroup } from '@/components/TripGroup'
import { TripDeleteDialog } from '@/components/TripDeleteDialog'
import { EmptyState } from '@/components/EmptyState'
import { TripCardSkeleton } from '@/components/SkeletonLoader'
import { useTrips } from '@/context/TripsContext'

export function DashboardPage() {
  const navigate = useNavigate()
  const { agrupados, loading, error, deleteTrip } = useTrips()
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string; name: string }>({
    open: false,
    id: '',
    name: '',
  })
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const totalViajes = agrupados.pasados.length + agrupados.actuales.length + agrupados.futuros.length

  const handleDeleteClick = (id: string, nombre: string) => {
    setDeleteDialog({ open: true, id, name: nombre })
  }

  const handleDeleteConfirm = async () => {
    setDeletingId(deleteDialog.id)
    await deleteTrip(deleteDialog.id)
    setDeletingId(null)
    setDeleteDialog({ open: false, id: '', name: '' })
  }

  const handleEditClick = (id: string) => {
    navigate(`/trips/${id}/edit`)
  }

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ py: 3 }}>
          <Typography variant="h5" sx={{ mb: 3 }}>
            Mis viajes
          </Typography>
          {[1, 2, 3].map((i) => (
            <TripCardSkeleton key={i} />
          ))}
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h5">Mis viajes</Typography>
            <Typography variant="body2" color="textSecondary">
              {totalViajes === 0 ? 'Sin viajes' : `${totalViajes} viaje${totalViajes !== 1 ? 's' : ''}`}
            </Typography>
          </Box>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {totalViajes === 0 ? (
          <EmptyState
            icon="✈️"
            title="Sin viajes planificados"
            description="Creá tu primer viaje para comenzar a organizar tu itinerario"
            action={{
              label: 'Crear viaje',
              onClick: () => navigate('/trips/new'),
            }}
          />
        ) : (
          <Box>
            {agrupados.actuales.length > 0 && (
              <TripGroup
                title="Actuales"
                viajes={agrupados.actuales}
                onEdit={handleEditClick}
                onDelete={(id) => {
                  const viaje = agrupados.actuales.find((v) => v.id === id)
                  if (viaje) handleDeleteClick(id, viaje.nombre)
                }}
                defaultExpanded
                emptyIcon="🌍"
              />
            )}

            {agrupados.futuros.length > 0 && (
              <TripGroup
                title="Próximos"
                viajes={agrupados.futuros}
                onEdit={handleEditClick}
                onDelete={(id) => {
                  const viaje = agrupados.futuros.find((v) => v.id === id)
                  if (viaje) handleDeleteClick(id, viaje.nombre)
                }}
                defaultExpanded={agrupados.actuales.length === 0}
                emptyIcon="📅"
              />
            )}

            {agrupados.pasados.length > 0 && (
              <TripGroup
                title="Pasados"
                viajes={agrupados.pasados}
                onEdit={handleEditClick}
                onDelete={(id) => {
                  const viaje = agrupados.pasados.find((v) => v.id === id)
                  if (viaje) handleDeleteClick(id, viaje.nombre)
                }}
                defaultExpanded={false}
                emptyIcon="📸"
              />
            )}
          </Box>
        )}
      </Box>

      <Fab
        color="primary"
        aria-label="add"
        onClick={() => navigate('/trips/new')}
        sx={{
          position: 'fixed',
          bottom: { xs: 80, sm: 32 },
          right: 32,
        }}
      >
        <AddIcon />
      </Fab>

      <TripDeleteDialog
        open={deleteDialog.open}
        tripName={deleteDialog.name}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteDialog({ open: false, id: '', name: '' })}
        loading={deletingId !== null}
      />
    </Container>
  )
}
