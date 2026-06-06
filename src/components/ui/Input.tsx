import React from 'react'
import { TextField, TextFieldProps } from '@mui/material'
import { styled } from '@mui/material/styles'

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    minHeight: '48px',
    borderRadius: '12px',
    fontSize: '15px',
    backgroundColor: theme.palette.background.paper,

    '& input::placeholder, & textarea::placeholder': {
      color: 'var(--color-fg-disabled)',
      opacity: 1,
    },

    '&:focus-within': {
      borderColor: 'var(--color-brand)',
      boxShadow: 'var(--color-focus-ring)',
    },

    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.primary.main,
    },

    '&.Mui-error .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.error.main,
    },

    '&.Mui-error:focus-within': {
      boxShadow: `0 0 0 3px var(--color-error-tint)`,
    },
  },

  '& .MuiFormHelperText-root': {
    fontSize: '12px',
    marginTop: '6px',

    '&.Mui-error': {
      color: theme.palette.error.main,
      fontWeight: 500,
    },
  },

  '& label': {
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--color-fg2)',
    marginBottom: '7px',

    '& .MuiFormLabel-asterisk': {
      color: theme.palette.error.main,
    },
  },
}))

interface InputProps extends Omit<TextFieldProps, 'size'> {
  size?: 'small' | 'medium'
}

export const Input = React.forwardRef<HTMLDivElement, InputProps>(({ size = 'medium', ...props }, ref) => (
  <StyledTextField ref={ref} size={size} {...props} />
))

Input.displayName = 'Input'
