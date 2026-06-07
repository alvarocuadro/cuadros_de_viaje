import { beforeEach, describe, expect, it, vi } from 'vitest'
import { register, resendSignupConfirmation } from '@/services/authService'

const authMocks = vi.hoisted(() => ({
  signUp: vi.fn(),
  signInWithOtp: vi.fn(),
  resend: vi.fn(),
}))

vi.mock('@/supabase', () => ({
  supabase: {
    auth: authMocks,
  },
}))

describe('authService registration confirmation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('sends only the signup confirmation link when registering', async () => {
    authMocks.signUp.mockResolvedValue({
      data: { user: { id: 'user-1' } },
      error: null,
    })

    const result = await register('Ada', 'Lovelace', 'Argentina', 'ada@example.com')

    expect(result).toEqual({ success: true })
    expect(authMocks.signUp).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'ada@example.com',
        options: expect.objectContaining({
          emailRedirectTo: `${window.location.origin}/dashboard`,
        }),
      }),
    )
    expect(authMocks.signInWithOtp).not.toHaveBeenCalled()
  })

  it('resends the pending signup confirmation link', async () => {
    authMocks.resend.mockResolvedValue({ error: null })

    const result = await resendSignupConfirmation('ada@example.com')

    expect(result).toEqual({ success: true })
    expect(authMocks.resend).toHaveBeenCalledWith({
      type: 'signup',
      email: 'ada@example.com',
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    })
  })
})
