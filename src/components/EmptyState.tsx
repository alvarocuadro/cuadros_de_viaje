import { Box, Typography, Button } from '@mui/material'

interface EmptyStateProps {
  icon?: string
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ icon = '✈️', title, description, action }: EmptyStateProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 6,
        px: 2,
        textAlign: 'center',
      }}
    >
      <Typography variant="h3" sx={{ mb: 1 }}>
        {icon}
      </Typography>
      <Typography variant="h6" sx={{ mb: 1 }}>
        {title}
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 3, maxWidth: 300 }}>
        {description}
      </Typography>
      {action && (
        <Button variant="contained" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </Box>
  )
}
