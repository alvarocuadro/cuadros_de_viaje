import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppBar, Toolbar, Typography, Box, Avatar, Button, Menu, MenuItem, IconButton } from '@mui/material'
import { Brightness4, Brightness7 } from '@mui/icons-material'
import { useAuth } from '@/context/AuthContext'
import { useAppTheme } from '@/context/ThemeContext'
import { Logo } from '@/components/Logo'
import { getUserInitials } from '@/utils/userInitials'

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

  return (
    <AppBar position="static" sx={{ bgcolor: 'background.paper', color: 'text.primary', boxShadow: 1 }}>
      <Toolbar sx={{ gap: { xs: 0.75, sm: 1.25 } }}>
        <Box
          aria-label="Ir al inicio"
          sx={{
            display: 'flex',
            alignItems: 'center',
            flex: 1,
            minWidth: 0,
            gap: { xs: 0.75, sm: 1.25 },
            cursor: 'pointer',
          }}
          onClick={() => navigate('/')}
        >
          <Box sx={{ flexShrink: 0, width: { xs: 40, sm: 44 }, height: { xs: 40, sm: 44 } }}>
            <Logo width="100%" height="100%" style={{ color: 'currentColor' }} />
          </Box>

          <Box
            sx={{
              display: { xs: 'flex', sm: 'none' },
              height: 40,
              minWidth: 0,
              flexDirection: 'column',
              justifyContent: 'center',
              lineHeight: 1,
            }}
          >
            <Typography
              component="span"
              sx={{ fontSize: 17, lineHeight: '19px', fontWeight: 700, letterSpacing: '-0.02em' }}
            >
              Cuadros
            </Typography>
            <Typography
              component="span"
              sx={{ fontSize: 13, lineHeight: '15px', fontWeight: 400, whiteSpace: 'nowrap' }}
            >
              de viaje
            </Typography>
          </Box>

          <Box
            sx={{
              display: { xs: 'none', sm: 'flex' },
              alignItems: 'baseline',
              minWidth: 0,
              gap: 0.75,
              whiteSpace: 'nowrap',
            }}
          >
            <Typography
              component="span"
              sx={{ fontSize: 25, lineHeight: 1, fontWeight: 700, letterSpacing: '-0.025em' }}
            >
              Cuadros
            </Typography>
            <Typography component="span" sx={{ fontSize: 16, lineHeight: 1, fontWeight: 400 }}>
              de viaje
            </Typography>
          </Box>
        </Box>

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
            <Typography
              variant="body2"
              sx={{
                display: { xs: 'none', md: 'block' },
                maxWidth: 150,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {user.nombre} {user.apellido}
            </Typography>
            <Avatar
              aria-label={`Cuenta de ${user.nombre} ${user.apellido}`}
              sx={{ cursor: 'pointer', bgcolor: 'primary.main', width: 36, height: 36 }}
              onClick={handleMenuOpen}
            >
              {getUserInitials(user.nombre, user.apellido)}
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
