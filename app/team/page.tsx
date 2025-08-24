'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, UserPlus, Mail, Phone, MapPin, Check, X, Clock, AlertCircle } from 'lucide-react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useStore } from '@/store/useStore'
import { userAPI, invitationAPI } from '@/lib/api'
import { User, Invitation } from '@/types'

export default function TeamPage() {
  const { user } = useStore()
  const [teamMembers, setTeamMembers] = useState<User[]>([])
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [loading, setLoading] = useState(true)
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<User[]>([])
  const [inviting, setInviting] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchTeamData()
  }, [])

  const fetchTeamData = async () => {
    try {
      setLoading(true)
      // For now, we'll use the current user's projects to get team members
      // In a real app, you'd have a dedicated team endpoint
      const [invitationsData] = await Promise.all([
        invitationAPI.getInvitations()
      ])
      
      setInvitations(invitationsData)
      
      // Extract unique team members from invitations and current user
      const allMembers = new Set<string>()
      if (user) allMembers.add(user._id)
      
      invitationsData.forEach(inv => {
        allMembers.add(inv.inviter._id)
        allMembers.add(inv.invitee._id)
      })
      
             // For now, we'll only show the current user as a team member
       // In a real app, you'd fetch actual team members from projects
       if (user) {
         setTeamMembers([user])
       } else {
         setTeamMembers([])
       }
    } catch (err: any) {
      setError('Failed to load team data')
      console.error('Error loading team data:', err)
    } finally {
      setLoading(false)
    }
  }

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
      setError('')
      const results = await userAPI.searchUsers(query)
      
      // Ensure results is an array
      if (!Array.isArray(results)) {
        console.error('Search results is not an array:', results)
        setSearchResults([])
        return
      }
      
      // Filter out current user and existing team members
      const existingMemberIds = teamMembers.map(member => member._id)
      const filteredResults = results.filter(user => 
        user && user._id && 
        !existingMemberIds.includes(user._id) && 
        user._id !== user?._id
      )
      setSearchResults(filteredResults)
    } catch (err: any) {
      setError('Failed to search users')
      console.error('Error searching users:', err)
      setSearchResults([])
    }
  }

  const handleInvite = async (userId: string, username: string) => {
    try {
      setInviting(userId)
      setError('')
      
      // For demo purposes, we'll create a mock invitation
      // In a real app, you'd call invitationAPI.sendInvitation()
      const mockInvitation: Invitation = {
        _id: Date.now().toString(),
        project: {
          _id: 'demo-project',
          name: 'Demo Project',
          description: 'A demo project for testing',
          owner: user!,
          members: [],
          tasks: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        inviter: user!,
        invitee: searchResults.find(u => u._id === userId)!,
        status: 'pending',
        message: `You've been invited to join our team!`,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      setInvitations(prev => [mockInvitation, ...prev])
      setSuccess(`Invitation sent to ${username}`)
      setSearchResults([])
      setSearchQuery('')
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: any) {
      setError('Failed to send invitation')
      console.error('Error sending invitation:', err)
    } finally {
      setInviting(null)
    }
  }

  const handleAcceptInvitation = async (invitationId: string) => {
    try {
      const response = await invitationAPI.acceptInvitation(invitationId)
      setInvitations(prev => prev.filter(inv => inv._id !== invitationId))
      setSuccess('Invitation accepted successfully! You can now access the project.')
      
      // Refresh the page after a short delay to ensure the user can access the project
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } catch (err: any) {
      setError('Failed to accept invitation')
      console.error('Error accepting invitation:', err)
    }
  }

  const handleRejectInvitation = async (invitationId: string) => {
    try {
      await invitationAPI.rejectInvitation(invitationId)
      setInvitations(prev => prev.filter(inv => inv._id !== invitationId))
      setSuccess('Invitation rejected')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: any) {
      setError('Failed to reject invitation')
      console.error('Error rejecting invitation:', err)
    }
  }



  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchUsers(searchQuery)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Team Members
              </h1>
              <p className="text-gray-600">
                Manage your team and collaborate effectively
              </p>
            </div>
                         <button 
               onClick={() => setIsInviteModalOpen(true)}
               className="btn btn-primary flex items-center space-x-2"
             >
               <UserPlus className="w-4 h-4" />
               <span>Invite Member</span>
             </button>
          </div>

          {/* Success/Error Messages */}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg"
            >
              {success}
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg"
            >
              {error}
            </motion.div>
          )}

          {/* Pending Invitations */}
          {invitations.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Pending Invitations</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {invitations.map((invitation) => (
                  <motion.div
                    key={invitation._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-medium text-gray-700">Pending</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(invitation.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="mb-3">
                      <p className="text-sm text-gray-600 mb-2">{invitation.message}</p>
                      <p className="text-sm font-medium text-gray-900">
                        Project: {invitation.project.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        From: {invitation.inviter.name}
                      </p>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAcceptInvitation(invitation._id)}
                        className="flex-1 btn btn-primary btn-sm flex items-center justify-center space-x-1"
                      >
                        <Check className="w-3 h-3" />
                        <span>Accept</span>
                      </button>
                      <button
                        onClick={() => handleRejectInvitation(invitation._id)}
                        className="flex-1 btn btn-secondary btn-sm flex items-center justify-center space-x-1"
                      >
                        <X className="w-3 h-3" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Team Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Members</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {teamMembers.length}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Projects</p>
                                     <p className="text-2xl font-bold text-gray-900">
                     0
                   </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Users className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                                     <p className="text-2xl font-bold text-gray-900">
                     0
                   </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Invites</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {invitations.length}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Team Members Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="card hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  {/* Member Header */}
                  <div className="flex items-center mb-4">
                    {member.avatar ? (
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-12 h-12 rounded-full object-cover mr-4"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center mr-4">
                        <span className="text-white font-semibold">
                          {member.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {member.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        @{member.username}
                      </p>
                    </div>
                  </div>

                  {/* Member Info */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-4 h-4 mr-2" />
                      <span>{member.username}@taskforge.com</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>Remote</span>
                    </div>
                  </div>

                  {/* Member Stats */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                         <div className="text-center">
                       <p className="text-lg font-semibold text-gray-900">
                         0
                       </p>
                       <p className="text-xs text-gray-600">Projects</p>
                     </div>
                     <div className="text-center">
                       <p className="text-lg font-semibold text-gray-900">
                         0
                       </p>
                       <p className="text-xs text-gray-600">Tasks</p>
                     </div>
                    <div className="text-center">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                        Active
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Invite Member Modal */}
        <AnimatePresence>
          {isInviteModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              onClick={() => setIsInviteModalOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Invite Team Member
                    </h2>
                    <button
                      onClick={() => setIsInviteModalOpen(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                                     <div className="mb-4">
                     <label htmlFor="team-user-search" className="block text-sm font-medium text-gray-700 mb-2">
                       Search Users
                     </label>
                     <input
                       type="text"
                       id="team-user-search"
                       name="team-user-search"
                       value={searchQuery}
                       onChange={(e) => setSearchQuery(e.target.value)}
                       placeholder="Search by username (min. 2 characters)..."
                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                     />
                   </div>

                  {searchResults.length > 0 && (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {searchResults.map((user) => (
                        <motion.div
                          key={user._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            {user.avatar ? (
                              <img
                                src={user.avatar}
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
                  )}

                  {searchQuery && searchQuery.trim().length < 2 && (
                    <div className="text-center py-8">
                      <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Please enter at least 2 characters to search</p>
                    </div>
                  )}

                  {searchQuery && searchQuery.trim().length >= 2 && searchResults.length === 0 && (
                    <div className="text-center py-8">
                      <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No users found</p>
                    </div>
                  )}

                  {!searchQuery && (
                    <div className="text-center py-8">
                      <UserPlus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Search for users to invite</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  )
}
