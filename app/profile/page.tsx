'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Camera, Save, X, Upload } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { userAPI } from '@/lib/api'
import { UpdateProfileData } from '@/types'
import DashboardLayout from '@/components/layout/DashboardLayout'

export default function ProfilePage() {
  const { user, setUser } = useStore()
  const [formData, setFormData] = useState<UpdateProfileData>({
    name: user?.name || '',
  })
  const [avatar, setAvatar] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar || null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name || '' })
      setAvatarPreview(user.avatar || null)
    }
  }, [user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Avatar file size must be less than 5MB')
        return
      }
      
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file')
        return
      }

      setAvatar(file)
      setAvatarPreview(URL.createObjectURL(file))
      setError('')
    }
  }

  const removeAvatar = () => {
    setAvatar(null)
    setAvatarPreview(null)
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const name = formData.name || ''
    if (!name.trim()) {
      setError('Name is required')
      return
    }

    try {
      setLoading(true)
      setError('')
      setSuccess('')

      const updateData: UpdateProfileData = {
        name: name
      }
      
      if (avatar) {
        updateData.avatar = avatar
      }

      const updatedUser = await userAPI.updateProfile(updateData)
      setUser(updatedUser.user)
      setSuccess('Profile updated successfully!')
      
      // Clear avatar state after successful update
      setAvatar(null)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Profile Settings
            </h1>
            <p className="text-gray-600">
              Manage your account information and preferences
            </p>
          </div>

          {/* Profile Form */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <form onSubmit={handleSubmit}>
              {/* Avatar Section */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Profile Picture
                </h3>
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      {avatarPreview ? (
                        <img
                          src={avatarPreview}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-12 h-12 text-gray-400" />
                      )}
                    </div>
                    <label
                      htmlFor="avatar-upload"
                      className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full cursor-pointer transition-colors"
                    >
                      <Camera className="w-4 h-4" />
                    </label>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex space-x-3">
                      <label
                        htmlFor="avatar-upload"
                        className="btn btn-primary flex items-center space-x-2"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Upload New</span>
                      </label>
                      {avatarPreview && (
                        <button
                          type="button"
                          onClick={removeAvatar}
                          className="btn btn-secondary flex items-center space-x-2"
                        >
                          <X className="w-4 h-4" />
                          <span>Remove</span>
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      JPG, PNG or GIF. Max size 5MB.
                    </p>
                  </div>
                </div>
              </div>

              {/* Name Section */}
              <div className="mb-6">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="input w-full"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              {/* Username Section (Read-only) */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={user?.username || ''}
                  className="input w-full bg-gray-50 cursor-not-allowed"
                  disabled
                />
                <p className="text-sm text-gray-500 mt-1">
                  Username cannot be changed
                </p>
              </div>

              {/* Member Since */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Member Since
                </label>
                <input
                  type="text"
                  value={user?.dateJoined ? new Date(user.dateJoined).toLocaleDateString() : 'Unknown'}
                  className="input w-full bg-gray-50 cursor-not-allowed"
                  disabled
                />
              </div>

              {/* Error and Success Messages */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg"
                >
                  <p className="text-red-600 text-sm">{error}</p>
                </motion.div>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg"
                >
                  <p className="text-green-600 text-sm">{success}</p>
                </motion.div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary flex items-center space-x-2"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
