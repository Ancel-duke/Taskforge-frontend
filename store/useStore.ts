import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, Project, Task } from '@/types'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  setAuth: (user: User, token: string) => void
  setUser: (user: User) => void
  logout: () => void
}

interface ProjectState {
  projects: Project[]
  currentProject: Project | null
  setProjects: (projects: Project[]) => void
  addProject: (project: Project) => void
  updateProject: (projectId: string, updates: Partial<Project>) => void
  setCurrentProject: (project: Project | null) => void
  updateProjectTasks: (projectId: string, tasks: Task[]) => void
}

interface TaskState {
  tasks: Task[]
  setTasks: (tasks: Task[]) => void
  addTask: (task: Task) => void
  updateTask: (taskId: string, updates: Partial<Task>) => void
  deleteTask: (taskId: string) => void
  moveTask: (taskId: string, newStatus: string) => void
}

interface UIState {
  darkMode: boolean
  toggleDarkMode: () => void
  setDarkMode: (dark: boolean) => void
}

type AppState = AuthState & ProjectState & TaskState & UIState

export const useStore = create<AppState>()(
  persist(
    (set, get) => {
      return {
      // Auth state
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user: User, token: string) => {
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        set({ user, token, isAuthenticated: true })
      },
      setUser: (user: User) => set({ user }),
      logout: () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        set({ user: null, token: null, isAuthenticated: false, projects: [], currentProject: null, tasks: [] })
      },

      // Project state
      projects: [],
      currentProject: null,
      setProjects: (projects: Project[]) => set({ projects }),
      addProject: (project: Project) => set((state) => ({ projects: [project, ...state.projects] })),
      updateProject: (projectId: string, updates: Partial<Project>) =>
        set((state) => ({
          projects: state.projects.map((p) => (p._id === projectId ? { ...p, ...updates } : p)),
          currentProject: state.currentProject?._id === projectId ? { ...state.currentProject, ...updates } : state.currentProject,
        })),
      setCurrentProject: (project: Project | null) => set({ currentProject: project }),
      updateProjectTasks: (projectId: string, tasks: Task[]) =>
        set((state) => ({
          projects: state.projects.map((p) => (p._id === projectId ? { ...p, tasks } : p)),
          currentProject: state.currentProject?._id === projectId ? { ...state.currentProject, tasks } : state.currentProject,
        })),

      // Task state
      tasks: [],
      setTasks: (tasks: Task[]) => set({ tasks }),
      addTask: (task: Task) => set((state) => ({ tasks: [...state.tasks, task] })),
      updateTask: (taskId: string, updates: Partial<Task>) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t._id === taskId ? { ...t, ...updates } : t)),
        })),
      deleteTask: (taskId: string) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t._id !== taskId),
        })),
      moveTask: (taskId: string, newStatus: string) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t._id === taskId ? { ...t, status: newStatus as any } : t)),
        })),

      // UI state
      darkMode: false,
      toggleDarkMode: () => set((state) => ({ darkMode: false })),
      setDarkMode: (dark: boolean) => set({ darkMode: false }),
      }
    },
    {
      name: 'taskforge-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        darkMode: false,
      }),
    }
  )
)
