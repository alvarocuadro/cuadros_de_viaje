import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { TripsProvider } from '@/context/TripsContext'
import { PrivateRoute } from '@/components/PrivateRoute'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { VerifyEmailPage } from '@/pages/VerifyEmailPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { TripFormPage } from '@/pages/TripFormPage'
import { TripDetailPage } from '@/pages/TripDetailPage'
import { TransportFormPage } from '@/pages/TransportFormPage'
import { AccommodationFormPage } from '@/pages/AccommodationFormPage'
import { AppHeader } from '@/components/AppHeader'
import { Box } from '@mui/material'

export default function App() {
  return (
    <AuthProvider>
      <TripsProvider>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <AppHeader />
          <Box sx={{ flex: 1, py: 2 }}>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/verify-email" element={<VerifyEmailPage />} />

              <Route element={<PrivateRoute />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/trips/new" element={<TripFormPage />} />
                <Route path="/trips/:id" element={<TripDetailPage />} />
                <Route path="/trips/:id/edit" element={<TripFormPage />} />
                <Route path="/trips/:viajeId/transport/new" element={<TransportFormPage />} />
                <Route path="/trips/:viajeId/transport/:itemId/edit" element={<TransportFormPage />} />
                <Route path="/trips/:viajeId/accommodation/new" element={<AccommodationFormPage />} />
                <Route path="/trips/:viajeId/accommodation/:itemId/edit" element={<AccommodationFormPage />} />
              </Route>

              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Box>
        </Box>
      </TripsProvider>
    </AuthProvider>
  )
}
