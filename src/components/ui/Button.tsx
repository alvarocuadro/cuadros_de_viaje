import React from 'react'
import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material'
import { styled } from '@mui/material/styles'

interface ButtonProps extends Omit<MuiButtonProps, 'variant'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'danger-soft'
}

const StyledButton = styled(MuiButton)<{ customVariant?: string }>(({ theme, customVariant }) => {
  const baseStyles = {
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '15px',
    borderRadius: '999px',
    minHeight: '44px',
    padding: '12px 18px',
    transition: 'background 120ms, transform 120ms, box-shadow 120ms, border-color 120ms',
    '&:active': {
      transform: 'scale(0.99)',
    },
  }

  switch (customVariant) {
    case 'primary':
      return {
        ...baseStyles,
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        '&:hover': {
          backgroundColor: '#186A8C',
        },
        '&:active': {
          backgroundColor: '#14536E',
          ...baseStyles['&:active'],
        },
        '&:disabled': {
          backgroundColor: 'var(--color-surface-sunken)',
          color: 'var(--color-fg-disabled)',
        },
      }

    case 'secondary':
      return {
        ...baseStyles,
        backgroundColor: theme.palette.background.paper,
        color: '#186A8C',
        border: '1px solid var(--color-border)',
        '&:hover': {
          borderColor: 'var(--color-border-strong)',
          backgroundColor: 'var(--color-surface-sunken)',
        },
      }

    case 'ghost':
      return {
        ...baseStyles,
        backgroundColor: 'transparent',
        color: '#186A8C',
        padding: '10px 14px',
        minHeight: 'auto',
        '&:hover': {
          backgroundColor: 'var(--color-brand-tint)',
        },
      }

    case 'danger':
      return {
        ...baseStyles,
        backgroundColor: theme.palette.error.main,
        color: theme.palette.error.contrastText,
        '&:hover': {
          backgroundColor: '#B91C1C',
        },
      }

    case 'danger-soft':
      return {
        ...baseStyles,
        backgroundColor: 'var(--color-error-tint)',
        color: '#B91C1C',
        '&:hover': {
          backgroundColor: 'color-mix(in srgb, var(--color-error-tint) 70%, var(--color-error) 14%)',
        },
      }

    default:
      return baseStyles
  }
})

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', ...props }, ref) => (
    <StyledButton ref={ref} {...props} customVariant={variant as any} />
  ),
)

Button.displayName = 'Button'
