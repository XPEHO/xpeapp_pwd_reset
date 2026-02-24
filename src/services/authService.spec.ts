import { describe, it, expect, vi, beforeEach } from 'vitest'
import { SsoProvider } from '@/types/auth'

// Mock firebase module
vi.mock('./firebase', () => ({
  isFirebaseConfigured: vi.fn(),
  getFirebaseAuth: vi.fn()
}))

// Mock firebase/auth with proper class constructors
vi.mock('firebase/auth', () => {
  class MockGoogleAuthProvider {}
  class MockOAuthProvider {
    addScope = vi.fn()
  }
  return {
    signInWithPopup: vi.fn(),
    GoogleAuthProvider: MockGoogleAuthProvider,
    OAuthProvider: MockOAuthProvider
  }
})

import { isFirebaseConfigured, getFirebaseAuth } from './firebase'
import { signInWithPopup } from 'firebase/auth'
import { signInWithSso, signOut } from './authService'

describe('authService module', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('signInWithSso', () => {
    it('returns a demo user when Firebase is not configured (Google)', async () => {
      vi.mocked(isFirebaseConfigured).mockReturnValue(false)

      const user = await signInWithSso(SsoProvider.Google)

      expect(user).toEqual({
        email: 'demo@example.com',
        displayName: 'Utilisateur Démo',
        provider: SsoProvider.Google
      })
    })

    it('returns a demo user for Apple provider when Firebase is not configured', async () => {
      vi.mocked(isFirebaseConfigured).mockReturnValue(false)

      const user = await signInWithSso(SsoProvider.Apple)

      expect(user.provider).toBe(SsoProvider.Apple)
      expect(user.email).toBe('demo@example.com')
    })

    it('returns a demo user for Microsoft provider when Firebase is not configured', async () => {
      vi.mocked(isFirebaseConfigured).mockReturnValue(false)

      const user = await signInWithSso(SsoProvider.Microsoft)

      expect(user.provider).toBe(SsoProvider.Microsoft)
      expect(user.email).toBe('demo@example.com')
    })

    it('calls signInWithPopup for Google when Firebase is configured', async () => {
      vi.mocked(isFirebaseConfigured).mockReturnValue(true)
      vi.mocked(getFirebaseAuth).mockReturnValue({} as any)
      vi.mocked(signInWithPopup).mockResolvedValue({
        user: {
          email: 'user@google.com',
          displayName: 'Google User'
        }
      } as any)

      const user = await signInWithSso(SsoProvider.Google)

      expect(signInWithPopup).toHaveBeenCalled()
      expect(user.email).toBe('user@google.com')
      expect(user.displayName).toBe('Google User')
    })

    it('calls signInWithPopup for Apple when Firebase is configured', async () => {
      vi.mocked(isFirebaseConfigured).mockReturnValue(true)
      vi.mocked(getFirebaseAuth).mockReturnValue({} as any)
      vi.mocked(signInWithPopup).mockResolvedValue({
        user: {
          email: 'user@icloud.com',
          displayName: 'Apple User'
        }
      } as any)

      const user = await signInWithSso(SsoProvider.Apple)

      expect(signInWithPopup).toHaveBeenCalled()
      expect(user.email).toBe('user@icloud.com')
      expect(user.provider).toBe(SsoProvider.Apple)
    })

    it('calls signInWithPopup for Microsoft when Firebase is configured', async () => {
      vi.mocked(isFirebaseConfigured).mockReturnValue(true)
      vi.mocked(getFirebaseAuth).mockReturnValue({} as any)
      vi.mocked(signInWithPopup).mockResolvedValue({
        user: {
          email: 'user@outlook.com',
          displayName: 'Microsoft User'
        }
      } as any)

      const user = await signInWithSso(SsoProvider.Microsoft)

      expect(signInWithPopup).toHaveBeenCalled()
      expect(user.email).toBe('user@outlook.com')
      expect(user.provider).toBe(SsoProvider.Microsoft)
    })

    it('throws an error when the user email is not available after SSO login', async () => {
      vi.mocked(isFirebaseConfigured).mockReturnValue(true)
      vi.mocked(getFirebaseAuth).mockReturnValue({} as any)
      vi.mocked(signInWithPopup).mockResolvedValue({
        user: {
          email: null,
          displayName: 'User'
        }
      } as any)

      await expect(signInWithSso(SsoProvider.Google)).rejects.toThrow(
        "Impossible de récupérer l'adresse email"
      )
    })
  })

  describe('signOut', () => {
    it('does not call auth.signOut when Firebase is not configured', async () => {
      vi.mocked(isFirebaseConfigured).mockReturnValue(false)

      await signOut()

      expect(getFirebaseAuth).not.toHaveBeenCalled()
    })

    it('calls auth.signOut when Firebase is configured', async () => {
      const mockSignOut = vi.fn().mockResolvedValue(undefined)
      vi.mocked(isFirebaseConfigured).mockReturnValue(true)
      vi.mocked(getFirebaseAuth).mockReturnValue({ signOut: mockSignOut } as any)

      await signOut()

      expect(mockSignOut).toHaveBeenCalled()
    })
  })
})
