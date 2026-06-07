import { supabase } from '@/supabase'
import type { Usuario } from '@/types/auth'

export interface AuthError {
  code: string
  message: string
}

export interface AuthResponse {
  success: boolean
  error?: AuthError
  user?: Usuario
}

export async function register(
  nombre: string,
  apellido: string,
  país: string,
  email: string,
): Promise<AuthResponse> {
  try {
    const randomPassword = Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')

    const { data, error } = await supabase.auth.signUp({
      email,
      password: randomPassword,
      options: {
        data: {
          nombre,
          apellido,
          país,
        },
      },
    })

    if (error) {
      return {
        success: false,
        error: {
          code: error.code || 'auth_error',
          message: error.message,
        },
      }
    }

    if (!data.user?.id) {
      return {
        success: false,
        error: {
          code: 'no_user_id',
          message: 'No se pudo crear el usuario',
        },
      }
    }

    const { error: otpError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
      },
    })

    if (otpError) {
      return {
        success: false,
        error: {
          code: otpError.code || 'otp_error',
          message: otpError.message,
        },
      }
    }

    return { success: true }
  } catch (err) {
    return {
      success: false,
      error: {
        code: 'unknown_error',
        message: err instanceof Error ? err.message : 'Error desconocido',
      },
    }
  }
}

export async function verifyEmail(email: string, code: string): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: 'email',
    })

    if (error) {
      return {
        success: false,
        error: {
          code: error.code || 'verify_error',
          message: error.message,
        },
      }
    }

    if (!data.user?.id) {
      return {
        success: false,
        error: {
          code: 'no_user',
          message: 'Usuario no encontrado',
        },
      }
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ email_verificado: true, updated_at: new Date().toISOString() })
      .eq('id', data.user.id)

    if (updateError) {
      return {
        success: false,
        error: {
          code: updateError.code || 'update_error',
          message: updateError.message,
        },
      }
    }

    return { success: true }
  } catch (err) {
    return {
      success: false,
      error: {
        code: 'unknown_error',
        message: err instanceof Error ? err.message : 'Error desconocido',
      },
    }
  }
}

export async function resendOtp(email: string): Promise<AuthResponse> {
  try {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
      },
    })

    if (error) {
      return {
        success: false,
        error: {
          code: error.code || 'resend_error',
          message: error.message,
        },
      }
    }

    return { success: true }
  } catch (err) {
    return {
      success: false,
      error: {
        code: 'unknown_error',
        message: err instanceof Error ? err.message : 'Error desconocido',
      },
    }
  }
}

export async function requestMagicLink(email: string): Promise<AuthResponse> {
  try {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    })

    if (error) {
      return {
        success: false,
        error: {
          code: error.code || 'magic_link_error',
          message: error.message,
        },
      }
    }

    return { success: true }
  } catch (err) {
    return {
      success: false,
      error: {
        code: 'unknown_error',
        message: err instanceof Error ? err.message : 'Error desconocido',
      },
    }
  }
}

export async function logout(): Promise<AuthResponse> {
  try {
    const { error } = await supabase.auth.signOut()

    if (error) {
      return {
        success: false,
        error: {
          code: error.code || 'logout_error',
          message: error.message,
        },
      }
    }

    return { success: true }
  } catch (err) {
    return {
      success: false,
      error: {
        code: 'unknown_error',
        message: err instanceof Error ? err.message : 'Error desconocido',
      },
    }
  }
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession()

  if (error || !data.session) {
    return null
  }

  return data.session
}

export async function getCurrentUser(): Promise<Usuario | null> {
  try {
    const session = await getSession()

    if (!session?.user?.id) {
      return null
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()

    if (error || !data) {
      return null
    }

    return data as Usuario
  } catch {
    return null
  }
}

export function onAuthStateChange(callback: (user: Usuario | null) => void) {
  // Verificar sesión actual inmediatamente
  getCurrentUser().then((user) => {
    callback(user)
  })

  // Escuchar cambios de auth state
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(async (event, session) => {
    console.log('[Auth] State changed:', event, session?.user?.email)
    const user = await getCurrentUser()
    callback(user)
  })

  return subscription
}
