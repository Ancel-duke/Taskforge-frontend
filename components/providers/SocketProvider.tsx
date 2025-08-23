'use client'

import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { useStore } from '@/store/useStore'
import { Task } from '@/types'

interface SocketContextType {
  socket: Socket | null
  isConnected: boolean
  joinProject: (projectId: string) => void
  leaveProject: (projectId: string) => void
  connect: () => void
  disconnect: () => void
}

const SocketContext = createContext<SocketContextType | undefined>(undefined)

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const socketRef = useRef<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const { addTask, updateTask, deleteTask, user } = useStore()

  useEffect(() => {
    const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
    
    socketRef.current = io(SOCKET_URL, {
      autoConnect: false,
      transports: ['websocket', 'polling'],
      upgrade: true,
      rememberUpgrade: true,
      timeout: 20000,
      forceNew: true,
    })

    const socket = socketRef.current

    // Connection event handlers
    socket.on('connect', () => {
      console.log('Socket connected:', socket.id)
      setIsConnected(true)
    })

    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason)
      setIsConnected(false)
    })

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error)
      setIsConnected(false)
    })

    socket.on('reconnect', (attemptNumber) => {
      console.log('Socket reconnected after', attemptNumber, 'attempts')
      setIsConnected(true)
    })

    socket.on('reconnect_error', (error) => {
      console.error('Socket reconnection error:', error)
    })

    // Task event handlers
    socket.on('taskCreated', (task: Task) => {
      console.log('Task created via socket:', task)
      addTask(task)
    })

    socket.on('taskUpdated', (task: Task) => {
      console.log('Task updated via socket:', task)
      updateTask(task._id, task)
    })

    socket.on('taskDeleted', ({ taskId }: { taskId: string }) => {
      console.log('Task deleted via socket:', taskId)
      deleteTask(taskId)
    })

    // Auto-connect if user is authenticated
    if (user) {
      socket.connect()
    }

    return () => {
      socket.disconnect()
    }
  }, [addTask, updateTask, deleteTask, user])

  const connect = () => {
    if (socketRef.current && !isConnected) {
      socketRef.current.connect()
    }
  }

  const disconnect = () => {
    if (socketRef.current && isConnected) {
      socketRef.current.disconnect()
    }
  }

  const joinProject = (projectId: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('joinProject', projectId)
      console.log('Joined project:', projectId)
    }
  }

  const leaveProject = (projectId: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('leaveProject', projectId)
      console.log('Left project:', projectId)
    }
  }

  return (
    <SocketContext.Provider value={{ 
      socket: socketRef.current, 
      isConnected, 
      joinProject, 
      leaveProject, 
      connect, 
      disconnect 
    }}>
      {children}
    </SocketContext.Provider>
  )
}

export function useSocket() {
  const context = useContext(SocketContext)
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return context
}
