import { useNavigate } from 'react-router-dom'
import { Card, CardContent, Typography, Box, Chip, IconButton, Menu, MenuItem } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { useState } from 'react'
import type { ViajeConItems } from '@/types/trips'
import { formatDate } from '@/utils/formatters'

interface TripCardProps {
  viaje: ViajeConItems
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

const estadoColors: Record<string, 'default' | 'success' | 'warning' | 'error'> = {
  pasado: 'default',
  actual: 'success',
  futuro: 'warning',
}

const estadoLabels: Record<string, string> = {
  pasado: 'Pasado',
  actual: 'Actual',
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
      sx={{
        mb: 2,
        cursor: 'pointer',
        transition: 'all 0.2s',
        '&:hover': {
          boxShadow: 3,
          transform: 'translateY(-2px)',
        },
      }}
      onClick={handleCardClick}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
          <Typography variant="h6" sx={{ flex: 1, wordBreak: 'break-word' }}>
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

        <Box sx={{ mb: 2 }}>
          {viaje.destinos.map((destino, i) => (
            <Chip key={i} label={destino} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
          ))}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="textSecondary">
            {viaje.fecha_inicio && viaje.fecha_fin
              ? `${formatDate(viaje.fecha_inicio)} → ${formatDate(viaje.fecha_fin)}`
              : 'Sin fechas'}
          </Typography>
          <Chip
            label={estadoLabels[viaje.estado]}
            size="small"
            color={estadoColors[viaje.estado]}
            variant="filled"
          />
        </Box>
      </CardContent>

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
