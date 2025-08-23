'use client'

import { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { motion } from 'framer-motion'
import { Plus, MoreVertical, Filter, Users, X } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { Task, Project } from '@/types'
import TaskCard from './TaskCard'
import CreateTaskModal from './CreateTaskModal'
import { taskAPI } from '@/lib/api'

interface KanbanBoardProps {
  project: Project
  onInviteMember?: () => void
}

const columns = [
  { id: 'To Do', title: 'To Do', color: 'bg-gray-100', activeColor: 'bg-gray-200', textColor: 'text-gray-700' },
  { id: 'In Progress', title: 'In Progress', color: 'bg-blue-100', activeColor: 'bg-blue-200', textColor: 'text-blue-700' },
  { id: 'Done', title: 'Done', color: 'bg-green-100', activeColor: 'bg-green-200', textColor: 'text-green-700' }
]

export default function KanbanBoard({ project, onInviteMember }: KanbanBoardProps) {
  const [tasks, setTasks] = useState<Task[]>(project.tasks || [])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [filter, setFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const { updateProjectTasks } = useStore()

  useEffect(() => {
    setTasks(project.tasks || [])
  }, [project.tasks])

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return

    const { source, destination, draggableId } = result

    if (source.droppableId === destination.droppableId) {
      // Reorder within same column
      const columnTasks = tasks.filter(task => task.status === source.droppableId)
      const reorderedTasks = Array.from(columnTasks)
      const [removed] = reorderedTasks.splice(source.index, 1)
      reorderedTasks.splice(destination.index, 0, removed)

      const newTasks = tasks.map(task => {
        if (task.status === source.droppableId) {
          const taskIndex = reorderedTasks.findIndex(t => t._id === task._id)
          return reorderedTasks[taskIndex]
        }
        return task
      })

      setTasks(newTasks)
      updateProjectTasks(project._id, newTasks)
    } else {
      // Move to different column
      const taskToUpdate = tasks.find(task => task._id === draggableId)
      if (!taskToUpdate) return

      const updatedTask = { ...taskToUpdate, status: destination.droppableId }
      const newTasks = tasks.map(task => 
        task._id === draggableId ? updatedTask : task
      )

      setTasks(newTasks)
      updateProjectTasks(project._id, newTasks)

      // Update on server
      try {
        await taskAPI.updateTask(project._id, draggableId, { status: destination.droppableId })
      } catch (error) {
        console.error('Error updating task status:', error)
        // Revert on error
        setTasks(project.tasks || [])
        updateProjectTasks(project._id, project.tasks || [])
      }
    }
  }

  const filteredTasks = tasks.filter(task => {
    // Apply status filter first
    if (statusFilter && task.status !== statusFilter) return false
    
    // Then apply other filters
    if (filter === 'all') return true
    if (filter === 'my-tasks') return task.assignedTo?._id === project.owner._id
    if (filter === 'overdue') {
      if (!task.dueDate || task.status === 'Done') return false
      return new Date() > new Date(task.dueDate)
    }
    return true
  })

  const getColumnTasks = (status: string) => {
    return filteredTasks.filter(task => task.status === status)
  }

  const handleCreateTask = (newTask: Task) => {
    setTasks(prev => [...prev, newTask])
    updateProjectTasks(project._id, [...tasks, newTask])
    setIsCreateModalOpen(false)
  }

  const handleStatusFilterClick = (status: string) => {
    if (statusFilter === status) {
      setStatusFilter(null) // Clear filter if clicking the same status
    } else {
      setStatusFilter(status) // Set new filter
    }
  }

  const clearAllFilters = () => {
    setFilter('all')
    setStatusFilter(null)
  }

  const getFilteredTaskCount = () => {
    return filteredTasks.length
  }

  const getTotalTaskCount = () => {
    return tasks.length
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
          <p className="text-gray-600">{project.description}</p>
        </div>
        <div className="flex items-center space-x-4">
          {/* Filter */}
          <div className="relative">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Tasks</option>
              <option value="my-tasks">My Tasks</option>
              <option value="overdue">Overdue</option>
            </select>
            <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Invite Member Button */}
          {onInviteMember && (
            <button
              onClick={onInviteMember}
              className="btn btn-secondary flex items-center space-x-2"
            >
              <Users className="w-4 h-4" />
              <span>Invite Member</span>
            </button>
          )}

          {/* Create Task Button */}
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="btn btn-primary flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Filter Status */}
      {(statusFilter || filter !== 'all') && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 flex items-center space-x-2"
        >
          <span className="text-sm text-gray-600">Showing:</span>
          {statusFilter && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
              {statusFilter}
              <button
                onClick={() => setStatusFilter(null)}
                className="ml-1 hover:bg-primary-200 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filter !== 'all' && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {filter === 'my-tasks' ? 'My Tasks' : filter === 'overdue' ? 'Overdue' : filter}
              <button
                onClick={() => setFilter('all')}
                className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          <button
            onClick={clearAllFilters}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Clear all
          </button>
          <span className="text-sm text-gray-500">
            ({getFilteredTaskCount()} of {getTotalTaskCount()} tasks)
          </span>
        </motion.div>
      )}

      {/* Kanban Board */}
      <div className="flex-1 overflow-hidden">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
            {columns.map((column) => {
              const isActive = statusFilter === column.id
              const columnTasks = getColumnTasks(column.id)
              
              return (
                <div key={column.id} className="flex flex-col">
                  {/* Column Header */}
                  <motion.div 
                    className={`${isActive ? column.activeColor : column.color} rounded-lg p-4 mb-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                      isActive ? 'ring-2 ring-primary-500' : ''
                    }`}
                    onClick={() => handleStatusFilterClick(column.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className={`font-semibold ${isActive ? column.textColor : 'text-gray-900'}`}>
                        {column.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                          isActive 
                            ? 'bg-white text-primary-600' 
                            : 'bg-white text-gray-600'
                        }`}>
                          {columnTasks.length}
                        </span>
                        {isActive && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-2 h-2 bg-primary-500 rounded-full"
                          />
                        )}
                      </div>
                    </div>
                    {isActive && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs text-gray-600 mt-1"
                      >
                        Click to clear filter
                      </motion.p>
                    )}
                  </motion.div>

                  {/* Column Content */}
                  <Droppable droppableId={column.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex-1 min-h-0 ${
                          snapshot.isDraggingOver ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="space-y-3 h-full overflow-y-auto">
                          {columnTasks.map((task, index) => (
                            <Draggable key={task._id} draggableId={task._id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`${
                                    snapshot.isDragging ? 'rotate-2 shadow-lg' : ''
                                  }`}
                                >
                                  <TaskCard 
                                    task={task} 
                                    projectId={project._id} 
                                    members={project.members || []}
                                    onTaskUpdate={(updatedTask) => {
                                      const updatedTasks = tasks.map(t => 
                                        t._id === updatedTask._id ? updatedTask : t
                                      )
                                      setTasks(updatedTasks)
                                      updateProjectTasks(project._id, updatedTasks)
                                    }}
                                  />
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      </div>
                    )}
                  </Droppable>
                </div>
              )
            })}
          </div>
        </DragDropContext>
      </div>

      {/* Create Task Modal */}
      {isCreateModalOpen && (
        <CreateTaskModal
          projectId={project._id}
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreateTask}
          members={project.members}
        />
      )}
    </div>
  )
}
