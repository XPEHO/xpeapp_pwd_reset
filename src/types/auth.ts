export enum SsoProvider {
  Google = 'google',
  Apple = 'apple',
  Microsoft = 'microsoft'
}

export enum RouteName {
  Login = 'login',
  ResetPassword = 'reset-password'
}

export interface AuthUser {
  email: string
  displayName: string | null
  provider: SsoProvider
}
