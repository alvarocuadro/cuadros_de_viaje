import React from 'react'
import { Chip as MuiChip, ChipProps as MuiChipProps, styled } from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'

interface ChipProps extends Omit<MuiChipProps, 'variant'> {
  removable?: boolean
  mono?: boolean
}

const StyledChip = styled(MuiChip)<{ mono?: boolean }>(({ mono }) => ({
  height: '32px',
  borderRadius: '999px',
  backgroundColor: 'var(--color-surface-sunken)',
  color: 'var(--color-fg2)',
  border: '1px solid var(--color-border-subtle)',
  fontSize: '12.5px',
  fontWeight: 500,

  ...(mono && {
    fontFamily: "var(--typography-font-family-mono)",
    fontWeight: 600,
    color: 'var(--color-fg1)',
  }),

  '& .MuiChip-deleteIcon': {
    color: 'var(--color-fg3)',
    margin: 0,
    padding: '2px',
    borderRadius: '50%',
    cursor: 'pointer',

    '&:hover': {
      color: 'var(--color-error)',
      backgroundColor: 'var(--color-error-tint)',
    },
  },
}))

export const Chip = React.forwardRef<HTMLDivElement, ChipProps>(
  ({ removable, mono, onDelete, ...props }, ref) => (
    <StyledChip
      ref={ref}
      mono={mono}
      {...props}
      onDelete={removable ? onDelete : undefined}
      deleteIcon={removable ? <CloseIcon sx={{ fontSize: '16px !important' }} /> : undefined}
    />
  ),
)

Chip.displayName = 'Chip'
