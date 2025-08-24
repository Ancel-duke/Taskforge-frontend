'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Search, UserPlus, User } from 'lucide-react'
import { User as UserType } from '@/types'
import { userAPI, invitationAPI } from '@/lib/api'

interface InviteMemberModalProps {
  projectId: string
  onClose: () => void
  onInvite: () => void
  existingMembers: UserType[]
}

export default function InviteMemberModal({ projectId, onClose, onInvite, existingMembers }: InviteMemberModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<UserType[]>([])
  const [loading, setLoading] = useState(false)
  const [inviting, setInviting] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const existingMemberIds = existingMembers.map(member => member._id)

  const searchUsers = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    // Don't search if query is less than 2 characters
    if (query.trim().length < 2) {
      setSearchResults([])
      return
    }

    try {
      setLoading(true)
      setError('')
      const results = await userAPI.searchUsers(query)
      // Filter out users who are already members
      const filteredResults = results.filter(user => !existingMemberIds.includes(user._id))
      setSearchResults(filteredResults)
    } catch (err: any) {
      setError('Failed to search users')
      console.error('Error searching users:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchUsers(searchQuery)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  const handleInvite = async (userId: string, username: string) => {
    try {
      setInviting(userId)
      setError('')
      setSuccess('')

      await invitationAPI.sendInvitation(projectId, userId, `You've been invited to join our project!`)
      setSuccess(`Successfully invited ${username} to the project!`)
      
      // Remove the user from search results
      setSearchResults(prev => prev.filter(user => user._id !== userId))
      
      // Call the parent callback
      onInvite()
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to invite user')
    } finally {
      setInviting(null)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[80vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Invite Team Member
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Search Input */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by username (min. 2 characters)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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

            {/* Search Results */}
            <div className="max-h-64 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                </div>
              ) : searchQuery && searchQuery.trim().length < 2 ? (
                <div className="text-center py-8">
                  <User className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">
                    Please enter at least 2 characters to search
                  </p>
                </div>
              ) : searchQuery && searchResults.length === 0 ? (
                <div className="text-center py-8">
                  <User className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">
                    No users found matching "{searchQuery}"
                  </p>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="space-y-2">
                  {searchResults.map((user) => (
                    <motion.div
                      key={user._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        {user.avatar ? (
                          <img
                            src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${user.avatar}`}
                            alt={user.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-medium">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">
                            {user.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            @{user.username}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleInvite(user._id, user.username)}
                        disabled={inviting === user._id}
                        className="btn btn-primary btn-sm flex items-center space-x-2"
                      >
                        {inviting === user._id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <UserPlus className="w-4 h-4" />
                        )}
                        <span>{inviting === user._id ? 'Inviting...' : 'Invite'}</span>
                      </button>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <UserPlus className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">
                    Search for users to invite to your project
                  </p>
                </div>
              )}
            </div>

            {/* Existing Members Info */}
            {existingMembers.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Current Team Members ({existingMembers.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {existingMembers.map((member) => (
                    <div
                      key={member._id}
                      className="flex items-center space-x-2 px-3 py-1 bg-gray-100 rounded-full"
                    >
                      {member.avatar ? (
                        <img
                          src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${member.avatar}`}
                          alt={member.name}
                          className="w-5 h-5 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-5 h-5 bg-primary-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-medium">
                            {member.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <span className="text-sm text-gray-700">
                        {member.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
