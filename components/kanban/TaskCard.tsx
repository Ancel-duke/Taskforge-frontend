'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Calendar, 
  User, 
  MoreVertical, 
  Edit, 
  Trash2,
  Clock,
  AlertCircle
} from 'lucide-react'
import { Task, User as UserType } from '@/types'
import { formatDate, getPriorityColor, isOverdue, getDaysUntilDue } from '@/lib/utils'
import { taskAPI } from '@/lib/api'
import { useStore } from '@/store/useStore'
import EditTaskModal from './EditTaskModal'

interface TaskCardProps {
  task: Task
  projectId: string
  members: UserType[]
  onTaskUpdate: (task: Task) => void
}

export default function TaskCard({ task, projectId, members, onTaskUpdate }: TaskCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const { deleteTask } = useStore()

  const handleDelete = async () => {
    try {
      await taskAPI.deleteTask(projectId, task._id)
      deleteTask(task._id)
    } catch (error) {
      console.error('Error deleting task:', error)
    }
    setIsMenuOpen(false)
  }

  const isTaskOverdue = task.dueDate ? isOverdue(task.dueDate, task.status) : false
  const daysUntilDue = task.dueDate ? getDaysUntilDue(task.dueDate) : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-4 hover:shadow-md transition-shadow cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-medium text-gray-900 text-sm leading-tight">
          {task.title}
        </h3>
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-1 rounded hover:bg-gray-100 transition-colors"
          >
            <MoreVertical className="w-4 h-4 text-gray-400" />
          </button>

          {/* Dropdown Menu */}
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute right-0 top-8 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10"
            >
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Priority Badge */}
      <div className="flex items-center justify-between mb-3">
        <span className={`priority-badge ${getPriorityColor(task.priority)}`}>
          {task.priority}
        </span>
      </div>

      {/* Due Date */}
      {task.dueDate && (
        <div className="flex items-center space-x-2 mb-3">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">
            {formatDate(task.dueDate)}
          </span>
          {isTaskOverdue && (
            <AlertCircle className="w-4 h-4 text-red-500" />
          )}
          {daysUntilDue !== null && daysUntilDue > 0 && daysUntilDue <= 3 && (
            <Clock className="w-4 h-4 text-yellow-500" />
          )}
        </div>
      )}

      {/* Assigned User */}
      {task.assignedTo && (
        <div className="flex items-center space-x-2">
          <User className="w-4 h-4 text-gray-400" />
          <div className="flex items-center space-x-2">
            {task.assignedTo.avatar ? (
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${task.assignedTo.avatar}`}
                alt={task.assignedTo.name}
                className="w-6 h-6 rounded-full object-cover"
              />
            ) : (
              <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-medium">
                  {task.assignedTo.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <span className="text-sm text-gray-600">
              {task.assignedTo.name}
            </span>
          </div>
        </div>
      )}

      {/* Created By */}
      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">Created by</span>
            {task.createdBy.avatar ? (
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${task.createdBy.avatar}`}
                alt={task.createdBy.name}
                className="w-5 h-5 rounded-full object-cover"
              />
            ) : (
              <div className="w-5 h-5 bg-gray-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-medium">
                  {task.createdBy.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <span className="text-xs text-gray-600">
              {task.createdBy.name}
            </span>
          </div>
          <span className="text-xs text-gray-500">
            {formatDate(task.createdAt)}
          </span>
        </div>
      </div>

      {/* Edit Task Modal */}
      {isEditing && (
        <EditTaskModal
          task={task}
          projectId={projectId}
          members={members}
          onClose={() => setIsEditing(false)}
          onUpdate={(updatedTask) => {
            onTaskUpdate(updatedTask)
            setIsEditing(false)
          }}
        />
      )}
    </motion.div>
  )
}
