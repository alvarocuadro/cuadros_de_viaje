import { useState } from 'react'
import { Box, Collapse, Button, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import type { ViajeConItems } from '@/types/trips'
import { TripCard } from './TripCard'
import { EmptyState } from './EmptyState'

interface TripGroupProps {
  title: string
  viajes: ViajeConItems[]
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  defaultExpanded?: boolean
  emptyIcon?: string
}

export function TripGroup({
  title,
  viajes,
  onEdit,
  onDelete,
  defaultExpanded = true,
  emptyIcon,
}: TripGroupProps) {
  const [expanded, setExpanded] = useState(defaultExpanded)

  const emptyMessages: Record<string, { title: string; description: string }> = {
    Actuales: {
      title: 'Sin viajes actuales',
      description: 'No tenés ningún viaje en curso',
    },
    Próximos: {
      title: 'Sin viajes próximos',
      description: 'Creá un nuevo viaje para planificar tu próxima aventura',
    },
    Pasados: {
      title: 'Sin historial',
      description: 'Los viajes pasados aparecerán aquí',
    },
  }

  const emptyState = emptyMessages[title] || {
    title: 'Sin viajes',
    description: 'No hay viajes en esta categoría',
  }

  if (viajes.length === 0) {
    return (
      <Box sx={{ mb: 2 }}>
        <EmptyState
          icon={emptyIcon}
          title={emptyState.title}
          description={emptyState.description}
        />
      </Box>
    )
  }

  return (
    <Box sx={{ mb: 3 }}>
      <Button
        fullWidth
        onClick={() => setExpanded(!expanded)}
        sx={{
          justifyContent: 'space-between',
          textAlign: 'left',
          py: 1.5,
          px: 2,
          bgcolor: 'action.hover',
          borderRadius: 1,
          mb: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h6" sx={{ m: 0 }}>
            {title}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            ({viajes.length})
          </Typography>
        </Box>
        <ExpandMoreIcon
          sx={{
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s',
          }}
        />
      </Button>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        {viajes.map((viaje) => (
          <TripCard
            key={viaje.id}
            viaje={viaje}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </Collapse>
    </Box>
  )
}
