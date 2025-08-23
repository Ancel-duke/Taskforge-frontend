'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// Lazy load analytics components
const AnalyticsPage = dynamic(() => import('@/app/analytics/page'), {
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>
  ),
  ssr: false
})

const ProjectAnalyticsPage = dynamic(() => import('@/app/projects/[id]/analytics/page'), {
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>
  ),
  ssr: false
})

export { AnalyticsPage, ProjectAnalyticsPage }
