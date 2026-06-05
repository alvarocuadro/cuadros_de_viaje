import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { PrivateRoute } from '@/components/PrivateRoute'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { VerifyEmailPage } from '@/pages/VerifyEmailPage'
import { AppHeader } from '@/components/AppHeader'
import { Box } from '@mui/material'

export default function App() {
  return (
    <AuthProvider>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppHeader />
        <Box sx={{ flex: 1, py: 2 }}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />

            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<div>Dashboard — próximamente</div>} />
              <Route path="/trips/new" element={<div>Nuevo viaje — próximamente</div>} />
              <Route path="/trips/:id" element={<div>Detalle del viaje — próximamente</div>} />
              <Route path="/trips/:id/edit" element={<div>Editar viaje — próximamente</div>} />
            </Route>

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Box>
      </Box>
    </AuthProvider>
  )
}
