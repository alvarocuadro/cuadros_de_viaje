import React from 'react'
import { Card as MuiCard, CardProps as MuiCardProps } from '@mui/material'
import { styled } from '@mui/material/styles'

interface CardProps extends MuiCardProps {
  interactive?: boolean
}

const StyledCard = styled(MuiCard)<{ interactive?: boolean }>(({ theme, interactive }) => ({
  backgroundColor: theme.palette.background.paper,
  border: '1px solid var(--color-border-subtle)',
  borderRadius: '16px',
  boxShadow: 'var(--shadow-sm)',

  ...(interactive && {
    cursor: 'pointer',
    transition: 'box-shadow var(--transition-duration-base), transform var(--transition-duration-fast), border-color var(--transition-duration-base)',

    '&:hover': {
      boxShadow: 'var(--shadow-md)',
      borderColor: 'var(--color-border)',
    },

    '&:active': {
      transform: 'scale(0.992)',
    },
  }),
}))

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ interactive = false, ...props }, ref) => <StyledCard ref={ref} interactive={interactive} {...props} />,
)

Card.displayName = 'Card'
