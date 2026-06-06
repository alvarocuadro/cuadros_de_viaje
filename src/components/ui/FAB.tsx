import React from 'react'
import { Fab as MuiFab, FabProps as MuiFabProps, styled } from '@mui/material'
import { SvgIconProps } from '@mui/material'

interface FABProps extends Omit<MuiFabProps, 'children'> {
  icon: React.ComponentType<SvgIconProps>
}

const StyledFab = styled(MuiFab)(({ theme }) => ({
  position: 'fixed',
  right: '18px',
  bottom: 'calc(var(--layout-tabbar-height) + 16px)',
  width: '56px',
  height: '56px',
  borderRadius: 'var(--border-radius-pill)',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  boxShadow: 'var(--shadow-lg)',
  cursor: 'pointer',
  zIndex: 6,
  transition: 'transform var(--transition-duration-fast), background var(--transition-duration-fast)',

  '&:hover': {
    backgroundColor: '#186A8C',
  },

  '&:active': {
    transform: 'scale(0.94)',
    backgroundColor: '#14536E',
  },

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}))

export const FAB = React.forwardRef<HTMLButtonElement, FABProps>(({ icon: Icon, ...props }, ref) => (
  <StyledFab ref={ref} {...props}>
    <Icon />
  </StyledFab>
))

FAB.displayName = 'FAB'
