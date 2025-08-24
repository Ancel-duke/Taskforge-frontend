'use client'

import { useEffect, useState } from 'react'
import { Calendar, Clock, User } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { projectAPI } from '@/lib/api'
import { Task } from '@/types'

export default function ProjectCalendarPage({ params }: { params: { id: string } }) {
  const { user } = useStore()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasksData = await projectAPI.getProjectTasks(params.id)
        setTasks(tasksData)
      } catch (error) {
        console.error('Error fetching tasks:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [params.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Project Calendar</h1>
          <p className="text-gray-600 mt-1">View tasks and deadlines</p>
        </div>
      </div>

      <div className="card p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Calendar className="w-6 h-6 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Upcoming Deadlines</h2>
        </div>

        {tasks.filter(task => task.dueDate).length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No tasks with deadlines</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks
              .filter(task => task.dueDate)
              .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
              .map((task) => (
                <div
                  key={task._id}
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{task.title}</h3>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{new Date(task.dueDate!).toLocaleDateString()}</span>
                      </div>
                      {task.assignedTo && (
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>{task.assignedTo.name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                    {task.status}
                  </div>
                </div>
              ))}
          </div>
        )}
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
