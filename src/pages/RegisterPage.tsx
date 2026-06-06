import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Alert, Link, CircularProgress, MenuItem } from '@mui/material'
import { Input, Button } from '@/components/ui'
import { Logo } from '@/components/Logo'
import { register } from '@/services/authService'

const COUNTRIES = ['Argentina', 'España', 'México', 'Colombia', 'Chile', 'Perú', 'Brasil', 'Otro']

export function RegisterPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    país: '',
    email: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido'
    if (!formData.apellido.trim()) newErrors.apellido = 'El apellido es requerido'
    if (!formData.país) newErrors.país = 'El país es requerido'
    if (!formData.email) {
      newErrors.email = 'El email es requerido'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!validateForm()) {
      return
    }

    setLoading(true)
    const result = await register(formData.nombre, formData.apellido, formData.país, formData.email)
    setLoading(false)

    if (result.success) {
      navigate('/verify-email', { state: { email: formData.email } })
    } else {
      if (result.error?.message.includes('unique')) {
        setError('Este email ya está registrado. Intentá acceder con magic link.')
      } else {
        setError(result.error?.message || 'Error al registrarse')
      }
    }
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Logo width={40} height={40} style={{ color: 'var(--color-brand)' }} />
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Registrarse
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
          Completa tus datos para registrarte
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit}>
          <Input
            label="Nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            error={!!errors.nombre}
            helperText={errors.nombre}
            disabled={loading}
            fullWidth
            sx={{ mb: 3 }}
          />
          <Input
            label="Apellido"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            error={!!errors.apellido}
            helperText={errors.apellido}
            disabled={loading}
            fullWidth
            sx={{ mb: 3 }}
          />
          <Input
            select
            label="País"
            name="país"
            value={formData.país}
            onChange={handleChange}
            error={!!errors.país}
            helperText={errors.país}
            disabled={loading}
            fullWidth
            sx={{ mb: 3 }}
          >
            {COUNTRIES.map((country) => (
              <MenuItem key={country} value={country}>
                {country}
              </MenuItem>
            ))}
          </Input>
          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            disabled={loading}
            fullWidth
            sx={{ mb: 3 }}
          />
          <Button
            variant="primary"
            type="submit"
            disabled={loading}
            sx={{ mb: 3, width: '100%' }}
          >
            {loading ? <CircularProgress size={24} /> : 'Registrarse'}
          </Button>
        </Box>

        <Typography variant="body2" sx={{ textAlign: 'center' }}>
          ¿Ya tenés cuenta?{' '}
          <Link
            component="button"
            variant="body2"
            onClick={(e) => {
              e.preventDefault()
              navigate('/login')
            }}
          >
            Acceder aquí
          </Link>
        </Typography>
      </Box>
    </Container>
  )
}
