import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { RouteName, SsoProvider } from '@/types/auth'

// Mock the components
vi.mock('@/components/PasswordResetPage.vue', () => ({
  default: { template: '<div>Login</div>' }
}))
vi.mock('@/components/ResetPasswordPage.vue', () => ({
  default: { template: '<div>Reset</div>' }
}))

describe('Vue Router navigation guards', () => {
  beforeEach(async () => {
    vi.resetModules()
    setActivePinia(createPinia())
  })

  it('navigates to the login page by default', async () => {
    const { default: router } = await import('./index')
    await router.push('/')
    await router.isReady()
    expect(router.currentRoute.value.name).toBe(RouteName.Login)
  })

  it('redirects to the login page when accessing /reset without authentication', async () => {
    const { default: router } = await import('./index')
    await router.push('/reset')
    await router.isReady()
    // Should be redirected to login because not authenticated
    expect(router.currentRoute.value.name).toBe(RouteName.Login)
  })

  it('allows access to the reset password page when authenticated', async () => {
    const { default: router } = await import('./index')
    const authStore = useAuthStore()
    authStore.setUser({
      email: 'test@example.com',
      displayName: 'Test',
      provider: SsoProvider.Google
    })
    
    await router.push('/reset')
    await router.isReady()
    expect(router.currentRoute.value.name).toBe(RouteName.ResetPassword)
  })

  it('defines the correct route names for login and reset password', () => {
    expect(RouteName.Login).toBe('login')
    expect(RouteName.ResetPassword).toBe('reset-password')
  })
})
