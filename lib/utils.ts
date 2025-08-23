import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export function formatDateTime(date: string | Date) {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function getDaysUntilDue(dueDate: string | Date) {
  const today = new Date()
  const due = new Date(dueDate)
  const diffTime = due.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

export function isOverdue(dueDate: string | Date, status: string) {
  if (status === 'Done') return false
  return new Date() > new Date(dueDate)
}

export function getPriorityColor(priority: string) {
  switch (priority) {
    case 'Low':
      return 'priority-low'
    case 'Medium':
      return 'priority-medium'
    case 'High':
      return 'priority-high'
    case 'Urgent':
      return 'priority-urgent'
    default:
      return 'priority-medium'
  }
}

export function getStatusColor(status: string) {
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
