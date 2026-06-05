import { useState } from 'react'
import {
  Card,
  CardContent,
  Collapse,
  Box,
  Typography,
  Button,
  IconButton,
  Chip,
  Menu,
  MenuItem,
} from '@mui/material'
import { ExpandMore as ExpandMoreIcon, MoreVert as MoreVertIcon } from '@mui/icons-material'
import { formatDate } from '@/utils/formatters'
import type { ItemHospedaje } from '@/types/items'

interface AccommodationItemProps {
  item: ItemHospedaje
  onEdit: (item: ItemHospedaje) => void
  onDelete: (item: ItemHospedaje) => void
}

export function AccommodationItem({ item, onEdit, onDelete }: AccommodationItemProps) {
  const [expanded, setExpanded] = useState(false)
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    setAnchorEl(e.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleEdit = () => {
    handleMenuClose()
    onEdit(item)
  }

  const handleDelete = () => {
    handleMenuClose()
    onDelete(item)
  }

  const tipoLabel = item.tipo.charAt(0).toUpperCase() + item.tipo.slice(1)

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent
        onClick={() => setExpanded(!expanded)}
        sx={{ cursor: 'pointer', pb: 1, '&:last-child': { pb: 1 } }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                🏨 {tipoLabel}
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ fontWeight: 500, mb: 0.5 }}>
              {item.nombre}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 0.5 }}>
              <Typography variant="caption">
                {formatDate(item.fecha_checkin)}
              </Typography>
              <Typography variant="caption">
                {formatDate(item.fecha_checkout)}
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
              {item.dirección}
            </Typography>
            {item.teléfono && (
              <Button
                size="small"
                href={`tel:${item.teléfono}`}
                sx={{ mr: 1, textTransform: 'none' }}
              >
                📞 {item.teléfono}
              </Button>
            )}
            {item.email && (
              <Button
                size="small"
                href={`mailto:${item.email}`}
                sx={{ textTransform: 'none' }}
              >
                ✉️ {item.email}
              </Button>
            )}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <IconButton size="small" onClick={handleMenuOpen}>
              <MoreVertIcon fontSize="small" />
            </IconButton>
            <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={handleMenuClose}>
              <MenuItem onClick={handleEdit}>Editar</MenuItem>
              <MenuItem onClick={handleDelete}>Eliminar</MenuItem>
            </Menu>

            <IconButton
              size="small"
              onClick={() => setExpanded(!expanded)}
              sx={{
                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              <ExpandMoreIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </CardContent>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent sx={{ borderTop: '1px solid #e0e0e0', pt: 2 }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Reserva
            </Typography>
            <Typography variant="body2">
              <strong>Número:</strong> {item.numero_reserva}
            </Typography>
            {item.datos_reserva.reservado_por_agencia && item.datos_reserva.nombre_agencia && (
              <Typography variant="body2">
                <strong>Agencia:</strong> {item.datos_reserva.nombre_agencia}
              </Typography>
            )}
            {item.datos_reserva.codigos_reserva.length > 0 && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="caption">Códigos:</Typography>
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.5 }}>
                  {item.datos_reserva.codigos_reserva.map((codigo) => (
                    <Chip key={codigo} label={codigo} size="small" />
                  ))}
                </Box>
              </Box>
            )}
            {item.datos_reserva.url_reserva && (
              <Button
                size="small"
                href={item.datos_reserva.url_reserva}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ mt: 1 }}
              >
                Ver reserva
              </Button>
            )}
            {item.datos_reserva.comentarios && (
              <Typography variant="body2" sx={{ mt: 1, whiteSpace: 'pre-wrap' }}>
                <strong>Notas:</strong> {item.datos_reserva.comentarios}
              </Typography>
            )}
          </Box>
        </CardContent>
      </Collapse>
    </Card>
  )
}
