'use client'

import { useEffect, useState } from 'react'
import { Settings, Save, Trash2 } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { projectAPI } from '@/lib/api'
import { Project } from '@/types'

export default function ProjectSettingsPage({ params }: { params: { id: string } }) {
  const { user } = useStore()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  })

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const projectData = await projectAPI.getProject(params.id)
        setProject(projectData)
        setFormData({
          name: projectData.name,
          description: projectData.description || ''
        })
      } catch (error) {
        console.error('Error fetching project:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement project update API
    console.log('Update project:', formData)
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return
    }
    // TODO: Implement project deletion API
    console.log('Delete project:', params.id)
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
          <h1 className="text-2xl font-bold text-gray-900">Project Settings</h1>
          <p className="text-gray-600 mt-1">Manage project configuration and preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <div className="card p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Settings className="w-6 h-6 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">General Settings</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Project Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!isOwner}
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!isOwner}
              />
            </div>

            {isOwner && (
              <button
                type="submit"
                className="btn btn-primary flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            )}
          </form>
        </div>

        {/* Project Info */}
        <div className="card p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Settings className="w-6 h-6 text-green-600" />
            <h2 className="text-lg font-semibold text-gray-900">Project Information</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Created By
              </label>
              <p className="text-gray-900">{project.owner.name}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Created At
              </label>
              <p className="text-gray-900">
                {new Date(project.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Team Members
              </label>
              <p className="text-gray-900">{project.members.length} members</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Tasks
              </label>
              <p className="text-gray-900">{project.tasks.length} tasks</p>
            </div>
          </div>

          {/* Danger Zone */}
          {isOwner && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium text-red-600 mb-4">Danger Zone</h3>
              <button
                onClick={handleDelete}
                className="btn btn-danger flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Project</span>
              </button>
              <p className="text-sm text-gray-500 mt-2">
                This action cannot be undone. All project data will be permanently deleted.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
