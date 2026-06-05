import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material'
import { verifyEmail, resendOtp } from '@/services/authService'

interface LocationState {
  email?: string
}

export function VerifyEmailPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const email = (location.state as LocationState)?.email || ''

  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!code || code.length !== 6) {
      setError('El código debe tener 6 dígitos')
      return
    }

    setLoading(true)
    const result = await verifyEmail(email, code)
    setLoading(false)

    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.error?.message || 'Código inválido')
    }
  }

  const handleResend = async () => {
    setResending(true)
    const result = await resendOtp(email)
    setResending(false)

    if (result.success) {
      setResendSent(true)
      setCode('')
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
          Te enviamos un código de 6 dígitos a <strong>{email}</strong>
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {resendSent && <Alert severity="success" sx={{ mb: 2 }}>Código reenviado</Alert>}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Código de verificación (6 dígitos)"
            value={code}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '').slice(0, 6)
              setCode(val)
            }}
            inputProps={{ inputMode: 'numeric', maxLength: 6 }}
            disabled={loading}
            autoFocus
            sx={{ mb: 2 }}
          />
          <Button
            fullWidth
            variant="contained"
            type="submit"
            disabled={loading || code.length !== 6}
            sx={{ mb: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Verificar'}
          </Button>
        </Box>

        <Button
          fullWidth
          variant="text"
          onClick={handleResend}
          disabled={resending || loading}
        >
          {resending ? 'Reenviando...' : '¿No recibiste el código? Reenviar'}
        </Button>
      </Box>
    </Container>
  )
}
