import { useNavigate } from 'react-router-dom'
import { Typography, Box, IconButton, Menu, MenuItem } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { useState } from 'react'
import type { ViajeConItems } from '@/types/trips'
import { formatDate } from '@/utils/formatters'
import { Card, Badge } from '@/components/ui'

interface TripCardProps {
  viaje: ViajeConItems
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

const badgeVariants: Record<string, 'futuro' | 'actual' | 'pasado'> = {
  pasado: 'pasado',
  actual: 'actual',
  futuro: 'futuro',
}

const estadoLabels: Record<string, string> = {
  pasado: 'Completado',
  actual: 'En curso',
  futuro: 'Próximo',
}

export function TripCard({ viaje, onEdit, onDelete }: TripCardProps) {
  const navigate = useNavigate()
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
    onEdit?.(viaje.id)
  }

  const handleDelete = () => {
    handleMenuClose()
    onDelete?.(viaje.id)
  }

  const handleCardClick = () => {
    navigate(`/trips/${viaje.id}`)
  }

  return (
    <Card
      interactive
      onClick={handleCardClick}
      sx={{ mb: 2 }}
    >
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
          <Typography variant="h6" sx={{ flex: 1, wordBreak: 'break-word', fontWeight: 700 }}>
            {viaje.nombre}
          </Typography>
          <IconButton
            size="small"
            onClick={handleMenuOpen}
            sx={{ ml: 1 }}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Box>

        <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {viaje.destinos.map((destino, i) => (
            <Box key={i} sx={{
              display: 'inline-block',
              px: 1.5,
              py: 0.5,
              borderRadius: 'var(--border-radius-pill)',
              backgroundColor: 'var(--color-surface-sunken)',
              fontSize: '12.5px',
              color: 'var(--color-fg2)',
              border: '1px solid var(--color-border-subtle)',
            }}>
              {destino}
            </Box>
          ))}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {viaje.fecha_inicio && viaje.fecha_fin
              ? `${formatDate(viaje.fecha_inicio)} → ${formatDate(viaje.fecha_fin)}`
              : 'Sin fechas'}
          </Typography>
          <Badge
            variant={badgeVariants[viaje.estado] || 'futuro'}
            showDot
          >
            {estadoLabels[viaje.estado]}
          </Badge>
        </Box>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        onClick={(e) => e.stopPropagation()}
      >
        <MenuItem onClick={handleEdit}>Editar</MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          Eliminar
        </MenuItem>
      </Menu>
    </Card>
  )
}
