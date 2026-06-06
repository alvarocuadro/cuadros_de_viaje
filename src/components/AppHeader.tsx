import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppBar, Toolbar, Typography, Box, Avatar, Button, Menu, MenuItem, IconButton } from '@mui/material'
import { Brightness4, Brightness7 } from '@mui/icons-material'
import { useAuth } from '@/context/AuthContext'
import { useAppTheme } from '@/context/ThemeContext'
import { Logo } from '@/components/Logo'

export function AppHeader() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { mode, toggleTheme } = useAppTheme()
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = async () => {
    handleMenuClose()
    try {
      await logout()
      navigate('/login')
    } catch (err) {
      console.error('Error al cerrar sesión:', err)
    }
  }

  const getInitials = () => {
    if (!user) return '?'
    return `${user.nombre[0]}${user.apellido[0]}`.toUpperCase()
  }

  return (
    <AppBar position="static" sx={{ bgcolor: 'background.paper', color: 'text.primary', boxShadow: 1 }}>
      <Toolbar sx={{ gap: 1 }}>
        <Logo width={40} height={40} style={{ color: 'currentColor' }} />
        <Typography
          variant="h6"
          sx={{ flex: 1, cursor: 'pointer', fontWeight: 700, letterSpacing: '-0.01em' }}
          onClick={() => navigate('/')}
        >
          Cuadros de Viaje
        </Typography>

        <IconButton
          size="small"
          onClick={toggleTheme}
          title={`Cambiar a modo ${mode === 'light' ? 'oscuro' : 'claro'}`}
          sx={{ color: 'text.primary' }}
        >
          {mode === 'light' ? <Brightness4 /> : <Brightness7 />}
        </IconButton>

        {user ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user.nombre} {user.apellido}
            </Typography>
            <Avatar
              sx={{ cursor: 'pointer', bgcolor: 'primary.main', width: 36, height: 36 }}
              onClick={handleMenuOpen}
            >
              {getInitials()}
            </Avatar>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem disabled>
                <Typography variant="body2">{user.email}</Typography>
              </MenuItem>
              <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
            </Menu>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button color="inherit" onClick={() => navigate('/login')}>
              Acceder
            </Button>
            <Button variant="outlined" onClick={() => navigate('/register')}>
              Registrarse
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  )
}
