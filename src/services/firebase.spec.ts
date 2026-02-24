import { describe, it, expect, vi, beforeEach } from 'vitest'
import { isFirebaseConfigured, getFirebaseAuth } from './firebase'

// Mock firebase/app and firebase/auth
vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => ({ name: 'mock-app' }))
}))

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({ name: 'mock-auth' }))
}))

describe('firebase service module', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  describe('isFirebaseConfigured', () => {
    it('returns false when the VITE_FIREBASE_API_KEY environment variable is not set', async () => {
      vi.stubEnv('VITE_FIREBASE_API_KEY', '')
      const { isFirebaseConfigured: check } = await import('./firebase')
      expect(check()).toBe(false)
    })

    it('returns true when the VITE_FIREBASE_API_KEY environment variable is set', async () => {
      vi.stubEnv('VITE_FIREBASE_API_KEY', 'test-api-key')
      const { isFirebaseConfigured: check } = await import('./firebase')
      expect(check()).toBe(true)
    })
  })

  describe('getFirebaseAuth', () => {
    it('throws an error when Firebase is not configured', async () => {
      vi.stubEnv('VITE_FIREBASE_API_KEY', '')
      const { getFirebaseAuth: getAuth } = await import('./firebase')
      expect(() => getAuth()).toThrow('Firebase non configuré')
    })

    it('returns the auth instance when Firebase is configured', async () => {
      vi.stubEnv('VITE_FIREBASE_API_KEY', 'test-api-key')
      vi.stubEnv('VITE_FIREBASE_AUTH_DOMAIN', 'test.firebaseapp.com')
      vi.stubEnv('VITE_FIREBASE_PROJECT_ID', 'test-project')
      
      const { getFirebaseAuth: getAuth } = await import('./firebase')
      const auth = getAuth()
      expect(auth).toBeDefined()
    })
  })
})
