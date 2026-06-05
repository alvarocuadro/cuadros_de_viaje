import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'

export const mockSupabaseUrl = 'http://localhost:3000'

export const mswServer = setupServer(
  http.post(`${mockSupabaseUrl}/auth/v1/signup`, async ({ request }) => {
    const body = (await request.json()) as any
    const email = body.email

    if (email === 'existing@example.com') {
      return HttpResponse.json(
        { error_code: 'user_already_exists', error_description: 'User already exists' },
        { status: 400 },
      )
    }

    return HttpResponse.json({
      user: {
        id: 'test-user-id',
        email,
        email_confirmed_at: null,
      },
    })
  }),

  http.post(`${mockSupabaseUrl}/auth/v1/verify`, async ({ request }) => {
    const body = (await request.json()) as any
    const token = body.token

    if (token === '123456') {
      return HttpResponse.json({
        access_token: 'test-jwt',
        token_type: 'bearer',
        user: {
          id: 'test-user-id',
          email: body.email,
        },
      })
    }

    return HttpResponse.json(
      { error_code: 'invalid_otp', error_description: 'Invalid OTP' },
      { status: 400 },
    )
  }),

  http.post(`${mockSupabaseUrl}/auth/v1/otp`, async ({ request }) => {
    return HttpResponse.json({
      success: true,
    })
  }),

  http.post(`${mockSupabaseUrl}/rest/v1/profiles`, async () => {
    return HttpResponse.json({ success: true })
  }),

  http.get(`${mockSupabaseUrl}/rest/v1/profiles`, async () => {
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

beforeAll(() => mswServer.listen())
afterEach(() => mswServer.resetHandlers())
afterAll(() => mswServer.close())
