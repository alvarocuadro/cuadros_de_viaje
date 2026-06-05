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
import { formatDate, formatTransportType } from '@/utils/formatters'
import type { ItemTransporte } from '@/types/items'

interface TransportItemProps {
  item: ItemTransporte
  onEdit: (item: ItemTransporte) => void
  onDelete: (item: ItemTransporte) => void
}

export function TransportItem({ item, onEdit, onDelete }: TransportItemProps) {
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
                {formatTransportType(item.tipo)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {item.compañia}
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ fontWeight: 500, mb: 0.5 }}>
              {item.origen} → {item.destino}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 0.5 }}>
              <Typography variant="caption">
                {formatDate(item.fecha_salida)} {item.hora_salida}
              </Typography>
              <Typography variant="caption">
                {formatDate(item.fecha_llegada)} {item.hora_llegada}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {item.numero_servicio && (
                <Chip label={`Serv: ${item.numero_servicio}`} size="small" variant="outlined" />
              )}
              {item.asiento && (
                <Chip label={`Asiento: ${item.asiento}`} size="small" variant="outlined" />
              )}
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <IconButton
              size="small"
              onClick={handleMenuOpen}
              sx={{ visibility: anchorEl ? 'visible' : 'visible' }}
            >
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
