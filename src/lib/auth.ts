import { jwtVerify } from 'jose'

export interface User {
  id: string
  email: string
  name: string
  preferences?: {
    preferredCategories: string[]
    followedEntities: string[]
    trustedSources: string[]
    customSources: string[]
    notificationSettings: {
      email: boolean
      push: boolean
      frequency: string
    }
    minRelevanceScore: number
  }
}

export interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
}

export const defaultAuthState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: false,
}

export async function verifyToken(token: string): Promise<{ userId: string; email: string } | null> {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key')
    const { payload } = await jwtVerify(token, secret)
    
    if (payload.userId && payload.email) {
      return {
        userId: payload.userId as string,
        email: payload.email as string,
      }
    }
    
    return null
  } catch (error) {
    console.error('Token verification failed:', error)
    return null
  }
}

export function getTokenFromStorage(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('unpackai_token')
}

export function setTokenInStorage(token: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('unpackai_token', token)
}

export function removeTokenFromStorage(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem('unpackai_token')
}

export function getUserFromStorage(): User | null {
  if (typeof window === 'undefined') return null
  const userStr = localStorage.getItem('unpackai_user')
  if (!userStr) return null
  
  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
}

export function setUserInStorage(user: User): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('unpackai_user', JSON.stringify(user))
}

export function removeUserFromStorage(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem('unpackai_user')
}
