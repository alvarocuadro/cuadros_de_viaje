import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Box, Container, Button, Typography, Alert, CircularProgress } from '@mui/material'
import { resendSignupConfirmation } from '@/services/authService'

interface LocationState {
  email?: string
}

export function VerifyEmailPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const email = (location.state as LocationState)?.email || ''

  const [resending, setResending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resendSent, setResendSent] = useState(false)

  if (!email) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Alert severity="error">
            Email no especificado. Intenta registrarte de nuevo.
          </Alert>
          <Button
            variant="outlined"
            onClick={() => navigate('/register')}
            sx={{ mt: 2 }}
          >
            Volver al registro
          </Button>
        </Box>
      </Container>
    )
  }

  const handleResend = async () => {
    setError(null)
    setResending(true)
    const result = await resendSignupConfirmation(email)
    setResending(false)

    if (result.success) {
      setResendSent(true)
      setTimeout(() => setResendSent(false), 3000)
    } else {
      setError(result.error?.message || 'Error al reenviar')
    }
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h5" sx={{ mb: 1 }}>
          Verificá tu email
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
          Te enviamos un enlace de confirmación a <strong>{email}</strong>. Abrilo para
          terminar el registro.
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {resendSent && <Alert severity="success" sx={{ mb: 2 }}>Enlace reenviado</Alert>}

        <Button
          fullWidth
          variant="contained"
          onClick={handleResend}
          disabled={resending}
        >
          {resending ? <CircularProgress size={24} /> : '¿No recibiste el email? Reenviar enlace'}
        </Button>
      </Box>
    </Container>
  )
}
