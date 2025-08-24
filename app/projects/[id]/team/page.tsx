'use client'

import { useEffect, useState } from 'react'
import { Users, UserPlus, Crown, Mail } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { projectAPI } from '@/lib/api'
import { Project } from '@/types'

export default function ProjectTeamPage({ params }: { params: { id: string } }) {
  const { user } = useStore()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [newMemberUsername, setNewMemberUsername] = useState('')

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const projectData = await projectAPI.getProject(params.id)
        setProject(projectData)
      } catch (error) {
        console.error('Error fetching project:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [params.id])

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMemberUsername.trim()) return

    try {
      await projectAPI.addMember(params.id, newMemberUsername)
      // Refresh project data
      const projectData = await projectAPI.getProject(params.id)
      setProject(projectData)
      setNewMemberUsername('')
    } catch (error) {
      console.error('Error adding member:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="p-4 sm:p-6">
        <div className="text-center py-8">
          <p className="text-gray-500">Project not found</p>
        </div>
      </div>
    )
  }

  const isOwner = project.owner._id === user?._id

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Project Team</h1>
          <p className="text-gray-600 mt-1">Manage team members and permissions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Team Members */}
        <div className="card p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Users className="w-6 h-6 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Team Members</h2>
          </div>

          <div className="space-y-4">
            {project.members.map((member) => (
              <div
                key={member._id}
                className="flex items-center justify-between p-4 rounded-lg border border-gray-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    {member.avatar ? (
                      <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full" />
                    ) : (
                      <span className="text-gray-600 font-medium">
                        {member.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{member.name}</h3>
                    <p className="text-sm text-gray-500">@{member.username}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {project.owner._id === member._id && (
                    <div className="flex items-center space-x-1 text-yellow-600">
                      <Crown className="w-4 h-4" />
                      <span className="text-xs font-medium">Owner</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Member */}
        {isOwner && (
          <div className="card p-6">
            <div className="flex items-center space-x-3 mb-6">
              <UserPlus className="w-6 h-6 text-green-600" />
              <h2 className="text-lg font-semibold text-gray-900">Add Member</h2>
            </div>

            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={newMemberUsername}
                  onChange={(e) => setNewMemberUsername(e.target.value)}
                  placeholder="Enter username"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                disabled={!newMemberUsername.trim()}
                className="w-full btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Member
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
