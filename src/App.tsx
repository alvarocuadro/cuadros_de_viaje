import { Routes, Route, Navigate } from 'react-router-dom'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<div>Login — próximamente</div>} />
      <Route path="/register" element={<div>Registro — próximamente</div>} />
      <Route path="/verify-email" element={<div>Verificar email — próximamente</div>} />
      <Route path="/dashboard" element={<div>Dashboard — próximamente</div>} />
      <Route path="/trips/new" element={<div>Nuevo viaje — próximamente</div>} />
      <Route path="/trips/:id" element={<div>Detalle del viaje — próximamente</div>} />
      <Route path="/trips/:id/edit" element={<div>Editar viaje — próximamente</div>} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
