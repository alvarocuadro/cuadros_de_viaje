// design/theme.ts
// Cuadros de Viaje — MUI v5 Theme
// Fuente: design/tokens.json + design/variables.css
// Generado: 2026-06-05
//
// Fonts: import en index.html o main.tsx:
// @import url('https://fonts.googleapis.com/css2?family=Hanken+Grotesk:ital,wght@0,400..800;1,400..600&family=Spline+Sans+Mono:wght@400..600&display=swap');

import { createTheme } from '@mui/material/styles';
import type { Shadows } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    tripStatus: {
      futuro: string;
      futuroStrong: string;
      futuroTint: string;
      actual: string;
      actualStrong: string;
      actualTint: string;
      pasado: string;
      pasadoStrong: string;
      pasadoTint: string;
    };
    navy: { main: string; 700: string; 900: string };
    teal: { main: string; strong: string; light: string; tint: string };
    canvas: string;
    surfaceSunken: string;
  }
  interface PaletteOptions {
    tripStatus?: {
      futuro?: string;
      futuroStrong?: string;
      futuroTint?: string;
      actual?: string;
      actualStrong?: string;
      actualTint?: string;
      pasado?: string;
      pasadoStrong?: string;
      pasadoTint?: string;
    };
    navy?: { main?: string; 700?: string; 900?: string };
    teal?: { main?: string; strong?: string; light?: string; tint?: string };
    canvas?: string;
    surfaceSunken?: string;
  }
}

const FONT_SANS = "'Hanken Grotesk', system-ui, -apple-system, 'Segoe UI', sans-serif";
const FONT_MONO = "'Spline Sans Mono', ui-monospace, 'SF Mono', Menlo, monospace";

export const theme = createTheme({
  palette: {
    primary: {
      light:        '#3E96C0',   // brand-400
      main:         '#1E7FA8',   // brand-600 — PRIMARY
      dark:         '#186A8C',   // brand-700 hover
      contrastText: '#FFFFFF',
    },
    secondary: {
      light:        '#82C8C6',   // teal-light
      main:         '#2FA39E',   // teal
      dark:         '#237E7A',   // teal-strong
      contrastText: '#FFFFFF',
    },
    success: {
      main:         '#16A34A',
      dark:         '#128040',
      contrastText: '#FFFFFF',
    },
    error: {
      main:         '#DC2626',
      dark:         '#B91C1C',
      contrastText: '#FFFFFF',
    },
    warning: {
      main:         '#D97706',
      dark:         '#B45309',
      contrastText: '#3A2606',
    },
    info: {
      main:         '#1E7FA8',   // same as brand/actual
      contrastText: '#FFFFFF',
    },
    text: {
      primary:   '#102A40',    // fg1
      secondary: '#45586A',    // fg2
      disabled:  '#AEB9C4',    // fg-disabled
    },
    background: {
      default: '#F5F7FA',   // canvas
      paper:   '#FFFFFF',   // surface
    },
    divider: '#E6EBF1',        // border-subtle

    // Custom semantic colors
    tripStatus: {
      futuro:       '#2FA39E',
      futuroStrong: '#237E7A',
      futuroTint:   '#E3F4F2',
      actual:       '#1E7FA8',
      actualStrong: '#14536E',
      actualTint:   '#ECF4F9',
      pasado:       '#64748B',
      pasadoStrong: '#51607A',
      pasadoTint:   '#EEF2F6',
    },
    navy: {
      main: '#123A5C',
      700:  '#1A4C73',
      900:  '#0E2B44',
    },
    teal: {
      main:   '#2FA39E',
      strong: '#237E7A',
      light:  '#82C8C6',
      tint:   '#E3F4F2',
    },
    canvas:        '#F5F7FA',
    surfaceSunken: '#EEF2F6',
  },

  typography: {
    fontFamily: FONT_SANS,

    // Type scale (mobile-first px values)
    h1: { fontSize: '24px', lineHeight: '28px', letterSpacing: '-0.015em', fontWeight: 700 },
    h2: { fontSize: '20px', lineHeight: '25px', letterSpacing: '-0.01em',  fontWeight: 600 },
    h3: { fontSize: '17px', lineHeight: '22px', letterSpacing: '-0.005em', fontWeight: 600 },
    h4: { fontSize: '32px', lineHeight: '36px', letterSpacing: '-0.02em',  fontWeight: 700 },  // display
    h5: { fontSize: '20px', lineHeight: '25px', letterSpacing: '-0.01em',  fontWeight: 600 },
    h6: { fontSize: '17px', lineHeight: '22px', letterSpacing: '-0.005em', fontWeight: 600 },

    body1: { fontSize: '16px', lineHeight: '23px', fontWeight: 400 },
    body2: { fontSize: '14px', lineHeight: '20px', fontWeight: 400 },

    subtitle1: { fontSize: '15px', lineHeight: '22px', fontWeight: 600 },
    subtitle2: { fontSize: '13px', lineHeight: '18px', fontWeight: 600 },

    caption: { fontSize: '13px', lineHeight: '18px', letterSpacing: '0.005em', fontWeight: 400 },
    overline: {
      fontSize: '11px', lineHeight: '14px', letterSpacing: '0.07em',
      fontWeight: 600, textTransform: 'uppercase',
    },

    button: { fontSize: '15px', fontWeight: 600, textTransform: 'none' },
  },

  // Spacing: 4px base (space-1=4px ≈ MUI factor 1)
  // MUI default: factor * 8px. We remap to 4px base.
  spacing: (factor: number) => `${4 * factor}px`,

  shape: {
    borderRadius: 8,   // --border-radius-sm (inputs use 12px overridden in components)
  },

  shadows: [
    'none',                                                                              // 0
    '0 1px 2px rgba(14, 28, 40, 0.05)',                                                  // 1 xs
    '0 1px 3px rgba(14, 28, 40, 0.07), 0 1px 2px rgba(14, 28, 40, 0.04)',               // 2 sm
    '0 4px 12px rgba(14, 28, 40, 0.09), 0 2px 4px rgba(14, 28, 40, 0.05)',              // 3 md
    '0 12px 28px rgba(14, 28, 40, 0.13), 0 4px 8px rgba(14, 28, 40, 0.06)',             // 4 lg
    '0 -8px 28px rgba(14, 28, 40, 0.14)',                                                // 5 sheet
    '0 30px 70px rgba(14, 28, 40, 0.34)',                                                // 6 phone frame
    // 7-24: repeat lg for unused MUI levels
    ...Array(18).fill('0 12px 28px rgba(14, 28, 40, 0.13), 0 4px 8px rgba(14, 28, 40, 0.06)'),
  ] as Shadows,

  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @import url('https://fonts.googleapis.com/css2?family=Hanken+Grotesk:ital,wght@0,400..800;1,400..600&family=Spline+Sans+Mono:wght@400..600&display=swap');
        * { box-sizing: border-box; }
        body { -webkit-font-smoothing: antialiased; }
        .font-mono { font-family: ${FONT_MONO}; }
      `,
    },

    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          fontFamily: FONT_SANS,
          fontSize: '15px',
          fontWeight: 600,
          borderRadius: '999px',
          minHeight: '44px',
          padding: '12px 18px',
          textTransform: 'none',
          transition: 'background 120ms, transform 120ms, box-shadow 120ms, border-color 120ms',
          '&:active': { transform: 'scale(0.99)' },
        },
        sizeSmall: { fontSize: '14px', padding: '9px 14px', minHeight: '40px' },
        contained: { color: '#FFFFFF' },
        containedPrimary: {
          '&:hover': { backgroundColor: '#186A8C' },
          '&:active': { backgroundColor: '#14536E' },
          '&.Mui-disabled': { backgroundColor: '#EEF2F6', color: '#AEB9C4' },
        },
        outlined: {
          borderColor: '#D6DEE7',
          color: '#186A8C',
          backgroundColor: '#FFFFFF',
          '&:hover': { borderColor: '#BCC8D4', backgroundColor: '#EEF2F6' },
        },
        text: {
          color: '#186A8C',
          padding: '10px 14px',
          width: 'auto',
          '&:hover': { backgroundColor: '#ECF4F9' },
        },
      },
    },

    MuiFab: {
      styleOverrides: {
        root: {
          width: 56, height: 56,
          boxShadow: '0 12px 28px rgba(14, 28, 40, 0.13), 0 4px 8px rgba(14, 28, 40, 0.06)',
          transition: 'transform 120ms, background-color 120ms',
          '&:active': { transform: 'scale(0.94)' },
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',   // --border-radius-lg
          border: '1px solid #E6EBF1',
          boxShadow: '0 1px 3px rgba(14, 28, 40, 0.07), 0 1px 2px rgba(14, 28, 40, 0.04)',
          backgroundColor: '#FFFFFF',
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '999px',
          fontSize: '12.5px',
          fontWeight: 500,
          backgroundColor: '#EEF2F6',
          color: '#45586A',
          border: '1px solid #E6EBF1',
          height: '28px',
        },
        deleteIcon: {
          color: '#7C8A98',
          '&:hover': { color: '#DC2626' },
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: '12px',   // --border-radius-md
          minHeight: '48px',
          fontSize: '15px',
          backgroundColor: '#FFFFFF',
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#1E7FA8',
            boxShadow: '0 0 0 3px rgba(30, 127, 168, 0.34)',
          },
          '&.Mui-error .MuiOutlinedInput-notchedOutline': {
            borderColor: '#DC2626',
          },
        },
        notchedOutline: { borderColor: '#D6DEE7' },
        input: { padding: '12px 13px', color: '#102A40' },
      },
    },

    MuiInputLabel: {
      styleOverrides: {
        root: { fontSize: '13px', fontWeight: 600, color: '#45586A' },
      },
    },

    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: '20px',   // --border-radius-xl
          padding: '22px 20px 18px',
          maxWidth: 320,
        },
      },
    },

    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          height: 64,
          borderTop: '1px solid #E6EBF1',
          backgroundColor: '#FFFFFF',
        },
      },
    },

    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          color: '#7C8A98',
          fontSize: '10.5px',
          fontWeight: 600,
          '&.Mui-selected': { color: '#186A8C' },
        },
        label: { fontSize: '10.5px !important', fontWeight: '600 !important' },
      },
    },

    MuiSwitch: {
      styleOverrides: {
        root: { width: 46, height: 28, padding: 0 },
        thumb: {
          width: 22, height: 22,
          boxShadow: '0 1px 3px rgba(14, 28, 40, 0.07), 0 1px 2px rgba(14, 28, 40, 0.04)',
        },
        track: {
          borderRadius: 999,
          backgroundColor: '#BCC8D4',
          opacity: '1 !important',
        },
        switchBase: {
          padding: 3,
          '&.Mui-checked': { transform: 'translateX(18px)' },
          '&.Mui-checked + .MuiSwitch-track': { backgroundColor: '#1E7FA8' },
        },
      },
    },

    MuiSnackbar: {
      defaultProps: {
        anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
      },
    },

    MuiSnackbarContent: {
      styleOverrides: {
        root: {
          backgroundColor: '#0E2B44',
          borderRadius: '999px',
          fontSize: '13.5px',
          fontWeight: 500,
          boxShadow: '0 12px 28px rgba(14, 28, 40, 0.13), 0 4px 8px rgba(14, 28, 40, 0.06)',
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          height: 56,
          backgroundColor: 'rgba(245, 247, 250, 0.82)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid #E6EBF1',
          boxShadow: 'none',
          color: '#102A40',
        },
      },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#0E2B44',
          fontSize: '13px',
          borderRadius: '8px',
        },
      },
    },
  },
});

export default theme;
