import React from 'react'
import { Box, styled } from '@mui/material'

type BadgeVariant = 'futuro' | 'actual' | 'pasado'

interface BadgeProps {
  variant: BadgeVariant
  showDot?: boolean
  children: React.ReactNode
}

const BadgeStyles: Record<BadgeVariant, { bg: string; color: string; dotColor: string }> = {
  futuro: {
    bg: 'var(--color-futuro-tint)',
    color: 'var(--color-futuro-strong)',
    dotColor: 'var(--color-futuro)',
  },
  actual: {
    bg: 'var(--color-actual-tint)',
    color: 'var(--color-actual-strong)',
    dotColor: 'var(--color-actual)',
  },
  pasado: {
    bg: 'var(--color-pasado-tint)',
    color: 'var(--color-pasado-strong)',
    dotColor: 'var(--color-pasado)',
  },
}

const StyledBadge = styled(Box)<{ variant: BadgeVariant }>(({ variant }) => {
  const style = BadgeStyles[variant]
  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '5px 11px',
    borderRadius: 'var(--border-radius-pill)',
    fontSize: '12.5px',
    fontWeight: 600,
    whiteSpace: 'nowrap',
    backgroundColor: style.bg,
    color: style.color,
  }
})

const Dot = styled(Box)<{ color: string }>(({ color }) => ({
  width: '7px',
  height: '7px',
  borderRadius: '50%',
  backgroundColor: color,
  flexShrink: 0,
}))

export const Badge: React.FC<BadgeProps> = ({ variant, showDot = true, children }) => {
  const style = BadgeStyles[variant]

  return (
    <StyledBadge variant={variant}>
      {showDot && <Dot color={style.dotColor} />}
      {children}
    </StyledBadge>
  )
}
