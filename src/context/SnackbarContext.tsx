import { createContext, useContext, useState } from 'react'
import { Snackbar, Alert, AlertColor } from '@mui/material'

interface SnackbarMessage {
  id: string
  message: string
  severity: AlertColor
  autoHideDuration?: number
}

interface SnackbarContextType {
  showMessage: (message: string, severity?: AlertColor, duration?: number) => void
  showSuccess: (message: string) => void
  showError: (message: string) => void
  showInfo: (message: string) => void
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined)

export function SnackbarProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<SnackbarMessage[]>([])

  const showMessage = (message: string, severity: AlertColor = 'info', duration = 6000) => {
    const id = Date.now().toString()
    setMessages((prev) => [...prev, { id, message, severity, autoHideDuration: duration }])
  }

  const showSuccess = (message: string) => showMessage(message, 'success', 4000)
  const showError = (message: string) => showMessage(message, 'error', 6000)
  const showInfo = (message: string) => showMessage(message, 'info', 4000)

  const handleClose = (id: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id))
  }

  return (
    <SnackbarContext.Provider value={{ showMessage, showSuccess, showError, showInfo }}>
      {children}
      {messages.map((msg) => (
        <Snackbar
          key={msg.id}
          open={true}
          autoHideDuration={msg.autoHideDuration}
          onClose={() => handleClose(msg.id)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <Alert onClose={() => handleClose(msg.id)} severity={msg.severity} sx={{ width: '100%' }}>
            {msg.message}
          </Alert>
        </Snackbar>
      ))}
    </SnackbarContext.Provider>
  )
}

export function useSnackbar() {
  const context = useContext(SnackbarContext)
  if (!context) {
    throw new Error('useSnackbar must be used within SnackbarProvider')
  }
  return context
}
