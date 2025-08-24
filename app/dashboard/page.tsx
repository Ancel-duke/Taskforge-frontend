'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Users, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  ArrowRight,
  Calendar,
  TrendingUp,
  BarChart3,
  Settings,
  UserPlus
} from 'lucide-react'
import { useStore } from '@/store/useStore'
import { projectAPI } from '@/lib/api'
import { Project, Task } from '@/types'
import { formatDate } from '@/lib/utils'

export default function DashboardPage() {
  const { projects, setProjects, user } = useStore()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    overdueTasks: 0
  })

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectsData = await projectAPI.getProjects()
        setProjects(projectsData)
        
        // Calculate stats
        const totalTasks = projectsData.reduce((acc, project) => acc + project.tasks.length, 0)
        const completedTasks = projectsData.reduce((acc, project) => 
          acc + project.tasks.filter(task => task.status === 'Done').length, 0
        )
        const overdueTasks = projectsData.reduce((acc, project) => 
          acc + project.tasks.filter(task => {
            if (!task.dueDate || task.status === 'Done') return false
            return new Date() > new Date(task.dueDate)
          }).length, 0
        )

        setStats({
          totalProjects: projectsData.length,
          totalTasks,
          completedTasks,
          overdueTasks
        })
      } catch (error) {
        console.error('Error fetching projects:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [setProjects])

  const recentTasks = projects
    .flatMap(project => project.tasks.map(task => ({ ...task, projectName: project.name })))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
                     <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
             Welcome back, {user?.name}!
           </h1>
           <p className="text-gray-600 mt-1">
             Here's what's happening with your projects today.
           </p>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            href="/projects/new"
            className="btn btn-primary flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Project</span>
            <span className="sm:hidden">New</span>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-4 sm:p-6"
        >
          <div className="flex items-center justify-between">
            <div>
                             <p className="text-xs sm:text-sm font-medium text-gray-600">Total Projects</p>
               <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.totalProjects}</p>
             </div>
             <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
               <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-4 sm:p-6"
        >
          <div className="flex items-center justify-between">
            <div>
                             <p className="text-xs sm:text-sm font-medium text-gray-600">Total Tasks</p>
               <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.totalTasks}</p>
             </div>
             <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center">
               <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-4 sm:p-6"
        >
          <div className="flex items-center justify-between">
            <div>
                             <p className="text-xs sm:text-sm font-medium text-gray-600">Completed</p>
               <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.completedTasks}</p>
             </div>
             <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center">
               <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card p-4 sm:p-6"
        >
          <div className="flex items-center justify-between">
            <div>
                             <p className="text-xs sm:text-sm font-medium text-gray-600">Overdue</p>
               <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.overdueTasks}</p>
             </div>
             <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-lg flex items-center justify-center">
               <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Navigation */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link
          href="/analytics"
          className="card p-4 hover:shadow-lg transition-shadow cursor-pointer group"
        >
                     <div className="flex items-center space-x-3">
             <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
               <BarChart3 className="w-5 h-5 text-blue-600" />
             </div>
             <div>
               <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                 Analytics
               </h3>
               <p className="text-xs text-gray-500">View insights</p>
            </div>
          </div>
        </Link>

        <Link
          href="/team"
          className="card p-4 hover:shadow-lg transition-shadow cursor-pointer group"
        >
                     <div className="flex items-center space-x-3">
             <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
               <UserPlus className="w-5 h-5 text-green-600" />
             </div>
             <div>
               <h3 className="font-medium text-gray-900 group-hover:text-green-600 transition-colors">
                 Team
               </h3>
               <p className="text-xs text-gray-500">Manage members</p>
            </div>
          </div>
        </Link>

        <Link
          href="/settings"
          className="card p-4 hover:shadow-lg transition-shadow cursor-pointer group"
        >
                     <div className="flex items-center space-x-3">
             <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
               <Settings className="w-5 h-5 text-purple-600" />
             </div>
             <div>
               <h3 className="font-medium text-gray-900 group-hover:text-purple-600 transition-colors">
                 Settings
               </h3>
               <p className="text-xs text-gray-500">Preferences</p>
            </div>
          </div>
        </Link>

        <Link
          href="/projects"
          className="card p-4 hover:shadow-lg transition-shadow cursor-pointer group"
        >
                     <div className="flex items-center space-x-3">
             <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
               <Users className="w-5 h-5 text-orange-600" />
             </div>
             <div>
               <h3 className="font-medium text-gray-900 group-hover:text-orange-600 transition-colors">
                 All Projects
               </h3>
               <p className="text-xs text-gray-500">View all</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Projects and Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Projects */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="card p-4 sm:p-6"
        >
          <div className="flex items-center justify-between mb-4">
                         <h2 className="text-lg font-semibold text-gray-900">Recent Projects</h2>
            <Link href="/projects" className="btn btn-secondary text-sm px-3 py-1">
              View All Projects
            </Link>
          </div>
          
          {projects.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                             <p className="text-gray-500 mb-4">No projects yet</p>
              <Link href="/projects/new" className="btn btn-primary">
                Create your first project
              </Link>
            </div>
          ) : (
                         <div className="space-y-3 sm:space-y-4">
               {projects.slice(0, 5).map((project) => (
                 <Link
                   key={project._id}
                   href={`/projects/${project._id}`}
                                        className="flex items-center justify-between p-3 sm:p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                 >
                   <div className="flex-1 min-w-0">
                                            <h3 className="font-medium text-gray-900 truncate">{project.name}</h3>
                       <p className="text-xs sm:text-sm text-gray-500">
                         {project.tasks.length} tasks • {project.members.length} members
                       </p>
                   </div>
                   <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" />
                 </Link>
               ))}
             </div>
          )}
        </motion.div>

        {/* Recent Tasks */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="card p-4 sm:p-6"
        >
          <div className="flex items-center justify-between mb-4">
                         <h2 className="text-lg font-semibold text-gray-900">Recent Tasks</h2>
            <Link href="/projects" className="btn btn-secondary text-sm px-3 py-1">
              View All Projects
            </Link>
          </div>
          
          {recentTasks.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                             <p className="text-gray-500">No tasks yet</p>
            </div>
          ) : (
                         <div className="space-y-3 sm:space-y-4">
               {recentTasks.map((task) => (
                 <div
                   key={task._id}
                                        className="flex items-center justify-between p-3 sm:p-4 rounded-lg border border-gray-200"
                 >
                   <div className="flex-1 min-w-0">
                                            <h3 className="font-medium text-gray-900 truncate">{task.title}</h3>
                       <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mt-1 space-y-1 sm:space-y-0">
                         <span className="text-xs sm:text-sm text-gray-500">{task.projectName}</span>
                         {task.dueDate && (
                           <div className="flex items-center space-x-1 text-xs sm:text-sm text-gray-500">
                           <Calendar className="w-3 h-3" />
                           <span>{formatDate(task.dueDate)}</span>
                         </div>
                       )}
                     </div>
                   </div>
                   <div className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ml-2 ${getStatusColor(task.status)}`}>
                     {task.status}
                   </div>
                 </div>
               ))}
             </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

function getStatusColor(status: string) {
  switch (status) {
    case 'To Do':
      return 'bg-gray-100 text-gray-800'
    case 'In Progress':
      return 'bg-blue-100 text-blue-800'
    case 'Done':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}
