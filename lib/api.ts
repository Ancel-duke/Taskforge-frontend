import axios from 'axios'
import { AuthResponse, Project, Task, User, Analytics, CreateProjectData, CreateTaskData, UpdateTaskData, UpdateProfileData, Invitation } from '@/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  // Get token from localStorage (fallback for Zustand store)
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  register: async (username: string, password: string, name: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', { username, password, name })
    return response.data
  },

  login: async (username: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', { username, password })
    return response.data
  },

  getMe: async (): Promise<{ user: User }> => {
    const response = await api.get('/auth/me')
    return response.data
  },
}

// User API
export const userAPI = {
  getProfile: async (): Promise<User> => {
    const response = await api.get('/users/me')
    return response.data
  },

  updateProfile: async (data: UpdateProfileData): Promise<{ message: string; user: User }> => {
    const formData = new FormData()
    if (data.name) formData.append('name', data.name)
    if (data.avatar) formData.append('avatar', data.avatar)

    const response = await api.put('/users/me', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  searchUsers: async (username: string): Promise<User[]> => {
    const response = await api.get(`/users/search?username=${username}`)
    return response.data
  },
}

// Project API
export const projectAPI = {
  createProject: async (data: CreateProjectData): Promise<{ message: string; project: Project }> => {
    const response = await api.post('/projects', data)
    return response.data
  },

  getProjects: async (): Promise<Project[]> => {
    const response = await api.get('/projects')
    return response.data
  },

  getProject: async (id: string): Promise<Project> => {
    const response = await api.get(`/projects/${id}`)
    return response.data
  },

  addMember: async (projectId: string, username: string): Promise<{ message: string; project: Project }> => {
    const response = await api.post(`/projects/${projectId}/members`, { username })
    return response.data
  },

  getProjectTasks: async (projectId: string): Promise<Task[]> => {
    const response = await api.get(`/projects/${projectId}/tasks`)
    return response.data
  },

  getAnalytics: async (projectId: string): Promise<Analytics> => {
    const response = await api.get(`/projects/${projectId}/analytics`)
    return response.data
  },
}

// Task API
export const taskAPI = {
  createTask: async (projectId: string, data: CreateTaskData): Promise<{ message: string; task: Task }> => {
    const response = await api.post(`/projects/${projectId}/tasks`, data)
    return response.data
  },

  updateTask: async (projectId: string, taskId: string, data: UpdateTaskData): Promise<{ message: string; task: Task }> => {
    const response = await api.put(`/projects/${projectId}/tasks/${taskId}`, data)
    return response.data
  },

  deleteTask: async (projectId: string, taskId: string): Promise<{ message: string }> => {
    const response = await api.delete(`/projects/${projectId}/tasks/${taskId}`)
    return response.data
  },
}

// Invitation API
export const invitationAPI = {
  sendInvitation: async (projectId: string, inviteeId: string, message?: string): Promise<{ message: string; invitation: Invitation }> => {
    const response = await api.post(`/projects/${projectId}/invitations`, { inviteeId, message })
    return response.data
  },

  getInvitations: async (): Promise<Invitation[]> => {
    const response = await api.get('/invitations')
    return response.data
  },

  acceptInvitation: async (invitationId: string): Promise<{ message: string; invitation: Invitation }> => {
    const response = await api.put(`/invitations/${invitationId}/accept`)
    return response.data
  },

  rejectInvitation: async (invitationId: string): Promise<{ message: string; invitation: Invitation }> => {
    const response = await api.put(`/invitations/${invitationId}/reject`)
    return response.data
  },

  cancelInvitation: async (invitationId: string): Promise<{ message: string }> => {
    const response = await api.delete(`/invitations/${invitationId}`)
    return response.data
  },
}

export default api
