import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Alert, Link, CircularProgress } from '@mui/material'
import { Input, Button } from '@/components/ui'
import { Logo } from '@/components/Logo'
import { requestMagicLink } from '@/services/authService'

export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email) {
      setError('Ingresá tu email')
      return
    }

    setLoading(true)
    const result = await requestMagicLink(email)
    setLoading(false)

    if (result.success) {
      setSent(true)
    } else {
      setError(result.error?.message || 'Error al enviar el enlace')
    }
  }

  if (sent) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
            ✓ Revisá tu correo
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
            Te enviamos un enlace de acceso a <strong>{email}</strong>. Abrilo para ingresar.
          </Typography>
          <Button
            variant="secondary"
            onClick={() => {
              setSent(false)
              setEmail('')
            }}
          >
            Usar otro email
          </Button>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Logo width={40} height={40} style={{ color: 'var(--color-brand)' }} />
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Acceder
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
          Ingresá tu email para recibir un enlace de acceso
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            fullWidth
            sx={{ mb: 3 }}
          />
          <Button
            variant="primary"
            disabled={loading || !email}
            sx={{ mb: 3 }}
            onClick={handleSubmit}
          >
            {loading ? <CircularProgress size={24} /> : 'Enviar enlace'}
          </Button>
        </Box>

        <Typography variant="body2" sx={{ textAlign: 'center' }}>
          ¿Sin cuenta?{' '}
          <Link
            component="button"
            variant="body2"
            onClick={(e) => {
              e.preventDefault()
              navigate('/register')
            }}
          >
            Registrate aquí
          </Link>
        </Typography>
      </Box>
    </Container>
  )
}
