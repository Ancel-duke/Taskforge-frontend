'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, 
  BarChart3, 
  Users, 
  Settings, 
  ChevronRight,
  Kanban,
  Calendar,
  FileText
} from 'lucide-react'
import { Project } from '@/types'

interface ProjectNavigationProps {
  project: Project
  activeTab?: string
}

export default function ProjectNavigation({ project, activeTab = 'kanban' }: ProjectNavigationProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const navigationTabs = [
    {
      id: 'kanban',
      label: 'Kanban Board',
      icon: Kanban,
      href: `/projects/${project._id}`,
      description: 'Manage tasks with drag & drop'
    },
    {
      id: 'progress',
      label: 'Progress',
      icon: BarChart3,
      href: `/projects/${project._id}/progress`,
      description: 'Track project progress'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: LayoutDashboard,
      href: `/projects/${project._id}/analytics`,
      description: 'View detailed analytics'
    },
    {
      id: 'team',
      label: 'Team',
      icon: Users,
      href: `/projects/${project._id}/team`,
      description: 'Manage team members'
    },
    {
      id: 'calendar',
      label: 'Calendar',
      icon: Calendar,
      href: `/projects/${project._id}/calendar`,
      description: 'View task timeline'
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: FileText,
      href: `/projects/${project._id}/documents`,
      description: 'Project files & docs'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      href: `/projects/${project._id}/settings`,
      description: 'Project configuration'
    }
  ]

  const getProgressStats = () => {
    const totalTasks = project.tasks.length
    const completedTasks = project.tasks.filter(task => task.status === 'Done').length
    const inProgressTasks = project.tasks.filter(task => task.status === 'In Progress').length
    const todoTasks = project.tasks.filter(task => task.status === 'To Do').length
    
    return {
      total: totalTasks,
      completed: completedTasks,
      inProgress: inProgressTasks,
      todo: todoTasks,
      completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
    }
  }

  const stats = getProgressStats()

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="px-6 py-4">
        {/* Project Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-semibold text-lg">
                {project.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{project.name}</h1>
              <p className="text-sm text-gray-600">{project.description}</p>
            </div>
          </div>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ChevronRight className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
          </button>
        </div>

        {/* Progress Overview */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-500">{stats.completionRate}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${stats.completionRate}%` }}
              transition={{ duration: 0.5 }}
              className="bg-primary-600 h-2 rounded-full"
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>{stats.todo} To Do</span>
            <span>{stats.inProgress} In Progress</span>
            <span>{stats.completed} Done</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <motion.div
          initial={false}
          animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pt-4 border-t border-gray-200">
            {navigationTabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              
              return (
                <Link
                  key={tab.id}
                  href={tab.href}
                  className={`group relative p-3 rounded-lg border transition-all duration-200 ${
                    isActive
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-5 h-5 ${
                      isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-primary-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${
                        isActive ? 'text-primary-700' : 'text-gray-900 group-hover:text-primary-700'
                      }`}>
                        {tab.label}
                      </p>
                      <p className={`text-xs truncate ${
                        isActive ? 'text-primary-600' : 'text-gray-500 group-hover:text-primary-600'
                      }`}>
                        {tab.description}
                      </p>
                    </div>
                  </div>
                  
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 border-2 border-primary-500 rounded-lg"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              )
            })}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
