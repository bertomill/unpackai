"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { AuthState, defaultAuthState, getTokenFromStorage, getUserFromStorage, removeTokenFromStorage, removeUserFromStorage, setTokenInStorage, setUserInStorage } from '@/lib/auth'

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(defaultAuthState)

  useEffect(() => {
    // Initialize auth state from localStorage on mount
    const token = getTokenFromStorage()
    const user = getUserFromStorage()
    
    if (token && user) {
      setAuthState({
        user,
        token,
        isLoading: false,
        isAuthenticated: true,
      })
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }))
    }
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setAuthState(prev => ({ ...prev, isLoading: true }))

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        const { user, token } = data
        
        setTokenInStorage(token)
        setUserInStorage(user)
        
        setAuthState({
          user,
          token,
          isLoading: false,
          isAuthenticated: true,
        })

        return { success: true }
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }))
        return { success: false, error: data.error || 'Login failed' }
      }
    } catch {
      setAuthState(prev => ({ ...prev, isLoading: false }))
      return { success: false, error: 'Network error. Please try again.' }
    }
  }

  const signup = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setAuthState(prev => ({ ...prev, isLoading: true }))

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        const { user, token } = data
        
        setTokenInStorage(token)
        setUserInStorage(user)
        
        setAuthState({
          user,
          token,
          isLoading: false,
          isAuthenticated: true,
        })

        return { success: true }
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }))
        return { success: false, error: data.error || 'Signup failed' }
      }
    } catch {
      setAuthState(prev => ({ ...prev, isLoading: false }))
      return { success: false, error: 'Network error. Please try again.' }
    }
  }

  const logout = () => {
    removeTokenFromStorage()
    removeUserFromStorage()
    setAuthState(defaultAuthState)
  }

  const refreshUser = async (): Promise<void> => {
    // This would typically fetch fresh user data from the server
    // For now, we'll just ensure the stored user data is still valid
    const user = getUserFromStorage()
    if (user) {
      setAuthState(prev => ({ ...prev, user }))
    }
  }

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        signup,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
