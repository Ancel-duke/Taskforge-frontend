'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// Lazy load heavy layout components
const Navbar = dynamic(() => import('./Navbar'), {
  loading: () => <div className="h-16 bg-white border-b border-gray-200 animate-pulse" />
})

const Sidebar = dynamic(() => import('./Sidebar'), {
  loading: () => <div className="hidden md:block w-64 bg-white border-r border-gray-200 h-screen animate-pulse" />
})

interface PerformanceLayoutProps {
  children: React.ReactNode
  showSidebar?: boolean
}

export default function PerformanceLayout({ children, showSidebar = true }: PerformanceLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<div className="h-16 bg-white border-b border-gray-200 animate-pulse" />}>
        <Navbar />
      </Suspense>
      
      <div className="flex">
        {showSidebar && (
          <Suspense fallback={<div className="hidden md:block w-64 bg-white border-r border-gray-200 h-screen animate-pulse" />}>
            <Sidebar />
          </Suspense>
        )}
        
        <main className={`flex-1 ${showSidebar ? 'md:ml-64' : ''}`}>
          <div className="p-4 sm:p-6 lg:p-8">
            <Suspense fallback={
              <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
              </div>
            }>
              {children}
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  )
}
