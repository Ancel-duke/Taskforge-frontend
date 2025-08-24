'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Target,
  Users
} from 'lucide-react'
import { useStore } from '@/store/useStore'
import { projectAPI } from '@/lib/api'
import { Project, Task } from '@/types'
import DashboardLayout from '@/components/layout/DashboardLayout'




export default function ProjectProgressPage() {
  const params = useParams()
  const projectId = params.id as string
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { setCurrentProject } = useStore()

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const projectData = await projectAPI.getProject(projectId)
        setProject(projectData)
        setCurrentProject(projectData)
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load project')
      } finally {
        setLoading(false)
      }
    }

    if (projectId) {
      fetchProject()
    }
  }, [projectId, setCurrentProject])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  if (error || !project) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center max-w-md mx-auto p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Error Loading Project
            </h2>
            <p className="text-gray-600 mb-4">{error || 'Project not found'}</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const getProgressStats = () => {
    const totalTasks = project.tasks.length
    const completedTasks = project.tasks.filter(task => task.status === 'Done').length
    const inProgressTasks = project.tasks.filter(task => task.status === 'In Progress').length
    const todoTasks = project.tasks.filter(task => task.status === 'To Do').length
    const overdueTasks = project.tasks.filter(task => {
      if (!task.dueDate) return false
      return new Date(task.dueDate) < new Date() && task.status !== 'Done'
    }).length
    
    return {
      total: totalTasks,
      completed: completedTasks,
      inProgress: inProgressTasks,
      todo: todoTasks,
      overdue: overdueTasks,
      completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
    }
  }

  const getPriorityStats = () => {
    const priorities = ['Urgent', 'High', 'Medium', 'Low']
    return priorities.map(priority => ({
      priority,
      count: project.tasks.filter(task => task.priority === priority).length,
      completed: project.tasks.filter(task => task.priority === priority && task.status === 'Done').length
    }))
  }

  const getRecentActivity = () => {
    // Sort tasks by updated date
    return [...project.tasks]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5)
  }

  const stats = getProgressStats()
  const priorityStats = getPriorityStats()
  const recentActivity = getRecentActivity()

  return (
    <DashboardLayout>
      <div className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Progress Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Target className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.completionRate}%
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Completed</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.completed}/{stats.total}
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">In Progress</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.inProgress}
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Overdue</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.overdue}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Progress Chart */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress Overview</h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">To Do</span>
                      <span className="text-gray-900 font-medium">{stats.todo}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(stats.todo / stats.total) * 100}%` }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="bg-gray-400 h-3 rounded-full"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">In Progress</span>
                      <span className="text-gray-900 font-medium">{stats.inProgress}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(stats.inProgress / stats.total) * 100}%` }}
                        transition={{ duration: 0.8, delay: 0.7 }}
                        className="bg-yellow-500 h-3 rounded-full"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Completed</span>
                      <span className="text-gray-900 font-medium">{stats.completed}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(stats.completed / stats.total) * 100}%` }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                        className="bg-green-500 h-3 rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Priority Breakdown */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Priority Breakdown</h3>
                
                <div className="space-y-4">
                  {priorityStats.map((priority, index) => (
                    <div key={priority.priority}>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">{priority.priority}</span>
                        <span className="text-gray-900 font-medium">
                          {priority.completed}/{priority.count}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: priority.count > 0 ? `${(priority.completed / priority.count) * 100}%` : 0 }}
                          transition={{ duration: 0.8, delay: 0.6 + index * 0.1 }}
                          className={`h-3 rounded-full ${
                            priority.priority === 'Urgent' ? 'bg-red-500' :
                            priority.priority === 'High' ? 'bg-orange-500' :
                            priority.priority === 'Medium' ? 'bg-yellow-500' : 'bg-blue-500'
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="mt-8 bg-white rounded-lg shadow-sm p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              
              <div className="space-y-4">
                {recentActivity.map((task, index) => (
                  <motion.div
                    key={task._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + index * 0.1 }}
                    className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className={`w-3 h-3 rounded-full ${
                      task.status === 'Done' ? 'bg-green-500' :
                      task.status === 'In Progress' ? 'bg-yellow-500' : 'bg-gray-400'
                    }`} />
                    
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{task.title}</p>
                      <p className="text-xs text-gray-500">
                        {task.status} • {new Date(task.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      task.priority === 'Urgent' ? 'bg-red-100 text-red-800' :
                      task.priority === 'High' ? 'bg-orange-100 text-orange-800' :
                      task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {task.priority}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
