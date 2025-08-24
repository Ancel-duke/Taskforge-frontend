'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useStore } from '@/store/useStore'
import { projectAPI } from '@/lib/api'
import { Project } from '@/types'
import KanbanBoard from '@/components/kanban/KanbanBoard'

import { useSocket } from '@/components/providers/SocketProvider'
import InviteMemberModal from '@/components/projects/InviteMemberModal'



export default function ProjectPage() {
  const params = useParams()
  const projectId = params.id as string
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  const { setCurrentProject } = useStore()
  const { joinProject, leaveProject } = useSocket()

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const projectData = await projectAPI.getProject(projectId)
        setProject(projectData)
        setCurrentProject(projectData)
        joinProject(projectId)
      } catch (err: any) {
        console.error('Project loading error:', err)
        const errorMessage = err.response?.data?.message || 'Failed to load project'
        const debugInfo = err.response?.data ? `\n\nDebug Info: ${JSON.stringify(err.response.data, null, 2)}` : ''
        setError(errorMessage + debugInfo)
      } finally {
        setLoading(false)
      }
    }

    if (projectId) {
      fetchProject()
    }

    return () => {
      leaveProject(projectId)
    }
  }, [projectId, setCurrentProject])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center max-w-md mx-auto p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Project
          </h2>
          <p className="text-gray-600 mb-4 whitespace-pre-wrap text-sm">{error}</p>
          <div className="space-y-2">
            <button 
              onClick={() => window.location.reload()} 
              className="btn btn-primary w-full"
            >
              Try Again
            </button>
            <Link href="/projects" className="btn btn-secondary block">
              Back to Projects
            </Link>
            <Link href="/dashboard" className="btn btn-secondary block">
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Project Not Found
          </h2>
          <p className="text-gray-600">
            The project you're looking for doesn't exist or you don't have access to it.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col">
      <KanbanBoard 
        project={project} 
        onInviteMember={() => setIsInviteModalOpen(true)}
      />
      
      {/* Invite Member Modal */}
      {isInviteModalOpen && (
        <InviteMemberModal
          projectId={project._id}
          existingMembers={project.members || []}
          onClose={() => setIsInviteModalOpen(false)}
          onInvite={() => {
            // Refresh project data to get updated members
            const refreshProject = async () => {
              try {
                const updatedProject = await projectAPI.getProject(projectId)
                setProject(updatedProject)
              } catch (err) {
                console.error('Error refreshing project:', err)
              }
            }
            refreshProject()
          }}
        />
      )}
    </div>
  )
}
