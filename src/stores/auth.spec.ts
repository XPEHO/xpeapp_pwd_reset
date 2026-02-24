import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from './auth'
import { SsoProvider, type AuthUser } from '@/types/auth'

describe('Pinia useAuthStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with a null user and unauthenticated state', () => {
    const store = useAuthStore()
    expect(store.user).toBeNull()
    expect(store.isAuthenticated).toBe(false)
    expect(store.userEmail).toBeNull()
  })

  it('sets the user and updates authentication state correctly', () => {
    const store = useAuthStore()
    const mockUser: AuthUser = {
      email: 'test@example.com',
      displayName: 'Test User',
      provider: SsoProvider.Google
    }

    store.setUser(mockUser)

    expect(store.user).toEqual(mockUser)
    expect(store.isAuthenticated).toBe(true)
    expect(store.userEmail).toBe('test@example.com')
  })

  it('clears the user and resets authentication state', () => {
    const store = useAuthStore()
    const mockUser: AuthUser = {
      email: 'test@example.com',
      displayName: 'Test User',
      provider: SsoProvider.Apple
    }

    store.setUser(mockUser)
    expect(store.isAuthenticated).toBe(true)

    store.clearUser()

    expect(store.user).toBeNull()
    expect(store.isAuthenticated).toBe(false)
    expect(store.userEmail).toBeNull()
  })
})
