export interface Usuario {
  id: string
  nombre: string
  apellido: string
  país: string
  email: string
  email_verificado: boolean
  fecha_alta: string
}

export type EmailVerificationState = 'pendiente' | 'verificado'
