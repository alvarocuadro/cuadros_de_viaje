import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Alert } from '@mui/material'

interface TripDeleteDialogProps {
  open: boolean
  tripName: string
  onConfirm: () => void
  onCancel: () => void
  loading?: boolean
}

export function TripDeleteDialog({
  open,
  tripName,
  onConfirm,
  onCancel,
  loading = false,
}: TripDeleteDialogProps) {
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle>Eliminar viaje</DialogTitle>
      <DialogContent>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Esta acción no se puede deshacer
        </Alert>
        <DialogContentText>
          ¿Estás seguro de que querés eliminar el viaje <strong>"{tripName}"</strong>?
        </DialogContentText>
        <DialogContentText sx={{ mt: 2, color: 'warning.main' }}>
          Se eliminarán también todos los ítems de transporte y hospedaje asociados.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained" disabled={loading}>
          {loading ? 'Eliminando...' : 'Eliminar'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
