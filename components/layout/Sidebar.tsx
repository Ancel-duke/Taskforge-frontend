'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, 
  FolderOpen, 
  BarChart3, 
  Plus,
  Users,
  Settings
} from 'lucide-react'
import { useStore } from '@/store/useStore'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Projects', href: '/projects', icon: FolderOpen },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Team', href: '/team', icon: Users },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { projects } = useStore()

  return (
    <div className="hidden md:block w-64 bg-white border-r border-gray-200 h-screen sticky top-16 transition-colors duration-200">
      <div className="p-4 sm:p-6">
        {/* Create Project Button */}
        <Link
          href="/projects/new"
          className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Link>

        {/* Navigation */}
        <nav className="mt-8">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== '/dashboard' && pathname.startsWith(item.href))
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200',
                    isActive
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  )}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Recent Projects */}
        {projects.length > 0 && (
          <div className="mt-8">
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Recent Projects
            </h3>
            <div className="mt-2 space-y-1">
              {projects.slice(0, 5).map((project) => (
                <Link
                  key={project._id}
                  href={`/projects/${project._id}`}
                  className={cn(
                    'flex items-center px-3 py-2 text-sm rounded-lg transition-colors duration-200',
                    pathname === `/projects/${project._id}`
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  )}
                >
                  <div className="w-2 h-2 bg-primary-600 rounded-full mr-3 flex-shrink-0" />
                  <span className="truncate">{project.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
