import {
  signInWithPopup,
  GoogleAuthProvider,
  OAuthProvider,
  type UserCredential
} from 'firebase/auth'
import { getFirebaseAuth, isFirebaseConfigured } from './firebase'
import { SsoProvider, type AuthUser } from '@/types/auth'

const googleProvider = new GoogleAuthProvider()
const appleProvider = new OAuthProvider('apple.com')
const microsoftProvider = new OAuthProvider('microsoft.com')

appleProvider.addScope('email')
appleProvider.addScope('name')

microsoftProvider.addScope('email')
microsoftProvider.addScope('profile')

export async function signInWithSso(provider: SsoProvider): Promise<AuthUser> {
  // Mode démo si Firebase non configuré
  if (!isFirebaseConfigured()) {
    console.warn('Firebase non configuré - Mode démo activé')
    return {
      email: 'demo@example.com',
      displayName: 'Utilisateur Démo',
      provider
    }
  }

  const auth = getFirebaseAuth()
  let credential: UserCredential

  switch (provider) {
    case SsoProvider.Google:
      credential = await signInWithPopup(auth, googleProvider)
      break
    case SsoProvider.Apple:
      credential = await signInWithPopup(auth, appleProvider)
      break
    case SsoProvider.Microsoft:
      credential = await signInWithPopup(auth, microsoftProvider)
      break
    default:
      throw new Error(`Provider non supporté: ${provider}`)
  }

  const user = credential.user
  
  if (!user.email) {
    throw new Error('Impossible de récupérer l\'adresse email')
  }

  return {
    email: user.email,
    displayName: user.displayName,
    provider
  }
}

export async function signOut(): Promise<void> {
  if (isFirebaseConfigured()) {
    const auth = getFirebaseAuth()
    await auth.signOut()
  }
}
