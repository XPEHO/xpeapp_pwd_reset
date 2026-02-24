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

const API_BACKEND_URL = import.meta.env.VITE_API_BACKEND_URL
const SERVICE_ACCOUNT_USERNAME = import.meta.env.VITE_SERVICE_ACCOUNT_USERNAME
const SERVICE_ACCOUNT_PASSWORD = import.meta.env.VITE_SERVICE_ACCOUNT_PASSWORD


export async function signInWithSso(provider: SsoProvider): Promise<AuthUser> {
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

export async function getServiceJwtToken(): Promise<string> {
  const body = {
    username: SERVICE_ACCOUNT_USERNAME,
    password: SERVICE_ACCOUNT_PASSWORD
  }

  const response = await fetch(`${API_BACKEND_URL}/wp-json/jwt-auth/v1/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })

  if (!response.ok) {
    throw new Error('Erreur lors de la génération du token de service (Vérifiez les identifiants)')
  }

  const data = await response.json()
  return data.token
}

export async function resetPasswordWithApi(
  email: string,
  newPassword: string,
  confirmPassword: string
): Promise<boolean> {
  const token = await getServiceJwtToken()

  const body = {
    email,
    password: newPassword,
    password_repeat: confirmPassword
  }

  const response = await fetch(`${API_BACKEND_URL}/wp-json/xpeho/v1/reset-password`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(body)
  })

  if (!response.ok) {
    let errorMessage = 'Une erreur est survenue lors de la modification.'
    
      const errorData = await response.json()
      
      // Specific case: User not found
      if (errorData.code === 'user_not_found') {
        errorMessage = "Veuillez essayer avec le compte que vous utilisez sur XPEAPP !"
      } 
      // Specific case: Unauthorized or Forbidden (e.g., invalid token)
      else if (response.status === 401 || response.status === 403) {
        errorMessage = 'Autorisation refusée par le serveur backend.'
      }
      // Autre message renvoyé par le back
      else if (errorData.message) {
        errorMessage = errorData.message
      }
    throw new Error(errorMessage)
  }

  return true
}