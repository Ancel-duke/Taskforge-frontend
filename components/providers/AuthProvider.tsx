'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useStore } from '@/store/useStore'
import { authAPI } from '@/lib/api'
import { User } from '@/types'

interface AuthContextType {
  isLoading: boolean
  isInitialized: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { token, setAuth, logout } = useStore()
  const [isLoading, setIsLoading] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if token exists in localStorage
        const storedToken = localStorage.getItem('token')
        const storedUser = localStorage.getItem('user')

        if (storedToken && storedUser) {
          // Verify token with backend
          try {
            const response = await authAPI.getMe()
            // Token is valid, update store
            setAuth(response.user, storedToken)
          } catch (error) {
            // Token is invalid, clear storage
            console.log('Invalid token, clearing storage')
            logout()
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        logout()
      } finally {
        setIsLoading(false)
        setIsInitialized(true)
      }
    }

    initializeAuth()
  }, [setAuth, logout])

  // Show loading spinner while initializing
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ isLoading, isInitialized }}>
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
