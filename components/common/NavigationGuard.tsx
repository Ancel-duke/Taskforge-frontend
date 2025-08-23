'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface NavigationGuardProps {
  isActive: boolean
  message?: string
}

export default function NavigationGuard({ 
  isActive, 
  message = 'You have unsaved changes. Are you sure you want to leave?' 
}: NavigationGuardProps) {
  const router = useRouter()

  useEffect(() => {
    if (!isActive) return

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = message
      return message
    }

    const handleRouteChange = () => {
      if (window.confirm(message)) {
        return true
      }
      // Prevent navigation
      throw 'Route change aborted'
    }

    // Add event listeners
    window.addEventListener('beforeunload', handleBeforeUnload)

    // Note: Next.js App Router doesn't have a direct way to intercept route changes
    // This is a simplified implementation. For more complex scenarios, you might need
    // to use a custom hook or state management

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [isActive, message])

  return null
}
