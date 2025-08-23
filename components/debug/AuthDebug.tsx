'use client'

import { useStore } from '@/store/useStore'
import { useEffect, useState } from 'react'

export default function AuthDebug() {
  const { user, token, isAuthenticated } = useStore()
  const [localToken, setLocalToken] = useState<string | null>(null)

  useEffect(() => {
    setLocalToken(localStorage.getItem('token'))
  }, [])

  if (process.env.NODE_ENV === 'production') {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg p-4 shadow-lg z-50 max-w-sm">
      <h3 className="font-semibold text-sm mb-2">🔧 Auth Debug</h3>
      <div className="text-xs space-y-1">
        <div>Authenticated: <span className={isAuthenticated ? 'text-green-600' : 'text-red-600'}>{isAuthenticated ? 'Yes' : 'No'}</span></div>
        <div>User: {user ? user.name : 'None'}</div>
        <div>Store Token: {token ? 'Present' : 'Missing'}</div>
        <div>LocalStorage Token: {localToken ? 'Present' : 'Missing'}</div>
        <div className="mt-2">
          <button 
            onClick={() => {
              localStorage.clear()
              window.location.reload()
            }}
            className="text-xs bg-red-500 text-white px-2 py-1 rounded"
          >
            Clear Storage
          </button>
        </div>
      </div>
    </div>
  )
}
