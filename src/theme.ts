import { createTheme } from '@mui/material/styles'

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      light: '#74B5D4',
      main: '#1E7FA8',
      dark: '#14536E',
      contrastText: '#FFFFFF',
    },
    secondary: {
      light: '#82C8C6',
      main: '#2FA39E',
      dark: '#237E7A',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#16A34A',
      dark: '#128040',
      light: '#E7F6EC',
    },
    error: {
      main: '#DC2626',
      dark: '#B91C1C',
      light: '#FCEBEA',
    },
    warning: {
      main: '#D97706',
      dark: '#B45309',
      light: '#FCEFD9',
    },
    info: {
      main: '#1E7FA8',
      light: '#ECF4F9',
    },
    background: {
      default: '#F5F7FA',
      paper: '#FFFFFF',
    },
    divider: '#E6EBF1',
    text: {
      primary: '#102A40',
      secondary: '#45586A',
      disabled: '#AEB9C4',
    },
  },
  typography: {
    fontFamily: "'Hanken Grotesk', system-ui, -apple-system, 'Segoe UI', sans-serif",
    h1: {
      fontSize: '24px',
      fontWeight: 700,
      lineHeight: '28px',
      letterSpacing: '-0.015em',
    },
    h2: {
      fontSize: '20px',
      fontWeight: 600,
      lineHeight: '25px',
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '17px',
      fontWeight: 600,
      lineHeight: '22px',
      letterSpacing: '-0.005em',
    },
    h4: {
      fontSize: '16px',
      fontWeight: 600,
      lineHeight: '23px',
    },
    body1: {
      fontSize: '16px',
      fontWeight: 400,
      lineHeight: '23px',
    },
    body2: {
      fontSize: '14px',
      fontWeight: 400,
      lineHeight: '20px',
    },
    caption: {
      fontSize: '13px',
      fontWeight: 400,
      lineHeight: '18px',
      letterSpacing: '0.005em',
    },
    overline: {
      fontSize: '11px',
      fontWeight: 600,
      lineHeight: '14px',
      letterSpacing: '0.07em',
      textTransform: 'uppercase',
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0 1px 2px rgba(14, 28, 40, 0.05)',
    '0 1px 3px rgba(14, 28, 40, 0.07), 0 1px 2px rgba(14, 28, 40, 0.04)',
    '0 4px 12px rgba(14, 28, 40, 0.09), 0 2px 4px rgba(14, 28, 40, 0.05)',
    '0 12px 28px rgba(14, 28, 40, 0.13), 0 4px 8px rgba(14, 28, 40, 0.06)',
    ...Array(20).fill(''),
  ] as any,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '15px',
          borderRadius: '999px',
          minHeight: '44px',
          padding: '12px 18px',
          transition: 'background 120ms, transform 120ms, box-shadow 120ms',
          '&:active': {
            transform: 'scale(0.99)',
          },
        },
        sizeLarge: {
          minHeight: '44px',
          fontSize: '15px',
        },
        sizeSmall: {
          minHeight: '40px',
          fontSize: '14px',
          padding: '9px 14px',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            minHeight: '48px',
            borderRadius: '12px',
            fontSize: '15px',
            '& input::placeholder': {
              color: 'var(--color-fg-disabled)',
              opacity: 1,
            },
            '&.Mui-focused fieldset': {
              borderColor: 'var(--color-brand)',
              borderWidth: '2px',
            },
            '&.Mui-error fieldset': {
              borderColor: 'var(--color-error)',
            },
          },
          '& .MuiFormHelperText-root': {
            fontSize: '12px',
            marginTop: '6px',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border-subtle)',
          boxShadow: 'var(--shadow-sm)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          height: '32px',
          borderRadius: '999px',
          backgroundColor: 'var(--color-surface-sunken)',
          color: 'var(--color-fg2)',
          border: '1px solid var(--color-border-subtle)',
          fontSize: '12.5px',
          fontWeight: 500,
        },
      },
    },
  },
})

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      light: '#5FB6DC',
      main: '#45A6D2',
      dark: '#2E8DBA',
      contrastText: '#06121A',
    },
    secondary: {
      light: '#6FD0CB',
      main: '#4CBDB7',
      dark: '#3A9B94',
      contrastText: '#06121A',
    },
    success: {
      main: '#34C77B',
      light: '#102A1E',
    },
    error: {
      main: '#F26B6B',
      light: '#311517',
    },
    warning: {
      main: '#F0A93B',
      light: '#2E2008',
    },
    info: {
      main: '#45A6D2',
      light: '#0E3247',
    },
    background: {
      default: '#0B1620',
      paper: '#12202C',
    },
    divider: '#1E2E3B',
    text: {
      primary: '#EAF1F6',
      secondary: '#AEBDC8',
      disabled: '#54646F',
    },
  },
  typography: {
    fontFamily: "'Hanken Grotesk', system-ui, -apple-system, 'Segoe UI', sans-serif",
    h1: {
      fontSize: '24px',
      fontWeight: 700,
      lineHeight: '28px',
      letterSpacing: '-0.015em',
    },
    h2: {
      fontSize: '20px',
      fontWeight: 600,
      lineHeight: '25px',
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '17px',
      fontWeight: 600,
      lineHeight: '22px',
      letterSpacing: '-0.005em',
    },
    body1: {
      fontSize: '16px',
      fontWeight: 400,
      lineHeight: '23px',
    },
    body2: {
      fontSize: '14px',
      fontWeight: 400,
      lineHeight: '20px',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
})

export const theme = lightTheme
