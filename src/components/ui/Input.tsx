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

    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.primary.main,
      borderWidth: '2px',
    },

    '&.Mui-error .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.error.main,
    },

    '&.Mui-error.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderWidth: '2px',
    },
  },

  '& .MuiInputBase-input': {
    paddingLeft: '20px !important',
    paddingRight: '20px !important',
  },

  '& .MuiOutlinedInput-input': {
    paddingTop: '12px',
    paddingBottom: '12px',
  },

  '& .MuiInputBase-inputSizeSmall': {
    paddingTop: '10px',
    paddingBottom: '10px',
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
    transform: 'translate(20px, 16px) scale(1)',
    transformOrigin: 'top left',
    transition: 'all 200ms cubic-bezier(0, 0, 0.2, 1)',

    '&.MuiInputBase-adornedStart': {
      marginLeft: '-5px',
    },

    '& .MuiFormLabel-asterisk': {
      color: theme.palette.error.main,
    },
  },

  '& label.Mui-focused, & label.MuiFormLabel-filled, & label.MuiInputLabel-shrink': {
    transform: 'translate(20px, -9px) scale(0.75)',
  },

  '& .MuiOutlinedInput-notchedOutline legend span': {
    paddingLeft: '6px',
    paddingRight: '6px',
  },
}))

interface InputProps extends Omit<TextFieldProps, 'size'> {
  size?: 'small' | 'medium'
}

export const Input = React.forwardRef<HTMLDivElement, InputProps>(
  ({ size = 'medium', type, ...props }, ref) => {
    // Para inputs de tipo date/time, no usar placeholder
    const isDateTimeInput = type === 'date' || type === 'time' || type === 'datetime-local'

    return (
      <StyledTextField
        ref={ref}
        type={type}
        size={size}
        {...props}
        {...(isDateTimeInput && { placeholder: undefined })}
        InputLabelProps={{
          shrink: true,
          ...(props.InputLabelProps || {}),
        }}
      />
    )
  },
)

Input.displayName = 'Input'
