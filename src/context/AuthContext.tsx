import React, { createContext, useContext, useEffect, useState } from 'react'
import type { Usuario } from '@/types/auth'
import { onAuthStateChange, logout as authLogout } from '@/services/authService'

interface AuthContextType {
  user: Usuario | null
  loading: boolean
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const subscription = onAuthStateChange((currentUser) => {
      if (isMounted) {
        console.log('[AuthContext] User updated:', currentUser?.email || 'null')
        setUser(currentUser)
        setLoading(false)
      }
    })

    return () => {
      isMounted = false
      subscription?.unsubscribe()
    }
  }, [])

  const logout = async () => {
    const result = await authLogout()
    if (result.success) {
      setUser(null)
    } else {
      throw result.error
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }
  return context
}
