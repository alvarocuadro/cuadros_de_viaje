import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'

export const mockSupabaseUrl = 'http://localhost:3000'

export const mswServer = setupServer(
  http.post(`${mockSupabaseUrl}/auth/v1/signup`, () => {
    return HttpResponse.json({
      user: {
        id: 'test-user-id',
        email: 'test@example.com',
      },
    })
  }),

  http.post(`${mockSupabaseUrl}/auth/v1/verify`, () => {
    return HttpResponse.json({
      access_token: 'test-jwt',
      user: {
        id: 'test-user-id',
        email: 'test@example.com',
      },
    })
  }),

  http.post(`${mockSupabaseUrl}/auth/v1/otp`, () => {
    return HttpResponse.json({ success: true })
  }),

  http.post(`${mockSupabaseUrl}/rest/v1/profiles`, () => {
    return HttpResponse.json({ success: true })
  }),

  http.get(`${mockSupabaseUrl}/rest/v1/profiles`, () => {
    return HttpResponse.json([
      {
        id: 'test-user-id',
        nombre: 'Test',
        apellido: 'User',
        país: 'Argentina',
        email: 'test@example.com',
        email_verificado: true,
        fecha_alta: '2026-01-01',
      },
    ])
  }),
)
